/**
 * GET /api/auth/me
 * 返回当前登录用户信息。
 * 
 * 支持两种认证模式：
 * 1. TOF 模式：通过 NGate 网关，从 Header 读取用户信息
 * 2. JWT 模式：从 Authorization Header 读取 Token
 */

import { ok, errors } from '../../_lib/response';
import { requireUnifiedAuth, getUsername, getDisplayName } from '../../_lib/auth-unified';
import type { EdgeEnv } from '../../_lib/kv';

export async function onRequestGet(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;

  try {
    const authContext = await requireUnifiedAuth(request, env);
    const user = authContext.user;
    const username = getUsername(user);
    const displayName = getDisplayName(user);

    // 如果是 JWT 用户，获取更多信息
    let role: string = 'manager';
    let customerIds: string[] = [];
    
    if ('role' in user) {
      role = user.role;
      customerIds = user.customerIds || [];
    }

    return ok({
      username,
      displayName,
      role,
      customerIds,
      authMode: authContext.mode
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return errors.unauthorized('未登录');
  }
}
