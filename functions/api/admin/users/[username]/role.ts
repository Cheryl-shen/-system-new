/**
 * PUT /api/admin/users/:username/role
 * 修改用户角色（仅管理员）
 * Body: { role: 'admin' | 'manager' | 'viewer' }
 */

import { ok, errors } from '../../../../_lib/response';
import { verifySession, requireAdmin } from '../../../../_lib/admin';
import { updateUserRole } from '../../../../_lib/users';
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
  const username = pathParts[pathParts.length - 2]; // /api/admin/users/:username/role
  
  if (!username) {
    return errors.badRequest('缺少用户名');
  }
  
  let body: { role?: string };
  try {
    body = await request.json();
  } catch {
    return errors.badRequest('请求体不是合法 JSON');
  }
  
  const { role } = body;
  const validRoles = ['admin', 'manager', 'viewer'];
  
  if (!role || !validRoles.includes(role)) {
    return errors.badRequest(`无效的角色值，可选值: ${validRoles.join(', ')}`);
  }
  
  try {
    await updateUserRole(env, username, role as 'admin' | 'manager' | 'viewer');
    return ok({ success: true, message: '角色已更新' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return errors.serverError(`修改角色失败: ${msg}`);
  }
}
