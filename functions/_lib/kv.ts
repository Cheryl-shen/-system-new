/**
 * KV 读写封装
 * 所有业务代码不要直接用 env.REPORTS_KV，统一走这层，方便以后迁 MySQL 时替换。
 */

export interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' }): Promise<string | null | any>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: Array<{ name: string; expiration?: number }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

export interface EdgeEnv {
  REPORTS_KV: KVNamespace;
  JWT_SECRET: string;
}

/** Key 命名空间常量，所有 key 都从这里拿，杜绝硬编码 */
export const KEYS = {
  user: (username: string) => `user:${username}`,
  userListIndex: () => `index:users`,
  customer: (cid: string) => `customer:${cid}`,
  customerListIndex: () => `index:customers`,
  report: (cid: string, rid: string) => `report:${cid}:${rid}`,
  reportIndex: (cid: string) => `index:reports:${cid}`,
  audit: (rid: string) => `audit:${rid}`
} as const;

/** 从 KV 读 JSON，读不到返回 null */
export async function kvGetJson<T>(
  kv: KVNamespace,
  key: string
): Promise<T | null> {
  const raw = await kv.get(key, { type: 'text' });
  if (raw === null || raw === undefined) return null;
  try {
    return JSON.parse(raw as string) as T;
  } catch {
    return null;
  }
}

/** 往 KV 写 JSON */
export async function kvPutJson<T>(
  kv: KVNamespace,
  key: string,
  value: T
): Promise<void> {
  await kv.put(key, JSON.stringify(value));
}

export async function kvDelete(kv: KVNamespace, key: string): Promise<void> {
  await kv.delete(key);
}

/**
 * 往一个"索引列表"追加一项（幂等：重复的 id 不会重复添加）
 * 我们用 KV 里的 JSON 数组模拟一个轻量索引，方便批量列出
 */
export async function kvIndexAppend(
  kv: KVNamespace,
  indexKey: string,
  id: string
): Promise<void> {
  const existing = (await kvGetJson<string[]>(kv, indexKey)) ?? [];
  if (existing.includes(id)) return;
  // 新的在前面，列表展示时天然按"最新在前"
  existing.unshift(id);
  await kvPutJson(kv, indexKey, existing);
}

export async function kvIndexRemove(
  kv: KVNamespace,
  indexKey: string,
  id: string
): Promise<void> {
  const existing = (await kvGetJson<string[]>(kv, indexKey)) ?? [];
  const next = existing.filter((x) => x !== id);
  await kvPutJson(kv, indexKey, next);
}

export async function kvIndexGet(
  kv: KVNamespace,
  indexKey: string
): Promise<string[]> {
  return (await kvGetJson<string[]>(kv, indexKey)) ?? [];
}
