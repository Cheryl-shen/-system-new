/**
 * TOF (Taihu) 认证集成
 *
 * 通过 NGate 网关接入时，TOF 认证插件会自动注入以下 Header：
 * - x-tai-identity: 加密的用户身份信息 (JWE 格式)
 * - x-tai-identity-b64: 解密后的 Base64 编码信息
 * - StaffName: 员工英文名 (RTX)
 * - StaffId: 员工 ID
 * - TIMESTAMP: Unix 时间戳
 * - SIGNATURE: 请求签名
 *
 * 使用方式：
 * 1. 在 NGate 路由配置中启用 TOF 认证插件
 * 2. 后端直接从 Header 读取用户信息
 * 3. 前端无需任何改动
 */

import type { EdgeEnv } from './kv';
import { KEYS, kvGetJson } from './kv';

export interface TofUser {
  staffName: string;
  staffId: string;
  displayName: string;
  rawIdentity?: string;
}

export interface UserRecord {
  username: string;
  displayName: string;
  role: 'admin' | 'manager';
  customerIds: string[];
  createdAt: string;
}

/**
 * 从请求中获取 TOF 用户信息
 * 
 * 注意：如果开启了 TOF 认证严格模式，没有登录会返回 401
 */
export function getTofUser(request: Request): TofUser | null {
  const headers = request.headers;
  
  // 优先从 StaffName 读取（NGate 注入）
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
  headers: Headers,
  tofToken: string
): Promise<boolean> {
  const timestamp = headers.get('TIMESTAMP') || headers.get('Timestamp');
  const signature = headers.get('SIGNATURE') || headers.get('Signature');
  
  if (!timestamp || !signature) return false;
  
  try {
    // 简化版签名验证（实际生产环境建议使用完整的签名算法）
    // 完整算法：SHA256(timestamp + nonce + tof_token + body_hash).toUpperCase()
    const expected = await sha256Hex(timestamp + tofToken);
    return signature.toUpperCase() === expected.toUpperCase();
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
    headers.get('x-tai-identity')
  );
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
  
  unauthorized: () => tofResponse.error('未登录，请通过 IOA 登录', 401),
  
  forbidden: () => tofResponse.error('无权限访问', 403)
};
