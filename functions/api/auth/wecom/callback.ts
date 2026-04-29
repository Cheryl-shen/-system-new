/**
 * GET /api/auth/wecom/callback?code=xxx&state=yyy
 * 企业微信扫码登录回调：
 *   1. 校验 state（防 CSRF）
 *   2. code 换 userid
 *   3. 获取用户详情（含部门信息）
 *   4. 校验组织架构权限
 *   5. 生成站内 JWT
 *   6. 302 回 /login?wecom_token=xxx&wecom_user=base64 让前端完成落地
 *
 * 前端 Login.vue 会识别 query 上的 wecom_token/wecom_user，落盘到 auth store。
 */

import {
  loadWecomConfig,
  buildRedirectUri,
  consumeState,
  exchangeCodeForUser,
  fetchUserInfo,
  checkDepartmentAccess,
  checkUserAccess
} from '../../../_lib/wecom';
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

  // 用户取消授权
  const wwErrorCode = url.searchParams.get('errcode');
  if (wwErrorCode && wwErrorCode !== '0') {
    return redirectToLogin(
      url.origin,
      '/',
      `企业微信授权被拒绝：错误码 ${wwErrorCode}`
    );
  }

  if (!code || !state) {
    return redirectToLogin(url.origin, '/', '企业微信回调缺少 code/state');
  }

  const cfg = loadWecomConfig(env);
  if (!cfg) {
    return redirectToLogin(
      url.origin,
      '/',
      '企业微信未配置，请联系管理员设置环境变量'
    );
  }

  // 1. 校验 state
  const stateInfo = await consumeState(env.REPORTS_KV, state);
  if (!stateInfo) {
    return redirectToLogin(
      url.origin,
      '/',
      '企业微信登录 state 已过期或无效，请重试'
    );
  }

  try {
    // 2. code -> userid
    const userid = await exchangeCodeForUser(cfg, code);

    // 3. 获取用户详情（含部门）
    const userInfo = await fetchUserInfo(cfg, userid);

    // 4. 校验组织架构权限
    const deptCheck = checkDepartmentAccess(userInfo, cfg.allowedDepartments);
    if (!deptCheck.ok) {
      return redirectToLogin(
        url.origin,
        stateInfo.redirectAfter,
        deptCheck.reason || '无权限访问本平台'
      );
    }

    // 5. 校验用户白名单（如果配置了）
    const userCheck = checkUserAccess(userid, cfg.allowedUsers);
    if (!userCheck.ok) {
      return redirectToLogin(
        url.origin,
        stateInfo.redirectAfter,
        userCheck.reason || '无权限访问本平台'
      );
    }

    // 5. 签发站内 JWT
    //    企业微信用户统一给 admin 权限（可按需调整为 manager）
    const role = 'admin' as const;
    const customerIds: string[] = [];
    const displayName = userInfo.name || userid;

    const token = await signToken(
      {
        sub: userid,
        role,
        customerIds,
        displayName
      },
      env.JWT_SECRET
    );

    // 6. 回到前端，通过 URL 参数传递 token
    //    敏感数据放 hash，不进日志、不进 referer
    const userJson = JSON.stringify({
      username: userid,
      displayName,
      role,
      customerIds
    });
    const userB64 = base64UrlEncode(userJson);

    const target = new URL(url.origin + '/login');
    target.searchParams.set('wecom', '1');
    target.searchParams.set('next', stateInfo.redirectAfter || '/');
    const hash = `#wecom_token=${encodeURIComponent(
      token
    )}&wecom_user=${encodeURIComponent(userB64)}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: target.toString() + hash,
        'Cache-Control': 'no-store'
      }
    });
  } catch (e: any) {
    const msg =
      e instanceof Error ? e.message : '企业微信登录失败';
    return redirectToLogin(url.origin, stateInfo.redirectAfter, msg);
  }
}

function redirectToLogin(
  origin: string,
  next: string,
  errorMsg: string
): Response {
  const loginUrl = new URL(origin + '/login');
  loginUrl.searchParams.set('wecom_error', errorMsg);
  if (next && next !== '/') loginUrl.searchParams.set('next', next);
  return new Response(null, {
    status: 302,
    headers: {
      Location: loginUrl.toString(),
      'Cache-Control': 'no-store'
    }
  });
}

/** URL-safe base64 */
function base64UrlEncode(str: string): string {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
