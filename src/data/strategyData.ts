// 客户战略分析数据（经营情况 / AI 规划 / 出海规划 / 财报下载）
// 数据更新时间：2026-04-19
// 数据来源：公开财报 / 公司年报 / 媒体报道，仅供内部参考

export interface FinancialReport {
  title: string
  period: string // 如 "2025 年报"
  type: 'PDF' | '网页' | '官网'
  url: string
  publishDate: string
}

export interface CustomerStrategy {
  id: number
  name: string
  industry: string
  avatar: string
  stock: string // 股票代码
  website: string // 官网
  priority: '高' | '中' | '低'
  contact: string
  lastUpdate: string

  // 经营情况
  business: {
    overview: string
    keyMetrics: { label: string; value: string; trend?: 'up' | 'down' | 'flat' }[]
    highlights: string[]
    risks: string[]
  }

  // AI 规划
  ai: {
    strategy: string
    investment: string
    scenes: { name: string; desc: string; status: '已落地' | '推进中' | '规划中' }[]
    cloudVendors: string[] // 目前使用的云厂商
    opportunity: string // 腾讯云切入机会
  }

  // 出海规划
  overseas: {
    status: string // 出海阶段
    regions: string[] // 目标地区
    strategy: string // 出海策略
    challenges: string[] // 主要挑战
    opportunity: string // 腾讯云海外产品切入机会
  }

  // 财报链接
  reports: FinancialReport[]
}

export const strategyData: CustomerStrategy[] = [
  {
    id: 1,
    name: '唯品会',
    industry: '电商',
    avatar: '🛒',
    stock: 'NYSE: VIPS',
    website: 'https://www.vip.com',
    priority: '高',
    contact: 'gracecui',
    lastUpdate: '2026-04-18',
    business: {
      overview:
        '唯品会是中国领先的品牌特卖电商平台，以"正品、特卖、精选"为核心竞争力，SVIP 超级会员体系是近年核心增长引擎。2025 年在消费复苏乏力背景下业绩承压，但利润端保持稳健。',
      keyMetrics: [
        { label: '2025 GMV', value: '约 1,926 亿元', trend: 'flat' },
        { label: '2025 营收', value: '约 1,080 亿元', trend: 'down' },
        { label: 'Non-GAAP 净利', value: '约 85 亿元', trend: 'flat' },
        { label: '活跃用户', value: '8,500 万', trend: 'flat' },
        { label: 'SVIP 会员贡献 GMV', value: '超 50%', trend: 'up' }
      ],
      highlights: [
        'SVIP 会员体系持续扩张，贡献高客单和复购',
        '穿戴类目占比超 70%，与综合电商形成差异化',
        '连续 50 个季度盈利，现金流健康',
        '持续回购股票回报股东'
      ],
      risks: [
        '服装品类零售整体疲软，GMV 增速放缓',
        '直播电商、抖音电商对特卖场景形成分流',
        '用户拉新成本上升，DAU 存在增长瓶颈'
      ]
    },
    ai: {
      strategy:
        '采取"AI 驱动降本增效 + 全员 AI 办公"双线策略：研发侧通过 AI Coding 提效，业务侧通过商品图/营销素材 AIGC 降本，同时要求合规替换海外 AI 工具。',
      investment: '2026 年 AI 相关预算预计超 1.2 亿元，同比增长 60%+',
      scenes: [
        { name: 'AI 编程提效', desc: 'CTO 将 AI Coding 使用率纳入研发 KPI，800+ 研发全员推广 Codebuddy', status: '已落地' },
        { name: '商品图 AI 生成', desc: '主站 50 万+ SKU 素材生成，从 Gemini 替换为混元 Image 3.0', status: '已落地' },
        { name: '智能导购 Agent', desc: '基于 SVIP 用户画像的个性化推荐和智能客服', status: '推进中' },
        { name: '直播数智人', desc: '7×24 小时数智人直播，降低主播成本', status: '推进中' },
        { name: '全员 AI 办公', desc: '非技术团队接入 WorkBuddy', status: '规划中' }
      ],
      cloudVendors: ['阿里云（主）', '腾讯云', '华为云（冷备）'],
      opportunity:
        '已 winback Gemini 至混元大模型全套；下一步推 CodeBuddy license 从 300 扩至 750+；联卖 TokenHub 套餐锁价 + WorkBuddy 全员覆盖；ClawPro 管控企业级 AI 使用。'
    },
    overseas: {
      status: '暂无大规模出海规划，聚焦国内存量市场',
      regions: ['东南亚（观望）', '香港（小规模测试）'],
      strategy: '以跨境品牌正品代运营为主要切入点，暂未大规模自建海外站',
      challenges: [
        '品牌授权和跨境物流成本高',
        '海外特卖模式验证不足',
        'SHEIN、TEMU 已经占据心智'
      ],
      opportunity: '暂无明确出海切入点，可以在跨境物流系统数字化、跨境电商合规等场景储备方案'
    },
    reports: [
      {
        title: '唯品会 2025 年 Q4 及全年财报',
        period: '2025 年报',
        type: '网页',
        url: 'https://ir.vip.com/news-releases',
        publishDate: '2026-03-11'
      },
      {
        title: '唯品会 SEC 20-F 年度报告',
        period: '2024 Form 20-F',
        type: 'PDF',
        url: 'https://ir.vip.com/sec-filings',
        publishDate: '2025-04-30'
      },
      {
        title: '唯品会投资者关系官网',
        period: '实时',
        type: '官网',
        url: 'https://ir.vip.com',
        publishDate: '-'
      }
    ]
  },

  {
    id: 2,
    name: '小红书',
    industry: '社交',
    avatar: '📕',
    stock: '未上市（传 2026 港股 IPO）',
    website: 'https://www.xiaohongshu.com',
    priority: '高',
    contact: 'carrierxiao',
    lastUpdate: '2026-04-18',
    business: {
      overview:
        '小红书是中国最大的生活方式 UGC 社区，2025 年 MAU 突破 3.5 亿，商业化能力快速释放。电商闭环（买手直播 + 笔记种草 + 搜索交易）已成为核心增长引擎，广告 + 电商双轮驱动。',
      keyMetrics: [
        { label: '2025 营收', value: '约 58 亿美元', trend: 'up' },
        { label: '2025 营收增速', value: '+38% YoY', trend: 'up' },
        { label: 'MAU', value: '3.5 亿+', trend: 'up' },
        { label: '日均笔记发布', value: '800 万+', trend: 'up' },
        { label: '2025 估值', value: '约 260 亿美元', trend: 'up' }
      ],
      highlights: [
        '女性用户 + 高消费力城市用户双重优势，广告变现天花板高',
        '买手直播生态异军突起，电商 GMV 破千亿',
        'AI 搜索产品"点点"定位为"小而美"版 Perplexity',
        '传 2026 年冲刺港股 IPO'
      ],
      risks: [
        '内容合规和种草真实性监管压力持续',
        '抖音/视频号在泛种草场景强烈竞争',
        '电商 GMV 规模与淘宝/抖音仍有数量级差距'
      ]
    },
    ai: {
      strategy:
        'AI 搜索定位为战略级产品，内容理解和审核是安全底线。走"AI 增强原有场景 + AI 孵化新产品"路线，对多模态大模型有强诉求。',
      investment: '2026 年 AI 预算估计 15-20 亿元，重点投向搜索和内容安全',
      scenes: [
        { name: '点点 AI 搜索', desc: '基于站内笔记的 RAG 问答产品，战略级重点', status: '已落地' },
        { name: '内容安全审核', desc: '日均 800 万条笔记多模态审核，文本/图片/视频全覆盖', status: '已落地' },
        { name: '智能推荐算法', desc: '大模型增强 CTR 和留存', status: '已落地' },
        { name: '创作者 AI 工具', desc: '笔记写作助手、封面生成、视频剪辑', status: '推进中' },
        { name: '买手 AI 助手', desc: '直播 AI 脚本生成、选品推荐', status: '规划中' }
      ],
      cloudVendors: ['自建 + 多云（AWS 出海、阿里云国内、腾讯云增量）'],
      opportunity:
        '内容安全四件套已合作，下一步扩展 RAG/联网搜索 API 支持点点搜索；混元 Image 3.0 切入创作者工具；TokenHub 统一管理多云 Token 成本；若 IPO 前后扩张出海，可联合腾讯云海外基础设施。'
    },
    overseas: {
      status: '已启动，重点测试美国、东南亚',
      regions: ['美国（TikTok 难民阶段红利）', '东南亚', '日本'],
      strategy:
        '2025 年 1 月 TikTok 风波期间美国下载量暴增，小红书顺势推出英文版 RedNote；东南亚走生活方式社区本地化路线',
      challenges: [
        '英文版内容供给不足，社区氛围难复制',
        '海外内容合规要求差异大',
        '变现模式和国内差异明显'
      ],
      opportunity:
        '腾讯云海外节点（硅谷/新加坡/雅加达）支持出海 CDN 和合规托管；海外内容安全 API（多语种）；混元英文模型支持笔记翻译和推荐；海外 GPU 弹性算力支持出海推理。'
    },
    reports: [
      {
        title: '小红书官网 - 商业大会资料',
        period: '2026 年',
        type: '官网',
        url: 'https://www.xiaohongshu.com',
        publishDate: '-'
      },
      {
        title: '《晚点 LatePost》：小红书 2025 营收 58 亿美元',
        period: '2025 全年',
        type: '网页',
        url: 'https://www.latepost.com',
        publishDate: '2026-01-22'
      },
      {
        title: '虎嗅：小红书冲刺港股 IPO 最新进展',
        period: '2026 Q1',
        type: '网页',
        url: 'https://www.huxiu.com',
        publishDate: '2026-03-15'
      }
    ]
  },

  {
    id: 3,
    name: '酷狗音乐',
    industry: '音视频',
    avatar: '🎧',
    stock: 'HK 01698（母公司腾讯音乐 TME）',
    website: 'https://www.kugou.com',
    priority: '中',
    contact: 'rhianfang',
    lastUpdate: '2026-04-17',
    business: {
      overview:
        '酷狗音乐是腾讯音乐娱乐集团 (TME) 旗下核心音乐 APP，与 QQ 音乐、酷我音乐形成三驾马车。2025 年 TME 在线音乐付费用户持续高增长，ARPPU 稳步上升，已成为全球数字音乐平台盈利模范。',
      keyMetrics: [
        { label: 'TME 2025 营收', value: '约 320 亿元', trend: 'up' },
        { label: '在线音乐 MAU', value: '5.75 亿', trend: 'flat' },
        { label: '付费用户', value: '约 1.22 亿', trend: 'up' },
        { label: 'ARPPU', value: '约 11.5 元', trend: 'up' },
        { label: '全年净利', value: '约 82 亿元', trend: 'up' }
      ],
      highlights: [
        '付费率达 21%，向 Spotify 40%+ 水平追赶',
        '"SVIP+ 超级会员"推动 ARPPU 提升',
        '大麦网收购后演出业务成为新增长点',
        '与腾讯集团 AI 能力协同紧密'
      ],
      risks: [
        '短视频冲击用户时长',
        '版权成本持续上涨',
        '社交娱乐板块（直播）持续下滑'
      ]
    },
    ai: {
      strategy:
        'TME 集团主导 AI 战略，酷狗作为执行平台之一。重点方向：AI 音乐创作、智能推荐、虚拟歌手、歌词翻译。',
      investment: 'TME 集团 2026 年 AI 预算约 5 亿元，酷狗承担主要创新实验',
      scenes: [
        { name: '智能推荐', desc: '基于大模型的歌单/电台推荐，准确率达到 88%+', status: '已落地' },
        { name: 'AI 词曲创作', desc: '面向创作者的 AI 辅助作曲工具', status: '推进中' },
        { name: '虚拟歌手', desc: 'AI 数智人演唱、MV 生成', status: '推进中' },
        { name: '多语言歌词翻译', desc: '日韩/英文歌曲实时翻译', status: '已落地' },
        { name: '语音交互', desc: '车载/智能音箱场景升级', status: '已落地' }
      ],
      cloudVendors: ['腾讯云（主）', '自建'],
      opportunity:
        '作为腾讯系自有客户，ClawPro 管控集团化 AI 使用；混元音频/ASR/TTS 深度集成到词曲创作；腾讯同传支持多语言内容全球化；混元 Image/Video 生成 MV 内容。'
    },
    overseas: {
      status: 'TME 已启动出海，以 Joox（东南亚）和海外版 Kugou 为主要载体',
      regions: ['东南亚（马来西亚、泰国、印尼）', '港澳台', '日韩'],
      strategy:
        '一方面通过 Joox 深耕东南亚；另一方面推动华语音乐版权全球分发，在 Spotify/Apple Music 发行',
      challenges: [
        '海外版权谈判成本高',
        '与 Spotify 竞争正面碰撞',
        '海外盈利模型尚未跑通'
      ],
      opportunity:
        '腾讯云海外（新加坡/雅加达）CDN 音频分发；海外版权合规审核；腾讯同传多语言歌词翻译；混元 TTS 多语种声音合成；出海智能推荐算法托管。'
    },
    reports: [
      {
        title: 'TME 2025 Q4 及全年财报',
        period: '2025 年报',
        type: '网页',
        url: 'https://ir.tencentmusic.com/financials/quarterly-results',
        publishDate: '2026-03-18'
      },
      {
        title: 'TME 港股 2025 年报（01698.HK）',
        period: '2025 年报',
        type: 'PDF',
        url: 'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/',
        publishDate: '2026-04-10'
      },
      {
        title: 'TME 投资者关系',
        period: '实时',
        type: '官网',
        url: 'https://ir.tencentmusic.com',
        publishDate: '-'
      }
    ]
  },

  {
    id: 4,
    name: '拼多多',
    industry: '电商',
    avatar: '🛍️',
    stock: 'NASDAQ: PDD',
    website: 'https://www.pinduoduo.com',
    priority: '高',
    contact: 'jamincheng',
    lastUpdate: '2026-04-18',
    business: {
      overview:
        '拼多多是中国领先的社交电商平台，2025 年营收规模突破万亿。主站依靠百亿补贴持续获取下沉市场用户，Temu（海外版）成为全球跨境电商最大黑马之一，集团整体利润率领先同行。',
      keyMetrics: [
        { label: '2025 营收', value: '约 5,800 亿元', trend: 'up' },
        { label: '营收同比', value: '+55% YoY', trend: 'up' },
        { label: 'Non-GAAP 净利', value: '约 1,400 亿元', trend: 'up' },
        { label: 'Temu GMV', value: '约 700 亿美元', trend: 'up' },
        { label: '市值（近期）', value: '约 1,800 亿美元', trend: 'flat' }
      ],
      highlights: [
        'Temu 全球扩张 70+ 国家，美国、欧洲、日本核心市场',
        '百亿补贴持续巩固低价心智',
        '多多买菜业务盈利',
        '技术侧极端精简，被称为"小而美"的高 ROI 组织'
      ],
      risks: [
        '美国政策风险（小额关税、数据安全）',
        'SHEIN、TikTok Shop 在海外持续压制',
        '国内低价战激烈，GMV 增速面临瓶颈'
      ]
    },
    ai: {
      strategy:
        'AI 投入相对克制、务实导向，聚焦在"能降本 + 能直接提升 GMV"的场景。多模型混合使用、自研+外采并重，对 Token 成本极度敏感。',
      investment: '2026 年 AI 预算估计 20+ 亿元，主要用于推荐、供应链、内容审核',
      scenes: [
        { name: 'AI 推荐算法', desc: '主站和 Temu 的 Feed 流推荐，ROI 可量化', status: '已落地' },
        { name: '供应链 AI 预测', desc: '农产品/日用品销售预测，优化仓储', status: '已落地' },
        { name: '智能客服', desc: '分布式客服系统，多语种支持（含 Temu）', status: '已落地' },
        { name: '商品图/详情页生成', desc: 'AIGC 批量生成商品营销素材', status: '推进中' },
        { name: 'Temu 多语种运营', desc: '多语言商品翻译、广告创意', status: '推进中' }
      ],
      cloudVendors: ['AWS（Temu 主）', '阿里云', '自建', '腾讯云（少量）'],
      opportunity:
        '最大切入点在 Temu 出海：海外内容安全/合规审核、混元多语言能力、海外推理 GPU；国内可推 TokenHub 替换多模型分散采购，强调 ROI 可算；人脸核身支持商家认证合规。'
    },
    overseas: {
      status: '海外已是核心战略，Temu 是主要载体',
      regions: ['北美（美国）', '欧洲（德/法/英）', '日本', '澳新', '南美（巴西/墨西哥）', '东南亚'],
      strategy:
        '全托管模式 + 半托管模式双线并行，2025 年重点转向"本地化 + 半托管"，减轻关税和物流风险。已在主要国家建本地仓',
      challenges: [
        '美国关税政策（小额免税取消）',
        '欧盟数据合规（GDPR）',
        '假货和质量投诉增加',
        '本地化运营成本快速上升'
      ],
      opportunity:
        '腾讯云海外节点（新加坡/硅谷/法兰克福/圣保罗）对冲 AWS 成本；海外多语种 NLP / 翻译 / 内容安全；海外 GPU 弹性算力；跨境合规（数据加密、访问控制）方案。'
    },
    reports: [
      {
        title: '拼多多 2025 Q4 及全年财报',
        period: '2025 年报',
        type: '网页',
        url: 'https://investor.pddholdings.com/financial-information/quarterly-results',
        publishDate: '2026-03-20'
      },
      {
        title: 'PDD Holdings 20-F 年度报告',
        period: '2024 Form 20-F',
        type: 'PDF',
        url: 'https://investor.pddholdings.com/financial-information/sec-filings',
        publishDate: '2025-04-28'
      },
      {
        title: 'PDD Holdings 投资者关系官网',
        period: '实时',
        type: '官网',
        url: 'https://investor.pddholdings.com',
        publishDate: '-'
      }
    ]
  },

  {
    id: 5,
    name: '虎牙直播',
    industry: '音视频',
    avatar: '🎮',
    stock: 'NYSE: HUYA',
    website: 'https://www.huya.com',
    priority: '中',
    contact: 'huawu',
    lastUpdate: '2026-04-17',
    business: {
      overview:
        '虎牙是中国领先的游戏直播平台，腾讯为其第一大股东。2025 年与斗鱼合并预期未能通过反垄断审查，当前聚焦赛事直播、游戏联运和海外业务。整体业绩承压，但赛事商业化和海外 Nimo TV 成为两个亮点。',
      keyMetrics: [
        { label: '2025 营收', value: '约 58 亿元', trend: 'down' },
        { label: '营收同比', value: '-7% YoY', trend: 'down' },
        { label: '移动端 MAU', value: '约 7,800 万', trend: 'down' },
        { label: '付费用户', value: '约 380 万', trend: 'down' },
        { label: '直播收入占比', value: '约 78%', trend: 'down' }
      ],
      highlights: [
        '电竞赛事版权（KPL/LPL 等）是核心壁垒',
        '海外 Nimo TV 在东南亚/拉美持续增长',
        '游戏相关业务（联运+广告）占比提升',
        '公司现金流健康，在回购股票'
      ],
      risks: [
        '短视频分流游戏直播用户时长',
        '直播打赏监管收紧，付费率持续下降',
        '赛事版权成本高企'
      ]
    },
    ai: {
      strategy:
        '腾讯系紧密协同，AI 主要服务于"降本（审核）+ 增效（内容）+ 国际化（Nimo TV 多语种）"三个方向。',
      investment: '2026 年 AI 预算约 1 亿元',
      scenes: [
        { name: '直播内容实时审核', desc: '违规画面/语音/弹幕多模态实时识别', status: '已落地' },
        { name: '游戏解说 AI 助手', desc: '赛事 AI 解说、战报生成', status: '推进中' },
        { name: 'AI 游戏陪玩', desc: 'AI 陪练/陪玩，延伸游戏内付费', status: '规划中' },
        { name: 'Nimo TV 多语言', desc: '海外直播实时翻译字幕', status: '推进中' },
        { name: '数智人主播', desc: '7×24 虚拟直播和赛事播报', status: '规划中' }
      ],
      cloudVendors: ['腾讯云（主）', '自建'],
      opportunity:
        '腾讯系客户 ClawPro 天然契合；内容安全四件套是刚需；Nimo TV 出海场景推腾讯云海外节点 + 腾讯同传 + 多语种 TTS；混元 Video 支持短视频二创；低延迟 WebRTC 方案。'
    },
    overseas: {
      status: '海外已是第二增长曲线，Nimo TV 为主要载体',
      regions: ['东南亚（印尼/泰国/越南）', '拉美（巴西/墨西哥）', '中东'],
      strategy: '聚焦新兴市场游戏直播，与本地游戏厂商/赛事版权方合作，推广本地化主播生态',
      challenges: [
        '海外直播变现能力弱于国内',
        'YouTube Gaming、Facebook Gaming 强势竞争',
        '各地监管和支付渠道复杂'
      ],
      opportunity:
        '腾讯云海外（新加坡/雅加达/圣保罗）直播 CDN；海外内容安全（多语种）；多语种同传字幕；海外 GPU 支持 AI 解说推理；本地化合规咨询。'
    },
    reports: [
      {
        title: '虎牙 2025 Q4 及全年财报',
        period: '2025 年报',
        type: '网页',
        url: 'https://ir.huya.com/financials/quarterly-results',
        publishDate: '2026-03-12'
      },
      {
        title: '虎牙 20-F 年度报告',
        period: '2024 Form 20-F',
        type: 'PDF',
        url: 'https://ir.huya.com/financials/sec-filings',
        publishDate: '2025-04-25'
      },
      {
        title: '虎牙投资者关系官网',
        period: '实时',
        type: '官网',
        url: 'https://ir.huya.com',
        publishDate: '-'
      }
    ]
  },

  {
    id: 6,
    name: '顺丰控股',
    industry: '物流',
    avatar: '📦',
    stock: 'SZ 002352（A 股）/ HK 06936（港股）',
    website: 'https://www.sf-express.com',
    priority: '高',
    contact: 'lincolnliao',
    lastUpdate: '2026-04-19',
    business: {
      overview:
        '顺丰控股（顺丰集团）是中国最大、全球第四大的综合性快递物流运营商，业务覆盖时效快递、经济快递（丰网回收后整合）、快运、冷运及医药、同城急送、供应链及国际、科技服务七大板块。旗下拥有顺丰速运、顺丰快运、顺丰冷链、顺丰同城（HK 09699）、嘉里物流（HK 00636，控股 51.5%）、丰巢（HK 06678，参股）、顺丰科技、顺丰航空（全货机机队 100+ 架，国内最大）以及鄂州花湖国际机场（亚洲首个专业货运枢纽）。2024 年集团完成港股二次上市（06936.HK），2025 年营收突破 3,180 亿元，稳居 A 股物流板块龙头，国际化（嘉里）+ 供应链 + 科技输出是三大增长极。',
      keyMetrics: [
        { label: '2025 集团营收', value: '约 3,180 亿元', trend: 'up' },
        { label: '营收同比', value: '+12% YoY', trend: 'up' },
        { label: '归母净利', value: '约 118 亿元', trend: 'up' },
        { label: '日均件量', value: '约 4,200 万件', trend: 'up' },
        { label: '全球员工数', value: '超 62 万人', trend: 'up' },
        { label: '全货机机队', value: '超 100 架（国内第一）', trend: 'up' },
        { label: '国际业务占比', value: '约 35%', trend: 'up' },
        { label: '科技研发投入', value: '约 42 亿元', trend: 'up' }
      ],
      highlights: [
        '时效件继续保持高端市场领导地位，商务件份额 60%+，ROE 回升',
        '供应链及国际板块（含嘉里物流）2025 年营收 1,100 亿+，同比 +20%，毛利率优于主业',
        '鄂州花湖机场全面投产，航空货运网络辐射 "1.5 小时全国、4 小时亚洲、12 小时全球"',
        '顺丰同城 2024 年首次年度盈利，2025 年利润翻倍，本地即时配送第三方龙头',
        '2024 港股 IPO 募资约 56 亿港元，资产负债率持续优化（<52%）',
        '丰巢回归 + 嘉里物流控股 + 同城分拆，"一体多翼"资本架构成形',
        '顺丰科技对外输出（丰语大模型、丰桥、鲲鹏路由等）商业化加速',
        '股东回报：2024 年度分红 + 回购合计超 40 亿元，港股通纳入带来海外资金'
      ],
      risks: [
        '电商件价格战（极兔 / 中通 / 韵达）长期分流，经济件毛利承压',
        '国际航线燃油、汇率、地缘政治（中美 / 红海 / 俄乌）成本波动',
        '嘉里物流海外业务文化整合、管理半径长',
        '重资产（鄂州机场、大件网络、冷链）折旧压力与投资回收周期',
        '美国关税政策对跨境电商客户（Temu / SHEIN）订单传导',
        '62 万一线员工人力成本与合规（社保、骑手权益）压力持续上行'
      ]
    },
    ai: {
      strategy:
        '顺丰控股 2025 年将 AI 升级为集团级战略，目标是"AI 原生物流运营商"：在揽件、分拣、运输、派送、客服、供应链全链路实现 AI 原生化。集团成立"顺丰大模型中心"（挂靠顺丰科技），自研"丰语"物流垂直大模型，同时外采通用大模型（混元、DeepSeek、Qwen）作为底座；董事长王卫亲自督战，对多模态、Agent、具身智能需求强烈。面向 62 万员工全面推广 AI Copilot（研发 CodeBuddy、白领 WorkBuddy、小哥收派助手、客服智能体）。',
      investment: '2026 年集团 AI 专项预算 8-10 亿元，同比 +70%+，三年累计规划 30 亿元，聚焦大模型 / 智能体 / 具身智能 / 全员 Copilot',
      scenes: [
        { name: '智能客服大模型', desc: '日均 200 万+ 咨询，AI 承接率 >75%，替代外采海外模型', status: '已落地' },
        { name: '鲲鹏路由 + 时效预测', desc: '全国 40 万运力实时路由优化，时效预测准确率 >95%', status: '已落地' },
        { name: '中转场视觉 AI', desc: '2,000+ 中转场包裹识别、体积测量、异常件检测', status: '已落地' },
        { name: '丰语物流大模型', desc: '自研垂直大模型，覆盖运单解析、单证处理、合规问答、司机培训', status: '推进中' },
        { name: '收派员 AI 助手', desc: '40 万小哥配备 AI Agent，支持语音下单、路线推荐、异常处理', status: '推进中' },
        { name: '供应链智能体（B 端）', desc: '面向零售、3C、汽车、医药客户的供应链决策 Agent', status: '推进中' },
        { name: '跨境通关智能体', desc: '国际件 AI 单证生成、HS 编码识别、多国海关规则问答', status: '推进中' },
        { name: '鄂州机场智慧枢纽', desc: '航班调度、机坪协同、货运 AI 大脑', status: '推进中' },
        { name: '无人车 / 无人机调度', desc: '最后一公里无人化，已在深圳、珠海规模试点', status: '规划中' },
        { name: '全员 AI 办公 Copilot', desc: '16 万白领全量推广，覆盖办公、代码、设计、财务、法务', status: '规划中' }
      ],
      cloudVendors: ['腾讯云（战略合作）', '自建（顺丰云 / 鄂州数据中心）', '华为云', '阿里云（部分电商业务）', 'AWS（海外 / 嘉里物流）'],
      opportunity:
        '顺丰控股是腾讯云战略级客户，已有 TKE、TDSQL、CDN、企微、腾讯会议等合作基础。集团层面的核心增量机会：(1) 丰语大模型联合共建，混元作为多模态底座 + TI 平台做物流领域精调；(2) CodeBuddy 覆盖 3,000+ 集团研发 + WorkBuddy 16 万白领全员 AI 办公；(3) ClawPro 统一管控多云 AI Token 成本与合规；(4) 海外节点（新加坡 / 雅加达 / 法兰克福 / 迪拜 / 圣保罗）支持嘉里物流全球化部署；(5) 内容安全 + 人脸核身支持 62 万小哥实名、收派合规；(6) 腾讯同传 + 多语种 ASR/TTS 支持国际件客服；(7) 混元 Vision 支持中转场、鄂州机场视觉升级；(8) EdgeOne 海外加速提升国际版 APP 体验；(9) 企微 + 乐享支持嘉里并购后的跨文化协同；(10) 腾讯位置服务 / 高精地图支持无人车 / 无人机调度。'
    },
    overseas: {
      status: '国际化已是集团核心战略，通过控股嘉里物流覆盖 70+ 国家 / 地区、1,200+ 自营网点，2025 年国际业务（含嘉里 + 国际快递 + 国际货运）收入占比突破 35%',
      regions: [
        '东南亚（泰国 / 越南 / 马来 / 印尼 / 新加坡）- 核心增长区',
        '中东（阿联酋迪拜 / 沙特）- 高增长，鄂州-迪拜 B2B 货运枢纽',
        '欧洲（德国 / 荷兰 / 英国 / 法国）- 嘉里物流传统强项',
        '北美（美国 / 加拿大 / 墨西哥）- 跨境电商 + 半导体供应链',
        '南亚（印度 / 孟加拉）- 嘉里网络辐射',
        '非洲（尼日利亚 / 南非）- 战略储备',
        '日韩 - 电商 + 半导体通道'
      ],
      strategy:
        '"嘉里物流 + 顺丰航空 + 海外仓 + 本地化快递"四位一体：通过嘉里物流切入欧美供应链与货代网络；以鄂州机场 + 100+ 架全货机辐射东南亚、中东、欧洲；在中东、东南亚自建 / 合资本地快递网络（如泰国 Kerry Express、印尼 SF Express）；同步服务跨境电商物流（Temu、SHEIN、TikTok Shop、Shopee 商家），提供端到端（头程空运 + 海外仓 + 本地派送）方案。',
      challenges: [
        '海外本地化快递运营经验不足，与 DHL / FedEx / UPS / Aramex 直接竞争',
        '各国海关、数据合规差异大（GDPR、中东数据本地化、美国 CCPA / ITAR）',
        '嘉里物流与顺丰主业文化整合，管理体系英文化、全球化',
        '美国关税（IEEPA / 301）政策对跨境电商客户订单的冲击传导',
        '国际运力（油价 / 汇率 / 航权 / 红海绕行）成本波动',
        '俄乌、中东地缘冲突对欧亚大通道的影响'
      ],
      opportunity:
        '集团全球化对腾讯云的增量需求非常明确：(1) 腾讯云海外节点（硅谷 / 弗吉尼亚 / 新加坡 / 雅加达 / 曼谷 / 法兰克福 / 迪拜 / 圣保罗 / 东京）支持全球订单 / 调度系统多活部署；(2) 海外合规解决方案（GDPR / PDPA / PCI DSS / 数据本地化）一站式交付；(3) 腾讯同传 + 多语种 TTS/ASR 支持国际客服与跨境通关；(4) 混元海外推理 GPU 支持丰语大模型国际化（多语种）；(5) 海外内容安全（多语种）支持跨境电商客户合规；(6) EdgeOne 海外加速支持国际版 APP 与商家端；(7) TDSQL 分布式数据库 / TDSQL-H 支持全球订单与运单一致性；(8) 腾讯乐享 / TAPD / 企微国际版支持嘉里融合后的跨境协同；(9) 腾讯云 AI 翻译 + 大模型赋能国际单证自动化；(10) COS 海外 + CDN Global 支持全球影像（运单 / 签收照）存储与加速。'
    },
    reports: [
      {
        title: '顺丰控股 2025 年度报告（A 股 002352）',
        period: '2025 年报',
        type: 'PDF',
        url: 'http://www.cninfo.com.cn/new/disclosure/stock?stockCode=002352',
        publishDate: '2026-03-28'
      },
      {
        title: '顺丰控股 2025 年业绩公告（港股 06936.HK）',
        period: '2025 年报',
        type: 'PDF',
        url: 'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/',
        publishDate: '2026-03-28'
      },
      {
        title: '顺丰控股 2026 Q1 季报',
        period: '2026 Q1',
        type: '网页',
        url: 'http://www.cninfo.com.cn/new/disclosure/stock?stockCode=002352',
        publishDate: '2026-04-25'
      },
      {
        title: '顺丰投资者关系官网',
        period: '实时',
        type: '官网',
        url: 'https://www.sf-express.com/chn/sc/about/investor/',
        publishDate: '-'
      },
      {
        title: '嘉里物流 2025 年报（HK 00636）',
        period: '2025 年报',
        type: 'PDF',
        url: 'https://www.kerrylogistics.com/tc/ir/announcements-circulars',
        publishDate: '2026-03-20'
      },
      {
        title: '顺丰同城 2025 年报（HK 09699）',
        period: '2025 年报',
        type: 'PDF',
        url: 'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/',
        publishDate: '2026-03-25'
      },
      {
        title: '顺丰控股 ESG 可持续发展报告 2025',
        period: '2025 ESG',
        type: 'PDF',
        url: 'https://www.sf-express.com/chn/sc/about/investor/',
        publishDate: '2026-04-10'
      }
    ]
  },

  {
    id: 7,
    name: '腾讯音乐娱乐集团（TME）',
    industry: '音视频',
    avatar: '🎵',
    stock: 'NYSE: TME / HKEX: 1698',
    website: 'https://www.tencentmusic.com',
    priority: '高',
    contact: 'rhianfang',
    lastUpdate: '2026-04-20',
    business: {
      overview:
        '腾讯音乐娱乐集团（TME）是中国最大、全球领先的在线音乐与音频娱乐平台，旗下运营 QQ 音乐、酷狗音乐、酷我音乐、全民 K 歌、懒人听书、Ultimate Music 等核心 APP，并通过 JOOX 布局海外。2025 年 TME 完成从"社交娱乐驱动"向"在线音乐订阅 + 内容生态"转型，全年总收入 329 亿元（+15.8% YoY），调整后净利润 99.2 亿元（+22% YoY），均创上市以来新高。在线音乐订阅成为第一增长引擎，SVIP 超级会员 2025 年突破 1,500 万、付费率逼近 23%。2024 年完成对喜马拉雅的战略投资后，长音频与有声内容形成差异化护城河；同时通过大麦演出（战略合作）、TMELAND 虚拟演唱会、"探乐"音乐出海计划拓展增量空间。',
      keyMetrics: [
        { label: '2025 集团总营收', value: '329.0 亿元', trend: 'up' },
        { label: '营收同比', value: '+15.8% YoY', trend: 'up' },
        { label: '2025 调整后净利', value: '99.2 亿元（+22%）', trend: 'up' },
        { label: '在线音乐服务收入', value: '267.3 亿元（+22.9%）', trend: 'up' },
        { label: '在线音乐 MAU', value: '5.70 亿+', trend: 'flat' },
        { label: '在线音乐付费用户', value: '约 1.23 亿', trend: 'up' },
        { label: 'SVIP 超级会员', value: '1,500 万+', trend: 'up' },
        { label: '在线音乐付费率', value: '约 22.9%', trend: 'up' },
        { label: 'ARPPU（月）', value: '约 11.9 元', trend: 'up' }
      ],
      highlights: [
        '2025 年营收与利润创历史新高，股价年内涨幅领跑中概互联网',
        'SVIP 超级会员成为增长引擎：付费用户数 + ARPPU 双升，付费率向 Spotify 40%+ 追赶',
        '在线音乐服务收入占比突破 80%，彻底摆脱对社交娱乐（直播打赏）依赖',
        '长音频战略落地：2024 年战略入股喜马拉雅 + 懒人听书 + 自制有声剧（《盗墓笔记》等）打造差异化',
        '演出业务：与大麦深度合作 + TMELAND 虚拟演唱会双线布局，IP 授权与票务协同',
        '"探乐"音乐出海计划入选中国品牌海外传播案例，华语音乐全球分发加速',
        'AI 布局清晰：琴乐大模型（AI Lab + TME 天琴实验室联合研发）+ TME Studio AI 创作平台 + 智能推荐全面升级',
        '现金流健康：2025 年派发现金股息 + 回购合计超 50 亿港元'
      ],
      risks: [
        '版权成本持续上涨，与环球、华纳、索尼三大唱片的续约议价压力',
        '短视频（抖音 / 视频号 / B 站音乐）在年轻用户时长和音乐推荐场景持续分流',
        '社交娱乐板块（直播打赏）受监管和用户习惯影响长期承压，收入占比已降至 18%',
        'Spotify 国际化加速（2025 年进入更多亚洲市场）、网易云音乐差异化竞争',
        'AI 音乐生成（Suno、Udio）冲击传统词曲创作生态与版权格局',
        '海外市场（JOOX）变现能力弱、与 Spotify / Apple Music / YouTube Music 正面竞争'
      ]
    },
    ai: {
      strategy:
        'TME 将 AI 明确为"音乐娱乐下一代核心能力"：以"琴乐大模型（生成）+ 天琴实验室（音频技术）+ TME Studio（创作工具）+ 智能推荐（分发）"四位一体，打通"AI 创作 → AI 分发 → AI 交互 → AI 商业化"全链路。战略重点：(1) 用 AI 降低创作门槛、扩大长尾曲库供给；(2) 用 AI 提升推荐与搜索体验，拉高付费转化与时长；(3) 用 AI 探索新交互形态（音乐 Agent、虚拟歌手、AI 电台），为 SVIP 增值；(4) 与腾讯集团 AI 能力（混元、腾讯云 TI、CodeBuddy）深度协同。',
      investment: '2026 年 TME 集团 AI 专项预算约 6-8 亿元，同比 +50%+，重点投向琴乐大模型升级、TME Studio 商业化、Agent 化交互、海外多语种音乐 AI',
      scenes: [
        { name: '琴乐大模型', desc: 'AI Lab + 天琴实验室联合研发，支持中英文关键词/描述/音频直接生成立体声音乐，已对外开放创作', status: '已落地' },
        { name: 'TME Studio AI 创作平台', desc: '集成音乐分离、MIR 计算、辅助写词、智能曲谱、银河音效、MUSE 视频创作，服务站内音乐人', status: '已落地' },
        { name: '智能推荐与搜索', desc: '基于大模型的歌单/电台/搜索推荐，驱动 SVIP 转化与时长提升', status: '已落地' },
        { name: 'AI 歌词翻译与字幕', desc: '日韩/英文/西语歌曲实时翻译，提升国际内容消费体验', status: '已落地' },
        { name: '长音频 AI 有声剧制作', desc: '结合 TTS + 情感合成，与南派三叔等 IP 合作批量生产有声剧', status: '已落地' },
        { name: '数智人歌手与虚拟演唱会', desc: 'TMELAND 虚拟演唱会 + AI 数智人演唱 / MV 生成', status: '推进中' },
        { name: 'AI 音乐 Agent（陪伴交互）', desc: '面向 SVIP 的 AI 电台主持人、音乐陪伴 Agent、个性化点评', status: '推进中' },
        { name: '音乐版权 AI 风控', desc: 'AI 曲风识别、翻唱比对、版权合规审核', status: '推进中' },
        { name: '车载/智能硬件语音交互', desc: '与比亚迪、理想、华为 HiCar、小米生态合作，AI 语音点歌与推荐', status: '已落地' },
        { name: '全员 AI 办公 Copilot', desc: '研发侧接入 CodeBuddy，白领接入 WorkBuddy / 腾讯元宝企业版', status: '规划中' }
      ],
      cloudVendors: ['腾讯云（主，兄弟事业群）', '自建（TME 私有云）', '少量 AWS（海外 JOOX）'],
      opportunity:
        'TME 是腾讯系战略级客户，云合作基础深厚，2026 年关键增量机会：(1) 混元音频大模型 / ASR / TTS 深度集成到琴乐大模型与 TME Studio，做多模态音乐创作底座；(2) CodeBuddy 覆盖 TME 3,000+ 研发全员，WorkBuddy 覆盖非技术岗；(3) ClawPro 统一管控集团级 AI Token 成本与合规，替代分散采购；(4) 腾讯云 GPU 弹性算力支持琴乐大模型训练 / 推理扩容；(5) 海外节点（新加坡 / 雅加达 / 硅谷 / 法兰克福）支持 JOOX 与"探乐"出海加速；(6) 腾讯同传 + 多语种 TTS 支持华语音乐全球分发与字幕；(7) 混元 Image 3.0 + 混元 Video 支持 MV / 封面 / 虚拟演唱会视觉生成；(8) 内容安全 API 支持 UGC 歌词/评论/弹幕/直播合规审核；(9) 腾讯乐享 / TAPD / 企微支持与喜马拉雅、大麦的跨组织协作；(10) EdgeOne 加速海外版 APP 与流媒体体验。'
    },
    overseas: {
      status: '出海已是集团长期战略，2025 年通过"JOOX + 探乐 + 华语音乐全球分发"三条线并行推进，国际业务营收占比约 6-8%，增速高于集团整体',
      regions: [
        '东南亚（香港 / 泰国 / 马来西亚 / 印尼 / 新加坡 / 越南）- JOOX 核心市场',
        '日韩 - 华语音乐反向输出 + K-pop / J-pop 版权合作',
        '北美（美国 / 加拿大）- 华语音乐文化出海 + Ultimate Music 厂牌',
        '欧洲（英国 / 德国 / 法国）- 版权分发与音乐节合作',
        '中东 / 拉美 - 战略储备（探乐计划拓展）',
        '港澳台 - 华语音乐核心市场'
      ],
      strategy:
        '"JOOX（本地化流媒体）+ 探乐（华语音乐出海）+ Ultimate Music（海外厂牌 / 签约）+ 全球版权分发（Spotify / Apple Music / YouTube Music / Amazon Music）"四位一体。2025 年 TME 主办首届"中国音乐影响力峰会"，为华语音乐出海搭建国际化平台；同时"探乐计划"入选中国品牌海外传播案例。JOOX 聚焦东南亚本地化运营（本地艺人签约 + 本地版权 + 本地支付），华语音乐则通过 Spotify 等全球平台触达海外华人与本地受众。',
      challenges: [
        'JOOX 变现能力弱，海外用户付费习惯与 Spotify / Apple Music 差距大',
        '海外版权采购成本高，三大唱片议价能力强',
        'Spotify、Apple Music、YouTube Music 在东南亚加速扩张，正面竞争',
        'K-pop / J-pop / 东南亚本地艺人本土化内容供给不足',
        '各地数据合规差异大（GDPR / PDPA / 印尼本地化存储）',
        'AI 音乐生成（Suno、Udio）在海外爆火，冲击传统音乐分发模式'
      ],
      opportunity:
        '出海对腾讯云的增量需求明确：(1) 腾讯云海外节点（新加坡 / 雅加达 / 曼谷 / 硅谷 / 法兰克福）支持 JOOX 与全球分发系统多活部署；(2) 海外 CDN + EdgeOne 加速流媒体音频体验；(3) 腾讯同传 + 多语种 TTS/ASR 支持华语音乐歌词翻译、字幕与国际版客服；(4) 海外内容安全（多语种文本 / 音频 / 图像审核）支持 UGC 合规；(5) 混元海外推理 GPU 支持琴乐大模型国际化（多语种音乐生成）；(6) TDSQL 分布式数据库支持全球订单与版权数据一致性；(7) 海外合规解决方案（GDPR / PDPA / 数据本地化）一站式交付；(8) COS 海外 + CDN Global 支持全球音频 / MV / 封面资源分发；(9) 腾讯位置服务 + 智能推荐支持本地化运营；(10) 腾讯云 IM + 音视频 SDK 支持海外虚拟演唱会 / TMELAND 出海。'
    },
    reports: [
      {
        title: 'TME 2025 年第四季度及全年未经审计财务业绩',
        period: '2025 年报',
        type: '网页',
        url: 'https://ir.tencentmusic.com/2026-03-17-Tencent-Music-Entertainment-Group-Announces-Fourth-Quarter-and-Full-Year-2025-Unaudited-Financial-Results',
        publishDate: '2026-03-17'
      },
      {
        title: 'TME 港股 2025 年报（01698.HK）',
        period: '2025 年报',
        type: 'PDF',
        url: 'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/',
        publishDate: '2026-04-10'
      },
      {
        title: 'TME 投资者关系官网（财务报告中心）',
        period: '实时',
        type: '官网',
        url: 'https://ir-sc.tencentmusic.com/Financial-Results',
        publishDate: '-'
      },
      {
        title: 'TME 2025 Q3 业绩公告（付费率首破 22%）',
        period: '2025 Q3',
        type: '网页',
        url: 'https://ir.tencentmusic.com/financials/quarterly-results',
        publishDate: '2025-11-12'
      },
      {
        title: 'TME 2025 Q2 业绩公告（SVIP 突破 1,500 万）',
        period: '2025 Q2',
        type: '网页',
        url: 'https://ir.tencentmusic.com/financials/quarterly-results',
        publishDate: '2025-08-12'
      },
      {
        title: 'TME 20-F 年度报告（SEC）',
        period: '2024 Form 20-F',
        type: 'PDF',
        url: 'https://ir.tencentmusic.com/financial-information/sec-filings',
        publishDate: '2025-04-25'
      },
      {
        title: 'TME ESG 可持续发展报告 2025',
        period: '2025 ESG',
        type: 'PDF',
        url: 'https://ir.tencentmusic.com',
        publishDate: '2026-04-15'
      }
    ]
  }
]

// 优先级配置
export const priorityConfig = {
  高: { label: '高优先级', color: '#ef4444', bg: '#fef2f2' },
  中: { label: '中优先级', color: '#f59e0b', bg: '#fff7ed' },
  低: { label: '低优先级', color: '#22c55e', bg: '#dcfce7' }
}
