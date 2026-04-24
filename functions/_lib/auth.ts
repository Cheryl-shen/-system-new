/**
 * JWT 签发/校验 + 请求鉴权
 * 使用 jose 这个 Web 标准的库，EdgeOne Functions 能直接跑
 */

import { SignJWT, jwtVerify } from 'jose';
import type { EdgeEnv } from './kv';
import { KEYS, kvGetJson } from './kv';
import { errors } from './response';

export type UserRole = 'admin' | 'manager';

export interface UserRecord {
  username: string;
  passwordHash: string;
  displayName: string;
  role: UserRole;
  customerIds: string[]; // admin 可为空，不校验
  createdAt: string;
  updatedAt?: string;
}

export interface JwtPayload {
  sub: string; // username
  role: UserRole;
  customerIds: string[];
  displayName: string;
  iat?: number;
  exp?: number;
}

const TOKEN_TTL = '7d';
const ALG = 'HS256';

/**
 * JWT 密钥兜底：当 EdgeOne 控制台没配置 JWT_SECRET 环境变量时，
 * 使用这个默认值，保证登录能走通；线上请务必在控制台配置。
 */
const FALLBACK_SECRET =
  'strategic-platform-default-secret-please-rotate-in-edgeone-console';

function getSecretKey(secret: string | undefined | null): Uint8Array {
  return new TextEncoder().encode(secret || FALLBACK_SECRET);
}

export async function signToken(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string | undefined | null
): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecretKey(secret));
}

export async function verifyToken(
  token: string,
  secret: string | undefined | null
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(secret));
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

/** 从请求头拿 token */
export function extractToken(request: Request): string | null {
  const auth = request.headers.get('authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return null;
  return auth.slice(7).trim() || null;
}

/**
 * 鉴权中间件：从请求拿 JWT 并校验；失败抛出 Response
 * 用法：const user = await requireAuth(request, env)
 */
export async function requireAuth(
  request: Request,
  env: EdgeEnv
): Promise<JwtPayload> {
  const token = extractToken(request);
  if (!token) throw errors.unauthorized('缺少登录凭证');
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload) throw errors.unauthorized('登录凭证无效或已过期');
  return payload;
}

/** 要求管理员；失败抛 403 */
export function requireAdmin(user: JwtPayload): void {
  if (user.role !== 'admin') throw errors.forbidden('仅管理员可操作');
}

/** 判断当前用户能否访问某客户（admin 全通） */
export function canAccessCustomer(user: JwtPayload, customerId: string): boolean {
  if (user.role === 'admin') return true;
  return user.customerIds.includes(customerId);
}

export function assertCustomerAccess(
  user: JwtPayload,
  customerId: string
): void {
  if (!canAccessCustomer(user, customerId)) {
    throw errors.forbidden(`您没有访问客户 ${customerId} 的权限`);
  }
}

/** 从 KV 按用户名取用户（登录时用） */
export async function getUserByUsername(
  env: EdgeEnv,
  username: string
): Promise<UserRecord | null> {
  return await kvGetJson<UserRecord>(env.REPORTS_KV, KEYS.user(username));
}
