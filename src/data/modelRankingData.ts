/**
 * 全球模型能力排名数据
 * 数据来源：OpenRouter Rankings (https://openrouter.ai/rankings)
 * 统计口径：全球 API 实际调用量（Token 消耗量），反映真实市场需求
 * 最后更新：2026-05-25（数据周期：2026-05-18 ~ 2026-05-24）
 * 
 * 本期看点：
 * - DeepSeek V4 Flash 以 3.43T 登顶全球，永久降价 75% 后用量暴涨
 * - 腾讯混元 Hy3 Preview 以 2.66T 跃升至第 2，周增长 210%
 * - 全球周 Token 总量首次突破 28.9T，连续 5 周增长
 * - 中国模型连续 4 周领先美国模型（9.22T vs 4.93T）
 */

// ============================================================
// 类型定义
// ============================================================

/** 模型排名条目 */
export interface ModelRankingItem {
  rank: number                 // 排名
  modelName: string            // 模型名称
  developer: string            // 开发商
  developerCountry: string     // 开发商所在地区
  tokensUsed: string           // Token 使用量（展示用，如 "1.88T"）
  tokensRaw: number            // Token 使用量原始数（用于排序/计算）
  weeklyGrowth: number         // 周环比增长率（%），如 7683 表示 +7683%
  growthTrend: 'explosive' | 'strong' | 'steady' | 'declining'  // 增长趋势
  category: string             // 模型分类（旗舰/轻量/推理/...）
  capabilities: string[]       // 核心能力标签
  contextLength: string        // 上下文长度
  releaseDate: string          // 发布/更新日期
  highlight?: string           // 亮点说明
}

/** Top Apps / Agents */
export interface TopAppItem {
  rank: number
  appName: string
  description: string
  primaryModel: string         // 主要使用的模型
  category: string             // 应用分类
  tokensUsed: string           // Token 消耗量
  icon: string                 // emoji 图标
}

/** 市场分析洞察 */
export interface MarketInsight {
  id: string
  title: string
  content: string
  type: 'trend' | 'warning' | 'opportunity' | 'info'
  icon: string
}

/** 厂商市场份额 */
export interface VendorShare {
  vendor: string
  country: string
  modelsInTop10: number
  totalTokens: string
  sharePercent: number         // 市场份额百分比
  color: string                // 图表颜色
}

// ============================================================
// 排名数据：全球 LLM Top 10
// ============================================================

export const modelRankings: ModelRankingItem[] = [
  {
    rank: 1,
    modelName: 'DeepSeek V4 Flash',
    developer: 'DeepSeek（深度求索）',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '3.43T',
    tokensRaw: 3430000000000,
    weeklyGrowth: 892,
    growthTrend: 'explosive',
    category: '轻量高速',
    capabilities: ['文本生成', '代码', '推理', 'MoE', '极低延迟'],
    contextLength: '128K',
    releaseDate: '2026-05-15',
    highlight: '永久降价 75% 后用量暴涨 892%，以 3.43T 登顶全球'
  },
  {
    rank: 2,
    modelName: '混元 Hy3 Preview',
    developer: '腾讯',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '2.66T',
    tokensRaw: 2660000000000,
    weeklyGrowth: 210,
    growthTrend: 'explosive',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '多模态', 'Agent', '长上下文'],
    contextLength: '256K',
    releaseDate: '2026-05-12',
    highlight: '腾讯混元首次进入全球 Top 3，周增长 210%，Agent 生态爆发'
  },
  {
    rank: 3,
    modelName: 'Kimi K2.6',
    developer: 'Moonshot AI（月之暗面）',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '1.92T',
    tokensRaw: 1920000000000,
    weeklyGrowth: 2,
    growthTrend: 'steady',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '多模态', '长上下文'],
    contextLength: '200K',
    releaseDate: '2026-04-20',
    highlight: '稳定在 Top 3，从上月的爆发增长进入高位平稳期'
  },
  {
    rank: 4,
    modelName: 'Claude Sonnet 4.6',
    developer: 'Anthropic',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '1.82T',
    tokensRaw: 1820000000000,
    weeklyGrowth: 35,
    growthTrend: 'strong',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '推理', 'Agent'],
    contextLength: '200K',
    releaseDate: '2026-03-15',
    highlight: '编程和 Agent 场景持续走强，Anthropic 盈利后估值飙升'
  },
  {
    rank: 5,
    modelName: 'Gemini 3.5 Flash',
    developer: 'Google DeepMind',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '1.47T',
    tokensRaw: 1470000000000,
    weeklyGrowth: 156,
    growthTrend: 'strong',
    category: '轻量高速',
    capabilities: ['文本生成', '多模态', '高速', '低延迟', '1M上下文'],
    contextLength: '1M',
    releaseDate: '2026-05-19',
    highlight: 'Google I/O 2026 发布即火爆，1M 原生多模态，周增长 156%'
  },
  {
    rank: 6,
    modelName: 'Claude Opus 4.7',
    developer: 'Anthropic',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '1.21T',
    tokensRaw: 1210000000000,
    weeklyGrowth: 4,
    growthTrend: 'steady',
    category: '超旗舰',
    capabilities: ['深度推理', '复杂编码', '长文档分析', 'Agent'],
    contextLength: '200K',
    releaseDate: '2026-04-10',
    highlight: '深度推理与复杂 Agent 任务场景首选'
  },
  {
    rank: 7,
    modelName: 'Qwen3.7-Max',
    developer: '阿里云',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '1.13T',
    tokensRaw: 1130000000000,
    weeklyGrowth: 340,
    growthTrend: 'explosive',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '数学推理', '多模态', 'MoE'],
    contextLength: '128K',
    releaseDate: '2026-05-20',
    highlight: '阿里云峰会发布即入围 Top 10，千亿 MoE 新架构实力强劲'
  },
  {
    rank: 8,
    modelName: 'Grok 4.1 Fast',
    developer: 'xAI',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '892B',
    tokensRaw: 892000000000,
    weeklyGrowth: 17,
    growthTrend: 'steady',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '实时信息', '推理'],
    contextLength: '128K',
    releaseDate: '2026-04-05',
    highlight: 'xAI 获 SpaceX $450 亿算力交易加持，稳守前十'
  },
  {
    rank: 9,
    modelName: 'DeepSeek V4 Pro',
    developer: 'DeepSeek（深度求索）',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '876B',
    tokensRaw: 876000000000,
    weeklyGrowth: 68,
    growthTrend: 'strong',
    category: '超旗舰',
    capabilities: ['深度推理', '复杂编码', '数学竞赛', 'Agent', 'MoE'],
    contextLength: '256K',
    releaseDate: '2026-05-10',
    highlight: '永久降价 75% 后 Pro 版同步受益，复杂推理场景增长 68%'
  },
  {
    rank: 10,
    modelName: 'Minimax M2.7',
    developer: 'MiniMax',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '824B',
    tokensRaw: 824000000000,
    weeklyGrowth: 6,
    growthTrend: 'steady',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '多模态', '函数调用'],
    contextLength: '128K',
    releaseDate: '2026-03-28',
    highlight: '中国新锐厂商稳定发挥，综合能力均衡'
  }
]

// ============================================================
// Top Apps / Agents 排名
// ============================================================

export const topApps: TopAppItem[] = [
  {
    rank: 1,
    appName: 'OpenClaw',
    description: '开源 AI Agent，连接消息应用并自动执行操作（命令、浏览、文件管理、邮件等）',
    primaryModel: '多模型',
    category: 'AI Agent',
    tokensUsed: '412B',
    icon: '🤖'
  },
  {
    rank: 2,
    appName: 'Kilo Code',
    description: '开源 AI 编程代理，支持 VS Code、JetBrains 和 CLI',
    primaryModel: 'Claude Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '289B',
    icon: '💻'
  },
  {
    rank: 3,
    appName: 'Claude Code',
    description: 'Anthropic 的代理编程工具，支持全代码库操作',
    primaryModel: 'Claude Opus 4.7 / Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '243B',
    icon: '🔧'
  },
  {
    rank: 4,
    appName: 'Google Spark',
    description: 'Google I/O 2026 发布的下一代 AI 代理，整合搜索/日历/邮件/文档全场景',
    primaryModel: 'Gemini 3.5 Flash',
    category: 'AI Agent',
    tokensUsed: '198B',
    icon: '✨'
  },
  {
    rank: 5,
    appName: 'Hermes Agent',
    description: 'Nous Research 的开源自我进化 AI 代理，内置 40+ 工具',
    primaryModel: '多模型',
    category: 'AI Agent',
    tokensUsed: '176B',
    icon: '⚡'
  },
  {
    rank: 6,
    appName: 'WorkBuddy',
    description: '腾讯云 AI Agent 开发运营平台，企业智能体编排部署一站式工具',
    primaryModel: '混元 Hy3',
    category: 'AI Agent',
    tokensUsed: '134B',
    icon: '🏢'
  },
  {
    rank: 7,
    appName: 'Descript',
    description: 'AI 视频与播客编辑器',
    primaryModel: '多模型',
    category: '视频/播客编辑',
    tokensUsed: '52.8B',
    icon: '🎬'
  },
  {
    rank: 8,
    appName: 'Cline',
    description: '开源 IDE 内 AI 编程代理',
    primaryModel: 'Claude Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '31.6B',
    icon: '🖥️'
  },
  {
    rank: 9,
    appName: 'ISEKAI ZERO',
    description: 'AI 冒险游戏，与角色一起展开旅程',
    primaryModel: 'Claude Opus 4.7',
    category: 'AI 游戏',
    tokensUsed: '29.4B',
    icon: '🎮'
  },
  {
    rank: 10,
    appName: 'Roo Code',
    description: 'VS Code 扩展，提供多模式 AI 编程团队',
    primaryModel: 'Claude Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '22.1B',
    icon: '🦘'
  }
]

// ============================================================
// 市场分析洞察
// ============================================================

export const marketInsights: MarketInsight[] = [
  {
    id: 'deepseek-v4-domination',
    title: '🔥 DeepSeek V4 Flash 永久降价 75% 后暴涨 892%，以 3.43T 登顶全球',
    content: 'DeepSeek 5 月 22 日宣布 V4 系列永久降价 75%（Flash 低至 $0.07/百万 Token），一周内 Token 消耗量从 340B 飙升至 3.43T，取代 Kimi K2.6 登顶全球第一。极致性价比策略颠覆行业定价体系，其他厂商被迫跟进降价。',
    type: 'trend',
    icon: '🚀'
  },
  {
    id: 'tencent-hy3-surge',
    title: '🏆 腾讯混元 Hy3 首次进入全球 Top 2，周增长 210%',
    content: '腾讯混元 Hy3 Preview 凭借 256K 上下文、原生 Agent 支持和 WorkBuddy/ClawPro 生态整合，周用量飙升 210% 至 2.66T，首次跻身全球 Top 3。这是腾讯模型首次进入全球使用量前三，标志着腾讯 AI 商业化进入收获期。',
    type: 'opportunity',
    icon: '🎯'
  },
  {
    id: 'china-consecutive-lead',
    title: '🇨🇳 中国模型连续 4 周领先美国：9.22T vs 4.93T',
    content: 'DeepSeek V4 Flash（#1, 3.43T）+ 混元 Hy3（#2, 2.66T）+ Kimi K2.6（#3, 1.92T）+ Qwen3.7-Max（#7, 1.13T）+ DeepSeek V4 Pro（#9, 876B）+ MiniMax M2.7（#10, 824B）共 6 个中国模型入围 Top 10，合计 10.74T。中国模型已连续 4 周在全球 API 调用量上超越美国模型。',
    type: 'trend',
    icon: '📈'
  },
  {
    id: 'google-io-gemini',
    title: '⚡ Google I/O 2026：Gemini 3.5 Flash 发布一周即入 Top 5',
    content: 'Google I/O 2026（5月19日）发布 Gemini 3.5 Flash，原生 1M 上下文 + 多模态 + Omni 世界模型。发布仅一周 Token 消耗即达 1.47T 进入全球 Top 5，增长 156%。同步发布的 Spark 智能代理已成为全球 Top 4 应用。',
    type: 'info',
    icon: '🌟'
  },
  {
    id: 'weekly-token-record',
    title: '📊 全球周 Token 总量首破 28.9T，连续 5 周增长',
    content: '本周全球 API Token 消耗总量达到 28.9T 的历史新高，连续第 5 周正增长。驱动因素包括：DeepSeek 永久降价带来的价格战效应、Google I/O 新产品发布、AI Agent 应用全面爆发。万亿级（>1T）模型数量从上月的 5 个扩大到 7 个。',
    type: 'info',
    icon: '📊'
  },
  {
    id: 'agent-apps-dominance',
    title: '🤖 AI Agent 应用全面主导：Top 10 中 Agent/编程工具占 8 席',
    content: 'OpenClaw（412B）继续以巨大优势领跑应用榜。新晋 Google Spark（198B）和腾讯 WorkBuddy（134B）分别入围第 4 和第 6。前 10 名应用中 8 个是编程/Agent 工具，AI Agent 作为 LLM 最核心商业化场景的地位进一步巩固。',
    type: 'trend',
    icon: '🤖'
  }
]

// ============================================================
// 厂商市场份额数据（OpenRouter Market Share，截止 2026-05-25）
// 数据来源：https://openrouter.ai/rankings（Market Share 板块）
// ============================================================

export const vendorShares: VendorShare[] = [
  { vendor: 'DeepSeek',    country: '🇨🇳 中国', modelsInTop10: 2, totalTokens: '4.31T', sharePercent: 22.4, color: '#eab308' },
  { vendor: 'Tencent',     country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '2.66T', sharePercent: 13.8, color: '#365314' },
  { vendor: 'Anthropic',   country: '🇺🇸 美国', modelsInTop10: 2, totalTokens: '3.03T', sharePercent: 15.7, color: '#14b8a6' },
  { vendor: 'Google',      country: '🇺🇸 美国', modelsInTop10: 1, totalTokens: '1.47T', sharePercent: 7.6,  color: '#3b82f6' },
  { vendor: 'Moonshot AI', country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '1.92T', sharePercent: 10.0, color: '#8b5cf6' },
  { vendor: 'Alibaba',     country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '1.13T', sharePercent: 5.9,  color: '#f97316' },
  { vendor: 'xAI',         country: '🇺🇸 美国', modelsInTop10: 1, totalTokens: '892B',  sharePercent: 4.6,  color: '#6366f1' },
  { vendor: 'MiniMax',     country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '824B',  sharePercent: 4.3,  color: '#4ade80' },
  { vendor: 'OpenAI',      country: '🇺🇸 美国', modelsInTop10: 0, totalTokens: '680B',  sharePercent: 3.5,  color: '#a3e635' },
  { vendor: 'Others',      country: '🌐 其他', modelsInTop10: 0, totalTokens: '2.33T', sharePercent: 12.2, color: '#ec4899' }
]

// ============================================================
// 增长趋势分类
// ============================================================

export const growthCategories = {
  explosive: {
    label: '🔥 爆发式增长',
    description: '周增长 > 200%',
    color: '#ef4444',
    bgColor: '#fef2f2',
    models: ['DeepSeek V4 Flash', '混元 Hy3 Preview', 'Qwen3.7-Max']
  },
  strong: {
    label: '📈 强劲增长',
    description: '周增长 30%~200%',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    models: ['Gemini 3.5 Flash', 'DeepSeek V4 Pro', 'Claude Sonnet 4.6']
  },
  steady: {
    label: '➡️ 稳定',
    description: '周增长 -20%~30%',
    color: '#6366f1',
    bgColor: '#eef2ff',
    models: ['Kimi K2.6', 'Claude Opus 4.7', 'Grok 4.1 Fast', 'Minimax M2.7']
  },
  declining: {
    label: '📉 下滑',
    description: '周增长 < -20%',
    color: '#94a3b8',
    bgColor: '#f8fafc',
    models: []
  }
}

// ============================================================
// 区域竞争格局
// ============================================================

export const regionStats = [
  {
    region: '🇨🇳 中国',
    modelsCount: 6,
    totalTokens: '10.74T',
    topModel: 'DeepSeek V4 Flash',
    trend: 'up' as const,
    highlight: '6 个模型入围 Top 10，合计 Token 消耗 10.74T，连续 4 周领先美国'
  },
  {
    region: '🇺🇸 美国',
    modelsCount: 4,
    totalTokens: '5.39T',
    topModel: 'Claude Sonnet 4.6',
    trend: 'steady' as const,
    highlight: 'Anthropic 占 2 席、Google 和 xAI 各 1 席，高端市场仍具竞争力'
  }
]

// ============================================================
// 执行摘要（页面顶部总结）
// ============================================================

export const executiveSummary = {
  title: '全球 LLM 排名周报',
  subtitle: '基于 OpenRouter 全球 API 实际调用量（Token 消耗量）',
  lastUpdated: '2026-05-25',
  dataSource: 'OpenRouter Rankings',
  dataSourceUrl: 'https://openrouter.ai/rankings',
  keyFindings: [
    {
      icon: '🏆',
      text: 'DeepSeek V4 Flash 永久降价 75% 后暴涨 892%，以 3.43T 登顶全球，极致性价比颠覆行业定价',
      type: 'highlight' as const
    },
    {
      icon: '🎯',
      text: '腾讯混元 Hy3 Preview 首次进入全球 Top 2（2.66T），周增长 210%，Agent 生态全面爆发',
      type: 'positive' as const
    },
    {
      icon: '🇨🇳',
      text: '中国模型占据 Top 10 中 6 席（DeepSeek×2 / 混元 / Kimi / Qwen / MiniMax），合计 10.74T，连续 4 周领先美国',
      type: 'positive' as const
    },
    {
      icon: '⚡',
      text: 'Google I/O 发布 Gemini 3.5 Flash 一周即入 Top 5（1.47T），Spark Agent 成为 Top 4 应用',
      type: 'neutral' as const
    },
    {
      icon: '📊',
      text: '全球周 Token 总量首破 28.9T（连续 5 周增长），万亿级模型从 5 个扩容到 7 个',
      type: 'neutral' as const
    }
  ],
  totalTokensTop10: '16.24T',
  chinaTokensShare: '55.9%',
  usTokensShare: '28.1%'
}
