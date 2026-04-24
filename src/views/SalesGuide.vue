<template>
  <div class="sales-guide-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 售卖弹药
      </div>
      <h2>🎯 售卖弹药 · AI 产品报价知识库</h2>
      <p>整合腾讯云全部 AI 相关产品（大模型 / MaaS / AI SaaS / 智能体平台 / AI 基础能力 / <b>AI 算力 GPU</b>）的报价信息。每张卡片包含：<b>官方介绍</b>、<b>产品介绍和定义</b>、<b>售卖策略</b>、<b>内部报价资料</b>。</p>
      <p class="page-subtip">⚠️ 内部报价资料仅展示<b>真实可跳转</b>的官方 / 企微 / 腾讯文档链接；尚未收集到真实链接的文档条目会标注「⏳ 待补充」并禁用点击，由对应 owner（BD / 产品 / 财经 BP）后续补全。</p>
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
        <div class="stat-icon purple">🧩</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.categoryCount }}</span>
          <span class="stat-label">产品分类</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">📄</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.docCount }}</span>
          <span class="stat-label">内部报价文档</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🔥</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.hotCount }}</span>
          <span class="stat-label">主推 / 战略</span>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-group">
        <label>AI 产品分类：</label>
        <div class="filter-btns">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="filter-btn"
            :class="{ active: selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
            <span v-if="cat.value !== 'all'" class="filter-count">{{ getCategoryCount(cat.value) }}</span>
          </button>
        </div>
      </div>
      <div class="filter-group">
        <label>搜索：</label>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="产品名 / 一句话定位 / 能力关键字"
        />
      </div>
    </div>

    <!-- 产品卡片网格（精简版，点击查看详情） -->
    <div class="ammo-grid">
      <button
        v-for="product in filteredProducts"
        :key="product.id"
        type="button"
        class="ammo-mini-card"
        :class="`priority-ring-${product.priority}`"
        @click="openDetail(product)"
      >
        <div class="mini-head">
          <span class="mini-logo">{{ product.logo }}</span>
          <div class="mini-badges">
            <span v-if="product.tag" class="ammo-tag" :class="getTagClass(product.tag)">{{ product.tag }}</span>
            <span class="ammo-priority" :class="`priority-${product.priority}`">P-{{ product.priority }}</span>
          </div>
        </div>
        <div class="mini-name">{{ product.productName }}</div>
        <div v-if="product.productCode" class="mini-code">{{ product.productCode }}</div>
        <div class="mini-one-liner">{{ product.oneLiner }}</div>
        <div class="mini-footer">
          <span class="mini-category">📂 {{ product.category }}</span>
          <span class="mini-more">查看详情 →</span>
        </div>
      </button>

      <EmptyState
        v-if="filteredProducts.length === 0"
        title="暂无产品"
        description="未找到符合当前筛选条件的 AI 产品"
      />
    </div>

    <!-- 产品详情抽屉 -->
    <Teleport to="body">
      <Transition name="drawer-fade">
        <div
          v-if="activeProduct"
          class="drawer-mask"
          @click.self="closeDetail"
        >
          <Transition name="drawer-slide" appear>
            <aside
              v-if="activeProduct"
              class="drawer-panel"
              role="dialog"
              aria-modal="true"
              :aria-label="activeProduct.productName"
            >
              <!-- 抽屉头部 -->
              <div class="drawer-header">
                <div class="drawer-header-left">
                  <span class="drawer-logo">{{ activeProduct.logo }}</span>
                  <div class="drawer-title-block">
                    <div class="drawer-title-row">
                      <h3 class="drawer-name">{{ activeProduct.productName }}</h3>
                      <span v-if="activeProduct.productCode" class="ammo-code">{{ activeProduct.productCode }}</span>
                      <span v-if="activeProduct.tag" class="ammo-tag" :class="getTagClass(activeProduct.tag)">{{ activeProduct.tag }}</span>
                      <span class="ammo-priority" :class="`priority-${activeProduct.priority}`">优先级：{{ activeProduct.priority }}</span>
                    </div>
                    <div class="drawer-one-liner">{{ activeProduct.oneLiner }}</div>
                    <div class="ammo-meta">
                      <span class="meta-item category-pill">📂 {{ activeProduct.category }}<template v-if="activeProduct.subCategory"> · {{ activeProduct.subCategory }}</template></span>
                      <span class="meta-item">👤 接口人：{{ activeProduct.contact }}</span>
                      <span class="meta-item">🕐 更新：{{ activeProduct.lastUpdate }}</span>
                    </div>
                  </div>
                </div>
                <button type="button" class="drawer-close" aria-label="关闭" @click="closeDetail">×</button>
              </div>

              <!-- 抽屉正文：4 个 section -->
              <div class="drawer-body">
                <!-- Section 1: 官方介绍 -->
                <div class="ammo-section">
                  <h4 class="section-title">
                    <span class="section-num">01</span>
                    <span>📢 官方介绍</span>
                    <span class="section-tip">取自腾讯云官网</span>
                  </h4>
                  <div class="official-desc">{{ activeProduct.officialDesc }}</div>
                  <div class="official-links">
                    <a
                      v-for="(link, i) in activeProduct.officialLinks"
                      :key="i"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="official-link"
                    >
                      🔗 {{ link.label }}
                    </a>
                  </div>
                </div>

                <!-- Section 2: 产品介绍和定义 -->
                <div class="ammo-section section-alt">
                  <h4 class="section-title">
                    <span class="section-num">02</span>
                    <span>📖 产品介绍与定义</span>
                  </h4>
                  <div class="markdown-body" v-html="renderMarkdown(activeProduct.definition)"></div>
                  <div v-if="activeProduct.architecture" class="architecture-line">
                    🏗️ <b>产品架构</b>：{{ activeProduct.architecture }}
                  </div>
                  <div class="capabilities">
                    <h5 class="sub-title">核心能力</h5>
                    <ul class="bullet-list green-list">
                      <li v-for="(cap, i) in activeProduct.capabilities" :key="i">{{ cap }}</li>
                    </ul>
                  </div>
                </div>

                <!-- Section 3: 售卖策略 -->
                <div class="ammo-section">
                  <h4 class="section-title">
                    <span class="section-num">03</span>
                    <span>💼 售卖策略</span>
                  </h4>
                  <div class="strategy-grid">
                    <div class="strategy-item full-row">
                      <div class="strategy-label">🎯 市场定位 / 主打客群</div>
                      <div class="strategy-value">{{ activeProduct.strategy.positioning }}</div>
                    </div>
                    <div class="strategy-item">
                      <div class="strategy-label">💰 计费模式</div>
                      <div class="strategy-value">{{ activeProduct.strategy.pricingModel }}</div>
                    </div>
                    <div class="strategy-item">
                      <div class="strategy-label">🏷️ 价格锚点</div>
                      <div class="strategy-value">{{ activeProduct.strategy.priceAnchor }}</div>
                    </div>
                    <div class="strategy-item full-row">
                      <div class="strategy-label">🎁 折扣政策</div>
                      <div class="strategy-value">{{ activeProduct.strategy.discountPolicy }}</div>
                    </div>
                    <div v-if="activeProduct.strategy.comboStrategy" class="strategy-item full-row">
                      <div class="strategy-label">🤝 联卖 / 组合策略</div>
                      <div class="strategy-value">{{ activeProduct.strategy.comboStrategy }}</div>
                    </div>
                  </div>

                  <div class="strategy-row-2">
                    <div class="strategy-col">
                      <h5 class="sub-title">🏢 重点场景</h5>
                      <ul class="bullet-list blue-list">
                        <li v-for="(s, i) in activeProduct.strategy.keyScenes" :key="i">{{ s }}</li>
                      </ul>
                    </div>
                    <div v-if="activeProduct.strategy.battleCard" class="strategy-col">
                      <h5 class="sub-title">⚔️ 竞争话术要点</h5>
                      <ul class="bullet-list orange-list">
                        <li v-for="(b, i) in activeProduct.strategy.battleCard" :key="i">{{ b }}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Section 4: 内部报价资料 -->
                <div class="ammo-section section-docs">
                  <h4 class="section-title">
                    <span class="section-num">04</span>
                    <span>📑 内部报价资料</span>
                    <span class="section-tip">真实链接点击外跳；标「待补充」的条目为资料目录占位，需 BD 后续提供</span>
                  </h4>
                  <div class="docs-grid">
                    <component
                      :is="doc.placeholder ? 'div' : 'a'"
                      v-for="(doc, i) in activeProduct.pricingDocs"
                      :key="i"
                      :href="doc.placeholder ? undefined : doc.url"
                      :target="doc.placeholder ? undefined : '_blank'"
                      :rel="doc.placeholder ? undefined : 'noopener noreferrer'"
                      class="doc-card"
                      :class="{ 'doc-card--placeholder': doc.placeholder }"
                      :title="doc.placeholder ? '该条目尚未绑定真实文档链接，请联系对应 owner 补充' : '点击跳转查看文档'"
                    >
                      <div class="doc-card-head">
                        <span class="doc-type" :style="getDocTypeStyle(doc.type)">{{ doc.type }}</span>
                        <span v-if="doc.placeholder" class="doc-placeholder-badge">⏳ 待补充</span>
                        <span v-else-if="doc.restricted" class="doc-restricted">🔒 内部</span>
                      </div>
                      <div class="doc-card-name">{{ doc.name }}</div>
                      <div class="doc-card-meta">
                        <span v-if="doc.owner">👤 {{ doc.owner }}</span>
                        <span v-if="doc.updatedAt">🕐 {{ doc.updatedAt }}</span>
                        <span v-if="!doc.placeholder" class="doc-open">🡕 打开文档</span>
                        <span v-else class="doc-open doc-open--muted">尚未提供链接</span>
                      </div>
                    </component>
                  </div>
                </div>
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- 更新时间 -->
    <div class="page-footer">
      📅 最后更新：{{ lastUpdate }} | 数据来源：腾讯云官网 · CSIG 乐享 · 前线实战沉淀 · 战略客户部整理
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { salesGuideData, salesGuideCategories, pricingDocTypeConfig, type AmmoProduct } from '@/data/salesGuideData'

const router = useRouter()

const lastUpdate = ref('2026-04-20')
const selectedCategory = ref('all')
const searchKeyword = ref('')

// 当前展开详情的产品（null = 未打开抽屉）
const activeProduct = ref<AmmoProduct | null>(null)

const openDetail = (product: AmmoProduct) => {
  activeProduct.value = product
}

const closeDetail = () => {
  activeProduct.value = null
}

// ESC 关闭抽屉
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && activeProduct.value) {
    closeDetail()
  }
}

// 抽屉打开时锁定 body 滚动
watch(activeProduct, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

// 统计数据
const stats = computed(() => {
  const total = salesGuideData.length
  const categoryCount = new Set(salesGuideData.map(p => p.category)).size
  const docCount = salesGuideData.reduce((sum, p) => sum + p.pricingDocs.length, 0)
  const hotCount = salesGuideData.filter(p => p.tag === '主推' || p.tag === '战略' || p.tag === '新品').length
  return { total, categoryCount, docCount, hotCount }
})

// 分类选项
const categories = salesGuideCategories

const getCategoryCount = (cat: string) => {
  return salesGuideData.filter(p => p.category === cat).length
}

// 筛选后的产品
const filteredProducts = computed(() => {
  let data = salesGuideData

  if (selectedCategory.value !== 'all') {
    data = data.filter(p => p.category === selectedCategory.value)
  }

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    data = data.filter(p =>
      p.productName.toLowerCase().includes(kw) ||
      (p.productCode || '').toLowerCase().includes(kw) ||
      p.oneLiner.toLowerCase().includes(kw) ||
      p.officialDesc.toLowerCase().includes(kw) ||
      p.capabilities.some(c => c.toLowerCase().includes(kw))
    )
  }

  return data
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

// 报价文档类型样式
const getDocTypeStyle = (type: string) => {
  const conf = pricingDocTypeConfig[type] || pricingDocTypeConfig['其他']
  return { color: conf.color, background: conf.bg }
}

// 简单 Markdown 渲染
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
  line-height: 1.7;
}

.page-header p + p.page-subtip {
  margin-top: 8px;
  padding: 8px 12px;
  background: #fff7ed;
  border-left: 3px solid #f97316;
  border-radius: 4px;
  font-size: 12px;
  color: #7c2d12;
}

.page-header p b {
  color: var(--primary);
  font-weight: 600;
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
.stat-icon.purple { background: #f3e8ff; color: #7c3aed; }
.stat-icon.red { background: #fee2e2; color: #dc2626; }

.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 24px; font-weight: 700; color: var(--text); }
.stat-label { font-size: 12px; color: var(--text-light); }

/* 筛选栏 */
.filter-bar {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  min-width: 96px;
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.filter-btn:hover { border-color: var(--primary); color: var(--text); }
.filter-btn.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 500;
}

.filter-count {
  font-size: 11px;
  padding: 0 6px;
  background: rgba(0,0,0,0.06);
  border-radius: 10px;
  color: var(--text-light);
}

.filter-btn.active .filter-count {
  background: rgba(43, 90, 237, 0.15);
  color: var(--primary);
}

.search-input {
  flex: 1;
  min-width: 240px;
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  background: var(--bg);
  outline: none;
  transition: all 0.2s;
}
.search-input:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(43, 90, 237, 0.08);
}

/* 产品卡片网格（精简版） */
.ammo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.ammo-mini-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 18px 14px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  position: relative;
  overflow: hidden;
}

.ammo-mini-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--border);
  transition: background 0.18s ease;
}

.ammo-mini-card.priority-ring-高::before { background: #ef4444; }
.ammo-mini-card.priority-ring-中::before { background: #f59e0b; }
.ammo-mini-card.priority-ring-低::before { background: #cbd5e1; }

.ammo-mini-card:hover {
  border-color: var(--primary);
  box-shadow: 0 6px 18px rgba(43, 90, 237, 0.12);
  transform: translateY(-2px);
}

.ammo-mini-card:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.mini-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mini-logo {
  font-size: 34px;
  line-height: 1;
}

.mini-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.mini-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.4;
}

.mini-code {
  font-size: 11px;
  color: var(--text-light);
  font-family: 'SF Mono', Monaco, monospace;
}

.mini-one-liner {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.6;
  /* 最多两行，超出省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.mini-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-light);
  font-size: 11.5px;
  color: var(--text-light);
}

.mini-category {
  color: var(--primary);
  font-weight: 500;
}

.mini-more {
  color: var(--primary);
  font-weight: 600;
}

/* 抽屉（右侧滑出） */
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(2px);
}

.drawer-panel {
  width: min(880px, 92vw);
  height: 100vh;
  background: var(--bg-white);
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 26px;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 60%, #ffffff 100%);
  border-bottom: 1px solid var(--border-light);
}

.drawer-header-left {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.drawer-logo {
  font-size: 40px;
  line-height: 1;
  flex-shrink: 0;
}

.drawer-title-block { flex: 1; min-width: 0; }

.drawer-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.drawer-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.drawer-one-liner {
  font-size: 13.5px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  line-height: 1.6;
}

.drawer-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.15s;
}

.drawer-close:hover {
  background: #fff;
  border-color: var(--primary);
  color: var(--primary);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* 抽屉动画 */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.ammo-code {
  font-size: 12px;
  padding: 2px 8px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-secondary);
  font-family: 'SF Mono', Monaco, monospace;
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

.ammo-meta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--text-light);
}

.category-pill {
  padding: 2px 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--primary);
  font-weight: 500;
}

/* section 通用 */
.ammo-section {
  padding: 22px 26px;
  border-top: 1px solid var(--border-light);
}
.ammo-section:first-of-type { border-top: none; }
.ammo-section.section-alt { background: #fafbfc; }
.ammo-section.section-docs { background: #fffaf5; }

.section-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 14px 0;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.section-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  background: var(--primary);
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.section-tip {
  font-size: 11px;
  font-weight: 400;
  color: var(--text-light);
  background: #fff;
  padding: 2px 8px;
  border: 1px dashed var(--border);
  border-radius: 4px;
}

/* 官方介绍 */
.official-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  padding: 14px 16px;
  background: #fff;
  border-left: 3px solid var(--primary);
  border-radius: 0 8px 8px 0;
  margin-bottom: 12px;
}

.official-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.official-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
  color: var(--primary);
  text-decoration: none;
  transition: all 0.2s;
}

.official-link:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}

/* 产品介绍 */
.architecture-line {
  margin: 12px 0;
  padding: 10px 14px;
  background: #fffbea;
  border: 1px solid #fde68a;
  border-radius: 6px;
  font-size: 13px;
  color: #92400e;
}

.capabilities {
  margin-top: 14px;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text);
}

/* 售卖策略 */
.strategy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 18px;
}

.strategy-item {
  padding: 12px 14px;
  background: #fef7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
}

.strategy-item.full-row { grid-column: 1 / -1; }

.strategy-label {
  font-size: 11px;
  color: #c2410c;
  font-weight: 700;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.strategy-value {
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
}

.strategy-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.strategy-col {
  padding: 14px 16px;
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: 8px;
}

/* 要点列表 */
.bullet-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-secondary);
}
.bullet-list li { margin: 3px 0; }
.green-list li::marker { color: #16a34a; }
.orange-list li::marker { color: #d97706; }
.blue-list li::marker { color: #2563eb; }

/* 内部报价资料 docs grid */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.doc-card {
  display: block;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;
  position: relative;
}

.doc-card:hover {
  border-color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
  transform: translateY(-2px);
}

.doc-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.doc-type {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.4px;
}

.doc-restricted {
  font-size: 10px;
  padding: 2px 6px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 4px;
  font-weight: 600;
}

.doc-placeholder-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  font-weight: 600;
}

.doc-card--placeholder {
  background: repeating-linear-gradient(
    45deg,
    #fafafa,
    #fafafa 6px,
    #f5f5f5 6px,
    #f5f5f5 12px
  );
  border-style: dashed;
  border-color: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.85;
}

.doc-card--placeholder:hover {
  border-color: #cbd5e1;
  box-shadow: none;
  transform: none;
}

.doc-card--placeholder .doc-card-name {
  color: #64748b;
}

.doc-open--muted {
  color: #94a3b8 !important;
  font-weight: 500 !important;
  font-style: italic;
}

.doc-card-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.5;
  margin-bottom: 10px;
}

.doc-card-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 11px;
  color: var(--text-light);
}

.doc-card-meta .doc-open {
  margin-left: auto;
  color: #ea580c;
  font-weight: 600;
}

/* Markdown */
.markdown-body {
  font-size: 13px;
  line-height: 1.85;
  color: var(--text-secondary);
}
.markdown-body h2 {
  font-size: 15px;
  font-weight: 700;
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
.markdown-body p { margin: 6px 0; }
.markdown-body li { margin: 3px 0 3px 16px; }
.markdown-body strong { color: var(--text); font-weight: 600; }

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
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .strategy-grid { grid-template-columns: 1fr; }
  .strategy-row-2 { grid-template-columns: 1fr; gap: 12px; }
}

@media (max-width: 768px) {
  .stats-row { grid-template-columns: 1fr; }
  .ammo-grid { grid-template-columns: 1fr; }
  .drawer-panel { width: 100vw; }
  .drawer-header-left { flex-direction: column; }
  .drawer-logo { font-size: 32px; }
  .docs-grid { grid-template-columns: 1fr; }
}
</style>
