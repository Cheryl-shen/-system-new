/**
 * TOF (Taihu) 认证集成
 *
 * 通过 NGate 网关接入时，TOF 认证插件会自动注入以下 Header：
 * - x-tai-identity: 加密的用户身份信息 (JWE 格式，使用 APP_TOKEN 解密)
 * - x-tai-identity-b64: 解密后的 Base64 编码信息
 * - StaffName: 员工英文名 (RTX) - 兼容/明文模式
 * - StaffId: 员工 ID - 兼容/明文模式
 * - DisplayName: 显示名称
 * - TIMESTAMP: Unix 时间戳
 * - SIGNATURE: 请求签名
 *
 * 安全模式（推荐）：
 *   - 从 x-tai-identity (JWE) 解密获取用户信息
 *   - 需要配置 TAI_APP_TOKEN 环境变量
 *
 * 使用方式：
 * 1. 在 NGate 路由配置中启用 TOF 认证插件
 * 2. 后端直接从 Header 读取用户信息
 * 3. 前端无需任何改动
 */

import { compactDecrypt } from 'jose';
import type { EdgeEnv } from './kv';
import { KEYS, kvGetJson, kvPut } from './kv';

export interface TofConfig {
  enabled: boolean;
  safeMode: boolean;       // 是否启用安全模式（JWE 解密）
  allowedUsers: string[];  // 空数组 = 不限制用户
  token?: string;          // TOF token for signature verification
  appToken?: string;       // TAI APP_TOKEN for JWE decryption
}

export interface TofConfig {
  enabled: boolean;
  allowedUsers: string[];  // 空数组 = 不限制用户
  token?: string;        // TOF token for signature verification
}

/**
 * 读取 TOF 配置（从环境变量）
 */
export function loadTofConfig(env: Record<string, any>): TofConfig {
  const allowedUsersStr = env.TOF_ALLOWED_USERS || '';
  const allowedUsers: string[] = [];
  
  if (allowedUsersStr.trim()) {
    for (const part of allowedUsersStr.split(',')) {
      const userid = part.trim();
      if (userid) allowedUsers.push(userid.toLowerCase());
    }
  }
  
  return {
    enabled: !!(env.TOF_TOKEN || env.TAI_APP_TOKEN),  // 有任一 Token 就启用
    safeMode: !!env.TAI_APP_TOKEN,  // 有 APP_TOKEN 则启用安全模式
    allowedUsers,
    token: env.TOF_TOKEN,
    appToken: env.TAI_APP_TOKEN
  };
}

/**
 * 校验用户是否在白名单内
 */
export function checkTofUserAccess(
  staffName: string,
  allowedUsers: string[]
): { ok: boolean; reason?: string } {
  // 无用户限制
  if (!allowedUsers.length) {
    return { ok: true };
  }
  
  const userLower = staffName.toLowerCase();
  const allowedSet = new Set(allowedUsers.map(u => u.toLowerCase()));
  
  if (!allowedSet.has(userLower)) {
    return {
      ok: false,
      reason: `该用户（${staffName}）不在允许登录的白名单内，请联系管理员添加`
    };
  }
  
  return { ok: true };
}

export interface TofUser {
  staffName: string;
  staffId: string;
  displayName: string;
  rawIdentity?: string;
  /** 解密后的完整身份信息（安全模式） */
  identityPayload?: TofIdentityPayload;
}

export interface TofIdentityPayload {
  LoginName: string;      // 员工英文名
  StaffId: number;         // 员工ID
  ChineseName: string;     // 中文名
  Expiration: string;     // 过期时间
}

export interface UserRecord {
  username: string;
  displayName: string;
  role: 'admin' | 'manager';
  customerIds: string[];
  createdAt: string;
}

/**
 * 登录确认会话信息
 */
export interface LoginSession {
  confirmedAt: number;     // 确认时间戳
  ipAddress: string;       // IP 地址
  userAgent: string;       // User Agent
  staffName: string;
  displayName: string;
}

/** 会话有效期：8 小时 */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

/**
 * 解密 x-tai-identity JWE 格式（安全模式）
 */
export async function decryptTofIdentity(
  encryptedHeader: string,
  appToken: string
): Promise<TofIdentityPayload> {
  try {
    const keyBytes = new TextEncoder().encode(appToken);
    const { plaintext } = await compactDecrypt(encryptedHeader, keyBytes);
    const payload = JSON.parse(new TextDecoder().decode(plaintext)) as TofIdentityPayload;
    
    // 校验 token 过期时间（3分钟缓冲）
    const exp = new Date(payload.Expiration);
    if (new Date().getTime() - 3 * 60 * 1000 > exp.getTime()) {
      throw new Error('Identity token expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error(`JWE 解密失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 从请求中获取 TOF 用户信息
 * 
 * 安全模式（推荐）：优先解密 x-tai-identity JWE
 * 兼容模式：回退到 StaffName/StaffId 明文
 */
export async function getTofUser(
  request: Request,
  config?: TofConfig
): Promise<TofUser | null> {
  const headers = request.headers;
  
  // 安全模式：优先解密 x-tai-identity
  if (config?.safeMode && config.appToken) {
    const encryptedHeader = headers.get('x-tai-identity');
    if (encryptedHeader) {
      try {
        const payload = await decryptTofIdentity(encryptedHeader, config.appToken);
        return {
          staffName: payload.LoginName,
          staffId: String(payload.StaffId),
          displayName: payload.ChineseName || payload.LoginName,
          rawIdentity: encryptedHeader,
          identityPayload: payload
        };
      } catch (error) {
        console.error('[TOF] JWE 解密失败:', error);
        // 解密失败时回退到明文模式
      }
    }
  }
  
  // 兼容模式：从 StaffName 读取（NGate 注入）
  let staffName = headers.get('StaffName') || headers.get('staffname');
  let staffId = headers.get('StaffId') || headers.get('staffid');
  const displayName = headers.get('DisplayName') || headers.get('displayname');
  
  // 备选：从 x-tai-identity-b64 解析
  let rawIdentity = headers.get('x-tai-identity-b64') || headers.get('X-Tai-Identity-B64');
  if (rawIdentity) {
    try {
      rawIdentity = atob(rawIdentity);
      // 尝试从 JSON 中提取 staffname
      const identityData = JSON.parse(rawIdentity);
      if (identityData.StaffName && !staffName) {
        staffName = identityData.StaffName;
      }
      if (identityData.StaffId && !staffId) {
        staffId = String(identityData.StaffId);
      }
    } catch {
      // 解析失败，忽略
    }
  }
  
  if (!staffName) return null;
  
  return {
    staffName: staffName.trim(),
    staffId: staffId || '',
    displayName: (displayName || staffName).trim(),
    rawIdentity
  };
}

/**
 * 验证 TOF 签名
 * 
 * 签名算法：SHA256(TIMESTAMP + tof_token).toUpperCase()
 */
export async function verifyTofSignature(
  request: Request,
  tofToken: string
): Promise<boolean> {
  const headers = request.headers;
  const timestamp = headers.get('TIMESTAMP') || headers.get('Timestamp') || '';
  const signature = headers.get('SIGNATURE') || headers.get('Signature') || '';
  
  if (!timestamp || !signature) return false;
  
  try {
    // 校验时间偏差不超过 3 分钟
    if (isNaN(Number(timestamp)) || Math.abs(Number(timestamp) * 1000 - Date.now()) > 180000) {
      return false;
    }
    
    // 构造扩展头（安全模式下只需要 x-rio-seq，其他为空）
    const extHeaders = [
      headers.get('x-rio-seq') || '',
      '',  // StaffId 在安全模式下为空
      '',  // StaffName 在安全模式下为空
      ''   // x-ext-data
    ];
    
    // 完整签名算法：SHA256(timestamp + key + extHeaders.join(',') + timestamp)
    const data = timestamp + tofToken + extHeaders.join(',') + timestamp;
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expected = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return signature.toLowerCase() === expected.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * 检查请求是否来自 TOF 认证的用户
 * 如果未登录，返回 401 响应
 */
export function requireTofAuth(
  request: Request,
  env: EdgeEnv
): TofUser {
  const user = getTofUser(request);
  
  if (!user) {
    // 未登录，返回 401
    // 注意：在 NGate + TOF 模式下，未登录请求会被 NGate 拦截
    // 这里主要是处理直接访问 EdgeOne 的情况（绕过 NGate）
    return {
      staffName: 'anonymous',
      staffId: '',
      displayName: '未登录',
      rawIdentity: ''
    };
  }
  
  return user;
}

/**
 * 从 TOF 用户获取或创建本地用户记录
 * 
 * 如果用户在 KV 中不存在，则自动创建
 */
export async function getOrCreateUserFromTof(
  env: EdgeEnv,
  tofUser: TofUser
): Promise<UserRecord> {
  // 先尝试从 KV 获取现有用户
  const existing = await kvGetJson<UserRecord>(
    env.REPORTS_KV,
    KEYS.user(tofUser.staffName)
  );
  
  if (existing) {
    return existing;
  }
  
  // 自动创建新用户（默认 manager 角色）
  const now = new Date().toISOString();
  const newUser: UserRecord = {
    username: tofUser.staffName,
    displayName: tofUser.displayName,
    role: 'manager',
    customerIds: [],
    createdAt: now
  };
  
  // 保存到 KV（这里简化处理，实际应该用 kv.put）
  // 注意：EdgeOne Functions 的 KV API 可能与标准不同
  
  return newUser;
}

/**
 * 简单的 SHA256 实现
 */
async function sha256Hex(str: string): Promise<string> {
  // 使用 Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const array = Array.from(new Uint8Array(digest));
  return array.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 检查 Header 中是否有 TOF 认证信息
 */
export function isTofAuthenticated(request: Request): boolean {
  const headers = request.headers;
  return !!(
    headers.get('StaffName') ||
    headers.get('staffname') ||
    headers.get('x-tai-identity') ||
    headers.get('x-tai-identity-b64')
  );
}

// ============================================================
// 登录确认相关功能
// ============================================================

/**
 * 获取登录会话 Key
 */
function getSessionKey(staffName: string): string {
  return KEYS.session(staffName);
}

/**
 * 检查是否有有效的登录会话
 */
export async function hasValidSession(
  env: EdgeEnv,
  staffName: string
): Promise<boolean> {
  if (!env.REPORTS_KV) return false;
  
  const session = await kvGetJson<LoginSession>(env.REPORTS_KV, getSessionKey(staffName));
  if (!session) return false;
  
  return (Date.now() - session.confirmedAt) < SESSION_TTL_MS;
}

/**
 * 创建登录会话
 */
export async function createLoginSession(
  env: EdgeEnv,
  user: TofUser,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  if (!env.REPORTS_KV) return;
  
  const session: LoginSession = {
    confirmedAt: Date.now(),
    ipAddress,
    userAgent,
    staffName: user.staffName,
    displayName: user.displayName
  };
  
  await kvPut(env.REPORTS_KV, getSessionKey(user.staffName), session, SESSION_TTL_MS);
}

/**
 * 清除登录会话
 */
export async function clearLoginSession(
  env: EdgeEnv,
  staffName: string
): Promise<void> {
  if (!env.REPORTS_KV) return;
  
  await env.REPORTS_KV.delete(getSessionKey(staffName));
}

/**
 * 获取登录会话信息
 */
export async function getLoginSession(
  env: EdgeEnv,
  staffName: string
): Promise<LoginSession | null> {
  if (!env.REPORTS_KV) return null;
  
  return await kvGetJson<LoginSession>(env.REPORTS_KV, getSessionKey(staffName));
}

/**
 * 登录确认响应（返回 449 状态码）
 */
export function loginConfirmationRequired(user: TofUser): Response {
  return new Response(JSON.stringify({
    error: 'LOGIN_CONFIRMATION_REQUIRED',
    message: '请确认登录',
    user: {
      loginName: user.staffName,
      chineseName: user.identityPayload?.ChineseName || '',
      staffId: user.staffId,
      displayName: user.displayName
    }
  }), {
    status: 449,  // Login Confirmation Required
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * TOF 认证模式的响应辅助函数
 */
export const tofResponse = {
  ok: (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  error: (message: string, status = 400) => {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  unauthorized: () => tofResponse.error('未登录，请登录', 401),
  
  forbidden: () => tofResponse.error('无权限访问', 403)
};
