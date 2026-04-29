/**
 * POST /api/auth/confirm
 * 确认登录
 * 
 * 在太湖鉴权通过后，需要用户手动确认才能创建有效会话
 */

import { ok, errors } from '../../_lib/response';
import { loadTofConfig, getTofUser, createLoginSession, hasValidSession } from '../../_lib/tof';
import { getOrCreateUser } from '../../_lib/users';
import type { EdgeEnv } from '../../_lib/kv';

export async function onRequestPost(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;
  const config = loadTofConfig(env);
  
  if (!config.enabled) {
    return errors.forbidden('TOF 未启用');
  }
  
  // 获取 TOF 用户信息
  const user = await getTofUser(request, config);
  
  if (!user) {
    return errors.unauthorized('未检测到用户身份，请通过企业微信内网访问');
  }
  
  // 获取客户端信息
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // 如果已有有效会话，直接返回成功
  if (await hasValidSession(env, user.staffName)) {
    const dbUser = await getOrCreateUser(env, user);
    return ok({
      success: true,
      message: '已确认登录',
      user: {
        username: dbUser.username,
        displayName: dbUser.displayName,
        role: dbUser.role,
        customerIds: dbUser.customerIds
      }
    });
  }
  
  // 创建用户记录（如不存在）
  const dbUser = await getOrCreateUser(env, user);
  
  // 检查用户是否被禁用
  if (dbUser.status === 'disabled') {
    return errors.forbidden('您的账号已被管理员禁用，请联系管理员');
  }
  
  // 创建登录会话
  await createLoginSession(env, user, ipAddress, userAgent);
  
  return ok({
    success: true,
    message: '登录确认成功',
    user: {
      username: dbUser.username,
      displayName: dbUser.displayName,
      role: dbUser.role,
      customerIds: dbUser.customerIds
    }
  });
}
