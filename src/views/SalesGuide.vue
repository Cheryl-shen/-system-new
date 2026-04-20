<template>
  <div class="sales-guide-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 售卖弹药
      </div>
      <h2>🎯 售卖弹药</h2>
      <p>定期更新腾讯云重点产品的售卖资料：核心卖点、目标客户、适用场景、话术模板、报价策略、竞品对比、典型案例、销售 FAQ 等一站式弹药库</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon blue">🎯</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">收录产品</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">🔥</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.hotCount }}</span>
          <span class="stat-label">主推产品</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">📦</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.caseCount }}</span>
          <span class="stat-label">典型案例</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">💬</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.pitchCount }}</span>
          <span class="stat-label">话术库</span>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-group">
        <label>产品分类：</label>
        <div class="filter-btns">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="filter-btn"
            :class="{ active: selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 产品卡片列表 -->
    <div class="ammo-list">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="ammo-card"
      >
        <!-- 卡片头：产品名 + 标签 + 接口人 -->
        <div class="ammo-header">
          <div class="ammo-header-left">
            <span class="ammo-logo">{{ product.logo }}</span>
            <div class="ammo-title-block">
              <div class="ammo-title-row">
                <h3 class="ammo-name">{{ product.productName }}</h3>
                <span v-if="product.tag" class="ammo-tag" :class="getTagClass(product.tag)">{{ product.tag }}</span>
                <span class="ammo-priority" :class="`priority-${product.priority}`">优先级：{{ product.priority }}</span>
              </div>
              <div class="ammo-one-liner">{{ product.oneLiner }}</div>
              <div class="ammo-meta">
                <span class="meta-item">📂 {{ product.category }}</span>
                <span class="meta-item">👤 接口人：{{ product.contact }}</span>
                <span class="meta-item">🕐 更新：{{ product.lastUpdate }}</span>
                <a v-if="product.sourceUrl" :href="product.sourceUrl" target="_blank" class="meta-link">🔗 原始文档</a>
              </div>
            </div>
          </div>
        </div>

        <!-- 产品概述 -->
        <div class="ammo-section">
          <h4 class="section-title">📖 产品概述</h4>
          <div class="markdown-body" v-html="renderMarkdown(product.overview)"></div>
        </div>

        <!-- 核心卖点 + 差异化（双栏） -->
        <div class="ammo-row-2">
          <div class="ammo-col">
            <h4 class="section-title">✨ 核心卖点</h4>
            <ul class="bullet-list green-list">
              <li v-for="(v, i) in product.coreValue" :key="i">{{ v }}</li>
            </ul>
          </div>
          <div class="ammo-col">
            <h4 class="section-title">⚡ 差异化亮点</h4>
            <ul class="bullet-list orange-list">
              <li v-for="(v, i) in product.diff" :key="i">{{ v }}</li>
            </ul>
          </div>
        </div>

        <!-- 目标客户 + 适用场景（双栏） -->
        <div class="ammo-row-2">
          <div class="ammo-col">
            <h4 class="section-title">🎯 目标客户</h4>
            <div class="tag-list">
              <span v-for="(c, i) in product.targetCustomers" :key="i" class="customer-tag">{{ c }}</span>
            </div>
          </div>
          <div class="ammo-col">
            <h4 class="section-title">🏢 适用场景</h4>
            <div class="scene-list">
              <div v-for="(s, i) in product.scenes" :key="i" class="scene-item">
                <div class="scene-name">{{ s.name }}</div>
                <div class="scene-desc">{{ s.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 报价策略 -->
        <div class="ammo-section">
          <h4 class="section-title">💰 报价策略</h4>
          <div class="pricing-grid">
            <div class="pricing-item">
              <div class="pricing-label">计费模式</div>
              <div class="pricing-value">{{ product.pricing.model }}</div>
            </div>
            <div v-if="product.pricing.startingPrice" class="pricing-item">
              <div class="pricing-label">起步价</div>
              <div class="pricing-value">{{ product.pricing.startingPrice }}</div>
            </div>
            <div v-if="product.pricing.discountPolicy" class="pricing-item">
              <div class="pricing-label">折扣政策</div>
              <div class="pricing-value">{{ product.pricing.discountPolicy }}</div>
            </div>
            <div v-if="product.pricing.freeTier" class="pricing-item">
              <div class="pricing-label">免费额度</div>
              <div class="pricing-value">{{ product.pricing.freeTier }}</div>
            </div>
          </div>
        </div>

        <!-- 竞品对比 -->
        <div class="ammo-section">
          <h4 class="section-title">⚔️ 竞品对比</h4>
          <div class="competition-table">
            <div class="comp-head">
              <div class="comp-col-1">竞品</div>
              <div class="comp-col-2">我们的优势</div>
            </div>
            <div v-for="(c, i) in product.competition" :key="i" class="comp-row">
              <div class="comp-col-1"><strong>{{ c.rival }}</strong></div>
              <div class="comp-col-2">{{ c.ourAdvantage }}</div>
            </div>
          </div>
        </div>

        <!-- 销售话术 -->
        <div class="ammo-section">
          <h4 class="section-title">💬 销售话术</h4>
          <div class="pitch-list">
            <div v-for="(p, i) in product.pitches" :key="i" class="pitch-item">
              <div class="pitch-scene">场景 · {{ p.scene }}</div>
              <div class="pitch-script">{{ p.script }}</div>
            </div>
          </div>
        </div>

        <!-- 典型案例 -->
        <div class="ammo-section">
          <h4 class="section-title">🏆 典型案例</h4>
          <div class="case-list">
            <div v-for="(c, i) in product.cases" :key="i" class="case-item">
              <div class="case-head">
                <span class="case-customer">{{ c.customer }}</span>
                <span class="case-industry">{{ c.industry }}</span>
              </div>
              <div class="case-effect">{{ c.effect }}</div>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="ammo-section">
          <h4 class="section-title">❓ 销售 FAQ</h4>
          <div class="faq-list">
            <details v-for="(f, i) in product.faq" :key="i" class="faq-item">
              <summary class="faq-q">Q{{ i + 1 }}. {{ f.q }}</summary>
              <div class="faq-a">{{ f.a }}</div>
            </details>
          </div>
        </div>

        <!-- 配套物料 -->
        <div class="ammo-section">
          <h4 class="section-title">📎 配套物料</h4>
          <div class="material-list">
            <a
              v-for="(m, i) in product.materials"
              :key="i"
              :href="m.url"
              :target="m.url.startsWith('http') ? '_blank' : '_self'"
              class="material-item"
            >
              <span class="material-type" :class="`type-${m.type}`">{{ m.type }}</span>
              <span class="material-name">{{ m.name }}</span>
            </a>
          </div>
        </div>
      </div>

      <EmptyState
        v-if="filteredProducts.length === 0"
        title="暂无产品"
        description="当有新的售卖弹药收录时会在此显示"
      />
    </div>

    <!-- 更新时间 -->
    <div class="page-footer">
      📅 最后更新：{{ lastUpdate }} | 数据来源：腾讯云 CSIG 乐享 / 产品团队 / 前线实战沉淀
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { salesGuideData, salesGuideCategories } from '@/data/salesGuideData'

const router = useRouter()

const lastUpdate = ref('2026-04-20')
const selectedCategory = ref('all')

// 统计数据
const stats = computed(() => {
  const total = salesGuideData.length
  const hotCount = salesGuideData.filter(p => p.tag === '主推' || p.tag === '战略' || p.tag === '新品').length
  const caseCount = salesGuideData.reduce((sum, p) => sum + p.cases.length, 0)
  const pitchCount = salesGuideData.reduce((sum, p) => sum + p.pitches.length, 0)
  return { total, hotCount, caseCount, pitchCount }
})

// 分类选项
const categories = salesGuideCategories

// 筛选后的产品
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return salesGuideData
  }
  return salesGuideData.filter(p => p.category === selectedCategory.value)
})

// Tag 样式
const getTagClass = (tag: string) => {
  const map: Record<string, string> = {
    主推: 'tag-hot',
    战略: 'tag-strategy',
    新品: 'tag-new',
    热门: 'tag-hot'
  }
  return map[tag] || 'tag-default'
}

// 简单的 Markdown 渲染
const renderMarkdown = (content: string) => {
  return content
    .replace(/^### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')
    .replace(/^# (.*$)/gm, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>')
    .replace(/^-\s(.*)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: var(--text);
}

.page-header p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.stat-icon.blue { background: #e0e7ff; color: #4338ca; }
.stat-icon.green { background: #dcfce7; color: #16a34a; }
.stat-icon.orange { background: #fff7ed; color: #d97706; }
.stat-icon.red { background: #fee2e2; color: #dc2626; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
}

/* 筛选栏 */
.filter-bar {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-group label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.filter-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--text);
}

.filter-btn.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 500;
}

/* 弹药卡片列表 */
.ammo-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ammo-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

/* 卡片头 */
.ammo-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
  border-bottom: 1px solid var(--border-light);
}

.ammo-header-left {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.ammo-logo {
  font-size: 42px;
  flex-shrink: 0;
  line-height: 1;
}

.ammo-title-block {
  flex: 1;
  min-width: 0;
}

.ammo-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.ammo-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.ammo-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.ammo-tag.tag-hot { background: #fee2e2; color: #dc2626; }
.ammo-tag.tag-strategy { background: #ddd6fe; color: #6d28d9; }
.ammo-tag.tag-new { background: #dcfce7; color: #16a34a; }
.ammo-tag.tag-default { background: var(--primary-light); color: var(--primary); }

.ammo-priority {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  background: #f3f4f6;
  color: #6b7280;
}

.ammo-priority.priority-高 { background: #fee2e2; color: #dc2626; }
.ammo-priority.priority-中 { background: #fef3c7; color: #d97706; }
.ammo-priority.priority-低 { background: #e5e7eb; color: #6b7280; }

.ammo-one-liner {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.5;
}

.ammo-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--text-light);
}

.meta-item {
  display: inline-flex;
  align-items: center;
}

.meta-link {
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
}

.meta-link:hover {
  text-decoration: underline;
}

/* 各 section */
.ammo-section {
  padding: 18px 24px;
  border-top: 1px solid var(--border-light);
}

.ammo-section:first-of-type {
  border-top: none;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text);
}

/* 双栏布局 */
.ammo-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 18px 24px;
  border-top: 1px solid var(--border-light);
}

/* 要点列表 */
.bullet-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.bullet-list li {
  margin: 4px 0;
}

.green-list li::marker { color: #16a34a; }
.orange-list li::marker { color: #d97706; }

/* 目标客户 tag */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.customer-tag {
  font-size: 12px;
  padding: 4px 10px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 12px;
  border: 1px solid #bfdbfe;
}

/* 场景列表 */
.scene-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.scene-item {
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid var(--primary);
}

.scene-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.scene-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 报价 grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.pricing-item {
  padding: 12px 14px;
  background: #fef7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
}

.pricing-label {
  font-size: 11px;
  color: #c2410c;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pricing-value {
  font-size: 13px;
  color: var(--text);
  line-height: 1.5;
}

/* 竞品对比表 */
.competition-table {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  overflow: hidden;
}

.comp-head {
  display: grid;
  grid-template-columns: 160px 1fr;
  background: var(--bg);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.comp-head > div,
.comp-row > div {
  padding: 10px 14px;
}

.comp-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  font-size: 13px;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-light);
}

.comp-row .comp-col-1 {
  background: #fafafa;
  color: var(--text);
}

/* 话术 */
.pitch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pitch-item {
  padding: 12px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.pitch-scene {
  font-size: 12px;
  font-weight: 600;
  color: #15803d;
  margin-bottom: 6px;
}

.pitch-script {
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
}

/* 案例 */
.case-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
}

.case-item {
  padding: 12px 14px;
  background: #fafafa;
  border: 1px solid var(--border-light);
  border-radius: 8px;
}

.case-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.case-customer {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.case-industry {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 4px;
}

.case-effect {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  overflow: hidden;
}

.faq-q {
  padding: 10px 14px;
  background: var(--bg);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.faq-q::-webkit-details-marker {
  display: none;
}

.faq-q::before {
  content: '▶';
  display: inline-block;
  margin-right: 8px;
  font-size: 10px;
  transition: transform 0.2s;
  color: var(--primary);
}

.faq-item[open] .faq-q::before {
  transform: rotate(90deg);
}

.faq-a {
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  background: #fafbfc;
  border-top: 1px solid var(--border-light);
}

/* 物料 */
.material-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.material-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
}

.material-item:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.material-type {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
}

.material-type.type-PDF { background: #fee2e2; color: #dc2626; }
.material-type.type-PPT { background: #fff7ed; color: #d97706; }
.material-type.type-视频 { background: #dbeafe; color: #2563eb; }
.material-type.type-文档 { background: #dcfce7; color: #16a34a; }
.material-type.type-链接 { background: #e0e7ff; color: #4338ca; }

/* Markdown */
.markdown-body {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.markdown-body h2 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin: 14px 0 8px 0;
}

.markdown-body h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 12px 0 6px 0;
}

.markdown-body h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin: 10px 0 4px 0;
}

.markdown-body p {
  margin: 6px 0;
}

.markdown-body li {
  margin: 3px 0 3px 16px;
}

.markdown-body strong {
  color: var(--text);
  font-weight: 600;
}

/* 页脚 */
.page-footer {
  margin-top: 24px;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-light);
  text-align: center;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .ammo-row-2 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  .ammo-header-left {
    flex-direction: column;
  }
  .ammo-logo {
    font-size: 36px;
  }
}
</style>
