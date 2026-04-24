/**
 * 统一响应封装
 */

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

export function ok<T>(data: T, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200,
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers || {}) }
  });
}

export function created<T>(data: T): Response {
  return new Response(JSON.stringify({ ok: true, data }), {
    status: 201,
    headers: JSON_HEADERS
  });
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown
): Response {
  const body: { ok: false; error: ApiErrorBody } = {
    ok: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) }
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

export const errors = {
  badRequest: (msg = '请求参数错误', details?: unknown) =>
    fail(400, 'BAD_REQUEST', msg, details),
  unauthorized: (msg = '未登录或登录已过期') =>
    fail(401, 'UNAUTHORIZED', msg),
  forbidden: (msg = '无权限访问该资源') =>
    fail(403, 'FORBIDDEN', msg),
  notFound: (msg = '资源不存在') =>
    fail(404, 'NOT_FOUND', msg),
  conflict: (msg = '资源冲突') =>
    fail(409, 'CONFLICT', msg),
  serverError: (msg = '服务器内部错误', details?: unknown) =>
    fail(500, 'INTERNAL_ERROR', msg, details)
};

export async function readJson<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error('INVALID_JSON');
  }
}
