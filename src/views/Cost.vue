<template>
  <div class="cost-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 成本变化
      </div>
      <h2>成本变化</h2>
      <p>后端正式通知的成本变动信息汇总，帮助团队及时了解对项目成本的影响</p>
    </div>

    <!-- 背景信息卡片 -->
    <div class="info-card">
      <div class="info-card-header" :class="{ collapsed: !cardStates.info }" @click="toggleCard('info')">
        <h3>
          📋 背景说明
          <span class="info-tag tag-red">重要通知</span>
          <span class="info-tag tag-blue">2026-04 生效</span>
        </h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" :class="{ hidden: !cardStates.info }">
        <p style="margin-top: 12px">
          根据后端正式通知，<strong>2026年Q2（04月账期起）</strong>将对多项云产品实施用户级核算单价调整。本次调整涉及
          <strong>CVM、CBS、COS、CDB</strong> 等核心产品，涨幅范围在 <strong>6%~78%</strong> 不等。
        </p>
        <p style="margin-top: 8px">
          请各团队关注本次变化对项目成本的影响，如有疑问请联系对应的产品侧/云运营对接人。
        </p>
        <div class="info-footer">
          📄 数据来源：用户级核算单价变更通知【2026-04月账期生效】 · 本页面持续更新
        </div>
      </div>
    </div>

    <!-- 数据表格区域 -->
    <div class="sheet-container">
      <div class="sheet-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="sheet-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </div>
      </div>

      <!-- Tab1: 单价涨幅明细 -->
      <div class="sheet-panel" :class="{ active: activeTab === 'price-rise' }">
        <div class="toolbar">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索产品名称、类型..."
            />
          </div>
          <div class="filter-wrapper">
            <button class="filter-btn" :class="{ active: filterOpen }" @click="toggleFilter">
              📦 产品筛选
              <span style="font-size: 10px">▼</span>
            </button>
            <div class="filter-dropdown" :class="{ show: filterOpen }">
              <div
                v-for="option in productFilterOptions"
                :key="option.key"
                class="filter-option"
                :class="{ selected: selectedFilter === option.value }"
                @click="applyFilter(option.value)"
              >
                <span class="check">✓</span>
                {{ option.label }}
              </div>
            </div>
          </div>
          <span v-if="selectedFilter !== 'all'" class="clear-filter" @click="clearFilter">清除筛选</span>
        </div>
        <div class="table-wrapper">
          <table class="sheet-table">
            <thead>
              <tr>
                <th class="row-num">#</th>
                <th>产品</th>
                <th>产品类型</th>
                <th>调价类型</th>
                <th>Q2涨幅（对比Q1）</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in filteredPriceRiseData"
                :key="item.id"
                v-show="matchesFilter(item) && matchesSearch(item)"
              >
                <td class="row-num">{{ index + 1 }}</td>
                <td><span :class="getProductBadgeClass(item.product)">{{ item.product }}</span></td>
                <td>{{ item.productType }}</td>
                <td><span class="status-dot up"></span>{{ item.priceChange }}</td>
                <td>
                  <span :class="getRiseTagClass(item.rise)">
                    <span class="arrow">↑</span> {{ item.rise }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sheet-footer">
          <span>共 {{ filteredPriceRiseCount }} 条记录</span>
          <span>数据来源：用户级核算单价变更通知 · 2026-04月账期</span>
        </div>
      </div>

      <!-- Tab2: 行业成本汇总 -->
      <div class="sheet-panel" :class="{ active: activeTab === 'industry-cost' }">
        <div class="toolbar">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索产业大类、产品名称..."
            />
          </div>
          <div class="filter-wrapper">
            <button class="filter-btn" :class="{ active: industryFilterOpen }" @click="toggleIndustryFilter">
              🏭 产业筛选
              <span style="font-size: 10px">▼</span>
            </button>
            <div class="filter-dropdown" :class="{ show: industryFilterOpen }">
              <div
                v-for="option in industryFilterOptions"
                :key="option.key"
                class="filter-option"
                :class="{ selected: selectedIndustryFilter === option.value }"
                @click="applyIndustryFilter(option.value)"
              >
                <span class="check">✓</span>
                {{ option.label }}
              </div>
            </div>
          </div>
          <span v-if="selectedIndustryFilter !== 'all'" class="clear-filter" @click="clearIndustryFilter">清除筛选</span>
        </div>
        <div class="table-wrapper">
          <table class="sheet-table">
            <thead>
              <tr>
                <th class="row-num">#</th>
                <th>产业大类</th>
                <th>成本规划产品名称</th>
                <th>调价类型</th>
                <th>用户级成本涨幅（平均值）</th>
                <th>生效账期月份</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in industryCostData"
                :key="item.id"
                v-show="matchesIndustryFilter(item) && matchesSearch(item)"
              >
                <td class="row-num">{{ index + 1 }}</td>
                <td><span :class="getIndustryTagClass(item.industry)" style="margin: 0">{{ item.industry }}</span></td>
                <td>{{ item.productName }}</td>
                <td><span class="status-dot up"></span>{{ item.priceChange }}</td>
                <td>
                  <span class="rise-tag rise-mid">
                    <span class="arrow">↑</span> {{ item.rise }}
                  </span>
                </td>
                <td>{{ item.effectivePeriod }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sheet-footer">
          <span>共 {{ filteredIndustryCount }} 条记录</span>
          <span>按行业整体成本平均涨幅</span>
        </div>
      </div>

      <!-- Tab3: 对接人一览 -->
      <div class="sheet-panel" :class="{ active: activeTab === 'contact' }">
        <div class="toolbar">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索产业大类、产品名称..."
            />
          </div>
        </div>
        <div class="table-wrapper">
          <table class="sheet-table">
            <thead>
              <tr>
                <th class="row-num">#</th>
                <th>产业大类</th>
                <th>成本规划产品名称</th>
                <th>产品侧对接人</th>
                <th>云运营对接人</th>
                <th>生效账期</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in contactData"
                :key="item.id"
                v-show="matchesSearch(item)"
              >
                <td class="row-num">{{ index + 1 }}</td>
                <td><span :class="getIndustryTagClass(item.industry)" style="margin: 0">{{ item.industry }}</span></td>
                <td>{{ item.productName }}</td>
                <td>
                  <div class="contact-group">
                    <span
                      v-for="(contact, cIdx) in item.productContact"
                      :key="cIdx"
                    >
                      <span v-if="cIdx > 0" style="color: var(--text-light)">/</span>
                      <span class="contact-link">{{ contact }}</span>
                    </span>
                  </div>
                </td>
                <td><span class="contact-link">{{ item.cloudOperationContact }}</span></td>
                <td>{{ item.effectivePeriod }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sheet-footer">
          <span>共 {{ filteredContactCount }} 条记录</span>
          <span>如有疑问请联系对应对接人</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { priceRiseData, industryCostData, contactData } from '@/data/costData'

const router = useRouter()

// 卡片状态
const cardStates = ref({
  info: true
})

const toggleCard = (key: string) => {
  cardStates.value[key] = !cardStates.value[key]
}

// Tab状态
const activeTab = ref('price-rise')
const tabs = [
  { key: 'price-rise', label: '单价涨幅明细', count: 6 },
  { key: 'industry-cost', label: '行业成本汇总', count: 4 },
  { key: 'contact', label: '对接人一览', count: 4 }
]

// 搜索
const searchKeyword = ref('')

// 筛选状态
const filterOpen = ref(false)
const selectedFilter = ref('all')
const industryFilterOpen = ref(false)
const selectedIndustryFilter = ref('all')

const productFilterOptions = [
  { key: 'all', label: '全部', value: 'all' },
  { key: 'CVM', label: 'CVM', value: 'CVM' },
  { key: 'CBS', label: 'CBS', value: 'CBS' },
  { key: 'COS', label: 'COS', value: 'COS' },
  { key: 'CDB', label: 'CDB', value: 'CDB' }
]

const industryFilterOptions = [
  { key: 'all', label: '全部', value: 'all' },
  { key: '计算', label: '计算', value: '计算' },
  { key: '存储', label: '存储', value: '存储' },
  { key: '数据库', label: '数据库', value: '数据库' }
]

const toggleFilter = () => {
  filterOpen.value = !filterOpen.value
}

const toggleIndustryFilter = () => {
  industryFilterOpen.value = !industryFilterOpen.value
}

const applyFilter = (value: string) => {
  selectedFilter.value = value
  filterOpen.value = false
}

const applyIndustryFilter = (value: string) => {
  selectedIndustryFilter.value = value
  industryFilterOpen.value = false
}

const clearFilter = () => {
  selectedFilter.value = 'all'
}

const clearIndustryFilter = () => {
  selectedIndustryFilter.value = 'all'
}

const matchesFilter = (item: any) => {
  if (selectedFilter.value === 'all') return true
  return item.product === selectedFilter.value
}

const matchesIndustryFilter = (item: any) => {
  if (selectedIndustryFilter.value === 'all') return true
  return item.industry === selectedIndustryFilter.value
}

const matchesSearch = (item: any) => {
  if (!searchKeyword.value) return true
  const keyword = searchKeyword.value.toLowerCase()
  return Object.values(item).some(val => 
    String(val).toLowerCase().includes(keyword)
  )
}

// 计算属性
const filteredPriceRiseData = computed(() => {
  return priceRiseData.filter(item => matchesFilter(item) && matchesSearch(item))
})

const filteredPriceRiseCount = computed(() => filteredPriceRiseData.value.length)

const filteredIndustryCount = computed(() => {
  return industryCostData.filter(item => matchesIndustryFilter(item) && matchesSearch(item)).length
})

const filteredContactCount = computed(() => {
  return contactData.filter(item => matchesSearch(item)).length
})

// 样式类
const getProductBadgeClass = (product: string) => {
  const classes: Record<string, string> = {
    'CVM': 'product-badge cvm',
    'CBS': 'product-badge cbs',
    'COS': 'product-badge cos',
    'CDB': 'product-badge cdb'
  }
  return classes[product] || 'product-badge'
}

const getRiseTagClass = (rise: string) => {
  const num = parseInt(rise.replace(/[^0-9]/g, ''))
  if (num >= 70) return 'rise-tag rise-high'
  if (num >= 40) return 'rise-tag rise-mid'
  return 'rise-tag rise-low'
}

const getIndustryTagClass = (industry: string) => {
  const classes: Record<string, string> = {
    '计算': 'info-tag tag-blue',
    '存储': 'info-tag tag-yellow',
    '数据库': 'info-tag tag-red'
  }
  return classes[industry] || 'info-tag tag-blue'
}

// 点击外部关闭筛选下拉
window.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement
  if (!target.closest('.filter-wrapper')) {
    filterOpen.value = false
    industryFilterOpen.value = false
  }
})
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
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text);
}

.page-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 信息卡片 */
.info-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 16px;
  overflow: hidden;
}

.info-card-header {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.info-card-header:hover {
  background: var(--bg);
}

.info-card-header h3 {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  font-size: 12px;
  color: var(--text-light);
  transition: transform 0.2s;
}

.info-card-header.collapsed .toggle-icon {
  transform: rotate(-90deg);
}

.info-card-body {
  padding: 0 20px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
  border-top: 1px solid var(--border-light);
}

.info-card-body.hidden {
  display: none;
}

.info-footer {
  margin-top: 12px;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-light);
}

.info-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 6px;
}

.tag-red {
  background: var(--red-bg);
  color: var(--red);
}

.tag-blue {
  background: var(--primary-light);
  color: var(--primary);
}

.tag-yellow {
  background: var(--yellow-bg);
  color: var(--yellow);
}

/* 表格区域 */
.sheet-container {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.sheet-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--header-bg);
  overflow-x: auto;
}

.sheet-tab {
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all 0.15s;
  user-select: none;
}

.sheet-tab:hover {
  color: var(--text);
  background: #eef0f3;
}

.sheet-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  background: var(--bg-white);
  font-weight: 600;
}

.sheet-tab .tab-count {
  display: inline-block;
  background: #eee;
  color: var(--text-secondary);
  font-size: 11px;
  padding: 0 6px;
  border-radius: 10px;
  margin-left: 6px;
  font-weight: 400;
}

.sheet-tab.active .tab-count {
  background: var(--primary-light);
  color: var(--primary);
}

.sheet-panel {
  display: none;
}

.sheet-panel.active {
  display: block;
}

/* 工具栏 */
.toolbar {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-light);
  flex-wrap: wrap;
}

.toolbar .search-box {
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0 10px;
  height: 32px;
  min-width: 200px;
  flex: 1;
  max-width: 320px;
  transition: border-color 0.15s;
}

.toolbar .search-box:focus-within {
  border-color: var(--primary);
}

.toolbar .search-box .search-icon {
  color: var(--text-light);
  font-size: 14px;
  margin-right: 6px;
}

.toolbar .search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  width: 100%;
  color: var(--text);
}

.toolbar .filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  height: 32px;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.filter-wrapper {
  position: relative;
  display: inline-block;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  padding: 8px 0;
  min-width: 160px;
  z-index: 50;
  display: none;
}

.filter-dropdown.show {
  display: block;
}

.filter-dropdown .filter-option {
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.1s;
}

.filter-dropdown .filter-option:hover {
  background: var(--bg);
}

.filter-dropdown .filter-option .check {
  color: var(--primary);
  font-size: 14px;
  opacity: 0;
}

.filter-dropdown .filter-option.selected .check {
  opacity: 1;
}

.clear-filter {
  font-size: 12px;
  color: var(--primary);
  cursor: pointer;
  margin-left: auto;
  padding: 4px 8px;
}

.clear-filter:hover {
  text-decoration: underline;
}

/* 表格 */
.table-wrapper {
  overflow-x: auto;
}

.sheet-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.sheet-table th,
.sheet-table td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  white-space: nowrap;
}

.sheet-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.sheet-table th {
  background: var(--header-bg);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 12px;
  border-bottom: 1px solid var(--border);
  user-select: none;
}

.sheet-table th:hover {
  background: #eef0f3;
}

.sheet-table .row-num {
  width: 46px;
  min-width: 46px;
  text-align: center;
  color: var(--text-light);
  font-size: 12px;
  background: var(--header-bg);
  border-right: 1px solid var(--border-light);
  font-variant-numeric: tabular-nums;
}

.sheet-table tbody tr {
  transition: background 0.1s;
}

.sheet-table tbody tr:hover {
  background: var(--row-hover);
}

.sheet-table tbody tr:nth-child(even) {
  background: #fafbfc;
}

.sheet-table tbody tr:nth-child(even):hover {
  background: var(--row-hover);
}

/* 产品徽章 */
.product-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #f0f1f3;
  color: var(--text-secondary);
}

.product-badge.cvm {
  background: #e8eeff;
  color: #3370ff;
}

.product-badge.cbs {
  background: #e8f7ef;
  color: #16a34a;
}

.product-badge.cos {
  background: #fef8e8;
  color: #d4930b;
}

.product-badge.cdb {
  background: #fef2f2;
  color: #ef4444;
}

/* 涨幅标签 */
.rise-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.rise-high {
  background: var(--red-bg);
  color: var(--red);
}

.rise-mid {
  background: var(--orange-bg);
  color: var(--orange);
}

.rise-low {
  background: var(--yellow-bg);
  color: var(--yellow);
}

.rise-tag .arrow {
  font-size: 11px;
}

/* 联系人链接 */
.contact-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

.contact-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 状态指示点 */
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.up {
  background: var(--red);
}

/* 页脚 */
.sheet-footer {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--text-light);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar .search-box {
    max-width: 100%;
    min-width: 0;
  }
}
</style>
