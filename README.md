# 战略客户部 · 华南拓展中心 · 数据&文档汇总平台

基于 Vue 3 + TypeScript + Vite 构建的内部数据平台，部署于内网服务器，通过太湖/TOF 统一登录认证，用于团队日常工作所需数据和文档的统一管理。

**线上地址**: https://strategicsouth.woa.com

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + TypeScript + Vite + Pinia + Vue Router |
| 后端 | Express + SQLite (better-sqlite3) |
| 认证 | 太湖 TOF (JWE x-tai-identity) + JWT Session |
| 部署 | Nginx 反代 + systemd 进程管理 |
| 服务器 | CVM 内网 `21.214.41.205` |

---

## 项目结构

```
strategic-platform/
├── src/                    # 前端源码 (Vue 3 SPA)
│   ├── api/                # API 接口封装
│   ├── assets/styles/      # 样式文件
│   ├── components/         # 组件（layout / common）
│   ├── stores/             # Pinia 状态管理
│   ├── views/              # 页面视图
│   ├── router/             # Vue Router 配置
│   └── main.ts             # 入口
├── deploy/                 # 部署相关
│   ├── server/             # Express 后端代码
│   │   ├── server.js       # 主服务（认证 + 管理 + API）
│   │   ├── db.js           # SQLite 数据层
│   │   ├── tof.js          # TOF JWE 解密模块
│   │   └── package.json    # 后端依赖
│   ├── nginx.conf          # Nginx 站点配置
│   ├── deploy.sh           # 一键部署脚本
│   └── README.md           # 部署详细文档
├── package.json            # 前端依赖
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── .env.example            # 环境变量模板
```

---

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 部署到服务器

```bash
# 设置环境变量
export TAI_APP_TOKEN='你的太湖APP_TOKEN'
export JWT_SECRET='32位以上随机字符串'

# 一键部署
bash deploy/deploy.sh root@21.214.41.205
```

详细部署文档请参考 [`deploy/README.md`](./deploy/README.md)。

---

## 认证机制

采用太湖 (tai.it.woa.com) TOF 统一登录：

1. 用户访问 `strategicsouth.woa.com`，太湖网关注入 `x-tai-identity` Header
2. 后端使用 `TAI_APP_TOKEN` 解密 JWE，获取用户身份信息
3. 签发 JWT Session（有效期 8 小时），写入 httpOnly Cookie
4. 首次登录需确认（449 状态码触发前端确认流程）

---

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `TAI_APP_TOKEN` | ✅ | 太湖应用 Token（32位） |
| `JWT_SECRET` | ✅ | JWT 签名密钥（≥32字符） |
| `AUTH_MODE` | ❌ | `auto`（默认）/ `tof` / `jwt` |
| `TOF_ALLOWED_USERS` | ❌ | 用户白名单（英文名逗号分隔） |
| `TAI_PAAS_ID` | ❌ | 太湖应用 PAAS ID（默认 strategicsouth） |
| `PORT` | ❌ | API 端口（默认 3000） |

---

## 架构概览

```
内网服务器 (21.214.41.205)
├── Nginx :80
│   ├── /           → Vue SPA 静态文件 (/opt/strategic-platform/dist/)
│   └── /api/*      → 反代到 Node.js :3000
└── Node.js :3000 (systemd: strategic-platform)
    ├── /api/auth/*      → 认证（TOF + JWT）
    ├── /api/admin/*     → 用户管理
    └── /api/health      → 健康检查
```

---

## 运维命令

```bash
# 服务状态
systemctl status strategic-platform

# 重启服务
systemctl restart strategic-platform

# 查看日志
journalctl -u strategic-platform -f

# Nginx 配置验证
nginx -t && systemctl reload nginx

# 健康检查
curl -s http://localhost/api/health
```

---

## 页面功能

- **首页** — 工作台入口
- **售卖弹药** — 销售资料与话术
- **AI与云商动态** — 行业动态追踪
- **成本变化** — 产品成本信息
- **产品售卖指引** — 产品方案推荐
- **汇报管理** — 结构化汇报编写与导出
- **管理后台** — 用户/角色/日志管理（管理员）
