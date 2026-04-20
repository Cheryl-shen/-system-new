<template>
  <div class="news-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / AI 与云商动态
      </div>
      <h2>AI 与云商动态</h2>
      <p>每日更新 AI 领域大事件与阿里云/火山/华为云/AWS/谷歌云等行业动态</p>
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
          <div class="mt-title">AI 大事件</div>
          <div class="mt-sub">{{ aiNews.length }} 条资讯 · 数据参考 ai.hubtoday.app</div>
        </div>
      </div>
      <div
        class="main-tab"
        :class="{ active: mainTab === 'cloud' }"
        @click="mainTab = 'cloud'"
      >
        <span class="mt-icon">☁️</span>
        <div>
          <div class="mt-title">云商动态</div>
          <div class="mt-sub">{{ cloudNews.length }} 条资讯 · 阿里/火山/华为/AWS/谷歌</div>
        </div>
      </div>
    </div>

    <!-- AI 大事件 -->
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
        AI 大事件参考来源：<a href="https://ai.hubtoday.app/" target="_blank" rel="noopener">ai.hubtoday.app</a>
        + 各 AI 厂商官方博客 · <strong>每日更新</strong>
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

    <!-- 云商动态 -->
    <div v-if="mainTab === 'cloud'" class="content-section">
      <!-- 云商筛选 -->
      <div class="vendor-filter">
        <button
          class="vendor-btn"
          :class="{ active: vendorFilter === '全部' }"
          @click="vendorFilter = '全部'"
        >
          <span class="vendor-icon">📊</span>全部云商
          <span class="v-count">{{ cloudNews.length }}</span>
        </button>
        <button
          v-for="(cfg, v) in vendorConfig"
          :key="v"
          class="vendor-btn"
          :class="{ active: vendorFilter === v }"
          :style="vendorFilter === v ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color } : {}"
          @click="vendorFilter = v"
        >
          <span class="vendor-icon">{{ cfg.icon }}</span>{{ v }}
          <span class="v-count">{{ vendorCountMap[v] || 0 }}</span>
        </button>
      </div>

      <div class="news-source-tip">
        <span class="tip-icon">💡</span>
        云商动态来源：阿里云/火山引擎/华为云/AWS/谷歌云/腾讯云等官方博客及主流科技媒体 · <strong>每日更新</strong>
      </div>

      <div class="news-list">
        <div
          v-for="item in filteredCloudNews"
          :key="item.id"
          class="news-card vendor-card"
        >
          <div class="news-top">
            <span
              class="vendor-badge"
              :style="{
                background: vendorConfig[item.vendor].bg,
                color: vendorConfig[item.vendor].color
              }"
            >
              {{ vendorConfig[item.vendor].icon }} {{ item.vendor }}
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

      <EmptyState v-if="filteredCloudNews.length === 0" title="暂无匹配资讯" description="请调整筛选条件" />
    </div>

    <!-- 更新时间 -->
    <div class="page-footer">
      📅 最后更新：{{ lastUpdate }} <span class="update-badge">每日更新</span> | 数据参考：
      <a href="https://ai.hubtoday.app/" target="_blank" rel="noopener">ai.hubtoday.app</a>
      + 各云厂商官方博客
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { aiNews, cloudNews, vendorConfig, importanceConfig } from '@/data/newsData'

const router = useRouter()

// 最后更新时间 = 构建当天（每日自动构建即可保持"今天"）
const lastUpdate = ref(
  new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-')
)
const mainTab = ref<'ai' | 'cloud'>('ai')

// AI 筛选
const aiCategories = ['全部', '模型发布', '国产模型', 'Agent 生态', '行业投资']
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

// 云商筛选
const vendorFilter = ref<string>('全部')

const vendorCountMap = computed(() => {
  const map: Record<string, number> = {}
  cloudNews.forEach(n => {
    map[n.vendor] = (map[n.vendor] || 0) + 1
  })
  return map
})

const filteredCloudNews = computed(() => {
  if (vendorFilter.value === '全部') return cloudNews
  return cloudNews.filter(n => n.vendor === vendorFilter.value)
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

/* 顶部大 Tab */
.main-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}

.main-tab {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-white);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
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
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2b5aed, #6366f1);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.main-tab.active .mt-icon {
  background: linear-gradient(135deg, #2b5aed, #8b5cf6);
}

.mt-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.mt-sub {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 3px;
}

/* 来源提示 */
.news-source-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #92400e;
  margin-bottom: 16px;
}

.tip-icon {
  font-size: 14px;
}

.news-source-tip a {
  color: #b45309;
  text-decoration: underline;
  font-weight: 500;
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
  margin-bottom: 10px;
}

.filter-group:last-child { margin-bottom: 0; }

.filter-group label {
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 60px;
}

.filter-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { border-color: var(--primary); color: var(--text); }

.filter-btn.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 500;
}

.imp-icon { font-size: 11px; }

/* 云商筛选 */
.vendor-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.vendor-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-white);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.vendor-btn:hover {
  border-color: var(--primary);
  color: var(--text);
  transform: translateY(-1px);
}

.vendor-btn.active {
  font-weight: 600;
}

.vendor-icon { font-size: 14px; }

.v-count {
  font-size: 11px;
  background: var(--bg);
  color: var(--text-light);
  padding: 1px 7px;
  border-radius: 8px;
  margin-left: 4px;
}

.vendor-btn.active .v-count {
  background: rgba(255, 255, 255, 0.8);
}

/* 新闻列表 */
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
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

.imp-tag,
.vendor-badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.cat-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f3f4f6;
  color: var(--text-secondary);
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

.source-link {
  font-size: 11px;
  color: var(--primary);
  text-decoration: none;
  white-space: nowrap;
  font-weight: 500;
}

.source-link:hover { text-decoration: underline; }

.source-text {
  font-size: 11px;
  color: var(--text-light);
  white-space: nowrap;
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

.page-footer a {
  color: var(--primary);
  text-decoration: none;
}

.page-footer a:hover { text-decoration: underline; }

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

@media (max-width: 768px) {
  .main-tabs { grid-template-columns: 1fr; }
  .news-list { grid-template-columns: 1fr; }
  .mt-icon { width: 40px; height: 40px; font-size: 20px; }
}
</style>
