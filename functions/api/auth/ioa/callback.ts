/**
 * GET /api/auth/ioa/callback?code=xxx&state=yyy
 * IOA 授权回调：
 *   1. 校验 state（防 CSRF）
 *   2. code 换 access_token
 *   3. access_token 换 userinfo
 *   4. 取出 rtx/LoginName 作为 username
 *   5. 生成站内 JWT
 *   6. 302 回 /login?ioa_token=xxx&ioa_user=base64 让前端完成落地
 *
 * 注：
 *   - 用户选择 "方案C：IOA 员工均可看全部客户"，所以登录成功后站内一律给 role=admin、customerIds=[]，
 *     不再去 KV 白名单里查，避免首次使用就卡登录。
 *   - 前端 Login.vue 会识别 query 上的 ioa_token/ioa_user，落盘到 auth store 再 replace 到目标页。
 */

import {
  loadIoaConfig,
  buildRedirectUri,
  consumeState,
  exchangeCodeForToken,
  fetchUserInfo,
  pickUsername,
  pickDisplayName,
  IoaError
} from '../../../_lib/ioa';
import { signToken } from '../../../_lib/auth';
import type { EdgeEnv } from '../../../_lib/kv';

export async function onRequestGet(context: {
  request: Request;
  env: EdgeEnv & Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const iamError = url.searchParams.get('error');

  if (iamError) {
    return redirectToLogin(
      url.origin,
      '/',
      `IOA 授权被拒绝：${iamError}`
    );
  }
  if (!code || !state) {
    return redirectToLogin(url.origin, '/', 'IOA 回调缺少 code/state');
  }

  const cfg = loadIoaConfig(env);
  if (!cfg) {
    return redirectToLogin(
      url.origin,
      '/',
      'IOA 未配置，请联系管理员设置环境变量'
    );
  }

  // 1. 校验 state
  const stateInfo = await consumeState(env.REPORTS_KV, state);
  if (!stateInfo) {
    return redirectToLogin(
      url.origin,
      '/',
      'IOA 登录 state 已过期或无效，请重试'
    );
  }

  const redirectUri = buildRedirectUri(request, cfg);

  try {
    // 2. code -> token
    const tokenResp = await exchangeCodeForToken(cfg, code, redirectUri);

    // 3. token -> userinfo
    const info = await fetchUserInfo(cfg, tokenResp.access_token);

    // 4. 取 username / displayName
    const username = pickUsername(info);
    if (!username) {
      return redirectToLogin(
        url.origin,
        stateInfo.redirectAfter,
        'IOA 返回的用户信息中缺少用户名（rtx/LoginName）'
      );
    }
    const displayName = pickDisplayName(info, username);

    // 5. 签发站内 JWT
    //    方案C：不做白名单，IOA 员工一律给 admin，customerIds 为空（admin 全通）
    const role = 'admin' as const;
    const customerIds: string[] = [];
    const token = await signToken(
      {
        sub: username,
        role,
        customerIds,
        displayName
      },
      env.JWT_SECRET
    );

    // 6. 回到前端，通过 hash 传递 token，避免被中间日志系统记录
    //    前端 Login.vue 识别后会立即清理 hash。
    const userJson = JSON.stringify({
      username,
      displayName,
      role,
      customerIds
    });
    const userB64 = base64UrlEncode(userJson);

    const target = new URL(url.origin + '/login');
    target.searchParams.set('ioa', '1');
    target.searchParams.set('next', stateInfo.redirectAfter || '/');
    // 敏感数据放 hash，不进日志、不进 referer
    const hash = `#ioa_token=${encodeURIComponent(
      token
    )}&ioa_user=${encodeURIComponent(userB64)}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: target.toString() + hash,
        'Cache-Control': 'no-store'
      }
    });
  } catch (e) {
    const msg =
      e instanceof IoaError
        ? e.message
        : e instanceof Error
        ? e.message
        : 'IOA 登录失败';
    return redirectToLogin(url.origin, stateInfo.redirectAfter, msg);
  }
}

function redirectToLogin(
  origin: string,
  next: string,
  errorMsg: string
): Response {
  const loginUrl = new URL(origin + '/login');
  loginUrl.searchParams.set('ioa_error', errorMsg);
  if (next && next !== '/') loginUrl.searchParams.set('next', next);
  return new Response(null, {
    status: 302,
    headers: {
      Location: loginUrl.toString(),
      'Cache-Control': 'no-store'
    }
  });
}

/** URL-safe base64，避免 +/= 引起 URL 转义问题 */
function base64UrlEncode(str: string): string {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
