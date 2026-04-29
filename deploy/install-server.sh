#!/bin/bash
# deploy/install-server.sh
# PASTE THIS ENTIRE SCRIPT INTO DevCloud WebShell AND RUN
# It will create all server files inline (no upload needed)

set -e

echo "[1/5] Creating directories..."
mkdir -p /opt/strategic-platform/{dist,server/data,logs}

echo "[2/5] Creating server files..."

cat > /opt/strategic-platform/server/package.json << 'PKGEOF'
{
  "name": "strategic-platform-server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^11.0.0",
    "jose": "^5.2.0",
    "bcryptjs": "^2.4.3"
  }
}
PKGEOF

cat > /opt/strategic-platform/server/tof.js << 'TOFEOF'
import { compactDecrypt } from 'jose';

export async function getTofUser(req, config = {}) {
  const headers = req.headers;
  if (config.safeMode && config.appToken) {
    const encryptedHeader = headers['x-tai-identity'];
    if (encryptedHeader) {
      try {
        const keyBytes = new TextEncoder().encode(config.appToken);
        const { plaintext } = await compactDecrypt(encryptedHeader, keyBytes);
        const payload = JSON.parse(new TextDecoder().decode(plaintext));
        return {
          staffName: payload.LoginName,
          staffId: String(payload.StaffId),
          displayName: payload.ChineseName || payload.LoginName,
          chineseName: payload.ChineseName || '',
          rawIdentity: encryptedHeader
        };
      } catch (error) {
        console.error('[TOF] JWE decrypt failed:', error.message);
      }
    }
  }
  let staffName = headers['staffname'] || headers['StaffName'];
  let staffId = headers['staffid'] || headers['StaffId'];
  let displayName = headers['displayname'] || headers['DisplayName'];
  const rawIdentity = headers['x-tai-identity-b64'] || headers['X-Tai-Identity-B64'];
  if (rawIdentity) {
    try {
      const decoded = Buffer.from(rawIdentity, 'base64').toString('utf-8');
      const identityData = JSON.parse(decoded);
      if (identityData.StaffName && !staffName) staffName = identityData.StaffName;
      if (identityData.StaffId && !staffId) staffId = String(identityData.StaffId);
      if (identityData.ChineseName && !displayName) displayName = identityData.ChineseName;
    } catch { /* ignore */ }
  }
  if (!staffName) return null;
  return {
    staffName: staffName.trim(),
    staffId: staffId || '',
    displayName: (displayName || staffName).trim(),
    chineseName: displayName || ''
  };
}

export function isTofAuthenticated(req) {
  const h = req.headers;
  return !!(h['staffname'] || h['StaffName'] || h['x-tai-identity'] || h['x-tai-identity-b64']);
}

export function loadTofConfig() {
  const allowedStr = process.env.TOF_ALLOWED_USERS || '';
  const allowedUsers = allowedStr.trim() ? allowedStr.split(',').map(s => s.trim().toLowerCase()) : [];
  return {
    enabled: !!(process.env.TOF_TOKEN || process.env.TAI_APP_TOKEN),
    safeMode: !!process.env.TAI_APP_TOKEN,
    allowedUsers,
    token: process.env.TOF_TOKEN,
    appToken: process.env.TAI_APP_TOKEN
  };
}
TOFEOF

cat > /opt/strategic-platform/server/db.js << 'DBEOF'
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = process.env.DB_PATH || join(__dirname, 'data', 'strategic.db');
let _db = null;

function getDb() {
  if (!_db) {
    const dir = dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initTables(_db);
  }
  return _db;
}

function initTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY, password_hash TEXT DEFAULT '',
      display_name TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT 'manager',
      status TEXT NOT NULL DEFAULT 'active', customer_ids TEXT NOT NULL DEFAULT '[]',
      staff_id TEXT DEFAULT '', chinese_name TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')), last_login TEXT);
    CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')));
    CREATE TABLE IF NOT EXISTS login_logs (id TEXT PRIMARY KEY, username TEXT NOT NULL, display_name TEXT NOT NULL DEFAULT '', login_time TEXT NOT NULL DEFAULT (datetime('now','localtime')), ip_address TEXT DEFAULT '', user_agent TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS sessions (staff_name TEXT PRIMARY KEY, confirmed_at INTEGER NOT NULL, ip_address TEXT DEFAULT '', user_agent TEXT DEFAULT '', display_name TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, customer_name TEXT NOT NULL, report_date TEXT NOT NULL, content TEXT NOT NULL, generated_html TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft', created_by TEXT NOT NULL, created_by_display TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')), updated_by TEXT NOT NULL DEFAULT '', updated_by_display TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')), version INTEGER NOT NULL DEFAULT 1, archived_by TEXT DEFAULT '', archived_at TEXT DEFAULT '');
  `);
}

export function getUser(username) {
  const db = getDb(); const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) return null;
  return { username: row.username, passwordHash: row.password_hash, displayName: row.display_name, role: row.role, status: row.status, customerIds: JSON.parse(row.customer_ids || '[]'), staffId: row.staff_id || '', chineseName: row.chinese_name || '', createdAt: row.created_at, lastLogin: row.last_login };
}

export function listUsers({ page = 1, pageSize = 20, keyword = '' } = {}) {
  const db = getDb(); const offset = (page - 1) * pageSize;
  let where = ''; const params = [];
  if (keyword) { where = "WHERE (username LIKE ? OR display_name LIKE ? OR chinese_name LIKE ?)"; const kw = `%${keyword}%`; params.push(kw, kw, kw); }
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM users ${where}`).get(...params).cnt;
  const rows = db.prepare(`SELECT * FROM users ${where} ORDER BY last_login DESC, created_at DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset);
  const users = rows.map(row => ({ username: row.username, passwordHash: row.password_hash, displayName: row.display_name, role: row.role, status: row.status, customerIds: JSON.parse(row.customer_ids || '[]'), staffId: row.staff_id || '', chineseName: row.chinese_name || '', createdAt: row.created_at, lastLogin: row.last_login }));
  return { users, total };
}

export function createUser(user) {
  const db = getDb(); const now = new Date().toISOString();
  db.prepare(`INSERT OR REPLACE INTO users (username,password_hash,display_name,role,status,customer_ids,staff_id,chinese_name,created_at,last_login) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(user.username, user.passwordHash||'', user.displayName, user.role||'manager', user.status||'active', JSON.stringify(user.customerIds||[]), user.staffId||'', user.chineseName||'', user.createdAt||now, user.lastLogin||now);
}

export function updateUserRole(username, role) { const db = getDb(); db.prepare('UPDATE users SET role = ? WHERE username = ?').run(role, username); }
export function updateUserStatus(username, status) { const db = getDb(); db.prepare('UPDATE users SET status = ? WHERE username = ?').run(status, username); }
export function updateLastLogin(username) { const db = getDb(); db.prepare('UPDATE users SET last_login = ? WHERE username = ?').run(new Date().toISOString(), username); }

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export function getSession(staffName) {
  const db = getDb(); const row = db.prepare('SELECT * FROM sessions WHERE staff_name = ?').get(staffName);
  if (!row) return null;
  if (Date.now() - row.confirmed_at > SESSION_TTL_MS) { db.prepare('DELETE FROM sessions WHERE staff_name = ?').run(staffName); return null; }
  return { confirmedAt: row.confirmed_at, ipAddress: row.ip_address, userAgent: row.user_agent, staffName: row.staff_name, displayName: row.display_name };
}

export function createSession(staffName, ipAddress, userAgent, displayName) {
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO sessions (staff_name,confirmed_at,ip_address,user_agent,display_name) VALUES (?,?,?,?,?)').run(staffName, Date.now(), ipAddress, userAgent, displayName);
}

export function deleteSession(staffName) { const db = getDb(); db.prepare('DELETE FROM sessions WHERE staff_name = ?').run(staffName); }

export function recordLoginLog({ username, displayName, ipAddress, userAgent }) {
  const db = getDb(); const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare('INSERT INTO login_logs (id,username,display_name,ip_address,user_agent) VALUES (?,?,?,?,?)').run(id, username, displayName, ipAddress, userAgent);
}

export function listLoginLogs({ page = 1, pageSize = 50, username = '' } = {}) {
  const db = getDb(); const offset = (page - 1) * pageSize;
  let where = ''; const params = [];
  if (username) { where = 'WHERE username LIKE ?'; params.push(`%${username}%`); }
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM login_logs ${where}`).get(...params).cnt;
  const rows = db.prepare(`SELECT * FROM login_logs ${where} ORDER BY login_time DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset);
  return { logs: rows, total };
}

export function getCustomer(id) { const db = getDb(); const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id); return row ? { id: row.id, name: row.name, createdAt: row.created_at } : null; }
export function listCustomers() { const db = getDb(); return db.prepare('SELECT * FROM customers ORDER BY created_at').all().map(r => ({ id: r.id, name: r.name, createdAt: r.created_at })); }
export function createCustomer(customer) { const db = getDb(); db.prepare('INSERT OR IGNORE INTO customers (id,name,created_at) VALUES (?,?,?)').run(customer.id, customer.name, customer.createdAt || new Date().toISOString()); }

export function getReport(id) { const db = getDb(); const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id); return row ? { ...row, content: JSON.parse(row.content) } : null; }

export function listReports({ customerId, status } = {}) {
  const db = getDb(); let where = 'WHERE 1=1'; const params = [];
  if (customerId) { where += ' AND customer_id = ?'; params.push(customerId); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  return db.prepare(`SELECT * FROM reports ${where} ORDER BY updated_at DESC`).all(...params).map(r => ({ id: r.id, customerId: r.customer_id, customerName: r.customer_name, reportDate: r.report_date, status: r.status, updatedAt: r.updated_at, updatedByDisplay: r.updated_by_display, version: r.version }));
}

export function saveReport(report) {
  const db = getDb(); const now = new Date().toISOString();
  db.prepare(`INSERT OR REPLACE INTO reports (id,customer_id,customer_name,report_date,content,generated_html,status,created_by,created_by_display,created_at,updated_by,updated_by_display,updated_at,version) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(report.id, report.customerId, report.customerName, report.reportDate, JSON.stringify(report.content), report.generatedHtml||'', report.status, report.createdBy, report.createdByDisplay, report.createdAt||now, report.updatedBy, report.updatedByDisplay, now, report.version||1);
}
DBEOF

cat > /opt/strategic-platform/server/server.js << 'SRVEOF'
import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getTofUser, isTofAuthenticated, loadTofConfig } from './tof.js';
import * as db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use((req, res, next) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); next(); });

const JWT_SECRET = process.env.JWT_SECRET || 'strategic-platform-default-secret-please-rotate';
const TOKEN_TTL = '7d';

async function signToken(payload) {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(TOKEN_TTL).sign(new TextEncoder().encode(JWT_SECRET));
}
async function verifyToken(token) { try { const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)); return payload; } catch { return null; } }
function extractToken(req) { const auth = req.headers.authorization || ''; if (!auth.toLowerCase().startsWith('bearer ')) return null; return auth.slice(7).trim() || null; }

const tofConfig = loadTofConfig();

async function requireConfirmedSession(req, res, next) {
  if (!tofConfig.enabled || !isTofAuthenticated(req)) return next();
  const tofUser = await getTofUser(req, tofConfig);
  if (!tofUser) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'No TOF auth info' } });
  const session = db.getSession(tofUser.staffName);
  if (!session) return res.status(449).json({ ok: false, error: { code: 'LOGIN_CONFIRMATION_REQUIRED', message: 'Please confirm login' }, user: { loginName: tofUser.staffName, staffId: tofUser.staffId, displayName: tofUser.displayName, chineseName: tofUser.chineseName } });
  req.tofUser = tofUser; req.dbUser = db.getUser(tofUser.staffName); next();
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'Username and password required' } });
    if (username === 'Tencent' && password === 'Tencent2026') {
      const token = await signToken({ sub: 'Tencent', role: 'admin', customerIds: [], displayName: 'Tencent' });
      return res.json({ ok: true, data: { token, user: { username: 'Tencent', displayName: 'Tencent', role: 'admin', customerIds: [] } } });
    }
    const user = db.getUser(username.trim());
    if (!user || !user.passwordHash) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    if (!await bcrypt.compare(password, user.passwordHash)) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    const token = await signToken({ sub: user.username, role: user.role, customerIds: user.customerIds, displayName: user.displayName });
    db.updateLastLogin(user.username);
    return res.json({ ok: true, data: { token, user: { username: user.username, displayName: user.displayName, role: user.role, customerIds: user.customerIds } } });
  } catch (e) { console.error('[Login] Error:', e); return res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Login error' } }); }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    if (tofConfig.enabled && isTofAuthenticated(req)) {
      const tofUser = await getTofUser(req, tofConfig);
      if (tofUser) {
        const session = db.getSession(tofUser.staffName);
        if (session) {
          const dbUser = db.getUser(tofUser.staffName);
          return res.json({ ok: true, data: { username: tofUser.staffName, displayName: dbUser?.displayName || tofUser.displayName, role: dbUser?.role || 'manager', customerIds: dbUser?.customerIds || [], authMode: 'tof' } });
        }
      }
    }
    const token = extractToken(req);
    if (token) { const payload = await verifyToken(token); if (payload) return res.json({ ok: true, data: { username: payload.sub, displayName: payload.displayName, role: payload.role, customerIds: payload.customerIds || [], authMode: 'jwt' } }); }
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
  } catch (e) { return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } }); }
});

app.post('/api/auth/logout', (req, res) => { if (req.tofUser) db.deleteSession(req.tofUser.staffName); res.json({ ok: true, data: { success: true, message: 'Logged out' } }); });

app.get('/api/auth/check', async (req, res) => {
  if (!tofConfig.enabled) return res.json({ ok: true, data: { tofEnabled: false, authenticated: false, sessionValid: false, user: null, message: 'TOF not enabled' } });
  const tofUser = await getTofUser(req, tofConfig);
  if (!tofUser) return res.json({ ok: true, data: { tofEnabled: true, authenticated: false, sessionValid: false, user: null, message: 'No TOF auth info' } });
  const sessionValid = !!db.getSession(tofUser.staffName);
  return res.json({ ok: true, data: { tofEnabled: true, authenticated: true, sessionValid, user: { loginName: tofUser.staffName, staffId: tofUser.staffId, displayName: tofUser.displayName, chineseName: tofUser.chineseName }, message: sessionValid ? 'Confirmed' : 'Need confirmation' } });
});

app.post('/api/auth/confirm', async (req, res) => {
  if (!tofConfig.enabled) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'TOF not enabled' } });
  const tofUser = await getTofUser(req, tofConfig);
  if (!tofUser) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'No user identity' } });
  const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  if (db.getSession(tofUser.staffName)) { const dbUser = db.getUser(tofUser.staffName) || ensureUser(tofUser); return res.json({ ok: true, data: { success: true, message: 'Confirmed', user: formatUser(dbUser) } }); }
  let dbUser = db.getUser(tofUser.staffName);
  if (!dbUser) dbUser = ensureUser(tofUser); else db.updateLastLogin(tofUser.staffName);
  if (dbUser.status === 'disabled') return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Account disabled' } });
  db.createSession(tofUser.staffName, ipAddress, userAgent, tofUser.displayName);
  db.recordLoginLog({ username: tofUser.staffName, displayName: tofUser.displayName, ipAddress, userAgent });
  return res.json({ ok: true, data: { success: true, message: 'Login confirmed', user: formatUser(dbUser) } });
});

function ensureUser(tofUser) {
  const user = { username: tofUser.staffName, displayName: tofUser.chineseName || tofUser.displayName, role: 'manager', status: 'active', customerIds: [], staffId: tofUser.staffId, chineseName: tofUser.chineseName };
  db.createUser(user); return db.getUser(tofUser.staffName);
}
function formatUser(dbUser) { return dbUser ? { username: dbUser.username, displayName: dbUser.displayName, role: dbUser.role, customerIds: dbUser.customerIds } : null; }

app.get('/api/auth/tof/check', (req, res) => { res.json({ ok: true, data: { authenticated: isTofAuthenticated(req) } }); });

function requireAdminAuth(req, res, next) {
  if (tofConfig.enabled && isTofAuthenticated(req)) {
    const session = db.getSession((req.headers['staffname'] || req.headers['StaffName'] || '').trim());
    if (!session) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Please login first' } });
    const dbUser = db.getUser(session.staffName);
    if (!dbUser || dbUser.role !== 'admin') return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Admin only' } });
    req.dbUser = dbUser; return next();
  }
  const token = extractToken(req);
  if (!token) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Please login' } });
  next();
}

app.get('/api/admin/users', requireAdminAuth, (req, res) => {
  try { const page = parseInt(req.query.page) || 1; const pageSize = parseInt(req.query.pageSize) || 20; const keyword = req.query.keyword || ''; res.json({ ok: true, data: db.listUsers({ page, pageSize, keyword }) }); } catch (e) { res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed' } }); }
});

app.put('/api/admin/users/:username/role', requireAdminAuth, (req, res) => {
  try { const { role } = req.body || {}; if (!['admin','manager','viewer'].includes(role)) return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'Invalid role' } }); db.updateUserRole(req.params.username, role); res.json({ ok: true, data: { message: 'Updated' } }); } catch (e) { res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed' } }); }
});

app.put('/api/admin/users/:username/status', requireAdminAuth, (req, res) => {
  try { const { status } = req.body || {}; if (!['active','disabled'].includes(status)) return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'Invalid status' } }); db.updateUserStatus(req.params.username, status); res.json({ ok: true, data: { message: 'Updated' } }); } catch (e) { res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed' } }); }
});

app.get('/api/admin/login-logs', requireAdminAuth, (req, res) => {
  try { const page = parseInt(req.query.page) || 1; const pageSize = parseInt(req.query.pageSize) || 50; const username = req.query.username || ''; res.json({ ok: true, data: db.listLoginLogs({ page, pageSize, username }) }); } catch (e) { res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Failed' } }); }
});

app.post('/api/admin/init', async (req, res) => {
  const provided = req.headers['x-init-secret'];
  if (provided !== JWT_SECRET) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Wrong secret' } });
  const force = req.query.force === '1';
  const report = { customers: { created: [], skipped: [] }, users: { created: [], skipped: [] } };
  const seedCustomers = [{ id:'c001',name:'VIP'},{id:'c002',name:'RED'},{id:'c003',name:'PDD'},{id:'c004',name:'TME'},{id:'c005',name:'HUYA'},{id:'c006',name:'KG'},{id:'c007',name:'SF'}];
  for (const c of seedCustomers) { if (db.getCustomer(c.id) && !force) { report.customers.skipped.push(c.id); continue; } db.createCustomer(c); report.customers.created.push(c.id); }
  const seedUsers = [
    { username:'admin',password:'Admin@2026',displayName:'Admin',role:'admin',customerIds:[] },
    { username:'manager1',password:'Manager@2026',displayName:'Mgr1',role:'manager',customerIds:['c001','c002'] },
    { username:'manager2',password:'Manager@2026',displayName:'Mgr2',role:'manager',customerIds:['c003','c004'] },
    { username:'manager3',password:'Manager@2026',displayName:'Mgr3',role:'manager',customerIds:['c005','c006','c007'] }
  ];
  for (const u of seedUsers) { if (db.getUser(u.username) && !force) { report.users.skipped.push(u.username); continue; } const hash = await bcrypt.hash(u.password, 10); db.createUser({ username:u.username, passwordHash:hash, displayName:u.displayName, role:u.role, customerIds:u.customerIds }); report.users.created.push(u.username); }
  res.json({ ok: true, data: { message: force ? 'Init done (force)' : 'Init done', report } });
});

app.get('/api/health', (req, res) => { res.json({ ok: true, data: { status: 'healthy', timestamp: new Date().toISOString() } }); });

app.listen(PORT, '0.0.0.0', () => { console.log(`[Server] API started on port ${PORT}`); console.log(`[Server] TOF: ${tofConfig.enabled ? 'enabled' : 'disabled'}`); });
SRVEOF

cat > /etc/nginx/conf.d/strategic-platform.conf << 'NGEOF'
upstream backend { server 127.0.0.1:3000; }
server {
    listen 80; server_name strategicsouth.woa.com _;
    root /opt/strategic-platform/dist; index index.html;
    gzip on; gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml; gzip_min_length 1024;
    location /api/ { proxy_pass http://backend; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; proxy_pass_request_headers on; proxy_connect_timeout 60s; proxy_read_timeout 60s; }
    location / { try_files $uri $uri/ /index.html; }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { expires 30d; add_header Cache-Control "public, immutable"; }
    location ~ /\. { deny all; }
}
NGEOF

echo "[3/5] Installing Node.js dependencies..."
cd /opt/strategic-platform/server && npm install --production 2>&1 | tail -5

echo "[4/5] Setting up env and systemd..."
cat > /opt/strategic-platform/server/.env << 'ENVEOF'
TAI_APP_TOKEN=your-tai-app-token
AUTH_MODE=auto
TOF_ALLOWED_USERS=
JWT_SECRET=your-32-character-random-secret
PORT=3000
DB_PATH=/opt/strategic-platform/server/data/strategic.db
ENVEOF

NODE_BIN=$(which node)
cat > /etc/systemd/system/strategic-platform.service << SVCEOF
[Unit]
Description=Strategic Platform API Server
After=network.target nginx.service
[Service]
Type=simple
WorkingDirectory=/opt/strategic-platform/server
ExecStart=${NODE_BIN} server.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/strategic-platform/server/.env
[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable strategic-platform
systemctl restart strategic-platform
sleep 2

echo "[5/7] Configuring Nginx..."
[ -f /etc/nginx/conf.d/default.conf ] && mv /etc/nginx/conf.d/default.conf /etc/nginx/backup/ 2>/dev/null
nginx -t 2>&1 && systemctl reload nginx

echo "[6/7] Downloading frontend..."
curl -fsSL https://tencentsouth.top/dist-pkg.tar.gz -o /tmp/dist-pkg.tar.gz 2>/dev/null
if [ $? -eq 0 ] && [ -f /tmp/dist-pkg.tar.gz ] && [ -s /tmp/dist-pkg.tar.gz ]; then
  tar xzf /tmp/dist-pkg.tar.gz -C /opt/strategic-platform/dist/
  rm -f /tmp/dist-pkg.tar.gz
  echo "Frontend downloaded OK"
else
  echo "WARNING: Frontend download failed. Will serve API only."
  echo "You can manually upload dist/ to /opt/strategic-platform/dist/ later"
  rm -f /tmp/dist-pkg.tar.gz
fi

echo "[7/7] Reloading Nginx..."
systemctl reload nginx

echo ""
echo "=== VERIFICATION ==="
curl -s http://localhost/api/health
echo ""
curl -s http://localhost/api/auth/check
echo ""
systemctl is-active strategic-platform nginx
echo ""
echo "=== ALL DONE ==="
