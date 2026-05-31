// 供应链情报数据
// 数据参考：权威媒体 + 各芯片厂商/云厂商官方公告
// 更新周期：每周更新
// 最后更新：2026-05-31
// 数据范围：2026-05-10 ~ 2026-05-31（最新窗口）+ 2026-04月份历史数据

// =============== 成本趋势数据 ===============
export interface CostTrendItem {
  id: string
  name: string
  icon: string
  category: string
  pastYearChange: string // 过去一年涨幅
  futurePredict: string // 未来6个月预测
  predictTrend: 'up' | 'down' | 'stable'
  localizationProgress: string // 国产替代进展
  keyFactor: string // 关键驱动因素
  confidence: 'high' | 'medium' | 'low'
}

export const costTrendData: CostTrendItem[] = [
  {
    id: 'ai-chip',
    name: 'AI芯片（进口）',
    icon: '🔲',
    category: '芯片',
    pastYearChange: '+40%',
    futurePredict: '+10%~15%',
    predictTrend: 'up',
    localizationProgress: '昇腾950PR月产能8万卡 / 思元590百度5万卡 / 含光800P阿里10万卡',
    keyFactor: 'B30A特供6月交付；国产替代规模上量',
    confidence: 'high'
  },
  {
    id: 'server-cpu',
    name: '服务器CPU',
    icon: '🖥️',
    category: '芯片',
    pastYearChange: '+15%~20%',
    futurePredict: '+5%~10%',
    predictTrend: 'up',
    localizationProgress: '海光C86-7信创认证落地，金融/政务订单饱满',
    keyFactor: 'AMD Turin-D双路5月集中出货，整机BOM上行',
    confidence: 'medium'
  },
  {
    id: 'hbm',
    name: 'HBM高带宽内存',
    icon: '💾',
    category: '存储',
    pastYearChange: '+60%',
    futurePredict: '+25%~35%',
    predictTrend: 'up',
    localizationProgress: '长鑫HBM3E 16层完成验证，2026 Q4量产',
    keyFactor: 'SK海力士锁定2027年80% HBM4产能，议价空间归零',
    confidence: 'high'
  },
  {
    id: 'dram',
    name: '服务器DRAM',
    icon: '🧮',
    category: '存储',
    pastYearChange: '+58%~466%',
    futurePredict: '+15%~25%',
    predictTrend: 'up',
    localizationProgress: '长鑫DDR5产能持续提升，但HBM优先级挤压',
    keyFactor: '5月DDR5现货环比+12%，96GB RDIMM突破1980美元',
    confidence: 'high'
  },
  {
    id: 'nand-ssd',
    name: 'NAND/企业SSD',
    icon: '💿',
    category: '存储',
    pastYearChange: '+15%~419%',
    futurePredict: '+10%~15%',
    predictTrend: 'up',
    localizationProgress: '长江存储X3-9070 256层QLC发布，6月规模出货',
    keyFactor: '5月7.68TB NVMe环比+15%突破3900美元',
    confidence: 'high'
  },
  {
    id: 'cowos',
    name: 'CoWoS先进封装',
    icon: '📐',
    category: '封装',
    pastYearChange: '+75%',
    futurePredict: '+15%~25%',
    predictTrend: 'up',
    localizationProgress: '长电科技2.5D获华为认证',
    keyFactor: '产能扩张<需求增速',
    confidence: 'high'
  },
  {
    id: 'abf',
    name: 'ABF载板',
    icon: '🔌',
    category: '载板',
    pastYearChange: '+55%',
    futurePredict: '+10%~20%',
    predictTrend: 'up',
    localizationProgress: '深南电路ABF量产突破',
    keyFactor: '国产化率仅15%，供需失衡',
    confidence: 'high'
  },
  {
    id: 'optical-module',
    name: '800G光模块',
    icon: '🌐',
    category: '网络',
    pastYearChange: '+50%',
    futurePredict: '稳定',
    predictTrend: 'stable',
    localizationProgress: '中际旭创全球出货第一',
    keyFactor: '国产替代加速抵消涨价',
    confidence: 'medium'
  },
  {
    id: 'liquid-cooling',
    name: '液冷系统',
    icon: '❄️',
    category: '基础设施',
    pastYearChange: '+70%',
    futurePredict: '+15%~25%',
    predictTrend: 'up',
    localizationProgress: '国产化率>90%',
    keyFactor: 'PUE政策+单机柜80kW+',
    confidence: 'high'
  },
  {
    id: 'server-power',
    name: 'AI服务器电源',
    icon: '⚡',
    category: '基础设施',
    pastYearChange: '+45%',
    futurePredict: '+10%~15%',
    predictTrend: 'up',
    localizationProgress: '长城电源获华为认证',
    keyFactor: '高功率需求持续',
    confidence: 'medium'
  }
]

// =============== 产业链节点定义 ===============
export interface SupplyChainNode {
  id: string
  name: string
  icon: string
  layer: number // 1-6 产业链位置
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  localizationRate: number // 国产化率 0-100
  description: string
  keyPlayers: string[]
  pastYearChange: string // 过去一年涨幅
  futurePredict: string // 未来6个月预测
  predictTrend: 'up' | 'down' | 'stable'
  keyFactor: string // 影响因素
}

export const supplyChainNodes: SupplyChainNode[] = [
  {
    id: 'design',
    name: '设计IP/EDA',
    icon: '🎯',
    layer: 1,
    riskLevel: 'critical',
    localizationRate: 12,
    description: 'EDA工具、IP核、芯片设计软件',
    keyPlayers: ['Synopsys', 'Cadence', 'Siemens EDA', '华大九天', '芯华章'],
    pastYearChange: '高风险',
    futurePredict: '上行风险',
    predictTrend: 'up',
    keyFactor: '5月Synopsys/Cadence对华许可继续收紧；华大九天14nm全流程通过验证，但先进制程仍空白'
  },
  {
    id: 'manufacturing',
    name: '晶圆制造',
    icon: '🏭',
    layer: 2,
    riskLevel: 'critical',
    localizationRate: 16,
    description: '先进制程晶圆代工、光刻机、刻蚀设备',
    keyPlayers: ['台积电', '三星', '中芯国际', '华虹半导体', 'ASML'],
    pastYearChange: '供给偏紧',
    futurePredict: '持续紧张',
    predictTrend: 'up',
    keyFactor: '台积电CoWoS-L 5月再扩产但2026全年仍100%预订；中芯国际N+2量产爬坡至月产能2.5万片'
  },
  {
    id: 'chip',
    name: 'AI芯片',
    icon: '🔲',
    layer: 3,
    riskLevel: 'critical',
    localizationRate: 35,
    description: 'GPU、NPU、TPU、AI训练/推理芯片',
    keyPlayers: ['英伟达', 'AMD', '华为昇腾', '寒武纪', '海光信息'],
    pastYearChange: '+40%',
    futurePredict: '+10%~15%',
    predictTrend: 'up',
    keyFactor: '昇腾950PR月产能突破8万卡、含光800P/思元590规模上量；B30A中国特供版6月交付，国产替代节奏加快'
  },
  {
    id: 'cpu',
    name: '服务器CPU',
    icon: '🖥️',
    layer: 3,
    riskLevel: 'high',
    localizationRate: 28,
    description: 'Intel/AMD服务器CPU、国产x86/ARM信创CPU',
    keyPlayers: ['Intel', 'AMD', '海光', '鲲鹏', '飞腾', '兆芯'],
    pastYearChange: '+15%~20%',
    futurePredict: '+5%~10%',
    predictTrend: 'up',
    keyFactor: 'AMD Turin-D双路服务器5月集中出货，整机BOM上行；海光C86-7信创认证后金融/政务订单饱满'
  },
  {
    id: 'storage',
    name: '存储与内存',
    icon: '💾',
    layer: 4,
    riskLevel: 'critical',
    localizationRate: 42,
    description: 'HBM、NAND、DRAM、企业级SSD',
    keyPlayers: ['SK海力士', '三星', '美光', '长江存储', '长鑫存储'],
    pastYearChange: '+8%~466%',
    futurePredict: '+10%~25%',
    predictTrend: 'up',
    keyFactor: 'SK海力士锁定2027年80% HBM4产能；DDR5月环比+12%、NVMe SSD月环比+15%；长鑫HBM3E 16层Q4量产'
  },
  {
    id: 'network',
    name: '网络设备',
    icon: '🌐',
    layer: 5,
    riskLevel: 'medium',
    localizationRate: 85,
    description: '光模块、交换机、DPU、路由器',
    keyPlayers: ['华为', '中兴', '新华三', '锐捷网络', '中际旭创'],
    pastYearChange: '+20%~50%',
    futurePredict: '趋稳',
    predictTrend: 'stable',
    keyFactor: '1.6T光模块进入量产元年（旭创+新易盛5月出货52万只）；华为/锐捷1.6T交换机量产，国产替代抵消涨价'
  },
  {
    id: 'infra',
    name: '基础设施',
    icon: '🏢',
    layer: 6,
    riskLevel: 'medium',
    localizationRate: 92,
    description: '数据中心、液冷系统、电力设施',
    keyPlayers: ['世纪互联', '万国数据', '秦淮数据', '腾讯云', '阿里云'],
    pastYearChange: '+40%~70%',
    futurePredict: '+10%~20%',
    predictTrend: 'up',
    keyFactor: '京沪深PUE收紧至1.25强制液冷；Q2液冷渗透率突破40%；腾讯云贵安二期PUE 1.06刷新行业新低'
  }
]

// =============== 行业总评 ===============
export interface IndustrySummary {
  updateDate: string
  summary: string
  highlights: {
    icon: string
    title: string
    content: string
    trend: 'up' | 'down' | 'stable'
  }[]
}

export const industrySummary: IndustrySummary = {
  updateDate: '2026-05-31',
  summary: '2026年5月10-31日，全球AI算力供应链进入"国产生态闭环验证期"。火山引擎/阿里云/百度智能云三大厂商相继宣布昇腾/平头哥/昆仑芯主力AI集群规模化上线；DeepSeek V4 Pro 永久降价 75%叠加昇腾950PR性价比 3.2 倍优势，推动国产算力议价能力实质性提升。HBM3E/HBM4 价格本月再涨 8-12%，SK海力士锁定 2027 年 80% HBM4 产能；NAND/DDR5 受 AI 服务器单机容量翻倍驱动 5月环比上涨 10-15%；全国 PUE<1.25 强化政策密集发布，单机柜 100kW+ 液冷成为新建 AI 集群标配。',
  highlights: [
    {
      icon: '🇨🇳',
      title: '国产算力规模上量',
      content: '火山/阿里/百度三家昇腾&自研主力集群累计上量超 50 万卡',
      trend: 'up'
    },
    {
      icon: '💰',
      title: 'HBM 再涨 8-12%',
      content: 'SK海力士锁定 2027 年 80% HBM4 产能，国内云厂商议价空间收窄',
      trend: 'up'
    },
    {
      icon: '📦',
      title: 'DDR5/NAND 持续上行',
      content: '5月 DDR5 现货价环比 +12%，企业级 SSD +15%，AI 服务器整机 BOM 上行',
      trend: 'up'
    },
    {
      icon: '❄️',
      title: 'PUE 收紧至 1.25',
      content: '京沪深三地新建 AI 集群 PUE 标准升级至 <1.25，液冷渗透率 Q2 突破 40%',
      trend: 'up'
    }
  ]
}

// =============== 芯片前线动态 ===============
export interface ChipNews {
  id: number
  title: string
  summary: string
  date: string
  vendor: string
  chipType: 'GPU' | 'NPU' | 'CPU' | 'TPU' | '综合'
  impact: 'positive' | 'negative' | 'neutral'
  tags: string[]
  source: string
  sourceUrl?: string
  importance: '重磅' | '重要' | '一般'
}

export const chipNews: ChipNews[] = [
  // ======= 5月中下旬最新动态（5.10-5.31） =======
  {
    id: 101,
    title: '华为昇腾 950PR 量产爬坡：月产能突破 8 万卡，DeepSeek V4 适配版 5月底全面交付',
    summary: '5月28日华为披露昇腾950PR月产能已突破8万卡，较4月翻倍。配合DeepSeek V4 Pro永久降价75%，火山引擎/百度智能云/阿里云已陆续完成昇腾950PR + DeepSeek V4 的混合部署。官方数据：在DeepSeek V4 Pro推理负载下，昇腾950PR综合TCO仅为H20的31%。',
    date: '2026-05-28',
    vendor: '华为昇腾',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['昇腾950PR', '量产爬坡', 'DeepSeek V4', 'TCO优势'],
    source: '华为官方 / 财联社',
    sourceUrl: 'https://www.huawei.com/cn/news',
    importance: '重磅'
  },
  {
    id: 102,
    title: '英伟达 B30A 中国特供版获批，性能为 B200 的 60%、H20 的 1.8 倍',
    summary: '5月22日多家媒体证实英伟达"B30A"中国特供版已通过美国出口审批，FP8算力约2.0 PFLOPS，相当于B200的60%、H20的1.8倍。预计6月底首批小规模交付，单卡售价约2.5万美元。国内云厂商内部测算：B30A综合TCO仍较昇腾950PR高约18%，但对存量CUDA生态用户具备过渡价值。',
    date: '2026-05-22',
    vendor: '英伟达',
    chipType: 'GPU',
    impact: 'neutral',
    tags: ['B30A', '中国特供', '出口管制', 'CUDA生态'],
    source: 'The Information / 路透社',
    sourceUrl: 'https://www.theinformation.com',
    importance: '重磅'
  },
  {
    id: 103,
    title: '阿里平头哥含光 800P 量产：自研推理芯片首次大规模上量',
    summary: '5月20日阿里云峰会上，平头哥宣布含光800P推理芯片正式量产，单卡INT8算力达512 TOPS，是上代3.2倍。阿里云首批部署10万卡用于通义千问/Qwen3.7-Max推理。官方称在Qwen3.7场景下，含光800P单Token推理成本较H20降低62%。',
    date: '2026-05-20',
    vendor: '平头哥',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['含光800P', '阿里自研', '推理芯片', 'Qwen3.7'],
    source: '阿里云峰会 / 36氪',
    sourceUrl: 'https://www.aliyun.com',
    importance: '重磅'
  },
  {
    id: 104,
    title: '寒武纪思元 590 拿下百度智能云 5 万卡订单，国产推理芯片首个超大单',
    summary: '5月25日寒武纪披露与百度智能云达成5万卡思元590采购协议，金额约18亿元，分批交付至2026年Q4。这是国产AI推理芯片单笔订单规模新高。百度计划将思元590规模部署至文心一言/文心X3的推理集群。',
    date: '2026-05-25',
    vendor: '寒武纪',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['思元590', '百度智能云', '5万卡订单', '国产推理'],
    source: '寒武纪公告 / 上证报',
    sourceUrl: 'https://www.cambricon.com',
    importance: '重磅'
  },
  {
    id: 105,
    title: 'AMD MI400 路线图曝光：2027 年 Q1 量产，HBM4 容量飙至 432GB',
    summary: '5月18日 ServeTheHome 披露 AMD 下一代旗舰 MI400 路线图：采用台积电 2nm 制程，集成 432GB HBM4（较 MI350X 增 50%），FP8 算力 5.5 PFLOPS，预计 2027 年 Q1 量产。AMD 计划凭借 HBM 容量和 ROCm 生态优势继续蚕食英伟达市场。',
    date: '2026-05-18',
    vendor: 'AMD',
    chipType: 'GPU',
    impact: 'positive',
    tags: ['MI400', 'HBM4', '2nm', '路线图'],
    source: 'ServeTheHome / AnandTech',
    sourceUrl: 'https://www.servethehome.com',
    importance: '重要'
  },
  {
    id: 106,
    title: '海光 DCU Z100 发布：自主指令集 AI 加速器，FP16 算力达 320 TFLOPS',
    summary: '5月15日海光信息发布 DCU Z100 AI加速卡，采用自主指令集架构，FP16算力320 TFLOPS，搭载96GB HBM3。Z100 全栈支持 PyTorch/PaddlePaddle，已通过国家信创认证。首批客户为政务云、金融云。',
    date: '2026-05-15',
    vendor: '海光信息',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['DCU Z100', '自主指令集', '海光', '信创'],
    source: '海光信息 / 证券时报',
    sourceUrl: 'https://www.hygon.cn',
    importance: '重要'
  },
  {
    id: 107,
    title: '百度昆仑芯 P800 二期投片，2026 全年产能锁定 30 万卡',
    summary: '5月12日百度智能云宣布昆仑芯 P800 二期已在中芯国际投片，2026 全年产能锁定 30 万卡，同比增长 200%。P800 主要服务百度智能云千帆平台和文心一言推理集群，目前内部部署比例已超 60%。',
    date: '2026-05-12',
    vendor: '昆仑芯',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['昆仑芯P800', '中芯国际', '产能扩张', '百度'],
    source: '百度智能云 / C114',
    sourceUrl: 'https://cloud.baidu.com',
    importance: '重要'
  },
  // ======= 4月-5月初历史动态 =======
  {
    id: 1,
    title: 'DeepSeek V4 全面适配华为昇腾 950PR，国产算力生态迎来里程碑',
    summary: '4月20日，DeepSeek宣布V4系列模型已完成对华为昇腾950PR芯片与Atlas 350加速卡的深度适配。官方数据显示：Atlas 350单卡FP16算力约为英伟达H20的2.87倍，在DeepSeek V4推理场景下，昇腾方案综合性价比达到H20的3.2倍。这标志着国产AI芯片首次在主流开源大模型上实现"性能+生态"双突破。',
    date: '2026-04-20',
    vendor: '华为昇腾',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['昇腾950PR', 'DeepSeek V4', '国产替代', 'Atlas 350'],
    source: 'The Information / 新浪财经',
    sourceUrl: 'https://finance.sina.com.cn/roll/2026-04-20/doc-inhvayqm8639905.shtml',
    importance: '重磅'
  },
  {
    id: 2,
    title: '英伟达 H20 综合成本上升 40%：15% 抽成税叠加供应紧张',
    summary: '4月中旬起，受美国政府对中国AI芯片出口新增15%"抽成税"影响，英伟达H20芯片在中国市场的综合采购成本（含关税、服务费、合规成本）较年初上升约40%。SemiAnalysis数据显示，H100一年期租赁合同价从1.70美元/小时涨至2.35美元/小时。多家云厂商反馈已开始将H20算力预算向华为昇腾、寒武纪MLU倾斜。',
    date: '2026-04-15',
    vendor: '英伟达',
    chipType: 'GPU',
    impact: 'negative',
    tags: ['H20', '抽成税', '成本上升', '供应链风险'],
    source: 'SemiAnalysis / 财联社',
    sourceUrl: 'https://www.cls.cn/detail/1617830',
    importance: '重磅'
  },
  {
    id: 3,
    title: '英伟达 Blackwell B200 中国区发货延迟至 Q4，部分订单转至 H200',
    summary: '4月初消息，受出口管制审查流程延长影响，英伟达Blackwell B200芯片在中国区的首批发货时间从原定2026年Q2推迟至Q4。部分急需算力的客户被建议转向H200或等待国内替代方案。AWS、谷歌云等海外云商的B200预定量则持续攀升，供需矛盾加剧。',
    date: '2026-04-05',
    vendor: '英伟达',
    chipType: 'GPU',
    impact: 'negative',
    tags: ['B200', '发货延迟', '出口管制', 'H200'],
    source: 'The Information / 路透社',
    sourceUrl: 'https://www.theinformation.com',
    importance: '重要'
  },
  {
    id: 4,
    title: 'AMD MI350X 发布：HBM3E 容量翻倍，剑指英伟达推理市场',
    summary: '4月22日AMD发布MI350X加速卡，搭载288GB HBM3E内存（较MI300X翻倍），FP8推理性能达2.4 PFLOPS。AMD宣称在Llama 3.1 70B推理场景下，MI350X性价比超H100约35%。首批客户包括微软Azure、Meta，国内客户需等待合规审批。',
    date: '2026-04-22',
    vendor: 'AMD',
    chipType: 'GPU',
    impact: 'positive',
    tags: ['MI350X', 'HBM3E', '推理芯片', 'ROCm'],
    source: 'AMD官方 / AnandTech',
    sourceUrl: 'https://www.amd.com/en/products/accelerators/instinct/mi300/mi350x.html',
    importance: '重要'
  },
  {
    id: 5,
    title: '谷歌 TPU v8（8t/8i）正式发布：首次拆分训练与推理专用芯片',
    summary: '4月25日谷歌Cloud Next大会发布第八代TPU，首次拆分为TPU 8t（训练专用）和TPU 8i（推理专用）两款芯片。TPU 8t训练性能较v5p提升3.2倍，TPU 8i推理延迟降低60%、能效比提升2.5倍。谷歌云Vertex AI同步开放TPU 8系列云实例预订。',
    date: '2026-04-25',
    vendor: '谷歌',
    chipType: 'TPU',
    impact: 'positive',
    tags: ['TPU 8', '训练推理分离', 'Vertex AI', '谷歌云'],
    source: 'Google Cloud / TechCrunch',
    sourceUrl: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/next-2026/',
    importance: '重磅'
  },
  {
    id: 6,
    title: '寒武纪思元 590 发布：7nm 制程，瞄准 H20 替代市场',
    summary: '5月6日寒武纪发布思元590加速卡，采用7nm制程，FP16算力达512 TFLOPS，搭载96GB HBM2E。官方定位为"H20平替方案"，售价约为H20的60%。首批客户包括百度云、京东云，腾讯云/阿里云正在测试中。',
    date: '2026-05-06',
    vendor: '寒武纪',
    chipType: 'NPU',
    impact: 'positive',
    tags: ['思元590', 'H20替代', '国产芯片', '7nm'],
    source: '寒武纪官方 / 36氪',
    sourceUrl: 'https://www.cambricon.com/index.php?m=content&c=index&a=lists&catid=57',
    importance: '重要'
  },
  {
    id: 7,
    title: '海光信息深算二号量产：x86 架构 AI 推理芯片填补国产空白',
    summary: '4月底海光信息宣布深算二号AI推理芯片正式量产，基于x86架构，原生支持PyTorch/TensorFlow，无需额外适配。深算二号在ResNet-50推理场景下性能达A100的85%，功耗仅为75%，主打金融、政务等对x86生态依赖强的场景。',
    date: '2026-04-28',
    vendor: '海光信息',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['深算二号', 'x86', '国产替代', 'AI推理'],
    source: '海光信息 / 证券时报',
    sourceUrl: 'https://www.hygon.cn',
    importance: '重要'
  },
  {
    id: 8,
    title: 'AWS Trainium 3 芯片发布：性价比追赶 H200，锁定 Anthropic 千亿算力',
    summary: '4月11日AWS发布Trainium 3 AI训练芯片，训练性能较Trainium 2提升4倍，在大模型训练场景性价比接近英伟达H200。配合此前向Anthropic追加250亿美元投资，Anthropic承诺未来十年在AWS Trainium上投入超1,000亿美元算力采购。',
    date: '2026-04-11',
    vendor: 'AWS',
    chipType: '综合',
    impact: 'positive',
    tags: ['Trainium 3', 'Anthropic', '自研芯片', 'AWS'],
    source: 'AWS Blog / CNBC',
    sourceUrl: 'https://aws.amazon.com/machine-learning/trainium',
    importance: '重磅'
  },
  {
    id: 9,
    title: 'Intel Xeon 第 6 代 Granite Rapids 发布：单路性能提升 40%',
    summary: '4月8日Intel发布Xeon第6代Granite Rapids处理器，最高128核心，集成AMX加速器，AI推理能力增强3倍。采用Intel 3制程，单路性能较上代提升40%。但在数据中心市场，Intel面临AMD EPYC的持续压力，市占率下滑至62%。',
    date: '2026-04-08',
    vendor: 'Intel',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['Xeon 6', 'Granite Rapids', 'AMX', 'AI推理'],
    source: 'Intel官方 / AnandTech',
    sourceUrl: 'https://www.intel.com/content/www/us/en/products/processors/xeon.html',
    importance: '重要'
  },
  {
    id: 10,
    title: 'AMD EPYC 9005 系列（Turin）发布：192 核领跑数据中心市场',
    summary: '3月25日AMD发布EPYC 9005系列（代号Turin），采用TSMC 5nm制程，最高192核心384线程，多线程性能领先Intel Xeon 6约30%。单路服务器可替代双路配置，整机成本降低20%。AMD在数据中心CPU市场份额提升至28%。',
    date: '2026-03-25',
    vendor: 'AMD',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['EPYC 9005', 'Turin', '192核', '数据中心'],
    source: 'AMD官方 / ServeTheHome',
    sourceUrl: 'https://www.amd.com/en/processors/epyc',
    importance: '重磅'
  },
  {
    id: 11,
    title: '海光 C86-7 系列通过国家信创认证：性能达 Intel 同代 90%',
    summary: '4月18日海光信息宣布C86-7系列服务器CPU通过国家信创认证，兼容银河麒麟、统信UOS等国产操作系统。性能达到Intel同代产品90%，价格仅为60-70%。首批客户为政务云和金融机构，预计2026年出货超50万颗。',
    date: '2026-04-18',
    vendor: '海光信息',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['海光C86-7', '信创认证', '国产替代', 'x86'],
    source: '海光信息 / 证券时报',
    sourceUrl: 'https://www.hygon.cn',
    importance: '重磅'
  },
  {
    id: 12,
    title: '华为鲲鹏 920S 发布：ARM 服务器 CPU 主频提升至 3.2GHz',
    summary: '4月25日华为发布鲲鹏920S处理器，采用7nm+制程，64核心，主频从2.6GHz提升至3.2GHz，单核性能提升25%。配合openEuler操作系统，生态应用超5000款，主打电信、金融等对ARM兼容性要求高的场景。',
    date: '2026-04-25',
    vendor: '华为',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['鲲鹏920S', 'ARM', 'openEuler', '国产'],
    source: '华为官方 / C114',
    sourceUrl: 'https://www.huawei.com/cn/news',
    importance: '重要'
  },
  {
    id: 13,
    title: '飞腾腾云 S5000C 量产：国产 ARM 服务器 CPU 产能突破',
    summary: '3月15日飞腾宣布腾云S5000C正式量产，月产能突破10万颗。采用ARM架构，64核心，主频2.5GHz，主打信创服务器市场。与中电科、浪潮等服务器厂商合作，预计2026年出货超100万颗。',
    date: '2026-03-15',
    vendor: '飞腾',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['腾云S5000C', 'ARM', '信创', '量产'],
    source: '飞腾官方 / 电子工程专辑',
    sourceUrl: 'https://www.phytium.com.cn',
    importance: '重要'
  },
  {
    id: 14,
    title: '兆芯开胜 KX-7000 发布：国产 x86 兼容 CPU 性能对标 Intel 第 4 代',
    summary: '5月2日兆芯发布开胜KX-7000服务器处理器，采用16nm制程，最高32核心，主频3.0GHz，性能对标Intel Xeon第4代Sapphire Rapids约70%。支持DDR5内存，主打政务、教育、企业办公等信创替代场景。',
    date: '2026-05-02',
    vendor: '兆芯',
    chipType: 'CPU',
    impact: 'positive',
    tags: ['KX-7000', 'x86', '信创', '兆芯'],
    source: '兆芯官方 / 芯智讯',
    sourceUrl: 'https://www.zhaoxin.com',
    importance: '一般'
  }
]

// =============== 存储与内存动态 ===============
export interface StorageNews {
  id: number
  title: string
  summary: string
  date: string
  vendor: string
  category: 'HBM' | 'NAND' | 'DRAM' | 'SSD'
  priceTrend: 'up' | 'down' | 'stable'
  tags: string[]
  source: string
  sourceUrl?: string
  importance: '重磅' | '重要' | '一般'
}

export const storageNews: StorageNews[] = [
  // ======= 5月中下旬最新动态（5.10-5.31） =======
  {
    id: 101,
    title: 'SK 海力士锁定 2027 年 80% HBM4 产能，HBM 单点风险升级',
    summary: '5月29日 韩国经济日报报道，SK 海力士已与英伟达、AMD、博通三家签署 2027 年 HBM4 长协，锁定其 2027 年 80% 产能。叠加美光产能全部预订，三星 HBM3E 良率仍在 75% 徘徊，HBM 市场进一步集中。国内云厂商 HBM4 长协议价空间持续收窄。',
    date: '2026-05-29',
    vendor: 'SK海力士',
    category: 'HBM',
    priceTrend: 'up',
    tags: ['HBM4', 'SK海力士', '长协锁产能', '供应集中'],
    source: '韩国经济日报 / DigiTimes',
    sourceUrl: 'https://www.digitimes.com',
    importance: '重磅'
  },
  {
    id: 102,
    title: 'DDR5 现货价 5月环比上涨 12%，96GB RDIMM 突破 1980 美元',
    summary: '5月底 DRAMeXchange 数据显示，96GB DDR5 RDIMM 现货均价从月初 1768 美元涨至 1980 美元，环比 +12%，较 2025 年同期 +466%。主要驱动：(1) 三大原厂将 HBM 产能优先级前置，DDR5 产能受挤压；(2) AI 服务器单机内存容量从 1TB 升至 2.3TB；(3) AMD Turin-D 双路服务器在 5月集中出货拉动需求。',
    date: '2026-05-30',
    vendor: '综合',
    category: 'DRAM',
    priceTrend: 'up',
    tags: ['DDR5', '现货上涨', 'RDIMM', 'AI服务器'],
    source: 'DRAMeXchange / TrendForce',
    sourceUrl: 'https://www.trendforce.com',
    importance: '重磅'
  },
  {
    id: 103,
    title: '7.68TB 企业级 NVMe SSD 5月再涨 15%，单盘突破 3900 美元',
    summary: '5月29日 TrendForce 月报：7.68TB 企业级 NVMe SSD（PCIe 5.0）现货均价从 5月初 3380 美元涨至 3903 美元，环比 +15%，较 2025 年初 +419%。AI 训练集群对高密度 NVMe 的旺盛需求，叠加 232 层 NAND 产能爬坡放缓，是核心推手。',
    date: '2026-05-29',
    vendor: '综合',
    category: 'SSD',
    priceTrend: 'up',
    tags: ['NVMe SSD', '企业级', '7.68TB', '环比上涨15%'],
    source: 'TrendForce / 集邦咨询',
    sourceUrl: 'https://www.trendforce.com',
    importance: '重磅'
  },
  {
    id: 104,
    title: '长鑫 HBM3E 16 层堆叠完成验证，2026 Q4 正式量产',
    summary: '5月23日长鑫存储宣布 HBM3E 16 层堆叠产品完成内部良率验证（70%+），计划 2026 Q4 正式量产。单颗容量 36GB，带宽 1.2TB/s。首批客户为华为昇腾950PR/海光DCU Z100。这是国产 HBM 首次接近三大原厂主流量产规格。',
    date: '2026-05-23',
    vendor: '长鑫存储',
    category: 'HBM',
    priceTrend: 'stable',
    tags: ['HBM3E', '16层堆叠', '长鑫', 'Q4量产'],
    source: '长鑫存储 / 集微网',
    sourceUrl: 'https://www.jemitech.com',
    importance: '重磅'
  },
  {
    id: 105,
    title: '长江存储 X3-9070 发布：第五代 3D NAND，QLC 容量直冲 256 层',
    summary: '5月20日长江存储发布 X3-9070 第五代 3D NAND 产品，TLC 232 层 / QLC 256 层，单颗容量最高 2Tb，写入耐久度提升 40%。配套企业级 SSD 产品已通过腾讯云、阿里云内部认证，预计 6 月起规模出货。',
    date: '2026-05-20',
    vendor: '长江存储',
    category: 'NAND',
    priceTrend: 'stable',
    tags: ['X3-9070', '256层QLC', '长江存储', '企业级SSD'],
    source: '长江存储 / 芯智讯',
    sourceUrl: 'https://www.ymtc.com',
    importance: '重要'
  },
  {
    id: 106,
    title: '三星电子重整 HBM 团队，承诺 2026 Q3 良率冲到 85%',
    summary: '5月14日三星电子宣布 HBM 业务部门重组，由原 NAND 业务负责人金载俊接管 HBM 部门，目标在 2026 Q3 将 HBM3E 良率从 75% 提升至 85%，重新切入英伟达主流采购。三星同步加大 HBM4 研发投入，希望 2027 年与 SK 海力士并跑。',
    date: '2026-05-14',
    vendor: '三星',
    category: 'HBM',
    priceTrend: 'stable',
    tags: ['三星HBM', '业务重组', '良率追赶', 'HBM3E'],
    source: '韩国先驱报 / 路透社',
    sourceUrl: 'https://www.reuters.com/technology',
    importance: '重要'
  },
  // ======= 4月-5月初历史动态 =======
  {
    id: 1,
    title: 'SK 海力士锁定英伟达 70% HBM4 订单，三星市占率跌破 20%',
    summary: '4月中旬消息，SK海力士与英伟达签署HBM4独家供应协议，锁定Blackwell系列约70%的HBM4需求。三星因HBM3E良率问题（约65% vs SK海力士85%）被英伟达降低配额至20%以下。HBM市场呈现"SK海力士一家独大"格局，对国内云厂商HBM采购议价能力形成压力。',
    date: '2026-04-16',
    vendor: 'SK海力士',
    category: 'HBM',
    priceTrend: 'up',
    tags: ['HBM4', 'SK海力士', '英伟达', '供应集中'],
    source: 'DigiTimes / 韩国经济日报',
    sourceUrl: 'https://www.digitimes.com',
    importance: '重磅'
  },
  {
    id: 2,
    title: '长鑫存储量产 12 层 HBM3，国产高带宽内存首次突破 10 层堆叠',
    summary: '5月5日长鑫存储宣布12层堆叠HBM3正式量产，单颗容量24GB，带宽达819 GB/s，是国产HBM首次突破10层堆叠技术壁垒。首批客户为华为昇腾和寒武纪，预计2026年下半年产能达10万颗/月。这标志着国产HBM从"能做"到"能用"的关键跨越。',
    date: '2026-05-05',
    vendor: '长鑫存储',
    category: 'HBM',
    priceTrend: 'stable',
    tags: ['HBM3', '长鑫存储', '12层堆叠', '国产突破'],
    source: '长鑫存储 / 集微网',
    sourceUrl: 'https://www.jemitech.com',
    importance: '重磅'
  },
  {
    id: 3,
    title: '三星 HBM3E 良率提升至 75%，重新争夺英伟达订单',
    summary: '4月底三星电子宣布HBM3E良率从65%提升至75%，并向英伟达提交新一批样品认证。若通过认证，三星有望在2026年Q3重新获得英伟达部分HBM3E订单。但市场分析认为，SK海力士的先发优势和HBM4锁定协议使三星短期内难以逆转颓势。',
    date: '2026-04-28',
    vendor: '三星',
    category: 'HBM',
    priceTrend: 'stable',
    tags: ['HBM3E', '三星', '良率提升', '英伟达认证'],
    source: '韩国先驱报 / 路透社',
    sourceUrl: 'https://www.reuters.com/technology',
    importance: '重要'
  },
  {
    id: 4,
    title: 'NAND Flash 价格 Q2 上涨 8-12%，AI 服务器需求推高企业级 SSD',
    summary: '4月TrendForce报告显示，NAND Flash合约价Q2环比上涨8-12%，其中企业级SSD涨幅达15%。主要驱动因素：(1) AI服务器单机SSD容量从4TB提升至16TB；(2) 长江存储产能爬坡慢于预期；(3) 三星/SK海力士主动控制产出。预计Q3价格将继续上行。',
    date: '2026-04-10',
    vendor: '综合',
    category: 'NAND',
    priceTrend: 'up',
    tags: ['NAND', '涨价', '企业级SSD', 'AI服务器'],
    source: 'TrendForce / 集邦咨询',
    sourceUrl: 'https://www.trendforce.com',
    importance: '重要'
  },
  {
    id: 5,
    title: '美光 HBM3E 通过英伟达认证，2026 年产能全被预订',
    summary: '4月8日美光宣布其HBM3E产品已通过英伟达Blackwell平台认证，2026年全年产能已被英伟达、AMD等客户全部预订。美光HBM3E采用1β nm节点，能效比竞品提升30%。这使HBM市场形成"SK海力士+美光"双寡头格局。',
    date: '2026-04-08',
    vendor: '美光',
    category: 'HBM',
    priceTrend: 'up',
    tags: ['HBM3E', '美光', '英伟达认证', '产能紧张'],
    source: 'Micron官方 / AnandTech',
    sourceUrl: 'https://www.micron.com/products/memory/hbm',
    importance: '重要'
  },
  {
    id: 6,
    title: '长江存储 232 层 NAND 量产突破，企业级 SSD 出货翻倍',
    summary: '5月初长江存储宣布232层3D NAND Flash月产能突破15万片晶圆，企业级SSD出货量较2025年翻倍。232层产品在AI服务器、数据中心场景逐步替代海外产品，国内云厂商采购占比从30%提升至45%。',
    date: '2026-05-02',
    vendor: '长江存储',
    category: 'NAND',
    priceTrend: 'stable',
    tags: ['232层', '长江存储', '企业级SSD', '国产替代'],
    source: '长江存储 / 芯智讯',
    sourceUrl: 'https://www.ymtc.com',
    importance: '重要'
  }
]

// =============== 网络设备动态 ===============
export interface NetworkNews {
  id: number
  title: string
  summary: string
  date: string
  vendor: string
  category: '光模块' | '交换机' | 'DPU' | '路由器'
  localizationRate: number
  tags: string[]
  source: string
  sourceUrl?: string
  importance: '重磅' | '重要' | '一般'
}

export const networkNews: NetworkNews[] = [
  // ======= 5月中下旬最新动态（5.10-5.31） =======
  {
    id: 101,
    title: '1.6T 光模块进入量产元年：中际旭创/新易盛 5月出货突破 50 万只',
    summary: '5月底光模块行业月报显示，中际旭创、新易盛 5月 1.6T 光模块合计出货约 52 万只，同比增长 320%。主要客户为字节跳动、阿里云、腾讯云万卡级 AI 训练集群。1.6T 光模块单价约为 800G 的 2.3 倍，但传输容量翻倍，单 bit 成本下降 15%。',
    date: '2026-05-30',
    vendor: '中际旭创',
    category: '光模块',
    localizationRate: 65,
    tags: ['1.6T光模块', '量产元年', '中际旭创', '新易盛'],
    source: 'C114 / 通信世界',
    sourceUrl: 'https://www.c114.com.cn',
    importance: '重磅'
  },
  {
    id: 102,
    title: '华为发布 CloudEngine XH9000 系列：单端口 1.6T，专为万卡 AI 集群设计',
    summary: '5月22日华为发布 CloudEngine XH9000 系列数据中心交换机，单端口支持 1.6T，单机交换容量 256T，专为万卡及以上 AI 训练集群设计。配套自研 RoCEv2 + AI Flow 调度算法，号称在 H800/昇腾 950PR 万卡集群上实现端到端零丢包、99.5% 吞吐效率。',
    date: '2026-05-22',
    vendor: '华为',
    category: '交换机',
    localizationRate: 95,
    tags: ['CloudEngine XH9000', '1.6T', '万卡集群', 'AI Flow'],
    source: '华为官方 / 通信世界',
    sourceUrl: 'https://e.huawei.com/cn/products/enterprise-networking',
    importance: '重磅'
  },
  {
    id: 103,
    title: '英伟达 Spectrum-X 800G 以太网获中国合规版本，国内云厂商首批拿货',
    summary: '5月18日英伟达确认 Spectrum-X 800G 以太网交换机推出中国合规版本，并已向腾讯云、阿里云、百度智能云首批交付。Spectrum-X 主打 RoCE 优化，专为万卡级 GPU 集群网络设计，相比 InfiniBand 部署成本降低约 35%。',
    date: '2026-05-18',
    vendor: '英伟达',
    category: '交换机',
    localizationRate: 0,
    tags: ['Spectrum-X', '800G以太网', '中国合规', 'RoCE'],
    source: 'NVIDIA / The Next Platform',
    sourceUrl: 'https://www.nvidia.com/en-us/networking',
    importance: '重要'
  },
  {
    id: 104,
    title: '中兴神盾 DPU 量产爬坡，5月出货 5 万颗、首入腾讯云',
    summary: '5月15日中兴通讯披露神盾 DPU 5月出货突破 5 万颗，环比 +200%。除中国移动、中国电信外，腾讯云已小批量采购 1 万颗用于黑石物理服务器网络卸载场景。神盾 DPU 综合性能对标英伟达 BlueField-3，售价仅为 60%。',
    date: '2026-05-15',
    vendor: '中兴通讯',
    category: 'DPU',
    localizationRate: 100,
    tags: ['神盾DPU', '腾讯云', '量产爬坡', '中兴'],
    source: '中兴通讯 / C114',
    sourceUrl: 'https://www.zte.com.cn',
    importance: '重要'
  },
  {
    id: 105,
    title: '锐捷网络发布 RG-S8500 AI 系列，国产首款 1.6T 数据中心交换机',
    summary: '5月12日锐捷网络发布 RG-S8500 AI 系列数据中心交换机，单端口最高 1.6T，全自主芯片设计。该系列已通过字节跳动、京东云内部 PoC 测试，成为继华为之后国内第二家具备 1.6T 端口数据中心交换机量产能力的厂商。',
    date: '2026-05-12',
    vendor: '锐捷网络',
    category: '交换机',
    localizationRate: 100,
    tags: ['RG-S8500', '1.6T', '锐捷', '国产交换机'],
    source: '锐捷网络 / 通信世界',
    sourceUrl: 'https://www.ruijie.com.cn',
    importance: '重要'
  },
  // ======= 4月-5月初历史动态 =======
  {
    id: 1,
    title: '中际旭创 800G 光模块出货量全球第一，国产份额突破 60%',
    summary: '4月底中际旭创披露，其800G光模块2026年Q1出货量超300万只，连续三个季度位居全球第一。在国内AI数据中心市场，中际旭创+新易盛+光迅科技合计份额突破60%，800G/1.6T光模块已实现完全国产替代。',
    date: '2026-04-25',
    vendor: '中际旭创',
    category: '光模块',
    localizationRate: 60,
    tags: ['800G光模块', '中际旭创', '国产替代', '出货第一'],
    source: '中际旭创财报 / C114',
    sourceUrl: 'https://www.c114.com.cn',
    importance: '重磅'
  },
  {
    id: 2,
    title: '华为发布 CloudEngine 16800-X 系列交换机，单机 AI 算力提升 5 倍',
    summary: '4月18日华为发布CloudEngine 16800-X系列数据中心交换机，内置AI芯片实现智能流量调度，单机AI推理能力较上代提升5倍。该系列支持800G端口、零丢包无损网络，已在腾讯云、阿里云AI集群中规模部署。',
    date: '2026-04-18',
    vendor: '华为',
    category: '交换机',
    localizationRate: 95,
    tags: ['CloudEngine', '华为', '数据中心交换机', 'AI调度'],
    source: '华为官方 / 通信世界',
    sourceUrl: 'https://e.huawei.com/cn/products/enterprise-networking/switches/data-center-switches',
    importance: '重要'
  },
  {
    id: 3,
    title: '英伟达 ConnectX-8 网卡发布，400Gb/s 以太网 + 内置 DPU',
    summary: '4月12日英伟达发布ConnectX-8智能网卡，支持400Gb/s以太网和InfiniBand双模，内置DPU实现RDMA、存储、安全三合一卸载。该产品主要面向海外AI数据中心，国内因出口管制暂无明确发货计划。',
    date: '2026-04-12',
    vendor: '英伟达',
    category: 'DPU',
    localizationRate: 0,
    tags: ['ConnectX-8', 'DPU', '400G网卡', '英伟达'],
    source: 'NVIDIA官方 / The Next Platform',
    sourceUrl: 'https://www.nvidia.com/en-us/networking',
    importance: '重要'
  },
  {
    id: 4,
    title: '中兴通讯 DPU 芯片"神盾"量产，填补国产 DPU 空白',
    summary: '5月6日中兴通讯宣布自研DPU芯片"神盾"正式量产，支持200Gb/s网络、NVMe-oF存储卸载、IPsec硬件加速。神盾DPU首批客户为中国移动、中国电信，预计2026年下半年向云厂商开放采购。国产DPU从"空白"到"可用"。',
    date: '2026-05-06',
    vendor: '中兴通讯',
    category: 'DPU',
    localizationRate: 100,
    tags: ['神盾DPU', '中兴', '国产DPU', '量产'],
    source: '中兴通讯 / C114',
    sourceUrl: 'https://www.zte.com.cn',
    importance: '重磅'
  },
  {
    id: 5,
    title: '新华三发布 AI 数据中心网络解决方案，端到端零丢包',
    summary: '4月22日新华三发布"AI数据中心网络4.0"解决方案，实现从服务器到存储的端到端零丢包、微秒级时延。该方案已在字节跳动、京东AI集群部署，支撑万卡规模训练任务。新华三在国内AI网络市场份额约25%。',
    date: '2026-04-22',
    vendor: '新华三',
    category: '交换机',
    localizationRate: 100,
    tags: ['新华三', 'AI网络', '零丢包', '数据中心'],
    source: '新华三 / IT168',
    sourceUrl: 'https://www.h3c.com',
    importance: '重要'
  }
]

// =============== 基础设施动态 ===============
export interface InfraNews {
  id: number
  title: string
  summary: string
  date: string
  category: '液冷' | 'PUE政策' | '数据中心' | '电力'
  region: string
  tags: string[]
  source: string
  sourceUrl?: string
  importance: '重磅' | '重要' | '一般'
}

export const infraNews: InfraNews[] = [
  // ======= 5月中下旬最新动态（5.10-5.31） =======
  {
    id: 101,
    title: '京沪深三地 PUE 标准升级至 1.25，新建 AI 集群强制采用液冷',
    summary: '5月27日北京、上海、深圳三地相继发布 AI 数据中心 PUE 强化指引：新建 AI 集群（单机柜 ≥50kW）PUE 须 < 1.25，且必须采用冷板式或浸没式液冷。京沪深合计占全国新建 AI 数据中心规划容量的 45%。该新规将进一步加速液冷渗透。',
    date: '2026-05-27',
    category: 'PUE政策',
    region: '京沪深',
    tags: ['PUE 1.25', '京沪深', '强制液冷', 'AI集群'],
    source: '北京/上海/深圳发改委 / 21世纪经济报道',
    sourceUrl: 'https://www.miit.gov.cn',
    importance: '重磅'
  },
  {
    id: 102,
    title: '腾讯云贵安二期投产：单机柜 120kW 浸没式液冷，PUE 降至 1.06',
    summary: '5月25日腾讯云宣布贵州贵安数据中心二期正式投产，新增 AI 算力 15 EFLOPS（FP16），全栈采用浸没式液冷，单机柜功率密度 120kW，PUE 低至 1.06，是国内已投产 AI 数据中心 PUE 新低。贵安二期主要承载混元大模型 + 元宝训练。',
    date: '2026-05-25',
    category: '数据中心',
    region: '贵州贵安',
    tags: ['腾讯云', '贵安二期', '浸没液冷', 'PUE 1.06'],
    source: '腾讯云官方 / 21财经',
    sourceUrl: 'https://cloud.tencent.com',
    importance: '重磅'
  },
  {
    id: 103,
    title: 'IDC 数据：2026 Q2 中国 AI 数据中心液冷渗透率突破 40%',
    summary: '5月20日 IDC 发布 Q2 中国数据中心市场快报：AI 数据中心液冷渗透率从 Q1 的 28% 跃升至 40%+，较年初规划提前一个季度突破，主要因 PUE 政策落地与单机柜功率突破 80kW。曙光、维谛、英维克、中科曙光订单同比增长 200%+。',
    date: '2026-05-20',
    category: '液冷',
    region: '全国',
    tags: ['IDC报告', '液冷渗透率', '40%', 'Q2快报'],
    source: 'IDC / 中国信通院',
    sourceUrl: 'https://www.idc.com',
    importance: '重磅'
  },
  {
    id: 104,
    title: '阿里云内蒙古乌兰察布三期获批，规划算力 30 EFLOPS',
    summary: '5月18日内蒙古发改委批复阿里云乌兰察布数据中心三期项目，总投资 280 亿元，规划算力 30 EFLOPS（FP16），全栈液冷，PUE < 1.15。预计 2027 年 Q2 投产，主要承载 Qwen3.7 / 千问云训练负载。',
    date: '2026-05-18',
    category: '数据中心',
    region: '内蒙古乌兰察布',
    tags: ['阿里云', '乌兰察布', '三期', '30 EFLOPS'],
    source: '内蒙古发改委 / 36氪',
    sourceUrl: 'https://www.aliyun.com',
    importance: '重要'
  },
  {
    id: 105,
    title: '维谛技术 Liebert XDU 1500 发布：单机柜支持 200kW，剑指 GB300/B30A',
    summary: '5月14日维谛技术发布 Liebert XDU 1500 冷板式液冷分配单元，单 CDU 可支持 30 个 200kW 机柜，专为英伟达 GB300、B30A 及华为昇腾 950PR 万卡集群设计。已被腾讯云、字节跳动列入 2026 H2 标准采购目录。',
    date: '2026-05-14',
    category: '液冷',
    region: '全国',
    tags: ['维谛', 'XDU 1500', '200kW', '冷板液冷'],
    source: '维谛技术 / C114',
    sourceUrl: 'https://www.vertiv.com',
    importance: '重要'
  },
  {
    id: 106,
    title: '工信部启动"东数西算 2.0"专项，西部新增 50 EFLOPS AI 算力',
    summary: '5月12日工信部联合发改委启动"东数西算 2.0"专项，规划在内蒙古、宁夏、甘肃、贵州四大西部枢纽新增 50 EFLOPS AI 算力，配套 100 亿绿电指标。专项强调"算电协同 + 全液冷 + PUE < 1.2"三大硬指标。',
    date: '2026-05-12',
    category: 'PUE政策',
    region: '西部枢纽',
    tags: ['东数西算 2.0', '50 EFLOPS', '工信部', '算电协同'],
    source: '工信部 / 中国能源报',
    sourceUrl: 'https://www.miit.gov.cn',
    importance: '重磅'
  },
  // ======= 4月-5月初历史动态 =======
  {
    id: 1,
    title: '全国 34 省 PUE 政策全面落地，新建数据中心 PUE 须 < 1.3',
    summary: '截至4月底，全国31省市区+3个直辖市已全部出台数据中心PUE强制标准：新建数据中心PUE须低于1.3，存量数据中心须在2027年前完成改造。北京、上海、深圳进一步要求新建AI数据中心PUE<1.2。政策倒逼液冷技术大规模应用。',
    date: '2026-04-30',
    category: 'PUE政策',
    region: '全国',
    tags: ['PUE政策', '强制标准', '数据中心', '节能'],
    source: '工信部 / 各省发改委',
    sourceUrl: 'https://www.miit.gov.cn',
    importance: '重磅'
  },
  {
    id: 2,
    title: '液冷数据中心渗透率预计 2026 年突破 35%，较 2025 年翻倍',
    summary: 'IDC预测，2026年中国AI数据中心液冷渗透率将从2025年的18%跃升至35%以上。驱动因素：(1) PUE政策强制要求；(2) 单机柜功率从20kW提升至80kW+；(3) 英伟达B200/华为昇腾950PR均需液冷散热。曙光、中科曙光、维谛技术等液冷厂商订单激增。',
    date: '2026-04-20',
    category: '液冷',
    region: '全国',
    tags: ['液冷', '渗透率', 'AI数据中心', 'PUE'],
    source: 'IDC / 中国信通院',
    sourceUrl: 'https://www.idc.com',
    importance: '重磅'
  },
  {
    id: 3,
    title: '腾讯云清远智算中心二期投产，液冷集群规模亚洲第一',
    summary: '4月15日腾讯云宣布清远智算中心二期正式投产，新增AI算力10 EFLOPS（FP16），采用全液冷架构，PUE低至1.08。整体规模跃升为亚洲最大单体液冷AI集群。清远智算中心主要承载腾讯混元大模型训练及ToB客户AI工作负载。',
    date: '2026-04-15',
    category: '数据中心',
    region: '广东清远',
    tags: ['腾讯云', '清远智算', '液冷', '亚洲第一'],
    source: '腾讯云官方 / 21财经',
    sourceUrl: 'https://cloud.tencent.com',
    importance: '重磅'
  },
  {
    id: 4,
    title: '阿里云张北数据中心启动风光互补，绿电占比提升至 80%',
    summary: '4月22日阿里云宣布张北数据中心风光互补项目正式并网，绿电占比从50%提升至80%。张北数据中心已成为国内首个"近零碳"大规模AI训练基地，预计每年减少碳排放15万吨。',
    date: '2026-04-22',
    category: '电力',
    region: '河北张北',
    tags: ['阿里云', '张北', '绿电', '风光互补'],
    source: '阿里云 / 中国能源报',
    sourceUrl: 'https://www.aliyun.com',
    importance: '重要'
  },
  {
    id: 5,
    title: '华为发布 FusionCol 5.0 液冷解决方案，能效比提升 40%',
    summary: '5月8日华为发布FusionCol 5.0数据中心液冷解决方案，采用新一代微通道冷板+双循环架构，能效比较4.0版本提升40%，支持单机柜150kW散热。已在华为云乌兰察布数据中心规模部署。',
    date: '2026-05-08',
    category: '液冷',
    region: '内蒙古乌兰察布',
    tags: ['华为', 'FusionCol', '液冷', '能效提升'],
    source: '华为官方 / C114',
    sourceUrl: 'https://e.huawei.com/cn/solutions/data-center',
    importance: '重要'
  },
  {
    id: 6,
    title: '字节跳动上海AI数据中心获批，投资超 200 亿元',
    summary: '4月初上海市发改委批复字节跳动上海AI数据中心项目，总投资超200亿元，规划算力500 PFLOPS（FP16），采用全液冷架构。项目预计2027年Q2投产，主要承载字节豆包、Seedance等AI产品算力需求。',
    date: '2026-04-05',
    category: '数据中心',
    region: '上海',
    tags: ['字节跳动', '上海', 'AI数据中心', '200亿投资'],
    source: '上海发改委 / 36氪',
    sourceUrl: 'https://www.36kr.com',
    importance: '重要'
  }
]

// =============== 供应链风险预警 ===============
export interface SupplyChainAlert {
  id: number
  title: string
  summary: string
  date: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  riskType: '出口管制' | '供应短缺' | '价格波动' | '技术封锁' | '地缘政治'
  affectedLayer: string[]
  impactOnCloud: string
  recommendation: string
  tags: string[]
  source: string
}

export const supplyChainAlerts: SupplyChainAlert[] = [
  // ======= 5月中下旬最新风险（5.10-5.31） =======
  {
    id: 101,
    title: 'HBM4 长协锁产能：SK 海力士 2027 年 80% 产能已被锁，国产替代窗口收窄',
    summary: '5月29日报道，SK 海力士与英伟达、AMD、博通签署的 2027 年 HBM4 长协已覆盖 80% 产能。叠加美光产能 100% 预订、三星 HBM3E 良率仍未稳定在 80% 以上，HBM4 现货市场可流通量预计仅有 5-8%。国内云厂商 2027 年 HBM4 采购议价空间几乎归零。',
    date: '2026-05-29',
    severity: 'critical',
    riskType: '供应短缺',
    affectedLayer: ['storage', 'chip'],
    impactOnCloud: '2027 年 GPU 整机交付不确定性增加；HBM4 采购成本预计较 HBM3E 上涨 25-35%；倒逼国产 HBM4 加速量产',
    recommendation: '提前锁定 2027 年 HBM4/HBM3E 长协；评估长鑫 HBM3E 16 层产品的接入路径；为昇腾 950PR 等国产方案预留切换空间',
    tags: ['HBM4', '长协锁产能', 'SK海力士', '议价归零'],
    source: '韩国经济日报 / DigiTimes'
  },
  {
    id: 102,
    title: 'DDR5 现货 5月再涨 12%，96GB RDIMM 突破 1980 美元',
    summary: '5月底 DDR5 现货价较 4月底再涨 12%，96GB RDIMM 单条均价 1980 美元，较 2025 年同期上涨 466%。三大原厂将 D5 产能持续向 HBM 倾斜，叠加 AI 服务器单机内存翻倍至 2.3TB，整机 BOM 中 DRAM 成本占比已超 35%（2025 年同期约 12%）。',
    date: '2026-05-30',
    severity: 'high',
    riskType: '价格波动',
    affectedLayer: ['storage'],
    impactOnCloud: 'AI 服务器整机采购单价继续上行；自建 IDC 折算单核成本同比上涨 30-40%；可能传导至云主机定价',
    recommendation: '推进 DDR5 长约采购；优化大内存机型分配策略；评估 CXL 内存池化方案降低单机配置压力',
    tags: ['DDR5', '现货上涨', 'AI服务器', '整机BOM'],
    source: 'DRAMeXchange / TrendForce'
  },
  {
    id: 103,
    title: '英伟达 B30A 中国特供版获批：短期缓解算力缺口，长期削弱国产替代节奏',
    summary: '5月22日 英伟达 B30A 中国特供版获美国出口审批，6月底首批交付。短期看缓解了部分客户对 H20 升级路径的焦虑；但其性能仅为 B200 的 60%，且单价 2.5 万美元，TCO 仍高于昇腾 950PR 约 18%。需警惕部分国内客户因 CUDA 生态惯性放缓国产化节奏。',
    date: '2026-05-22',
    severity: 'medium',
    riskType: '出口管制',
    affectedLayer: ['chip'],
    impactOnCloud: '为存量 CUDA 用户提供过渡方案；可能短期延缓昇腾 950PR / 思元 590 / 含光 800P 的部署节奏',
    recommendation: '在新建 AI 集群中坚持国产为主、特供为辅；混合部署架构提前规划；持续跟踪 CUDA on Ascend 适配进展',
    tags: ['B30A', '中国特供', 'CUDA惯性', '过渡方案'],
    source: 'The Information / 路透社'
  },
  {
    id: 104,
    title: '7.68TB NVMe SSD 单价突破 3900 美元，AI 训练存储成本压力剧增',
    summary: '5月29日 TrendForce 数据：7.68TB 企业级 NVMe SSD 现货单价 3903 美元，较 2025 年初上涨 419%。AI 训练集群单机配置 8-24 块 NVMe，单机存储成本超 9.4 万美元（约 67 万元人民币），占整机 BOM 25%+。长江存储 X3-9070 量产产能爬坡仍需 6 个月。',
    date: '2026-05-29',
    severity: 'high',
    riskType: '价格波动',
    affectedLayer: ['storage'],
    impactOnCloud: 'AI 服务器整机成本进一步上行；需重新评估冷热分层 + 对象存储下沉的存储架构',
    recommendation: '推进长江存储 X3-9070 采购评估；优化训练数据集存储分层；评估 QLC + HDD 混合存储方案降低单 GB 成本',
    tags: ['NVMe SSD', '存储成本', 'AI训练', '419%涨幅'],
    source: 'TrendForce / 集邦咨询'
  },
  {
    id: 105,
    title: 'PUE 收紧至 1.25：北京/上海/深圳新建 AI 集群强制全栈液冷',
    summary: '5月27日京沪深三地发布 AI 数据中心 PUE 强化指引，新建 AI 集群 PUE 须 < 1.25 且强制采用液冷。这意味着采用风冷的存量 AI 集群将无法通过新建审批，对未具备液冷设计能力的二三线 IDC 服务商形成挤出。短期可能进一步加剧液冷设备供应紧张。',
    date: '2026-05-27',
    severity: 'medium',
    riskType: '价格波动',
    affectedLayer: ['infra'],
    impactOnCloud: '新建 AI 集群 CAPEX 上升 8-12%；液冷设备采购周期延长；二三线 IDC 服务商或退出 AI 数据中心市场',
    recommendation: '提前锁定液冷设备长协；优先选择具备液冷工程能力的核心 IDC 合作方；存量风冷集群规划改造路径',
    tags: ['PUE 1.25', '强制液冷', '京沪深', '新规'],
    source: '北京/上海/深圳发改委 / 21世纪经济报道'
  },
  // ======= 4月-5月初历史风险 =======
  {
    id: 1,
    title: '美国对华 AI 芯片出口新增 15% "抽成税"，H20 综合成本飙升',
    summary: '4月中旬起，美国政府对出口中国的AI芯片新增15%"抽成税"（Surcharge），叠加原有关税和合规成本，英伟达H20在中国市场综合采购成本较年初上升约40%。该政策适用于所有算力超过4800 TOPS的AI芯片。',
    date: '2026-04-15',
    severity: 'critical',
    riskType: '出口管制',
    affectedLayer: ['chip', 'storage'],
    impactOnCloud: '云厂商GPU算力成本上升，可能传导至AI服务定价；加速国产芯片替代进程',
    recommendation: '加速评估华为昇腾、寒武纪等国产替代方案；锁定现有H20库存；与客户沟通AI服务涨价预期',
    tags: ['出口管制', 'H20', '抽成税', '成本上升'],
    source: '美国商务部 / 路透社'
  },
  {
    id: 2,
    title: 'HBM 供应高度集中于 SK 海力士，存在供应链单点风险',
    summary: 'SK海力士锁定英伟达70% HBM4订单，叠加美光产能全被预订，三星良率问题持续，HBM供应呈现"SK海力士一家独大"格局。若SK海力士产能或交付出现问题，将直接影响全球AI芯片供应。',
    date: '2026-04-16',
    severity: 'high',
    riskType: '供应短缺',
    affectedLayer: ['storage', 'chip'],
    impactOnCloud: 'GPU供货周期可能延长；HBM价格议价空间收窄；国产HBM（长鑫）商业价值提升',
    recommendation: '关注长鑫存储HBM3量产进度；评估非英伟达（AMD/华为）算力方案的HBM供应链稳定性',
    tags: ['HBM', 'SK海力士', '供应集中', '单点风险'],
    source: 'DigiTimes / 集微网'
  },
  {
    id: 3,
    title: 'EDA 工具国产化率仅 10%，先进制程设计受限',
    summary: '当前国内EDA工具国产化率约10%，7nm及以下先进制程设计高度依赖Synopsys、Cadence。若美国进一步收紧EDA出口，将直接影响华为海思、寒武纪等国产芯片的先进制程迭代能力。',
    date: '2026-04-10',
    severity: 'high',
    riskType: '技术封锁',
    affectedLayer: ['design', 'manufacturing'],
    impactOnCloud: '国产芯片先进制程迭代可能放缓；影响华为昇腾、寒武纪下一代产品路线图',
    recommendation: '跟踪华大九天、芯华章等国产EDA进展；评估14nm及以上成熟制程方案的可行性',
    tags: ['EDA', '国产化', '先进制程', '技术封锁'],
    source: '华大九天 / SEMI'
  },
  {
    id: 4,
    title: '台海局势紧张，台积电供应链风险持续',
    summary: '4-5月期间台海军事活动频繁，市场对台积电供应链稳定性担忧加剧。台积电承担全球约60%先进制程代工产能，若出现供应中断，将对全球AI芯片供应造成毁灭性影响。',
    date: '2026-04-20',
    severity: 'medium',
    riskType: '地缘政治',
    affectedLayer: ['manufacturing', 'chip'],
    impactOnCloud: '需评估替代晶圆代工方案（三星/中芯国际）；可能影响英伟达/AMD芯片交付',
    recommendation: '关注三星代工产能扩张；评估中芯国际成熟制程方案；建立芯片安全库存',
    tags: ['台积电', '地缘政治', '供应链风险', '晶圆代工'],
    source: '路透社 / 日经亚洲'
  },
  {
    id: 5,
    title: 'NAND Flash 价格 Q2 上涨 8-12%，企业级 SSD 成本上升',
    summary: 'NAND Flash合约价Q2环比上涨8-12%，企业级SSD涨幅达15%。AI服务器单机SSD容量从4TB提升至16TB，叠加长江存储产能爬坡慢于预期，存储成本压力持续。',
    date: '2026-04-10',
    severity: 'medium',
    riskType: '价格波动',
    affectedLayer: ['storage'],
    impactOnCloud: '数据中心存储采购成本上升约10-15%；可能影响云存储服务定价',
    recommendation: '提前锁定SSD采购合同；评估长江存储产品替代可行性；优化存储架构降低单位成本',
    tags: ['NAND', '涨价', '存储成本', 'SSD'],
    source: 'TrendForce / 集邦咨询'
  }
]

// =============== 分类配置 ===============
export const chipTypeConfig: Record<string, { color: string; bg: string }> = {
  GPU: { color: '#16a34a', bg: '#dcfce7' },
  NPU: { color: '#dc2626', bg: '#fee2e2' },
  CPU: { color: '#2563eb', bg: '#dbeafe' },
  TPU: { color: '#9333ea', bg: '#f3e8ff' },
  '综合': { color: '#6b7280', bg: '#f3f4f6' }
}

export const storageTypeConfig: Record<string, { color: string; bg: string }> = {
  HBM: { color: '#dc2626', bg: '#fee2e2' },
  NAND: { color: '#2563eb', bg: '#dbeafe' },
  DRAM: { color: '#16a34a', bg: '#dcfce7' },
  SSD: { color: '#f59e0b', bg: '#fef3c7' }
}

export const networkTypeConfig: Record<string, { color: string; bg: string }> = {
  '光模块': { color: '#dc2626', bg: '#fee2e2' },
  '交换机': { color: '#2563eb', bg: '#dbeafe' },
  DPU: { color: '#9333ea', bg: '#f3e8ff' },
  '路由器': { color: '#16a34a', bg: '#dcfce7' }
}

export const infraTypeConfig: Record<string, { color: string; bg: string }> = {
  '液冷': { color: '#0ea5e9', bg: '#e0f2fe' },
  'PUE政策': { color: '#16a34a', bg: '#dcfce7' },
  '数据中心': { color: '#6366f1', bg: '#e0e7ff' },
  '电力': { color: '#f59e0b', bg: '#fef3c7' }
}

export const riskTypeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  '出口管制': { color: '#dc2626', bg: '#fee2e2', icon: '🚫' },
  '供应短缺': { color: '#f59e0b', bg: '#fef3c7', icon: '📦' },
  '价格波动': { color: '#2563eb', bg: '#dbeafe', icon: '📈' },
  '技术封锁': { color: '#9333ea', bg: '#f3e8ff', icon: '🔒' },
  '地缘政治': { color: '#6b7280', bg: '#f3f4f6', icon: '🌍' }
}

export const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: '#991b1b', bg: '#fee2e2', label: '🚨 紧急' },
  high: { color: '#c2410c', bg: '#ffedd5', label: '⚠️ 高危' },
  medium: { color: '#b45309', bg: '#fef3c7', label: '📌 关注' },
  low: { color: '#166534', bg: '#dcfce7', label: '✅ 正常' }
}

export const riskLevelConfig: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: '#dc2626', bg: '#fee2e2', label: '极高风险' },
  high: { color: '#f59e0b', bg: '#fef3c7', label: '高风险' },
  medium: { color: '#2563eb', bg: '#dbeafe', label: '中风险' },
  low: { color: '#16a34a', bg: '#dcfce7', label: '低风险' }
}

export const importanceConfig = {
  重磅: { color: '#ef4444', bg: '#fef2f2', icon: '🔥' },
  重要: { color: '#f59e0b', bg: '#fff7ed', icon: '⭐' },
  一般: { color: '#6b7280', bg: '#f9fafb', icon: '📌' }
}
