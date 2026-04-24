/**
 * POST /api/admin/init
 * 一次性初始化 KV 种子数据（用户 / 客户）
 *
 * 安全：必须带 X-Init-Secret 头，且值等于 JWT_SECRET。
 *       避免被陌生人调用把数据覆盖。
 *
 * 幂等：如果目标 key 已存在，默认跳过；传 ?force=1 才覆盖。
 */

import type { EdgeEnv } from '../../_lib/kv';
import { KEYS, kvGetJson, kvPutJson, kvIndexAppend } from '../../_lib/kv';
import { errors, ok } from '../../_lib/response';
import { hashPassword } from '../../_lib/password';
import type { UserRecord } from '../../_lib/auth';
import type { CustomerRecord } from '../../../shared/types';

interface Env extends EdgeEnv {}

// 占位种子数据 —— 上线前替换
const SEED_CUSTOMERS: Array<Omit<CustomerRecord, 'createdAt'>> = [
  { id: 'c001', name: '唯品会' },
  { id: 'c002', name: '小红书' },
  { id: 'c003', name: '拼多多' },
  { id: 'c004', name: 'TME' },
  { id: 'c005', name: '虎牙' },
  { id: 'c006', name: '酷狗' },
  { id: 'c007', name: '顺丰控股' }
];

const SEED_USERS: Array<{
  username: string;
  password: string;
  displayName: string;
  role: 'admin' | 'manager';
  customerIds: string[];
}> = [
  { username: 'admin', password: 'Admin@2026', displayName: '管理员', role: 'admin', customerIds: [] },
  { username: 'manager1', password: 'Manager@2026', displayName: '经理一', role: 'manager', customerIds: ['c001', 'c002'] },
  { username: 'manager2', password: 'Manager@2026', displayName: '经理二', role: 'manager', customerIds: ['c003', 'c004'] },
  { username: 'manager3', password: 'Manager@2026', displayName: '经理三', role: 'manager', customerIds: ['c005', 'c006', 'c007'] }
];

export async function onRequestPost({
  request,
  env
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  // 鉴权：用 JWT_SECRET 作为初始化密钥
  const provided = request.headers.get('x-init-secret');
  if (!provided || provided !== env.JWT_SECRET) {
    return errors.unauthorized('初始化密钥错误');
  }

  const url = new URL(request.url);
  const force = url.searchParams.get('force') === '1';

  const now = new Date().toISOString();
  const report = {
    customers: { created: [] as string[], skipped: [] as string[] },
    users: { created: [] as string[], skipped: [] as string[] }
  };

  // 1) 写客户
  for (const c of SEED_CUSTOMERS) {
    const key = KEYS.customer(c.id);
    const exist = await kvGetJson<CustomerRecord>(env.REPORTS_KV, key);
    if (exist && !force) {
      report.customers.skipped.push(c.id);
      continue;
    }
    const rec: CustomerRecord = { ...c, createdAt: exist?.createdAt ?? now };
    await kvPutJson(env.REPORTS_KV, key, rec);
    await kvIndexAppend(env.REPORTS_KV, KEYS.customerListIndex(), c.id);
    report.customers.created.push(c.id);
  }

  // 2) 写用户
  for (const u of SEED_USERS) {
    const key = KEYS.user(u.username);
    const exist = await kvGetJson<UserRecord>(env.REPORTS_KV, key);
    if (exist && !force) {
      report.users.skipped.push(u.username);
      continue;
    }
    const rec: UserRecord = {
      username: u.username,
      passwordHash: await hashPassword(u.password),
      displayName: u.displayName,
      role: u.role,
      customerIds: u.customerIds,
      createdAt: exist?.createdAt ?? now,
      updatedAt: now
    };
    await kvPutJson(env.REPORTS_KV, key, rec);
    await kvIndexAppend(env.REPORTS_KV, KEYS.userListIndex(), u.username);
    report.users.created.push(u.username);
  }

  return ok({
    message: force ? '初始化完成（强制覆盖）' : '初始化完成（已存在的跳过）',
    report,
    hint: '请妥善保管占位账号密码，并尽快替换为真实用户'
  });
}
