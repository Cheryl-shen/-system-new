<template>
  <div class="data-table-wrapper">
    <!-- 工具栏 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <div v-if="showSearch" class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="localSearch"
            type="text"
            :placeholder="searchPlaceholder"
            @keyup.enter="handleSearch"
          />
          <button v-if="localSearch" class="clear-btn" @click="clearSearch">×</button>
        </div>
        <slot name="toolbar-left" />
      </div>
      <div class="toolbar-right">
        <div v-if="showFilter" class="filter-wrapper">
          <button
            class="filter-btn"
            :class="{ active: filterOpen }"
            @click="toggleFilter"
          >
            📦 筛选
            <span class="filter-icon">▼</span>
          </button>
          <div class="filter-dropdown" :class="{ show: filterOpen }">
            <div v-for="option in filterOptions" :key="option.key" class="filter-option">
              <label>
                <input
                  type="checkbox"
                  v-model="selectedFilters"
                  :value="option.value"
                  @change="handleFilterChange"
                />
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>
        <slot name="toolbar-right" />
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-if="showIndex">#</th>
            <th v-for="col in visibleColumns" :key="col.key" :class="col.class">
              {{ col.label }}
              <span v-if="col.sortable" class="sort-icon" @click="handleSort(col.key)">
                <span class="sort-up">▲</span>
                <span class="sort-down">▼</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in sortedData" :key="getRowKey(row, index)">
            <td v-if="showIndex" class="index-cell">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td v-for="col in visibleColumns" :key="col.key" :class="col.class">
              <template v-if="col.render">
                <span v-html="renderCell(col, row)"></span>
              </template>
              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && data.length === 0" class="table-empty">
        <EmptyState :title="emptyTitle" :description="emptyDescription" />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="table-loading">
      <Loading text="加载中..." />
    </div>

    <!-- 分页 -->
    <div v-if="filteredTotal > pageSize" class="table-footer">
      <span class="total-text">共 {{ filteredTotal }} 条记录</span>
      <div class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="page-btn"
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
        <select v-if="showPageSize" class="page-size-select" v-model="localPageSize" @change="handlePageSizeChange">
          <option :value="10">10 条/页</option>
          <option :value="20">20 条/页</option>
          <option :value="50">50 条/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Loading from './Loading.vue'
import EmptyState from './EmptyState.vue'

const props = withDefaults(defineProps<{
  data: any[]
  columns: Array<{
    key: string
    label: string
    class?: string
    sortable?: boolean
    render?: any
  }>
  loading?: boolean
  showIndex?: boolean
  showSearch?: boolean
  showFilter?: boolean
  showPageSize?: boolean
  searchPlaceholder?: string
  filterOptions?: Array<{
    key: string
    label: string
    value: any
  }>
  emptyTitle?: string
  emptyDescription?: string
  pageSize?: number
  defaultPageSize?: number
}>(), {
  loading: false,
  showIndex: false,
  showSearch: false,
  showFilter: false,
  showPageSize: false,
  searchPlaceholder: '搜索...',
  emptyTitle: '暂无数据',
  emptyDescription: '当有新数据时会在此显示',
  pageSize: 10,
  defaultPageSize: 10
})

const emit = defineEmits<{
  (e: 'update:pageSize', value: number): void
  (e: 'page-change', page: number): void
  (e: 'sort-change', key: string, order: 'asc' | 'desc' | null): void
  (e: 'filter-change', filters: any[]): void
  (e: 'search', keyword: string): void
}>()

const localSearch = ref('')
const filterOpen = ref(false)
const selectedFilters = ref<any[]>([])
const currentPage = ref(1)
const localPageSize = ref(props.defaultPageSize)
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden)
})

const filteredTotal = computed(() => {
  // 基于搜索过滤后的数据总数
  if (!localSearch.value) return props.data.length
  const keyword = localSearch.value.toLowerCase()
  return props.data.filter(row => {
    return props.columns.some(col => {
      const value = row[col.key]
      return String(value).toLowerCase().includes(keyword)
    })
  }).length
})

const totalPages = computed(() => {
  return Math.ceil(filteredTotal.value / localPageSize.value)
})

const sortedData = computed(() => {
  let data = [...props.data]
  
  // 搜索过滤
  if (localSearch.value) {
    const keyword = localSearch.value.toLowerCase()
    data = data.filter(row => {
      return props.columns.some(col => {
        const value = row[col.key]
        return String(value).toLowerCase().includes(keyword)
      })
    })
  }
  
  // 排序
  if (sortKey.value) {
    data.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  // 分页
  const start = (currentPage.value - 1) * localPageSize.value
  const end = start + localPageSize.value
  return data.slice(start, end)
})

const toggleFilter = () => {
  filterOpen.value = !filterOpen.value
}

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : null
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort-change', sortKey.value || key, sortOrder.value)
}

const handleFilterChange = () => {
  emit('filter-change', [...selectedFilters.value])
}

const handleSearch = () => {
  emit('search', localSearch.value)
}

const clearSearch = () => {
  localSearch.value = ''
  emit('search', '')
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('page-change', page)
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  emit('update:pageSize', localPageSize.value)
}

const getRowKey = (row: any, index: number) => {
  return row.id || row._id || `row-${index}`
}

const renderCell = (col: any, row: any) => {
  if (typeof col.render === 'function') {
    return col.render(row[col.key], row)
  }
  return row[col.key]
}

watch(() => props.pageSize, (val) => {
  localPageSize.value = val
})
</script>

<style scoped>
.data-table-wrapper {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 12px;
  min-width: 200px;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.search-box .search-icon {
  font-size: 14px;
  margin-right: 8px;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-wrapper {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
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
}

.filter-icon {
  font-size: 10px;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow-md);
  min-width: 150px;
  z-index: 100;
  display: none;
}

.filter-dropdown.show {
  display: block;
}

.filter-option {
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.filter-option:hover {
  background: var(--bg);
}

.filter-option label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.filter-option input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

.table-container {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

.data-table th {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg);
  white-space: nowrap;
}

.data-table td {
  font-size: 14px;
  color: var(--text);
}

.data-table tr:hover td {
  background: var(--bg-light);
}

.sort-icon {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;
  color: var(--text-light);
}

.sort-icon:hover {
  color: var(--primary);
}

.sort-up,
.sort-down {
  font-size: 8px;
  line-height: 1;
}

.index-cell {
  color: var(--text-light);
  font-weight: 500;
}

.table-empty {
  padding: 60px;
  display: flex;
  justify-content: center;
}

.table-loading {
  padding: 60px;
  display: flex;
  justify-content: center;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
  font-size: 13px;
  color: var(--text-secondary);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 8px 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--text);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: var(--text-light);
  min-width: 60px;
  text-align: center;
}

.page-size-select {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  background: var(--bg);
  cursor: pointer;
}
</style>
