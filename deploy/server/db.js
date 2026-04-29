// deploy/server/db.js — SQLite 数据库层（替代 EdgeOne KV）

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
      username TEXT PRIMARY KEY,
      password_hash TEXT DEFAULT '',
      display_name TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'manager',
      status TEXT NOT NULL DEFAULT 'active',
      customer_ids TEXT NOT NULL DEFAULT '[]',
      staff_id TEXT DEFAULT '',
      chinese_name TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS login_logs (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      login_time TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      ip_address TEXT DEFAULT '',
      user_agent TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS sessions (
      staff_name TEXT PRIMARY KEY,
      confirmed_at INTEGER NOT NULL,
      ip_address TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      display_name TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      report_date TEXT NOT NULL,
      content TEXT NOT NULL,
      generated_html TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      created_by TEXT NOT NULL,
      created_by_display TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_by TEXT NOT NULL DEFAULT '',
      updated_by_display TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      version INTEGER NOT NULL DEFAULT 1,
      archived_by TEXT DEFAULT '',
      archived_at TEXT DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_login_logs_username ON login_logs(username);
    CREATE INDEX IF NOT EXISTS idx_login_logs_login_time ON login_logs(login_time);
    CREATE INDEX IF NOT EXISTS idx_reports_customer ON reports(customer_id);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
  `);
}

// ============================================================
// 用户 CRUD
// ============================================================

export function getUser(username) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) return null;
  return {
    username: row.username,
    passwordHash: row.password_hash,
    displayName: row.display_name,
    role: row.role,
    status: row.status,
    customerIds: JSON.parse(row.customer_ids || '[]'),
    staffId: row.staff_id || '',
    chineseName: row.chinese_name || '',
    createdAt: row.created_at,
    lastLogin: row.last_login
  };
}

export function listUsers({ page = 1, pageSize = 20, keyword = '' } = {}) {
  const db = getDb();
  const offset = (page - 1) * pageSize;
  let where = '';
  const params = [];
  if (keyword) {
    where = "WHERE (username LIKE ? OR display_name LIKE ? OR chinese_name LIKE ?)";
    const kw = `%${keyword}%`;
    params.push(kw, kw, kw);
  }

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM users ${where}`).get(...params).cnt;
  const rows = db.prepare(
    `SELECT * FROM users ${where} ORDER BY last_login DESC, created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, pageSize, offset);

  const users = rows.map(row => ({
    username: row.username,
    passwordHash: row.password_hash,
    displayName: row.display_name,
    role: row.role,
    status: row.status,
    customerIds: JSON.parse(row.customer_ids || '[]'),
    staffId: row.staff_id || '',
    chineseName: row.chinese_name || '',
    createdAt: row.created_at,
    lastLogin: row.last_login
  }));

  return { users, total };
}

export function createUser(user) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR REPLACE INTO users (username, password_hash, display_name, role, status, customer_ids, staff_id, chinese_name, created_at, last_login)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    user.username, user.passwordHash || '', user.displayName,
    user.role || 'manager', user.status || 'active',
    JSON.stringify(user.customerIds || []), user.staffId || '',
    user.chineseName || '', user.createdAt || now, user.lastLogin || now
  );
}

export function updateUserRole(username, role) {
  const db = getDb();
  db.prepare('UPDATE users SET role = ? WHERE username = ?').run(role, username);
}

export function updateUserStatus(username, status) {
  const db = getDb();
  db.prepare('UPDATE users SET status = ? WHERE username = ?').run(status, username);
}

export function updateLastLogin(username) {
  const db = getDb();
  db.prepare('UPDATE users SET last_login = ? WHERE username = ?').run(new Date().toISOString(), username);
}

// ============================================================
// 会话管理
// ============================================================

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export function getSession(staffName) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM sessions WHERE staff_name = ?').get(staffName);
  if (!row) return null;
  if (Date.now() - row.confirmed_at > SESSION_TTL_MS) {
    db.prepare('DELETE FROM sessions WHERE staff_name = ?').run(staffName);
    return null;
  }
  return {
    confirmedAt: row.confirmed_at,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    staffName: row.staff_name,
    displayName: row.display_name
  };
}

export function createSession(staffName, ipAddress, userAgent, displayName) {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO sessions (staff_name, confirmed_at, ip_address, user_agent, display_name)
    VALUES (?, ?, ?, ?, ?)
  `).run(staffName, Date.now(), ipAddress, userAgent, displayName);
}

export function deleteSession(staffName) {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE staff_name = ?').run(staffName);
}

// ============================================================
// 登录日志
// ============================================================

export function recordLoginLog({ username, displayName, ipAddress, userAgent }) {
  const db = getDb();
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare(`
    INSERT INTO login_logs (id, username, display_name, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, username, displayName, ipAddress, userAgent);
}

export function listLoginLogs({ page = 1, pageSize = 50, username = '' } = {}) {
  const db = getDb();
  const offset = (page - 1) * pageSize;
  let where = '';
  const params = [];
  if (username) {
    where = 'WHERE username LIKE ?';
    params.push(`%${username}%`);
  }
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM login_logs ${where}`).get(...params).cnt;
  const rows = db.prepare(
    `SELECT * FROM login_logs ${where} ORDER BY login_time DESC LIMIT ? OFFSET ?`
  ).all(...params, pageSize, offset);
  return { logs: rows, total };
}

// ============================================================
// 客户管理
// ============================================================

export function getCustomer(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  return row ? { id: row.id, name: row.name, createdAt: row.created_at } : null;
}

export function listCustomers() {
  const db = getDb();
  return db.prepare('SELECT * FROM customers ORDER BY created_at').all()
    .map(r => ({ id: r.id, name: r.name, createdAt: r.created_at }));
}

export function createCustomer(customer) {
  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO customers (id, name, created_at) VALUES (?, ?, ?)')
    .run(customer.id, customer.name, customer.createdAt || new Date().toISOString());
}

// ============================================================
// 报告管理
// ============================================================

export function getReport(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  return row ? { ...row, content: JSON.parse(row.content) } : null;
}

export function listReports({ customerId, status } = {}) {
  const db = getDb();
  let where = 'WHERE 1=1';
  const params = [];
  if (customerId) { where += ' AND customer_id = ?'; params.push(customerId); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  return db.prepare(`SELECT * FROM reports ${where} ORDER BY updated_at DESC`).all(...params)
    .map(r => ({
      id: r.id, customerId: r.customer_id, customerName: r.customer_name,
      reportDate: r.report_date, status: r.status, updatedAt: r.updated_at,
      updatedByDisplay: r.updated_by_display, version: r.version
    }));
}

export function saveReport(report) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR REPLACE INTO reports 
    (id, customer_id, customer_name, report_date, content, generated_html, status,
     created_by, created_by_display, created_at, updated_by, updated_by_display, updated_at, version)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    report.id, report.customerId, report.customerName, report.reportDate,
    JSON.stringify(report.content), report.generatedHtml || '', report.status,
    report.createdBy, report.createdByDisplay, report.createdAt || now,
    report.updatedBy, report.updatedByDisplay, now, report.version || 1
  );
}
