// deploy/server/tof.js — 太湖 TOF 认证（Express 版本）

import { compactDecrypt } from 'jose';

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
 * 检查请求是否来自 TOF 认证的用户
 */
export function isTofAuthenticated(req) {
  const h = req.headers;
  return !!(h['staffname'] || h['StaffName'] || h['x-tai-identity'] || h['x-tai-identity-b64']);
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
