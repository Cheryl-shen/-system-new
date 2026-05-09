/**
 * Auth 接口调用
 * 
 * 仅支持 TOF 认证模式：
 * - 通过 NGate 网关，自动从 Header 读取用户信息
 * - 不支持账号密码登录
 */

import { http } from './http';

export type UserRole = 'admin' | 'manager' | 'viewer';

export interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole;
  customerIds: string[];
  /** 认证模式 */
  authMode?: 'tof' | 'dev';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface TofCheckResponse {
  authenticated: boolean;
}

/**
 * 登录确认相关接口响应
 */
export interface CheckResponse {
  tofEnabled: boolean;
  authenticated: boolean;
  sessionValid: boolean;
  user: {
    loginName: string;
    staffId: string;
    displayName: string;
    chineseName?: string;
  } | null;
  message: string;
}

export interface ConfirmResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

/** 开发登录响应 */
export interface DevLoginResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

// ============================================================
// 对外 API - 支持 TOF 认证 + 开发模式
// ============================================================
export const authApi = {
  /**
   * 跳转到企业微信扫码授权页
   */
  redirectToWecom(redirectAfter?: string): void {
    const url = new URL('/api/auth/wecom/login', window.location.origin);
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
    return http.get<TofCheckResponse>('/api/auth/tof/check');
  },

  /**
   * 检查认证状态和登录确认状态
   * 返回是否需要显示登录确认页面
   */
  checkAuthStatus(): Promise<CheckResponse> {
    return http.get<CheckResponse>('/api/auth/check');
  },

  /**
   * 确认登录
   */
  confirmLogin(): Promise<ConfirmResponse> {
    return http.post<ConfirmResponse>('/api/auth/confirm', {});
  },

  /**
   * 获取当前用户信息
   */
  me(): Promise<AuthUser> {
    return http.get<AuthUser>('/api/auth/me');
  },

  /**
   * 退出登录
   */
  logout(): Promise<{ ok: boolean }> {
    return http.post<{ ok: boolean }>('/api/auth/logout');
  },

  /**
   * 开发模式登录
   * 仅在开发环境可用，直接返回 Mock 数据，不依赖后端
   */
  devLogin(): Promise<DevLoginResponse> {
    // 开发模式下，直接返回 Mock 用户数据
    if (import.meta.env.VITE_DEV_LOGIN === 'true') {
      const devRole = (import.meta.env.VITE_DEV_USER as UserRole) || 'admin';
      
      const mockUser: AuthUser = {
        username: `dev_${devRole}`,
        displayName: `开发用户 (${devRole})`,
        role: devRole,
        customerIds: devRole === 'admin' ? [] : ['customer_001', 'customer_002'],
        authMode: 'dev'
      };
      
      return Promise.resolve({
        success: true,
        user: mockUser
      });
    }
    
    // 非开发模式下，调用后端 API（如果有的话）
    return http.post<DevLoginResponse>('/api/auth/dev/login', {});
  }
};
