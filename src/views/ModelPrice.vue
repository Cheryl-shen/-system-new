<template>
  <div class="model-price-page">
    <!-- 页头 -->
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 模型商价格动态
      </div>
      <h2>📊 模型商价格动态</h2>
      <p>持续跟踪 DeepSeek、Kimi（月之暗面）、MiniMax、GLM（智谱AI）四家模型厂商的定价变化与产品动态</p>
    </div>

    <!-- 概览结论卡片 -->
    <div class="overview-cards">
      <div class="oc-card oc-highlight">
        <div class="oc-icon">💡</div>
        <div class="oc-body">
          <div class="oc-title">核心洞察（数据截至 2026-04-27）</div>
          <ul class="oc-list">
            <li>
              <span class="oc-tag up">涨价</span>
              Kimi K2.6 于 4/20 发布，定价较 K2.5 上涨 <strong>58~60%</strong>（输入 $0.60→$0.95，输出 $3→$4）
            </li>
            <li>
              <span class="oc-tag up">涨价</span>
              GLM-5.1 于 4/8 发布并全线涨价 <strong>10%</strong>，输入 ¥5.5→¥6，输出 ¥22→¥24
            </li>
            <li>
              <span class="oc-tag down">优惠</span>
              DeepSeek V4-Pro 限时 <strong>2.5 折</strong>（至 5/5），V4 全系缓存命中价降至首发价 1/10
            </li>
            <li>
              <span class="oc-tag best">性价比</span>
              MiniMax M2.7 / M2.5 定价最低，输入 <strong>¥2.1/百万tokens</strong>，适合高并发场景
            </li>
          </ul>
        </div>
      </div>

      <div class="oc-card oc-price-range">
        <div class="oc-icon">📊</div>
        <div class="oc-body">
          <div class="oc-title">主力模型价格区间（元/百万 tokens，缓存未命中输入）</div>
          <div class="oc-range-grid">
            <div class="oc-range-item">
              <div class="oc-range-label">💰 最低输入价</div>
              <div class="oc-range-value green">¥1</div>
              <div class="oc-range-vendor">DeepSeek V4-Flash</div>
            </div>
            <div class="oc-range-item">
              <div class="oc-range-label">💰 最低输出价</div>
              <div class="oc-range-value green">¥2</div>
              <div class="oc-range-vendor">DeepSeek V4-Flash</div>
            </div>
            <div class="oc-range-item">
              <div class="oc-range-label">🔺 最高输入价</div>
              <div class="oc-range-value red">¥7</div>
              <div class="oc-range-vendor">Kimi K2.6（涨 58%）</div>
            </div>
            <div class="oc-range-item">
              <div class="oc-range-label">🔺 最高输出价</div>
              <div class="oc-range-value red">¥29</div>
              <div class="oc-range-vendor">Kimi K2.6（涨 32%）</div>
            </div>
          </div>
        </div>
      </div>

      <div class="oc-card oc-timeline">
        <div class="oc-icon">📅</div>
        <div class="oc-body">
          <div class="oc-title">近期重要动态</div>
          <div class="oc-tl">
            <div class="oc-tl-item" v-for="evt in timelineEvents" :key="evt.date + evt.title">
              <div class="oc-tl-date">{{ evt.date }}</div>
              <div class="oc-tl-dot" :class="'dot-' + evt.type"></div>
              <div class="oc-tl-content">
                <span class="oc-tl-vendor">{{ evt.vendor }}</span>
                <span>{{ evt.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 厂商切换 Tabs -->
    <div class="vendor-tabs">
      <div
        v-for="v in vendorData"
        :key="v.vendorKey"
        class="vendor-tab"
        :class="{ active: activeVendor === v.vendorKey }"
        @click="activeVendor = v.vendorKey"
      >
        <span class="vt-icon">{{ v.logoIcon }}</span>
        <span class="vt-label">{{ v.vendorName }}</span>
        <span v-if="getVendorChanges(v.vendorKey).length > 0" class="vt-badge">!</span>
      </div>
    </div>

    <!-- 当前厂商详情 -->
    <div v-if="currentVendor" class="vendor-detail">
      <!-- 厂商信息卡 -->
      <div class="vendor-hero" :style="{ background: vendorGradient }">
        <div class="vh-left">
          <div class="vh-icon">{{ currentVendor.logoIcon }}</div>
          <div class="vh-info">
            <h3>{{ currentVendor.vendorFullname }}</h3>
            <p>{{ currentVendor.vendorName }} · 最后检查：{{ currentVendor.lastChecked }}</p>
          </div>
        </div>
        <div class="vh-links">
          <a :href="currentVendor.websiteUrl" target="_blank" rel="noopener">官网 →</a>
          <a :href="currentVendor.pricingUrl" target="_blank" rel="noopener">定价页 →</a>
        </div>
      </div>

      <!-- 价格变更提醒 -->
      <div v-if="getVendorChanges(currentVendor.vendorKey).length > 0" class="change-alert">
        <div class="ca-icon">⚠️</div>
        <div class="ca-content">
          <div class="ca-title">近期价格变动</div>
          <div
            v-for="(c, i) in getVendorChanges(currentVendor.vendorKey)"
            :key="i"
            class="ca-item"
          >
            <span class="ca-model">{{ c.modelName }}</span>
            <span :class="['ca-direction', c.direction]">
              {{ c.oldValue }} → {{ c.newValue }}
              {{ c.direction === 'up' ? '↑' : c.direction === 'down' ? '↓' : '' }}
            </span>
            <span class="ca-note">{{ c.note }}</span>
          </div>
        </div>
      </div>

      <!-- 定价表格 -->
      <div class="section-title">💰 模型定价（元/百万 tokens）</div>
      <div class="pricing-table-wrap">
        <table class="pricing-table">
          <thead>
            <tr>
              <th>模型</th>
              <th>输入价格</th>
              <th>输出价格</th>
              <th>缓存命中</th>
              <th>上下文</th>
              <th>能力</th>
              <th class="col-op">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in currentVendor.models" :key="m.modelName">
              <td>
                <span class="pm-name">{{ m.displayName }}</span>
              </td>
              <td class="pm-price">{{ m.inputPrice }}</td>
              <td class="pm-price">{{ m.outputPrice }}</td>
              <td class="pm-price cache">
                {{ m.cacheHitPrice != null ? String(m.cacheHitPrice) : '—' }}
              </td>
              <td class="pm-ctx">{{ m.contextLength }}</td>
              <td>
                <span
                  v-for="cap in m.capabilities.slice(0, 3)"
                  :key="cap"
                  class="cap-tag"
                >{{ cap }}</span>
              </td>
              <td class="col-op">
                <a :href="m.officialUrl" target="_blank" rel="noopener" class="pm-link">详情 →</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 近期公告 -->
      <div v-if="currentVendor.announcements.length > 0" class="section-title" style="margin-top:24px">
        📢 近期公告
      </div>
      <div v-if="currentVendor.announcements.length > 0" class="announce-list">
        <div
          v-for="(a, i) in currentVendor.announcements"
          :key="i"
          class="announce-card"
          :class="'type-' + a.type"
        >
          <div class="ac-date">{{ a.date }}</div>
          <div class="ac-title">{{ a.title }}</div>
          <div class="ac-footer">
            <span class="ac-type">{{ a.type }}</span>
            <a :href="a.url" target="_blank" rel="noopener">查看原文 →</a>
          </div>
        </div>
      </div>

      <!-- 价格对比入口 -->
      <div class="section-title" style="margin-top:24px">
        📈 跨厂商价格对比
      </div>
      <div class="compare-hint">
        下方表格对比四家厂商主力模型的输入/输出价格（元/百万 tokens），便于快速选型参考。
      </div>
    </div>

    <!-- 跨厂商价格对比表 -->
    <div class="compare-section">
      <table class="compare-table">
        <thead>
          <tr>
            <th>厂商</th>
            <th>主力模型</th>
            <th>输入</th>
            <th>输出</th>
            <th>缓存命中</th>
            <th>上下文</th>
            <th>价格趋势</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in compareRows" :key="item.vendorKey">
            <td>
              <span class="cv-icon">{{ item.icon }}</span>
              {{ item.vendorName }}
            </td>
            <td class="cm-model">{{ item.mainModel }}</td>
            <td class="cm-price">{{ item.input }}</td>
            <td class="cm-price">{{ item.output }}</td>
            <td class="cm-price">{{ item.cache != null ? String(item.cache) : '—' }}</td>
            <td>{{ item.context }}</td>
            <td>
              <span :class="['trend-tag', item.trend]">{{ trendLabel(item.trend) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 数据说明 -->
    <div class="source-note">
      📌 数据来源：
      <a :href="currentVendor?.pricingUrl" target="_blank" rel="noopener">各厂商官方定价页</a> ·
      价格单位：元/百万 tokens（1M = 1,000,000 tokens）·
      每周一自动更新
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { vendorData, type VendorPriceData, type PriceChange } from '@/data/modelPriceData'

const router = useRouter()
const activeVendor = ref<string>(vendorData[0].vendorKey)

/** 概览区时间线事件 */
const timelineEvents = [
  { date: '2026-04-25', vendor: 'DeepSeek', title: 'V4 正式发布，V4-Pro 限时2.5折（至5/5）', type: 'new-model' },
  { date: '2026-04-20', vendor: 'Kimi', title: 'K2.6 发布并开源，定价上涨58~60%', type: 'price-up' },
  { date: '2026-04-09', vendor: 'GLM', title: 'GLM-5.1 发布并开源，全线涨价10%', type: 'price-up' },
  { date: '2026-03-18', vendor: 'MiniMax', title: 'M2.7 发布并开源（不可商用，需授权）', type: 'new-model' },
  { date: '2026-03-16', vendor: 'GLM', title: 'GLM-5-Turbo 涨价20%，专为 Agent 场景优化', type: 'price-up' },
]

const currentVendor = computed(() =>
  vendorData.find(v => v.vendorKey === activeVendor.value)
)

/** 厂商对应渐变色 */
const vendorGradient = computed(() => {
  const map: Record<string, string> = {
    deepseek: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    kimi:     'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    minimax:  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    glm:       'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  }
  return map[activeVendor.value] || map.deepseek
})

/** 获取某厂商的价格变更 */
function getVendorChanges(key: string): PriceChange[] {
  return vendorData.find(v => v.vendorKey === key)?.priceChanges || []
}

/** 跨厂商对比行 */
interface CompareRow {
  vendorKey: string
  icon: string
  vendorName: string
  mainModel: string
  input: number | string
  output: number | string
  cache: number | undefined
  context: string
  trend: 'up' | 'down' | 'stable'
}

const compareRows = computed<CompareRow[]>(() => {
  return vendorData.map(v => {
    const main = v.models[0]
    const change = v.priceChanges[0]
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (change) {
      trend = change.direction === 'up' ? 'up' : change.direction === 'down' ? 'down' : 'stable'
    }
    return {
      vendorKey: v.vendorKey,
      icon: v.logoIcon,
      vendorName: v.vendorName,
      mainModel: main.displayName,
      input: main.inputPrice,
      output: main.outputPrice,
      cache: main.cacheHitPrice,
      context: main.contextLength,
      trend
    }
  })
})

function trendLabel(t: string) {
  return t === 'up' ? '↑ 涨价' : t === 'down' ? '↓ 降价' : '— 稳定'
}
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
.breadcrumb a { color: var(--primary); text-decoration: none; cursor: pointer; }
.breadcrumb a:hover { text-decoration: underline; }
.page-header h2 { font-size: 20px; font-weight: 600; margin: 0 0 4px 0; color: var(--text); }
.page-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }

/* 厂商 Tabs */
.vendor-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.vendor-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--bg-white);
  border: 2px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  position: relative;
}
.vendor-tab:hover { border-color: var(--primary); }
.vendor-tab.active {
  border-color: var(--primary);
  background: var(--primary-light);
  font-weight: 600;
}
.vt-icon { font-size: 20px; }
.vt-label { font-size: 14px; color: var(--text); }
.vt-badge {
  position: absolute;
  top: -6px; right: -6px;
  background: var(--red);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

/* 厂商 Hero */
.vendor-hero {
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  color: #fff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.vh-left { display: flex; align-items: center; gap: 14px; }
.vh-icon { font-size: 32px; }
.vh-info h3 { font-size: 16px; font-weight: 600; margin: 0 0 2px 0; }
.vh-info p { font-size: 12px; opacity: 0.8; margin: 0; }
.vh-links { display: flex; gap: 10px; }
.vh-links a {
  color: #fff;
  font-size: 13px;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.4);
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.15s;
}
.vh-links a:hover { background: rgba(255,255,255,0.2); }

/* 价格变更提醒 */
.change-alert {
  display: flex;
  gap: 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius);
  padding: 14px 18px;
  margin-bottom: 16px;
  align-items: flex-start;
}
.ca-icon { font-size: 22px; flex-shrink: 0; }
.ca-content { flex: 1; }
.ca-title { font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 6px; }
.ca-item { font-size: 13px; color: #78350f; margin-bottom: 2px; }
.ca-model { font-weight: 600; margin-right: 8px; }
.ca-direction { font-weight: 700; margin-right: 8px; }
.ca-direction.up { color: #dc2626; }
.ca-direction.down { color: #16a34a; }
.ca-note { font-size: 12px; color: #92400e; }

/* 分区标题 */
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
}

/* 定价表格 */
.pricing-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-white);
}
.pricing-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.pricing-table th,
.pricing-table td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}
.pricing-table thead { background: var(--bg); }
.pricing-table th {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-secondary);
}
.pricing-table tbody tr:hover { background: var(--bg); }
.pm-name { font-weight: 600; color: var(--text); }
.pm-price { font-family: 'SF Mono', 'Fira Code', monospace; font-weight: 600; color: var(--primary); }
.pm-price.cache { color: var(--text-secondary); }
.pm-ctx { font-size: 12px; color: var(--text-secondary); }
.cap-tag {
  display: inline-block;
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-secondary);
  margin-right: 4px;
}
.pm-link { font-size: 12px; color: var(--primary); text-decoration: none; }
.pm-link:hover { text-decoration: underline; }
.col-op { text-align: center; width: 80px; }

/* 公告列表 */
.announce-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.announce-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  background: var(--bg-white);
  transition: all 0.15s;
}
.announce-card:hover { border-color: var(--primary); box-shadow: var(--shadow-sm); }
.ac-date { font-size: 12px; color: var(--text-light); margin-bottom: 6px; }
.ac-title { font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.6; }
.ac-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
.ac-type {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 4px;
  font-weight: 500;
}
.type-新模型 .ac-type { background: #dbeafe; color: #1d4ed8; }
.type-价格调整 .ac-type { background: #fef3c7; color: #92400e; }
.type-功能升级 .ac-type { background: #d1fae5; color: #065f46; }
.type-其他 .ac-type { background: var(--bg); color: var(--text-secondary); }
.ac-footer a { font-size: 12px; color: var(--primary); text-decoration: none; }
.ac-footer a:hover { text-decoration: underline; }

/* 对比区 */
.compare-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  line-height: 1.7;
}
.compare-section {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);

  background: var(--bg-white);
  margin-bottom: 16px;
}
.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.compare-table th,
.compare-table td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}
.compare-table thead { background: var(--bg); }
.compare-table th {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-secondary);
}
.compare-table tbody tr:hover { background: var(--bg); }
.cv-icon { font-size: 18px; margin-right: 6px; }
.cm-model { font-weight: 600; color: var(--text); }
.cm-price { font-family: 'SF Mono', 'Fira Code', monospace; font-weight: 600; }
.trend-tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 600;
}
.trend-tag.up { background: #fee2e2; color: #dc2626; }
.trend-tag.down { background: #dcfce7; color: #16a34a; }
.trend-tag.stable { background: var(--bg); color: var(--text-secondary); }

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
.source-note a { color: var(--primary); text-decoration: none; }
.source-note a:hover { text-decoration: underline; }

/* ===== 概览卡片 ===== */
.overview-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}
.oc-card {
  display: flex;
  gap: 14px;
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  align-items: flex-start;
}
.oc-icon { font-size: 26px; flex-shrink: 0; margin-top: 2px; }
.oc-body { flex: 1; min-width: 0; }
.oc-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

/* 核心洞察 */
.oc-highlight { border-left: 4px solid var(--primary); }
.oc-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.oc-list li {
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.oc-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}
.oc-tag.up { background: #fee2e2; color: #dc2626; }
.oc-tag.down { background: #dcfce7; color: #16a34a; }
.oc-tag.new { background: #dbeafe; color: #2563eb; }
.oc-tag.best { background: #fef3c7; color: #92400e; }

/* 价格区间 */
.oc-price-range { border-left: 4px solid #f59e0b; }
.oc-range-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.oc-range-item {
  text-align: center;
  padding: 10px 6px;
  background: var(--bg);
  border-radius: var(--radius);
}
.oc-range-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.oc-range-value {
  font-size: 20px;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.oc-range-value.green { color: #16a34a; }
.oc-range-value.red { color: #dc2626; }
.oc-range-vendor {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

/* 时间线 */
.oc-timeline { border-left: 4px solid #8b5cf6; }
.oc-tl { display: flex; flex-direction: column; gap: 8px; }
.oc-tl-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.oc-tl-date {
  font-size: 11px;
  color: var(--text-light);
  width: 80px;
  flex-shrink: 0;
}
.oc-tl-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-price-up { background: #dc2626; }
.dot-new-model { background: #2563eb; }
.dot-price-down { background: #16a34a; }
.oc-tl-content { color: var(--text); line-height: 1.5; }
.oc-tl-vendor {
  font-weight: 700;
  margin-right: 6px;
}

@media (max-width: 768px) {
  .vendor-hero { flex-direction: column; align-items: flex-start; }
  .announce-list { grid-template-columns: 1fr; }
}
</style>
