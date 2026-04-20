# 战略客户部 · 华南拓展中心 数据平台设计文档

> **版本**: v1.0  
> **创建日期**: 2026-04-19  
> **状态**: 设计阶段

---

## 1. 项目概述

### 1.1 项目背景

战略客户部华南拓展中心需要一个统一的内部数据与文档管理平台，用于汇总和展示：

- 销售指引文档
- 报价折扣策略
- 成本变化通知
- 产品售卖指引
- 客户战略分析

当前系统为单文件HTML应用，存在以下问题：
- 数据硬编码在HTML中，难以维护更新
- 无权限控制，所有人可编辑
- 无法多人协作
- 无法追踪修改历史

### 1.2 项目目标

1. **统一数据管理**: 将静态数据迁移到数据库，实现动态管理
2. **权限控制**: 实现角色权限体系（管理员/编辑者/查看者）
3. **多人协作**: 支持团队成员协作编辑内容
4. **操作审计**: 记录所有数据变更历史
5. **部署上线**: 部署到公网服务器，支持安全访问

### 1.3 目标用户

| 角色 | 权限 | 数量预估 |
|------|------|----------|
| 管理员 (ADMIN) | 全部权限，包括用户管理 | 2-3人 |
| 编辑者 (EDITOR) | 编辑内容，查看数据 | 5-10人 |
| 查看者 (VIEWER) | 仅查看数据 | 50+人 |

---

## 2. 功能模块设计

### 2.1 模块概览

基于原始HTML分析，系统包含6个主要页面模块：

```
┌─────────────────────────────────────────────────────────────┐
│                        首页概览                              │
│  - 平台数据统计                                               │
│  - 快捷导航卡片                                               │
│  - 最近更新列表                                               │
└─────────────────────────────────────────────────────────────┘
┌───────────────┬───────────────┬───────────────────────────────┐
│   销售指引    │   报价折扣    │         成本变化              │
│  - 指引文档   │  - 五档折扣   │  - 单价涨幅明细               │
│  - 话术模板   │  - 高价值客户 │  - 行业成本汇总               │
│  - 流程规范   │  - 普通客户   │  - 对接人一览                 │
└───────────────┴───────────────┴───────────────────────────────┘
┌───────────────┬───────────────┐
│ 产品售卖指引  │ 客户战略分析  │
│  - 大背景    │  - 客户画像   │
│  - 行业分析  │  - 行业趋势   │
│  - 产品全景  │  - 竞对策略   │
│  - 售卖案例  │              │
└───────────────┴───────────────┘
```

### 2.2 各模块详细设计

#### 2.2.1 首页概览

**功能描述**: 平台入口页面，展示整体数据概览和快捷入口

**数据项**:
- 文档分类数量（动态统计）
- 当前账期信息
- 最近更新记录（最新5条）

**交互功能**:
- 点击卡片跳转对应模块
- 点击最近更新项跳转详情

#### 2.2.2 销售指引

**功能描述**: 销售流程规范、客户沟通话术、商务谈判指引

**数据项**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| title | string | 标题 |
| category | string | 分类（流程规范/话术模板/谈判指引） |
| content | text | 内容（支持Markdown） |
| attachments | json | 附件列表 |
| sortOrder | number | 排序权重 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |
| createdBy | string | 创建人 |

#### 2.2.3 报价折扣

**功能描述**: 五档折扣体系、高价值客户折扣、普通客户折扣策略

**数据项**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| category | string | 折扣类型（五档/高价值/普通） |
| customerLevel | string | 客户等级 |
| discountRange | string | 折扣范围 |
| conditions | text | 适用条件 |
| approvalFlow | text | 审批流程 |
| notes | text | 备注 |
| sortOrder | number | 排序权重 |
| updatedAt | datetime | 更新时间 |

#### 2.2.4 成本变化

**功能描述**: Q2成本变化通知，包含三个子表

**子表1: 单价涨幅明细**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| product | string | 产品（CVM/CBS/COS/CDB） |
| productType | string | 产品类型 |
| priceChangeType | string | 调价类型 |
| risePercentage | string | 涨幅百分比 |
| effectivePeriod | string | 生效账期 |

**子表2: 行业成本汇总**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| industry | string | 产业大类 |
| productName | string | 成本规划产品名称 |
| priceChangeType | string | 调价类型 |
| avgRiseRange | string | 平均涨幅范围 |
| effectivePeriod | string | 生效账期 |

**子表3: 对接人一览**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| industry | string | 产业大类 |
| productName | string | 产品名称 |
| productContact | json | 产品侧对接人列表 |
| cloudOpContact | string | 云运营对接人 |
| effectivePeriod | string | 生效账期 |

#### 2.2.5 产品售卖指引

**功能描述**: 腾讯云AI产品售卖指引，包含四个部分

**数据结构**:
- **大背景**: 战略层分析 + 市场层数据 + 客户信号应对
- **行业分析**: 多行业（电商/物流/音视频/社交）的AI切入方向和推荐产品
- **产品全景**: 产品分类、核心卖点、售卖定位
- **售卖案例**: 实际案例的背景、策略、结果

**数据项**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| section | string | 部分（背景/行业/产品/案例） |
| subsection | string | 子部分 |
| title | string | 标题 |
| content | json | 结构化内容 |
| industry | string | 所属行业（行业分析专用） |
| sortOrder | number | 排序权重 |

#### 2.2.6 客户战略分析

**功能描述**: 重点客户画像、行业趋势分析、竞对策略研判

**数据项**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| customerName | string | 客户名称 |
| industry | string | 所属行业 |
| profile | text | 客户画像 |
| trend | text | 行业趋势 |
| strategy | text | 竞对策略 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

## 3. 技术架构

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         前端 (Vue 3)                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 首页    │ │ 销售指引│ │ 报价折扣│ │ 成本变化│ │ 产品指引│   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Pinia (状态管理) + Vue Router               │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Axios (HTTP请求) + Element Plus (UI)        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS + JWT
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        后端 (NestJS)                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Controller Layer                      │   │
│  │   AuthController │ DataController │ UserController       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Service Layer                         │   │
│  │   AuthService │ DataService │ UserService               │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Prisma ORM Layer                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据库 (PostgreSQL)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ User    │ │ PriceRise│ │IndustryCost│ │ Contact │ ...       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 技术栈选型

#### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.x | 前端框架 |
| TypeScript | ^5.x | 类型安全 |
| Vite | ^5.x | 构建工具 |
| Vue Router | ^4.x | 路由管理 |
| Pinia | ^2.x | 状态管理 |
| Axios | ^1.x | HTTP请求 |
| Element Plus | ^2.x | UI组件库 |

#### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | ^10.x | 后端框架 |
| TypeScript | ^5.x | 类型安全 |
| Prisma | ^5.x | ORM框架 |
| PostgreSQL | ^15.x | 关系数据库 |
| JWT | ^9.x | 身份认证 |
| bcrypt | ^5.x | 密码加密 |

#### 部署技术栈

| 技术 | 用途 |
|------|------|
| Nginx | 反向代理、静态资源 |
| PM2 / Docker | 进程管理/容器化 |
| HTTPS (Let's Encrypt) | SSL证书 |

### 3.3 项目目录结构

```
project-root/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── views/              # 页面组件
│   │   │   ├── Home.vue
│   │   │   ├── SalesGuide.vue
│   │   │   ├── Discount.vue
│   │   │   ├── CostChange.vue
│   │   │   ├── ProductGuide.vue
│   │   │   └── Strategy.vue
│   │   ├── components/         # 公共组件
│   │   │   ├── Sidebar.vue
│   │   │   ├── Topbar.vue
│   │   │   ├── DataTable.vue
│   │   │   └── InfoCard.vue
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia状态
│   │   ├── api/                # API接口
│   │   ├── utils/              # 工具函数
│   │   └── assets/             # 静态资源
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # 认证模块
│   │   │   ├── user/           # 用户模块
│   │   │   ├── sales-guide/    # 销售指引
│   │   │   ├── discount/       # 报价折扣
│   │   │   ├── cost/           # 成本变化
│   │   │   ├── product/        # 产品指引
│   │   │   └── strategy/       # 客户战略
│   │   ├── common/             # 公共模块
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── filters/
│   │   ├── config/             # 配置
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma       # 数据库模型
│   └── package.json
│
├── shared/                      # 共享类型定义
│   └── types/
│
├── docs/                        # 文档
│   └── design.md
│
└── legacy/                      # 原始文件备份
    └── original.html
```

---

## 4. 数据库设计

### 4.1 ER图

```
┌──────────────┐       ┌──────────────┐
│     User     │       │ OperationLog │
├──────────────┤       ├──────────────┤
│ id           │──┐    │ id           │
│ username     │  │    │ userId       │──┐
│ password     │  │    │ action       │  │
│ displayName  │  └───▶│ target       │  │
│ role         │       │ details      │  │
│ email        │       │ createdAt    │  │
│ createdAt    │       └──────────────┘  │
│ updatedAt    │                         │
└──────────────┘◀────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PriceRise   │  │ IndustryCost │  │   Contact    │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ id           │  │ id           │  │ id           │
│ product      │  │ industry     │  │ industry     │
│ productType  │  │ productName  │  │ productName  │
│ changeType   │  │ changeType   │  │ productSide  │
│ risePercent  │  │ avgRise      │  │ cloudOpSide  │
│ effectiveAt  │  │ effectiveAt  │  │ effectiveAt  │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ SalesGuide   │  │DiscountPolicy│  │   Product    │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ id           │  │ id           │  │ id           │
│ title        │  │ category     │  │ section      │
│ category     │  │ customerLevel│  │ subsection   │
│ content      │  │ discountRange│  │ title        │
│ attachments  │  │ conditions   │  │ content      │
│ sortOrder    │  │ approvalFlow │  │ industry     │
│ createdBy    │  │ notes        │  │ sortOrder    │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│   Customer   │  │  UpdateLog   │
├──────────────┤  ├──────────────┤
│ id           │  │ id           │
│ name         │  │ module       │
│ industry     │  │ title        │
│ profile      │  │ description  │
│ trend        │  │ updatedAt    │
│ strategy     │  │ updatedBy    │
└──────────────┘  └──────────────┘
```

### 4.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id          String   @id @default(uuid())
  username    String   @unique
  password    String
  displayName String
  role        Role     @default(VIEWER)
  email       String?  @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  operationLogs OperationLog[]
  salesGuides   SalesGuide[]
  
  @@map("users")
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

// 操作日志
model OperationLog {
  id        String   @id @default(uuid())
  userId    String
  action    String   // CREATE, UPDATE, DELETE
  target    String   // 操作对象类型
  targetId  String?  // 操作对象ID
  details   Json?    // 操作详情
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("operation_logs")
}

// 单价涨幅明细
model PriceRise {
  id            String   @id @default(uuid())
  product       String   // CVM, CBS, COS, CDB
  productType   String
  changeType    String   @default("单价上涨")
  risePercent   String   // "76%"
  effectiveAt   String   // "2026-04"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("price_rises")
}

// 行业成本汇总
model IndustryCost {
  id            String   @id @default(uuid())
  industry      String   // 计算, 存储, 数据库
  productName   String
  changeType    String   @default("单价上涨")
  avgRiseRange  String   // "15%~35%"
  effectiveAt   String   // "2026-04"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("industry_costs")
}

// 对接人一览
model Contact {
  id            String   @id @default(uuid())
  industry      String
  productName   String
  productSide   Json     // ["gracecui"]
  cloudOpSide   String
  effectiveAt   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("contacts")
}

// 销售指引
model SalesGuide {
  id          String   @id @default(uuid())
  title       String
  category    String   // 流程规范, 话术模板, 谈判指引
  content     String   @db.Text
  attachments Json?
  sortOrder   Int      @default(0)
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User? @relation(fields: [createdBy], references: [id])
  
  @@map("sales_guides")
}

// 折扣政策
model DiscountPolicy {
  id             String   @id @default(uuid())
  category       String   // 五档, 高价值客户, 普通客户
  customerLevel  String?
  discountRange  String?
  conditions     String?  @db.Text
  approvalFlow   String?  @db.Text
  notes          String?  @db.Text
  sortOrder      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@map("discount_policies")
}

// 产品售卖指引
model ProductGuide {
  id          String   @id @default(uuid())
  section     String   // 背景, 行业, 产品, 案例
  subsection  String?
  title       String
  content     Json     // 结构化内容
  industry    String?  // 行业分析专用
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("product_guides")
}

// 客户战略分析
model CustomerStrategy {
  id          String   @id @default(uuid())
  name        String
  industry    String
  profile     String?  @db.Text
  trend       String?  @db.Text
  strategy    String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("customer_strategies")
}

// 更新日志（首页最近更新）
model UpdateLog {
  id          String   @id @default(uuid())
  module      String   // 模块名称
  moduleId    String?  // 关联ID
  title       String
  description String?
  tag         String?  // 重要, 更新, 参考
  updatedAt   DateTime @default(now())
  updatedBy   String?
  
  @@map("update_logs")
}
```

---

## 5. API设计

### 5.1 API规范

**基础路径**: `/api/v1`

**认证方式**: JWT Bearer Token

**响应格式**:
```typescript
// 成功响应
{
  "success": true,
  "data": T,
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}

// 分页响应
{
  "success": true,
  "data": {
    "items": T[],
    "total": number,
    "page": number,
    "pageSize": number
  }
}
```

### 5.2 认证接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /auth/login | 用户登录 | 公开 |
| POST | /auth/logout | 用户登出 | 已登录 |
| GET | /auth/profile | 获取当前用户信息 | 已登录 |
| PUT | /auth/password | 修改密码 | 已登录 |

### 5.3 用户管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /users | 获取用户列表 | ADMIN |
| POST | /users | 创建用户 | ADMIN |
| PUT | /users/:id | 更新用户 | ADMIN |
| DELETE | /users/:id | 删除用户 | ADMIN |

### 5.4 业务数据接口

#### 销售指引

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /sales-guides | 获取列表 | VIEWER+ |
| GET | /sales-guides/:id | 获取详情 | VIEWER+ |
| POST | /sales-guides | 创建 | EDITOR+ |
| PUT | /sales-guides/:id | 更新 | EDITOR+ |
| DELETE | /sales-guides/:id | 删除 | ADMIN |

#### 报价折扣

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /discounts | 获取列表 | VIEWER+ |
| POST | /discounts | 创建 | EDITOR+ |
| PUT | /discounts/:id | 更新 | EDITOR+ |
| DELETE | /discounts/:id | 删除 | ADMIN |

#### 成本变化

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /cost/price-rises | 单价涨幅明细 | VIEWER+ |
| GET | /cost/industry-costs | 行业成本汇总 | VIEWER+ |
| GET | /cost/contacts | 对接人一览 | VIEWER+ |
| POST | /cost/price-rises | 创建 | EDITOR+ |
| POST | /cost/industry-costs | 创建 | EDITOR+ |
| POST | /cost/contacts | 创建 | EDITOR+ |
| PUT | /cost/price-rises/:id | 更新 | EDITOR+ |
| DELETE | /cost/price-rises/:id | 删除 | ADMIN |

#### 产品指引

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /products | 获取列表 | VIEWER+ |
| GET | /products/:section | 按部分获取 | VIEWER+ |
| POST | /products | 创建 | EDITOR+ |
| PUT | /products/:id | 更新 | EDITOR+ |
| DELETE | /products/:id | 删除 | ADMIN |

#### 客户战略

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /strategies | 获取列表 | VIEWER+ |
| GET | /strategies/:id | 获取详情 | VIEWER+ |
| POST | /strategies | 创建 | EDITOR+ |
| PUT | /strategies/:id | 更新 | EDITOR+ |
| DELETE | /strategies/:id | 删除 | ADMIN |

### 5.5 操作日志接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /logs | 获取操作日志 | ADMIN |
| GET | /logs/user/:userId | 获取用户操作日志 | ADMIN |

---

## 6. 安全设计

### 6.1 认证与授权

#### JWT认证流程

```
┌─────────┐                    ┌─────────┐                    ┌─────────┐
│  用户   │                    │  后端   │                    │ 数据库  │
└────┬────┘                    └────┬────┘                    └────┬────┘
     │  1. POST /auth/login         │                              │
     │  {username, password}        │                              │
     │─────────────────────────────▶│                              │
     │                              │  2. 验证用户                  │
     │                              │─────────────────────────────▶│
     │                              │◀─────────────────────────────│
     │                              │  3. 生成JWT                   │
     │◀─────────────────────────────│  {token, user}               │
     │                              │                              │
     │  4. GET /api/xxx             │                              │
     │  Authorization: Bearer token │                              │
     │─────────────────────────────▶│                              │
     │                              │  5. 验证token + 提取用户      │
     │                              │  6. 检查权限                  │
     │                              │  7. 执行业务逻辑              │
     │                              │─────────────────────────────▶│
     │◀─────────────────────────────│◀─────────────────────────────│
```

#### 密码安全

- 使用bcrypt加密，salt rounds = 10
- 密码要求：至少8位，包含大小写字母和数字
- 登录失败限制：5次/15分钟

### 6.2 权限控制

#### 角色权限矩阵

| 功能 | ADMIN | EDITOR | VIEWER |
|------|-------|--------|--------|
| 查看数据 | ✅ | ✅ | ✅ |
| 编辑内容 | ✅ | ✅ | ❌ |
| 删除内容 | ✅ | ❌ | ❌ |
| 用户管理 | ✅ | ❌ | ❌ |
| 查看日志 | ✅ | ❌ | ❌ |

#### 权限守卫实现

```typescript
// backend/src/common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler()
    );
    
    if (!requiredRoles) return true;
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.includes(user.role);
  }
}
```

### 6.3 数据安全

#### SQL注入防护

- 使用Prisma ORM参数化查询
- 禁止原生SQL拼接
- 输入验证和清理

#### XSS防护

- 前端使用Vue自动转义
- 后端设置Content-Security-Policy
- 用户输入内容过滤

#### CSRF防护

- 使用SameSite Cookie
- 验证Origin/Referer头

### 6.4 HTTPS配置

```nginx
# Nginx配置
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## 7. 部署方案

### 7.1 服务器需求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 存储 | 50GB SSD | 100GB SSD |
| 带宽 | 5Mbps | 10Mbps |

### 7.2 部署架构

```
                    ┌──────────────┐
                    │    用户      │
                    └──────┬───────┘
                           │ HTTPS
                           ▼
                    ┌──────────────┐
                    │    Nginx     │
                    │  (反向代理)  │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │  前端静态  │ │  后端API   │ │  PostgreSQL │
     │  (dist/)  │ │  (PM2)     │ │  数据库     │
     └────────────┘ └────────────┘ └────────────┘
```

### 7.3 部署步骤

#### 1. 环境准备

```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 安装Nginx
sudo apt-get install -y nginx

# 安装PM2
sudo npm install -g pm2
```

#### 2. 数据库配置

```bash
# 创建数据库用户
sudo -u postgres psql
CREATE USER sc_admin WITH PASSWORD 'your_password';
CREATE DATABASE sc_platform OWNER sc_admin;
GRANT ALL PRIVILEGES ON DATABASE sc_platform TO sc_admin;
```

#### 3. 后端部署

```bash
# 克隆代码
git clone <repo-url> /var/www/sc-platform
cd /var/www/sc-platform/backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 配置数据库连接等

# 运行数据库迁移
npx prisma migrate deploy
npx prisma generate

# 构建项目
npm run build

# 使用PM2启动
pm2 start dist/main.js --name sc-backend
pm2 save
pm2 startup
```

#### 4. 前端部署

```bash
cd /var/www/sc-platform/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 部署到Nginx目录
sudo cp -r dist/* /var/www/sc-platform/frontend-dist/
```

#### 5. Nginx配置

```nginx
# /etc/nginx/sites-available/sc-platform
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # 前端静态文件
    location / {
        root /var/www/sc-platform/frontend-dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.4 数据迁移

将原始HTML中的数据迁移到数据库：

```bash
# 执行数据迁移脚本
npx ts-node scripts/migrate-data.ts
```

迁移内容包括：
- 成本变化三个表的数据（6+4+4条）
- 产品售卖指引的结构化内容
- 折扣政策信息
- 更新日志初始数据

---

## 8. 开发计划

### 8.1 开发阶段划分

| 阶段 | 内容 | 预计工时 | 依赖 |
|------|------|----------|------|
| 阶段一 | 前端页面完善 | 3天 | 无 |
| 阶段二 | 后端骨架搭建 | 2天 | 无 |
| 阶段三 | 数据库与数据迁移 | 2天 | 阶段二 |
| 阶段四 | 前后端联调 | 3天 | 阶段一、三 |
| 阶段五 | 部署上线 | 2天 | 阶段四 |

**总预计**: 约12个工作日

### 8.2 详细任务清单

#### 阶段一：前端页面完善（3天）

- [ ] 完善首页组件
  - [ ] 统计数据动态化
  - [ ] 最近更新列表组件
  - [ ] 导航卡片组件
- [ ] 成本变化页面
  - [ ] 数据表格组件封装
  - [ ] 搜索/筛选功能
  - [ ] 排序功能
- [ ] 产品指引页面
  - [ ] 目录导航组件
  - [ ] 行业切换Tab
  - [ ] 内容卡片组件
- [ ] 通用组件
  - [ ] Loading组件
  - [ ] 空状态组件
  - [ ] 权限控制组件

#### 阶段二：后端骨架搭建（2天）

- [ ] 项目初始化
  - [ ] NestJS项目创建
  - [ ] Prisma配置
  - [ ] 环境变量配置
- [ ] 认证模块
  - [ ] JWT策略实现
  - [ ] 登录/登出接口
  - [ ] 权限守卫
- [ ] 用户模块
  - [ ] CRUD接口
  - [ ] 角色控制
- [ ] 公共模块
  - [ ] 异常过滤器
  - [ ] 响应拦截器
  - [ ] 日志模块

#### 阶段三：数据库与数据迁移（2天）

- [ ] 数据库初始化
  - [ ] Prisma Schema编写
  - [ ] 数据库迁移
  - [ ] 初始管理员账号
- [ ] 数据迁移脚本
  - [ ] 成本变化数据迁移
  - [ ] 产品指引数据迁移
  - [ ] 其他数据迁移

#### 阶段四：前后端联调（3天）

- [ ] API对接
  - [ ] 认证流程对接
  - [ ] 数据接口对接
  - [ ] 错误处理
- [ ] 功能完善
  - [ ] 数据编辑功能
  - [ ] 文件上传功能
  - [ ] 操作日志记录
- [ ] 测试
  - [ ] 功能测试
  - [ ] 权限测试
  - [ ] 性能测试

#### 阶段五：部署上线（2天）

- [ ] 服务器配置
  - [ ] 环境安装
  - [ ] 数据库配置
  - [ ] Nginx配置
- [ ] 应用部署
  - [ ] 后端部署
  - [ ] 前端部署
  - [ ] SSL证书配置
- [ ] 验收测试
  - [ ] 功能验收
  - [ ] 安全验收
  - [ ] 文档编写

---

## 9. 附录

### 9.1 环境变量配置

```bash
# backend/.env

# 数据库
DATABASE_URL="postgresql://sc_admin:password@localhost:5432/sc_platform?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# 应用
PORT=3000
NODE_ENV=development

# 初始管理员
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Admin@123456"
ADMIN_EMAIL="admin@example.com"
```

### 9.2 初始数据

#### 默认管理员账号

| 字段 | 值 |
|------|------|
| 用户名 | admin |
| 密码 | Admin@123456 |
| 角色 | ADMIN |
| 邮箱 | admin@example.com |

**注意**: 生产环境请务必修改默认密码

### 9.3 技术文档链接

- [Vue 3 文档](https://vuejs.org/)
- [NestJS 文档](https://docs.nestjs.com/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Element Plus 文档](https://element-plus.org/)

---

## 10. 更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| v1.0 | 2026-04-19 | 初始版本 | CodeBuddy |

---

> **文档状态**: 设计阶段  
> **下一步**: 开始阶段一 - 前端页面完善
