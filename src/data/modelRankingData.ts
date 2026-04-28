/**
 * 全球模型能力排名数据
 * 数据来源：OpenRouter Rankings (https://openrouter.ai/rankings)
 * 统计口径：全球 API 实际调用量（Token 消耗量），反映真实市场需求
 * 最后更新：2026-04-28
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
    modelName: 'Kimi K2.6',
    developer: 'Moonshot AI（月之暗面）',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '1.88T',
    tokensRaw: 1880000000000,
    weeklyGrowth: 7683,
    growthTrend: 'explosive',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '多模态', '长上下文'],
    contextLength: '200K',
    releaseDate: '2026-04-20',
    highlight: '一周暴涨 7683%，登顶全球用量榜首，中国模型首次称王'
  },
  {
    rank: 2,
    modelName: 'Claude Sonnet 4.6',
    developer: 'Anthropic',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '1.35T',
    tokensRaw: 1350000000000,
    weeklyGrowth: 3,
    growthTrend: 'steady',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '推理', 'Agent'],
    contextLength: '200K',
    releaseDate: '2026-03-15',
    highlight: '编程和 Agent 场景首选，性价比之王'
  },
  {
    rank: 3,
    modelName: 'DeepSeek V3.2',
    developer: 'DeepSeek（深度求索）',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '1.24T',
    tokensRaw: 1240000000000,
    weeklyGrowth: 3,
    growthTrend: 'steady',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '数学推理', 'MoE'],
    contextLength: '128K',
    releaseDate: '2026-04-01',
    highlight: '开源 MoE 标杆，稳居全球前三'
  },
  {
    rank: 4,
    modelName: 'Claude Opus 4.7',
    developer: 'Anthropic',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '1.17T',
    tokensRaw: 1170000000000,
    weeklyGrowth: 180,
    growthTrend: 'strong',
    category: '超旗舰',
    capabilities: ['深度推理', '复杂编码', '长文档分析', 'Agent'],
    contextLength: '200K',
    releaseDate: '2026-04-10',
    highlight: '最强推理模型，复杂任务场景增长 180%'
  },
  {
    rank: 5,
    modelName: 'Gemini 3 Flash Preview',
    developer: 'Google DeepMind',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '1.03T',
    tokensRaw: 1030000000000,
    weeklyGrowth: 11,
    growthTrend: 'steady',
    category: '轻量高速',
    capabilities: ['文本生成', '多模态', '高速', '低延迟'],
    contextLength: '1M',
    releaseDate: '2026-03-20',
    highlight: '1M 上下文 + 极低延迟，万亿级用量俱乐部成员'
  },
  {
    rank: 6,
    modelName: 'Minimax M2.7',
    developer: 'MiniMax',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '775B',
    tokensRaw: 775000000000,
    weeklyGrowth: 17,
    growthTrend: 'steady',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '多模态', '函数调用'],
    contextLength: '128K',
    releaseDate: '2026-03-28',
    highlight: '中国新锐厂商，综合能力均衡'
  },
  {
    rank: 7,
    modelName: 'Grok 4.1 Fast',
    developer: 'xAI',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '764B',
    tokensRaw: 764000000000,
    weeklyGrowth: 34,
    growthTrend: 'strong',
    category: '旗舰大模型',
    capabilities: ['文本生成', '代码', '实时信息', '推理'],
    contextLength: '128K',
    releaseDate: '2026-04-05',
    highlight: 'xAI 旗舰，实时信息获取能力突出，增长 34%'
  },
  {
    rank: 8,
    modelName: 'Step 3.5 Flash',
    developer: 'StepFun（阶跃星辰）',
    developerCountry: '🇨🇳 中国',
    tokensUsed: '762B',
    tokensRaw: 762000000000,
    weeklyGrowth: 78,
    growthTrend: 'strong',
    category: '轻量高速',
    capabilities: ['文本生成', '代码', '高速', '低成本'],
    contextLength: '128K',
    releaseDate: '2026-04-10',
    highlight: '阶跃星辰黑马，周增长 78%，性价比极高'
  },
  {
    rank: 9,
    modelName: 'Claude Opus 4.6',
    developer: 'Anthropic',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '662B',
    tokensRaw: 662000000000,
    weeklyGrowth: 42,
    growthTrend: 'strong',
    category: '超旗舰',
    capabilities: ['深度推理', '复杂编码', '长文档分析', 'Agent'],
    contextLength: '200K',
    releaseDate: '2026-01-20',
    highlight: 'Anthropic 上一代旗舰，仍有 42% 增长'
  },
  {
    rank: 10,
    modelName: 'Nemotron 3 Super 120B',
    developer: 'NVIDIA',
    developerCountry: '🇺🇸 美国',
    tokensUsed: '656B',
    tokensRaw: 656000000000,
    weeklyGrowth: 25,
    growthTrend: 'steady',
    category: '开源大模型',
    capabilities: ['文本生成', '代码', '推理', '免费'],
    contextLength: '128K',
    releaseDate: '2026-04-15',
    highlight: 'NVIDIA 免费开放模型，社区采用率高'
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
    tokensUsed: '307B',
    icon: '🤖'
  },
  {
    rank: 2,
    appName: 'Kilo Code',
    description: '开源 AI 编程代理，支持 VS Code、JetBrains 和 CLI',
    primaryModel: 'Claude Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '207B',
    icon: '💻'
  },
  {
    rank: 3,
    appName: 'Hermes Agent',
    description: 'Nous Research 的开源自我进化 AI 代理，内置 40+ 工具',
    primaryModel: '多模型',
    category: 'AI Agent',
    tokensUsed: '192B',
    icon: '⚡'
  },
  {
    rank: 4,
    appName: 'Claude Code',
    description: 'Anthropic 的代理编程工具，支持全代码库操作',
    primaryModel: 'Claude Opus 4.7 / Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '131B',
    icon: '🔧'
  },
  {
    rank: 5,
    appName: 'Descript',
    description: 'AI 视频与播客编辑器',
    primaryModel: '多模型',
    category: '视频/播客编辑',
    tokensUsed: '46.4B',
    icon: '🎬'
  },
  {
    rank: 6,
    appName: 'ISEKAI ZERO',
    description: 'AI 冒险游戏，与角色一起展开旅程',
    primaryModel: 'Claude Opus 4.7',
    category: 'AI 游戏',
    tokensUsed: '28.7B',
    icon: '🎮'
  },
  {
    rank: 7,
    appName: 'Janitor AI',
    description: '用户创建自定义 AI 角色进行互动角色扮演',
    primaryModel: '多模型',
    category: '角色聊天',
    tokensUsed: '26.1B',
    icon: '🎭'
  },
  {
    rank: 8,
    appName: 'Cline',
    description: '开源 IDE 内 AI 编程代理',
    primaryModel: 'Claude Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '25.7B',
    icon: '🖥️'
  },
  {
    rank: 9,
    appName: 'Roo Code',
    description: 'VS Code 扩展，提供多模式 AI 编程团队',
    primaryModel: 'Claude Sonnet 4.6',
    category: 'AI 编程',
    tokensUsed: '17.7B',
    icon: '🦘'
  },
  {
    rank: 10,
    appName: 'pi',
    description: '个人化编程代理',
    primaryModel: '多模型',
    category: 'AI 编程',
    tokensUsed: '17.5B',
    icon: '🥧'
  }
]

// ============================================================
// 市场分析洞察
// ============================================================

export const marketInsights: MarketInsight[] = [
  {
    id: 'kimi-surge',
    title: '🔥 Kimi K2.6 一周暴涨 7683%，中国模型首次登顶全球',
    content: 'Moonshot AI 发布的 Kimi K2.6 凭借强悍的综合性能和极具竞争力的定价，在一周内 Token 消耗量飙升至 1.88T，取代 Claude Sonnet 成为全球使用量最大的 LLM。这是中国模型首次在全球 API 调用量上登顶，标志着中国 AI 产业的里程碑时刻。',
    type: 'trend',
    icon: '🚀'
  },
  {
    id: 'anthropic-dominance',
    title: 'Anthropic 占据 Top 10 中 3 席，合计 3.18T 高端市场护城河深厚',
    content: 'Claude Sonnet 4.6（#2）、Claude Opus 4.7（#4）和 Claude Opus 4.6（#9）合计消耗 3.18T Tokens，Anthropic 仍是全球高端 AI 应用的首选供应商。Opus 4.7 的 180% 增长表明复杂推理和 Agent 场景需求爆发。',
    type: 'info',
    icon: '🏛️'
  },
  {
    id: 'china-rise',
    title: '中国军团强势崛起：Top 10 占据 4 席',
    content: 'Kimi K2.6（#1）、DeepSeek V3.2（#3）、MiniMax M2.7（#6）、Step 3.5 Flash（#8）共 4 个中国模型入围 Top 10，合计 Token 消耗 4.66T。阶跃星辰以 78% 的增长率成为新晋黑马。',
    type: 'opportunity',
    icon: '🇨🇳'
  },
  {
    id: 'new-entrants',
    title: '🆕 xAI 与 NVIDIA 新晋入围 Top 10',
    content: 'xAI 的 Grok 4.1 Fast 以 34% 增长率跃升至第 7 名，实时信息获取能力成为差异化优势；NVIDIA Nemotron 3 Super 120B 作为免费开源模型入围第 10，显示芯片巨头在模型层的野心。OpenAI、Meta、Mistral 等昔日强者已跌出 Top 10。',
    type: 'warning',
    icon: '🔄'
  },
  {
    id: 'agent-era',
    title: 'AI Agent 时代来临，OpenClaw 以 307B 领跑应用榜',
    content: 'Top Apps 排名中，OpenClaw 以 307B Tokens 高居榜首，取代了 Cline 成为全球最大 Token 消耗应用。前 10 名应用中 6 个是编程/Agent 工具，AI Agent 自动化操作成为 LLM 最核心的应用场景。',
    type: 'trend',
    icon: '🤖'
  },
  {
    id: 'trillion-club',
    title: '万亿级俱乐部扩容：5 个模型突破 1T Token',
    content: 'Kimi K2.6（1.88T）、Claude Sonnet 4.6（1.35T）、DeepSeek V3.2（1.24T）、Claude Opus 4.7（1.17T）、Gemini 3 Flash Preview（1.03T）共 5 个模型进入万亿级 Token 消耗俱乐部，门槛大幅提高。',
    type: 'info',
    icon: '📊'
  }
]

// ============================================================
// 厂商市场份额数据（OpenRouter Market Share，截止 2026-04-26）
// 数据来源：https://openrouter.ai/rankings（Market Share 板块）
// ============================================================

export const vendorShares: VendorShare[] = [
  { vendor: 'Google',      country: '🇺🇸 美国', modelsInTop10: 1, totalTokens: '1.03T', sharePercent: 15.8, color: '#3b82f6' },
  { vendor: 'Anthropic',   country: '🇺🇸 美国', modelsInTop10: 3, totalTokens: '993B',  sharePercent: 15.1, color: '#14b8a6' },
  { vendor: 'OpenAI',      country: '🇺🇸 美国', modelsInTop10: 0, totalTokens: '726B',  sharePercent: 11.1, color: '#f97316' },
  { vendor: 'Moonshot AI', country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '664B',  sharePercent: 10.1, color: '#8b5cf6' },
  { vendor: 'DeepSeek',    country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '597B',  sharePercent: 9.1,  color: '#eab308' },
  { vendor: 'Tencent',     country: '🇨🇳 中国', modelsInTop10: 0, totalTokens: '375B',  sharePercent: 5.7,  color: '#365314' },
  { vendor: 'MiniMax',     country: '🇨🇳 中国', modelsInTop10: 1, totalTokens: '361B',  sharePercent: 5.5,  color: '#4ade80' },
  { vendor: 'Z-AI',        country: '🇨🇳 中国', modelsInTop10: 0, totalTokens: '310B',  sharePercent: 4.7,  color: '#84cc16' },
  { vendor: 'Qwen',        country: '🇨🇳 中国', modelsInTop10: 0, totalTokens: '272B',  sharePercent: 4.1,  color: '#a3e635' },
  { vendor: 'Others',      country: '🌐 其他', modelsInTop10: 0, totalTokens: '1.22T', sharePercent: 18.7, color: '#ec4899' }
]

// ============================================================
// 增长趋势分类
// ============================================================

export const growthCategories = {
  explosive: {
    label: '🔥 爆发式增长',
    description: '周增长 > 500%',
    color: '#ef4444',
    bgColor: '#fef2f2',
    models: ['Kimi K2.6']
  },
  strong: {
    label: '📈 强劲增长',
    description: '周增长 30%~500%',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    models: ['Claude Opus 4.7', 'Step 3.5 Flash', 'Claude Opus 4.6', 'Grok 4.1 Fast']
  },
  steady: {
    label: '➡️ 稳定',
    description: '周增长 -20%~30%',
    color: '#6366f1',
    bgColor: '#eef2ff',
    models: ['Claude Sonnet 4.6', 'DeepSeek V3.2', 'Gemini 3 Flash Preview', 'Minimax M2.7', 'Nemotron 3 Super 120B']
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
    modelsCount: 4,
    totalTokens: '4.66T',
    topModel: 'Kimi K2.6',
    trend: 'up' as const,
    highlight: '4 个模型入围 Top 10，合计 Token 消耗 4.66T 领先全球'
  },
  {
    region: '🇺🇸 美国',
    modelsCount: 6,
    totalTokens: '5.64T',
    topModel: 'Claude Sonnet 4.6',
    trend: 'steady' as const,
    highlight: 'Anthropic 独占 3 席，xAI / NVIDIA 新晋入围'
  }
]

// ============================================================
// 执行摘要（页面顶部总结）
// ============================================================

export const executiveSummary = {
  title: '全球 LLM 排名周报',
  subtitle: '基于 OpenRouter 全球 API 实际调用量（Token 消耗量）',
  lastUpdated: '2026-04-28',
  dataSource: 'OpenRouter Rankings',
  dataSourceUrl: 'https://openrouter.ai/rankings',
  keyFindings: [
    {
      icon: '🏆',
      text: 'Kimi K2.6 一周暴涨 7683% 登顶全球，中国模型首次在全球 API 调用量上排名第一',
      type: 'highlight' as const
    },
    {
      icon: '🏛️',
      text: 'Anthropic 占据 Top 10 中 3 席（Sonnet 4.6 / Opus 4.7 / Opus 4.6），合计 3.18T，高端市场绝对霸主',
      type: 'neutral' as const
    },
    {
      icon: '🇨🇳',
      text: '中国军团占据 Top 10 中 4 席（Kimi / DeepSeek / MiniMax / StepFun），合计 Token 消耗 4.66T',
      type: 'positive' as const
    },
    {
      icon: '🆕',
      text: 'xAI Grok 4.1 Fast 和 NVIDIA Nemotron 3 新晋 Top 10，AI 竞争格局加速分化',
      type: 'neutral' as const
    },
    {
      icon: '🤖',
      text: 'OpenClaw (307B) 取代 Cline 成为全球最大 Token 消耗应用，AI Agent 成为主导场景',
      type: 'neutral' as const
    }
  ],
  totalTokensTop10: '6.56T',
  chinaTokensShare: '39.2%',
  usTokensShare: '42.0%'
}
