/**
 * PUT /api/admin/users/:username/status
 * 启用/禁用用户（仅管理员）
 * Body: { status: 'active' | 'disabled' }
 */

import { ok, errors } from '../../../../_lib/response';
import { verifySession, requireAdmin } from '../../../../_lib/admin';
import { updateUserStatus } from '../../../../_lib/users';
import type { EdgeEnv } from '../../../../_lib/kv';

export async function onRequestPut(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;
  
  // 验证管理员权限
  const authContext = await verifySession(request, env);
  requireAdmin(authContext);
  
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const username = pathParts[pathParts.length - 2]; // /api/admin/users/:username/status
  
  if (!username) {
    return errors.badRequest('缺少用户名');
  }
  
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return errors.badRequest('请求体不是合法 JSON');
  }
  
  const { status } = body;
  const validStatuses = ['active', 'disabled'];
  
  if (!status || !validStatuses.includes(status)) {
    return errors.badRequest(`无效的状态值，可选值: ${validStatuses.join(', ')}`);
  }
  
  try {
    await updateUserStatus(env, username, status as 'active' | 'disabled');
    return ok({ success: true, message: status === 'active' ? '用户已启用' : '用户已禁用' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return errors.serverError(`修改状态失败: ${msg}`);
  }
}
