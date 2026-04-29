/**
 * POST /api/auth/logout
 * 登出，清除登录会话
 */

import { ok } from '../../_lib/response';
import { loadTofConfig, getTofUser, clearLoginSession } from '../../_lib/tof';
import type { EdgeEnv } from '../../_lib/kv';

export async function onRequestPost(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;
  const config = loadTofConfig(env);
  
  if (config.enabled) {
    const user = await getTofUser(request, config);
    if (user) {
      await clearLoginSession(env, user.staffName);
    }
  }
  
  return ok({ success: true, message: '已登出' });
}
