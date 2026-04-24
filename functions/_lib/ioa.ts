/**
 * IOA OAuth2 集成
 *
 * 设计说明
 * - 所有端点、client_id/secret 全部走环境变量，代码里只留默认占位（腾讯内部 IOA 开放平台常见路径）。
 * - 默认启用 OIDC 风格（code -> token -> userinfo）。
 * - 用户唯一标识优先级：rtx > LoginName > username > sub > preferred_username > email。
 * - redirect_uri 从请求动态推断（支持正式域名 + 预览域名），不写死。
 *
 * 必需的环境变量（在 EdgeOne Pages 控制台 -> 环境变量 里配置）：
 *   IOA_CLIENT_ID           必填
 *   IOA_CLIENT_SECRET       必填
 *   IOA_AUTHORIZE_URL       可选，默认 https://iam.ioa.com/oauth2/authorize
 *   IOA_TOKEN_URL           可选，默认 https://iam.ioa.com/oauth2/token
 *   IOA_USERINFO_URL        可选，默认 https://iam.ioa.com/oauth2/userinfo
 *   IOA_SCOPE               可选，默认 openid profile
 *   IOA_REDIRECT_URI        可选，显式覆盖回调地址（未配置时动态推断）
 */

import { KEYS } from './kv';
import type { EdgeEnv, KVNamespace } from './kv';

export interface IoaConfig {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  userinfoUrl: string;
  scope: string;
  explicitRedirectUri?: string;
}

/** 读取并校验 IOA 环境变量，缺关键项则返回 null */
export function loadIoaConfig(env: EdgeEnv & Record<string, any>): IoaConfig | null {
  const clientId = env.IOA_CLIENT_ID;
  const clientSecret = env.IOA_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    authorizeUrl: env.IOA_AUTHORIZE_URL || 'https://iam.ioa.com/oauth2/authorize',
    tokenUrl: env.IOA_TOKEN_URL || 'https://iam.ioa.com/oauth2/token',
    userinfoUrl: env.IOA_USERINFO_URL || 'https://iam.ioa.com/oauth2/userinfo',
    scope: env.IOA_SCOPE || 'openid profile',
    explicitRedirectUri: env.IOA_REDIRECT_URI || undefined
  };
}

/** 从请求推断回调 URL（若环境变量显式配置则优先用它） */
export function buildRedirectUri(request: Request, cfg: IoaConfig): string {
  if (cfg.explicitRedirectUri) return cfg.explicitRedirectUri;
  const url = new URL(request.url);
  // EdgeOne/Cloudflare 场景下 host 即外网域名，request.url 已是完整外网 URL
  return `${url.origin}/api/auth/ioa/callback`;
}

/** 生成随机 state，防 CSRF */
export function randomState(bytes = 24): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const STATE_TTL = 600; // 10 分钟，足够用户在 IOA 页面完成授权
const STATE_PREFIX = 'ioa:state:';

/** state 短期存储：写 KV，10min 过期 */
export async function saveState(
  kv: KVNamespace,
  state: string,
  redirectAfter: string
): Promise<void> {
  await kv.put(
    `${STATE_PREFIX}${state}`,
    JSON.stringify({ redirectAfter, t: Date.now() }),
    { expirationTtl: STATE_TTL }
  );
}

export async function consumeState(
  kv: KVNamespace,
  state: string
): Promise<{ redirectAfter: string } | null> {
  const key = `${STATE_PREFIX}${state}`;
  const raw = await kv.get(key, { type: 'text' });
  if (!raw) return null;
  try {
    await kv.delete(key); // 一次性使用
    return JSON.parse(raw as string);
  } catch {
    return null;
  }
}

export interface IoaTokenResponse {
  access_token: string;
  token_type?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
}

/** code 换 token */
export async function exchangeCodeForToken(
  cfg: IoaConfig,
  code: string,
  redirectUri: string
): Promise<IoaTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret
  });
  const resp = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      // 同时带上 Basic Auth，兼容某些 IOA 场景只认 Basic 认证
      Authorization:
        'Basic ' + btoa(`${cfg.clientId}:${cfg.clientSecret}`)
    },
    body: body.toString()
  });
  if (!resp.ok) {
    const text = await safeText(resp);
    throw new IoaError(
      `IOA token 接口返回 ${resp.status}: ${text.slice(0, 300)}`
    );
  }
  const json = (await resp.json()) as IoaTokenResponse;
  if (!json.access_token) {
    throw new IoaError('IOA token 接口未返回 access_token');
  }
  return json;
}

export interface IoaUserInfo {
  rtx?: string;
  LoginName?: string;
  loginname?: string;
  username?: string;
  preferred_username?: string;
  sub?: string;
  email?: string;
  name?: string;
  ChineseName?: string;
  display_name?: string;
  [k: string]: unknown;
}

/** access_token 换 userinfo */
export async function fetchUserInfo(
  cfg: IoaConfig,
  accessToken: string
): Promise<IoaUserInfo> {
  const resp = await fetch(cfg.userinfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!resp.ok) {
    const text = await safeText(resp);
    throw new IoaError(
      `IOA userinfo 接口返回 ${resp.status}: ${text.slice(0, 300)}`
    );
  }
  return (await resp.json()) as IoaUserInfo;
}

/** 从 userinfo 里提取英文名作为站内 username（rtx / LoginName 等） */
export function pickUsername(info: IoaUserInfo): string | null {
  const candidates = [
    info.rtx,
    info.LoginName,
    info.loginname,
    info.username,
    info.preferred_username,
    info.sub,
    info.email ? String(info.email).split('@')[0] : undefined
  ];
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

/** 从 userinfo 里提取中文/展示名 */
export function pickDisplayName(info: IoaUserInfo, fallback: string): string {
  const candidates = [info.ChineseName, info.name, info.display_name];
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return fallback;
}

export class IoaError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'IoaError';
  }
}

async function safeText(resp: Response): Promise<string> {
  try {
    return await resp.text();
  } catch {
    return '';
  }
}

/** KEYS 中没有 ioa state，这里单独暴露一个帮助符号避免散乱 */
export const IOA_KEYS = {
  state: (s: string) => `${STATE_PREFIX}${s}`
};

// 让 KEYS 不至于只有这一块被跳过 lint
void KEYS;
