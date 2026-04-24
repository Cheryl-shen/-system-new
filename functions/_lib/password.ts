/**
 * 密码哈希与校验
 * 用 bcryptjs（纯 JS，EdgeOne Functions 兼容）
 */

// @ts-ignore  bcryptjs 没有严格 ESM 类型在 Functions 环境下，按 CommonJS 用法拿
import bcrypt from 'bcryptjs';

const ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}
