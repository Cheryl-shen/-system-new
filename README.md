# 战略客户部 · 华南拓展中心 · 数据&文档汇总平台

基于 Vue 3 + TypeScript + Vite 构建的内部文档管理平台，部署于 EdgeOne Pages，支持 NGate + TOF 免登录认证，用于团队日常工作所需数据和文档的统一管理。

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
│   │   └── http.ts              # HTTP 请求封装（axios 风格）
│   ├── assets/                  # 资源文件
│   │   └── styles/              # 样式文件
│   │       ├── variables.css    # CSS 变量（颜色/间距/阴影）
│   │       ├── base.css         # 基础样式重置
│   │       ├── components.css   # 通用组件样式
│   │       └── main.css         # 样式入口
│   ├── components/              # 组件
│   │   ├── layout/              # 布局组件
│   │   │   ├── Topbar.vue       # 顶部栏（含用户信息）
│   │   │   ├── Sidebar.vue      # 侧边栏（导航菜单）
│   │   │   └── MainArea.vue     # 主内容区
│   │   ├── common/              # 通用组件
│   │   └── home/                # 首页组件
│   ├── stores/                  # Pinia 状态管理
│   │   └── auth.ts              # 认证状态（用户/Token/角色）
│   ├── views/                   # 页面组件
│   │   ├── Home.vue             # 首页
│   │   ├── SalesGuide.vue       # 销售指引
│   │   ├── News.vue             # 行业资讯
│   │   ├── Cost.vue             # 成本变化
│   │   ├── ProductGuide.vue     # 产品售卖指引
│   │   ├── Strategy.vue         # 客户战略分析
│   │   └── Login.vue            # 登录页
│   ├── data/                    # 静态数据
│   │   ├── costData.ts          # 成本数据
│   │   ├── newsData.ts          # 行业资讯数据
│   │   ├── salesGuideData.ts    # 销售指引数据
│   │   └── strategyData.ts      # 战略分析数据
│   ├── router/                  # 路由
│   │   └── index.ts             # 路由配置 + 守卫
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 入口文件
├── functions/                   # EdgeOne Functions（Serverless 后端）
│   ├── api/                     # API 路由
│   │   ├── auth/                # 认证接口
│   │   │   ├── me.ts            # 获取当前用户信息
│   │   │   ├── login.ts         # 本地账密登录
│   │   │   ├── logout.ts        # 登出
│   │   │   ├── ioa/             # IOA OAuth2
│   │   │   │   ├── login.ts     # 发起 IOA 授权
│   │   │   │   └── callback.ts  # IOA 回调
│   │   │   └── tof/             # TOF 认证
│   │   │       └── check.ts     # 检查 TOF 状态
│   │   └── admin/               # 管理接口
│   │       └── init.ts          # 初始化管理员
│   └── _lib/                    # 后端工具库
│       ├── auth.ts              # JWT 认证工具
│       ├── auth-unified.ts      # 统一认证入口（TOF + JWT）
│       ├── tof.ts               # TOF 认证工具
│       ├── ioa.ts               # IOA OAuth2 工具
│       ├── kv.ts                # EdgeOne KV 封装
│       ├── password.ts          # bcrypt 密码工具
│       ├── audit.ts             # 审计日志
│       └── response.ts          # HTTP 响应工具
├── shared/                      # 前后端共享代码
│   └── types.ts                 # 共享类型定义
├── scripts/                     # 脚本工具
│   └── init-kv.ts               # 初始化 KV 数据
├── docs/                        # 文档
│   └── ioa-auth.md              # IOA 认证方案
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
npm run dev
```

访问 http://localhost:3000

> **提示**：本地开发默认使用 JWT 认证模式。TOF 模式需要在 NGate 网关后才能生效。

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
npm run init-kv
```

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
| EdgeOne Pages | 静态托管 + 边缘函数 |
| NGate | 内部接入网关 |
| TOF | 公司统一身份认证 |
| IOA | 公司办公认证 |

---

## 🔐 认证方式

本项目支持**自动检测**的双模式认证，统一入口位于 `functions/_lib/auth-unified.ts`。

### 模式 1：TOF 认证（生产环境）

**流程**：
```
用户 → 浏览器 → tencentsouth.top
             ↓
          NGate 网关
        （TOF 认证插件）
             ↓
     注入 Header：
     - StaffName: 员工英文名
     - StaffID: 员工 ID
     - X-Tof-Token: 签名
             ↓
       EdgeOne Pages
             ↓
    functions/api/auth/me
    （从 Header 读取用户）
```

**特点**：
- ✅ 免登录，用户无感知
- ✅ 基于公司统一认证，安全可靠
- ✅ 自动续期，无需管理 Token

### 模式 2：JWT 认证（开发/降级）

**流程**：
```
用户 → 登录页 → 点击"IOA 登录"
             ↓
        /api/auth/ioa/login
             ↓
      IOA 授权页（输入账号）
             ↓
        /api/auth/ioa/callback
             ↓
       签发 JWT Token
             ↓
      前端存 localStorage
             ↓
  后续请求：Authorization: Bearer <token>
```

**特点**：
- ✅ 支持本地开发调试
- ✅ Token 存 localStorage，刷新不丢
- ✅ 作为 TOF 模式的降级方案

### 自动检测逻辑

`functions/_lib/auth-unified.ts` 会依次尝试：

1. 检查请求 Header 中是否有 `StaffName`（TOF 已认证）
2. 没有则检查 `Authorization: Bearer <token>`（JWT）
3. 都没有则返回 401

---

## ⚙️ 环境变量

在 `edgeone.json` 中声明，部署时在 EdgeOne 控制台配置实际值：

| 变量 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `JWT_SECRET` | secret | ✅ | JWT 签名密钥（至少 32 字符） |
| `AUTH_MODE` | text | ❌ | 认证模式：`auto`(默认) / `tof` / `jwt` |
| `TOF_TOKEN` | secret | ⚠️ | 太湖应用 Token，TOF 模式必填 |
| `IOA_CLIENT_ID` | text | ❌ | IOA 应用 ID（JWT 模式需要） |
| `IOA_CLIENT_SECRET` | secret | ❌ | IOA 应用密钥（JWT 模式需要） |
| `IOA_REDIRECT_URI` | text | ❌ | IOA 回调地址 |

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
| POST | `/api/auth/login` | 本地账密登录 | 无 |
| POST | `/api/auth/logout` | 登出 | 必需 |
| GET | `/api/auth/ioa/login` | 发起 IOA 授权 | 无 |
| GET | `/api/auth/ioa/callback` | IOA 回调 | 无 |
| GET | `/api/auth/tof/check` | 检查 TOF 认证状态 | 无 |

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

**本地登录**
```bash
curl -X POST https://tencentsouth.top/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"xxx"}'
```

响应：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "username": "admin",
    "displayName": "管理员",
    "role": "admin",
    "customerIds": []
  }
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

### 2. 销售指引 (SalesGuide) `/sales-guide`
- 销售流程规范
- 客户沟通话术
- 商务谈判指引

### 3. 行业资讯 (News) `/news`
- 行业动态更新
- 产品发布信息
- 市场分析报告

### 4. 成本变化 (Cost) `/cost`
- 单价涨幅明细
- 行业成本汇总
- 对接人一览
- 支持搜索和筛选

### 5. 产品售卖指引 (ProductGuide) `/product-guide`
- 大背景分析
- 行业宏观分析
- 腾讯云 AI 产品全景
- 售卖案例

### 6. 客户战略分析 (Strategy) `/strategy`
- 重点客户画像
- 行业趋势分析
- 竞对策略研判

### 7. 登录页 (Login) `/login`
- TOF 模式：自动跳转，用户无感知
- JWT 模式：显示"IOA 登录"按钮

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

### 首次部署

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

### 增量部署

每次代码更新后：
```bash
npm run build && edgeone pages deploy
```

### 配置 NGate + TOF

#### 步骤 1：UDNS 域名解析

- 访问 http://udns.woa.com
- 申请域名 `tencentsouth.top`
- 解析类型：CNAME
- 解析内容：`gz.ngate.woa.com`
- 域名类型：其他
- 归属 BG：CSIG 云与智慧产业事业群

#### 步骤 2：NGate 接入

- 访问 https://ngate.woa.com
- 创建系统 → 创建应用
- 绑定域名：`tencentsouth.top`
- 创建路由：
  - 路径：`/*`
  - 后端地址：EdgeOne Pages 域名（`xxx.pages.edgeone.woa.com`）
- 启用 **TOF 认证插件**
- 获取 **太湖应用 Token**

#### 步骤 3：环境变量配置

在 EdgeOne Pages 控制台 → 项目设置 → 环境变量：
- `TOF_TOKEN` = 太湖应用 Token
- `JWT_SECRET` = 自定义强密钥（至少 32 字符）

#### 步骤 4：验证

访问 `https://tencentsouth.top`：
- ✅ 自动跳转且无需登录 → TOF 模式生效
- ⚠️ 显示登录页 → 检查 NGate 路由和 TOF 插件

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

### Q5：TOF Header 包含哪些字段？
**A**：
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
- [IOA 认证方案](./docs/ioa-auth.md)

---

## 👥 团队

**战略客户部 · 华南拓展中心**

- 项目维护：战略客户部
- 平台建设：华南拓展中心

---

## 📅 更新日志

### v1.1.0 (2026-04-21)

**新增**
- ✨ TOF 认证支持（NGate + TOF 免登录）
- ✨ JWT 认证支持（IOA OAuth2 登录）
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
