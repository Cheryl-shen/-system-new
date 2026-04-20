<template>
  <div class="product-guide-page">
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="router.push('/')">首页</a> / 产品售卖指引
      </div>
      <h2>产品售卖指引</h2>
      <p>腾讯云 AI 产品售卖指引 · 战略客户部内部指导手册 · 2026年版</p>
    </div>

    <!-- 目录导航 -->
    <div class="info-card" style="margin-bottom: 16px">
      <div class="info-card-header" :class="{ collapsed: !tocExpanded }" @click="toggleToc">
        <h3>📜 目录导航</h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" :class="{ hidden: !tocExpanded }">
        <div class="toc-list">
          <span class="info-tag tag-blue" @click="scrollToSection('section-1')">1. 大背景</span>
          <span class="info-tag tag-blue" @click="scrollToSection('section-2')">2. 行业分析</span>
          <span class="info-tag tag-blue" @click="scrollToSection('section-3')">3. 产品全景</span>
          <span class="info-tag tag-blue" @click="scrollToSection('section-4')">4. 售卖案例</span>
        </div>
      </div>
    </div>

    <!-- 1. 大背景 -->
    <div class="info-card" id="section-1">
      <div class="info-card-header" :class="{ collapsed: !sectionExpanded.background }" @click="toggleSection('background')">
        <h3>
          📜 1. 大背景：现在是最佳窗口
          <span class="info-tag tag-red">战略窗口期</span>
        </h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" :class="{ hidden: !sectionExpanded.background }">
        <div class="two-col-grid">
          <div>
            <h4 class="subsection-title">
              <span class="dot blue"></span>
              1.1 腾讯战略层
            </h4>
            <ul class="content-list">
              <li>2026年AI投资至少翻倍；2025年元宝+混元投入已达18亿元</li>
              <li>战略从"赋能现有业务"升级为"创造全新应用"</li>
              <li>Pony首谈"养虾"构想：Agent将与微信去中心化生态深度结合</li>
              <li><strong>对一线意义</strong>：内部资源、产品迭代、高层重视度均在历史高位</li>
            </ul>
          </div>
          <div>
            <h4 class="subsection-title">
              <span class="dot green"></span>
              1.2 市场层
            </h4>
            <table class="data-table">
              <tr class="header-row">
                <th>关键数据</th>
                <th>数值</th>
              </tr>
              <tr>
                <td>中国AI大模型日均Token消耗</td>
                <td>140万亿+（2年增长1400倍）</td>
              </tr>
              <tr>
                <td>中国大模型周调用量</td>
                <td>4.69万亿Token（连续两周反超美国）</td>
              </tr>
              <tr>
                <td>企业AI支出占IT预算比例</td>
                <td>超20%（2年前不足10%）</td>
              </tr>
              <tr>
                <td>企业进入集采流程比例</td>
                <td>60%以上（2025年）</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="highlight-box">
          <strong>客户信号与应对动作：</strong>
          <ul class="compact-list">
            <li><strong>在用ChatGPT/Gemini等海外产品</strong> → 合规+成本切入，混元 vs GPT-4o，Token价格低30-60%</li>
            <li><strong>没有系统性AI规划</strong> → 帮建框架、做行业对标、输出AI路线图</li>
            <li><strong>AI工具分散管理</strong> → 推TokenHub统一管控 + WorkBuddy统一入口</li>
            <li><strong>技术团队用AI编程但未企业化采购</strong> → 推Codebuddy + TokenHub，帮算ROI</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 2. 行业分析 -->
    <div class="info-card" id="section-2">
      <div class="info-card-header" :class="{ collapsed: !sectionExpanded.industry }" @click="toggleSection('industry')">
        <h3>
          📊 2. 行业宏观分析 + AI切入方向
        </h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" :class="{ hidden: !sectionExpanded.industry }">
        <p class="section-desc">不同行业有不同AI应用场景和切入点，需根据客户行业特征选择合适的AI产品组合</p>
        
        <div class="sheet-container">
          <div class="sheet-tabs">
            <div
              v-for="industry in industries"
              :key="industry.key"
              class="sheet-tab"
              :class="{ active: activeIndustry === industry.key }"
              @click="activeIndustry = industry.key"
            >
              {{ industry.name }}
            </div>
          </div>
          
          <div class="sheet-panel active">
            <div class="industry-desc">{{ currentIndustry.desc }}</div>
            <table class="data-table full-width">
              <tr class="header-row">
                <th style="width: 160px">AI现况 & 驱动力</th>
                <th>切入方向</th>
                <th>推荐产品</th>
              </tr>
              <tr v-for="(row, idx) in currentIndustry.rows" :key="idx">
                <td>{{ row.situation }}</td>
                <td>{{ direction }}</td>
                <td>{{ row.products }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 产品全景 -->
    <div class="info-card" id="section-3">
      <div class="info-card-header" :class="{ collapsed: !sectionExpanded.products }" @click="toggleSection('products')">
        <h3>
          📜 3. 腾讯云AI产品全景
        </h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" :class="{ hidden: !sectionExpanded.products }">
        <!-- 产品总览 -->
        <div class="products-overview">
          <div class="product-category-card blue">
            <div class="category-title">🔵 腾讯大模型（3款）</div>
            <div class="category-items">腾讯混元大模型<br>大模型服务平台 TokenHub<br>智能体开发平台 ADP</div>
          </div>
          <div class="product-category-card purple">
            <div class="category-title">🟣 企业AI管控（1款）🆕</div>
            <div class="category-items">企业AI智能体管控平台 ClawPro</div>
          </div>
          <div class="product-category-card yellow">
            <div class="category-title">🟡 AI应用产品（7款）</div>
            <div class="category-items">人脸核身、智能数智人<br>腾讯同传、内容安全四件套<br>企业级AI办公助手 WorkBuddy</div>
          </div>
          <div class="product-category-card red">
            <div class="category-title">🔴 AI平台产品（2款）</div>
            <div class="category-items">TI平台（MLOps）<br>觅影开放实验平台</div>
          </div>
        </div>

        <!-- 混元大模型 -->
        <div class="product-detail-box purple-light">
          <h4 class="detail-title">混元大模型</h4>
          <div class="two-col-grid small-text">
            <div>
              <strong>核心优势：</strong><br>
              • 多模态完整性全国最强 — 文/图/视频/3D四位一体<br>
              • 自研可控合规 — 数据不出境<br>
              • 持续高频迭代 — 更新速度快<br>
              • 价格优势 — 相比GPT-4o，Token价格低30%-60%
            </div>
            <div>
              <strong>重点突破场景：</strong><br>
              • 广告/内容创作/电商商品图/营销图<br>
              • 混元Image 3.0：批量生成、0.2元/张起<br>
              • 混元Video：短视频广告素材<br>
              • 混元3D：电商3D展示、游戏素材
            </div>
          </div>
        </div>

        <!-- TokenHub -->
        <div class="product-detail-box blue-light">
          <h4 class="detail-title blue">大模型服务平台 TokenHub</h4>
          <div class="three-col-grid small-text">
            <div>
              <strong>核心卖点：</strong><br>
              💰 套餐比API按量计费便宜50%-80%<br>
              🦞 龙虾生态打通，同等用量省超一半<br>
              💻 AI编程工具全兼容<br>
              🔄 多模型统一入口<br>
              🔒 全部国内模型，数据不出境
            </div>
            <div class="highlight-cell">
              官网：cloud.tencent.com/product/tokenhub
            </div>
            <div>
              <strong>售卖思路：</strong><br>
              ① 省钱才是硬道理，给客户算笔账<br>
              ② 中台功能，一站管理<br>
              ③ CodeBuddy捆绑（研发侧底层Token消耗大）<br>
              ④ WorkBuddy场景成本保障
            </div>
          </div>
        </div>

        <!-- WorkBuddy & ADP & ClawPro -->
        <div class="three-product-grid">
          <div class="product-detail-box yellow-light">
            <h4 class="detail-title yellow">WorkBuddy</h4>
            <p class="product-subtitle">企业级AI办公助手（腾讯云版Copilot for M365）</p>
            <ul class="compact-list">
              <li>会议纪要自动生成、文档撰写/润色/翻译</li>
              <li>邮件起草/总结、知识库问答</li>
              <li>支持企业微信/钉钉/飞书接入</li>
              <li>目标用户：运营/HR/商务/客服等非技术员工</li>
            </ul>
          </div>
          <div class="product-detail-box green-light">
            <h4 class="detail-title green">腾讯云智能体开发平台 ADP 🆕</h4>
            <p class="product-subtitle">企业从"用AI能力"升级到"构建AI应用"的核心入口</p>
            <table class="data-table compact">
              <tr class="header-row">
                <th>能力</th>
                <th>说明</th>
                <th>适合场景</th>
              </tr>
              <tr>
                <td>RAG</td>
                <td>企业文档→内部知识回答</td>
                <td>内部知识库问答</td>
              </tr>
              <tr>
                <td>Workflow</td>
                <td>可视化拖拽串联AI能力</td>
                <td>复杂业务流程</td>
              </tr>
              <tr>
                <td>Multi-Agent</td>
                <td>多Agent分工完成复杂任务</td>
                <td>复杂AI应用开发</td>
              </tr>
            </table>
          </div>
          <div class="product-detail-box purple-light">
            <h4 class="detail-title purple">腾讯云 ClawPro 🆕</h4>
            <p class="product-subtitle">企业AI智能体管控平台（OpenClaw企业版）</p>
            <div class="small-text" style="margin-bottom: 8px"><strong>五大核心能力：</strong></div>
            <ul class="compact-list smaller">
              <li><strong>极速部署与零门槛使用</strong>：管理员10分钟完成全企业部署，员工3分钟完成申领使用</li>
              <li><strong>精细化全链路管控</strong>：企业-部门-个人三级Token配额体系，算力成本降低40%</li>
              <li><strong>四层纵深安全防护</strong>：资产全盘点、全链路审计、租户隔离、Skill扫描</li>
              <li><strong>自动化与多协同能力</strong>：7×24小时智能数字员工，支持自动执行、智能运维、系统对接</li>
              <li><strong>底层云服务与生态融合</strong>：全栈托管、多模型兼容（Claude/混元/GLM）、三层知识记忆</li>
            </ul>
          </div>
        </div>

        <!-- 五层产品架构 -->
        <div class="architecture-box">
          <h4 class="detail-title">五层产品架构</h4>
          <div class="architecture-list">
            <div class="arch-item">
              <span class="arch-num" style="background: #2b5aed">1</span>
              <span>混元大模型（能力底座）：文/图/视频/3D/代码/Embedding</span>
            </div>
            <div class="arch-item">
              <span class="arch-num" style="background: #6366f1">2</span>
              <span>腾讯云ADP（应用构建层）：把混元能力组装成企业业务应用</span>
            </div>
            <div class="arch-item">
              <span class="arch-num" style="background: #8b5cf6">3</span>
              <span>腾讯云ClawPro（管控层）：企业AI智能体管控平台，精细化全链路管控</span>
            </div>
            <div class="arch-item">
              <span class="arch-num" style="background: #ec4899">4</span>
              <span>TokenHub（成本管控层）：统一管理所有调用，套餐锁价降本</span>
            </div>
            <div class="arch-item">
              <span class="arch-num" style="background: #f43f5e">5</span>
              <span>WorkBuddy（办公端）：非技术员工AI入口，消耗TokenHub套餐</span>
            </div>
          </div>
        </div>

        <!-- 跨行业解决方案 -->
        <div class="solution-section">
          <h4 class="subsection-title primary">跨行业通用解决方案模块</h4>
          <table class="data-table full-width">
            <tr class="header-row">
              <th style="width: 180px">模块</th>
              <th>产品组合</th>
              <th>适合客户</th>
            </tr>
            <tr>
              <td>AI研发提效包</td>
              <td>Codebuddy + TokenHub套餐</td>
              <td>所有有研发团队的企业</td>
            </tr>
            <tr>
              <td>全员AI办公包</td>
              <td>WorkBuddy + TokenHub套餐</td>
              <td>推动全员AI化的企业</td>
            </tr>
            <tr>
              <td>内容合规基础包</td>
              <td>文本+图片+音频+视频内容安全</td>
              <td>所有UGC平台，刚需切入</td>
            </tr>
            <tr>
              <td>智能客服升级包</td>
              <td>混元文本 + ADP + ASR + TTS</td>
              <td>客服量大的电商/物流/金融</td>
            </tr>
            <tr>
              <td>营销素材生产包</td>
              <td>混元Image 3.0 + 混元文本 + 图像创作AIGC</td>
              <td>电商/本地生活/媒体/游戏</td>
            </tr>
            <tr>
              <td>多模态内容创作包</td>
              <td>混元Image + Video + 3D + 数智人</td>
              <td>游戏/娱乐/电商/广告</td>
            </tr>
          </table>
        </div>

        <!-- ClawPro 售卖定位 -->
        <div class="product-detail-box purple-light">
          <h4 class="detail-title purple">腾讯云 ClawPro 售卖定位</h4>
          <div class="two-col-grid small-text">
            <div>
              <strong>目标客户：</strong>有IT管理需求、希望规模化推进全员AI化、同时对数据安全与合规有严格要求的企业客户
            </div>
            <div>
              <strong>联卖组合：</strong>ClawPro 管控全局 + TokenHub 控制成本 + WorkBuddy 覆盖员工侧体验
            </div>
          </div>
          <div class="highlight-cell green" style="margin-top: 12px">
            <strong>核心价值：</strong><br>
            • 10分钟完成全企业AI智能体部署<br>
            • 企业-部门-个人三级Token配额精细化管控<br>
            • 四层纵深安全防护，满足企业合规要求<br>
            • 7×24小时自动化智能运维，替代人工值守
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 售卖案例 -->
    <div class="info-card" id="section-4">
      <div class="info-card-header" :class="{ collapsed: !sectionExpanded.cases }" @click="toggleSection('cases')">
        <h3>
          📜 4. 售卖案例
        </h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="info-card-body" :class="{ hidden: !sectionExpanded.cases }">
        <div class="sheet-container">
          <div class="sheet-tabs">
            <div
              v-for="caseItem in cases"
              :key="caseItem.key"
              class="sheet-tab"
              :class="{ active: activeCase === caseItem.key }"
              @click="activeCase = caseItem.key"
            >
              {{ caseItem.title }}
            </div>
          </div>
          <div class="sheet-panel active">
            <div class="case-background">{{ currentCase.background }}</div>
            <div class="two-col-grid small-text" style="margin: 12px 0">
              <div>
                <strong>策略维度：</strong><br>
                <span v-html="currentCase.strategy"></span>
              </div>
              <div>
                <strong>关键经验：</strong><br>
                <span v-html="currentCase.experience"></span>
              </div>
            </div>
            <div class="result-box">
              <strong>结果：</strong><br>
              <span v-html="currentCase.result"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 更新时间 -->
    <div class="update-footer">
      📅 文档更新时间：2026-04-17 | 来源：腾讯云 AI 产品售卖指引 · 战略客户部内部指导手册 · 2026年版
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 目录状态
const tocExpanded = ref(true)
const toggleToc = () => {
  tocExpanded.value = !tocExpanded.value
}

// 章节状态
const sectionExpanded = ref({
  background: true,
  industry: true,
  products: true,
  cases: true
})

const toggleSection = (key: string) => {
  sectionExpanded.value[key] = !sectionExpanded.value[key]
}

// 行业数据
const activeIndustry = ref('dianshang')
const industries = [
  {
    key: 'dianshang',
    name: '电商行业',
    desc: '中国电商行业已进入存量竞争深水区，AI化核心驱动：2025年是电商AI应用的关键分水岭——从"AI辅助"跃升至"AI驱动"',
    rows: [
      { situation: '降本增效压力大，精细化运营要求高', direction: '全员AI工具统一管控', products: 'TokenHub + WorkBuddy' },
      { situation: 'Cursor/Copilot普及，数据出境合规风险暴露', direction: '合规替换+规模化扩量', products: 'Codebuddy + TokenHub' },
      { situation: '海量SKU商品图/营销素材成本高', direction: 'AI批量生成，0.2元/张起', products: '混元 Image 3.0' },
      { situation: '个性化推荐/智能客服已成行业标配', direction: '导购智能体（RAG+多轮对话）', products: 'ADP + 混元文本' },
      { situation: '亿级UGC，审核失误代价极高', direction: '内容安全四件套打包', products: '图片/文本/视频内容安全' }
    ]
  },
  {
    key: 'wuliu',
    name: '物流科技',
    desc: '社会物流总费用19.0万亿元，同比增长4.40%，头部平台AI自研深度强，切入需找边界——算力降本、Token管控、海外合规是空白点',
    rows: [
      { situation: '多模型并发，Token管理混乱', direction: '多业务线统一Token管控，降本50%+', products: 'TokenHub套餐' },
      { situation: '私有大模型训练/推理，峰值算力需求高', direction: '弹性GPU碎片资源，按需购买', products: 'GPU弹性算力' },
      { situation: 'IT降本为运营重点', direction: '直接算ROI', products: 'TokenHub + 弹性算力' },
      { situation: '散用境外AI工具，合规敞口存在', direction: '合规替换', products: 'Codebuddy + TokenHub' },
      { situation: '国际单据量大，人工翻译成本高', direction: '多语言单据自动化', products: '机器翻译 + OCR' }
    ]
  },
  {
    key: 'yinshipin',
    name: '音视频平台',
    desc: '短视频进入存量深耕阶段，直播电商GMV仍在高增（抖音约3.43万亿，同比+35%）',
    rows: [
      { situation: '内容违规漏审，监管处罚代价极高', direction: '内容安全四件套，合规刚需优先', products: '音频/图片/视频/文本内容安全' },
      { situation: 'AI Coding工具普及，合规替换等触发点', direction: '合规替换海外工具', products: 'Codebuddy + TokenHub' },
      { situation: '各业务线分散购买AI工具', direction: '统一合规入口，全员AI化', products: 'WorkBuddy + TokenHub' },
      { situation: '直播字幕提升留存，ROI可量化', direction: 'ASR实时字幕', products: '语音识别ASR' },
      { situation: '7×24人工直播成本高', direction: '数智人直播降本', products: '腾讯云数智人 + TTS' },
      { situation: 'AIGC批量生成封面/素材，成本可降70%+', direction: '批量素材生成', products: '混元Image 3.0 / 混元3D' }
    ]
  },
  {
    key: 'shejiao',
    name: '社交娱乐',
    desc: '中国社交媒体用户规模10.71亿（渗透率96.7%），进入存量深挖阶段，AI搜索成为各平台战略级产品',
    rows: [
      { situation: '违规内容扩散风险极高', direction: '内容安全四件套，最高优先级', products: '文本/图片/视频/音频内容安全' },
      { situation: '用户向AI问答迁移，AI搜索成战略产品', direction: 'AI搜索增强（RAG + 联网实时信息）', products: 'ADP + 混元文本 + 联网搜索API' },
      { situation: '种草图/商品图需求爆发，AIGC是降本关键', direction: 'AI批量生成素材', products: '混元Image 3.0' },
      { situation: '合规风险敞口存在', direction: '合规替换海外工具', products: 'Codebuddy + TokenHub' },
      { situation: '各业务线独立采购，Token成本不透明', direction: '统一管控，降本50%+', products: 'TokenHub' },
      { situation: '实名/支付核验是监管硬要求', direction: '人脸核身存量+增量', products: '人脸核身' }
    ]
  }
]

const currentIndustry = computed(() => {
  return industries.find(i => i.key === activeIndustry.value) || industries[0]
})

// 案例数据
const activeCase = ref('case1')
const cases = [
  {
    key: 'case1',
    title: '案例一：Codebuddy',
    background: '唯品会约800人研发团队，CTO将AI Coding使用率纳入考核KPI。阿里云/百度云深度介入，选型拉锯近半年，研发侧广泛使用Cursor存在数据出境合规风险。',
    strategy: '• 借势关系，主动种草<br>• 捕捉竞品失分窗口<br>• 关注产品能力更新<br>• 让客户内部数据说话<br>• 服务托底，危机变信任<br>• 从供应商升级为共创伙伴',
    experience: '1. 模型并发默认为1，需提前与架构师评估并发需求，预留buffer池<br>2. 帮客户理清workflow，提前解决产品和研发侧信息错位<br>3. 熟悉混元大模型系列各模型核心卖点，田忌赛马',
    result: '• 首批300 license，29万元，预计扩展至750个license以上<br>• CTO原话："产品迭代快、内部响应快，值得信任"<br>• 客户主动提出非技术团队也希望使用Codebuddy + WorkBuddy'
  },
  {
    key: 'case2',
    title: '案例二：混元大模型',
    background: '唯品会主站有50万张素材生图需求，此前已接入Google Gemini测试。商务侧判断境外模型存在合规风险和价格压力，持续关注混元多模态优势，等待替换窗口。2026年3月，客户主动联系，商务侧快速响应，推进切换并签署混元大模型全套框架折扣。',
    strategy: '• 信任先行，长期陪跑<br>• 让客户感知行业压力<br>• 把握合规替换窗口<br>• 专业开路，解决技术卡点<br>• 跟进四大落地风险',
    experience: '1. 模型并发默认为1，需提前与架构师评估并发需求，预留buffer池<br>2. 帮客户理清workflow，提前解决产品和研发侧信息错位<br>3. 熟悉混元大模型系列各模型核心卖点，田忌赛马',
    result: '• 成功从Gemini手中winback，签署混元大模型大全套<br>• 后续其他业务部将陆续使用相关模型'
  }
]

const currentCase = computed(() => {
  return cases.find(c => c.key === activeCase.value) || cases[0]
})

// 滚动到章节
const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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

.info-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 6px;
  cursor: pointer;
}

.tag-red {
  background: var(--red-bg);
  color: var(--red);
}

.tag-blue {
  background: var(--primary-light);
  color: var(--primary);
}

/* 目录列表 */
.toc-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

/* 子标题 */
.subsection-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subsection-title.primary {
  color: var(--primary);
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot.blue { background: #3b82f6; }
.dot.green { background: #22c55e; }

/* 两列布局 */
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.three-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

/* 列表 */
.content-list {
  font-size: 12px;
  line-height: 1.8;
  padding-left: 16px;
  color: var(--text-secondary);
}

.content-list li {
  margin-bottom: 6px;
}

.compact-list {
  font-size: 11px;
  line-height: 1.8;
  padding-left: 16px;
  margin-top: 6px;
}

.compact-list.smaller {
  font-size: 10px;
}

.compact-list li {
  margin-bottom: 4px;
}

/* 高亮框 */
.highlight-box {
  background: #fefce8;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 12px;
}

/* 数据表格 */
.data-table {
  width: 100%;
  font-size: 11px;
  border-collapse: collapse;
}

.data-table.full-width {
  width: 100%;
}

.data-table.compact {
  font-size: 10px;
}

.data-table th,
.data-table td {
  padding: 6px;
  border: 1px solid #ddd;
  text-align: left;
}

.data-table .header-row {
  background: #eef2ff;
}

.data-table .header-row th {
  font-weight: 600;
  border: 1px solid #ddd;
}

/* 表格区域 */
.sheet-container {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0;
}

.sheet-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--header-bg);
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

.sheet-panel {
  display: none;
  padding: 16px;
}

.sheet-panel.active {
  display: block;
}

.industry-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

/* 产品总览 */
.products-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.product-category-card {
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  font-size: 11px;
}

.product-category-card.blue {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
}

.product-category-card.purple {
  background: #f5f3ff;
  border: 1px solid #c7d2fe;
}

.product-category-card.yellow {
  background: #fff7ed;
  border: 1px solid #fcd34d;
}

.product-category-card.red {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.category-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.product-category-card.blue .category-title { color: #0369a1; }
.product-category-card.purple .category-title { color: #4f46e5; }
.product-category-card.yellow .category-title { color: #d97706; }
.product-category-card.red .category-title { color: #dc2626; }

.category-items {
  color: var(--text-secondary);
  font-size: 10px;
  line-height: 1.6;
}

/* 产品详情框 */
.product-detail-box {
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.product-detail-box.purple-light {
  background: #f8f5ff;
  border: 1px solid #d9d1ff;
}

.product-detail-box.blue-light {
  background: #eef2ff;
  border: 1px solid #bae6fd;
}

.product-detail-box.yellow-light {
  background: #fff7ed;
  border: 1px solid #fcd34d;
}

.product-detail-box.green-light {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.detail-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 8px 0;
}

.detail-title.blue { color: #2b5aed; }
.detail-title.yellow { color: #d97706; }
.detail-title.green { color: #16a34a; }
.detail-title.purple { color: #4f46e5; }

.product-subtitle {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.highlight-cell {
  background: #93c5fd;
  color: #1e40af;
  padding: 8px;
  border-radius: 4px;
  font-size: 10px;
}

.highlight-cell.green {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
}

.small-text {
  font-size: 11px;
  line-height: 1.8;
}

/* 三产品网格 */
.three-product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

/* 架构图 */
.architecture-box {
  background: #f0f0f0;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
}

.architecture-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.arch-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arch-num {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 10px;
  flex-shrink: 0;
}

/* 解决方案区域 */
.solution-section {
  margin-top: 16px;
}

/* 案例区域 */
.case-background {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.result-box {
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 11px;
}

/* 页脚 */
.update-footer {
  margin-top: 16px;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-light);
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .two-col-grid,
  .three-col-grid,
  .products-overview,
  .three-product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
