<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="home-hero">
      <h1>战略客户部 · 华南拓展中心</h1>
      <p>数据 & 文档汇总 — 团队日常工作所需数据和文档的统一入口</p>
      <div class="home-stats">
        <div class="home-stat">
          <div class="num">{{ stats.categoryCount }}</div>
          <div class="label">文档分类</div>
        </div>
        <div class="home-stat">
          <div class="num">{{ currentPeriod }}</div>
          <div class="label">当前账期</div>
        </div>
        <div class="home-stat">
          <div class="num">{{ currentYear }}</div>
          <div class="label">财年</div>
        </div>
        <div class="home-stat">
          <div class="num">{{ stats.totalRecords }}</div>
          <div class="label">文档总数</div>
        </div>
      </div>
    </div>

    <!-- Grid Cards -->
    <div class="home-grid">
      <div
        v-for="card in cards"
        :key="card.path"
        class="home-card"
        @click="navigate(card.path)"
      >
        <div
          class="card-icon"
          :style="{ background: card.iconBg, color: card.iconColor }"
          v-html="card.icon"
        ></div>
        <span class="card-arrow">→</span>
        <h4>{{ card.title }}</h4>
        <p>{{ card.description }}</p>
        <span v-if="card.badge" class="card-badge" :class="card.badgeClass">
          {{ card.badge }}
        </span>
      </div>
    </div>

    <!-- Recent Updates -->
    <div class="home-recent">
      <div class="home-recent-header">
        <span>🕐 最近更新</span>
        <span class="header-count">{{ recentItems.length }} 条</span>
      </div>
      <div class="recent-list">
        <div
          v-for="item in recentItems"
          :key="item.id"
          class="home-recent-item"
          @click="navigate(item.path)"
        >
          <div
            class="r-icon"
            :style="{ background: item.iconBg, color: item.iconColor }"
            v-html="item.icon"
          ></div>
          <div class="r-content">
            <span class="r-title">{{ item.title }}</span>
            <span class="r-meta">
              <span class="r-tag" :style="{ background: item.tagBg, color: item.tagColor }">
                {{ item.tag }}
              </span>
              <span class="r-date">{{ item.date }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前账期计算（Q2 = 4月-6月）
const currentYear = computed(() => new Date().getFullYear())
const currentPeriod = computed(() => {
  const month = new Date().getMonth() + 1
  if (month >= 1 && month <= 3) return 'Q1'
  if (month >= 4 && month <= 6) return 'Q2'
  if (month >= 7 && month <= 9) return 'Q3'
  return 'Q4'
})

// 动态统计数据（模拟从API获取）
const stats = ref({
  categoryCount: 8,
  totalRecords: 26,
  lastUpdate: '2026-04-19 18:30'
})

// 导航卡片
const cards = [
  {
    path: '/sales-guide',
    title: '售卖弹药',
    description: '重点产品售卖弹药库：核心卖点、目标客户、话术模板、竞品对比、典型案例、销售FAQ',
    icon: '&#127919;',
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
    badge: '1款',
    badgeClass: 'info'
  },
  {
    path: '/discount',
    title: '报价折扣',
    description: '五档折扣体系、高价值客户折扣、普通客户折扣策略及审批流程',
    icon: '&#127991;',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    badge: '8条',
    badgeClass: 'success'
  },
  {
    path: '/cost',
    title: '成本变化',
    description: 'Q2 用户级核算单价变更通知，涉及 CVM/CBS/COS/CDB 等产品',
    icon: '&#128200;',
    iconBg: '#fef2f2',
    iconColor: '#ef4444',
    badge: 'NEW',
    badgeClass: 'new'
  },
  {
    path: '/product-guide',
    title: '产品售卖指引',
    description: '各产品线售卖策略、组合方案推荐、客户匹配建议',
    icon: '&#128230;',
    iconBg: '#fff7ed',
    iconColor: '#f97316',
    badge: '4章',
    badgeClass: 'warning'
  },
  {
    path: '/strategy',
    title: '客户战略分析',
    description: '重点客户经营情况 · AI 规划 · 出海战略 · 最新财报下载',
    icon: '&#127919;',
    iconBg: '#fefce8',
    iconColor: '#ca8a04',
    badge: '5家',
    badgeClass: 'info'
  },
  {
    path: '/news',
    title: 'AI 与云商动态',
    description: 'AI 领域大事件 · 阿里/火山/华为/AWS/谷歌等云厂商产业动态',
    icon: '&#128240;',
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed',
    badge: 'HOT',
    badgeClass: 'new'
  },
  {
    path: '/new-products',
    title: '官网上新',
    description: '每周汇总腾讯云官网新发布的产品、新功能、版本升级、价格变更信息',
    icon: '&#127381;',
    iconBg: '#ecfeff',
    iconColor: '#0891b2',
    badge: 'NEW',
    badgeClass: 'new'
  }
]

// 最近更新列表（模拟从API获取）
const recentItems = [
  {
    id: 98,
    path: '/sales-guide',
    title: '售卖弹药新增：腾讯云 TokenHub（一套 API 调所有大模型，Token Plan 月度订阅比直连省 50%+）',
    tag: '弹药',
    tagBg: '#f3e8ff',
    tagColor: '#7c3aed',
    date: '2026-04-20',
    icon: '&#128268;',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed'
  },
  {
    id: 99,
    path: '/sales-guide',
    title: '售卖弹药新增：腾讯云 ClawPro（企业 AI 智能体管控平台，OpenClaw 企业版）',
    tag: '弹药',
    tagBg: '#f3e8ff',
    tagColor: '#7c3aed',
    date: '2026-04-20',
    icon: '&#128299;',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed'
  },
  {
    id: 0,
    path: '/new-products',
    title: '本周官网上新：混元3D世界模型2.0开源 · 联网搜索API大幅降价',
    tag: '上新',
    tagBg: '#ecfeff',
    tagColor: '#0891b2',
    date: '2026-04-19',
    icon: '&#127381;',
    iconBg: '#ecfeff',
    iconColor: '#0891b2'
  },
  {
    id: 1,
    path: '/news',
    title: 'OpenAI 发布 GPT-5.5 Omni · Claude 4.7 · 混元 T2 重磅发布',
    tag: 'AI 动态',
    tagBg: '#f5f3ff',
    tagColor: '#7c3aed',
    date: '2026-04-19',
    icon: '&#128240;',
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed'
  },
  {
    id: 2,
    path: '/strategy',
    title: '客户战略分析新增：腾讯音乐娱乐集团（TME）2025 年报 + AI 规划 + 出海分析',
    tag: '战略',
    tagBg: '#fefce8',
    tagColor: '#ca8a04',
    date: '2026-04-20',
    icon: '&#127919;',
    iconBg: '#fefce8',
    iconColor: '#ca8a04'
  },
  {
    id: 22,
    path: '/strategy',
    title: '客户战略分析升级：新增经营情况 / AI规划 / 出海 / 财报下载',
    tag: '战略',
    tagBg: '#fefce8',
    tagColor: '#ca8a04',
    date: '2026-04-19',
    icon: '&#127919;',
    iconBg: '#fefce8',
    iconColor: '#ca8a04'
  },
  {
    id: 3,
    path: '/news',
    title: '阿里云 PAI 8.0 / 火山 AI 云原生 2.0 / 华为云盘古 6.0 密集发布',
    tag: '云商',
    tagBg: '#e0f2fe',
    tagColor: '#0369a1',
    date: '2026-04-18',
    icon: '&#9729;',
    iconBg: '#e0f2fe',
    iconColor: '#0369a1'
  },
  {
    id: 4,
    path: '/cost',
    title: 'Q2 成本变化通知（2026-04月账期生效）',
    tag: '重要',
    tagBg: '#fef2f2',
    tagColor: '#ef4444',
    date: '2026-04-17',
    icon: '&#128200;',
    iconBg: '#fef2f2',
    iconColor: '#ef4444'
  },
  {
    id: 5,
    path: '/discount',
    title: '折扣Discount：五档+高价值客户+普通客户',
    tag: '参考',
    tagBg: '#eef2ff',
    tagColor: '#2b5aed',
    date: '2026-04-15',
    icon: '&#127991;',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a'
  },
  {
    id: 6,
    path: '/sales-guide',
    title: 'Q2 销售目标拆解及跟进指引',
    tag: '更新',
    tagBg: '#f0fdf4',
    tagColor: '#16a34a',
    date: '2026-04-12',
    icon: '&#128218;',
    iconBg: '#eef2ff',
    iconColor: '#2b5aed'
  },
  {
    id: 7,
    path: '/product-guide',
    title: '腾讯云AI产品售卖指引 2026年版',
    tag: '新增',
    tagBg: '#fff7ed',
    tagColor: '#f97316',
    date: '2026-04-10',
    icon: '&#128230;',
    iconBg: '#fff7ed',
    iconColor: '#f97316'
  }
]

// 模拟加载统计数据
const loadStats = async () => {
  // TODO: 替换为实际API调用
  setTimeout(() => {
    stats.value = {
      categoryCount: 8,
      totalRecords: 26,
      lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
  }, 500)
}

const navigate = (path: string) => {
  router.push(path)
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.home-hero {
  background: linear-gradient(135deg, #2b5aed 0%, #6366f1 50%, #8b5cf6 100%);
  border-radius: var(--radius-lg);
  padding: 40px 44px;
  color: #fff;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.home-hero::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.home-hero::before {
  content: '';
  position: absolute;
  right: 60px;
  bottom: -60px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.home-hero h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.home-hero p {
  font-size: 14px;
  opacity: 0.85;
  position: relative;
  z-index: 1;
}

.home-stats {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  position: relative;
  z-index: 1;
}

.home-stat {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 14px 20px;
  min-width: 100px;
  text-align: center;
}

.home-stat .num {
  font-size: 22px;
  font-weight: 700;
}

.home-stat .label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.home-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.home-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.home-card .card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 14px;
}

.home-card h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.home-card p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.home-card .card-arrow {
  position: absolute;
  right: 18px;
  top: 22px;
  font-size: 16px;
  color: var(--text-light);
  transition: all 0.2s;
}

.home-card:hover .card-arrow {
  color: var(--primary);
  transform: translateX(3px);
}

.home-card .card-badge {
  display: inline-block;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  margin-top: 8px;
}

.card-badge.info {
  background: var(--primary-light);
  color: var(--primary);
}

.card-badge.success {
  background: #f0fdf4;
  color: #16a34a;
}

.card-badge.new {
  background: #fef2f2;
  color: #ef4444;
}

.card-badge.warning {
  background: #fff7ed;
  color: #f97316;
}

.home-recent {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.home-recent-header {
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-count {
  font-size: 12px;
  color: var(--text-light);
}

.recent-list {
  max-height: 320px;
  overflow-y: auto;
}

.home-recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.1s;
}

.home-recent-item:hover {
  background: var(--bg);
}

.home-recent-item .r-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.home-recent-item .r-content {
  flex: 1;
  min-width: 0;
}

.home-recent-item .r-title {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-recent-item .r-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.home-recent-item .r-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

.home-recent-item .r-date {
  color: var(--text-light);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .home-hero {
    padding: 28px 24px;
  }
  
  .home-hero h1 {
    font-size: 18px;
  }
  
  .home-stats {
    flex-wrap: wrap;
  }
  
  .home-grid {
    grid-template-columns: 1fr;
  }
  
  .home-card h4 {
    font-size: 14px;
  }
  
  .home-card p {
    font-size: 11px;
  }
}
</style>
