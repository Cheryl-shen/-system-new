/**
 * GET /api/admin/users
 * 用户列表（仅管理员）
 * Query: page, pageSize, keyword
 */

import { ok, errors } from '../../../_lib/response';
import { verifySession, requireAdmin } from '../../../_lib/admin';
import { listUsers } from '../../../_lib/users';
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
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
  const keyword = url.searchParams.get('keyword') || '';
  
  try {
    const result = await listUsers(env, { page, pageSize, keyword });
    return ok(result);
  } catch (e) {
    return errors.serverError('获取用户列表失败');
  }
}
