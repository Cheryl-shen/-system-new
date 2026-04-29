/**
 * 统一认证入口
 *
 * 支持两种认证模式：
 * 1. TOF 模式（推荐）：通过 NGate 网关，自动从 Header 读取用户信息
 * 2. JWT 模式：企业微信扫码登录，从 Authorization Header 读取 Token
 *
 * 环境变量：
 * - AUTH_MODE: 'tof' | 'jwt' | 'auto'（默认 auto，自动检测）
 */

import type { EdgeEnv } from './kv';
import { getTofUser, isTofAuthenticated, type TofUser } from './tof';
import { requireAuth, extractToken, verifyToken, JwtPayload } from './auth';
import { errors } from './response';

export type AuthMode = 'tof' | 'jwt' | 'auto';

export interface AuthContext {
  mode: AuthMode;
  user: TofUser | JwtPayload;
}

/**
 * 获取认证模式
 */
export function getAuthMode(env: EdgeEnv): AuthMode {
  const mode = (env.AUTH_MODE as AuthMode) || 'auto';
  return mode;
}

/**
 * 检测是否应该使用 TOF 模式
 */
export function detectTofMode(request: Request): boolean {
  return isTofAuthenticated(request);
}

/**
 * 统一鉴权入口
 * 
 * 根据配置和请求自动选择认证模式
 */
export async function requireUnifiedAuth(
  request: Request,
  env: EdgeEnv
): Promise<AuthContext> {
  const mode = getAuthMode(env);
  
  let user: TofUser | JwtPayload;
  
  if (mode === 'tof') {
    // 强制 TOF 模式
    const tofUser = getTofUser(request);
    if (!tofUser || !tofUser.staffName || tofUser.staffName === 'anonymous') {
      throw errors.unauthorized('未通过 TOF 认证，请通过公司内网访问');
    }
    user = tofUser;
  } else if (mode === 'jwt') {
    // 强制 JWT 模式
    try {
      const token = extractToken(request);
      if (!token) throw errors.unauthorized('缺少登录凭证');
      const payload = await verifyToken(token, env.JWT_SECRET);
      if (!payload) throw errors.unauthorized('登录凭证无效或已过期');
      user = payload;
    } catch (e) {
      if (e instanceof Response) throw e;
      throw errors.unauthorized('登录凭证无效或已过期');
    }
  } else {
    // 自动检测模式
    if (detectTofMode(request)) {
      const tofUser = getTofUser(request);
      if (tofUser && tofUser.staffName && tofUser.staffName !== 'anonymous') {
        user = tofUser;
      } else {
        // 尝试 JWT
        const token = extractToken(request);
        if (token) {
          const payload = await verifyToken(token, env.JWT_SECRET);
          if (payload) {
            user = payload;
          } else {
            throw errors.unauthorized('登录凭证无效或已过期');
          }
        } else {
          throw errors.unauthorized('未登录，请通过企业微信扫码登录或本地登录');
        }
      }
    } else {
      // 尝试 JWT
      const token = extractToken(request);
      if (token) {
        const payload = await verifyToken(token, env.JWT_SECRET);
        if (payload) {
          user = payload;
        } else {
          throw errors.unauthorized('登录凭证无效或已过期');
        }
      } else {
        throw errors.unauthorized('未登录，请通过企业微信扫码登录或本地登录');
      }
    }
  }
  
  return {
    mode,
    user
  };
}

/**
 * 获取当前用户信息（不强制要求登录）
 */
export function getCurrentUser(request: Request): TofUser | JwtPayload | null {
  // 先检查 TOF
  const tofUser = getTofUser(request);
  if (tofUser) {
    return tofUser;
  }
  
  // 再检查 JWT
  const token = extractToken(request);
  if (token) {
    // 注意：这里不验证 token，只返回 token 信息
    // 实际验证应该在需要时进行
    return {
      sub: token,
      role: 'manager' as const,
      customerIds: [] as string[],
      displayName: 'JWT User'
    } as unknown as JwtPayload;
  }
  
  return null;
}

/**
 * 从统一用户对象中提取用户名
 */
export function getUsername(user: TofUser | JwtPayload): string {
  if ('staffName' in user) {
    return user.staffName;
  }
  return user.sub;
}

/**
 * 从统一用户对象中提取显示名
 */
export function getDisplayName(user: TofUser | JwtPayload): string {
  if ('staffName' in user) {
    return user.displayName;
  }
  return user.displayName || user.sub;
}

/**
 * 检查用户是否有管理员权限
 */
export function isAdmin(user: TofUser | JwtPayload): boolean {
  if ('staffName' in user) {
    // TOF 用户默认是 manager
    return false;
  }
  return user.role === 'admin';
}
