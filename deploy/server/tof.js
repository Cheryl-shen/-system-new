// deploy/server/tof.js — 太湖 TOF 认证（Express 版本）
// 参考：太湖鉴权接入与用户管理系统搭建指南

import { compactDecrypt } from 'jose';
import crypto from 'crypto';

// ============================================================
// 网关签名校验
// ============================================================

/**
 * 校验太湖网关签名
 * 防止请求伪造 — 确保请求确实来自太湖智能网关
 * 
 * @param {string} key - TAI_APP_TOKEN
 * @param {string} timestampSeconds - 请求头中的 timestamp
 * @param {string} signature - 请求头中的 signature
 * @param {string[]} extHeaders - 扩展头部 [x-rio-seq, staffid, staffname, x-ext-data]
 * @returns {boolean}
 */
function checkSignature(key, timestampSeconds, signature, extHeaders) {
  if (!timestampSeconds || !signature) {
    return false;
  }
  // 校验时间偏差不超过 3 分钟（180秒）
  const ts = parseInt(timestampSeconds, 10);
  if (isNaN(ts)) return false;
  if (Math.abs(ts * 1000 - Date.now()) > 180000) {
    console.warn('[TOF] 签名时间偏差过大:', Math.abs(ts * 1000 - Date.now()), 'ms');
    return false;
  }
  const hash = crypto.createHash('sha256');
  hash.update(timestampSeconds + key + extHeaders.join(',') + timestampSeconds);
  const expected = hash.digest('hex').toLowerCase();
  return signature.toLowerCase() === expected;
}

// ============================================================
// 解密身份信息
// ============================================================

/**
 * 从 Express req.headers 获取 TOF 用户信息
 */
export async function getTofUser(req, config = {}) {
  const headers = req.headers;

  // 安全模式：优先解密 x-tai-identity
  if (config.safeMode && config.appToken) {
    const encryptedHeader = headers['x-tai-identity'];
    if (encryptedHeader) {
      try {
        const keyBytes = new TextEncoder().encode(config.appToken);
        const { plaintext } = await compactDecrypt(encryptedHeader, keyBytes);
        const payload = JSON.parse(new TextDecoder().decode(plaintext));

        // 校验 token 过期时间（3分钟缓冲）
        if (payload.Expiration) {
          const exp = new Date(payload.Expiration);
          if (Date.now() - 3 * 60 * 1000 > exp.getTime()) {
            console.warn('[TOF] Identity token 已过期:', payload.Expiration);
            return null;
          }
        }

        return {
          staffName: payload.LoginName,
          staffId: String(payload.StaffId),
          displayName: payload.ChineseName || payload.LoginName,
          chineseName: payload.ChineseName || '',
          rawIdentity: encryptedHeader
        };
      } catch (error) {
        console.error('[TOF] JWE 解密失败:', error.message);
      }
    }
  }

  // 兼容模式：从 StaffName / x-tai-identity-b64 读取
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

/**
 * 校验太湖网关签名（在获取用户信息前调用）
 * 
 * @param {object} req - Express request
 * @param {object} config - TOF 配置 { appToken, safeMode }
 * @returns {boolean} 签名是否有效
 */
export function verifyGatewaySignature(req, config = {}) {
  if (!config.appToken) return false;

  const headers = req.headers;
  const timestamp = headers['timestamp'];
  const signature = headers['signature'];

  if (!timestamp || !signature) {
    // 没有签名头 → 请求可能不是来自太湖网关
    return false;
  }

  let extHeaders;
  if (config.safeMode) {
    // 安全模式：extHeaders = [x-rio-seq, '', '', '']
    extHeaders = [headers['x-rio-seq'] || '', '', '', ''];
  } else {
    // 兼容模式：extHeaders = [x-rio-seq, staffid, staffname, x-ext-data]
    extHeaders = [
      headers['x-rio-seq'] || '',
      headers['staffid'] || '',
      headers['staffname'] || '',
      headers['x-ext-data'] || ''
    ];
  }

  return checkSignature(config.appToken, timestamp, signature, extHeaders);
}

/**
 * 检查请求是否来自 TOF 认证的用户
 * 判定条件：存在太湖网关注入的标志性 Header
 */
export function isTofAuthenticated(req) {
  const h = req.headers;
  return !!(h['staffname'] || h['StaffName'] || h['x-tai-identity'] || h['x-tai-identity-b64'] || h['signature']);
}

/**
 * 加载 TOF 配置
 */
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
