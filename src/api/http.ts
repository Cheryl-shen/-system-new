/**
 * 统一 HTTP 封装：自动带 Authorization 头、统一响应解包、401 自动跳登录
 */

import { useAuthStore } from '@/stores/auth';

export interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown; // 对象会自动 JSON.stringify
  /** 默认 true，401 时自动退出登录并跳转 */
  autoLogoutOn401?: boolean;
}

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const auth = useAuthStore();
  const headers = new Headers(options.headers || {});

  const init: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: options.credentials,
    signal: options.signal
  };

  if (options.body !== undefined) {
    if (typeof options.body === 'string' || options.body instanceof FormData) {
      init.body = options.body as BodyInit;
    } else {
      headers.set('Content-Type', 'application/json');
      init.body = JSON.stringify(options.body);
    }
  }

  if (auth.token) {
    headers.set('Authorization', `Bearer ${auth.token}`);
  }

  let resp: Response;
  try {
    resp = await fetch(buildUrl(path), init);
  } catch (e) {
    throw new ApiError(0, 'NETWORK_ERROR', '网络请求失败，请检查连接');
  }

  let envelope: ApiEnvelope<T>;
  try {
    envelope = (await resp.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(resp.status, 'INVALID_RESPONSE', '服务器返回非 JSON 数据');
  }

  if (!resp.ok || !envelope.ok) {
    const err = envelope.error || { code: 'UNKNOWN', message: `HTTP ${resp.status}` };
    if (resp.status === 401 && options.autoLogoutOn401 !== false) {
      auth.clear();
      // 让外部路由守卫接手跳转，这里只是清状态
    }
    throw new ApiError(resp.status, err.code, err.message, err.details);
  }

  return envelope.data as T;
}

export const http = {
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' })
};
