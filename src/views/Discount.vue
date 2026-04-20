<template>
  <div class="discount-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 报价折扣
      </div>
      <h2>报价折扣</h2>
      <p>五档折扣体系、高价值客户折扣、普通客户折扣策略及审批流程</p>
    </div>

    <!-- 背景说明卡片 -->
    <div class="info-card">
      <div class="info-card-header" @click="toggleCard('info')">
        <h3>
          📋 折扣政策说明
          <span class="info-tag tag-blue">标准体系</span>
          <span class="info-tag tag-green">2026年版</span>
        </h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" v-show="cardStates.info">
        <p style="margin-top: 12px">
          报价折扣政策适用于腾讯云AI产品线，根据客户类型和合作深度提供差异化折扣。折扣审批遵循分级授权原则，确保风险可控。
        </p>
        <div class="info-footer">
          📄 数据来源：销售政策手册 · 本页面持续更新
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
          <span class="tab-count">{{ getDataCount(tab.key) }}</span>
        </div>
      </div>

      <!-- Tab1: 五档折扣 -->
      <div class="sheet-panel" :class="{ active: activeTab === 'five-level' }">
        <DataTable
          :data="filteredDiscountData"
          :columns="discountColumns"
          :loading="loading"
          show-search
          search-placeholder="搜索客户类型、折扣范围..."
          show-filter
          :filter-options="categoryFilterOptions"
          @search="handleSearch"
          @filter-change="handleFilterChange"
        >
          <template #toolbar-right>
            <span class="toolbar-hint">共 {{ getDataCount('five-level') }} 条记录</span>
          </template>
        </DataTable>
      </div>

      <!-- Tab2: 高价值客户 -->
      <div class="sheet-panel" :class="{ active: activeTab === 'high-value' }">
        <DataTable
          :data="discountData.filter(d => d.category === '高价值客户')"
          :columns="discountColumns"
          :loading="loading"
          show-search
          search-placeholder="搜索客户名称、折扣..."
          @search="handleSearch"
        >
          <template #toolbar-right>
            <span class="toolbar-hint">共 {{ getDataCount('high-value') }} 条记录</span>
            <span class="toolbar-subhint">需特殊审批流程</span>
          </template>
        </DataTable>
      </div>

      <!-- Tab3: 普通客户 -->
      <div class="sheet-panel" :class="{ active: activeTab === 'normal' }">
        <DataTable
          :data="discountData.filter(d => d.category === '普通客户')"
          :columns="discountColumns"
          :loading="loading"
          show-search
          search-placeholder="搜索客户类型、折扣..."
          @search="handleSearch"
        >
          <template #toolbar-right>
            <span class="toolbar-hint">共 {{ getDataCount('normal') }} 条记录</span>
            <span class="toolbar-subhint">标准折扣体系</span>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- 更新时间 -->
    <div class="page-footer">
      📅 最后更新：{{ lastUpdate }} | 数据来源：销售政策手册 · 2026年版
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/common/DataTable.vue'
import { discountData, discountCategories } from '@/data/discountData'

const router = useRouter()

const lastUpdate = ref('2026-04-17')

// 卡片状态
const cardStates = ref({
  info: true
})

const toggleCard = (key: string) => {
  cardStates.value[key] = !cardStates.value[key]
}

// Tab状态
const activeTab = ref('five-level')
const tabs = [
  { key: 'five-level', label: '五档折扣' },
  { key: 'high-value', label: '高价值客户' },
  { key: 'normal', label: '普通客户' }
]

// 加载状态
const loading = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const selectedCategory = ref('all')

// 分类筛选选项
const categoryFilterOptions = [
  { key: 'all', label: '全部类型', value: 'all' },
  { key: '五档', label: '五档折扣', value: '五档' },
  { key: '高价值客户', label: '高价值客户', value: '高价值客户' },
  { key: '普通客户', label: '普通客户', value: '普通客户' }
]

// 列配置
const discountColumns = [
  { key: 'id', label: '#' },
  { key: 'category', label: '折扣类型' },
  { key: 'customerLevel', label: '客户等级' },
  { key: 'discountRange', label: '折扣范围' },
  { key: 'conditions', label: '适用条件' },
  { key: 'approvalFlow', label: '审批流程' },
  { key: 'notes', label: '备注' }
]

// 计算属性
const filteredDiscountData = computed(() => {
  let data = [...discountData]
  
  // 筛选
  if (selectedCategory.value !== 'all') {
    data = data.filter(item => item.category === selectedCategory.value)
  }
  
  // 搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter(item =>
      item.customerLevel.toLowerCase().includes(keyword) ||
      item.discountRange.toLowerCase().includes(keyword)
    )
  }
  
  return data
})

const getDataCount = (tabKey: string) => {
  switch (tabKey) {
    case 'five-level':
      return discountData.filter(d => d.category === '五档').length
    case 'high-value':
      return discountData.filter(d => d.category === '高价值客户').length
    case 'normal':
      return discountData.filter(d => d.category === '普通客户').length
    default:
      return 0
  }
}

// 方法
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
}

const handleFilterChange = (filters: any[]) => {
  selectedCategory.value = filters[0] || 'all'
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

.info-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 20px;
}

.info-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
}

.info-card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.tag-blue {
  background: var(--primary-light);
  color: var(--primary);
}

.tag-green {
  background: #dcfce7;
  color: #16a34a;
}

.toggle-icon {
  font-size: 12px;
  color: var(--text-light);
}

.info-card-header:hover .toggle-icon {
  color: var(--text-secondary);
}

.info-card-body {
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
}

.info-footer {
  margin-top: 12px;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-light);
}

.sheet-container {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.sheet-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg);
}

.sheet-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.sheet-tab:hover {
  color: var(--text);
}

.sheet-tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}

.sheet-tab .tab-count {
  margin-left: 8px;
  font-size: 12px;
  padding: 2px 6px;
  background: var(--bg-white);
  color: var(--text-light);
  border-radius: 10px;
}

.sheet-panel {
  display: none;
  padding: 20px;
}

.sheet-panel.active {
  display: block;
}

.toolbar-hint {
  font-size: 13px;
  color: var(--text-secondary);
}

.toolbar-subhint {
  font-size: 12px;
  color: var(--text-light);
  margin-left: 12px;
}

.page-footer {
  margin-top: 24px;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-light);
  text-align: center;
}

@media (max-width: 768px) {
  .sheet-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .sheet-tab {
    flex-shrink: 0;
    white-space: nowrap;
  }
}
</style>
