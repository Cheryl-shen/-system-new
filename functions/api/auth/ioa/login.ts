/**
 * GET /api/auth/ioa/login?redirect=/target
 * 生成 state -> 存 KV -> 302 跳转到 IOA authorize 页面。
 */

import {
  loadIoaConfig,
  buildRedirectUri,
  randomState,
  saveState
} from '../../../_lib/ioa';
import { errors } from '../../../_lib/response';
import type { EdgeEnv } from '../../../_lib/kv';

export async function onRequestGet(context: {
  request: Request;
  env: EdgeEnv & Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;
  const cfg = loadIoaConfig(env);
  if (!cfg) {
    return errors.serverError(
      'IOA 登录未配置：请在环境变量里设置 IOA_CLIENT_ID / IOA_CLIENT_SECRET'
    );
  }

  const url = new URL(request.url);
  const rawRedirect = url.searchParams.get('redirect') || '/';
  // 只允许站内相对路径，避免开放重定向
  const redirectAfter = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
    ? rawRedirect
    : '/';

  const state = randomState();
  await saveState(env.REPORTS_KV, state, redirectAfter);

  const redirectUri = buildRedirectUri(request, cfg);

  const authorizeUrl = new URL(cfg.authorizeUrl);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('client_id', cfg.clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', cfg.scope);
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Cache-Control': 'no-store'
    }
  });
}
