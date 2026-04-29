/**
 * GET /api/auth/wecom/login?redirect=/target
 * 生成 state -> 存 KV -> 302 跳转到企业微信扫码登录页面。
 */

import {
  loadWecomConfig,
  buildRedirectUri,
  randomState,
  saveState,
  buildAuthorizeUrl
} from '../../../_lib/wecom';
import { errors } from '../../../_lib/response';
import type { EdgeEnv } from '../../../_lib/kv';

export async function onRequestGet(context: {
  request: Request;
  env: EdgeEnv & Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;

  const cfg = loadWecomConfig(env);
  if (!cfg) {
    return errors.serverError(
      '企业微信登录未配置：请在环境变量里设置 WECOM_CORPID / WECOM_AGENTID / WECOM_SECRET'
    );
  }

  // 确保 REPORTS_KV 可用（state 需要存储）
  if (!env.REPORTS_KV) {
    return errors.serverError(
      '企业微信登录需要 KV 存储支持：请绑定 REPORTS_KV 命名空间'
    );
  }

  const url = new URL(request.url);
  const rawRedirect = url.searchParams.get('redirect') || '/';
  const redirectAfter = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
    ? rawRedirect
    : '/';

  const state = randomState();
  await saveState(env.REPORTS_KV, state, redirectAfter);

  const redirectUri = buildRedirectUri(request, cfg);
  const authorizeUrl = buildAuthorizeUrl(cfg, redirectUri, state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Cache-Control': 'no-store'
    }
  });
}
