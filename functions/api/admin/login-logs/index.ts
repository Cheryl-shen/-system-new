/**
 * GET /api/admin/login-logs
 * 登录日志（仅管理员）
 * Query: page, pageSize, username
 */

import { ok, errors } from '../../../_lib/response';
import { verifySession, requireAdmin } from '../../../_lib/admin';
import { listLoginLogs } from '../../../_lib/users';
import type { EdgeEnv } from '../../../_lib/kv';

export async function onRequestGet(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;
  
  // 验证管理员权限
  const authContext = await verifySession(request, env);
  requireAdmin(authContext);
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '50');
  const username = url.searchParams.get('username') || '';
  
  try {
    const result = await listLoginLogs(env, { page, pageSize, username });
    return ok(result);
  } catch (e) {
    return errors.serverError('获取登录日志失败');
  }
}
