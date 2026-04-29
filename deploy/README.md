# 战略客户部数据平台 - 内网服务器部署指南

## 前置条件

- 内网服务器已申请，并能通过 SSH 访问。
- `strategicsouth.woa.com` 已解析到服务器内网 IP。
- 太湖平台站点已创建，TOF 登录已配置。
- 本地已安装 Node.js 18+ 和 npm。

## 迁移保护

迁移验证完成前不要删除 EdgeOne Pages 项目、环境变量、KV、历史部署和回滚入口。新服务器异常时，可将入口切回原 EdgeOne/网关配置继续使用旧站。

## 一键部署

```bash
cd /path/to/战略客户部\ ·\ 华南拓展中心\ ·\ 数据\&\文档汇总平台

export TAI_APP_TOKEN='你的太湖APP_TOKEN'
export JWT_SECRET='32位以上随机字符串'
export TOF_ALLOWED_USERS='可选，英文名逗号分隔'

bash deploy/deploy.sh root@你的服务器内网IP
```

`deploy.sh` 会保留服务器上已有的 `/opt/strategic-platform/server/.env`，避免后续部署覆盖生产密钥。

## 手动部署（如一键脚本失败）

```bash
npm install
npm run build

ssh root@你的服务器内网IP 'mkdir -p /opt/strategic-platform/{dist,server/data,logs}'
scp -r dist/* root@你的服务器内网IP:/opt/strategic-platform/dist/
scp deploy/server/package.json deploy/server/server.js deploy/server/db.js deploy/server/tof.js root@你的服务器内网IP:/opt/strategic-platform/server/
scp deploy/nginx.conf root@你的服务器内网IP:/etc/nginx/conf.d/strategic-platform.conf

ssh root@你的服务器内网IP
cd /opt/strategic-platform/server
npm install --production
vim .env
systemctl restart strategic-platform
nginx -t && systemctl reload nginx
```

## systemd 运维

```bash
systemctl status strategic-platform --no-pager
systemctl restart strategic-platform
journalctl -u strategic-platform -f
```

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `TAI_APP_TOKEN` | 是 | 太湖应用 Token |
| `JWT_SECRET` | 是 | JWT 签名密钥（32位+随机字符串） |
| `AUTH_MODE` | 否 | `auto`（默认）/ `tof` / `jwt` |
| `TOF_ALLOWED_USERS` | 否 | TOF 用户白名单（逗号分隔，空=不限） |
| `PORT` | 否 | API 服务端口（默认 3000） |
| `DB_PATH` | 否 | SQLite 文件路径 |

## 架构

```text
内网服务器
├── Nginx:80
│   ├── /           → Vue 静态文件：/opt/strategic-platform/dist/
│   └── /api/*      → 反代到 Node.js:3000
└── Node.js:3000
    ├── /api/auth/*      → 认证（TOF + JWT 双模式）
    ├── /api/admin/*     → 用户管理
    └── /api/health      → 健康检查
```

## 验证

```bash
curl -s http://localhost/api/health
curl -s http://localhost/api/auth/check
curl -I http://localhost/
systemctl is-active strategic-platform nginx
```

本地直连服务器时没有太湖 Header，`/api/auth/check` 返回 `authenticated=false` 属于正常现象；通过 `strategicsouth.woa.com` 访问时应由太湖注入身份 Header。

## 数据库

使用 SQLite，文件位于 `/opt/strategic-platform/server/data/strategic.db`。

初始化种子数据：

```bash
curl -X POST http://localhost/api/admin/init \
  -H "X-Init-Secret: 你的JWT_SECRET" \
  -H "Content-Type: application/json"
```
