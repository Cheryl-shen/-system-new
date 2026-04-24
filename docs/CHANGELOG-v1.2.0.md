# 版本修改报告 v1.2.0

> 生成时间：2026-04-24  
> 对比基准：v1.1.0（commit 前工作区未提交变更）

---

## 一、概述

本次变更为项目 **大规模前端重构**，涉及认证系统、页面结构、数据流、部署架构等多个维度。主要目标：引入企业级认证体系，新增多个核心业务页面，并将项目从纯静态站点升级为支持 EdgeOne Functions 的全栈应用。

---

## 二、新增文件清单

### 1. 认证相关
| 文件 | 说明 |
|------|------|
| `src/stores/auth.ts` | Pinia 认证状态管理，支持 TOF/JWT 双模式 |
| `src/api/auth.ts` | 认证 API 封装，含本地开发 Mock 实现 |
| `src/views/Login.vue` | 统一登录页，支持 TOF 自动认证 + 账密登录 |

### 2. 业务页面
| 文件 | 说明 |
|------|------|
| `src/views/Cost.vue` | **成本变化**页（新），含 3 个 Tab：单价涨幅明细、行业成本汇总、对接人一览 |
| `src/views/ProductGuide.vue` | **产品售卖指引**页（新），含大背景/行业分析/产品全景/售卖案例 |
| `src/views/NewProducts.vue` | **官网上新**页（新），支持周次切换、卡片/列表双视图 |

### 3. EdgeOne 后端
| 文件 | 说明 |
|------|------|
| `functions/api/auth/login.ts` | JWT 登录接口 |
| `functions/api/auth/me.ts` | 获取当前用户信息 |
| `functions/api/auth/logout.ts` | 登出接口 |
| `functions/api/auth/tof/check.ts` | TOF 认证检查接口 |
| `functions/api/auth/ioa/login.ts` | IOA OAuth2 登录入口 |
| `shared/types.ts` | 前后端共享类型定义 |
| `scripts/init-kv.ts` | KV 存储初始化脚本 |

### 4. 配置/文档
| 文件 | 说明 |
|------|------|
| `edgeone.json` | EdgeOne Pages 部署配置（Functions、KV、环境变量）|
| `docs/ioa-auth.md` | IOA 认证方案设计文档 |

---

## 三、删除文件清单

| 文件 | 说明 |
|------|------|
| `src/views/Discount.vue` | 折扣信息页（已移除）|
| `src/data/discountData.ts` | 折扣数据（已移除）|

---

## 四、修改文件详情

### 1. `package.json`
- **新增依赖**：`pinia`（状态管理）、`@tiptap/*`（富文本编辑器）、`dompurify`
- **新增 devDependencies**：`bcryptjs`、`jose`（JWT 签名）、`tsx`（脚本执行）
- **新增脚本**：`init-kv`（KV 初始化）
- 版本号仍为 `1.0.0`（未随变更升级）

### 2. `src/router/index.ts`
- 新增路由守卫（`beforeEach`），支持认证校验
- 新增路由：`/login`（空白布局）、`/cost`、`/product-guide`、`/new-products`
- 移除路由：`/discount`
- 支持 `meta.public` 标记公开路由
- 支持 `LOCAL_AUTH_ENABLED` 开关（开发调试用，账号 `strategic` / 密码 `strategic 2026`）

### 3. `src/App.vue`
- 支持 **空白布局**（`meta.layout === 'blank'`），用于登录页
- 新增移动端侧边栏遮罩层（`.overlay`）
- 通过 `provide/inject` 传递 `sidebarOpen` 状态

### 4. `src/components/layout/Sidebar.vue`
- 导航菜单从 4 项扩展为 **7 项**：
  1. 首页概览
  2. 售卖弹药（AI 标签）
  3. 成本变化（NEW 标签）← 新增
  4. 产品售卖指引 ← 新增
  5. 客户战略分析
  6. AI 与云商动态（HOT 标签）
  7. 官网上新（NEW 标签）← 新增
- 每个菜单项支持 `badge` / `badgeClass` 配置

### 5. `src/components/layout/Topbar.vue`（待确认）
- 预计新增用户头像/姓名展示
- 预计新增登出按钮

### 6. `src/main.ts`
- 挂载 `Pinia` 插件（`app.use(createPinia())`）

### 7. `vite.config.ts`
- 新增 `resolve.alias`：`@` → `src`，`@shared` → `shared`
- 开发服务器端口改为 `3000`，自动打开浏览器

### 8. `src/data/newsData.ts`（待确认）
- 预计新增 AI 大事件数据（4/20-4/24）

### 9. `tsconfig.json`（待确认）
- 预计新增 path alias 配置，匹配 Vite alias

---

## 五、架构变更

### 认证架构
```
 before: 无认证（所有页面公开）
 after: 双模式认证
   ├── TOF 模式（NGate 网关，Header 读取用户信息，免登录）
   └── JWT 模式（IOA OAuth2 / 本地账密，Token 存 localStorage）
```

### 部署架构
```
 before: 纯静态站点（Vite build → dist）
 after: EdgeOne Pages 全栈应用
   ├── 前端：Vite build → dist
   ├── 后端：EdgeOne Functions（Node.js Runtime）
   └── 数据：EdgeOne KV（REPORTS_KV 命名空间）
```

### 数据流
```
 before: 静态数据（import ts 文件）
 after: 混合数据
   ├── 静态数据：import ts 文件（产品指引、官网上新等）
   └── 动态数据：EdgeOne Functions + KV（用户信息、未来扩展）
```

---

## 六、影响评估

### ✅ 正面影响
1. **安全性大幅提升**：引入认证体系，保护内部数据
2. **可扩展性增强**：EdgeOne Functions 支持未来后端接口开发
3. **用户体验提升**：新增 3 个核心业务页面，信息更完整
4. **部署规范化**：EdgeOne Pages 标准配置，支持 CI/CD

### ⚠️ 潜在风险
1. **未提交代码量大**：当前所有变更均为「未暂存」或「未跟踪」状态，建议尽快提交
2. **`package.json` 版本号未更新**：仍为 `1.0.0`，应升级为 `1.2.0`
3. **`Discount.vue` 直接删除**：如有外部链接指向该页面，会产生 404
4. **EdgeOne Functions 本地开发体验**：`edgeone dev` 启动速度较 `vite dev` 慢

### 📋 建议行动
1. 将所有变更提交为一个 commit（版本 `v1.2.0`）
2. 更新 `README.md` 中的版本历史
3. 升级 `package.json` 版本号至 `1.2.0`
4. 测试所有 7 个页面的路由跳转
5. 测试登录流程（TOF 模式 + JWT 模式）

---

## 七、版本号建议

根据语义化版本规范，本次变更属于 **次版本号升级**（新增功能，未破坏现有 API）：

```
当前：v1.1.0
建议：v1.2.0
```

**版本说明（建议写入 README）**：

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
- ⚡ App.vue 支持空白布局（登录页）
- ⚡ Vite 配置：路径别名、端口 3000

**移除**
- ❌ 折扣信息页面（Discount.vue）
- ❌ 折扣数据（discountData.ts）

**部署**
- 🚀 EdgeOne Pages 标准配置（edgeone.json）
- 🚀 Functions + KV 支持

---

*报告结束*
