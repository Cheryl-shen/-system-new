/**
 * 模型商价格动态数据
 * 覆盖：DeepSeek、Kimi（月之暗面）、MiniMax、GLM（智谱AI）
 * 数据来源：各厂商官方定价页（每周一自动更新）
 * 最后更新：2026-05-31
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
    lastChecked: '2026-05-31',
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
        inputPrice: 3,           // 5/31 起永久降价为原定价的1/4（原价 12）
        outputPrice: 6,          // 5/31 起永久降价为原定价的1/4（原价 24）
        cacheHitPrice: 0.025,    // 5/31 起永久降价为原定价的1/4（原价 0.1）
        contextLength: '128K',
        capabilities: ['文本', '代码', '推理', '思考模式'],
        lastUpdated: '2026-05-31',
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
        changeDate: '2026-05-31',
        note: '永久降价75%！2.5折优惠转为常态价，刷新全球主流大模型价格新低'
      },
      {
        modelName: 'deepseek-v4-pro',
        field: 'output',
        oldValue: 24,
        newValue: 6,
        direction: 'down',
        changeDate: '2026-05-31',
        note: '永久降价75%，输出价仅为原定价的1/4'
      }
    ],
    announcements: [
      {
        date: '2026-05-23',
        title: 'DeepSeek-V4-Pro 永久降价75%：5/31优惠期结束后正式调整为原价1/4，创全球主流大模型价格新低',
        url: 'https://news.qq.com/rain/a/20260525A06W6300',
        type: '价格调整'
      },
      {
        date: '2026-04-01',
        title: 'DeepSeek V4-Pro 开启限时2.5折优惠（已转为永久价格）',
        url: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/',
        type: '价格调整'
      }
    ]
  },

  // ----------------------------------------------------------
  // 2. Kimi（月之暗面）
  // K2.6 于 2026-04-20 发布，定价较 K2.5 上涨 58~60%
  // 价格来源：官方定价页（美元），按汇率 ≈7.2 换算为人民币
  // ----------------------------------------------------------
  {
    vendorKey: 'kimi',
    vendorName: 'Kimi',
    vendorFullname: '北京月之暗面科技有限公司',
    logoIcon: '🌙',
    websiteUrl: 'https://www.kimi.com',
    pricingUrl: 'https://platform.kimi.com/docs/pricing/chat',
    lastChecked: '2026-05-31',
    models: [
      {
        modelName: 'kimi-k2.6',
        displayName: 'Kimi K2.6',
        inputPrice: 7,          // $0.95 ≈ ¥6.84，取整 7
        outputPrice: 29,         // $4.00 ≈ ¥28.8，取整 29
        cacheHitPrice: 1.2,     // $0.16 ≈ ¥1.15，取整 1.2
        contextLength: '256K',
        capabilities: ['文本', '代码', '多模态', 'Agent', '长上下文'],
        lastUpdated: '2026-04-20',
        officialUrl: 'https://platform.kimi.com/docs/pricing/chat-k26'
      },
      {
        modelName: 'kimi-k2.5',
        displayName: 'Kimi K2.5（已下线）',
        inputPrice: 4,          // $0.60 ≈ ¥4.32，取整 4
        outputPrice: 22,         // $3.00 ≈ ¥21.6，取整 22
        cacheHitPrice: 0.7,     // $0.10 ≈ ¥0.72，取整 0.7
        contextLength: '256K',
        capabilities: ['已下线', '建议迁移至 K2.6'],
        lastUpdated: '2026-05-25',
        officialUrl: 'https://platform.kimi.com/docs/pricing/chat-k25'
      }
    ],
    priceChanges: [
      {
        modelName: 'kimi-k2.5',
        field: 'input',
        oldValue: 4,
        newValue: 0,
        direction: 'down',
        changeDate: '2026-05-25',
        note: 'K2 系列 API 于 5/25 正式下线，停止维护和支持，需迁移至 K2.6'
      },
      {
        modelName: 'kimi-k2.6',
        field: 'input',
        oldValue: 4,
        newValue: 7,
        direction: 'up',
        changeDate: '2026-04-20',
        note: 'K2.6 发布，缓存未命中输入涨价约58%，输出涨价约32%'
      }
    ],
    announcements: [
      {
        date: '2026-05-26',
        title: 'Kimi K2 系列 API 于 5/25 正式下线，建议切换至最新模型 Kimi K2.6',
        url: 'https://news.qq.com/rain/a/20260526A02VQC00',
        type: '其他'
      },
      {
        date: '2026-05-07',
        title: '月之暗面 Kimi 完成约 20 亿美元新一轮融资，投后估值超 200 亿美元，国资入场',
        url: 'https://ai.zol.com.cn/1176/11768526.html',
        type: '其他'
      },
      {
        date: '2026-04-20',
        title: 'Kimi K2.6 发布并开源，代码能力对标 GPT-5.4，定价上涨 58~60%',
        url: 'https://news.qq.com/rain/a/20260421A05U7F00',
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
    lastChecked: '2026-05-31',
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
        date: '2026-05-29',
        title: 'MiniMax 与中信证券签署辅导协议，正式启动 A 股 IPO 进程',
        url: 'https://stock.10jqka.com.cn/20260530/c677098186.shtml',
        type: '其他'
      },
      {
        date: '2026-04-28',
        title: '大摩研报：MiniMax 在 M3 模型升级后或将调价（OpenRouter 中国模型份额已从 5% 升至 32%）',
        url: 'https://finance.sina.com.cn/roll/2026-04-28/doc-inhwaawe7251807.shtml',
        type: '价格调整'
      },
      {
        date: '2026-01-15',
        title: 'MiniMax 发布 M2.7 / M2.5 系列，输入低至 ¥2.1/百万 tokens',
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
    lastChecked: '2026-05-31',
    models: [
      {
        modelName: 'glm-5.1-highspeed',
        displayName: 'GLM-5.1-HighSpeed 🆕',
        inputPrice: 6,       // 与 GLM-5.1 同价，[0,32K) 档；高速版主打速度，价格不变
        outputPrice: 24,
        cacheHitPrice: 1.3,
        contextLength: '200K',
        capabilities: ['文本', '代码', '高速推理（400 tok/s）', '智能体'],
        lastUpdated: '2026-05-22',
        officialUrl: 'https://docs.bigmodel.cn/cn/guide/models/text/glm-5.1-highspeed'
      },
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
        modelName: 'glm-5.1-highspeed',
        field: 'input',
        oldValue: 0,
        newValue: 6,
        direction: 'unchanged',
        changeDate: '2026-05-22',
        note: '新模型上线：GLM-5.1 高速版，400 tokens/s 刷新全球大模型 API 速度上限，价格与标准版一致'
      },
      {
        modelName: 'glm-5.1',
        field: 'input',
        oldValue: 5.5,       // 涨价10%前原价（≈6 ÷ 1.1）
        newValue: 6,
        direction: 'up',
        changeDate: '2026-04-09',
        note: 'GLM-5.1 发布，全线涨价10%'
      }
    ],
    announcements: [
      {
        date: '2026-05-22',
        title: 'GLM-5.1 高速版 API 上线，输出速度达 400 tokens/s，刷新全球大模型 API 速度上限；智谱港股早盘涨超 13%',
        url: 'https://finance.sina.com.cn/stock/hkstock/marketalerts/2026-05-22/doc-inhytqkw6283967.shtml',
        type: '新模型'
      },
      {
        date: '2026-04-09',
        title: 'GLM-5.1 发布并开源，支持长程8小时连续任务，全线涨价10%',
        url: 'https://wallstreetcn.com/articles/3769464',
        type: '新模型'
      },
      {
        date: '2026-03-16',
        title: 'GLM-5-Turbo 涨价20%，专为 Agent 场景优化',
        url: 'https://www.thepaper.cn/newsDetail_forward_33056587',
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
