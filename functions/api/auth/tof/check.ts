/**
 * GET /api/auth/tof/check
 * 检查当前请求是否已通过 TOF 认证
 * 
 * 用于前端判断是否需要跳转到 IOA 登录
 */

import { ok } from '../../../_lib/response';
import { isTofAuthenticated } from '../../../_lib/tof';

export async function onRequestGet(context: {
  request: Request;
}): Promise<Response> {
  const { request } = context;
  
  const authenticated = isTofAuthenticated(request);
  
  return ok({
    authenticated,
    message: authenticated ? '已通过 TOF 认证' : '未认证，请通过 IOA 登录'
  });
}
