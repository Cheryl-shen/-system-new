/**
 * 认证状态管理（Pinia）
 * - 支持 TOF 模式（通过 NGate 网关自动认证）+ 开发模式
 * - token 存 localStorage，页面刷新不丢
 * - user 信息在登录后 / 刷新时从 /api/auth/me 恢复
 */

import { defineStore } from 'pinia';
import { authApi, type AuthUser } from '@/api/auth';

const TOKEN_KEY = 'sc.auth.token';
const USER_CACHE_KEY = 'sc.auth.user';

interface State {
  token: string | null;
  user: AuthUser | null;
  /** 首次是否完成 me 校验，用于路由守卫的 loading 判断 */
  bootstrapped: boolean;
  /** 认证模式 */
  authMode: 'tof' | 'dev' | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: (() => {
      const raw = localStorage.getItem(USER_CACHE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as AuthUser;
      } catch {
        return null;
      }
    })(),
    bootstrapped: false,
    authMode: null
  }),
  getters: {
    isLoggedIn: (s) => !!s.token && !!s.user,
    isAdmin: (s) => s.user?.role === 'admin',
    roleLabel: (s) => (s.user?.role === 'admin' ? '管理员' : '客户经理'),
    /** 用户能访问的客户 id 列表；admin 拿全量由 UI 自己决定 */
    accessibleCustomerIds: (s) => s.user?.customerIds ?? []
  },
  actions: {
    setAuth(token: string, user: AuthUser, mode: 'tof' | 'dev' = 'tof') {
      this.token = token;
      this.user = user;
      this.authMode = mode;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    },
    updateUser(user: AuthUser, mode?: 'tof' | 'dev') {
      this.user = user;
      if (mode) this.authMode = mode;
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    },
    clear() {
      this.token = null;
      this.user = null;
      this.authMode = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_CACHE_KEY);
    },
    /**
     * 初始化认证状态
     * TOF 模式：太湖鉴权通过后直接放行，不做二次检查
     */
    async bootstrap() {
      if (this.bootstrapped) return;
      
      try {
        // 直接尝试获取用户信息
        // 如果 TOF 认证通过，后端会返回用户；否则返回 401
        const user = await authApi.me();
        this.updateUser(user, user.authMode === 'dev' ? 'dev' : 'tof');
        // 设置一个标识 token（TOF 模式下不需要真正的 JWT）
        if (!this.token) {
          this.token = 'tof-session';
          localStorage.setItem(TOKEN_KEY, 'tof-session');
        }
      } catch (e: any) {
        // 401 表示未登录，清空状态
        this.clear();
      } finally {
        this.bootstrapped = true;
      }
    },

    /**
     * 开发模式登录
     * 仅在开发环境可用
     */
    async devLogin() {
      try {
        const result = await authApi.devLogin();
        if (result.success && result.user) {
          // 生成模拟 token
          const mockToken = 'dev-token-' + Date.now();
          this.setAuth(mockToken, result.user, 'dev');
          return { success: true };
        } else {
          return { success: false, message: result.message || '开发登录失败' };
        }
      } catch (e: any) {
        console.error('开发登录失败:', e);
        return { success: false, message: '开发登录失败，请重试' };
      }
    },
    canAccessCustomer(customerId: string): boolean {
      if (!this.user) return false;
      if (this.user.role === 'admin') return true;
      return this.user.customerIds.includes(customerId);
    }
  }
});