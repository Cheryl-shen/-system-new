/**
 * GET /api/auth/check
 * 检查当前用户的认证状态和登录确认状态
 * 
 * 用于前端判断：
 * 1. 是否已通过 TOF 认证
 * 2. 是否需要显示登录确认页面
 */

import { ok } from '../../_lib/response';
import { loadTofConfig } from '../../_lib/tof';
import { getTofUser, hasValidSession } from '../../_lib/tof';
import type { EdgeEnv } from '../../_lib/kv';

export async function onRequestGet(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;
  const config = loadTofConfig(env);
  
  if (!config.enabled) {
    return ok({
      tofEnabled: false,
      authenticated: false,
      sessionValid: false,
      user: null,
      message: 'TOF 未启用'
    });
  }
  
  // 获取 TOF 用户信息
  const user = await getTofUser(request, config);
  
  if (!user) {
    return ok({
      tofEnabled: true,
      authenticated: false,
      sessionValid: false,
      user: null,
      message: '未检测到 TOF 认证信息，请通过企业微信内网访问'
    });
  }
  
  // 检查是否有有效的登录会话
  const sessionValid = await hasValidSession(env, user.staffName);
  
  return ok({
    tofEnabled: true,
    authenticated: true,
    sessionValid,
    user: {
      loginName: user.staffName,
      staffId: user.staffId,
      displayName: user.displayName,
      chineseName: user.identityPayload?.ChineseName || ''
    },
    message: sessionValid ? '已确认登录' : '需要确认登录'
  });
}
