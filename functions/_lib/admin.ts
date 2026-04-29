/**
 * 管理员权限中间件
 * 
 * 检查当前用户是否为管理员
 */

import { getOrCreateUser } from './users';
import { loadTofConfig, getTofUser, hasValidSession } from './tof';
import { errors } from './response';
import type { EdgeEnv } from './kv';
import type { UserRecord } from './users';

export interface AuthContext {
  user: UserRecord;
  tofUser: Awaited<ReturnType<typeof getTofUser>>;
}

/**
 * 验证当前请求是否有有效会话
 */
export async function verifySession(
  request: Request,
  env: EdgeEnv
): Promise<AuthContext | null> {
  const config = loadTofConfig(env);
  
  // TOF 未启用时，跳过验证
  if (!config.enabled) {
    return null;
  }
  
  // 获取 TOF 用户
  const tofUser = await getTofUser(request, config);
  if (!tofUser) {
    return null;
  }
  
  // 检查会话是否有效
  const sessionValid = await hasValidSession(env, tofUser.staffName);
  if (!sessionValid) {
    return null;
  }
  
  // 获取用户信息
  const user = await getOrCreateUser(env, tofUser);
  
  return { user, tofUser };
}

/**
 * 要求管理员权限
 */
export function requireAdmin(authContext: AuthContext | null): UserRecord {
  if (!authContext) {
    throw errors.unauthorized('请先登录并确认');
  }
  
  if (authContext.user.role !== 'admin') {
    throw errors.forbidden('仅管理员可操作');
  }
  
  return authContext.user;
}
