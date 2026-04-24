/**
 * 审计日志工具：记录汇报的创建/更新/归档/恢复
 */

import type { EdgeEnv } from './kv';
import { KEYS, kvGetJson, kvPutJson } from './kv';

export type AuditAction = 'create' | 'update' | 'archive' | 'restore';

export interface AuditEntry {
  action: AuditAction;
  user: string;       // username
  displayName: string;
  at: string;         // ISO time
  summary?: string;   // 简短描述，比如 "修改了标题"、"更新了商机数据"
}

const MAX_ENTRIES = 200; // 单份汇报最多保留 200 条审计，够用

export async function appendAudit(
  env: EdgeEnv,
  reportId: string,
  entry: AuditEntry
): Promise<void> {
  const list = (await kvGetJson<AuditEntry[]>(env.REPORTS_KV, KEYS.audit(reportId))) ?? [];
  list.unshift(entry); // 最新在前
  const trimmed = list.slice(0, MAX_ENTRIES);
  await kvPutJson(env.REPORTS_KV, KEYS.audit(reportId), trimmed);
}

export async function listAudit(
  env: EdgeEnv,
  reportId: string
): Promise<AuditEntry[]> {
  return (await kvGetJson<AuditEntry[]>(env.REPORTS_KV, KEYS.audit(reportId))) ?? [];
}
