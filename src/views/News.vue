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
      <div
        class="main-tab price-tab"
        :class="{ active: mainTab === 'price' }"
        @click="mainTab = 'price'"
      >
        <span class="mt-icon price-icon">⚠️</span>
        <div>
          <div class="mt-title">
            云商异动预警
            <span class="new-tag">NEW</span>
          </div>
          <div class="mt-sub">{{ priceChangeNews.length }} 条涨价 · {{ deprecatedProducts.length }} 条产品下线 · 15 家头部云商横向对比</div>
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

    <!-- 全球云厂商涨价动态 -->
    <div v-if="mainTab === 'price'" class="content-section">
      <!-- 【本周新增涨价公告】 -->
      <div class="weekly-alert-section">
        <div class="weekly-alert-head">
          <span class="wa-icon">🔔</span>
          <h3 class="wa-title">云厂商涨价动态 | 本周新增（4月19-25日）</h3>
        </div>
        <p class="wa-intro">本周数据已同步更新，重点关注以下新增动态：</p>
        <div class="wa-body">
          <div class="wa-vendor-block">
            <div class="wa-vendor-title">
              <span class="wa-vt-icon" style="background:#fff7ed;color:#ff6a00">🟠</span>
              <strong>阿里云 HappyHorse 视频 API（新增重磅）</strong>
            </div>
            <ul class="wa-list">
              <li><strong>4月20日官宣</strong>：HappyHorse-1.0 视频模型将于 <strong>4月27日</strong>通过百炼平台开放企业级 API 邀测，<strong>5月推出商用版</strong>。登顶 Artificial Analysis 视频榜第一，直接对标字节 Seedance 2.0</li>
              <li><strong>7月15日生效</strong>：此前公告 DDoS 高防（中国内地）弹性95费用上调 <strong>50%</strong>（100元→150元/兆瓦月）</li>
            </ul>
          </div>
          <div class="wa-vendor-block">
            <div class="wa-vendor-title">
              <span class="wa-vt-icon" style="background:#fef2f2;color:#dc2626">🌋</span>
              <strong>火山引擎 Seedance 2.0（新增升级）</strong>
            </div>
            <ul class="wa-list">
              <li><strong>4月21日</strong>：Seedance 2.0 API <strong>原生 1080P</strong>全高清视频生成能力正式上线，单 Token 消耗较 720P 提升约 1.8 倍，企业 AI 视频成本结构随即调整</li>
            </ul>
          </div>
          <div class="wa-vendor-block">
            <div class="wa-vendor-title">
              <span class="wa-vt-icon" style="background:#fffbeb;color:#f59e0b">🟡</span>
              <strong>AWS × Anthropic（千亿长约）</strong>
            </div>
            <ul class="wa-list">
              <li><strong>4月21日</strong>：AWS 追加投资 Anthropic 最高 <strong>250 亿美元</strong>，Anthropic 承诺未来十年在 AWS 投入超 <strong>1,000 亿美元</strong>算力，以 Trainium 为主。H100/H200 对外放量节奏将进一步收紧，预计推动 AWS 二季度 GPU 实例再现 5%-10% 微调</li>
            </ul>
          </div>
          <div class="wa-vendor-block">
            <div class="wa-vendor-title">
              <span class="wa-vt-icon" style="background:#e0f2fe;color:#00a4ff">🐧</span>
              <strong>腾讯云 & 混元（本周持续）</strong>
            </div>
            <ul class="wa-list">
              <li><strong>4月16日</strong>：开源 3D 世界模型 HY-World 2.0，腾讯云 TI 平台同步上线训练/推理镜像</li>
              <li><strong>5月9日生效（4月9日公告）</strong>：AI 算力、容器服务 TKE 原生节点、弹性 MapReduce（EMR）三类产品统一上调 <strong>5%</strong></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 【本轮涨价全景】 -->
      <div class="panorama-section">
        <div class="panorama-head">
          <span class="pa-icon">📊</span>
          <h3 class="pa-title">各家云厂商涨价策略一览表</h3>
          <div class="compare-legend">
            <span class="lg-item"><span class="lg-dot overseas"></span>海外</span>
            <span class="lg-item"><span class="lg-dot domestic"></span>国内</span>
          </div>
        </div>
        <div class="panorama-table-wrap">
          <table class="panorama-table">
            <thead>
              <tr>
                <th class="col-vendor">云厂商</th>
                <th class="col-region">地域</th>
                <th class="col-range">涨幅</th>
                <th class="col-products">核心涨价产品</th>
                <th class="col-date">生效日期</th>
                <th class="col-strategy-impact">策略定位 / 客户影响</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#e0f2fe;color:#00a4ff">
                    <span>🐧</span>腾讯云
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fee2e2;color:#dc2626"><strong>+5% ~ +463%</strong><span class="highest-flag">🔥 最高</span></span></td>
                <td><span class="mini-tag">混元 HY 2.0 Instruct</span><span class="mini-tag">AI 算力</span><span class="mini-tag">TKE 原生节点</span><span class="mini-tag">EMR</span><span class="mini-tag">GLM5/MiniMax/Kimi 代理</span></td>
                <td class="date-cell">2026-03-13 / 05-09</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#dc262622;color:#dc2626;border-color:#dc262655">Token 重定价 · 双轮推进</span>
                  <p class="impact-text">混元输入 Token 单项涨 463%（0.0008→0.004505 元/千tokens）；AI 算力/容器/EMR 再统一 +5%</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#fff7ed;color:#ff6a00">
                    <span>🟠</span>阿里云
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fee2e2;color:#dc2626"><strong>+2% ~ +50%</strong></span></td>
                <td><span class="mini-tag">GPU 云服务器</span><span class="mini-tag">OSS 归档</span><span class="mini-tag">Qwen3-Max/VL</span><span class="mini-tag">DDoS高防</span><span class="mini-tag">MU</span></td>
                <td class="date-cell">2026-04-20 / 07-15</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#ea580c22;color:#ea580c;border-color:#ea580c55">双轮驱动 · 全面提价</span>
                  <p class="impact-text">年内多次调价，压力传导至全线客户</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#eef2ff;color:#1e40af">
                    <span>🐻</span>百度智能云
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fee2e2;color:#dc2626"><strong>+5% ~ +30%</strong></span></td>
                <td><span class="mini-tag">文心 X2 旗舰版</span><span class="mini-tag">AI 算力</span><span class="mini-tag">千帆 ModelBuilder</span></td>
                <td class="date-cell">2026-05-01</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#ea580c22;color:#ea580c;border-color:#ea580c55">回归正价 · 告别补贴</span>
                  <p class="impact-text">旗舰模型重定价，低价引流期结束</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#eff6ff;color:#3b82f6">
                    <span>🔷</span>智谱 AI
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fee2e2;color:#dc2626"><strong>+8% ~ +22.5%</strong></span></td>
                <td><span class="mini-tag">GLM-5.1 API</span><span class="mini-tag">GLM Coding Plan</span><span class="mini-tag">GLM-5-Turbo</span></td>
                <td class="date-cell">2026-04-08</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#f59e0b22;color:#f59e0b;border-color:#f59e0b55">三次调价 · 逼近 Claude</span>
                  <p class="impact-text">Coding Plan 取消首购优惠，海外版定价对标国际</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#fffbeb;color:#f59e0b">
                    <span>🟡</span>AWS
                  </span>
                </td>
                <td><span class="region-tag overseas-tag">🌍 海外</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>+15%</strong></span></td>
                <td><span class="mini-tag">EC2 Capacity Blocks</span><span class="mini-tag">p5e.48xlarge</span><span class="mini-tag">H100/H200</span></td>
                <td class="date-cell">2026-04-11</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#f59e0b22;color:#f59e0b;border-color:#f59e0b55">锁定算力 · 延长周期</span>
                  <p class="impact-text">预留窗口 1 年→2 年，捆绑性更强</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#ecfdf5;color:#10b981">
                    <span>🌙</span>Kimi
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>+20%</strong></span></td>
                <td><span class="mini-tag">Kimi 2.5 API</span><span class="mini-tag">Kimi 3 API</span><span class="mini-tag">Kimi 开发者联盟</span></td>
                <td class="date-cell">2026-03-13</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#f59e0b22;color:#f59e0b;border-color:#f59e0b55">长文本领先 · 结束补贴</span>
                  <p class="impact-text">200万上下文算力成本高，正式商业定价</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#f3e8ff;color:#8b5cf6">
                    <span>💜</span>MiniMax
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>+12% ~ +15%</strong></span></td>
                <td><span class="mini-tag">MiniMax 2.5 Text API</span><span class="mini-tag">MiniMax 2.5 Voice API</span></td>
                <td class="date-cell">2026-03-13</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#f59e0b22;color:#f59e0b;border-color:#f59e0b55">公测结束 · 正式计费</span>
                  <p class="impact-text">结束公测补贴，推出开发者扶持返点计划</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#fef2f2;color:#c74634">
                    <span>🟥</span>Oracle云
                  </span>
                </td>
                <td><span class="region-tag overseas-tag">🌍 海外</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>+12%</strong></span></td>
                <td><span class="mini-tag">OCI GPU BM 实例</span><span class="mini-tag">H100</span><span class="mini-tag">B200</span></td>
                <td class="date-cell">2026-04-10</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">独家芯片 · 差异化溢价</span>
                  <p class="impact-text">与 NVIDIA 5 年独家，B200 订阅起售</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#ecfeff;color:#06b6d4">
                    <span>👁️</span>商汤科技
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>平均 +12%</strong></span></td>
                <td><span class="mini-tag">SenseCore 推理服务</span><span class="mini-tag">日日新 5.5 API</span><span class="mini-tag">企业算力包</span></td>
                <td class="date-cell">近期</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">算力包锁价 · 长约换稳</span>
                  <p class="impact-text">推出企业算力包，12个月锁价换更长合约</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#e0f2fe;color:#0078d4">
                    <span>🪟</span>微软 Azure
                  </span>
                </td>
                <td><span class="region-tag overseas-tag">🌍 海外</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>+8% ~ +12%</strong></span></td>
                <td><span class="mini-tag">Azure OpenAI</span><span class="mini-tag">GPT-5.5</span><span class="mini-tag">o4</span><span class="mini-tag">Fine-tuning</span></td>
                <td class="date-cell">2026-04-15</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">Token 提价 · 取消免费</span>
                  <p class="impact-text">训练 +15%、免费额度取消，新用户门槛提升</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#fef2f2;color:#dc2626">
                    <span>🌋</span>火山引擎
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fef3c7;color:#b45309"><strong>+8% ~ +12%</strong></span></td>
                <td><span class="mini-tag">豆包 Pro 企业版</span><span class="mini-tag">SLA 套餐</span></td>
                <td class="date-cell">2026-04-14</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">规模领跑 · 优化结构</span>
                  <p class="impact-text">首次涨价，引入 18 个月 SLA 包年锁客</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#eff6ff;color:#4285f4">
                    <span>🔵</span>谷歌云
                  </span>
                </td>
                <td><span class="region-tag overseas-tag">🌍 海外</span></td>
                <td><span class="range-cell" style="background:#fef9c3;color:#a16207"><strong>+7% ~ +10%</strong></span></td>
                <td><span class="mini-tag">Vertex AI</span><span class="mini-tag">Gemini 3.0 Pro</span><span class="mini-tag">TPU v5e/v5p</span></td>
                <td class="date-cell">2026-04-16</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">折扣收紧 · 隐性涨价</span>
                  <p class="impact-text">1 年 CUD 折扣 55%→45%，长约客户受冲击</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#ecfdf5;color:#10a37f">
                    <span>🤖</span>OpenAI
                  </span>
                </td>
                <td><span class="region-tag overseas-tag">🌍 海外</span></td>
                <td><span class="range-cell" style="background:#fef9c3;color:#a16207"><strong>+6% ~ +10%（隐性）</strong></span></td>
                <td><span class="mini-tag">GPT-5 API</span><span class="mini-tag">GPT-5-mini</span><span class="mini-tag">Omni 多模态 Token</span></td>
                <td class="date-cell">2026-04-18</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">计费重构 · 变相提价</span>
                  <p class="impact-text">多模态 Token 重定价，综合成本反升</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#fee2e2;color:#e11d48">
                    <span>🔴</span>华为云
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#fef9c3;color:#a16207"><strong>+6% ~ +10%</strong></span></td>
                <td><span class="mini-tag">盘古行业大模型</span><span class="mini-tag">昇腾 910D</span></td>
                <td class="date-cell">2026-04-16</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#eab30822;color:#eab308;border-color:#eab30855">国产算力 · 稳健提价</span>
                  <p class="impact-text">盘古 6.0 升级定价，昇腾预留 64 卡起订</p>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="pa-cell-vendor" style="background:#fff7ed;color:#f97316">
                    <span>🎙️</span>科大讯飞
                  </span>
                </td>
                <td><span class="region-tag domestic-tag">🇨🇳 国内</span></td>
                <td><span class="range-cell" style="background:#dcfce7;color:#15803d"><strong>+8%</strong></span></td>
                <td><span class="mini-tag">讯飞智算平台</span><span class="mini-tag">星火大模型 API</span><span class="mini-tag">智算中心租赁</span></td>
                <td class="date-cell">2026-03-31</td>
                <td class="strategy-impact-cell">
                  <span class="strategy-chip" style="background:#10b98122;color:#10b981;border-color:#10b98155">国产算力 · 首次调价</span>
                  <p class="impact-text">年内首次调价，国产芯片供应紧张</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="compare-footnote">
          <span class="fn-item"><strong style="color:#ef4444;">🔥 标红行</strong>：本轮涨价潮单项涨幅最高的厂商</span>
          <span class="fn-item"><strong>涨幅颜色深度</strong>：颜色越深代表涨幅越大，便于快速识别压力点</span>
          <span class="fn-item"><strong>策略定位</strong>：基于涨价幅度、产品范围、配套政策综合判定</span>
          <span class="fn-item"><strong>新增厂商</strong>：智谱AI、MiniMax、Kimi、商汤、科大讯飞已纳入本轮汇总</span>
        </div>
      </div>

      <!-- 【新】产品下线与收缩告警 - 异常情况汇总 -->
      <div class="deprecated-section">
        <div class="deprecated-head">
          <div class="dp-title-wrap">
            <span class="dp-icon-big">🚨</span>
            <div>
              <h3 class="dp-title">
                产品下线 / 停服 / 收缩告警
                <span class="dp-alert-badge">⚠️ 异常情况</span>
              </h3>
              <p class="dp-sub">
                除涨价外，近期云厂商同步宣布
                <strong class="dp-strong">{{ deprecatedProducts.length }}</strong>
                项产品停运/下线/收缩，涉及
                <strong class="dp-strong">{{ deprecatedVendorsCount }}</strong>
                家云商 · <strong>务必排查是否影响现网业务</strong>
              </p>
            </div>
          </div>
          <div class="dp-stat-row">
            <div class="dp-stat dp-stat-shutdown">
              <div class="dp-stat-num">{{ shutdownCount }}</div>
              <div class="dp-stat-label">🔴 完全停服</div>
            </div>
            <div class="dp-stat dp-stat-eol">
              <div class="dp-stat-num">{{ eolCount }}</div>
              <div class="dp-stat-label">🟠 产品停售/EOL</div>
            </div>
            <div class="dp-stat dp-stat-shrink">
              <div class="dp-stat-num">{{ shrinkCount }}</div>
              <div class="dp-stat-label">🟡 功能/地域收缩</div>
            </div>
          </div>
        </div>

        <!-- 筛选 -->
        <div class="dp-filter">
          <button
            class="dp-filter-btn"
            :class="{ active: deprecatedFilter === '全部' }"
            @click="deprecatedFilter = '全部'"
          >全部 <span class="dp-fc">{{ deprecatedProducts.length }}</span></button>
          <button
            v-for="type in deprecatedTypes"
            :key="type"
            class="dp-filter-btn"
            :class="{ active: deprecatedFilter === type }"
            @click="deprecatedFilter = type"
          >
            {{ deprecatedTypeConfig[type].icon }} {{ type }}
            <span class="dp-fc">{{ deprecatedTypeCount[type] || 0 }}</span>
          </button>
        </div>

        <!-- 告警卡片列表 -->
        <div class="deprecated-list">
          <div
            v-for="item in filteredDeprecated"
            :key="item.id"
            class="deprecated-card"
            :class="'severity-' + item.severity"
          >
            <!-- 左侧竖条 -->
            <div class="dp-side-bar" :style="{ background: deprecatedTypeConfig[item.type].color }"></div>

            <div class="dp-card-body">
              <div class="dp-card-top">
                <span
                  class="dp-vendor-chip"
                  :style="{
                    background: vendorConfig[item.vendor]?.bg || '#f3f4f6',
                    color: vendorConfig[item.vendor]?.color || '#374151'
                  }"
                >
                  <span>{{ vendorConfig[item.vendor]?.icon || '☁️' }}</span>
                  {{ item.vendor }}
                </span>
                <span
                  class="dp-type-chip"
                  :style="{
                    background: deprecatedTypeConfig[item.type].bg,
                    color: deprecatedTypeConfig[item.type].color
                  }"
                >
                  {{ deprecatedTypeConfig[item.type].icon }} {{ item.type }}
                </span>
                <span class="dp-severity-chip" :class="'sev-' + item.severity">
                  {{ severityLabel(item.severity) }}
                </span>
                <span class="dp-announce-date">📅 公告：{{ item.announceDate }}</span>
              </div>

              <h4 class="dp-product-name">
                <span class="dp-prod-icon">📦</span>
                {{ item.product }}
              </h4>
              <p class="dp-reason">{{ item.reason }}</p>

              <!-- 时间节点 -->
              <div class="dp-timeline">
                <div class="dp-tl-item dp-tl-stop">
                  <div class="dp-tl-label">⛔ 停止新购</div>
                  <div class="dp-tl-date">{{ item.stopSellDate || '已停止' }}</div>
                </div>
                <div class="dp-tl-arrow">→</div>
                <div class="dp-tl-item dp-tl-eol">
                  <div class="dp-tl-label">🚫 {{ item.type === '功能收缩' || item.type === '地域收缩' ? '功能下线' : '彻底停服' }}</div>
                  <div class="dp-tl-date dp-tl-date-end">{{ item.endOfLifeDate }}</div>
                </div>
                <div class="dp-tl-arrow">→</div>
                <div class="dp-tl-item dp-tl-migrate">
                  <div class="dp-tl-label">✅ 建议迁移方案</div>
                  <div class="dp-tl-date dp-tl-migrate-text">{{ item.migration }}</div>
                </div>
              </div>

              <!-- 影响范围 -->
              <div class="dp-impact-row">
                <span class="dp-impact-label">💥 影响客户：</span>
                <span class="dp-impact-text">{{ item.affectedCustomers }}</span>
              </div>

              <div class="dp-footer">
                <div class="dp-tags">
                  <span v-for="(t, i) in item.tags" :key="i" class="dp-tag">#{{ t }}</span>
                </div>
                <a
                  v-if="item.sourceUrl"
                  class="dp-source"
                  :href="item.sourceUrl"
                  target="_blank"
                  rel="noopener"
                >查看官方公告 →</a>
              </div>
            </div>
          </div>
        </div>

        <EmptyState
          v-if="filteredDeprecated.length === 0"
          title="该类型暂无异常告警"
          description="请切换筛选条件查看"
        />

        <!-- 行动指引 -->
        <div class="dp-action-tip">
          <span class="dp-at-icon">💡</span>
          <div class="dp-at-content">
            <strong>销售行动指引：</strong>
            立即排查客户现网是否使用上述产品，
            <strong style="color:#dc2626;">🔴 完全停服</strong> 类需在 30 天内给出迁移方案；
            <strong style="color:#ea580c;">🟠 产品停售/EOL</strong> 类可借机推腾讯云同类产品替代；
            <strong style="color:#d97706;">🟡 功能/地域收缩</strong> 需提前沟通避免业务中断。
          </div>
        </div>
      </div>

      <!-- 数据速览卡片 -->
      <div class="price-overview">
        <div class="ov-card overseas">
          <div class="ov-icon">🌍</div>
          <div class="ov-content">
            <div class="ov-label">海外云厂商</div>
            <div class="ov-value">{{ overseasCount }} 条</div>
            <div class="ov-sub">平均涨幅 8% ~ 15%</div>
          </div>
        </div>
        <div class="ov-card domestic">
          <div class="ov-icon">🇨🇳</div>
          <div class="ov-content">
            <div class="ov-label">国内云厂商</div>
            <div class="ov-value">{{ domesticCount }} 条</div>
            <div class="ov-sub">最高单项涨幅 +463%</div>
          </div>
        </div>
        <div class="ov-card range">
          <div class="ov-icon">📊</div>
          <div class="ov-content">
            <div class="ov-label">统计周期</div>
            <div class="ov-value">本轮全周期</div>
            <div class="ov-sub">2026.03.01 ~ 2026.04.21</div>
          </div>
        </div>
        <div class="ov-card insight">
          <div class="ov-icon">🔥</div>
          <div class="ov-content">
            <div class="ov-label">核心结论</div>
            <div class="ov-value">20 年降价史终结</div>
            <div class="ov-sub">Token 爆炸 + GPU 紧缺双驱</div>
          </div>
        </div>
      </div>

      <!-- 地域筛选 -->
      <div class="region-tabs">
        <button
          v-for="r in regionOptions"
          :key="r"
          class="region-tab"
          :class="{ active: regionFilter === r }"
          @click="regionFilter = r"
        >
          {{ r }}
          <span class="r-count">{{ regionCountMap[r] || 0 }}</span>
        </button>
      </div>

      <div class="news-source-tip">
        <span class="tip-icon">💡</span>
        涨价动态来源：各云厂商官方定价页/公告、AWS/Azure/GCP 官方博客、证券日报、财联社、SemiAnalysis、IT时报、36氪 · <strong>统计周期 2026.03.01 - 2026.04.21（本轮涨价全周期汇总）</strong>
      </div>

      <!-- 涨价清单 -->
      <div class="price-list">
        <div
          v-for="item in filteredPriceNews"
          :key="item.id"
          class="price-card"
        >
          <div class="price-card-header">
            <span
              class="vendor-badge"
              :style="{
                background: vendorConfig[item.vendor]?.bg || '#f3f4f6',
                color: vendorConfig[item.vendor]?.color || '#6b7280'
              }"
            >
              {{ vendorConfig[item.vendor]?.icon || '☁️' }} {{ item.vendor }}
            </span>
            <span class="region-tag" :class="item.region === '海外' ? 'overseas-tag' : 'domestic-tag'">
              {{ item.region === '海外' ? '🌍 海外' : '🇨🇳 国内' }}
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
            <span class="price-range">
              {{ item.rangeText }}
            </span>
            <span class="news-date">{{ item.date }}</span>
          </div>

          <h3 class="news-title">
            <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </h3>

          <p class="news-summary">{{ item.summary }}</p>

          <div class="price-meta">
            <div class="meta-row">
              <span class="meta-label">📅 生效时间：</span>
              <span class="meta-value effective">{{ item.effectiveDate }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">📦 涉及产品：</span>
              <div class="product-tags">
                <span v-for="(p, i) in item.products" :key="i" class="product-tag">{{ p }}</span>
              </div>
            </div>
            <div class="meta-row">
              <span class="meta-label">💡 涨价原因：</span>
              <span class="meta-value reason">{{ item.reason }}</span>
            </div>
          </div>

          <div class="news-footer">
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

      <EmptyState v-if="filteredPriceNews.length === 0" title="暂无匹配涨价动态" description="请调整筛选条件" />

      <!-- 策略分析 -->
      <div class="strategy-section">
        <div class="section-title">
          <span class="st-icon">🔍</span>
          <h3>全球云厂商涨价策略深度分析</h3>
          <span class="st-sub">6 大维度 · 透视 20 年降价史终结背后的产业逻辑</span>
        </div>

        <div class="strategy-grid">
          <div
            v-for="(insight, idx) in priceStrategyInsights"
            :key="idx"
            class="strategy-card"
            :style="{ '--accent': insight.color }"
          >
            <div class="strategy-head">
              <span class="strategy-icon" :style="{ background: insight.color + '22', color: insight.color }">
                {{ insight.icon }}
              </span>
              <h4>{{ insight.title }}</h4>
            </div>
            <ul class="strategy-points">
              <li v-for="(p, pi) in insight.points" :key="pi">
                <span class="dot" :style="{ background: insight.color }"></span>
                <span>{{ p }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 总结 -->
        <div class="conclusion-card">
          <div class="cc-head">
            <span class="cc-icon">📌</span>
            <span class="cc-title">一句话总结</span>
          </div>
          <p class="cc-body">
            2026 年 4 月的这半个月，是全球云计算从"以价换量"向"以价换 Token 定价权"转型的关键节点：
            <strong>海外以 AWS、Azure、GCP 为代表梯次提价 8%-15%</strong>，
            <strong>国内以腾讯云混元（单项 +463%）、阿里云、百度云为代表开启本轮涨价潮</strong>，
            <strong>拥有自研芯片 + Agent 生态闭环的厂商将率先获得下一轮议价主动权</strong>，
            中小客户需在 Q2 内完成预留续费、多模型路由和 Token 节流架构改造，以对冲未来 2-3 轮跟进涨价。
          </p>
        </div>
      </div>
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
import { aiNews, cloudNews, vendorConfig, importanceConfig, priceChangeNews, priceStrategyInsights } from '@/data/newsData'

const router = useRouter()

// 最后更新时间 = 构建当天（每日自动构建即可保持"今天"）
const lastUpdate = ref(
  new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-')
)
const mainTab = ref<'ai' | 'cloud' | 'price'>('ai')

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

// 涨价动态筛选
const regionOptions = ['全部', '海外', '国内']
const regionFilter = ref<string>('全部')

const regionCountMap = computed<Record<string, number>>(() => ({
  全部: priceChangeNews.length,
  海外: priceChangeNews.filter(n => n.region === '海外').length,
  国内: priceChangeNews.filter(n => n.region === '国内').length
}))

const overseasCount = computed(() => priceChangeNews.filter(n => n.region === '海外').length)
const domesticCount = computed(() => priceChangeNews.filter(n => n.region === '国内').length)

const filteredPriceNews = computed(() => {
  if (regionFilter.value === '全部') return priceChangeNews
  return priceChangeNews.filter(n => n.region === regionFilter.value)
})

// 各家云厂商涨价策略对比表
interface CompareRow {
  vendor: string
  region: '海外' | '国内'
  rangeText: string
  maxPct: number // 最大涨幅百分比，用于颜色深浅
  products: string[]
  effectiveDate: string
  strategyLabel: string
  strategyColor: string
  impact: string
  isHighest?: boolean
}

const compareRows: CompareRow[] = [
  {
    vendor: '百度云',
    region: '国内',
    rangeText: '+8% ~ +463%',
    maxPct: 463,
    products: ['文心 X2 旗舰版', 'AI 算力', '千帆'],
    effectiveDate: '2026-05-01',
    strategyLabel: '回归正价 · 告别补贴',
    strategyColor: '#dc2626',
    impact: '旗舰模型重定价，低价引流期结束',
    isHighest: true
  },
  {
    vendor: '阿里云',
    region: '国内',
    rangeText: '+2% ~ +50%',
    maxPct: 50,
    products: ['GPU 云服务器', 'OSS 归档', 'Qwen3-Max/VL', 'DDoS高防', 'MU'],
    effectiveDate: '2026-04-20 / 07-15',
    strategyLabel: '双轮驱动 · 全面提价',
    strategyColor: '#ea580c',
    impact: '年内多次调价，压力传导至全线客户'
  },
  {
    vendor: '智谱AI',
    region: '国内',
    rangeText: '+8% ~ +22.5%',
    maxPct: 22.5,
    products: ['GLM-5.1 API', 'GLM Coding Plan', 'GLM-5-Turbo'],
    effectiveDate: '2026-04-08',
    strategyLabel: '三次调价 · 逼近 Claude',
    strategyColor: '#f59e0b',
    impact: 'Coding Plan 取消首购优惠，海外版定价对标国际'
  },
  {
    vendor: 'AWS',
    region: '海外',
    rangeText: '+15%',
    maxPct: 15,
    products: ['EC2 Capacity Blocks', 'p5e.48xlarge', 'H100/H200'],
    effectiveDate: '2026-04-11',
    strategyLabel: '锁定算力 · 延长周期',
    strategyColor: '#f59e0b',
    impact: '预留窗口 1 年→2 年，捆绑性更强'
  },
  {
    vendor: 'Kimi',
    region: '国内',
    rangeText: '+20%',
    maxPct: 20,
    products: ['Kimi 2.5 API', 'Kimi 3 API', 'Kimi 开发者联盟'],
    effectiveDate: '2026-03-13',
    strategyLabel: '长文本领先 · 结束补贴',
    strategyColor: '#f59e0b',
    impact: '200万上下文算力成本高，正式商业定价'
  },
  {
    vendor: 'MiniMax',
    region: '国内',
    rangeText: '+12% ~ +15%',
    maxPct: 15,
    products: ['MiniMax 2.5 Text API', 'MiniMax 2.5 Voice API'],
    effectiveDate: '2026-03-13',
    strategyLabel: '公测结束 · 正式计费',
    strategyColor: '#f59e0b',
    impact: '结束公测补贴，推出开发者扶持返点计划'
  },
  {
    vendor: 'Oracle云',
    region: '海外',
    rangeText: '+12%',
    maxPct: 12,
    products: ['OCI GPU BM 实例', 'H100', 'B200'],
    effectiveDate: '2026-04-10',
    strategyLabel: '独家芯片 · 差异化溢价',
    strategyColor: '#eab308',
    impact: '与 NVIDIA 5 年独家，B200 订阅起售'
  },
  {
    vendor: '商汤科技',
    region: '国内',
    rangeText: '平均 +12%',
    maxPct: 12,
    products: ['SenseCore 推理服务', '日日新 5.5 API', '企业算力包'],
    effectiveDate: '近期',
    strategyLabel: '算力包锁价 · 长约换稳',
    strategyColor: '#eab308',
    impact: '推出企业算力包，12个月锁价换更长合约'
  },
  {
    vendor: '微软云',
    region: '海外',
    rangeText: '+8% ~ +12%',
    maxPct: 12,
    products: ['Azure OpenAI', 'GPT-5.5', 'o4', 'Fine-tuning'],
    effectiveDate: '2026-04-15',
    strategyLabel: 'Token 提价 · 取消免费',
    strategyColor: '#eab308',
    impact: '训练 +15%、免费额度取消，新用户门槛提升'
  },
  {
    vendor: '火山引擎',
    region: '国内',
    rangeText: '+8% ~ +12%',
    maxPct: 12,
    products: ['豆包 Pro 企业版', 'SLA 套餐'],
    effectiveDate: '2026-04-14',
    strategyLabel: '规模领跑 · 优化结构',
    strategyColor: '#eab308',
    impact: '首次涨价，引入 18 个月 SLA 包年锁客'
  },
  {
    vendor: '谷歌云',
    region: '海外',
    rangeText: '+7% ~ +10%',
    maxPct: 10,
    products: ['Vertex AI', 'Gemini 3.0 Pro', 'TPU v5e/v5p'],
    effectiveDate: '2026-04-16',
    strategyLabel: '折扣收紧 · 隐性涨价',
    strategyColor: '#eab308',
    impact: '1 年 CUD 折扣 55%→45%，长约客户受冲击'
  },
  {
    vendor: 'OpenAI',
    region: '海外',
    rangeText: '+6% ~ +10%（隐性）',
    maxPct: 10,
    products: ['GPT-5 API', 'GPT-5-mini', 'Omni 多模态 Token'],
    effectiveDate: '2026-04-18',
    strategyLabel: '计费重构 · 变相提价',
    strategyColor: '#eab308',
    impact: '多模态 Token 重定价，综合成本反升'
  },
  {
    vendor: '华为云',
    region: '国内',
    rangeText: '+6% ~ +10%',
    maxPct: 10,
    products: ['盘古行业大模型', '昇腾 910D'],
    effectiveDate: '2026-04-16',
    strategyLabel: '国产算力 · 稳健提价',
    strategyColor: '#eab308',
    impact: '盘古 6.0 升级定价，昇腾预留 64 卡起订'
  },
  {
    vendor: '科大讯飞',
    region: '国内',
    rangeText: '+8%',
    maxPct: 8,
    products: ['讯飞智算平台', '星火大模型 API', '智算中心租赁'],
    effectiveDate: '2026-03-31',
    strategyLabel: '国产算力 · 首次调价',
    strategyColor: '#10b981',
    impact: '年内首次调价，国产芯片供应紧张'
  },
  {
    vendor: '腾讯云',
    region: '国内',
    rangeText: '+5%',
    maxPct: 5,
    products: ['AI 算力', 'TKE 原生节点', 'EMR'],
    effectiveDate: '2026-05-09',
    strategyLabel: '温和普调 · 锁定长尾',
    strategyColor: '#10b981',
    impact: '三大产品统一 5%，年内第二次调价'
  }
]

function getRangeBg(pct: number): string {
  if (pct >= 100) return 'linear-gradient(135deg, #dc2626, #991b1b)'
  if (pct >= 20) return 'linear-gradient(135deg, #fca5a5, #f87171)'
  if (pct >= 12) return 'linear-gradient(135deg, #fed7aa, #fdba74)'
  if (pct >= 8) return 'linear-gradient(135deg, #fef3c7, #fde68a)'
  return 'linear-gradient(135deg, #d1fae5, #a7f3d0)'
}

function getRangeColor(pct: number): string {
  if (pct >= 100) return '#ffffff'
  if (pct >= 20) return '#7f1d1d'
  if (pct >= 12) return '#9a3412'
  if (pct >= 8) return '#854d0e'
  return '#065f46'
}

// ========== 产品下线 / 停服 / 收缩 告警数据 ==========
type DeprecatedType = '完全停服' | '产品停售/EOL' | '功能收缩' | '地域收缩'
type Severity = 'critical' | 'high' | 'medium'

interface DeprecatedItem {
  id: number
  vendor: string
  product: string
  type: DeprecatedType
  severity: Severity
  announceDate: string
  stopSellDate: string
  endOfLifeDate: string
  reason: string
  migration: string
  affectedCustomers: string
  tags: string[]
  sourceUrl?: string
}

const deprecatedProducts: DeprecatedItem[] = [
  {
    id: 1,
    vendor: '阿里云',
    product: 'Elastic Search Serverless 服务',
    type: '完全停服',
    severity: 'critical',
    announceDate: '2026-04-08',
    stopSellDate: '2026-05-01',
    endOfLifeDate: '2026-11-30',
    reason: 'Serverless 模式成本高企、利用率不及预期，官方建议迁移至标准版 ES 或阿里云 OpenSearch。',
    migration: '迁移至阿里云 ES 标准版 / OpenSearch / 或切换腾讯云 ES Serverless（同价 8 折）',
    affectedCustomers: '中小电商、日志分析、搜索业务客户 · 约 2000+ 企业',
    tags: ['Serverless', 'ES', '搜索', '下线'],
    sourceUrl: 'https://help.aliyun.com'
  },
  {
    id: 2,
    vendor: '阿里云',
    product: '函数计算 FC 1.0 旧版',
    type: '产品停售/EOL',
    severity: 'high',
    announceDate: '2026-04-05',
    stopSellDate: '2026-04-30',
    endOfLifeDate: '2026-12-31',
    reason: '全面切换至 FC 3.0 架构，1.0 旧版控制台入口下线，存量资源需手动迁移。',
    migration: '官方提供 FC 1.0 → 3.0 一键迁移工具，或迁移至腾讯云 SCF',
    affectedCustomers: '所有仍使用 FC 1.0 的存量客户',
    tags: ['FunctionCompute', 'Serverless', '版本升级']
  },
  {
    id: 3,
    vendor: '谷歌云',
    product: 'Google Cloud IoT Core',
    type: '完全停服',
    severity: 'critical',
    announceDate: '2026-04-16',
    stopSellDate: '已停止新购',
    endOfLifeDate: '2026-08-16',
    reason: 'Google 持续收缩 IoT 业务，第二次延期后最终确认停服，不再受理任何新增接入。',
    migration: '官方推荐迁移至 ClearBlade / MongoDB Atlas IoT / 腾讯云 IoT Hub',
    affectedCustomers: '车联网、工业 IoT、智能家居客户 · 全球上万设备接入方',
    tags: ['IoT', '停服', '迁移紧急'],
    sourceUrl: 'https://cloud.google.com/iot/docs'
  },
  {
    id: 4,
    vendor: '谷歌云',
    product: 'Container Registry (GCR)',
    type: '产品停售/EOL',
    severity: 'high',
    announceDate: '2026-04-10',
    stopSellDate: '2026-05-15',
    endOfLifeDate: '2027-03-18',
    reason: '全面切换至 Artifact Registry，GCR 不再接受新镜像推送，只读保留一年。',
    migration: '一键迁移至 Artifact Registry；或切至腾讯云 TCR 企业版（提供跨云同步）',
    affectedCustomers: 'GKE、Cloud Run 等使用 GCR 的所有客户',
    tags: ['Container', '镜像仓库', 'EOL']
  },
  {
    id: 5,
    vendor: 'AWS',
    product: 'CodeCommit（Git 代码托管）',
    type: '产品停售/EOL',
    severity: 'high',
    announceDate: '2026-04-12',
    stopSellDate: '2026-07-01',
    endOfLifeDate: '2028-07-01',
    reason: '7 月 1 日起对新账户关闭，不再接受新仓库创建。官方建议迁移至 GitHub/GitLab 或自建。',
    migration: '迁移至 GitHub Enterprise / GitLab / 腾讯云 CodeHub',
    affectedCustomers: '使用 CodeCommit 做私有 Git 托管的中小企业',
    tags: ['CodeCommit', 'Git', 'DevOps'],
    sourceUrl: 'https://docs.aws.amazon.com/codecommit'
  },
  {
    id: 6,
    vendor: 'AWS',
    product: 'CloudSearch',
    type: '产品停售/EOL',
    severity: 'medium',
    announceDate: '2026-04-09',
    stopSellDate: '2026-06-01',
    endOfLifeDate: '2028-06-30',
    reason: '官方转推 OpenSearch Service，CloudSearch 停止新购，存量客户给 2 年迁移窗口。',
    migration: '迁移至 AWS OpenSearch Service / 腾讯云 ES',
    affectedCustomers: '搜索业务、内容检索客户',
    tags: ['CloudSearch', '搜索', 'EOL']
  },
  {
    id: 7,
    vendor: '微软云',
    product: 'Azure Spring Apps 标准版',
    type: '完全停服',
    severity: 'critical',
    announceDate: '2026-04-14',
    stopSellDate: '2026-05-30',
    endOfLifeDate: '2027-03-31',
    reason: '与 VMware 剥离影响，Azure Spring Apps Basic/Standard 版完全退休，仅保留 Enterprise 版。',
    migration: '升级至 Enterprise 版（价格×3）/ 迁移至 AKS 自建 / 腾讯云 TKE + Spring Cloud',
    affectedCustomers: 'Java 微服务客户 · 约 3000+ 企业受影响',
    tags: ['Spring', 'Java', 'Azure', '停服'],
    sourceUrl: 'https://azure.microsoft.com/updates'
  },
  {
    id: 8,
    vendor: '微软云',
    product: 'Azure ML Classic (经典版)',
    type: '完全停服',
    severity: 'high',
    announceDate: '2026-04-07',
    stopSellDate: '已停止',
    endOfLifeDate: '2026-08-31',
    reason: '经典版 ML Studio 8 月底彻底下线，所有工作区和模型将被删除。',
    migration: '迁移至 Azure Machine Learning v2 / 腾讯云 TI 平台',
    affectedCustomers: '传统机器学习老客户',
    tags: ['ML', 'AI', '下线']
  },
  {
    id: 9,
    vendor: '华为云',
    product: '区块链服务 BCS（公有云版）',
    type: '完全停服',
    severity: 'high',
    announceDate: '2026-04-11',
    stopSellDate: '2026-05-20',
    endOfLifeDate: '2026-10-31',
    reason: '战略聚焦昇腾与盘古，BCS 公有云版停服，仅保留私有化交付形态。',
    migration: '迁移至私有化部署 / 腾讯云 TBaaS / 蚂蚁链 BaaS',
    affectedCustomers: '金融、溯源、政务区块链客户',
    tags: ['区块链', 'BCS', '战略收缩']
  },
  {
    id: 10,
    vendor: '百度云',
    product: '文心一言 1.0 / 2.0 老 API 端点',
    type: '产品停售/EOL',
    severity: 'medium',
    announceDate: '2026-04-06',
    stopSellDate: '2026-04-20',
    endOfLifeDate: '2026-07-31',
    reason: '随着文心 X2 发布，旧版 1.0 / 2.0 模型 API 停止新调用接入，存量调用给 3 个月过渡。',
    migration: '升级至 文心 X2 / 切换至腾讯混元 T2 / 通义 Qwen3',
    affectedCustomers: '早期接入百度文心的 AI 应用开发者',
    tags: ['文心', 'LLM', 'API']
  },
  {
    id: 11,
    vendor: 'Oracle云',
    product: 'OCI Classic（经典计算域）',
    type: '地域收缩',
    severity: 'medium',
    announceDate: '2026-04-13',
    stopSellDate: '2026-06-30',
    endOfLifeDate: '2027-06-30',
    reason: 'OCI Classic 老架构在亚太区（含东京、悉尼）下线，全面切到第二代 OCI。',
    migration: '迁移至 OCI Gen 2 / 腾讯云 CVM',
    affectedCustomers: '日本、澳洲 Oracle 老客户',
    tags: ['OCI', 'Classic', '地域收缩']
  },
  {
    id: 12,
    vendor: '火山引擎',
    product: '边缘计算 EdgeCDN 海外节点',
    type: '地域收缩',
    severity: 'medium',
    announceDate: '2026-04-15',
    stopSellDate: '2026-05-10',
    endOfLifeDate: '2026-09-30',
    reason: '海外节点优化，下线 12 个小流量地区节点（南美、非洲部分区域），聚焦亚太+北美核心线路。',
    migration: '切换至腾讯云 EdgeOne（覆盖 80+ 国家） / AWS CloudFront',
    affectedCustomers: '做全球 CDN 分发的出海业务客户',
    tags: ['CDN', '边缘计算', '出海']
  },
  {
    id: 13,
    vendor: '腾讯云',
    product: '游戏联机服务器引擎 GSE（旧版）',
    type: '功能收缩',
    severity: 'medium',
    announceDate: '2026-04-17',
    stopSellDate: '2026-06-01',
    endOfLifeDate: '2026-12-31',
    reason: '升级至新一代 GME 3.0 联机引擎，旧版 GSE 功能收敛，实时语音/匹配能力迁移到 GME。',
    migration: '官方一键迁移至 GME 3.0（能力更强、价格不变）',
    affectedCustomers: '使用旧版 GSE 的游戏客户',
    tags: ['游戏', 'GSE', '版本升级']
  }
]

const deprecatedTypes: DeprecatedType[] = ['完全停服', '产品停售/EOL', '功能收缩', '地域收缩']

const deprecatedTypeConfig: Record<DeprecatedType, { icon: string; color: string; bg: string }> = {
  '完全停服': { icon: '🔴', color: '#dc2626', bg: '#fee2e2' },
  '产品停售/EOL': { icon: '🟠', color: '#ea580c', bg: '#ffedd5' },
  '功能收缩': { icon: '🟡', color: '#d97706', bg: '#fef3c7' },
  '地域收缩': { icon: '🟣', color: '#7c3aed', bg: '#ede9fe' }
}

const deprecatedFilter = ref<DeprecatedType | '全部'>('全部')

const filteredDeprecated = computed(() => {
  if (deprecatedFilter.value === '全部') return deprecatedProducts
  return deprecatedProducts.filter(p => p.type === deprecatedFilter.value)
})

const deprecatedTypeCount = computed<Record<DeprecatedType, number>>(() => {
  const map = { '完全停服': 0, '产品停售/EOL': 0, '功能收缩': 0, '地域收缩': 0 } as Record<DeprecatedType, number>
  deprecatedProducts.forEach(p => { map[p.type]++ })
  return map
})

const shutdownCount = computed(() => deprecatedTypeCount.value['完全停服'])
const eolCount = computed(() => deprecatedTypeCount.value['产品停售/EOL'])
const shrinkCount = computed(() => deprecatedTypeCount.value['功能收缩'] + deprecatedTypeCount.value['地域收缩'])

const deprecatedVendorsCount = computed(() => {
  return new Set(deprecatedProducts.map(p => p.vendor)).size
})

function severityLabel(s: Severity): string {
  if (s === 'critical') return '🚨 紧急'
  if (s === 'high') return '⚠️ 高危'
  return '📌 关注'
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
  grid-template-columns: 1fr 1fr 1.3fr;
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
  .price-overview { grid-template-columns: 1fr 1fr; }
  .strategy-grid { grid-template-columns: 1fr; }
}

/* 涨价 Tab 特殊强调 */
.main-tab.price-tab .mt-icon.price-icon {
  background: linear-gradient(135deg, #ef4444, #f97316);
}

/* ========== 各家云厂商涨价策略对比表 ========== */
.compare-section {
  background: linear-gradient(135deg, #fff7ed 0%, #fefce8 50%, #f0f9ff 100%);
  border: 1px solid #fed7aa;
  border-radius: 14px;
  padding: 20px 22px;
  margin-bottom: 20px;
  box-shadow: 0 4px 18px rgba(239, 68, 68, 0.06);
}

.compare-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.compare-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.ct-icon {
  font-size: 22px;
}

.compare-title h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ct-sub {
  font-size: 12px;
  color: var(--text-light);
}

.compare-legend {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: var(--text-secondary);
}

.lg-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.lg-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.lg-dot.overseas { background: #6366f1; }
.lg-dot.domestic { background: #ef4444; }

.compare-table-wrap {
  background: #fff;
  border-radius: 10px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
  min-width: 1100px;
}

.compare-table thead {
  background: linear-gradient(135deg, #1e293b, #334155);
}

.compare-table thead th {
  color: #fff;
  font-weight: 600;
  padding: 12px 14px;
  text-align: left;
  white-space: nowrap;
  font-size: 12.5px;
  letter-spacing: 0.3px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.compare-table thead th:last-child { border-right: none; }

.compare-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.compare-table tbody tr:hover {
  background: #fef7f0;
}

.compare-table tbody tr.row-highest {
  background: linear-gradient(90deg, #fef2f2, #fff7ed);
  position: relative;
}

.compare-table tbody tr.row-highest:hover {
  background: linear-gradient(90deg, #fee2e2, #fef3c7);
}

.compare-table tbody td {
  padding: 12px 14px;
  vertical-align: middle;
  color: var(--text);
  line-height: 1.6;
}

.col-vendor { width: 120px; }
.col-region { width: 90px; }
.col-range { width: 160px; }
.col-date { width: 110px; }
.col-strategy { width: 160px; }

.vendor-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12.5px;
  white-space: nowrap;
}

.vc-icon { font-size: 14px; }

.range-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12.5px;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.highest-flag {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.25);
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.col-products-cell { min-width: 180px; }

.mini-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.mini-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.date-cell {
  color: #b45309;
  font-weight: 600;
  white-space: nowrap;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 12px;
}

.strategy-chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid transparent;
  white-space: nowrap;
}

.impact-cell {
  color: var(--text-secondary);
  font-size: 12px;
  min-width: 200px;
}

.compare-footnote {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 11.5px;
  color: var(--text-secondary);
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px dashed #fed7aa;
}

.fn-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ========== 产品下线 / 停服 / 收缩 告警板块 ========== */
.deprecated-section {
  background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 50%, #fefce8 100%);
  border: 2px solid #fecaca;
  border-radius: 14px;
  padding: 22px 24px;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 6px 22px rgba(220, 38, 38, 0.08);
}

.deprecated-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #dc2626, #ea580c, #d97706, #7c3aed);
  border-radius: 14px 14px 0 0;
}

.deprecated-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px dashed #fecaca;
}

.dp-title-wrap {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 320px;
}

.dp-icon-big {
  font-size: 32px;
  animation: pulse-alert 2s infinite;
}

@keyframes pulse-alert {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.dp-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 700;
  color: #991b1b;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dp-alert-badge {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 10px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
}

.dp-sub {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.dp-strong {
  color: #dc2626;
  font-size: 16px;
  font-weight: 800;
  margin: 0 2px;
}

.dp-stat-row {
  display: flex;
  gap: 10px;
}

.dp-stat {
  background: #fff;
  border-radius: 10px;
  padding: 10px 18px;
  text-align: center;
  min-width: 96px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.dp-stat-num {
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2px;
}

.dp-stat-shutdown .dp-stat-num { color: #dc2626; }
.dp-stat-eol .dp-stat-num { color: #ea580c; }
.dp-stat-shrink .dp-stat-num { color: #d97706; }

.dp-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* 筛选按钮 */
.dp-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.dp-filter-btn {
  background: #fff;
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 12.5px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.18s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dp-filter-btn:hover {
  border-color: #fca5a5;
  color: #dc2626;
}

.dp-filter-btn.active {
  background: linear-gradient(135deg, #dc2626, #ea580c);
  color: #fff;
  border-color: #dc2626;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.dp-fc {
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.dp-filter-btn.active .dp-fc {
  background: rgba(255, 255, 255, 0.25);
}

/* 告警卡片列表 */
.deprecated-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.deprecated-card {
  background: #fff;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.deprecated-card:hover {
  transform: translateX(2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.deprecated-card.severity-critical {
  border-color: #fca5a5;
  background: linear-gradient(to right, #fef2f2, #fff);
}

.deprecated-card.severity-high {
  border-color: #fed7aa;
  background: linear-gradient(to right, #fff7ed, #fff);
}

.dp-side-bar {
  width: 5px;
  flex-shrink: 0;
}

.dp-card-body {
  flex: 1;
  padding: 14px 18px;
  min-width: 0;
}

.dp-card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.dp-vendor-chip,
.dp-type-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.dp-severity-chip {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.sev-critical {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  box-shadow: 0 2px 5px rgba(220, 38, 38, 0.25);
}

.sev-high {
  background: linear-gradient(135deg, #ea580c, #c2410c);
  color: #fff;
}

.sev-medium {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.dp-announce-date {
  margin-left: auto;
  font-size: 11.5px;
  color: var(--text-light);
  font-family: 'SF Mono', 'Monaco', monospace;
}

.dp-product-name {
  margin: 0 0 6px;
  font-size: 15.5px;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.dp-prod-icon {
  font-size: 16px;
}

.dp-reason {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* 三段时间线 */
.dp-timeline {
  display: flex;
  align-items: stretch;
  gap: 6px;
  background: #fafafa;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.dp-tl-item {
  flex: 1;
  min-width: 140px;
  background: #fff;
  border-radius: 6px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
}

.dp-tl-stop { border-left: 3px solid #f59e0b; }
.dp-tl-eol { border-left: 3px solid #dc2626; }
.dp-tl-migrate { border-left: 3px solid #10b981; flex: 2; min-width: 200px; }

.dp-tl-label {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 3px;
  font-weight: 600;
}

.dp-tl-date {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text);
  font-family: 'SF Mono', 'Monaco', monospace;
}

.dp-tl-date-end {
  color: #dc2626;
}

.dp-tl-migrate-text {
  font-family: inherit;
  font-weight: 500;
  color: #059669;
  font-size: 12px;
  line-height: 1.5;
}

.dp-tl-arrow {
  display: flex;
  align-items: center;
  color: #cbd5e1;
  font-size: 18px;
  font-weight: 300;
}

/* 影响范围 */
.dp-impact-row {
  background: #fef2f2;
  border-left: 3px solid #dc2626;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12.5px;
  margin-bottom: 10px;
}

.dp-impact-label {
  font-weight: 700;
  color: #991b1b;
}

.dp-impact-text {
  color: var(--text);
}

.dp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.dp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.dp-tag {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.dp-source {
  color: #dc2626;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
}

.dp-source:hover {
  text-decoration: underline;
}

/* 行动指引 */
.dp-action-tip {
  margin-top: 16px;
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  border: 1.5px dashed #f59e0b;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.dp-at-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.dp-at-content {
  font-size: 12.5px;
  color: #78350f;
  line-height: 1.75;
}

@media (max-width: 820px) {
  .deprecated-head { flex-direction: column; align-items: stretch; }
  .dp-stat-row { justify-content: space-between; }
  .dp-stat { flex: 1; min-width: unset; padding: 10px 8px; }
  .dp-timeline { flex-direction: column; }
  .dp-tl-arrow { transform: rotate(90deg); justify-content: center; }
  .dp-tl-item { min-width: unset; width: 100%; }
  .dp-announce-date { margin-left: 0; width: 100%; }
}

.main-tab.price-tab.active {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fff7ed);
}

.new-tag {
  display: inline-block;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  margin-left: 6px;
  vertical-align: middle;
  letter-spacing: 0.5px;
}

  /* ========== 本周新增涨价公告 ========== */
.weekly-alert-section {
  background: linear-gradient(135deg, #fefce8 0%, #fff7ed 100%);
  border: 1.5px solid #fcd34d;
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.08);
}

.weekly-alert-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.wa-icon {
  font-size: 22px;
}

.wa-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #92400e;
}

.wa-intro {
  margin: 0 0 14px;
  font-size: 13px;
  color: #78350f;
  font-weight: 500;
}

.wa-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wa-vendor-block {
  background: #fff;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 16px;
}

.wa-vendor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text);
  margin-bottom: 8px;
}

.wa-vt-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.wa-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wa-list li {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.wa-list li strong {
  color: var(--text);
}

  /* ========== 本轮涨价全景 ========== */
.panorama-section {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.panorama-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.pa-icon {
  font-size: 20px;
}

.pa-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  flex: 1;
}

.panorama-table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.panorama-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 900px;
}

.panorama-table thead {
  background: linear-gradient(135deg, #1e293b, #334155);
}

.panorama-table thead th {
  color: #fff;
  font-weight: 600;
  padding: 12px 14px;
  text-align: left;
  font-size: 13px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.panorama-table thead th:last-child {
  border-right: none;
}

.panorama-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.panorama-table tbody tr:hover {
  background: #f8fafc;
}

.panorama-table tbody td {
  padding: 12px 14px;
  vertical-align: middle;
  color: var(--text);
  line-height: 1.6;
  border-right: 1px solid #f1f5f9;
}

.panorama-table tbody td:last-child {
  border-right: none;
}

.pa-cell-vendor {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12.5px;
  white-space: nowrap;
}

.pa-cell-vendor span {
  font-size: 14px;
}

/* 地域标签 */
.region-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.overseas-tag {
  background: #dbeafe;
  color: #1d4ed8;
}

.domestic-tag {
  background: #fee2e2;
  color: #b91c1c;
}

/* 涨幅单元格 */
.range-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
}

.highest-flag {
  font-size: 11px;
  background: #fee2e2;
  color: #dc2626;
  padding: 1px 6px;
  border-radius: 10px;
  border: 1px solid #fecaca;
}

/* 产品小标签 */
.mini-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11.5px;
  margin: 2px 4px 2px 0;
  white-space: nowrap;
}

/* 策略定位+客户影响合并列 */
.strategy-impact-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.strategy-chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
  width: fit-content;
}

.impact-text {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 生效日期 */
.date-cell {
  font-size: 12.5px;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* 图例 */
.compare-legend {
  display: flex;
  gap: 16px;
  align-items: center;
}

.lg-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.lg-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.lg-dot.overseas {
  background: #3b82f6;
}

.lg-dot.domestic {
  background: #ef4444;
}

/* 脚注 */
.compare-footnote {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
}

.fn-item {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 涨价速览卡片 */
.price-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.ov-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-left: 4px solid transparent;
  border-radius: 10px;
  padding: 14px 16px;
}

.ov-card.overseas { border-left-color: #6366f1; }
.ov-card.domestic { border-left-color: #ef4444; }
.ov-card.range { border-left-color: #0ea5e9; }
.ov-card.insight { border-left-color: #f59e0b; background: linear-gradient(135deg, #fffbeb, #fff7ed); }

.ov-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.ov-content { flex: 1; min-width: 0; }

.ov-label {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 2px;
}

.ov-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}

.ov-sub {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* 地域筛选 Tab */
.region-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.region-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: var(--bg-white);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.region-tab:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.region-tab.active {
  background: linear-gradient(135deg, #ef4444, #f97316);
  border-color: #ef4444;
  color: #fff;
  font-weight: 600;
}

.r-count {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.25);
  padding: 1px 7px;
  border-radius: 8px;
}

.region-tab:not(.active) .r-count {
  background: var(--bg);
  color: var(--text-light);
}

/* 涨价清单 */
.price-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.price-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 18px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.price-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ef4444, #f97316, #eab308);
}

.price-card:hover {
  border-color: #ef4444;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.12);
  transform: translateY(-2px);
}

.price-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.region-tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.overseas-tag {
  background: #eef2ff;
  color: #4338ca;
}

.domestic-tag {
  background: #fee2e2;
  color: #b91c1c;
}

.price-range {
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
  background: linear-gradient(135deg, #fee2e2, #fef3c7);
  padding: 2px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

/* 涨价元信息 */
.price-meta {
  background: linear-gradient(135deg, #fef2f2, #fffbeb);
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 10px 12px;
  margin: 10px 0 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  line-height: 1.6;
}

.meta-label {
  color: var(--text-secondary);
  flex-shrink: 0;
  font-weight: 500;
}

.meta-value {
  color: var(--text);
}

.meta-value.effective {
  color: #b45309;
  font-weight: 600;
}

.meta-value.reason {
  color: var(--text-secondary);
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.product-tag {
  font-size: 11px;
  background: #fff;
  border: 1px solid #fed7aa;
  color: #b45309;
  padding: 1px 8px;
  border-radius: 4px;
}

/* 策略分析 */
.strategy-section {
  margin-top: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.st-icon { font-size: 22px; }

.section-title h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.st-sub {
  font-size: 12px;
  color: var(--text-light);
}

.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
  gap: 14px;
}

.strategy-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: 10px;
  padding: 16px 18px;
  transition: all 0.2s;
}

.strategy-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.strategy-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.strategy-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.strategy-head h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  line-height: 1.4;
}

.strategy-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strategy-points li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.strategy-points .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 7px;
}

/* 总结卡片 */
.conclusion-card {
  margin-top: 20px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #fef2f2, #fff7ed);
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 10px;
}

.cc-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.cc-icon { font-size: 18px; }

.cc-title {
  font-size: 14px;
  font-weight: 700;
  color: #b91c1c;
}

.cc-body {
  font-size: 13px;
  line-height: 1.9;
  color: var(--text);
  margin: 0;
}

.cc-body strong {
  color: #b91c1c;
  font-weight: 600;
}
</style>
