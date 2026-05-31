<template>
  <div class="ai-global-page">
    <!-- 页头 -->
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 全球 AI 与模型动态
      </div>
      <h2>🌐 全球 AI 与模型动态</h2>
      <p>AI 前沿技术、Agent 生态、模型发布与全球 LLM 用量排名 · 每日更新</p>
    </div>

    <!-- 顶部 Tab 切换 -->
    <div class="main-tabs">
      <div
        class="main-tab"
        :class="{ active: mainTab === 'ai' }"
        @click="mainTab = 'ai'"
      >
        <span class="mt-icon">🤖</span>
        <div>
          <div class="mt-title">AI 动态</div>
          <div class="mt-sub">{{ aiNews.length }} 条资讯 · 模型/Agent/前沿技术</div>
        </div>
      </div>
      <div
        class="main-tab"
        :class="{ active: mainTab === 'ranking' }"
        @click="mainTab = 'ranking'"
      >
        <span class="mt-icon">🏆</span>
        <div>
          <div class="mt-title">模型排名</div>
          <div class="mt-sub">Top 10 全球 LLM 用量 · OpenRouter 数据</div>
        </div>
      </div>
      <div
        class="main-tab"
        :class="{ active: mainTab === 'apps' }"
        @click="mainTab = 'apps'"
      >
        <span class="mt-icon">📱</span>
        <div>
          <div class="mt-title">Top Apps / Agents</div>
          <div class="mt-sub">全球 Token 消耗最多的应用与 Agent</div>
        </div>
      </div>
    </div>

    <!-- ======================== Tab 1: AI 动态 ======================== -->
    <div v-if="mainTab === 'ai'" class="content-section">
      <!-- 筛选 -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>分类：</label>
          <div class="filter-btns">
            <button
              v-for="cat in aiCategories"
              :key="cat"
              class="filter-btn"
              :class="{ active: aiCategory === cat }"
              @click="aiCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <label>重要性：</label>
          <div class="filter-btns">
            <button
              v-for="imp in importances"
              :key="imp"
              class="filter-btn"
              :class="{ active: aiImportance === imp }"
              @click="aiImportance = imp"
            >
              <span v-if="imp !== '全部'" class="imp-icon">{{ importanceConfig[imp as keyof typeof importanceConfig].icon }}</span>
              {{ imp }}
            </button>
          </div>
        </div>
      </div>

      <div class="news-source-tip">
        <span class="tip-icon">💡</span>
        AI 动态参考来源：<a href="https://ai.hubtoday.app/" target="_blank" rel="noopener">ai.hubtoday.app</a>
        + 各 AI 厂商官方博客 · <strong>每日更新</strong> · 覆盖模型发布 / Agent 生态 / MCP 协议 / 前沿技术
      </div>

      <div class="news-list">
        <div v-for="item in filteredAiNews" :key="item.id" class="news-card">
          <div class="news-top">
            <span
              class="imp-tag"
              :style="{
                background: importanceConfig[item.importance].bg,
                color: importanceConfig[item.importance].color
              }"
            >
              {{ importanceConfig[item.importance].icon }} {{ item.importance }}
            </span>
            <span class="cat-tag">{{ item.category }}</span>
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
            <a
              v-if="item.sourceUrl"
              class="source-link"
              :href="item.sourceUrl"
              target="_blank"
              rel="noopener"
            >
              {{ item.source }} →
            </a>
            <span v-else class="source-text">{{ item.source }}</span>
          </div>
        </div>
      </div>

      <EmptyState v-if="filteredAiNews.length === 0" title="暂无匹配资讯" description="请调整筛选条件" />
    </div>

    <!-- ======================== Tab 2: 模型排名 ======================== -->
    <div v-if="mainTab === 'ranking'" class="content-section">
      <!-- 执行摘要 -->
      <div class="summary-banner">
        <div class="sb-header">
          <div class="sb-title">
            <span class="sb-icon">📊</span>
            <div>
              <h3>{{ executiveSummary.title }}</h3>
              <p>{{ executiveSummary.subtitle }} · 更新于 {{ executiveSummary.lastUpdated }}</p>
            </div>
          </div>
          <a :href="executiveSummary.dataSourceUrl" target="_blank" rel="noopener" class="sb-source">
            数据来源：{{ executiveSummary.dataSource }} →
          </a>
        </div>
        <div class="sb-findings">
          <div
            v-for="(finding, idx) in executiveSummary.keyFindings"
            :key="idx"
            class="sb-finding"
            :class="'finding-' + finding.type"
          >
            <span class="sf-icon">{{ finding.icon }}</span>
            <span class="sf-text">{{ finding.text }}</span>
          </div>
        </div>
        <div class="sb-stats">
          <div class="sb-stat">
            <div class="ss-num">{{ executiveSummary.totalTokensTop10 }}</div>
            <div class="ss-label">Top 10 总 Token 消耗</div>
          </div>
          <div class="sb-stat">
            <div class="ss-num highlight-cn">{{ executiveSummary.chinaTokensShare }}</div>
            <div class="ss-label">🇨🇳 中国模型份额</div>
          </div>
          <div class="sb-stat">
            <div class="ss-num">{{ executiveSummary.usTokensShare }}</div>
            <div class="ss-label">🇺🇸 美国模型份额</div>
          </div>
          <div class="sb-stat">
            <div class="ss-num">10</div>
            <div class="ss-label">入围模型总数</div>
          </div>
        </div>
      </div>

      <!-- 排名表格 -->
      <div class="section-card">
        <div class="sc-header">
          <span>🏅 全球 LLM 实际用量 Top 10</span>
          <span class="sc-sub">按周 Token 消耗量排序</span>
        </div>
        <div class="ranking-table-wrap">
          <table class="ranking-table">
            <thead>
              <tr>
                <th class="th-rank">排名</th>
                <th class="th-model">模型</th>
                <th class="th-developer">开发商</th>
                <th class="th-tokens">Token 用量</th>
                <th class="th-growth">周增长</th>
                <th class="th-category">分类</th>
                <th class="th-highlight">亮点</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="m in modelRankings"
                :key="m.rank"
                :class="{ 'row-top3': m.rank <= 3 }"
              >
                <td class="td-rank">
                  <span class="rank-badge" :class="'rank-' + m.rank">
                    {{ m.rank <= 3 ? rankMedals[m.rank] : '#' + m.rank }}
                  </span>
                </td>
                <td class="td-model">
                  <div class="model-name">{{ m.modelName }}</div>
                  <div class="model-caps">
                    <span v-for="cap in m.capabilities.slice(0, 3)" :key="cap" class="cap-tag">{{ cap }}</span>
                  </div>
                </td>
                <td class="td-developer">
                  <div>{{ m.developer }}</div>
                  <div class="dev-country">{{ m.developerCountry }}</div>
                </td>
                <td class="td-tokens">
                  <span class="token-value">{{ m.tokensUsed }}</span>
                </td>
                <td class="td-growth">
                  <span
                    class="growth-badge"
                    :class="growthClass(m.weeklyGrowth)"
                  >
                    {{ m.weeklyGrowth > 0 ? '+' : '' }}{{ m.weeklyGrowth }}%
                  </span>
                </td>
                <td class="td-category">
                  <span class="category-tag">{{ m.category }}</span>
                </td>
                <td class="td-highlight">{{ m.highlight }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 行 1：区域竞争格局 + 厂商份额分布 -->
      <div class="two-col-row">
        <!-- 区域竞争格局 -->
        <div class="section-card col">
          <div class="sc-header">
            <span>🌍 区域竞争格局</span>
            <span class="sc-sub">Top 10 中各区域表现</span>
          </div>
          <div class="region-grid">
            <div
              v-for="r in regionStats"
              :key="r.region"
              class="region-card"
              :class="'region-' + r.trend"
            >
              <div class="rc-header">
                <span class="rc-region">{{ r.region }}</span>
                <span class="rc-trend" :class="'trend-' + r.trend">
                  {{ r.trend === 'up' ? '↑ 上升' : r.trend === 'down' ? '↓ 下降' : '→ 稳定' }}
                </span>
              </div>
              <div class="rc-stats">
                <div class="rc-stat">
                  <div class="rc-num">{{ r.modelsCount }}</div>
                  <div class="rc-label">入围数</div>
                </div>
                <div class="rc-stat">
                  <div class="rc-num">{{ r.totalTokens }}</div>
                  <div class="rc-label">总 Token</div>
                </div>
                <div class="rc-stat">
                  <div class="rc-num rc-top">{{ r.topModel }}</div>
                  <div class="rc-label">最高排名模型</div>
                </div>
              </div>
              <div class="rc-highlight">{{ r.highlight }}</div>
            </div>
          </div>
        </div>

        <!-- 厂商份额分布 -->
        <div class="section-card col">
          <div class="sc-header">
            <span>🏢 厂商份额分布 · Market Share</span>
            <span class="sc-sub">OpenRouter 按模型厂商的 Token 份额</span>
          </div>
          <div class="vendor-share-list">
            <div
              v-for="(v, idx) in vendorShares"
              :key="v.vendor"
              class="vs-item"
            >
              <div class="vs-rank">{{ idx + 1 }}.</div>
              <div class="vs-dot" :style="{ background: v.color }"></div>
              <div class="vs-info">
                <div class="vs-name">{{ v.vendor }}</div>
                <div class="vs-country">{{ v.country }}</div>
              </div>
              <div class="vs-bar-wrap">
                <div
                  class="vs-bar"
                  :style="{ width: v.sharePercent * 4 + '%', background: v.color }"
                ></div>
              </div>
              <div class="vs-tokens">
                <div class="vs-tok-num">{{ v.totalTokens }}</div>
                <div class="vs-tok-pct">{{ v.sharePercent }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 行 2：增长趋势分析 + 市场深度洞察 -->
      <div class="two-col-row">
        <!-- 增长趋势分析 -->
        <div class="section-card col">
          <div class="sc-header">
            <span>📈 增长趋势分析</span>
            <span class="sc-sub">按周环比增长率分类</span>
          </div>
          <div class="growth-grid">
            <div
              v-for="(cat, key) in growthCategories"
              :key="key"
              class="growth-card"
              :style="{ borderLeftColor: cat.color }"
            >
              <div class="gc-header">
                <span class="gc-label">{{ cat.label }}</span>
                <span class="gc-desc">{{ cat.description }}</span>
              </div>
              <div class="gc-models">
                <span
                  v-for="model in cat.models"
                  :key="model"
                  class="gc-model-tag"
                  :style="{ background: cat.bgColor, color: cat.color }"
                >
                  {{ model }}
                </span>
                <span v-if="cat.models.length === 0" class="gc-empty">暂无</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 市场洞察 -->
        <div class="section-card col">
          <div class="sc-header">
            <span>💡 市场深度洞察</span>
            <span class="sc-sub">关键趋势与机遇分析</span>
          </div>
          <div class="insights-grid">
            <div
              v-for="insight in marketInsights"
              :key="insight.id"
              class="insight-card"
              :class="'insight-' + insight.type"
            >
              <div class="ic-icon">{{ insight.icon }}</div>
              <div class="ic-body">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据说明 -->
      <div class="data-note">
        <p>
          📌 <strong>数据说明</strong>：排名基于
          <a :href="executiveSummary.dataSourceUrl" target="_blank" rel="noopener">OpenRouter Rankings</a>
          全球 API 实际调用量（Token 消耗量），统计口径为最近一周的聚合数据。排名仅反映通过 OpenRouter 路由的 API 流量，不含各厂商自有渠道。
          更新频率：每周。最后更新：{{ executiveSummary.lastUpdated }}。
        </p>
      </div>
    </div>

    <!-- ======================== Tab 3: Top Apps / Agents ======================== -->
    <div v-if="mainTab === 'apps'" class="content-section">
      <div class="section-card">
        <div class="sc-header">
          <span>📱 全球 Top Apps / Agents 排名</span>
          <span class="sc-sub">按 Token 消耗量排序，反映 Agent 生态实际应用热度</span>
        </div>
        <div class="apps-list">
          <div
            v-for="app in topApps"
            :key="app.rank"
            class="app-item"
          >
            <div class="ai-rank">#{{ app.rank }}</div>
            <div class="ai-icon">{{ app.icon }}</div>
            <div class="ai-body">
              <div class="ai-name">{{ app.appName }}</div>
              <div class="ai-desc">{{ app.description }}</div>
              <div class="ai-meta">
                <span class="ai-model">{{ app.primaryModel }}</span>
                <span class="ai-cat">{{ app.category }}</span>
              </div>
            </div>
            <div class="ai-tokens">{{ app.tokensUsed }}</div>
          </div>
        </div>
      </div>

      <!-- Agent 生态洞察 -->
      <div class="section-card">
        <div class="sc-header">
          <span>🔮 Agent 生态趋势</span>
          <span class="sc-sub">从 Top Apps 数据看 Agent 发展方向</span>
        </div>
        <div class="agent-insights">
          <div class="agent-insight-card">
            <div class="aic-icon">🧠</div>
            <div class="aic-body">
              <h4>Coding Agent 领跑</h4>
              <p>以 Cursor、Windsurf、CodeBuddy 为代表的编程 Agent 占据 Token 消耗前列，开发者工具成为 Agent 落地最成熟场景</p>
            </div>
          </div>
          <div class="agent-insight-card">
            <div class="aic-icon">🔗</div>
            <div class="aic-body">
              <h4>MCP 协议加速互联</h4>
              <p>Model Context Protocol (MCP) 已成为 Agent 间通信的事实标准，Anthropic 推动的开放协议让多 Agent 协作成为可能</p>
            </div>
          </div>
          <div class="agent-insight-card">
            <div class="aic-icon">🏢</div>
            <div class="aic-body">
              <h4>企业级 Agent 崛起</h4>
              <p>WorkBuddy、Microsoft 365 Copilot、Google Gemini Enterprise Agent 等企业级产品加速渗透，从个人工具走向组织协作</p>
            </div>
          </div>
          <div class="agent-insight-card">
            <div class="aic-icon">🌊</div>
            <div class="aic-body">
              <h4>多模态 Agent 浪潮</h4>
              <p>GPT-Realtime 语音 Agent、Gemini 视觉 Agent 等多模态能力正快速融入 Agent 框架，交互模式从纯文本走向全感知</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据说明 -->
      <div class="data-note">
        <p>
          📌 <strong>数据说明</strong>：Top Apps 排名基于 OpenRouter 统计的 Token 消耗量，反映通过 API 调用的实际流量。
          Agent 生态趋势分析结合行业公开信息与 Top Apps 数据特征总结。更新频率：每周。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { aiNews, importanceConfig } from '@/data/newsData'
import {
  modelRankings,
  topApps,
  marketInsights,
  vendorShares,
  growthCategories,
  regionStats,
  executiveSummary
} from '@/data/modelRankingData'

const router = useRouter()

const mainTab = ref<'ai' | 'ranking' | 'apps'>('ai')

// AI 筛选
const aiCategories = ['全部', '模型发布', '国产模型', 'Agent 生态', 'MCP/协议', '前沿技术', '行业投资']
const aiCategory = ref('全部')
const importances = ['全部', '重磅', '重要', '一般']
const aiImportance = ref('全部')

const filteredAiNews = computed(() => {
  let data = [...aiNews]
  if (aiCategory.value !== '全部') {
    data = data.filter(n => n.category === aiCategory.value)
  }
  if (aiImportance.value !== '全部') {
    data = data.filter(n => n.importance === aiImportance.value)
  }
  return data
})

// 模型排名辅助
const rankMedals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

const growthClass = (growth: number) => {
  if (growth > 500) return 'growth-explosive'
  if (growth > 30) return 'growth-strong'
  if (growth > 0) return 'growth-steady'
  if (growth > -20) return 'growth-flat'
  return 'growth-declining'
}
</script>

<style scoped>
/* ==================== 页头 ==================== */
.page-header {
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.breadcrumb a {
  color: var(--primary);
  cursor: pointer;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.page-header p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ==================== Tabs ==================== */
.main-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.main-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}

.main-tab:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.main-tab.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 1px var(--primary);
}

.mt-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.mt-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.mt-sub {
  font-size: 11px;
  color: var(--text-light);
}

/* ==================== AI 动态 - 筛选与列表 ==================== */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  padding: 14px 18px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.filter-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-btn {
  padding: 4px 12px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-white);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-secondary);
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.imp-icon {
  margin-right: 2px;
}

.news-source-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.news-source-tip a {
  color: var(--primary);
  text-decoration: none;
}

.news-source-tip a:hover {
  text-decoration: underline;
}

.tip-icon {
  flex-shrink: 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.news-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  transition: all 0.15s;
}

.news-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.news-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.imp-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.cat-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-secondary);
}

.news-date {
  font-size: 11px;
  color: var(--text-light);
  margin-left: auto;
}

.news-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 8px;
}

.news-title a {
  color: var(--text);
  text-decoration: none;
}

.news-title a:hover {
  color: var(--primary);
}

.news-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
}

.news-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  color: var(--primary);
  background: var(--primary-light);
  padding: 2px 8px;
  border-radius: 4px;
}

.source-link {
  font-size: 11px;
  color: var(--primary);
  text-decoration: none;
}

.source-link:hover {
  text-decoration: underline;
}

.source-text {
  font-size: 11px;
  color: var(--text-light);
}

/* ==================== 模型排名 - 执行摘要 ==================== */
.summary-banner {
  background: linear-gradient(135deg, #1e3a5f 0%, #2b5aed 50%, #6366f1 100%);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  color: #fff;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.summary-banner::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.sb-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}

.sb-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sb-icon {
  font-size: 28px;
}

.sb-title h3 {
  font-size: 20px;
  font-weight: 700;
}

.sb-title p {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
}

.sb-source {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 16px;
  white-space: nowrap;
  transition: all 0.15s;
}

.sb-source:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.sb-findings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.sb-finding {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.sf-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.finding-highlight {
  background: rgba(239, 68, 68, 0.25);
  border-left: 3px solid #ef4444;
}

.finding-positive {
  background: rgba(16, 185, 129, 0.2);
  border-left: 3px solid #10b981;
}

.finding-neutral {
  background: rgba(255, 255, 255, 0.1);
  border-left: 3px solid rgba(255, 255, 255, 0.4);
}

.finding-warning {
  background: rgba(245, 158, 11, 0.2);
  border-left: 3px solid #f59e0b;
}

.sb-stats {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.sb-stat {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 14px 20px;
  min-width: 120px;
  text-align: center;
}

.ss-num {
  font-size: 22px;
  font-weight: 700;
}

.ss-num.highlight-cn {
  color: #fbbf24;
}

.ss-label {
  font-size: 11px;
  opacity: 0.8;
  margin-top: 2px;
}

/* ==================== 通用 Section Card ==================== */
.section-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
  overflow: hidden;
}

.sc-header {
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sc-sub {
  font-size: 12px;
  color: var(--text-light);
  font-weight: 400;
}

/* ==================== 排名表格 ==================== */
.ranking-table-wrap {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.ranking-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg);
  border-bottom: 1px solid var(--border-light);
  white-space: nowrap;
}

.ranking-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  vertical-align: top;
}

.ranking-table tbody tr:hover {
  background: var(--bg);
}

.row-top3 {
  background: #fefce8;
}

.row-top3:hover {
  background: #fef9c3 !important;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 14px;
}

.rank-1,
.rank-2,
.rank-3 {
  font-size: 20px;
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 12px;
}

.model-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.model-caps {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.cap-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--primary-light);
  color: var(--primary);
}

.dev-country {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

.token-value {
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
}

.growth-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.growth-explosive {
  background: #fef2f2;
  color: #dc2626;
}

.growth-strong {
  background: #fffbeb;
  color: #d97706;
}

.growth-steady {
  background: #eef2ff;
  color: #6366f1;
}

.growth-flat {
  background: #f1f5f9;
  color: #64748b;
}

.growth-declining {
  background: #f1f5f9;
  color: #94a3b8;
}

.category-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-secondary);
  white-space: nowrap;
}

.td-highlight {
  font-size: 12px;
  color: var(--text-secondary);
  max-width: 220px;
  line-height: 1.5;
}

/* ==================== 两列并排行布局 ==================== */
.two-col-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.two-col-row .section-card.col {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1100px) {
  .two-col-row {
    grid-template-columns: 1fr;
  }
}

/* ==================== 区域竞争格局 ==================== */
.region-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding: 16px 20px;
}

.region-card {
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 18px;
  transition: all 0.15s;
}

.region-card:hover {
  box-shadow: var(--shadow-md);
}

.region-up {
  border-left: 3px solid #10b981;
}

.region-down {
  border-left: 3px solid #ef4444;
}

.region-steady {
  border-left: 3px solid #6366f1;
}

.rc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.rc-region {
  font-size: 16px;
  font-weight: 700;
}

.rc-trend {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.trend-up {
  background: #f0fdf4;
  color: #16a34a;
}

.trend-down {
  background: #fef2f2;
  color: #ef4444;
}

.trend-steady {
  background: #eef2ff;
  color: #6366f1;
}

.rc-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.rc-stat {
  flex: 1;
}

.rc-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.rc-num.rc-top {
  font-size: 13px;
  font-weight: 600;
}

.rc-label {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

.rc-highlight {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 8px 12px;
  background: var(--bg);
  border-radius: 6px;
  line-height: 1.5;
}

/* ==================== 增长趋势分析 ==================== */
.growth-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px 20px;
}

.growth-card {
  border: 1px solid var(--border-light);
  border-left: 4px solid;
  border-radius: 8px;
  padding: 16px;
}

.gc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.gc-label {
  font-weight: 600;
  font-size: 14px;
}

.gc-desc {
  font-size: 11px;
  color: var(--text-light);
}

.gc-models {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.gc-model-tag {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.gc-empty {
  font-size: 12px;
  color: var(--text-light);
}

/* ==================== 厂商份额分布 ==================== */
.vendor-share-list {
  padding: 10px 20px 16px;
}

.vs-item {
  display: grid;
  grid-template-columns: 22px 12px 1fr 80px 70px;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border-light);
}

.vs-item:last-child {
  border-bottom: none;
}

.vs-rank {
  font-size: 12px;
  color: var(--text-light);
  font-weight: 600;
  text-align: right;
}

.vs-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.vs-info {
  min-width: 0;
}

.vs-name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}

.vs-country {
  font-size: 11px;
  color: var(--text-light);
}

.vs-bar-wrap {
  height: 8px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
  max-width: 100%;
}

.vs-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.vs-tokens {
  text-align: right;
}

.vs-tok-num {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.vs-tok-pct {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

/* ==================== 市场洞察 ==================== */
.insights-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 16px 20px;
}

.insight-card {
  display: flex;
  gap: 14px;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  transition: all 0.15s;
}

.insight-card:hover {
  box-shadow: var(--shadow-md);
}

.insight-trend {
  border-left: 3px solid #6366f1;
  background: #f5f3ff;
}

.insight-warning {
  border-left: 3px solid #f59e0b;
  background: #fffbeb;
}

.insight-opportunity {
  border-left: 3px solid #10b981;
  background: #f0fdf4;
}

.insight-info {
  border-left: 3px solid #3b82f6;
  background: #eff6ff;
}

.ic-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.ic-body h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.4;
}

.ic-body p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ==================== Top Apps ==================== */
.apps-list {
  padding: 8px 20px;
}

.app-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);
}

.app-item:last-child {
  border-bottom: none;
}

.ai-rank {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-light);
  min-width: 30px;
}

.ai-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  background: var(--bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-body {
  flex: 1;
  min-width: 0;
}

.ai-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.ai-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.ai-meta {
  display: flex;
  gap: 8px;
}

.ai-model {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--primary-light);
  color: var(--primary);
}

.ai-cat {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-secondary);
}

.ai-tokens {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

/* ==================== Agent 生态洞察 ==================== */
.agent-insights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 16px 20px;
}

.agent-insight-card {
  display: flex;
  gap: 12px;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transition: all 0.15s;
}

.agent-insight-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.aic-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.aic-body h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.aic-body p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ==================== 数据说明 ==================== */
.data-note {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-top: 4px;
}

.data-note p {
  font-size: 12px;
  color: var(--text-light);
  line-height: 1.7;
}

.data-note a {
  color: var(--primary);
  text-decoration: none;
}

.data-note a:hover {
  text-decoration: underline;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .main-tabs {
    flex-direction: column;
  }

  .summary-banner {
    padding: 20px;
  }

  .sb-header {
    flex-direction: column;
    gap: 10px;
  }

  .sb-stats {
    flex-wrap: wrap;
  }

  .sb-stat {
    min-width: 100px;
  }

  .region-grid {
    grid-template-columns: 1fr;
  }

  .growth-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .agent-insights {
    grid-template-columns: 1fr;
  }

  .vs-item {
    grid-template-columns: 20px 10px 1fr 70px 60px;
    gap: 8px;
  }

  .ranking-table .th-highlight,
  .ranking-table .td-highlight {
    display: none;
  }

  .ranking-table .th-category,
  .ranking-table .td-category {
    display: none;
  }

  .filter-bar {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
