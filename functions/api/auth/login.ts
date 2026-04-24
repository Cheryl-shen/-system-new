/**
 * POST /api/auth/login
 * 用户登录，校验密码，返回 JWT 和用户信息
 * Body: { username: string, password: string }
 *
 * 兼容策略（为保证首次部署、未配置 KV / JWT_SECRET 时也能登录）：
 *   1. 先匹配"内置凭据"（Tencent / Tencent2026）——不依赖 KV
 *   2. 否则走 KV 里的账号体系（通过 init-kv 写入）
 *
 * 同时对整个 handler 加全局 try/catch，任何异常都返回 JSON，
 * 避免 EdgeOne 返回 HTML 500 导致前端报"服务器返回非 JSON 数据"。
 */

import { ok, errors, readJson } from '../../_lib/response';
import { verifyPassword } from '../../_lib/password';
import { signToken, getUserByUsername } from '../../_lib/auth';
import type { EdgeEnv } from '../../_lib/kv';

interface LoginBody {
  username?: string;
  password?: string;
}

// 内置应急账号：即使 KV 没初始化也能登录
const BUILTIN_USERS: Array<{
  username: string;
  password: string;
  displayName: string;
  role: 'admin' | 'manager';
  customerIds: string[];
}> = [
  {
    username: 'Tencent',
    password: 'Tencent2026',
    displayName: 'Tencent',
    role: 'admin',
    customerIds: []
  }
];

export async function onRequestPost(context: {
  request: Request;
  env: EdgeEnv;
}): Promise<Response> {
  const { request, env } = context;

  try {
    let body: LoginBody;
    try {
      body = await readJson<LoginBody>(request);
    } catch {
      return errors.badRequest('请求体不是合法 JSON');
    }

    const username = (body.username || '').trim();
    const password = body.password || '';

    if (!username || !password) {
      return errors.badRequest('用户名和密码均不能为空');
    }

    // 1) 优先匹配内置应急账号（不依赖 KV）
    const builtin = BUILTIN_USERS.find((u) => u.username === username);
    if (builtin) {
      if (builtin.password !== password) {
        return errors.unauthorized('用户名或密码错误');
      }
      const token = await signToken(
        {
          sub: builtin.username,
          role: builtin.role,
          customerIds: builtin.customerIds,
          displayName: builtin.displayName
        },
        env.JWT_SECRET
      );
      return ok({
        token,
        user: {
          username: builtin.username,
          displayName: builtin.displayName,
          role: builtin.role,
          customerIds: builtin.customerIds
        }
      });
    }

    // 2) 再走 KV（需要已初始化 KV 并绑定 REPORTS_KV）
    if (!env.REPORTS_KV) {
      return errors.unauthorized('用户名或密码错误');
    }

    const user = await getUserByUsername(env, username);
    if (!user) {
      return errors.unauthorized('用户名或密码错误');
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return errors.unauthorized('用户名或密码错误');
    }

    const token = await signToken(
      {
        sub: user.username,
        role: user.role,
        customerIds: user.customerIds,
        displayName: user.displayName
      },
      env.JWT_SECRET
    );

    return ok({
      token,
      user: {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        customerIds: user.customerIds
      }
    });
  } catch (e) {
    // 最后一道防线：绝不让 EdgeOne 把异常渲染成 HTML
    const msg = e instanceof Error ? e.message : String(e);
    return errors.serverError('登录服务异常', msg);
  }
}
