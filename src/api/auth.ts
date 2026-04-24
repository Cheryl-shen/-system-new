/**
 * Auth 接口调用
 * 
 * 支持两种认证模式：
 * 1. TOF 模式：通过 NGate 网关，自动从 Header 读取用户信息
 * 2. JWT 模式：本地 OAuth2 登录，从 Authorization Header 读取 Token
 *
 * 本地开发模式（import.meta.env.DEV）下，由于 EdgeOne Pages Functions
 * 不会随 `vite` 启动，这里使用一个内置的 Mock 实现，接受账号 Tencent /
 * 密码 Tencent2026 登录，其他请求全部走本地逻辑，便于开发调试。
 */

import { http } from './http';

export type UserRole = 'admin' | 'manager';

export interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole;
  customerIds: string[];
  /** 认证模式：tof 或 jwt */
  authMode?: 'tof' | 'jwt';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface TofCheckResponse {
  authenticated: boolean;
}

// ============================================================
// 本地开发 Mock：仅在 vite dev 模式下启用
// 正式部署（构建产物）不会走这里
// ============================================================
const DEV_MODE = import.meta.env.DEV;

/** 本地开发用内置账号 */
const DEV_CREDENTIALS = {
  username: 'Tencent',
  password: 'Tencent2026'
} as const;

const DEV_MOCK_USER: AuthUser = {
  username: 'Tencent',
  displayName: 'Tencent',
  role: 'admin',
  customerIds: [],
  authMode: 'jwt'
};

/** 生成一个随机 mock token（仅用于前端状态，不用于任何安全校验） */
function makeDevToken(): string {
  const rand = Math.random().toString(36).slice(2);
  return `dev.${rand}.${Date.now()}`;
}

const DEV_TOKEN_KEY = 'sc.auth.token';

function devLogin(username: string, password: string): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    // 小延迟，模拟真实网络请求体验
    setTimeout(() => {
      if (
        username === DEV_CREDENTIALS.username &&
        password === DEV_CREDENTIALS.password
      ) {
        resolve({ token: makeDevToken(), user: { ...DEV_MOCK_USER } });
      } else {
        reject(new Error('账号或密码错误'));
      }
    }, 200);
  });
}

function devMe(): Promise<AuthUser> {
  // 有 token 即视为已登录
  const token = localStorage.getItem(DEV_TOKEN_KEY);
  if (!token) {
    return Promise.reject(new Error('未登录'));
  }
  return Promise.resolve({ ...DEV_MOCK_USER });
}

// ============================================================
// 对外 API
// ============================================================
export const authApi = {
  login(username: string, password: string): Promise<LoginResponse> {
    if (DEV_MODE) return devLogin(username, password);
    return http.post<LoginResponse>('/api/auth/login', { username, password });
  },

  me(): Promise<AuthUser> {
    if (DEV_MODE) return devMe();
    return http.get<AuthUser>('/api/auth/me');
  },

  logout(): Promise<{ ok: boolean }> {
    if (DEV_MODE) return Promise.resolve({ ok: true });
    return http.post<{ ok: boolean }>('/api/auth/logout');
  },

  /**
   * 跳转到 IOA 授权页（JWT 模式使用）
   */
  redirectToIoa(redirectAfter?: string): void {
    const url = new URL('/api/auth/ioa/login', window.location.origin);
    if (redirectAfter && redirectAfter.startsWith('/') && !redirectAfter.startsWith('//')) {
      url.searchParams.set('redirect', redirectAfter);
    }
    window.location.href = url.toString();
  },

  /**
   * 检查是否已通过 TOF 认证
   * 在 NGate + TOF 模式下，如果 Header 中有 StaffName 则表示已认证
   */
  checkTofAuth(): Promise<TofCheckResponse> {
    if (DEV_MODE) {
      // 本地开发环境不走 TOF，直接返回未认证，让页面显示登录表单
      return Promise.resolve({ authenticated: false });
    }
    return http.get<TofCheckResponse>('/api/auth/tof/check');
  }
};
