# 内容更新 SOP
> 战略客户部 · 华南拓展中心 · 数据&文档汇总平台
> 最后更新：2026-05-08

---

## 一、项目更新路径总览

```
本地修改 → 构建 → 部署到 CVM 服务器 → 线上生效
   ↓
GitHub（源码）→ 本地 npm run build → 部署脚本上传 → strategicsouth.woa.com（生产域名）
```

### 关键配置
| 项目 | 值 |
|------|-----|
| GitHub 仓库 | `Cheryl-shen/strategic-platform` |
| 服务器地址 | `21.214.41.205`（CVM） |
| 生产域名 | `strategicsouth.woa.com` |
| 部署方式 | 一键部署脚本 / Git 拉取更新 |
| 后端服务 | Node.js + Express + SQLite |
| Web 服务器 | Nginx（反代 + 静态文件） |
| 认证方式 | TOF + JWT |

---

## 二、部署架构说明

```
内网服务器 (21.214.41.205)
├── Nginx:80
│   ├── /           → Vue 静态文件 (/opt/strategic-platform/dist/)
│   └── /api/*      → 反代到 Node.js:3000
└── Node.js:3000
    └── Express API 服务 (/opt/strategic-platform/server/)
        └── SQLite 数据库 (server/data/strategic.db)
```

### ❌ 需要手动更新的内容

所有业务数据（AI 动态、售卖弹药、客户战略、成本变化、产品指引、官网上新）**均为硬编码在文件中**，不会自动抓取或更新。

> ⚠️ **重要**：每次更新数据后，需手动构建并部署才会在线上生效。

---

## 三、各模块更新指引

### 3.1 📰 AI 与云商动态

**数据文件**：`src/data/newsData.ts`

**更新步骤**：

1. 打开 `src/data/newsData.ts`
2. 找到对应数组（`aiNews` / `cloudNews` / `priceChangeNews`）
3. 在数组**最前面**插入新条目（id 递增）
4. 更新文件头部的「最后更新」注释

**数据格式示例**（AI 动态）：

```typescript
{
  id: 31,                                    // ← 递增，不要重复
  title: '标题',
  summary: '详细描述...',
  source: '信息来源',
  sourceUrl: 'https://...',                  // 可选
  date: '2026-04-24',                       // 发布日期
  tags: ['标签1', '标签2'],
  importance: '重磅' | '重要' | '一般',
  category: '模型发布' | '行业投资' | '国产模型' | 'Agent 生态' | '产品发布' | '市场表现' | '政策&生态'
}
```

**云商动态**额外字段：
```typescript
vendor: '阿里云' | '火山引擎' | '华为云' | 'AWS' | '谷歌云' | '腾讯云' | ...
```

**涨价动态**额外字段：
```typescript
region: '海外' | '国内',
rangeText: '+15%',                         // 涨价幅度
effectiveDate: '2026-04-11',
products: ['产品1', '产品2'],
reason: '涨价原因说明'
```

---

### 3.2 📦 售卖弹药

**数据文件**：`src/data/salesGuideData.ts`

**更新场景**：

#### 场景 A：新增产品
在 `salesGuideData` 数组最前面插入新对象（参考现有产品格式）。

#### 场景 B：更新现有产品的报价链接
找到对应产品，修改 `pricingDocs` 数组中的 `url` 字段。

#### 场景 C：更新折扣政策
修改对应产品的 `strategy.discountPolicy` 字段。

**关键字段说明**：

| 字段 | 说明 |
|------|------|
| `tag` | `新品` / `主推` / `战略` / `热门`（显示在卡片角标）|
| `priority` | `高` / `中` / `低`（排序优先级）|
| `pricingDocs` | 内部报价文档链接（腾讯文档），`placeholder: true` 表示待补充 |
| `lastUpdate` | 最后更新日期，格式 `2026-04-24` |

---

### 3.3 🎯 客户战略分析

**数据文件**：`src/data/strategyData.ts`

**更新场景**：

#### 场景 A：新增客户
在 `strategyData` 数组最前面插入新客户对象。

#### 场景 B：更新客户经营情况/AI 规划
找到对应客户，修改 `business` 或 `ai` 字段。

#### 场景 C：更新财报链接
修改对应客户的 `reports` 数组。

**关键字段说明**：

| 字段 | 说明 |
|------|------|
| `stock` | 股票代码，如 `NYSE: VIPS` |
| `business.keyMetrics` | 关键经营指标，带趋势箭头 |
| `ai.scenes` | AI 落地场景，`status`: `已落地`/`推进中`/`规划中` |
| `overseas.status` | 出海阶段说明 |

---

### 3.4 💰 成本变化

**数据文件**：`src/data/costData.ts`（由 `Cost.vue` 导入）

**更新步骤**：

1. 打开 `src/data/costData.ts`
2. 根据更新内容选择对应数组：
   - `priceRiseData` → Tab1：单价涨幅明细
   - `industryCostData` → Tab2：行业成本汇总
   - `contactData` → Tab3：对接人一览
3. 插入或更新条目

**注意**：成本数据通常来自后端正式通知（账期生效），更新时需同步更新 `Cost.vue` 中的背景说明文字（第 23-30 行的模板部分）。

---

### 3.5 📖 产品售卖指引

**文件**：`src/views/ProductGuide.vue`（内容内嵌在 Vue 文件中）

**更新场景**：

#### 场景 A：更新大背景数据
修改第 60-76 行的 `<table class="data-table">` 中的数据。

#### 场景 B：更新行业分析
修改对应行业章节的 `<ul class="content-list">` 内容。

#### 场景 C：更新产品全景
修改第 3 节（产品全景）的卡片或表格数据。

#### 场景 D：更新售卖案例
修改第 4 节（售卖案例）的客户案例内容。

> ⚠️ **提示**：此文件内容以 HTML 模板形式内嵌，修改时请注意保留原有的 `class` 样式类名。

---

### 3.6 🆕 官网上新

**数据文件**：`src/data/newProductsData.ts`

**更新步骤**：

1. 打开 `src/data/newProductsData.ts`
2. 找到对应的 `weeklyUpdates` 数组中的周次对象
3. 在 `products` 数组最前面插入新上线产品

**数据格式**：

```typescript
{
  id: 101,
  name: '产品名称',
  category: '大模型' | 'AI SaaS' | '智能体' | '算力' | '数据&安全' | '其他',
  updateType: '新功能' | '新产品' | '重要更新' | '体验优化',
  isHot: false,                              // true = 显示 HOT 角标
  date: '2026-04-24',
  summary: '一句话简介',
  description: '详细介绍...',
  highlights: ['亮点1', '亮点2', '亮点3'],
  officialUrl: 'https://...'
}
```

**新增周次**：在 `weeklyUpdates` 数组插入新周次对象：
```typescript
{
  weekKey: 'w2026-18',                      // 唯一 key
  weekLabel: '2026-04-27 ~ 05-03',
  summary: '本周概要说明...',
  products: [/* 产品列表 */]
}
```

---

## 四、更新发布流程

### 方式一：一键部署脚本（推荐）

```bash
# 1. 拉取最新代码
cd /Users/cherylshen/Desktop/platform
git pull origin main

# 2. 修改对应的数据文件（按第三章指引）

# 3. 提交代码
git add -A
git commit -m "更新：描述本次更新内容"
git push origin main

# 4. 执行一键部署脚本
bash deploy/deploy.sh root@21.214.41.205
```

> 部署脚本会自动完成：本地构建 → 上传文件 → 安装依赖 → 重启服务

### 方式二：仅前端更新（数据修改后快速部署）

```bash
# 1. 本地构建
cd /Users/cherylshen/Desktop/platform
npm run build

# 2. 打包并上传
tar -czf dist-update.tar.gz dist/
scp dist-update.tar.gz root@21.214.41.205:/tmp/

# 3. SSH 到服务器解压部署
ssh root@21.214.41.205
cd /tmp && tar -xzf dist-update.tar.gz
cp -r dist/* /opt/strategic-platform/dist/
systemctl reload nginx
```

### 方式三：Git 拉取更新（服务器已克隆仓库）

```bash
ssh root@21.214.41.205
cd /opt/strategic-platform-src
git pull origin main
npm run build
cp -r dist/* /opt/strategic-platform/dist/
cp deploy/server/*.js /opt/strategic-platform/server/
cd /opt/strategic-platform/server && npm install --production
systemctl restart strategic-platform && systemctl reload nginx
```

### 部署状态检查

部署后，可通过以下方式验证：
```bash
# 检查 API 服务状态
curl -s http://strategicsouth.woa.com/api/health

# 检查 systemd 服务状态
ssh root@21.214.41.205 "systemctl status strategic-platform"

# 查看实时日志
ssh root@21.214.41.205 "journalctl -u strategic-platform -f --lines=20"
```

> 部署成功后，访问 `strategicsouth.woa.com` 即可看到更新内容。

---

## 五、本地预览

```bash
# 启动本地开发服务器
cd /Users/cherylshen/Desktop/platform
npm run dev

# 浏览器访问
open http://localhost:5173
```

> ⚠️ **注意**：本地预览时后端 API 请求会代理到开发环境（如已配置 vite proxy），登录/认证功能可能受限，但可以看到页面内容和数据更新效果。

---

## 六、常见问题

### Q1：修改了数据文件，为什么线上没有更新？
**A**：修改数据文件后，需要**重新构建并部署**。建议使用一键部署脚本 `bash deploy/deploy.sh root@21.214.41.205` 完成部署。

### Q2：如何快速找到要修改的文件？
**A**：参考第三章的「数据文件」路径，或直接搜索关键词（如产品名称）定位。

### Q3：部署后多久能上线？
**A**：使用一键脚本部署，从执行到生效通常需要 1-3 分钟（含构建、上传、重启服务）。

### Q4：如何回滚到上一个版本？
**A**：
```bash
# 方法一：回退 Git 版本后重新部署
git log --oneline -5           # 查看最近提交
git revert HEAD                # 回退最近一次提交
bash deploy/deploy.sh root@21.214.41.205

# 方法二：在服务器直接回退（如果使用 Git 方式部署）
ssh root@21.214.41.205
cd /opt/strategic-platform-src
git log --oneline -5
git checkout <commit-hash>
npm run build && cp -r dist/* /opt/strategic-platform/dist/
systemctl reload nginx
```

### Q5：Cost.vue 的背景说明文字在哪里修改？
**A**：在 `src/views/Cost.vue` 第 23-30 行，更新账期信息和涨幅说明。

### Q6：服务挂了怎么办？
**A**：
```bash
# 检查服务状态
ssh root@21.214.41.205 "systemctl status strategic-platform"

# 重启服务
ssh root@21.214.41.205 "systemctl restart strategic-platform"

# 查看错误日志
ssh root@21.214.41.205 "journalctl -u strategic-platform --since '10 min ago'"
```

---

## 七、文件速查表

| 模块 | 数据文件 | 视图文件 | 更新方式 |
|------|-----------|----------|----------|
| AI 与云商动态 | `src/data/newsData.ts` | `src/views/News.vue` | 手动 |
| 售卖弹药 | `src/data/salesGuideData.ts` | `src/views/SalesGuide.vue` | 手动 |
| 客户战略分析 | `src/data/strategyData.ts` | `src/views/Strategy.vue` | 手动 |
| 成本变化 | `src/data/costData.ts` | `src/views/Cost.vue` | 手动 |
| 产品售卖指引 | — | `src/views/ProductGuide.vue` | 手动（内嵌）|
| 官网上新 | `src/data/newProductsData.ts` | `src/views/NewProducts.vue` | 手动 |
| 部署脚本 | `deploy/deploy.sh` | — | 一键部署 |
| 后端服务 | `deploy/server/` | — | 随部署更新 |
| Nginx 配置 | `deploy/nginx.conf` | — | 随部署更新 |

---

## 八、常用运维命令速查

| 操作 | 命令 |
|------|------|
| 查看 API 服务状态 | `systemctl status strategic-platform` |
| 查看 API 实时日志 | `journalctl -u strategic-platform -f` |
| 重启 API 服务 | `systemctl restart strategic-platform` |
| 健康检查 | `curl -s http://localhost/api/health` |
| 查看 Nginx 状态 | `systemctl status nginx` |
| Nginx 配置测试 | `nginx -t` |
| 重载 Nginx | `systemctl reload nginx` |
| 查看磁盘空间 | `df -h /opt/strategic-platform/` |

---

*本文档由 AI 助手生成，如有更新请联系 @cherylshen 同步修改。*
