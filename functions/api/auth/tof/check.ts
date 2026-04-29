/**
 * GET /api/auth/tof/check
 * 检查当前请求是否已通过 TOF 认证
 * 
 * 用于前端判断是否需要跳转到登录页
 * 如果已认证，返回完整用户信息
 */

import { ok, errors } from '../../../_lib/response';
import { getTofUser, loadTofConfig, checkTofUserAccess } from '../../../_lib/tof';

export async function onRequestGet(context: {
  request: Request;
  env: Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;
  
  const config = loadTofConfig(env);
  
  if (!config.enabled) {
    return ok({
      authenticated: false,
      message: 'TOF 未启用'
    });
  }
  
  const user = await getTofUser(request, config);
  
  if (!user) {
    return ok({
      authenticated: false,
      message: '未通过 TOF 认证，请通过内网访问'
    });
  }
  
  // 检查用户白名单
  const accessCheck = checkTofUserAccess(user.staffName, config.allowedUsers);
  if (!accessCheck.ok) {
    return errors.forbidden(accessCheck.reason || '无权限访问');
  }
  
  return ok({
    authenticated: true,
    user: {
      loginName: user.staffName,
      staffId: user.staffId,
      displayName: user.displayName,
      chineseName: user.identityPayload?.ChineseName || ''
    },
    message: '已通过 TOF 认证'
  });
}
