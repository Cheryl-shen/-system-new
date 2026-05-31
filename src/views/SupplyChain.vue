<template>
  <div class="supply-chain-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 供应链情报
      </div>
      <h2>供应链情报</h2>
      <p>AI 算力产业链全景追踪 · 芯片/存储/网络/基础设施 · 数据范围 2026.05.10 - 2026.05.31</p>
    </div>

    <!-- 产业链可视化 -->
    <div class="chain-visualization">
      <div class="chain-header">
        <span class="chain-icon">🔗</span>
        <h3>AI 算力产业链全景</h3>
        <span class="chain-tip">点击任意环节查看详情</span>
      </div>
      <div class="chain-container">
        <div
          v-for="(node, index) in supplyChainNodes"
          :key="node.id"
          class="chain-node"
          :class="{ active: activeNode === node.id }"
          @click="selectNode(node.id)"
        >
          <div class="node-icon" :style="{ background: getRiskBg(node.riskLevel) }">
            {{ node.icon }}
          </div>
          <div class="node-info">
            <div class="node-name">{{ node.name }}</div>
            <div class="node-rate">
              <span class="rate-label">国产化率</span>
              <div class="rate-bar">
                <div class="rate-fill" :style="{ width: node.localizationRate + '%', background: getRateColor(node.localizationRate) }"></div>
              </div>
              <span class="rate-value">{{ node.localizationRate }}%</span>
            </div>
            <div class="node-risk" :style="{ color: riskLevelConfig[node.riskLevel].color }">
              {{ riskLevelConfig[node.riskLevel].label }}
            </div>
            <div class="node-price-row">
              <div class="node-price-item">
                <span>涨幅</span>
                <strong :class="getChangeClass(node.pastYearChange)">{{ node.pastYearChange }}</strong>
              </div>
              <div class="node-price-item">
                <span>预测</span>
                <strong :class="'predict-' + node.predictTrend">
                  {{ node.futurePredict }}{{ node.predictTrend === 'up' ? ' ↑' : node.predictTrend === 'down' ? ' ↓' : ' →' }}
                </strong>
              </div>
            </div>
            <div class="node-factor" :title="node.keyFactor">影响：{{ node.keyFactor }}</div>
          </div>
          <div v-if="index < supplyChainNodes.length - 1" class="chain-arrow">→</div>
        </div>
      </div>
      <!-- 选中节点详情 -->
      <div v-if="selectedNode" class="node-detail">
        <div class="detail-header">
          <span class="detail-icon">{{ selectedNode.icon }}</span>
          <div class="detail-title">
            <h4>{{ selectedNode.name }}</h4>
            <p>{{ selectedNode.description }}</p>
          </div>
          <span class="detail-close" @click="activeNode = null">✕</span>
        </div>
        <div class="detail-body">
          <div class="detail-stat">
            <div class="stat-label">国产化率</div>
            <div class="stat-value" :style="{ color: getRateColor(selectedNode.localizationRate) }">
              {{ selectedNode.localizationRate }}%
            </div>
          </div>
          <div class="detail-stat">
            <div class="stat-label">风险等级</div>
            <div class="stat-value" :style="{ color: riskLevelConfig[selectedNode.riskLevel].color }">
              {{ riskLevelConfig[selectedNode.riskLevel].label }}
            </div>
          </div>
          <div class="detail-stat">
            <div class="stat-label">过去一年涨幅</div>
            <div class="stat-value" :class="getChangeClass(selectedNode.pastYearChange)">
              {{ selectedNode.pastYearChange }}
            </div>
          </div>
          <div class="detail-stat">
            <div class="stat-label">未来6月预测</div>
            <div class="stat-value" :class="'predict-' + selectedNode.predictTrend">
              {{ selectedNode.futurePredict }}
            </div>
          </div>
          <div class="detail-factor">
            <div class="players-label">影响因素</div>
            <div class="detail-factor-text">{{ selectedNode.keyFactor }}</div>
          </div>
          <div class="detail-players">
            <div class="players-label">核心玩家</div>
            <div class="players-list">
              <span v-for="(player, i) in selectedNode.keyPlayers" :key="i" class="player-tag">{{ player }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 行业总评 -->
    <div class="industry-summary">
      <div class="summary-header">
        <span class="summary-icon">📊</span>
        <h3>行业总评</h3>
        <span class="summary-date">更新于 {{ industrySummary.updateDate }}</span>
      </div>
      <p class="summary-text">{{ industrySummary.summary }}</p>
      <div class="summary-highlights">
        <div
          v-for="(item, index) in industrySummary.highlights"
          :key="index"
          class="highlight-card"
          :class="'trend-' + item.trend"
        >
          <span class="hl-icon">{{ item.icon }}</span>
          <div class="hl-content">
            <div class="hl-title">{{ item.title }}</div>
            <div class="hl-desc">{{ item.content }}</div>
          </div>
          <span class="hl-trend">
            {{ item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 分页 Tab -->
    <div class="main-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="main-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="mt-icon" :style="{ background: tab.gradient }">{{ tab.icon }}</span>
        <div>
          <div class="mt-title">{{ tab.name }}</div>
          <div class="mt-sub">{{ tab.count }} 条动态</div>
        </div>
      </div>
    </div>

    <!-- 芯片前线 -->
    <div v-if="activeTab === 'chip'" class="content-section">
      <div class="filter-bar">
        <div class="filter-group">
          <label>芯片类型：</label>
          <div class="filter-btns">
            <button
              v-for="type in chipTypes"
              :key="type"
              class="filter-btn"
              :class="{ active: chipTypeFilter === type }"
              @click="chipTypeFilter = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div class="news-list">
        <div v-for="item in filteredChipNews" :key="item.id" class="news-card">
          <div class="news-top">
            <span
              class="type-tag"
              :style="{
                background: chipTypeConfig[item.chipType].bg,
                color: chipTypeConfig[item.chipType].color
              }"
            >
              {{ item.chipType }}
            </span>
            <span
              class="imp-tag"
              :style="{
                background: importanceConfig[item.importance].bg,
                color: importanceConfig[item.importance].color
              }"
            >
              {{ importanceConfig[item.importance].icon }} {{ item.importance }}
            </span>
            <span class="vendor-tag">{{ item.vendor }}</span>
            <span class="news-date">{{ item.date }}</span>
          </div>
          <h3 class="news-title">
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-footer">
            <div class="news-tags">
              <span v-for="(t, i) in item.tags" :key="i" class="tag">#{{ t }}</span>
            </div>
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener" class="source-link">{{ item.source }}</a>
            <span v-else class="source-text">{{ item.source }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 存储与内存 -->
    <div v-if="activeTab === 'storage'" class="content-section">
      <div class="filter-bar">
        <div class="filter-group">
          <label>存储类型：</label>
          <div class="filter-btns">
            <button
              v-for="type in storageTypes"
              :key="type"
              class="filter-btn"
              :class="{ active: storageTypeFilter === type }"
              @click="storageTypeFilter = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div class="news-list">
        <div v-for="item in filteredStorageNews" :key="item.id" class="news-card">
          <div class="news-top">
            <span
              class="type-tag"
              :style="{
                background: storageTypeConfig[item.category].bg,
                color: storageTypeConfig[item.category].color
              }"
            >
              {{ item.category }}
            </span>
            <span
              class="imp-tag"
              :style="{
                background: importanceConfig[item.importance].bg,
                color: importanceConfig[item.importance].color
              }"
            >
              {{ importanceConfig[item.importance].icon }} {{ item.importance }}
            </span>
            <span class="vendor-tag">{{ item.vendor }}</span>
            <span
              class="trend-tag"
              :class="'price-' + item.priceTrend"
            >
              {{ item.priceTrend === 'up' ? '📈 涨价' : item.priceTrend === 'down' ? '📉 降价' : '➡️ 平稳' }}
            </span>
            <span class="news-date">{{ item.date }}</span>
          </div>
          <h3 class="news-title">
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-footer">
            <div class="news-tags">
              <span v-for="(t, i) in item.tags" :key="i" class="tag">#{{ t }}</span>
            </div>
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener" class="source-link">{{ item.source }}</a>
            <span v-else class="source-text">{{ item.source }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 网络设备 -->
    <div v-if="activeTab === 'network'" class="content-section">
      <div class="filter-bar">
        <div class="filter-group">
          <label>设备类型：</label>
          <div class="filter-btns">
            <button
              v-for="type in networkTypes"
              :key="type"
              class="filter-btn"
              :class="{ active: networkTypeFilter === type }"
              @click="networkTypeFilter = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div class="news-list">
        <div v-for="item in filteredNetworkNews" :key="item.id" class="news-card">
          <div class="news-top">
            <span
              class="type-tag"
              :style="{
                background: networkTypeConfig[item.category].bg,
                color: networkTypeConfig[item.category].color
              }"
            >
              {{ item.category }}
            </span>
            <span
              class="imp-tag"
              :style="{
                background: importanceConfig[item.importance].bg,
                color: importanceConfig[item.importance].color
              }"
            >
              {{ importanceConfig[item.importance].icon }} {{ item.importance }}
            </span>
            <span class="vendor-tag">{{ item.vendor }}</span>
            <span class="local-tag">国产化 {{ item.localizationRate }}%</span>
            <span class="news-date">{{ item.date }}</span>
          </div>
          <h3 class="news-title">
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-footer">
            <div class="news-tags">
              <span v-for="(t, i) in item.tags" :key="i" class="tag">#{{ t }}</span>
            </div>
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener" class="source-link">{{ item.source }}</a>
            <span v-else class="source-text">{{ item.source }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 基础设施 -->
    <div v-if="activeTab === 'infra'" class="content-section">
      <div class="filter-bar">
        <div class="filter-group">
          <label>类别：</label>
          <div class="filter-btns">
            <button
              v-for="type in infraTypes"
              :key="type"
              class="filter-btn"
              :class="{ active: infraTypeFilter === type }"
              @click="infraTypeFilter = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div class="news-list">
        <div v-for="item in filteredInfraNews" :key="item.id" class="news-card">
          <div class="news-top">
            <span
              class="type-tag"
              :style="{
                background: infraTypeConfig[item.category].bg,
                color: infraTypeConfig[item.category].color
              }"
            >
              {{ item.category }}
            </span>
            <span
              class="imp-tag"
              :style="{
                background: importanceConfig[item.importance].bg,
                color: importanceConfig[item.importance].color
              }"
            >
              {{ importanceConfig[item.importance].icon }} {{ item.importance }}
            </span>
            <span class="region-tag">📍 {{ item.region }}</span>
            <span class="news-date">{{ item.date }}</span>
          </div>
          <h3 class="news-title">
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-footer">
            <div class="news-tags">
              <span v-for="(t, i) in item.tags" :key="i" class="tag">#{{ t }}</span>
            </div>
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener" class="source-link">{{ item.source }}</a>
            <span v-else class="source-text">{{ item.source }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 风险预警 -->
    <div v-if="activeTab === 'alert'" class="content-section">
      <div class="alert-stats">
        <div class="alert-stat critical">
          <div class="as-num">{{ alertStats.critical }}</div>
          <div class="as-label">🚨 紧急</div>
        </div>
        <div class="alert-stat high">
          <div class="as-num">{{ alertStats.high }}</div>
          <div class="as-label">⚠️ 高危</div>
        </div>
        <div class="alert-stat medium">
          <div class="as-num">{{ alertStats.medium }}</div>
          <div class="as-label">📌 关注</div>
        </div>
      </div>

      <div class="alert-list">
        <div
          v-for="item in supplyChainAlerts"
          :key="item.id"
          class="alert-card"
          :class="'severity-' + item.severity"
        >
          <div class="alert-side" :style="{ background: severityConfig[item.severity].color }"></div>
          <div class="alert-body">
            <div class="alert-top">
              <span
                class="severity-badge"
                :style="{
                  background: severityConfig[item.severity].bg,
                  color: severityConfig[item.severity].color
                }"
              >
                {{ severityConfig[item.severity].label }}
              </span>
              <span
                class="risk-type-badge"
                :style="{
                  background: riskTypeConfig[item.riskType].bg,
                  color: riskTypeConfig[item.riskType].color
                }"
              >
                {{ riskTypeConfig[item.riskType].icon }} {{ item.riskType }}
              </span>
              <span class="alert-date">{{ item.date }}</span>
            </div>
            <h3 class="alert-title">{{ item.title }}</h3>
            <p class="alert-summary">{{ item.summary }}</p>
            
            <div class="alert-meta">
              <div class="meta-row">
                <span class="meta-label">💥 影响层级：</span>
                <div class="layer-tags">
                  <span v-for="(layer, i) in item.affectedLayer" :key="i" class="layer-tag">
                    {{ getLayerName(layer) }}
                  </span>
                </div>
              </div>
              <div class="meta-row">
                <span class="meta-label">☁️ 云厂商影响：</span>
                <span class="meta-value">{{ item.impactOnCloud }}</span>
              </div>
              <div class="meta-row recommend">
                <span class="meta-label">💡 建议行动：</span>
                <span class="meta-value">{{ item.recommendation }}</span>
              </div>
            </div>

            <div class="alert-footer">
              <div class="alert-tags">
                <span v-for="(t, i) in item.tags" :key="i" class="tag">#{{ t }}</span>
              </div>
              <span class="alert-source">{{ item.source }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="page-footer">
      📅 最后更新：2026-05-31 <span class="update-badge">每周更新</span> | 
      统计周期：2026-05-10 ~ 2026-05-31 | 
      数据来源：权威媒体 + 各芯片厂商/云厂商官方公告
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  supplyChainNodes,
  industrySummary,
  chipNews,
  storageNews,
  networkNews,
  infraNews,
  supplyChainAlerts,
  chipTypeConfig,
  storageTypeConfig,
  networkTypeConfig,
  infraTypeConfig,
  riskTypeConfig,
  severityConfig,
  riskLevelConfig,
  importanceConfig
} from '@/data/supplyChainData'

const router = useRouter()

// 产业链节点交互
const activeNode = ref<string | null>(null)

const selectedNode = computed(() => {
  if (!activeNode.value) return null
  return supplyChainNodes.find(n => n.id === activeNode.value)
})

function selectNode(id: string) {
  activeNode.value = activeNode.value === id ? null : id
}

function getRiskBg(level: string): string {
  const config: Record<string, string> = {
    critical: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    high: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    medium: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    low: 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
  }
  return config[level] || config.medium
}

function getRateColor(rate: number): string {
  if (rate >= 80) return '#16a34a'
  if (rate >= 50) return '#2563eb'
  if (rate >= 30) return '#f59e0b'
  return '#dc2626'
}

function getLayerName(id: string): string {
  const node = supplyChainNodes.find(n => n.id === id)
  return node?.name || id
}

// 获取涨幅样式类
function getChangeClass(change: string): string {
  if (change.includes('风险') || change.includes('紧')) return 'change-high'
  if (change.includes('+')) {
    const num = parseInt(change.replace(/[^0-9]/g, ''))
    if (num >= 50) return 'change-critical'
    if (num >= 30) return 'change-high'
    if (num >= 15) return 'change-medium'
    return 'change-low'
  }
  if (change.includes('-')) return 'change-down'
  return 'change-stable'
}

// Tab 切换
const activeTab = ref<string>('chip')

const tabs = [
  { id: 'chip', name: '芯片前线', icon: '🔲', count: chipNews.length, gradient: 'linear-gradient(135deg, #dc2626, #f97316)' },
  { id: 'storage', name: '存储与内存', icon: '💾', count: storageNews.length, gradient: 'linear-gradient(135deg, #2563eb, #6366f1)' },
  { id: 'network', name: '网络设备', icon: '🌐', count: networkNews.length, gradient: 'linear-gradient(135deg, #16a34a, #22c55e)' },
  { id: 'infra', name: '基础设施', icon: '🏢', count: infraNews.length, gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
  { id: 'alert', name: '风险预警', icon: '⚠️', count: supplyChainAlerts.length, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' }
]

// 芯片筛选
const chipTypes = ['全部', 'GPU', 'NPU', 'CPU', 'TPU', '综合']
const chipTypeFilter = ref('全部')

const filteredChipNews = computed(() => {
  if (chipTypeFilter.value === '全部') return chipNews
  return chipNews.filter(n => n.chipType === chipTypeFilter.value)
})

// 存储筛选
const storageTypes = ['全部', 'HBM', 'NAND', 'DRAM', 'SSD']
const storageTypeFilter = ref('全部')

const filteredStorageNews = computed(() => {
  if (storageTypeFilter.value === '全部') return storageNews
  return storageNews.filter(n => n.category === storageTypeFilter.value)
})

// 网络设备筛选
const networkTypes = ['全部', '光模块', '交换机', 'DPU', '路由器']
const networkTypeFilter = ref('全部')

const filteredNetworkNews = computed(() => {
  if (networkTypeFilter.value === '全部') return networkNews
  return networkNews.filter(n => n.category === networkTypeFilter.value)
})

// 基础设施筛选
const infraTypes = ['全部', '液冷', 'PUE政策', '数据中心', '电力']
const infraTypeFilter = ref('全部')

const filteredInfraNews = computed(() => {
  if (infraTypeFilter.value === '全部') return infraNews
  return infraNews.filter(n => n.category === infraTypeFilter.value)
})

// 风险预警统计
const alertStats = computed(() => ({
  critical: supplyChainAlerts.filter(a => a.severity === 'critical').length,
  high: supplyChainAlerts.filter(a => a.severity === 'high').length,
  medium: supplyChainAlerts.filter(a => a.severity === 'medium').length
}))
</script>

<style scoped>
.supply-chain-page {
  padding: 0;
}

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

/* 产业链可视化 */
.chain-visualization {
  background: linear-gradient(135deg, #f8fafc, #fff);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.chain-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.chain-icon {
  font-size: 22px;
}

.chain-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.chain-tip {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-light);
}

.chain-container {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 2px 12px;
  scroll-snap-type: x proximity;
}

.chain-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-white);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 12px 10px;
  width: 168px;
  min-width: 168px;
  flex: 0 0 168px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  scroll-snap-align: start;
}

.chain-node:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.chain-node.active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.node-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 8px;
}

.node-info {
  text-align: center;
  width: 100%;
}

.node-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-rate {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  margin-bottom: 6px;
}

.rate-label {
  color: var(--text-light);
  white-space: nowrap;
}

.rate-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.rate-value {
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.node-risk {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
}

.node-price-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  width: 100%;
  margin-bottom: 6px;
}

.node-price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background: #f8fafc;
  border-radius: 7px;
  padding: 5px 7px;
  text-align: left;
}

.node-price-item span {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  line-height: 1;
  flex-shrink: 0;
}

.node-price-item strong {
  display: block;
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.node-factor {
  width: 100%;
  font-size: 10px;
  color: #64748b;
  line-height: 1.45;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 5px 6px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.change-critical,
.change-high,
.predict-up {
  color: #dc2626;
}

.change-medium {
  color: #ea580c;
}

.change-low,
.change-down,
.predict-down {
  color: #16a34a;
}

.change-stable,
.predict-stable {
  color: #64748b;
}

.chain-arrow {
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #cbd5e1;
  z-index: 1;
  pointer-events: none;
}

/* 节点详情 */
.node-detail {
  margin-top: 16px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-light);
}

.detail-icon {
  font-size: 32px;
}

.detail-title h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.detail-title p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.detail-close {
  margin-left: auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.detail-body {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.detail-stat {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
}

.detail-players,
.detail-factor {
  flex: 1;
  min-width: 200px;
}

.detail-factor-text {
  font-size: 12px;
  line-height: 1.6;
  color: #dc2626;
  font-weight: 500;
  background: #fff7ed;
  border-radius: 6px;
  padding: 6px 10px;
}

.players-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 6px;
}

.players-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.player-tag {
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 成本趋势面板 */
.cost-trend-panel {
  background: #f8fafc;
  border: 0;
  border-top: 1px solid var(--border-light);
  border-radius: 0 0 10px 10px;
  padding: 16px 0 0;
  margin-top: 16px;
  margin-bottom: 0;
  box-shadow: none;
}

.trend-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.trend-icon {
  font-size: 20px;
}

.trend-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.trend-subtitle {
  margin-left: auto;
  font-size: 11px;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 9px;
  border-radius: 999px;
  font-weight: 500;
}

.trend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(236px, 1fr));
  gap: 10px;
}

.trend-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 11px 12px 10px;
  position: relative;
  transition: all 0.18s;
  overflow: hidden;
}

.trend-card:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.trend-card.trend-up {
  border-left: 3px solid #ef4444;
}

.trend-card.trend-down {
  border-left: 3px solid #22c55e;
}

.trend-card.trend-stable {
  border-left: 3px solid #64748b;
}

.trend-card-header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 9px;
  padding-right: 58px;
}

.trend-card-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trend-card-title {
  flex: 1;
  min-width: 0;
}

.trend-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trend-category {
  font-size: 10px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 7px;
  border-radius: 999px;
  display: inline-block;
}

.trend-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 8px;
}

.trend-stat {
  text-align: center;
  min-width: 74px;
}

.trend-stat-label {
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.trend-stat-value {
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  white-space: nowrap;
}

.trend-stat-value.change-critical {
  color: #991b1b;
}

.trend-stat-value.change-high {
  color: #dc2626;
}

.trend-stat-value.change-medium {
  color: #ea580c;
}

.trend-stat-value.change-low {
  color: #16a34a;
}

.trend-stat-value.change-down {
  color: #16a34a;
}

.trend-stat-value.change-stable {
  color: #64748b;
}

.trend-stat-value.predict-up {
  color: #dc2626;
}

.trend-stat-value.predict-down {
  color: #16a34a;
}

.trend-stat-value.predict-stable {
  color: #64748b;
}

.predict-icon {
  font-size: 12px;
}

.trend-arrow {
  font-size: 15px;
  color: #cbd5e1;
  font-weight: 700;
  margin: 0 4px;
}

.trend-card-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 10.5px;
}

.trend-factor,
.trend-local {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
}

.factor-label,
.local-label {
  color: #94a3b8;
  flex-shrink: 0;
}

.factor-value,
.local-value {
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.factor-value {
  color: #dc2626;
}

.local-value {
  color: #16a34a;
}

.confidence-badge {
  position: absolute;
  top: 9px;
  right: 9px;
  font-size: 10px;
  line-height: 1;
  padding: 4px 7px;
  border-radius: 999px;
  font-weight: 600;
}

.confidence-badge.confidence-high {
  background: #ecfdf5;
  color: #15803d;
}

.confidence-badge.confidence-medium {
  background: #fffbeb;
  color: #b45309;
}

.confidence-badge.confidence-low {
  background: #fef2f2;
  color: #b91c1c;
}

/* 行业总评 */
.industry-summary {
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.summary-icon {
  font-size: 20px;
}

.summary-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.summary-date {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-light);
}

.summary-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 16px;
}

.summary-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.highlight-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}

.highlight-card.trend-up {
  border-left: 3px solid #16a34a;
}

.highlight-card.trend-down {
  border-left: 3px solid #dc2626;
}

.highlight-card.trend-stable {
  border-left: 3px solid #6b7280;
}

.hl-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.hl-content {
  flex: 1;
  min-width: 0;
}

.hl-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
}

.hl-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.hl-trend {
  font-size: 18px;
  font-weight: 700;
}

.highlight-card.trend-up .hl-trend {
  color: #16a34a;
}

.highlight-card.trend-down .hl-trend {
  color: #dc2626;
}

.highlight-card.trend-stable .hl-trend {
  color: #6b7280;
}

/* Tab 切换 */
.main-tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.main-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-white);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.main-tab:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.main-tab.active {
  border-color: var(--primary);
  background: linear-gradient(135deg, #eef2ff, #f5f7ff);
  box-shadow: var(--shadow-md);
}

.mt-icon {
  width: 42px;
  height: 42px;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.mt-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.mt-sub {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

/* 筛选栏 */
.filter-bar {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  margin-bottom: 14px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 70px;
}

.filter-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 5px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
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

/* 新闻列表 */
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 14px;
}

.news-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 18px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.news-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.type-tag,
.imp-tag,
.vendor-tag,
.trend-tag,
.local-tag,
.region-tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.vendor-tag {
  background: #f3f4f6;
  color: #4b5563;
}

.trend-tag.price-up {
  background: #fee2e2;
  color: #dc2626;
}

.trend-tag.price-down {
  background: #dcfce7;
  color: #16a34a;
}

.trend-tag.price-stable {
  background: #f3f4f6;
  color: #6b7280;
}

.local-tag {
  background: #e0f2fe;
  color: #0369a1;
}

.region-tag {
  background: #f3e8ff;
  color: #7c3aed;
}

.news-date {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-light);
}

.news-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text);
  margin: 0 0 10px 0;
}

.news-title a {
  color: inherit;
  text-decoration: none;
}

.news-title a:hover {
  color: var(--primary);
}

.news-summary {
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  flex: 1;
}

.news-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  font-size: 11px;
  color: var(--primary);
  background: var(--primary-light);
  padding: 1px 6px;
  border-radius: 4px;
}

.source-text {
  font-size: 11px;
  color: var(--text-light);
  white-space: nowrap;
}

.source-link {
  font-size: 11px;
  color: var(--primary);
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s;
}

.source-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

/* 风险预警 */
.alert-stats {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
}

.alert-stat {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 24px;
  text-align: center;
  flex: 1;
}

.alert-stat.critical {
  border-left: 4px solid #dc2626;
  background: linear-gradient(135deg, #fef2f2, #fff);
}

.alert-stat.high {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fff);
}

.alert-stat.medium {
  border-left: 4px solid #2563eb;
  background: linear-gradient(135deg, #eff6ff, #fff);
}

.as-num {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.alert-stat.critical .as-num { color: #dc2626; }
.alert-stat.high .as-num { color: #f59e0b; }
.alert-stat.medium .as-num { color: #2563eb; }

.as-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.alert-card {
  display: flex;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s;
}

.alert-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(3px);
}

.alert-card.severity-critical {
  border-color: #fca5a5;
}

.alert-card.severity-high {
  border-color: #fed7aa;
}

.alert-side {
  width: 5px;
  flex-shrink: 0;
}

.alert-body {
  flex: 1;
  padding: 16px 20px;
}

.alert-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.severity-badge,
.risk-type-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.alert-date {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-light);
}

.alert-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px;
  line-height: 1.5;
}

.alert-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 14px;
}

.alert-meta {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  margin-bottom: 8px;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-row.recommend {
  background: #ecfdf5;
  margin: 8px -14px -12px;
  padding: 10px 14px;
  border-radius: 0 0 8px 8px;
}

.meta-label {
  color: var(--text-secondary);
  flex-shrink: 0;
  font-weight: 500;
}

.meta-value {
  color: var(--text);
  line-height: 1.6;
}

.meta-row.recommend .meta-value {
  color: #059669;
  font-weight: 500;
}

.layer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.layer-tag {
  background: #e0e7ff;
  color: #4338ca;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.alert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.alert-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.alert-source {
  font-size: 11px;
  color: var(--text-light);
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

.update-badge {
  display: inline-block;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 4px;
  vertical-align: middle;
}

@media (max-width: 1200px) {
  .main-tabs {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .main-tabs {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chain-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chain-node {
    flex-direction: row;
    gap: 12px;
  }
  
  .chain-arrow {
    display: none;
  }
  
  .node-info {
    text-align: left;
    flex: 1;
  }
}

@media (max-width: 600px) {
  .main-tabs {
    grid-template-columns: 1fr;
  }
  
  .news-list {
    grid-template-columns: 1fr;
  }
  
  .alert-stats {
    flex-direction: column;
  }
  
  .summary-highlights {
    grid-template-columns: 1fr;
  }
}
</style>
