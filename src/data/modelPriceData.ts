/**
 * 模型商价格动态数据
 * 覆盖：DeepSeek、Kimi（月之暗面）、MiniMax、GLM（智谱AI）
 * 数据来源：各厂商官方定价页（每周一自动更新）
 * 最后更新：2026-04-27
 */

/** 单模型定价 */
export interface ModelPrice {
  modelName: string            // 模型名称，如 "deepseek-v4-flash"
  displayName: string          // 展示名称，如 "DeepSeek V4-Flash"
  inputPrice: number           // 输入价格（元/百万 tokens），缓存未命中
  outputPrice: number          // 输出价格（元/百万 tokens）
  cacheHitPrice?: number       // 缓存命中价格（元/百万 tokens）
  contextLength: string        // 上下文长度，如 "128K"、"32K~128K"
  capabilities: string[]       // 能力标签，如 ["文本", "代码", "多模态", "Agent"]
  lastUpdated: string         // 价格最后更新日期 YYYY-MM-DD
  officialUrl: string         // 官方定价页链接
}

/** 价格变更记录 */
export interface PriceChange {
  modelName: string
  field: 'input' | 'output' | 'cache'
  oldValue: number
  newValue: number
  direction: 'up' | 'down' | 'unchanged'
  changeDate: string          // 变更生效日期
  note?: string              // 备注，如 "限时2.5折，原价12"
}

/** 厂商公告/动态 */
export interface VendorAnnouncement {
  date: string               // 发布日期 YYYY-MM-DD
  title: string              // 公告标题
  url: string                // 公告链接
  type: '新模型' | '价格调整' | '功能升级' | '其他'
}

/** 单厂商数据 */
export interface VendorPriceData {
  vendorKey: string                              // 厂商 key："deepseek" | "kimi" | "minimax" | "glm"
  vendorName: string                              // 展示名称
  vendorFullname: string                         // 公司全名
  logoIcon: string                               // emoji 图标
  websiteUrl: string                             // 官网地址
  pricingUrl: string                             // 官方定价页
  lastChecked: string                            // 数据最后检查日期
  models: ModelPrice[]                           // 模型定价列表
  priceChanges: PriceChange[]                    // 近期价格变更
  announcements: VendorAnnouncement[]           // 近期公告
}

// ============================================================
// 数据：四家厂商
// ============================================================

export const vendorData: VendorPriceData[] = [
  // ----------------------------------------------------------
  // 1. DeepSeek（深度求索）
  // ----------------------------------------------------------
  {
    vendorKey: 'deepseek',
    vendorName: 'DeepSeek',
    vendorFullname: '深度求索（杭州）科技有限公司',
    logoIcon: '🧠',
    websiteUrl: 'https://www.deepseek.com',
    pricingUrl: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/',
    lastChecked: '2026-04-27',
    models: [
      {
        modelName: 'deepseek-v4-flash',
        displayName: 'DeepSeek V4-Flash',
        inputPrice: 1,
        outputPrice: 2,
        cacheHitPrice: 0.02,
        contextLength: '128K',
        capabilities: ['文本', '代码', '推理', '高速'],
        lastUpdated: '2026-04-01',
        officialUrl: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/'
      },
      {
        modelName: 'deepseek-v4-pro',
        displayName: 'DeepSeek V4-Pro',
        inputPrice: 3,           // 限时2.5折，原价 12
        outputPrice: 6,          // 限时2.5折，原价 24
        cacheHitPrice: 0.025,   // 限时2.5折，原价 0.1
        contextLength: '128K',
        capabilities: ['文本', '代码', '推理', '思考模式'],
        lastUpdated: '2026-04-01',
        officialUrl: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/'
      }
    ],
    priceChanges: [
      {
        modelName: 'deepseek-v4-pro',
        field: 'input',
        oldValue: 12,
        newValue: 3,
        direction: 'down',
        changeDate: '2026-04-01',
        note: '限时2.5折优惠，有效期至 2026-05-05'
      },
      {
        modelName: 'deepseek-v4-pro',
        field: 'output',
        oldValue: 24,
        newValue: 6,
        direction: 'down',
        changeDate: '2026-04-01',
        note: '限时2.5折优惠，有效期至 2026-05-05'
      }
    ],
    announcements: [
      {
        date: '2026-04-01',
        title: 'DeepSeek V4-Pro 开启限时2.5折优惠',
        url: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/',
        type: '价格调整'
      }
    ]
  },

  // ----------------------------------------------------------
  // 2. Kimi（月之暗面）
  // 注：K2.6 于 2026-04-20 发布并开源，定价参考官方基准
  // ----------------------------------------------------------
  {
    vendorKey: 'kimi',
    vendorName: 'Kimi',
    vendorFullname: '北京月之暗面科技有限公司',
    logoIcon: '🌙',
    websiteUrl: 'https://www.kimi.com',
    pricingUrl: 'https://platform.kimi.com/docs/pricing/chat',
    lastChecked: '2026-04-27',
    models: [
      {
        modelName: 'kimi-k2.6',
        displayName: 'Kimi K2.6',
        inputPrice: 4,
        outputPrice: 21,
        cacheHitPrice: undefined,   // 官网未公开具体数值，以平台为准
        contextLength: '256K',
        capabilities: ['文本', '代码', '多模态', 'Agent', '长上下文'],
        lastUpdated: '2026-04-20',
        officialUrl: 'https://platform.kimi.com/docs/pricing/chat-k26'
      },
      {
        modelName: 'kimi-k2.5',
        displayName: 'Kimi K2.5',
        inputPrice: 4,
        outputPrice: 21,
        cacheHitPrice: undefined,
        contextLength: '128K',
        capabilities: ['文本', '代码', '多模态', 'Agent'],
        lastUpdated: '2026-01-27',
        officialUrl: 'https://platform.kimi.com/docs/pricing/chat-k25'
      }
    ],
    priceChanges: [],
    announcements: [
      {
        date: '2026-04-20',
        title: 'Kimi K2.6 发布并开源，代码能力对标 GPT-5.4',
        url: 'https://news.qq.com/rain/a/20260421A05U7F00',
        type: '新模型'
      },
      {
        date: '2026-01-27',
        title: 'Kimi K2.5 发布，原生多模态大规模 MoE 架构',
        url: 'https://platform.kimi.com/docs',
        type: '新模型'
      }
    ]
  },

  // ----------------------------------------------------------
  // 3. MiniMax
  // ----------------------------------------------------------
  {
    vendorKey: 'minimax',
    vendorName: 'MiniMax',
    vendorFullname: '上海稀宇科技有限公司',
    logoIcon: '🔮',
    websiteUrl: 'https://www.minimaxi.com',
    pricingUrl: 'https://platform.minimaxi.com/docs/guides/pricing-paygo',
    lastChecked: '2026-04-27',
    models: [
      {
        modelName: 'MiniMax-M2.7',
        displayName: 'MiniMax M2.7',
        inputPrice: 2.1,
        outputPrice: 8.4,
        cacheHitPrice: 0.42,
        contextLength: '128K',
        capabilities: ['文本', '代码', 'Agent', '自我进化'],
        lastUpdated: '2026-04-01',
        officialUrl: 'https://platform.minimaxi.com/docs/guides/pricing-paygo'
      },
      {
        modelName: 'MiniMax-M2.7-highspeed',
        displayName: 'MiniMax M2.7 HighSpeed',
        inputPrice: 4.2,
        outputPrice: 16.8,
        cacheHitPrice: 0.42,
        contextLength: '128K',
        capabilities: ['文本', '高速推理'],
        lastUpdated: '2026-04-01',
        officialUrl: 'https://platform.minimaxi.com/docs/guides/pricing-paygo'
      },
      {
        modelName: 'MiniMax-M2.5',
        displayName: 'MiniMax M2.5',
        inputPrice: 2.1,
        outputPrice: 8.4,
        cacheHitPrice: 0.21,
        contextLength: '128K',
        capabilities: ['文本', '代码'],
        lastUpdated: '2026-01-01',
        officialUrl: 'https://platform.minimaxi.com/docs/guides/pricing-paygo'
      }
    ],
    priceChanges: [],
    announcements: [
      {
        date: '2026-01-15',
        title: 'MiniMax 发布 M2.7 / M2.5 系列，输入低至 1元/百万 tokens',
        url: 'https://finance.sina.com.cn/jjxw/2025-01-15/doc-ineezssx7929108.shtml',
        type: '新模型'
      }
    ]
  },

  // ----------------------------------------------------------
  // 4. GLM（智谱 AI）
  // 注：GLM-5.1 于 2026-04 发布，GLM-5-Turbo 同步在售
  // 价格分档：[0,32K) 和 [32K,∞)，此处取第一档
  // ----------------------------------------------------------
  {
    vendorKey: 'glm',
    vendorName: 'GLM',
    vendorFullname: '北京智谱华章科技有限公司',
    logoIcon: '🤖',
    websiteUrl: 'https://www.zhipuai.cn',
    pricingUrl: 'https://open.bigmodel.cn/pricing',
    lastChecked: '2026-04-27',
    models: [
      {
        modelName: 'glm-5.1',
        displayName: 'GLM-5.1',
        inputPrice: 6,       // [0,32K) 档；[32K,∞) 档为 8
        outputPrice: 24,      // [0,32K) 档；[32K,∞) 档为 28
        cacheHitPrice: 1.3,  // [0,32K) 档
        contextLength: '>128K',
        capabilities: ['文本', '代码', '长程任务', '推理'],
        lastUpdated: '2026-04-09',
        officialUrl: 'https://open.bigmodel.cn/pricing'
      },
      {
        modelName: 'glm-5-turbo',
        displayName: 'GLM-5-Turbo',
        inputPrice: 5,       // [0,32K) 档；[32K,∞) 档为 7
        outputPrice: 22,      // [0,32K) 档；[32K,∞) 档为 26
        cacheHitPrice: 1.2,
        contextLength: '128K',
        capabilities: ['文本', '高性价比'],
        lastUpdated: '2026-02-01',
        officialUrl: 'https://open.bigmodel.cn/pricing'
      },
      {
        modelName: 'glm-5',
        displayName: 'GLM-5',
        inputPrice: 4,       // [0,32K) 档
        outputPrice: 18,      // [0,32K) 档
        cacheHitPrice: 1,
        contextLength: '128K',
        capabilities: ['文本', '代码'],
        lastUpdated: '2026-01-01',
        officialUrl: 'https://open.bigmodel.cn/pricing'
      }
    ],
    priceChanges: [
      {
        modelName: 'glm-5.1',
        field: 'input',
        oldValue: 4,        // GLM-5 入门档参考
        newValue: 6,
        direction: 'up',
        changeDate: '2026-04-09',
        note: 'GLM-5.1 为新旗舰，定价高于 GLM-5'
      }
    ],
    announcements: [
      {
        date: '2026-04-09',
        title: 'GLM-5.1 发布，支持长程 8 小时连续任务',
        url: 'https://wallstreetcn.com/articles/3769464',
        type: '新模型'
      },
      {
        date: '2026-02-12',
        title: 'GLM Coding Plan 涨价，Lite ¥40→¥49，取消首购优惠',
        url: 'https://www.aitntnews.com/newDetail.html?newId=23643',
        type: '价格调整'
      }
    ]
  }
]

/** 价格趋势对比（用于首页概览卡片） */
export interface PriceTrend {
  vendorKey: string
  modelName: string
  displayName: string
  currentInput: number
  currentOutput: number
  trend: 'up' | 'down' | 'stable'
  trendNote: string
}

/** 获取所有模型的价格趋势（简化版，用于横向对比） */
export function getPriceTrends(): PriceTrend[] {
  const trends: PriceTrend[] = []

  for (const v of vendorData) {
    for (const m of v.models) {
      const change = v.priceChanges.find(c => c.modelName === m.modelName)
      let trend: 'up' | 'down' | 'stable' = 'stable'
      let trendNote = '价格稳定'

      if (change) {
        trend = change.direction === 'up' ? 'up' : change.direction === 'down' ? 'down' : 'stable'
        trendNote = change.note || `${change.oldValue} → ${change.newValue}`
      }

      trends.push({
        vendorKey: v.vendorKey,
        modelName: m.modelName,
        displayName: m.displayName,
        currentInput: m.inputPrice,
        currentOutput: m.outputPrice,
        trend,
        trendNote
      })
    }
  }

  return trends
}
