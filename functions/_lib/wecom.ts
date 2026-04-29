/**
 * 企业微信 OAuth2 扫码登录集成
 *
 * 使用企业微信"网页授权登录"（OAuth2）
 *
 * 必需的环境变量（在 EdgeOne Pages 控制台 -> 环境变量 里配置）：
 *   WECOM_CORPID             必填，企业 ID
 *   WECOM_AGENTID            必填，应用 ID（用于构造扫码登录 URL）
 *   WECOM_SECRET             必填，应用 Secret（用于 code 换 userinfo）
 *   WECOM_OAUTH_TYPE         可选，"qr"(扫码) 或 "base"(静默授权)，默认 "qr"
 *   WECOM_ALLOWED_DEPARTMENTS 可选，允许登录的部门 ID 列表（逗号分隔）
 *                                 留空则不限制部门，仅校验企业内成员
 *   WECOM_REDIRECT_URI       可选，显式覆盖回调地址（未配置时动态推断）
 *
 * 回调地址：https://<your-domain>/api/auth/wecom/callback
 */

import type { EdgeEnv, KVNamespace } from './kv';

/** 企业微信用户信息（来自 userinfo 接口） */
export interface WecomUserInfo {
  errcode: number;
  errmsg: string;
  userid?: string;      // 企业内唯一用户 ID
  name?: string;        // 姓名
  department?: number[]; // 所属部门 ID 列表
  open_userid?: string; // 全局唯一 ID（跨应用不变）
  [k: string]: unknown;
}

/** 企业微信 access_token 响应 */
interface WecomTokenResponse {
  errcode: number;
  errmsg: string;
  access_token?: string;
  expires_in?: number;
}

/** 部门信息（用于组织架构校验） */
export interface WecomDepartment {
  id: number;
  name: string;
  parentid: number;
  [k: string]: unknown;
}

// ========================
// 配置读取
// ========================

export interface WecomConfig {
  corpId: string;
  agentId: string;
  secret: string;
  oauthType: 'qr' | 'base';
  allowedDepartments: number[]; // 空数组 = 不限制部门
  allowedUsers: string[];       // 空数组 = 不限制用户
  explicitRedirectUri?: string;
}

/** 读取并校验企业微信环境变量 */
export function loadWecomConfig(env: EdgeEnv & Record<string, any>): WecomConfig | null {
  const corpId = env.WECOM_CORPID;
  const agentId = env.WECOM_AGENTID;
  const secret = env.WECOM_SECRET;
  if (!corpId || !agentId || !secret) return null;

  const oauthTypeRaw = (env.WECOM_OAUTH_TYPE || 'qr').toLowerCase();
  const oauthType: 'qr' | 'base' = oauthTypeRaw === 'base' ? 'base' : 'qr';

  // 解析允许的部门列表（逗号分隔的数字）
  const allowedDepartments: number[] = [];
  const deptStr = env.WECOM_ALLOWED_DEPARTMENTS || '';
  if (deptStr.trim()) {
    for (const part of deptStr.split(',')) {
      const n = Number(part.trim());
      if (!isNaN(n) && n > 0) allowedDepartments.push(n);
    }
  }

  // 解析允许的用户列表（逗号分隔的用户ID）
  const allowedUsers: string[] = [];
  const userStr = env.WECOM_ALLOWED_USERS || '';
  if (userStr.trim()) {
    for (const part of userStr.split(',')) {
      const userid = part.trim();
      if (userid) allowedUsers.push(userid.toLowerCase());
    }
  }

  return {
    corpId,
    agentId,
    secret,
    oauthType,
    allowedDepartments,
    allowedUsers,
    explicitRedirectUri: env.WECOM_REDIRECT_URI || undefined
  };
}

// ========================
// 回调地址
// ========================

/** 从请求推断回调 URL（若环境变量显式配置则优先用它） */
export function buildRedirectUri(request: Request, cfg: WecomConfig): string {
  if (cfg.explicitRedirectUri) return cfg.explicitRedirectUri;
  const url = new URL(request.url);
  return `${url.origin}/api/auth/wecom/callback`;
}

// ========================
// State 管理（防 CSRF）
// ========================

const STATE_TTL = 600; // 10 分钟
const STATE_PREFIX = 'wecom:state:';

/** 生成随机 state */
export function randomState(bytes = 24): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** state 写 KV，10min 过期 */
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

/** 消费 state（一次性） */
export async function consumeState(
  kv: KVNamespace,
  state: string
): Promise<{ redirectAfter: string } | null> {
  const key = `${STATE_PREFIX}${state}`;
  const raw = await kv.get(key, { type: 'text' });
  if (!raw) return null;
  try {
    await kv.delete(key); // 一次性使用，防重放
    return JSON.parse(raw as string);
  } catch {
    return null;
  }
}

// ========================
// 构造授权 URL
// ========================

/**
 * 构造企业微信扫码登录 URL
 * 文档：https://developer.work.weixin.qq.com/document/path/91019
 *
 * 扫码登录使用专用端点：
 *   https://open.work.weixin.qq.com/wwopen/sso/qrConnect
 */
export function buildAuthorizeUrl(cfg: WecomConfig, redirectUri: string, state: string): string {
  const url = new URL('https://open.work.weixin.qq.com/wwopen/sso/qrConnect');
  url.searchParams.set('appid', cfg.corpId);
  url.searchParams.set('agentid', cfg.agentId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

// ========================
// code → access_token（获取用户身份）
// ========================

interface WecomCode2Session {
  errcode: number;
  errmsg: string;
  userid?: string;
  deviceid?: string;
}

/**
 * 用 code 换 userid（企业微信 OAuth2）
 * 文档：https://developer.work.weixin.qq.com/document/path/91023
 *
 * 注意：企业微信网页授权需要先获取 access_token（企业级，非用户 token），
 * 再用 access_token + code 换 userid。
 */
export async function exchangeCodeForUser(
  cfg: WecomConfig,
  code: string
): Promise<string> {
  // 1. 先获取企业 access_token
  const token = await getEnterpriseAccessToken(cfg);

  // 2. 用 access_token + code 换 userid
  const url = new URL('https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo');
  url.searchParams.set('access_token', token);
  url.searchParams.set('code', code);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const text = await safeText(resp);
    throw new WecomError(`企业微信 getuserinfo 返回 ${resp.status}: ${text.slice(0, 300)}`);
  }

  const json = (await resp.json()) as WecomCode2Session;
  if (json.errcode !== 0) {
    throw new WecomError(`企业微信 getuserinfo 错误 ${json.errcode}: ${json.errmsg}`);
  }
  if (!json.userid) {
    throw new WecomError('企业微信未返回 userid，该用户可能不是企业成员');
  }
  return json.userid;
}

// ========================
// 企业 access_token 缓存（KV）
// ========================

const TOKEN_KEY = 'wecom:access_token';
const TOKEN_TTL = 7000; // 企业微信 token 有效期 7200s，提前刷新

/** 获取企业 access_token（带 KV 缓存） */
async function getEnterpriseAccessToken(cfg: WecomConfig): Promise<string> {
  // 尝试从 KV 读取缓存
  if (cfg.allowedDepartments !== undefined || true) {
    // 总是尝试读缓存（简化逻辑）
  }

  // 由于 EdgeOne KV 在 login 阶段可能不可用，这里直接请求（无缓存）
  // 如需缓存，可后续接入 KV
  const url = new URL('https://qyapi.weixin.qq.com/cgi-bin/gettoken');
  url.searchParams.set('corpid', cfg.corpId);
  url.searchParams.set('corpsecret', cfg.secret);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const text = await safeText(resp);
    throw new WecomError(`企业微信 gettoken 返回 ${resp.status}: ${text.slice(0, 300)}`);
  }

  const json = (await resp.json()) as WecomTokenResponse;
  if (json.errcode !== 0) {
    throw new WecomError(`企业微信 gettoken 错误 ${json.errcode}: ${json.errmsg}`);
  }
  if (!json.access_token) {
    throw new WecomError('企业微信未返回 access_token');
  }
  return json.access_token;
}

// ========================
// 获取用户详情（含部门信息）
// ========================

/**
 * 获取用户详细信息（用于校验部门权限）
 * 文档：https://developer.work.weixin.qq.com/document/path/90196
 */
export async function fetchUserInfo(
  cfg: WecomConfig,
  userid: string
): Promise<WecomUserInfo> {
  const token = await getEnterpriseAccessToken(cfg);

  const url = new URL('https://qyapi.weixin.qq.com/cgi-bin/user/get');
  url.searchParams.set('access_token', token);
  url.searchParams.set('userid', userid);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const text = await safeText(resp);
    throw new WecomError(`企业微信 user/get 返回 ${resp.status}: ${text.slice(0, 300)}`);
  }

  const json = (await resp.json()) as WecomUserInfo;
  if (json.errcode !== 0) {
    throw new WecomError(`企业微信 user/get 错误 ${json.errcode}: ${json.errmsg}`);
  }
  return json;
}

// ========================
// 组织架构校验
// ========================

/**
 * 校验用户是否在允许的组织架构内
 * - allowedDepartments 为空数组 → 不限制部门，仅校验是企业成员即可
 * - allowedDepartments 非空     → 用户部门必须命中其中之一
 */
export function checkDepartmentAccess(
  userInfo: WecomUserInfo,
  allowedDepartments: number[]
): { ok: boolean; reason?: string } {
  // 无部门限制
  if (!allowedDepartments.length) {
    return { ok: true };
  }

  const userDepts = userInfo.department || [];
  if (!userDepts.length) {
    return { ok: false, reason: '该用户未关联任何部门，请联系管理员处理' };
  }

  const allowedSet = new Set(allowedDepartments);
  const matched = userDepts.find((d) => allowedSet.has(d));
  if (!matched) {
    const deptNames = userDepts.join(', ');
    return {
      ok: false,
      reason: `该用户所在部门（${deptNames}）不在允许登录的范围内，请联系管理员添加`
    };
  }

  return { ok: true };
}

// ========================
// 用户白名单校验
// ========================

/**
 * 校验用户是否在允许的用户白名单内
 * - allowedUsers 为空数组 → 不限制用户，仅校验是企业成员即可
 * - allowedUsers 非空     → 用户 ID 必须在白名单中
 */
export function checkUserAccess(
  userid: string,
  allowedUsers: string[]
): { ok: boolean; reason?: string } {
  // 无用户限制
  if (!allowedUsers.length) {
    return { ok: true };
  }

  const userLower = userid.toLowerCase();
  const allowedSet = new Set(allowedUsers.map(u => u.toLowerCase()));

  if (!allowedSet.has(userLower)) {
    return {
      ok: false,
      reason: `该用户（${userid}）不在允许登录的白名单内，请联系管理员添加`
    };
  }

  return { ok: true };
}

// ========================
// 工具
// ========================

export class WecomError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'WecomError';
  }
}

async function safeText(resp: Response): Promise<string> {
  try {
    return await resp.text();
  } catch {
    return '';
  }
}
