# 战略客户部 · 华南拓展中心 · 数据&文档汇总平台

这是基于 Vue 3 + TypeScript + Vite 构建的内部文档管理平台，用于团队日常工作所需数据和文档的统一管理。

## 📋 项目结构

```
strategic-platform/
├── public/                      # 静态资源
├── src/
│   ├── assets/                  # 资源文件
│   │   └── styles/              # 样式文件
│   │       ├── variables.css    # CSS 变量
│   │       ├── base.css         # 基础样式
│   │       ├── components.css   # 组件样式
│   │       └── main.css         # 主样式入口
│   ├── components/              # 组件
│   │   ├── layout/              # 布局组件
│   │   │   ├── Topbar.vue       # 顶部栏
│   │   │   ├── Sidebar.vue      # 侧边栏
│   │   │   └── MainArea.vue     # 主内容区
│   │   ├── common/              # 通用组件（待补充）
│   │   └── home/                # 首页组件（待补充）
│   ├── views/                   # 页面组件
│   │   ├── Home.vue             # 首页
│   │   ├── SalesGuide.vue       # 销售指引
│   │   ├── Discount.vue         # 报价折扣
│   │   ├── Cost.vue             # 成本变化
│   │   ├── ProductGuide.vue     # 产品售卖指引
│   │   └── Strategy.vue         # 客户战略分析
│   ├── data/                    # 静态数据
│   │   └── costData.ts          # 成本数据
│   ├── router/                  # 路由
│   │   └── index.ts             # 路由配置
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 入口文件
├── index.html                   # HTML 模板
├── package.json                 # 项目配置
├── vite.config.ts               # Vite 配置
└── tsconfig.json                # TypeScript 配置
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📚 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **Vue Router 4** - Vue.js 官方路由
- **Vite** - 下一代前端构建工具
- **CSS3** - 现代 CSS 特性（CSS Variables, Grid, Flexbox）

## 🎨 样式架构

采用 CSS Variables 实现主题定制：

- `variables.css` - 定义所有 CSS 变量（颜色、间距、阴影等）
- `base.css` - 基础样式重置和全局样式
- `components.css` - 通用组件样式
- `main.css` - 样式入口文件

## 📂 页面说明

### 1. 首页 (Home)
- 展示平台概览和统计数据
- 快速导航卡片
- 最近更新列表

### 2. 销售指引 (SalesGuide)
- 销售流程规范
- 客户沟通话术
- 商务谈判指引

### 3. 报价折扣 (Discount)
- 五档折扣体系
- 高价值客户折扣策略
- 审批流程

### 4. 成本变化 (Cost)
- 单价涨幅明细
- 行业成本汇总
- 对接人一览
- 支持搜索和筛选功能

### 5. 产品售卖指引 (ProductGuide)
- 大背景分析
- 行业宏观分析
- 腾讯云 AI 产品全景
- 售卖案例

### 6. 客户战略分析 (Strategy)
- 重点客户画像
- 行业趋势分析
- 竞对策略研判

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 创建新的 `.vue` 文件
2. 在 `src/router/index.ts` 添加路由配置
3. 在 `src/components/layout/Sidebar.vue` 添加菜单项

### 添加新组件

1. 根据组件类型选择目录：
   - `components/layout/` - 布局组件
   - `components/common/` - 通用组件
   - `components/[页面名]/` - 页面专用组件
2. 创建 `.vue` 文件并实现组件逻辑
3. 在需要的地方导入使用

### 样式规范

- 使用 CSS Variables 定义颜色和间距
- 遵循 BEM 命名规范（可选）
- 组件样式使用 `scoped` 限定作用域

## 📝 数据管理

当前使用静态数据文件（`src/data/`），后续可迁移到：

- **API 接口** - 通过 axios 或 fetch 获取数据
- **状态管理** - Pinia 或 Vuex
- **数据库** - 后端数据库存储

## 🌐 部署建议

### 静态部署
```bash
npm run build
# 将 dist/ 目录部署到静态服务器
```

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔐 安全建议

- 敏感数据（成本、对接人信息）建议添加登录验证
- 使用 HTTPS 保护传输数据
- 定期备份数据

## 📖 相关文档

- [Vue 3 文档](https://vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 👥 团队

战略客户部 · 华南拓展中心

## 📅 更新日志

### v1.0.0 (2026-04-19)
- ✨ 初始化项目结构
- ✅ 完成基础布局（Topbar, Sidebar, MainArea）
- ✅ 实现 6 个页面组件
- ✅ 提取和整理样式文件
- ✅ 实现成本变化页面的搜索和筛选功能
- ✅ 使用 Vue Router 实现页面路由
