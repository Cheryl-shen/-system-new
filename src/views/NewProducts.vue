<template>
  <div class="new-products-page">
    <!-- 页头 -->
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 官网上新
      </div>
      <h2>🆕 官网上新</h2>
      <p>每周汇总腾讯云官网新发布的产品、新功能和重要更新，帮助团队第一时间掌握产品动向</p>
    </div>

    <!-- 周次切换 + 概览 -->
    <div class="week-hero">
      <div class="week-tabs">
        <div
          v-for="week in weeklyUpdates"
          :key="week.weekKey"
          class="week-tab"
          :class="{ active: activeWeek === week.weekKey }"
          @click="activeWeek = week.weekKey"
        >
          {{ week.weekLabel }}
          <span class="tab-count">{{ week.products.length }}</span>
        </div>
      </div>
      <div class="week-summary">
        <div class="summary-icon">📊</div>
        <div class="summary-content">
          <div class="summary-title">本期概要</div>
          <div class="summary-text">{{ currentWeek?.summary }}</div>
        </div>
        <div class="summary-stats">
          <div class="stat">
            <div class="stat-num">{{ currentWeek?.products.length || 0 }}</div>
            <div class="stat-label">上新数量</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ hotCount }}</div>
            <div class="stat-label">重点推荐</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ categoryCount }}</div>
            <div class="stat-label">涉及品类</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input v-model="searchKeyword" type="text" placeholder="搜索产品名称、关键词..." />
      </div>
      <div class="category-filter">
        <span
          class="cat-chip"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >全部</span>
        <span
          v-for="cat in categories"
          :key="cat"
          class="cat-chip"
          :class="{ active: selectedCategory === cat }"
          :style="selectedCategory === cat ? { background: categoryConfig[cat]?.bg, color: categoryConfig[cat]?.color, borderColor: categoryConfig[cat]?.color } : {}"
          @click="selectedCategory = cat"
        >{{ cat }}</span>
      </div>
      <div class="view-switch">
        <button class="vs-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'">卡片</button>
        <button class="vs-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">列表</button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-title">暂无匹配的上新记录</div>
      <div class="empty-desc">试试切换周次或清空筛选条件</div>
    </div>

    <!-- 卡片视图 -->
    <div v-else-if="viewMode === 'card'" class="product-grid">
      <div
        v-for="p in filteredProducts"
        :key="p.id"
        class="product-card"
        :class="{ 'is-hot': p.isHot }"
      >
        <div class="card-top">
          <span
            class="cat-badge"
            :style="{ background: categoryConfig[p.category]?.bg, color: categoryConfig[p.category]?.color }"
          >{{ p.category }}</span>
          <span
            class="type-badge"
            :style="{ background: updateTypeConfig[p.updateType]?.bg, color: updateTypeConfig[p.updateType]?.color }"
          >{{ p.updateType }}</span>
          <span v-if="p.isHot" class="hot-badge">🔥 HOT</span>
        </div>
        <h3 class="card-title">{{ p.name }}</h3>
        <p class="card-summary">{{ p.summary }}</p>
        <p class="card-desc">{{ p.description }}</p>
        <ul class="card-highlights">
          <li v-for="(h, i) in p.highlights.slice(0, 4)" :key="i">{{ h }}</li>
        </ul>
        <div class="card-footer">
          <span class="card-date">📅 {{ p.date }}</span>
          <a
            :href="p.officialUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="card-link"
          >查看官网 →</a>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="product-list">
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th>产品名称</th>
            <th>分类</th>
            <th>类型</th>
            <th>发布日期</th>
            <th>简介</th>
            <th class="col-op">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, idx) in filteredProducts" :key="p.id">
            <td class="col-num">{{ idx + 1 }}</td>
            <td>
              <span class="lt-name">{{ p.name }}</span>
              <span v-if="p.isHot" class="hot-dot">HOT</span>
            </td>
            <td>
              <span
                class="cat-badge"
                :style="{ background: categoryConfig[p.category]?.bg, color: categoryConfig[p.category]?.color }"
              >{{ p.category }}</span>
            </td>
            <td>
              <span
                class="type-badge"
                :style="{ background: updateTypeConfig[p.updateType]?.bg, color: updateTypeConfig[p.updateType]?.color }"
              >{{ p.updateType }}</span>
            </td>
            <td class="col-date">{{ p.date }}</td>
            <td class="col-summary">{{ p.summary }}</td>
            <td class="col-op">
              <a :href="p.officialUrl" target="_blank" rel="noopener noreferrer" class="lt-link">官网 →</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 数据来源说明 -->
    <div class="source-note">
      📌 数据来源：<a href="https://cloud.tencent.com/product/events" target="_blank" rel="noopener noreferrer">腾讯云官方产品动态</a> · 
      <a href="https://cloud.tencent.com/announce" target="_blank" rel="noopener noreferrer">腾讯云公告</a> · 
      混元官网 · QQ浏览器官网 · 每周一上午更新
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { weeklyUpdates, categoryConfig, updateTypeConfig } from '@/data/newProductsData'

const router = useRouter()

const activeWeek = ref(weeklyUpdates[0].weekKey)
const searchKeyword = ref('')
const selectedCategory = ref<string>('all')
const viewMode = ref<'card' | 'list'>('card')

const currentWeek = computed(() => weeklyUpdates.find(w => w.weekKey === activeWeek.value))

const categories = computed(() => {
  if (!currentWeek.value) return []
  return Array.from(new Set(currentWeek.value.products.map(p => p.category)))
})

const filteredProducts = computed(() => {
  if (!currentWeek.value) return []
  const kw = searchKeyword.value.trim().toLowerCase()
  return currentWeek.value.products.filter(p => {
    const matchCat = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const matchKw = !kw ||
      p.name.toLowerCase().includes(kw) ||
      p.summary.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw) ||
      p.tags?.some(t => t.toLowerCase().includes(kw))
    return matchCat && matchKw
  })
})

const hotCount = computed(() => currentWeek.value?.products.filter(p => p.isHot).length || 0)
const categoryCount = computed(() => categories.value.length)
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
.breadcrumb a { color: var(--primary); text-decoration: none; cursor: pointer; }
.breadcrumb a:hover { text-decoration: underline; }
.page-header h2 { font-size: 20px; font-weight: 600; margin: 0 0 4px 0; color: var(--text); }
.page-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }

/* 周次 Hero */
.week-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 6px 18px rgba(118, 75, 162, 0.18);
}

.week-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.week-tab {
  padding: 8px 16px;
  background: rgba(255,255,255,0.15);
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  backdrop-filter: blur(10px);
}

.week-tab:hover { background: rgba(255,255,255,0.25); }
.week-tab.active {
  background: #fff;
  color: #667eea;
  font-weight: 600;
}

.week-tab .tab-count {
  display: inline-block;
  margin-left: 6px;
  background: rgba(255,255,255,0.3);
  padding: 0 7px;
  border-radius: 10px;
  font-size: 11px;
}

.week-tab.active .tab-count {
  background: #eef2ff;
  color: #667eea;
}

.week-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.summary-icon { font-size: 28px; }
.summary-content { flex: 1; min-width: 240px; }
.summary-title { font-size: 13px; opacity: 0.8; margin-bottom: 4px; }
.summary-text { font-size: 14px; line-height: 1.7; }

.summary-stats {
  display: flex;
  gap: 12px;
}

.stat {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 12px 18px;
  min-width: 82px;
  text-align: center;
}

.stat-num { font-size: 22px; font-weight: 700; }
.stat-label { font-size: 11px; opacity: 0.85; margin-top: 2px; }

/* 工具栏 */
.toolbar-bar {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0 10px;
  height: 32px;
  min-width: 220px;
  flex: 0 1 280px;
}

.search-box:focus-within { border-color: var(--primary); }
.search-icon { color: var(--text-light); font-size: 14px; margin-right: 6px; }
.search-box input {
  border: none; outline: none; background: transparent;
  font-size: 13px; width: 100%; color: var(--text);
}

.category-filter {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.cat-chip {
  padding: 4px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  color: var(--text-secondary);
}

.cat-chip:hover { border-color: var(--primary); color: var(--primary); }
.cat-chip.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  font-weight: 500;
}

.view-switch {
  display: flex;
  background: var(--bg);
  border-radius: 6px;
  padding: 2px;
}

.vs-btn {
  padding: 5px 12px;
  font-size: 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.vs-btn.active {
  background: var(--bg-white);
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
}

/* 卡片网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.product-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-card.is-hot {
  border-color: #fca5a5;
  background: linear-gradient(to bottom, #fff 0%, #fff5f5 100%);
}

.card-top {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.cat-badge, .type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.hot-badge {
  background: linear-gradient(90deg, #ef4444, #f97316);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--text);
  line-height: 1.4;
}

.card-summary {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 14px 0;
  flex: 1;
}

.card-highlights li {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 3px 0 3px 16px;
  position: relative;
  line-height: 1.6;
}

.card-highlights li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.card-date { font-size: 12px; color: var(--text-light); }
.card-link {
  font-size: 12px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.15s;
}

.card-link:hover { transform: translateX(3px); }

/* 列表视图 */
.product-list {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: auto;
}

.list-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.list-table th, .list-table td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

.list-table thead { background: var(--header-bg, #f8fafc); }
.list-table th {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 12px;
}

.list-table tbody tr:hover { background: var(--row-hover, #f8fafc); }
.list-table .col-num { width: 46px; text-align: center; color: var(--text-light); }
.list-table .col-date { color: var(--text-light); white-space: nowrap; }
.list-table .col-summary { color: var(--text-secondary); max-width: 320px; }
.list-table .col-op { text-align: center; width: 80px; }

.lt-name { font-weight: 500; color: var(--text); }
.hot-dot {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  background: #fef2f2;
  color: #ef4444;
  font-size: 10px;
  border-radius: 4px;
  font-weight: 600;
}

.lt-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.lt-link:hover { text-decoration: underline; }

/* 空状态 */
.empty-state {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 60px 20px;
  text-align: center;
}

.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.empty-desc { font-size: 13px; color: var(--text-light); }

/* 数据来源说明 */
.source-note {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--bg);
  border-radius: var(--radius);
  font-size: 12px;
  color: var(--text-light);
  line-height: 1.8;
}

.source-note a {
  color: var(--primary);
  text-decoration: none;
}

.source-note a:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .week-summary { flex-direction: column; align-items: flex-start; }
  .summary-stats { width: 100%; }
  .stat { flex: 1; }
  .product-grid { grid-template-columns: 1fr; }
  .toolbar-bar { flex-direction: column; align-items: stretch; }
  .search-box { max-width: 100%; flex: 1 1 auto; }
}
</style>
