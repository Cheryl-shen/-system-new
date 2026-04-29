/**
 * 用户管理模块
 * 
 * 包含：
 * - 用户创建/查询
 * - 登录日志记录
 * - 用户列表查询
 * - 用户角色/状态管理
 */

import type { EdgeEnv, KVNamespace } from './kv';
import { KEYS, kvGetJson, kvPut, kvIndexAppend, kvIndexGet } from './kv';
import type { TofUser } from './tof';

// ============================================================
// 类型定义
// ============================================================

export type UserRole = 'admin' | 'manager' | 'viewer';
export type UserStatus = 'active' | 'disabled';

export interface UserRecord {
  username: string;         // 英文名 (RTX)
  displayName: string;      // 显示名称
  role: UserRole;
  status: UserStatus;
  customerIds: string[];    // 管理员可为空
  staffId: string;          // 员工ID
  chineseName?: string;      // 中文名
  createdAt: string;
  lastLogin?: string;
}

export interface LoginLog {
  id: string;
  username: string;
  displayName: string;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
}

// ============================================================
// 用户管理
// ============================================================

/**
 * 从 TOF 用户创建或获取本地用户记录
 */
export async function getOrCreateUser(
  env: EdgeEnv,
  tofUser: TofUser
): Promise<UserRecord> {
  if (!env.REPORTS_KV) {
    // 没有 KV 时返回临时用户
    return {
      username: tofUser.staffName,
      displayName: tofUser.displayName,
      role: 'manager',
      status: 'active',
      customerIds: [],
      staffId: tofUser.staffId,
      chineseName: tofUser.identityPayload?.ChineseName,
      createdAt: new Date().toISOString()
    };
  }
  
  const existing = await kvGetJson<UserRecord>(env.REPORTS_KV, KEYS.user(tofUser.staffName));
  
  if (existing) {
    // 更新最近登录时间
    const updated: UserRecord = {
      ...existing,
      lastLogin: new Date().toISOString()
    };
    await kvPut(env.REPORTS_KV, KEYS.user(tofUser.staffName), updated);
    return updated;
  }
  
  // 自动创建新用户（默认 manager 角色）
  const now = new Date().toISOString();
  const newUser: UserRecord = {
    username: tofUser.staffName,
    displayName: tofUser.identityPayload?.ChineseName || tofUser.displayName,
    role: 'manager',
    status: 'active',
    customerIds: [],
    staffId: tofUser.staffId,
    chineseName: tofUser.identityPayload?.ChineseName,
    createdAt: now,
    lastLogin: now
  };
  
  await kvPut(env.REPORTS_KV, KEYS.user(tofUser.staffName), newUser);
  await kvIndexAppend(env.REPORTS_KV, KEYS.userListIndex(), tofUser.staffName);
  
  return newUser;
}

/**
 * 根据用户名获取用户
 */
export async function getUser(
  env: EdgeEnv,
  username: string
): Promise<UserRecord | null> {
  if (!env.REPORTS_KV) return null;
  return await kvGetJson<UserRecord>(env.REPORTS_KV, KEYS.user(username));
}

/**
 * 获取用户列表
 */
export async function listUsers(
  env: EdgeEnv,
  options?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }
): Promise<{ users: UserRecord[]; total: number }> {
  if (!env.REPORTS_KV) {
    return { users: [], total: 0 };
  }
  
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;
  const keyword = (options?.keyword || '').toLowerCase();
  
  const usernames = await kvIndexGet(env.REPORTS_KV, KEYS.userListIndex());
  const allUsers: UserRecord[] = [];
  
  for (const username of usernames) {
    const user = await kvGetJson<UserRecord>(env.REPORTS_KV, KEYS.user(username));
    if (user) {
      // 关键词过滤
      if (keyword) {
        const match = 
          user.username.toLowerCase().includes(keyword) ||
          user.displayName.toLowerCase().includes(keyword) ||
          (user.chineseName && user.chineseName.toLowerCase().includes(keyword));
        if (!match) continue;
      }
      allUsers.push(user);
    }
  }
  
  // 按最近登录时间排序
  allUsers.sort((a, b) => {
    const timeA = a.lastLogin || a.createdAt;
    const timeB = b.lastLogin || b.createdAt;
    return timeB.localeCompare(timeA);
  });
  
  // 分页
  const start = (page - 1) * pageSize;
  const users = allUsers.slice(start, start + pageSize);
  
  return { users, total: allUsers.length };
}

/**
 * 更新用户角色
 */
export async function updateUserRole(
  env: EdgeEnv,
  username: string,
  role: UserRole
): Promise<void> {
  if (!env.REPORTS_KV) return;
  
  const user = await getUser(env, username);
  if (!user) throw new Error('用户不存在');
  
  const updated: UserRecord = { ...user, role };
  await kvPut(env.REPORTS_KV, KEYS.user(username), updated);
}

/**
 * 更新用户状态
 */
export async function updateUserStatus(
  env: EdgeEnv,
  username: string,
  status: UserStatus
): Promise<void> {
  if (!env.REPORTS_KV) return;
  
  const user = await getUser(env, username);
  if (!user) throw new Error('用户不存在');
  
  const updated: UserRecord = { ...user, status };
  await kvPut(env.REPORTS_KV, KEYS.user(username), updated);
}

/**
 * 设置用户角色（包括首个管理员设置）
 */
export async function setUserRole(
  env: EdgeEnv,
  username: string,
  role: UserRole
): Promise<void> {
  return updateUserRole(env, username, role);
}

// ============================================================
// 登录日志
// ============================================================

/**
 * 记录登录日志
 */
export async function recordLoginLog(
  env: EdgeEnv,
  params: {
    username: string;
    displayName: string;
    ipAddress: string;
    userAgent: string;
  }
): Promise<void> {
  if (!env.REPORTS_KV) return;
  
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const log: LoginLog = {
    id,
    username: params.username,
    displayName: params.displayName,
    loginTime: new Date().toISOString(),
    ipAddress: params.ipAddress,
    userAgent: params.userAgent
  };
  
  await kvPut(env.REPORTS_KV, KEYS.loginLog(id), log);
  await kvIndexAppend(env.REPORTS_KV, KEYS.loginLogIndex(), id);
}

/**
 * 获取登录日志列表
 */
export async function listLoginLogs(
  env: EdgeEnv,
  options?: {
    page?: number;
    pageSize?: number;
    username?: string;
  }
): Promise<{ logs: LoginLog[]; total: number }> {
  if (!env.REPORTS_KV) {
    return { logs: [], total: 0 };
  }
  
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 50;
  const username = options?.username?.toLowerCase();
  
  const logIds = await kvIndexGet(env.REPORTS_KV, KEYS.loginLogIndex());
  const allLogs: LoginLog[] = [];
  
  // 按时间倒序获取
  for (const id of logIds.reverse()) {
    const log = await kvGetJson<LoginLog>(env.REPORTS_KV, KEYS.loginLog(id));
    if (log) {
      if (username && !log.username.toLowerCase().includes(username)) {
        continue;
      }
      allLogs.push(log);
    }
  }
  
  // 分页
  const start = (page - 1) * pageSize;
  const logs = allLogs.slice(start, start + pageSize);
  
  return { logs, total: allLogs.length };
}
