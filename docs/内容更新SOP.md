# 内容更新 SOP
> 战略客户部 · 华南拓展中心 · 数据&文档汇总平台
> 最后更新：2026-04-24

---

## 一、项目更新路径总览

```
本地修改 → git push → EdgeOne 自动部署 → 线上生效
   ↓
GitHub（源站）→ EdgeOne Pages（strategic 项目）→ tencent south.top（生产域名）
```

### 关键配置
| 项目 | 值 |
|------|-----|
| GitHub 仓库 | `Cheryl-shen/strategic-platform` |
| EdgeOne 项目 | `strategic`（ID: `pages-uhblopsidn4y`）|
| 生产域名 | `tencentsouth.top` |
| 部署方式 | GitHub Push → EdgeOne 自动触发 |

---

## 二、自动更新机制说明

### ✅ 目前「自动」更新的内容

| 内容 | 更新方式 | 频率 | 说明 |
|--------|----------|------|------|
| `.github/last-build.txt` | GitHub Actions 自动更新时间戳 | 每日 09:00（北京时间）| 触发 EdgeOne 重新构建，但**不更新任何业务数据** |

### ❌ 目前「手动」更新的内容（全部数据文件需手动维护）

所有业务数据（AI 动态、售卖弹药、客户战略、成本变化、产品指引、官网上新）**均为硬编码在文件中**，不会自动抓取或更新。

> ⚠️ **重要**：GitHub Actions 的每日构建**只刷新构建时间**，不会自动更新新闻/报价/成本等数据。每次更新数据后，需手动 `git push` 触发部署。

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

### 标准流程（推荐）

```bash
# 1. 拉取最新代码
cd "/Users/cherylshen/CodeBuddy/战略客户部 · 华南拓展中心 · 数据&文档汇总平台"
git pull origin main

# 2. 修改对应的数据文件（按第三章指引）

# 3. 提交代码
git add -A
git commit -m "更新：描述本次更新内容"

# 4. 推送到 GitHub（自动触发 EdgeOne 部署）
git push origin main
```

### 部署状态检查

推送后，可在以下位置查看部署状态：
- EdgeOne 控制台：https://console.cloud.tencent.com/edgeone/pages/project/pages-uhblopsidn4y/deployments
- 部署成功后约 1-2 分钟，`tencentsouth.top` 生效

---

## 五、本地预览

```bash
# 启动本地开发服务器
cd "/Users/cherylshen/CodeBuddy/战略客户部 · 华南拓展中心 · 数据&文档汇总平台"
npm run dev

# 浏览器访问
open http://localhost:3000
```

> ⚠️ **注意**：本地预览无法使用 EdgeOne Functions（登录/认证功能），但可以看到页面内容和数据更新效果。

---

## 六、常见问题

### Q1：为什么自动部署后数据没有更新？
**A**：GitHub Actions 每日构建**只更新时间戳**，不会自动更新业务数据。必须手动修改数据文件并 `git push` 才会生效。

### Q2：如何快速找到要修改的文件？
**A**：参考第三章的「数据文件」路径，或直接搜索关键词（如产品名称）定位。

### Q3：推送代码后多久上线？
**A**：EdgeOne 部署通常需要 2-5 分钟。部署完成后 CDN 缓存可能需要 1-2 分钟刷新。

### Q4：如何回滚到上一个版本？
**A**：在 EdgeOne 控制台找到上一个部署记录，点击「回滚」即可。

### Q5：Cost.vue 的背景说明文字在哪里修改？
**A**：在 `src/views/Cost.vue` 第 23-30 行，更新账期信息和涨幅说明。

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
| 自动构建触发 | `.github/workflows/daily-update.yml` | — | 自动（仅时间戳）|

---

*本文档由 AI 助手生成，如有更新请联系 @cherylshen 同步修改。*
