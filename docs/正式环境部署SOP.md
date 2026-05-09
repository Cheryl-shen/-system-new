# 华南AI智策 - 正式环境部署 SOP

> **目标服务器**: `21.214.41.205`  
> **域名**: `https://strategicsouth.woa.com`  
> **鉴权**: 太湖/NGate 自动鉴权（访问域名自动跳转太湖登录）

---

## 📋 部署前提

服务器已完成首次部署，目录结构已存在：
- 源码目录：`/opt/strategic-platform-src/`
- 运行目录：`/opt/strategic-platform/`
- Nginx 配置：`/etc/nginx/conf.d/strategic-platform.conf`

---

## 🚀 Git 更新部署流程

### Step 1: 本机推送代码到 GitHub

```bash
cd /Users/cherylshen/Desktop/platform
git add -A
git commit -m "deploy: update for production"
git push origin main
```

### Step 2: 服务器拉取并更新

根据更新内容选择对应方式：

---

### 仅前端更新（最常用）

```bash
cd /opt/strategic-platform-src
git pull origin main
npm run build
cp -r dist/* /opt/strategic-platform/dist/
systemctl reload nginx
echo "Frontend update completed"
```

---

### 仅后端更新

```bash
cd /opt/strategic-platform-src
git pull origin main
cp deploy/server/*.js /opt/strategic-platform/server/
cd /opt/strategic-platform/server && npm install --production
systemctl restart strategic-platform
echo "Backend update completed"
```

---

### 前后端全量更新（一键命令）

```bash
cd /opt/strategic-platform-src && git pull origin main && npm run build && cp -r dist/* /opt/strategic-platform/dist/ && cp deploy/server/*.js /opt/strategic-platform/server/ && cd /opt/strategic-platform/server && npm install --production && systemctl restart strategic-platform && systemctl reload nginx && echo "Full update completed"
```

---

### Step 3: 验证更新

```bash
echo "=== Health Check ===" && curl -s http://localhost/api/health && echo ""
echo "=== Service Status ===" && systemctl is-active strategic-platform && systemctl is-active nginx
echo "=== Port Listening ===" && ss -tlnp | grep -E ':(80|3000)\s'
echo ""
echo "Update completed! Visit https://strategicsouth.woa.com"
```

---

## ❗ 常见问题排查

### 问题1：访问域名显示 Nginx 默认测试页 ⭐最常见

**原因**：Nginx 配置文件没有正确部署，或被默认配置覆盖

**解决**：
```bash
# 1. Check config files
ls -la /etc/nginx/conf.d/

# 2. Copy project config
cp /opt/strategic-platform-src/deploy/nginx.conf /etc/nginx/conf.d/strategic-platform.conf

# 3. Remove/backup default config
[ -f /etc/nginx/conf.d/default.conf ] && mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak

# 4. Reload Nginx
nginx -t && systemctl reload nginx
```

### 问题2：502 Bad Gateway

**原因**：后端 API 服务未启动或端口不通

**解决**：
```bash
# Check API service status
systemctl status strategic-platform

# Restart if not running
systemctl restart strategic-platform

# Check port 3000
ss -tlnp | grep 3000

# View API service logs
journalctl -u strategic-platform --no-pager -n 50
```

### 问题3：npm install 失败（网络问题）

**解决**：
```bash
# Use China mirror
npm config set registry https://registry.npmmirror.com
npm install
```

### 问题4：git pull 失败

**解决**：
```bash
# Force pull (discard local changes)
cd /opt/strategic-platform-src
git fetch origin main
git reset --hard origin/main

# If permission denied
git config --global --add safe.directory /opt/strategic-platform-src
```

### 问题5：.env 配置丢失或错误

**解决**：
```bash
# Check config
cat /opt/strategic-platform/server/.env

# Reconfigure (replace with real token)
cat > /opt/strategic-platform/server/.env << 'EOF'
TAI_APP_TOKEN=YOUR_REAL_TOKEN
AUTH_MODE=auto
JWT_SECRET=YOUR_JWT_SECRET
PORT=3000
DB_PATH=/opt/strategic-platform/server/data/strategic.db
EOF

systemctl restart strategic-platform
```

### 问题6：太湖鉴权不生效

**检查点**：
1. 域名是否已在 NGate 配置太湖鉴权
2. TAI_APP_TOKEN 是否正确配置
3. AUTH_MODE 是否设为 `auto` 或 `tof`

```bash
# Check auth config
curl -s http://localhost/api/auth/check
```

---

## 📊 常用运维命令速查

| 操作 | 命令 |
|------|------|
| 查看 API 服务状态 | `systemctl status strategic-platform` |
| 查看 API 实时日志 | `journalctl -u strategic-platform -f` |
| 重启 API 服务 | `systemctl restart strategic-platform` |
| 查看 Nginx 状态 | `systemctl status nginx` |
| 查看 Nginx 错误日志 | `tail -f /var/log/nginx/error.log` |
| 检查 Nginx 配置语法 | `nginx -t` |
| 重载 Nginx | `systemctl reload nginx` |
| 查看监听端口 | `ss -tlnp \| grep -E ':(80\|3000)'` |

---

## 📁 服务器目录结构

```
/opt/
├── strategic-platform-src/     # Git source directory
│   ├── src/                    # Frontend source
│   ├── deploy/                 # Deploy files
│   │   ├── server/             # Backend code
│   │   └── nginx.conf          # Nginx config template
│   └── dist/                   # Build output
│
├── strategic-platform/         # Runtime directory
│   ├── dist/                   # Frontend static files (Nginx serve)
│   └── server/                 # Backend runtime
│       ├── server.js
│       ├── db.js
│       ├── tof.js
│       ├── .env                # Environment variables (sensitive)
│       └── data/               # Database files
│
/etc/nginx/conf.d/
└── strategic-platform.conf     # Nginx config file
```

---

## ✅ 更新检查清单

- [ ] 代码已推送到 GitHub
- [ ] 服务器已执行 `git pull`
- [ ] 前端已构建并复制到 `/opt/strategic-platform/dist/`
- [ ] 后端文件已更新（如有后端改动）
- [ ] 服务已重启（后端改动时）
- [ ] `curl http://localhost/api/health` 返回正常
- [ ] 访问 `https://strategicsouth.woa.com` 正常显示

---

*文档更新时间: 2026-05-09*
