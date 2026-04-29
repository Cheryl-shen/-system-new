# 战略客户部 · 华南拓展中心 · 数据&文档汇总平台

基于 Vue 3 + TypeScript + Vite 构建的内部文档管理平台，当前迁移到内网服务器部署，并保留 EdgeOne Pages 作为备份方案；支持太湖/TOF 免登录认证，用于团队日常工作所需数据和文档的统一管理。

---

## 📋 目录

- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [技术栈](#-技术栈)
- [认证方式](#-认证方式)
- [环境变量](#-环境变量)
- [API 接口](#-api-接口)
- [页面说明](#-页面说明)
- [开发指南](#-开发指南)
- [部署指南](#-部署指南)
- [常见问题](#-常见问题)
- [更新日志](#-更新日志)

---

## 📋 项目结构

```
strategic-platform/
├── public/                      # 静态资源
├── src/                         # 前端源码
│   ├── api/                     # API 接口封装
│   │   ├── auth.ts              # 认证相关接口
│   │   └── http.ts              # HTTP 请求封装
│   ├── assets/                  # 样式文件
│   │   └── styles/
│   │       ├── variables.css    # CSS 变量
│   │       ├── base.css         # 基础样式重置
│   │       ├── components.css   # 通用组件样式
│   │       └── main.css         # 样式入口
│   ├── components/              # 组件
│   │   ├── layout/              # 布局组件
│   │   │   ├── Topbar.vue       # 顶部栏（用户信息）
│   │   │   └── Sidebar.vue      # 侧边栏（导航菜单）
│   │   └── common/              # 通用组件
│   ├── stores/                  # Pinia 状态管理
│   │   └── auth.ts              # 认证状态（用户/Token/角色）
│   ├── views/                   # 页面组件
│   │   ├── Home.vue             # 首页
│   │   ├── SalesGuide.vue       # 售卖弹药
│   │   ├── News.vue             # AI 与云商动态
│   │   ├── Cost.vue             # 成本变化
│   │   ├── ProductGuide.vue     # 产品售卖指引
│   │   ├── NewProducts.vue      # 官网上新
│   │   ├── ModelPrice.vue       # 模型商价格动态
│   │   ├── Strategy.vue         # 客户战略分析
│   │   └── Login.vue            # 登录页
│   ├── data/                    # 静态数据
│   │   ├── costData.ts          # 成本数据
│   │   ├── newsData.ts          # 行业资讯数据
│   │   ├── salesGuideData.ts    # 销售指引数据
│   │   ├── newProductsData.ts   # 官网上新数据
│   │   ├── modelPriceData.ts    # 模型商价格动态数据
│   │   └── strategyData.ts      # 战略分析数据
│   ├── router/                  # 路由
│   │   └── index.ts             # 路由配置 + 守卫
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 入口文件
├── functions/                   # EdgeOne Functions（Serverless 后端）
│   ├── api/                     # API 路由
│   │   ├── auth/                # 认证接口
│   │   │   ├── me.ts            # 获取当前用户信息
│   │   │   ├── logout.ts        # 登出
│   │   │   └── tof/             # TOF 认证
│   │   │       └── check.ts     # 检查 TOF 状态
│   │   └── admin/               # 管理接口
│   │       └── init.ts          # 初始化管理员
│   └── _lib/                    # 后端工具库
│       ├── auth.ts              # 认证工具
│       ├── auth-unified.ts      # 统一认证入口（TOF）
│       ├── tof.ts               # TOF 认证工具
│       ├── kv.ts                # EdgeOne KV 封装
│       ├── password.ts          # bcrypt 密码工具
│       ├── audit.ts             # 审计日志
│       └── response.ts          # HTTP 响应工具
├── shared/                      # 前后端共享代码
│   └── types.ts                 # 共享类型定义
├── scripts/                     # 脚本工具
│   └── init-kv.ts               # 初始化 KV 数据
├── docs/                        # 文档
│   └── 内容更新SOP.md           # 内容更新标准操作流程
├── edgeone.json                 # EdgeOne Pages 部署配置
├── index.html                   # HTML 模板
├── package.json                 # 项目依赖
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置（前端）
└── tsconfig.node.json           # TypeScript 配置（Node）
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- EdgeOne CLI（用于部署）

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 1. 配置环境变量（可选，使用默认值也能运行）
cp .env.example .env
# 编辑 .env，设置 JWT_SECRET 和 TOF_ALLOWED_USERS

# 2. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

> **提示**：
> - 本地开发默认使用 JWT 认证模式
> - 使用内置账号登录：`cherylzshen` / `Tencent2026`
> - TOF 模式需要在 NGate 网关后才能生效

### 构建生产版本

```bash
npm run build
```

产物输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

### 初始化 KV 数据

```bash
# 1. 设置环境变量
export BASE_URL=https://your-site.edgeone.app
export JWT_SECRET=你的JWT密钥

# 2. 初始化白名单用户
npm run init-kv
```

> **说明**：
> - 初始化会创建白名单用户（见 `functions/api/admin/init.ts`）
> - 默认密码：`Tencent2026`（首次登录后请立即修改）
> - 幂等设计：重复运行不会覆盖已有数据
> - 强制覆盖：添加 `--force` 参数

---

## 📚 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.4.0 | 渐进式 JavaScript 框架 |
| TypeScript | ^5.3.0 | 类型系统 |
| Vue Router | ^4.2.0 | 官方路由 |
| Pinia | ^2.1.7 | 状态管理 |
| Vite | ^5.0.0 | 构建工具 |
| Tiptap | ^2.2.0 | 富文本编辑器 |
| DOMPurify | ^3.0.9 | XSS 防护 |

### 后端

| 技术 | 说明 |
|------|------|
| EdgeOne Functions | 边缘 Serverless 函数 |
| EdgeOne KV | 键值存储 |
| jose | JWT 签发与验证 |
| bcryptjs | 密码哈希 |

### 部署

| 技术 | 说明 |
|------|------|
| 内网服务器 + Nginx | 当前生产部署：托管 Vue 静态文件并反代 `/api/*` |
| Node.js Express | 当前生产后端：替代 EdgeOne Functions，运行在服务器 `3000` 端口 |
| EdgeOne Pages | 备份部署：迁移完全验证前不要删除或下线 |
| 太湖/TOF | 公司统一身份认证 |

---

## 🔐 认证方式

本项目当前**只保留太湖/TOF 登录方式**，统一认证入口位于 `functions/_lib/auth-unified.ts`。

### 太湖(TOF)认证（生产环境）

**流程**：
```
用户 → 浏览器 → strategicsouth.woa.com
             ↓
          太湖智能网关
        （TOF 认证插件）
             ↓
     注入 Header（安全模式）：
     - x-tai-identity: JWE 加密身份信息
     - TIMESTAMP: 时间戳
     - SIGNATURE: 网关签名
             ↓
       内网服务器（Nginx + Node.js）
             ↓
       /api/auth/check
    （解密 x-tai-identity 获取用户）
```

**安全模式（推荐）**：
- ✅ 使用 JWE 解密 `x-tai-identity` 获取用户信息
- ✅ 校验网关签名，防止伪造请求
- ✅ 配置 `TAI_APP_TOKEN` 启用安全模式
- ✅ 解密后包含：LoginName, StaffId, ChineseName, Expiration

**兼容模式**：
- 从明文 Header 读取用户信息（StaffName, StaffId）
- 需要配置 `TOF_TOKEN`

**特点**：
- ✅ 免登录，用户无感知
- ✅ 基于公司统一认证，安全可靠
- ✅ 自动续期，无需管理 Token
- ✅ 支持用户白名单控制（仅限指定用户访问）
- ✅ 登录确认机制（首次登录需手动确认）

**白名单控制**：
- 在环境变量 `TOF_ALLOWED_USERS` 中配置允许登录的用户 ID（逗号分隔）
- 留空则允许所有通过 TOF 认证的用户登录
- 用户 ID 为员工的英文名（如 `cherylzshen`）

**认证判定逻辑**：
1. 检查请求 Header 中是否有太湖注入的 `x-tai-identity` 或 `StaffName`。
2. 使用 `TAI_APP_TOKEN` 解密/校验用户身份。
3. 检查用户是否在 `TOF_ALLOWED_USERS` 白名单内（为空则不限制）。
4. 首次登录需要确认，确认后创建 8 小时会话。

---

## ⚙️ 环境变量

内网服务器部署时在 `/opt/strategic-platform/server/.env` 中配置；EdgeOne 备份部署时在 EdgeOne Pages 控制台配置同名变量。

| 变量 | 必填 | 说明 |
|------|------|------|
| `TAI_APP_TOKEN` | ✅ | 太湖安全模式 Token，用于解密 `x-tai-identity` |
| `JWT_SECRET` | ✅ | 会话/JWT 签名密钥（至少 32 字符，后续部署不要随意更换） |
| `AUTH_MODE` | ❌ | 固定建议：`auto` 或 `tof` |
| `TOF_TOKEN` | ⚠️ | 太湖兼容模式 Token，仅在明文 Header 模式下使用 |
| `TOF_ALLOWED_USERS` | ❌ | 允许登录的用户 ID 列表（逗号分隔，留空则不限制） |
| `PORT` | ❌ | Node.js 后端端口，默认 `3000` |
| `DB_PATH` | ❌ | SQLite 数据库路径，默认 `/opt/strategic-platform/server/data/strategic.db` |

### 太湖认证配置示例

```bash
# 太湖安全模式（推荐）- 使用 JWE 解密
AUTH_MODE=auto
TAI_APP_TOKEN=你的太湖应用Token（32位字符串）
JWT_SECRET=32位以上随机字符串

# 白名单：仅允许以下用户登录；留空表示不限制
TOF_ALLOWED_USERS=anniexzhang,adamyide,blackyzhang,cherylzshen,dinghaoyang,ethanmhua,mercuryyan,shixu,wayynewang,zyfeizhang

PORT=3000
DB_PATH=/opt/strategic-platform/server/data/strategic.db
```

### KV 绑定

| 绑定名 | Namespace | 用途 |
|--------|-----------|------|
| `REPORTS_KV` | strategic-platform-kv | 存储用户、会话、审计日志等 |

---

## 🌐 API 接口

所有接口以 `/api` 为前缀，位于 `functions/api/` 目录。

### 认证相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/auth/me` | 获取当前用户信息 | 必需 |
| POST | `/api/auth/logout` | 登出 | 必需 |
| GET | `/api/auth/check` | 检查 TOF 认证状态和登录确认状态 | 无 |
| POST | `/api/auth/confirm` | 确认首次登录 | TOF |
| GET | `/api/auth/tof/check` | 检查 TOF 认证状态 | 无 |

### 用户管理（仅管理员）

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/admin/users` | 用户列表 | admin |
| PUT | `/api/admin/users/:username/role` | 修改用户角色 | admin |
| PUT | `/api/admin/users/:username/status` | 启用/禁用用户 | admin |
| GET | `/api/admin/login-logs` | 登录日志 | admin |

### 请求示例

**获取当前用户**
```bash
curl https://tencentsouth.top/api/auth/me \
  -H "Authorization: Bearer <token>"
```

响应：
```json
{
  "username": "cherylshen",
  "displayName": "沈智悦",
  "role": "admin",
  "customerIds": ["customer-001", "customer-002"],
  "authMode": "tof"
}
```

### 管理接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/admin/init` | 初始化管理员账号 | Token（一次性） |

---

## 📂 页面说明

### 1. 首页 (Home) `/`
- 平台概览和统计数据
- 快速导航卡片
- 最近更新列表

### 2. 售卖弹药 (SalesGuide) `/sales-guide`
- 销售流程规范
- 客户沟通话术
- 商务谈判指引

### 3. 成本变化 (Cost) `/cost`
- 单价涨幅明细
- 行业成本汇总
- 对接人一览
- 支持搜索和筛选

### 4. 产品售卖指引 (ProductGuide) `/product-guide`
- 大背景分析
- 行业宏观分析
- 腾讯云 AI 产品全景
- 售卖案例

### 5. 客户战略分析 (Strategy) `/strategy`
- 重点客户画像
- 行业趋势分析
- 竞对策略研判

### 6. AI 与云商动态 (News) `/news`
- 行业动态更新
- 产品发布信息
- 市场分析报告

### 7. 官网上新 (NewProducts) `/new-products`
- 按周次切换查看
- 卡片/列表双视图
- 支持关键词搜索和分类筛选
- 数据来源：腾讯云官网产品动态

### 8. 模型商价格动态 (ModelPrice) `/model-price`
- 覆盖 DeepSeek、Kimi、MiniMax、GLM 四家厂商
- 厂商切换查看各模型定价（输入/输出/缓存命中）
- 价格变更高亮提醒
- 近期厂商公告汇总
- 跨厂商主力模型价格对比表

### 9. 登录页 (Login) `/login`
- 太湖/TOF 模式：通过太湖注入身份信息，首次访问显示登录确认页，确认后进入系统

---

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 创建新的 `.vue` 文件
2. 在 `src/router/index.ts` 添加路由配置：
   ```ts
   {
     path: '/new-page',
     name: 'NewPage',
     component: () => import('@/views/NewPage.vue'),
     meta: { requiresAuth: true, title: '新页面' }
   }
   ```
3. 在 `src/components/layout/Sidebar.vue` 添加菜单项

### 添加新 API 接口

1. 在 `functions/api/` 创建 `.ts` 文件（文件路径 = API 路由）
2. 使用统一认证入口：
   ```ts
   import { authenticate } from '../_lib/auth-unified';
   import { jsonResponse } from '../_lib/response';
   
   export async function onRequest(context) {
     const user = await authenticate(context.request, context.env);
     if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);
     
     // 业务逻辑
     return jsonResponse({ data: 'ok' });
   }
   ```

### 添加新组件

按类型选择目录：
- `components/layout/` - 布局组件
- `components/common/` - 通用组件
- `components/[页面名]/` - 页面专用组件

### 样式规范

- 使用 CSS Variables 定义颜色和间距
- 遵循 BEM 命名规范（可选）
- 组件样式使用 `scoped` 限定作用域
- 避免使用 `!important`

### 类型规范

- 前后端共享类型放在 `shared/types.ts`
- 组件 Props 使用 `defineProps<T>()` 方式
- API 响应必须定义接口类型

---

## 🌐 部署指南

### 当前目标架构：内网服务器部署（主方案）

你已完成前置条件：

- ✅ 内网服务器已申请
- ✅ `strategicsouth.woa.com` 已解析到服务器内网 IP
- ✅ 太湖平台站点已创建
- ✅ TOF 登录已配置

当前部署链路：

```text
用户浏览器
  → strategicsouth.woa.com
  → 太湖/TOF 鉴权并注入身份 Header
  → 内网服务器 Nginx:80
      ├─ /              → /opt/strategic-platform/dist/（Vue 静态文件）
      └─ /api/*         → 127.0.0.1:3000（Node.js Express 后端）
```

> 迁移完成前：**不要删除 EdgeOne Pages 项目、环境变量、KV、历史部署和回滚入口**。旧 EdgeOne 方案保留在下方「EdgeOne 备份部署方案」。

### 截至目前进展（2026-04-29）

**已完成**：

- ✅ 内网服务器已申请，IP：`21.214.41.205`。
- ✅ `strategicsouth.woa.com` 已在 UDNS 解析到服务器内网 IP。
- ✅ 太湖平台站点已创建，TOF 登录已配置。
- ✅ 本地已新增并提交内网服务器部署文件：`deploy/`、`deploy/server/`、`deploy/nginx.conf`。
- ✅ 本地代码已推送到 GitHub `main` 分支，最新提交包含内网部署文件。
- ✅ 服务器曾成功执行 `git clone`，项目目录为 `/opt/src/strategic-platform-src`。
- ✅ 服务器上已成功构建前端 `dist/`，并曾将前端静态文件复制到 `/opt/strategic-platform/dist/`。

**未完成**：

- ⏳ 服务器尚未成功 `git pull` 到包含 `deploy/` 的最新代码。
- ⏳ 尚未复制 `deploy/server/*` 到 `/opt/strategic-platform/server/`。
- ⏳ 尚未配置 `/opt/strategic-platform/server/.env` 中的 `TAI_APP_TOKEN`、`JWT_SECRET` 等生产环境变量。
- ⏳ 尚未执行后端依赖安装：`cd /opt/strategic-platform/server && npm install --production`。
- ⏳ 尚未配置并启动 `systemd` 服务：`strategic-platform`。
- ⏳ 尚未写入并重载 Nginx 配置：`/etc/nginx/conf.d/strategic-platform.conf`。
- ⏳ 尚未完成服务器本地验证和域名访问验证。

**当前阻塞点**：

- 服务器 SSH 实际监听端口为 `30000`，但从 Mac 直连会在握手阶段被关闭，无法远程自动部署。
- 服务器控制台存在输入异常：命令会自动变成大写，导致 `cd`、`git`、`read` 等 Linux 命令执行失败。
- GitHub Token 曾在控制台尝试过程中输入/暴露过，建议吊销旧 Token，重新生成只读 Token 后再继续。

**下次继续建议**：

1. 先解决服务器控制台自动大写问题，或改用 WebShell/浏览器 SSH/云终端。
2. 在服务器执行：`cd /opt/src/strategic-platform-src && git pull origin main`。
3. 确认 `deploy/server/package.json` 存在后，继续执行下方「手动部署」。

### 迁移安全策略（确保迁移成功前旧站仍可用）

1. **保留 EdgeOne Pages 最新成功部署**：不要删除 `edgeone.json`、`functions/`、EdgeOne Pages 项目和控制台配置。
2. **先本机和服务器本地验证，再切正式入口**：服务器上先通过 `curl http://localhost/api/health`、`curl http://localhost/` 验证。
3. **保留回滚路径**：如果新服务器异常，回滚到 EdgeOne 的方式是把入口重新切回原 EdgeOne/网关配置，并继续使用 EdgeOne Pages 控制台里的最新成功部署。
4. **Nginx 配置先备份再覆盖**：`deploy/deploy.sh` 会备份 `/etc/nginx/conf.d/strategic-platform.conf` 到 `/etc/nginx/backup/`。
5. **服务器 `.env` 不要随部署覆盖**：首次部署写入真实环境变量；后续更新代码时保留原 `.env`。

### 一键部署到内网服务器（推荐）

在本地项目目录执行：

```bash
cd /Users/cherylshen/CodeBuddy/战略客户部\ ·\ 华南拓展中心\ ·\ 数据\&文档汇总平台

# 必填：从太湖平台应用概览获取 APP_TOKEN；JWT_SECRET 使用 32 位以上随机字符串
export TAI_APP_TOKEN='你的太湖APP_TOKEN'
export JWT_SECRET='请替换为32位以上随机字符串'

# 可选：限制可访问用户，留空表示不限制
export TOF_ALLOWED_USERS='anniexzhang,adamyide,blackyzhang,cherylzshen,dinghaoyang,ethanmhua,mercuryyan,shixu,wayynewang,zyfeizhang'

# 将 root@内网IP 替换为你的服务器 SSH 地址
bash deploy/deploy.sh root@你的服务器内网IP
```

脚本会完成：

1. 在服务器安装/检查 `Nginx`、`Node.js 18+`、编译依赖。
2. 本地执行 `npm run build` 生成 `dist/`。
3. 上传 `dist/` 到 `/opt/strategic-platform/dist/`。
4. 上传 `deploy/server/` 下的 Express 后端到 `/opt/strategic-platform/server/`。
5. 配置 `systemd` 服务 `strategic-platform`。
6. 配置 Nginx：静态资源走 `dist/`，`/api/*` 反代到 `127.0.0.1:3000`。
7. 执行健康检查。

### 首次部署后在服务器确认配置

登录服务器：

```bash
ssh root@你的服务器内网IP
cd /opt/strategic-platform/server
cat .env
```

确认 `.env` 至少包含：

```bash
TAI_APP_TOKEN=你的太湖APP_TOKEN
AUTH_MODE=auto
TOF_ALLOWED_USERS=允许访问的英文名列表，或留空
JWT_SECRET=32位以上随机字符串
PORT=3000
DB_PATH=/opt/strategic-platform/server/data/strategic.db
```

如果需要手动修改：

```bash
vim /opt/strategic-platform/server/.env
systemctl restart strategic-platform
```

### 服务器验证命令

```bash
# 1. 后端健康检查
curl -s http://localhost/api/health

# 2. TOF 检查：本地直连不会有太湖 Header，authenticated=false 属于正常现象
curl -s http://localhost/api/auth/check

# 3. 首页静态资源
curl -I http://localhost/

# 4. 服务状态
systemctl status strategic-platform --no-pager
systemctl status nginx --no-pager

# 5. 实时日志
journalctl -u strategic-platform -f
```

浏览器访问：

```text
http://strategicsouth.woa.com
```

预期现象：

- ✅ 能打开页面：Vue 静态资源部署成功。
- ✅ 首次访问出现登录确认页：太湖 Header 已注入，等待用户确认。
- ✅ 确认后进入首页：TOF + 会话生效。
- ⚠️ 一直显示普通登录页：检查太湖站点是否正确回源到服务器，以及 Header 是否透传。
- ⚠️ `/api/*` 404 或 502：检查 `strategic-platform` 服务和 Nginx 反代。

### 后续增量部署到内网服务器

仅更新前端和后端代码时：

```bash
export TAI_APP_TOKEN='你的太湖APP_TOKEN'
export JWT_SECRET='当前服务器正在使用的JWT_SECRET'
bash deploy/deploy.sh root@你的服务器内网IP
```

> 注意：后续部署不要随意更换 `JWT_SECRET`，否则已有 JWT 登录态会失效。

### 手动部署（脚本失败时使用）

```bash
# 本地构建
npm install
npm run build

# 服务器创建目录
ssh root@你的服务器内网IP 'mkdir -p /opt/strategic-platform/{dist,server/data,logs}'

# 上传前端和后端
scp -r dist/* root@你的服务器内网IP:/opt/strategic-platform/dist/
scp deploy/server/package.json deploy/server/server.js deploy/server/db.js deploy/server/tof.js root@你的服务器内网IP:/opt/strategic-platform/server/
scp deploy/nginx.conf root@你的服务器内网IP:/etc/nginx/conf.d/strategic-platform.conf

# 服务器安装依赖并启动
ssh root@你的服务器内网IP
cd /opt/strategic-platform/server
npm install --production
vim .env
systemctl restart strategic-platform
nginx -t && systemctl reload nginx
```

### 常用运维命令

```bash
# 重启应用
systemctl restart strategic-platform

# 查看应用日志
journalctl -u strategic-platform -n 100 --no-pager
journalctl -u strategic-platform -f

# 查看 Nginx 配置和日志
nginx -t
systemctl reload nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看部署目录
ls -lah /opt/strategic-platform
ls -lah /opt/strategic-platform/dist
ls -lah /opt/strategic-platform/server
```

### EdgeOne 备份部署方案（保留，不作为当前主方案）

迁移完全验证前，EdgeOne 方案作为备份保留：

```bash
# 1. 安装 EdgeOne CLI
npm install -g edgeone

# 2. 登录 EdgeOne（选择 China 区域）
edgeone login

# 3. 构建项目
npm run build

# 4. 部署
edgeone pages deploy
```

增量部署到 EdgeOne：

```bash
npm run build && edgeone pages deploy
```

EdgeOne 环境变量仍按原配置保留：

- `TAI_APP_TOKEN` = 太湖应用 Token（32位，JWE 解密用）
- `JWT_SECRET` = 自定义强密钥（至少 32 字符）
- `TOF_ALLOWED_USERS` = 允许的用户列表（逗号分隔，留空则不限制）

---

## ❓ 常见问题

### Q1：本地开发时 TOF 认证不生效？
**A**：TOF 认证依赖 NGate 网关注入的 Header，本地开发不经过 NGate。本地使用 JWT 模式登录即可。

### Q2：部署后访问 `/api/*` 返回 404？
**A**：检查 `edgeone.json` 中 `functions.directory` 配置是否为 `functions`。

### Q3：如何添加管理员账号？
**A**：首次部署后调用 `POST /api/admin/init`，传入用户名和密码即可创建管理员。

### Q4：EdgeOne KV 如何查看数据？
**A**：在 EdgeOne 控制台 → 边缘函数 → KV 命名空间中查看。

### Q5：太湖网关 Header 包含哪些字段？
**A**（安全模式）：
```
x-tai-identity:  JWE 加密身份信息（需 APP_TOKEN 解密）
TIMESTAMP:      Unix 时间戳（秒）
SIGNATURE:      网关签名（SHA256 校验）
X-Rio-Seq:      请求序列号
```

解密后 payload 示例：
```json
{
  "LoginName": "cherylshen",
  "StaffId": 12345,
  "ChineseName": "沈晨曦",
  "Expiration": "2026-04-28T12:00:00+08:00"
}
```

**A**（兼容模式 - 旧版）：
```
StaffName:    员工英文名（如 cherylshen）
StaffID:      员工 ID
X-Tof-Token:  签名 Token
X-Real-IP:    真实 IP
```

### Q6：如何切换认证模式？
**A**：修改环境变量 `AUTH_MODE`：
- `auto` - 自动检测（推荐）
- `tof` - 仅 TOF
- `jwt` - 仅 JWT

### Q7：部署失败提示权限不足？
**A**：确认 EdgeOne CLI 已登录且账号有项目权限：
```bash
edgeone whoami
```

### Q8：页面刷新后登录状态丢失？
**A**：
- JWT 模式：检查 localStorage 是否被清空
- TOF 模式：检查 NGate 是否正常路由请求

---

## 🔒 安全建议

- ✅ 敏感数据（成本、对接人）已添加认证保护
- ✅ 使用 HTTPS 加密传输
- ✅ TOF 模式基于公司统一认证，无需存储密码
- ✅ JWT Token 使用 HS256 签名
- ✅ 密码使用 bcrypt 哈希（salt rounds = 10）
- ✅ 富文本内容使用 DOMPurify 清理 XSS
- ⚠️ 定期轮换 `JWT_SECRET` 和 `TOF_TOKEN`
- ⚠️ 不要将 `.env` 文件提交到 Git

---

## 📖 相关文档

- [Vue 3 文档](https://vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [EdgeOne Pages 文档](https://pages.edgeone.ai/)
- [EdgeOne Functions 文档](https://pages.edgeone.ai/document/edgeone-functions)
- [NGate 接入指引](https://ngate.woa.com/)
- [TOF 认证文档](https://iwiki.woa.com/) (搜索 "TOF 认证")

---

## 👥 团队

**战略客户部 · 华南拓展中心**

- 项目维护：战略客户部
- 平台建设：华南拓展中心

---

## 📝 待办事项

### 🔄 数据自动更新（按优先级排序）

| 优先级 | 模块 | 自动化内容 | 实现方式 | 状态 |
|--------|------|------------|----------|------|
| ⭐⭐⭐ | 模型商价格动态 | 爬取 4 家厂商官方定价页，自动对比并更新 `modelPriceData.ts` | GitHub Actions + TypeScript 爬取脚本 | 📋 待开发 |
| ⭐⭐ | AI 与云商动态 | 爬取 ai.hubtoday.app + 官方博客，AI 生成摘要并插入 `newsData.ts` | Puppeteer + CodeBuddy SDK | 📋 待开发 |
| ⭐⭐ | 官网上新 | 爬取腾讯云新品发布页，自动分类插入 `newProductsData.ts` | GitHub Actions + 爬取脚本 | 📋 待开发 |
| ⭐ | 成本变化 | RSS 订阅 + 关键词监控厂商涨价公告 | RSS Parser + 关键词匹配 | 📋 待开发 |
| ⭐ | 客户战略分析 | AI 搜索财报/新闻，生成摘要待人工审核 | CodeBuddy SDK + 人工审核流程 | 💡 规划中 |

### 🛠️ 实现步骤（参考）

#### 第一步：创建爬取脚本
```bash
mkdir -p scripts/data-sync
touch scripts/data-sync/fetch-ai-news.ts
touch scripts/data-sync/fetch-model-prices.ts
touch scripts/data-sync/fetch-new-products.ts
```

#### 第二步：配置 GitHub Actions
```yaml
# .github/workflows/data-sync.yml
name: 数据同步（自动爬取）
on:
  schedule:
    - cron: '0 1 * * 1'   # 每周一 09:00 北京时间（模型价格）
    - cron: '0 0 * * *'   # 每天 08:00 北京时间（AI 动态）
  workflow_dispatch:
```

#### 第三步：参考文档
- 自动化方案详见：「AI与云商动态板块」skill 文档
- 数据更新 SOP：`docs/内容更新SOP.md`
- 模型商定价页清单：`src/data/modelPriceData.ts` 头部注释

---

## 📅 更新日志

### v1.4.0 (2026-04-28)

**新增 - 太湖鉴权安全模式**
- ✨ JWE 解密支持：使用 `x-tai-identity` 获取加密用户信息
- ✨ 登录确认机制：首次登录需手动确认（返回 449 状态码）
- ✨ 登录确认页面（`LoginConfirm.vue`）
- ✨ 用户管理 API：
  - `GET /api/admin/users` - 用户列表
  - `PUT /api/admin/users/:username/role` - 修改角色
  - `PUT /api/admin/users/:username/status` - 启用/禁用
  - `GET /api/admin/login-logs` - 登录日志
- ✨ 用户管理模块（`functions/_lib/users.ts`）
- ✨ 管理员权限中间件（`functions/_lib/admin.ts`）
- ✨ 登录会话管理（8小时有效期）

**环境变量更新**
- 新增 `TAI_APP_TOKEN`：太湖安全模式 Token（JWE 解密用）
- 优先使用 `TAI_APP_TOKEN`，回退到 `TOF_TOKEN`

**优化**
- ⚡ `functions/_lib/tof.ts` 重构：添加 JWE 解密、登录会话管理
- ⚡ `functions/_lib/kv.ts` 增强：添加 session 和 loginLog Key
- ⚡ `src/api/auth.ts` 更新：添加 checkAuthStatus、confirmLogin
- ⚡ README 更新：太湖安全模式配置说明

---

### v1.3.0 (2026-04-27)

**新增**
- ✨ 模型商价格动态页面（ModelPrice）：覆盖 DeepSeek、Kimi、MiniMax、GLM 四家厂商
- ✨ 厂商切换 Tabs + 定价表格（输入/输出/缓存命中价格）
- ✨ 价格变更高亮提醒
- ✨ 近期厂商公告汇总
- ✨ 跨厂商主力模型价格对比表
- ✨ 数据文件 `modelPriceData.ts`，含四家厂商完整定价数据

**数据来源**
- DeepSeek：官方 API 定价页（2026-04-27 抓取）
- Kimi：官方定价页（K2.6 于 2026-04-20 发布）
- MiniMax：开放平台按量计费页（2026-04-27 抓取）
- GLM（智谱 AI）：开放平台定价页（2026-04-27 抓取）

---

### v1.2.1 (2026-04-24)

**新增**
- ✨ 官网上新（NewProducts）：新增 W17 数据（4月20-26日）
- ✨ 云点播 VOD AIGC 大模型能力（GLM/MiniMax 接入）
- ✨ 全球应用加速 GA 2.0 新增加速节点（亚太/中东/南非）

**优化**
- ⚡ 更新 SOP 文档（`docs/内容更新SOP.md`）

---

### v1.2.0 (2026-04-24)

**新增**
- ✨ 成本变化页面（Cost）：单价涨幅明细、行业成本汇总、对接人一览
- ✨ 产品售卖指引页面（ProductGuide）：大背景、行业分析、产品全景、售卖案例
- ✨ 官网上新页面（NewProducts）：周次切换、卡片/列表双视图
- ✨ 统一认证系统：TOF + JWT 双模式
- ✨ Pinia 状态管理（auth store）
- ✨ EdgeOne Functions 后端 API
- ✨ EdgeOne KV 数据存储

**优化**
- ⚡ 路由守卫：未登录用户自动跳转登录页
- ⚡ Sidebar 导航：从 4 项扩展为 7 项
- ⚡ Vite 配置：路径别名、端口 3000

**移除**
- ❌ 折扣信息页面（Discount.vue）
- ❌ 折扣数据（discountData.ts）

---

### v1.1.0 (2026-04-21)

**新增**
- ✨ TOF 认证支持（NGate + TOF 免登录）
- ✨ 统一认证入口 `auth-unified.ts`，自动检测认证模式
- ✨ 行业资讯页面（News）
- ✨ 登录页面（Login）
- ✨ Pinia 认证状态管理
- ✨ EdgeOne Functions 后端 API
- ✨ EdgeOne KV 数据存储

**优化**
- ⚡ 路由守卫启用认证校验
- ⚡ HTTP 请求自动携带 Token
- ⚡ 前后端共享类型定义

**部署**
- 🚀 首次部署到 EdgeOne Pages
- 🚀 配置 NGate + TOF 认证

### v1.0.0 (2026-04-19)

**新增**
- ✨ 初始化项目结构
- ✅ 基础布局（Topbar, Sidebar, MainArea）
- ✅ 6 个页面组件
- ✅ 样式文件提取与整理
- ✅ 成本变化页面搜索和筛选
- ✅ Vue Router 页面路由

---

## 📄 License

内部项目，仅供腾讯公司内部使用。
