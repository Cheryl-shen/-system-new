# 华南AI智策

**战略客户部·华南拓展中心**打造的一站式AI商机情报平台。

平台整合全球模型能力排名、国内外云商与供应链动态、客户AI战略分析、AI产品售卖弹药四大模块，帮助一线商务快速洞悉市场格局、精准对接客户需求、高效输出售卖方案。

技术上基于 Vue 3 + Express 构建，通过太湖 TOF 统一认证实现安全可控的访问管理。

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
├── src/                        # 前端源码 (Vue 3 SPA)
│   ├── api/                    # API 接口封装
│   │   ├── auth.ts             # 认证相关 API
│   │   └── http.ts             # HTTP 请求封装
│   ├── assets/styles/          # 样式文件
│   │   ├── base.css            # 基础样式
│   │   ├── components.css      # 组件样式
│   │   ├── main.css            # 入口样式
│   │   └── variables.css       # CSS 变量
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件（DataTable、Loading 等）
│   │   └── layout/             # 布局组件（Sidebar、Topbar 等）
│   ├── data/                   # 静态数据文件
│   │   ├── newsData.ts         # AI 与云商动态数据
│   │   ├── salesGuideData.ts   # 售卖弹药数据
│   │   ├── strategyData.ts     # 客户战略数据
│   │   ├── costData.ts         # 成本变化数据
│   │   └── ...                 # 其他数据文件
│   ├── stores/                 # Pinia 状态管理
│   │   └── auth.ts             # 认证状态
│   ├── views/                  # 页面视图
│   ├── router/                 # Vue Router 配置
│   └── main.ts                 # 入口文件
│
├── deploy/                     # 部署相关
│   ├── server/                 # Express 后端代码
│   │   ├── server.js           # 主服务（认证 + 管理 + API）
│   │   ├── db.js               # SQLite 数据层
│   │   ├── tof.js              # TOF JWE 解密模块
│   │   └── package.json        # 后端依赖
│   ├── nginx.conf              # Nginx 站点配置
│   ├── deploy.sh               # 一键部署脚本
│   └── *.md                    # 部署指南文档
│
├── docs/                       # 操作文档
│   ├── 内容更新SOP.md          # 数据更新操作指南
│   ├── 开发模式登录SOP.md       # 本地开发登录指南
│   └── 正式环境部署SOP.md       # 生产环境部署指南
│
├── .env.example                # 服务端环境变量模板
├── .env.development            # 开发环境配置（不提交 Git）
├── package.json                # 前端依赖
├── vite.config.ts              # Vite 配置
└── tsconfig.json               # TypeScript 配置
```

---

## 📚 文档索引

| 文档 | 说明 |
|------|------|
| [内容更新 SOP](./docs/内容更新SOP.md) | 各模块数据更新操作指南 |
| [开发模式登录 SOP](./docs/开发模式登录SOP.md) | 本地开发环境登录方法 |
| [正式环境部署 SOP](./docs/正式环境部署SOP.md) | 生产服务器部署与更新流程 |
| [Git 部署指南](./deploy/GIT-DEPLOY-GUIDE.md) | 通过 Git 克隆方式首次部署 |
| [WebShell 部署指南](./deploy/WEBSHELL-DEPLOY-GUIDE.md) | DevCloud WebShell 手动部署 |

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

| 页面 | 路由 | 数据文件 | 说明 |
|------|------|----------|------|
| 首页 | `/` | - | 工作台入口 |
| AI与云商动态 | `/news` | `newsData.ts` | AI 行业动态、云商动态、涨价追踪 |
| 供应链情报 | `/supply-chain` | `supplyChainData.ts` | AI算力供应链全景：产业链地图、芯片/存储/网络/基础设施动态、风险预警 |
| 售卖弹药 | `/sales-guide` | `salesGuideData.ts` | 产品销售资料与话术 |
| 客户战略分析 | `/strategy` | `strategyData.ts` | 战略客户经营与 AI 规划 |
| 成本变化 | `/cost` | `costData.ts` | 产品成本信息 |
| 产品售卖指引 | `/product-guide` | 内嵌 | 产品方案与行业指引 |
| 官网上新 | `/new-products` | `newProductsData.ts` | 官网产品更新追踪 |
| 模型价格 | `/model-price` | `modelPriceData.ts` | 各厂商模型定价对比 |
| 模型排名 | `/model-ranking` | `modelRankingData.ts` | 全球模型能力排名 |
| 登录 | `/login` | - | 登录认证页面 |

---

## 供应链情报模块说明

**路由**：`/supply-chain`
**数据文件**：`src/data/supplyChainData.ts`
**更新周期**：每周手动更新
**数据范围**：2026-04-01 ~ 2026-05-09（持续扩展）

### 模块结构

| 子模块 | 数据接口 | 说明 |
|--------|----------|------|
| 产业链全景图 | `SupplyChainNode` | 6层产业链节点（设计→制造→芯片→存储→网络→基础设施），含国产化率与风险等级 |
| 行业总评 | `IndustrySummary` | 整体态势概述 + 4个核心指标（国产算力/进口成本/HBM供应/液冷渗透） |
| 芯片前线动态 | `ChipNews` | 英伟达/AMD/华为昇腾/寒武纪等厂商动态，含来源链接 |
| 存储与内存动态 | `StorageNews` | HBM/NAND/DRAM/SSD 价格趋势与供应格局 |
| 网络设备动态 | `NetworkNews` | 光模块/交换机/DPU/路由器国产化进展 |
| 基础设施动态 | `InfraNews` | 液冷/PUE政策/数据中心/电力 |
| 供应链风险预警 | `SupplyChainAlert` | 出口管制/供应短缺/价格波动/技术封锁/地缘政治 5类风险 |

### 数据来源

每条数据均标注 `source` 字段，来源包括：
- 海外权威媒体：路透社、The Information、TechCrunch、AnandTech
- 行业分析机构：TrendForce（集邦咨询）、SemiAnalysis、IDC、DigiTimes
- 厂商官方公告：华为、英伟达、AMD、寒武纪、长鑫存储等
- 国内媒体：财联社、新浪财经、C114通信网、36氪、集微网
