/**
 * POST /api/auth/logout
 * 无状态 JWT，服务端仅返回 ok，前端清 token 即可
 */

import { ok } from '../../_lib/response';
import type { EdgeEnv } from '../../_lib/kv';

export async function onRequestPost(_context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  return ok({ ok: true });
}
