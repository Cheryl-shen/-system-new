<template>
  <div class="strategy-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 客户战略分析
      </div>
      <h2>客户战略分析</h2>
      <p>重点客户经营情况 · AI 规划 · 出海战略 · 最新财报（定期更新）</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon purple">👥</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">重点客户</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">🔥</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.highPriority }}</span>
          <span class="stat-label">高优先级</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">🌍</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.overseas }}</span>
          <span class="stat-label">有出海规划</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">📄</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.reports }}</span>
          <span class="stat-label">财报文档</span>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-group">
        <label>优先级：</label>
        <div class="filter-btns">
          <button
            class="filter-btn"
            :class="{ active: selectedPriority === '全部' }"
            @click="selectedPriority = '全部'"
          >
            全部
          </button>
          <button
            v-for="(cfg, key) in priorityConfig"
            :key="key"
            class="filter-btn"
            :class="{ active: selectedPriority === key }"
            @click="selectedPriority = key"
          >
            <span class="priority-dot" :style="{ background: cfg.color }"></span>
            {{ key }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <label>行业：</label>
        <div class="filter-btns">
          <button
            v-for="industry in industries"
            :key="industry"
            class="filter-btn"
            :class="{ active: selectedIndustry === industry }"
            @click="selectedIndustry = industry"
          >
            {{ industry }}
          </button>
        </div>
      </div>
    </div>

    <!-- 客户列表 -->
    <div class="customer-list">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="customer-card"
      >
        <!-- 客户头部 -->
        <div class="customer-header">
          <div class="customer-avatar">
            <span>{{ customer.avatar }}</span>
          </div>
          <div class="customer-info">
            <h3>
              {{ customer.name }}
              <span class="stock-tag">{{ customer.stock }}</span>
            </h3>
            <div class="customer-meta">
              <span class="meta-item"><span class="meta-icon">🏭</span>{{ customer.industry }}</span>
              <a class="meta-item meta-link" :href="customer.website" target="_blank" rel="noopener">
                <span class="meta-icon">🔗</span>官网
              </a>
              <span class="meta-item"><span class="meta-icon">📧</span>{{ customer.contact }}</span>
              <span class="meta-item"><span class="meta-icon">🕐</span>更新 {{ customer.lastUpdate }}</span>
            </div>
          </div>
          <span class="customer-priority" :class="customer.priority">
            <span class="dot"></span>
            {{ customer.priority }}优先级
          </span>
        </div>

        <!-- Tab 切换 -->
        <div class="customer-tabs">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            class="customer-tab"
            :class="{ active: getActiveTab(customer.id) === tab.key }"
            @click="setActiveTab(customer.id, tab.key)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>{{ tab.label }}
          </div>
        </div>

        <!-- 内容区 -->
        <div class="customer-content">
          <!-- 经营情况 -->
          <div v-if="getActiveTab(customer.id) === 'business'" class="content-section">
            <p class="section-desc">{{ customer.business.overview }}</p>

            <h4 class="sub-title">📊 核心经营指标</h4>
            <div class="metrics-grid">
              <div v-for="(m, i) in customer.business.keyMetrics" :key="i" class="metric-card">
                <div class="metric-label">{{ m.label }}</div>
                <div class="metric-value">
                  {{ m.value }}
                  <span v-if="m.trend === 'up'" class="trend-up">↑</span>
                  <span v-else-if="m.trend === 'down'" class="trend-down">↓</span>
                  <span v-else-if="m.trend === 'flat'" class="trend-flat">→</span>
                </div>
              </div>
            </div>

            <div class="two-col">
              <div class="col-box green-box">
                <h4 class="sub-title">✨ 业务亮点</h4>
                <ul class="list">
                  <li v-for="(h, i) in customer.business.highlights" :key="i">{{ h }}</li>
                </ul>
              </div>
              <div class="col-box red-box">
                <h4 class="sub-title">⚠️ 主要风险</h4>
                <ul class="list">
                  <li v-for="(r, i) in customer.business.risks" :key="i">{{ r }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- AI 规划 -->
          <div v-if="getActiveTab(customer.id) === 'ai'" class="content-section">
            <div class="highlight-box blue">
              <div class="highlight-label">🎯 AI 战略</div>
              <div class="highlight-text">{{ customer.ai.strategy }}</div>
              <div class="highlight-foot">
                <span class="pill"><strong>2026 AI 投入：</strong>{{ customer.ai.investment }}</span>
                <span class="pill">
                  <strong>当前云厂商：</strong>
                  <span v-for="(v, i) in customer.ai.cloudVendors" :key="i" class="vendor-tag">{{ v }}</span>
                </span>
              </div>
            </div>

            <h4 class="sub-title">🔥 AI 落地场景</h4>
            <div class="scene-list">
              <div v-for="(s, i) in customer.ai.scenes" :key="i" class="scene-item">
                <span class="scene-status" :class="statusClass(s.status)">{{ s.status }}</span>
                <div class="scene-content">
                  <div class="scene-name">{{ s.name }}</div>
                  <div class="scene-desc">{{ s.desc }}</div>
                </div>
              </div>
            </div>

            <div class="opportunity-box">
              <div class="opp-label">💡 腾讯云切入机会</div>
              <div class="opp-text">{{ customer.ai.opportunity }}</div>
            </div>
          </div>

          <!-- 出海规划 -->
          <div v-if="getActiveTab(customer.id) === 'overseas'" class="content-section">
            <div class="highlight-box purple">
              <div class="highlight-label">🚀 出海阶段</div>
              <div class="highlight-text">{{ customer.overseas.status }}</div>
              <div class="highlight-foot">
                <span class="pill">
                  <strong>目标地区：</strong>
                  <span v-for="(r, i) in customer.overseas.regions" :key="i" class="region-tag">{{ r }}</span>
                </span>
              </div>
            </div>

            <h4 class="sub-title">📋 出海策略</h4>
            <p class="section-desc">{{ customer.overseas.strategy }}</p>

            <h4 class="sub-title">⚠️ 主要挑战</h4>
            <ul class="list">
              <li v-for="(c, i) in customer.overseas.challenges" :key="i">{{ c }}</li>
            </ul>

            <div class="opportunity-box">
              <div class="opp-label">💡 腾讯云海外切入机会</div>
              <div class="opp-text">{{ customer.overseas.opportunity }}</div>
            </div>
          </div>

          <!-- 财报文档 -->
          <div v-if="getActiveTab(customer.id) === 'reports'" class="content-section">
            <p class="section-desc">以下为 <strong>{{ customer.name }}</strong> 最新公开财报与官方渠道，点击即可跳转下载或查看原文。</p>
            <div class="report-list">
              <a
                v-for="(r, i) in customer.reports"
                :key="i"
                class="report-item"
                :href="r.url"
                target="_blank"
                rel="noopener"
              >
                <div class="report-icon" :class="'type-' + r.type">
                  {{ r.type === 'PDF' ? '📄' : r.type === '官网' ? '🌐' : '🔗' }}
                </div>
                <div class="report-main">
                  <div class="report-title">{{ r.title }}</div>
                  <div class="report-meta">
                    <span class="meta-tag">{{ r.period }}</span>
                    <span class="meta-tag">{{ r.type }}</span>
                    <span v-if="r.publishDate !== '-'" class="report-date">发布：{{ r.publishDate }}</span>
                  </div>
                </div>
                <span class="report-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <EmptyState
        v-if="filteredCustomers.length === 0"
        title="暂无客户数据"
        description="当有新客户数据时会在此显示"
      />
    </div>

    <!-- 更新时间 -->
    <div class="page-footer">
      📅 最后更新：{{ lastUpdate }} | 数据来源：公开财报 / 公司年报 / 媒体报道 · 仅供内部参考
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { strategyData, priorityConfig } from '@/data/strategyData'

const router = useRouter()

const lastUpdate = ref('2026-04-19')
const selectedPriority = ref<'全部' | '高' | '中' | '低'>('全部')
const selectedIndustry = ref('全部')

const tabs = [
  { key: 'business', label: '经营情况', icon: '📊' },
  { key: 'ai', label: 'AI 规划', icon: '🤖' },
  { key: 'overseas', label: '出海战略', icon: '🌍' },
  { key: 'reports', label: '财报下载', icon: '📄' }
]

// 每个客户卡片独立的 tab 状态
const activeTabs = reactive<Record<number, string>>({})
strategyData.forEach(c => { activeTabs[c.id] = 'business' })

const getActiveTab = (id: number) => activeTabs[id] || 'business'
const setActiveTab = (id: number, key: string) => { activeTabs[id] = key }

const statusClass = (s: string) => {
  if (s === '已落地') return 'status-done'
  if (s === '推进中') return 'status-ing'
  return 'status-plan'
}

// 统计
const stats = computed(() => ({
  total: strategyData.length,
  highPriority: strategyData.filter(c => c.priority === '高').length,
  overseas: strategyData.filter(c => !c.overseas.status.includes('暂无')).length,
  reports: strategyData.reduce((sum, c) => sum + c.reports.length, 0)
}))

const industries = ['全部', '电商', '社交', '音视频', '物流']

const filteredCustomers = computed(() => {
  let data = [...strategyData]
  if (selectedPriority.value !== '全部') {
    data = data.filter(c => c.priority === selectedPriority.value)
  }
  if (selectedIndustry.value !== '全部') {
    data = data.filter(c => c.industry === selectedIndustry.value)
  }
  return data
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon.purple { background: #f5f3ff; color: #7c3aed; }
.stat-icon.red { background: #fef2f2; color: #ef4444; }
.stat-icon.blue { background: #e0e7ff; color: #4338ca; }
.stat-icon.green { background: #dcfce7; color: #16a34a; }

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  display: block;
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
}

/* 筛选 */
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
  margin-bottom: 14px;
}

.filter-group:last-child { margin-bottom: 0; }

.filter-group label {
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 60px;
}

.filter-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
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

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 客户卡片 */
.customer-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customer-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.customer-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #fafbff, #f5f7ff);
  border-bottom: 1px solid var(--border-light);
}

.customer-avatar {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #2b5aed, #6366f1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #fff;
  flex-shrink: 0;
}

.customer-info {
  flex: 1;
  min-width: 0;
}

.customer-info h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.stock-tag {
  font-size: 11px;
  font-weight: 500;
  background: #fff;
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.customer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--text-light);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meta-link {
  color: var(--primary);
  text-decoration: none;
}

.meta-link:hover {
  text-decoration: underline;
}

.customer-priority {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.customer-priority.高 { background: #fef2f2; color: #ef4444; }
.customer-priority.中 { background: #fff7ed; color: #d97706; }
.customer-priority.低 { background: #dcfce7; color: #16a34a; }

.customer-priority .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Tab */
.customer-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  background: #fafbfc;
}

.customer-tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.customer-tab:hover { color: var(--text); background: #f5f6f8; }

.customer-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
  background: #fff;
}

.tab-icon { font-size: 14px; }

/* 内容 */
.customer-content {
  padding: 20px 22px;
}

.section-desc {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin: 16px 0 10px 0;
}

.sub-title:first-child { margin-top: 0; }

/* 指标卡 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 6px;
}

.metric-card {
  background: #f8fafc;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 12px 14px;
}

.metric-label {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 6px;
}

.metric-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.trend-up { color: #16a34a; font-size: 14px; }
.trend-down { color: #ef4444; font-size: 14px; }
.trend-flat { color: #94a3b8; font-size: 14px; }

/* 两列布局 */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.col-box {
  border-radius: 8px;
  padding: 14px 16px;
}

.green-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.red-box {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.9;
  color: var(--text-secondary);
}

/* 高亮块 */
.highlight-box {
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.highlight-box.blue {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.highlight-box.purple {
  background: #f5f3ff;
  border: 1px solid #c7d2fe;
}

.highlight-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}

.highlight-text {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.highlight-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  color: var(--text-secondary);
}

.vendor-tag,
.region-tag {
  background: var(--primary-light);
  color: var(--primary);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 2px;
}

.region-tag { background: #fef3c7; color: #d97706; }

/* 场景列表 */
.scene-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
}

.scene-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid var(--border-light);
  border-radius: 8px;
}

.scene-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

.status-done { background: #dcfce7; color: #16a34a; }
.status-ing { background: #dbeafe; color: #2563eb; }
.status-plan { background: #f3f4f6; color: #6b7280; }

.scene-content { flex: 1; min-width: 0; }

.scene-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.scene-desc {
  font-size: 11px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* 机会块 */
.opportunity-box {
  background: linear-gradient(135deg, #fff7ed, #fef3c7);
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 16px;
}

.opp-label {
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 6px;
}

.opp-text {
  font-size: 12px;
  line-height: 1.9;
  color: #78350f;
}

/* 财报列表 */
.report-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.15s;
}

.report-item:hover {
  border-color: var(--primary);
  background: #fff;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.report-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.type-PDF { background: #fef2f2; }
.type-网页 { background: #eff6ff; }
.type-官网 { background: #f5f3ff; }

.report-main { flex: 1; min-width: 0; }

.report-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.report-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 11px;
  background: #fff;
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.report-date {
  font-size: 11px;
  color: var(--text-light);
}

.report-arrow {
  font-size: 18px;
  color: var(--text-light);
  flex-shrink: 0;
}

.report-item:hover .report-arrow { color: var(--primary); }

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

@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .customer-header { flex-wrap: wrap; }
  .two-col { grid-template-columns: 1fr; }
  .customer-tabs { overflow-x: auto; }
  .customer-tab { min-width: 100px; }
}
</style>
