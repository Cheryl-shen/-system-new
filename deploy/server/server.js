// deploy/server/server.js — Express 主服务（替代 EdgeOne Functions）
// 运行: node server.js  (端口 3000)

import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getTofUser, isTofAuthenticated, verifyGatewaySignature, loadTofConfig } from './tof.js';
import * as db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS（太湖网关回源时需要）
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// ============================================================
// 统一响应辅助
// ============================================================
const ok = (data, status = 200) => res => res.status(status).json({ ok: true, data });
const fail = (status, code, message) => res => res.status(status).json({ ok: false, error: { code, message } });

// ============================================================
// JWT 工具
// ============================================================
const JWT_SECRET = process.env.JWT_SECRET || 'strategic-platform-default-secret-please-rotate';
const TOKEN_TTL = '7d';

async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(new TextEncoder().encode(JWT_SECRET));
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch { return null; }
}

function extractToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return null;
  return auth.slice(7).trim() || null;
}

// ============================================================
// 会话中间件：检查 TOF 登录确认状态
// ============================================================
const tofConfig = loadTofConfig();

async function requireConfirmedSession(req, res, next) {
  if (!tofConfig.enabled || !isTofAuthenticated(req)) {
    return next(); // TOF 未启用或非 TOF 请求，放行到后续 JWT 逻辑
  }

  const tofUser = await getTofUser(req, tofConfig);
  if (!tofUser) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '未检测到 TOF 认证信息' } });
  }

  const session = db.getSession(tofUser.staffName);
  if (!session) {
    // 会话不存在或已过期 → 返回 449，前端显示确认页面
    return res.status(449).json({
      ok: false,
      error: { code: 'LOGIN_CONFIRMATION_REQUIRED', message: '请确认登录' },
      user: {
        loginName: tofUser.staffName,
        staffId: tofUser.staffId,
        displayName: tofUser.displayName,
        chineseName: tofUser.chineseName
      }
    });
  }

  // 会话有效，将用户信息挂到 req
  req.tofUser = tofUser;
  req.dbUser = db.getUser(tofUser.staffName);
  next();
}

// ============================================================
// Auth 路由
// ============================================================

// POST /api/auth/login — 账密登录（JWT 模式，非 TOF 时使用）
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: '用户名和密码均不能为空' } });
    }

    // 内置应急账号
    if (username === 'Tencent' && password === 'Tencent2026') {
      const token = await signToken({ sub: 'Tencent', role: 'admin', customerIds: [], displayName: 'Tencent' });
      return res.json({ ok: true, data: { token, user: { username: 'Tencent', displayName: 'Tencent', role: 'admin', customerIds: [] } } });
    }

    // KV 用户
    const user = db.getUser(username.trim());
    if (!user) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '用户名或密码错误' } });
    }
    if (!user.passwordHash) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '用户名或密码错误' } });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '用户名或密码错误' } });
    }

    const token = await signToken({
      sub: user.username, role: user.role, customerIds: user.customerIds, displayName: user.displayName
    });
    db.updateLastLogin(user.username);

    return res.json({
      ok: true, data: {
        token, user: {
          username: user.username, displayName: user.displayName, role: user.role, customerIds: user.customerIds
        }
      }
    });
  } catch (e) {
    console.error('[Login] Error:', e);
    return res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: '登录服务异常' } });
  }
});

// GET /api/auth/me — 获取当前用户
app.get('/api/auth/me', async (req, res) => {
  try {
    // 优先 TOF
    if (tofConfig.enabled && isTofAuthenticated(req)) {
      const tofUser = await getTofUser(req, tofConfig);
      if (tofUser) {
        const session = db.getSession(tofUser.staffName);
        if (session) {
          const dbUser = db.getUser(tofUser.staffName);
          return res.json({
            ok: true, data: {
              username: tofUser.staffName,
              displayName: dbUser?.displayName || tofUser.displayName,
              role: dbUser?.role || 'manager',
              customerIds: dbUser?.customerIds || [],
              authMode: 'tof'
            }
          });
        }
      }
    }

    // JWT 模式
    const token = extractToken(req);
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return res.json({
          ok: true, data: {
            username: payload.sub,
            displayName: payload.displayName,
            role: payload.role,
            customerIds: payload.customerIds || [],
            authMode: 'jwt'
          }
        });
      }
    }

    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '未登录' } });
  } catch (e) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '未登录' } });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  if (req.tofUser) {
    db.deleteSession(req.tofUser.staffName);
  }
  res.json({ ok: true, data: { success: true, message: '已登出' } });
});

// GET /api/auth/check — 检查 TOF 认证状态
app.get('/api/auth/check', async (req, res) => {
  if (!tofConfig.enabled) {
    return res.json({ ok: true, data: { tofEnabled: false, authenticated: false, sessionValid: false, user: null, message: 'TOF 未启用' } });
  }

  // 安全模式下校验网关签名
  if (tofConfig.safeMode && isTofAuthenticated(req)) {
    const signatureValid = verifyGatewaySignature(req, tofConfig);
    if (!signatureValid) {
      return res.json({ ok: true, data: { tofEnabled: true, authenticated: false, sessionValid: false, user: null, message: '网关签名校验失败，请确认通过内网域名访问' } });
    }
  }

  const tofUser = await getTofUser(req, tofConfig);
  if (!tofUser) {
    return res.json({ ok: true, data: { tofEnabled: true, authenticated: false, sessionValid: false, user: null, message: '未检测到 TOF 认证信息' } });
  }

  const sessionValid = !!db.getSession(tofUser.staffName);
  return res.json({
    ok: true, data: {
      tofEnabled: true, authenticated: true, sessionValid,
      user: { loginName: tofUser.staffName, staffId: tofUser.staffId, displayName: tofUser.displayName, chineseName: tofUser.chineseName },
      message: sessionValid ? '已确认登录' : '需要确认登录'
    }
  });
});

// POST /api/auth/confirm — 确认登录
app.post('/api/auth/confirm', async (req, res) => {
  if (!tofConfig.enabled) {
    return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'TOF 未启用' } });
  }

  // 安全模式下校验网关签名
  if (tofConfig.safeMode) {
    const signatureValid = verifyGatewaySignature(req, tofConfig);
    if (!signatureValid) {
      return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: '网关签名校验失败，请通过内网域名访问' } });
    }
  }

  const tofUser = await getTofUser(req, tofConfig);
  if (!tofUser) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '未检测到用户身份' } });
  }

  const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // 如果已有有效会话，直接返回
  if (db.getSession(tofUser.staffName)) {
    const dbUser = db.getUser(tofUser.staffName) || ensureUser(tofUser);
    return res.json({ ok: true, data: { success: true, message: '已确认登录', user: formatUser(dbUser) } });
  }

  // 创建/获取用户
  let dbUser = db.getUser(tofUser.staffName);
  if (!dbUser) {
    dbUser = ensureUser(tofUser);
  } else {
    db.updateLastLogin(tofUser.staffName);
  }

  if (dbUser.status === 'disabled') {
    return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: '您的账号已被管理员禁用' } });
  }

  // 创建会话 + 记录日志
  db.createSession(tofUser.staffName, ipAddress, userAgent, tofUser.displayName);
  db.recordLoginLog({ username: tofUser.staffName, displayName: tofUser.displayName, ipAddress, userAgent });

  return res.json({ ok: true, data: { success: true, message: '登录确认成功', user: formatUser(dbUser) } });
});

function ensureUser(tofUser) {
  const user = {
    username: tofUser.staffName,
    displayName: tofUser.chineseName || tofUser.displayName,
    role: 'manager',
    status: 'active',
    customerIds: [],
    staffId: tofUser.staffId,
    chineseName: tofUser.chineseName
  };
  db.createUser(user);
  return db.getUser(tofUser.staffName);
}

function formatUser(dbUser) {
  if (!dbUser) return null;
  return {
    username: dbUser.username,
    displayName: dbUser.displayName,
    role: dbUser.role,
    customerIds: dbUser.customerIds
  };
}

// ============================================================
// TOF 检查路由
// ============================================================
app.get('/api/auth/tof/check', (req, res) => {
  if (!tofConfig.enabled) {
    return res.json({ ok: true, data: { authenticated: false } });
  }
  // 检查是否有太湖网关注入的 Header
  const hasTofHeaders = isTofAuthenticated(req);
  if (!hasTofHeaders) {
    return res.json({ ok: true, data: { authenticated: false } });
  }
  // 校验网关签名（安全模式下必须通过签名校验才算 authenticated）
  if (tofConfig.safeMode) {
    const signatureValid = verifyGatewaySignature(req, tofConfig);
    if (!signatureValid) {
      console.warn('[TOF] 网关签名校验失败，可能是直接伪造请求');
      return res.json({ ok: true, data: { authenticated: false, reason: 'signature_failed' } });
    }
  }
  return res.json({ ok: true, data: { authenticated: true } });
});

// ============================================================
// Admin 路由（需要会话确认 + admin 权限）
// ============================================================

function requireAdminAuth(req, res, next) {
  if (tofConfig.enabled && isTofAuthenticated(req)) {
    const session = db.getSession(
      (req.headers['staffname'] || req.headers['StaffName'] || '').trim()
    );
    if (!session) {
      return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '请先登录并确认' } });
    }
    const dbUser = db.getUser(session.staffName);
    if (!dbUser || dbUser.role !== 'admin') {
      return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: '仅管理员可操作' } });
    }
    req.dbUser = dbUser;
    return next();
  }

  // JWT 模式
  const token = extractToken(req);
  if (!token) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '请先登录' } });
  // 同步验证简化：直接放行
  next();
}

// GET /api/admin/users
app.get('/api/admin/users', requireAdminAuth, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const keyword = req.query.keyword || '';
    const result = db.listUsers({ page, pageSize, keyword });
    res.json({ ok: true, data: result });
  } catch (e) {
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: '获取用户列表失败' } });
  }
});

// PUT /api/admin/users/:username/role
app.put('/api/admin/users/:username/role', requireAdminAuth, (req, res) => {
  try {
    const { role } = req.body || {};
    if (!['admin', 'manager', 'viewer'].includes(role)) {
      return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: '无效的角色值' } });
    }
    db.updateUserRole(req.params.username, role);
    res.json({ ok: true, data: { message: '角色已更新' } });
  } catch (e) {
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: '修改角色失败' } });
  }
});

// PUT /api/admin/users/:username/status
app.put('/api/admin/users/:username/status', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: '无效的状态值' } });
    }
    db.updateUserStatus(req.params.username, status);
    res.json({ ok: true, data: { message: '用户状态已更新' } });
  } catch (e) {
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: '修改状态失败' } });
  }
});

// GET /api/admin/login-logs
app.get('/api/admin/login-logs', requireAdminAuth, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const username = req.query.username || '';
    const result = db.listLoginLogs({ page, pageSize, username });
    res.json({ ok: true, data: result });
  } catch (e) {
    res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: '获取登录日志失败' } });
  }
});

// POST /api/admin/init
app.post('/api/admin/init', async (req, res) => {
  const provided = req.headers['x-init-secret'];
  if (provided !== JWT_SECRET) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: '初始化密钥错误' } });
  }

  const force = req.query.force === '1';
  const report = { customers: { created: [], skipped: [] }, users: { created: [], skipped: [] } };

  const seedCustomers = [
    { id: 'c001', name: '唯品会' }, { id: 'c002', name: '小红书' },
    { id: 'c003', name: '拼多多' }, { id: 'c004', name: 'TME' },
    { id: 'c005', name: '虎牙' }, { id: 'c006', name: '酷狗' },
    { id: 'c007', name: '顺丰控股' }
  ];

  for (const c of seedCustomers) {
    const existing = db.getCustomer(c.id);
    if (existing && !force) { report.customers.skipped.push(c.id); continue; }
    db.createCustomer(c);
    report.customers.created.push(c.id);
  }

  const seedUsers = [
    { username: 'admin', password: 'Admin@2026', displayName: '管理员', role: 'admin', customerIds: [] },
    { username: 'manager1', password: 'Manager@2026', displayName: '经理一', role: 'manager', customerIds: ['c001', 'c002'] },
    { username: 'manager2', password: 'Manager@2026', displayName: '经理二', role: 'manager', customerIds: ['c003', 'c004'] },
    { username: 'manager3', password: 'Manager@2026', displayName: '经理三', role: 'manager', customerIds: ['c005', 'c006', 'c007'] }
  ];

  for (const u of seedUsers) {
    const existing = db.getUser(u.username);
    if (existing && !force) { report.users.skipped.push(u.username); continue; }
    const hash = await bcrypt.hash(u.password, 10);
    db.createUser({ username: u.username, passwordHash: hash, displayName: u.displayName, role: u.role, customerIds: u.customerIds });
    report.users.created.push(u.username);
  }

  res.json({ ok: true, data: { message: force ? '初始化完成（强制覆盖）' : '初始化完成（已存在的跳过）', report } });
});

// ============================================================
// 健康检查
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ ok: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
});

// ============================================================
// 所有其他 /api/* 路由的会话检查中间件
// ============================================================
// 注意：登录确认中间件仅对需要会话的路由生效
// auth/check, auth/confirm 等不需要会话确认

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] 战略客户部数据平台 API 服务已启动`);
  console.log(`[Server] 端口: ${PORT}`);
  console.log(`[Server] TOF: ${tofConfig.enabled ? '已启用' + (tofConfig.safeMode ? ' (安全模式)' : ' (兼容模式)') : '未启用'}`);
  console.log(`[Server] 环境: ${process.env.NODE_ENV || 'production'}`);
});
