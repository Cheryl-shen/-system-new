// 供应链情报数据
// 数据参考：权威媒体 + 各芯片厂商/云厂商官方公告
// 更新周期：每周更新
// 最后更新：2026-05-09
// 数据范围：2026-04-01 ~ 2026-05-09

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
}

export const supplyChainNodes: SupplyChainNode[] = [
  {
    id: 'design',
    name: '设计IP/EDA',
    icon: '🎯',
    layer: 1,
    riskLevel: 'critical',
    localizationRate: 10,
    description: 'EDA工具、IP核、芯片设计软件',
    keyPlayers: ['Synopsys', 'Cadence', 'Siemens EDA', '华大九天', '芯华章']
  },
  {
    id: 'manufacturing',
    name: '晶圆制造',
    icon: '🏭',
    layer: 2,
    riskLevel: 'critical',
    localizationRate: 15,
    description: '先进制程晶圆代工、光刻机、刻蚀设备',
    keyPlayers: ['台积电', '三星', '中芯国际', '华虹半导体', 'ASML']
  },
  {
    id: 'chip',
    name: 'AI芯片',
    icon: '🔲',
    layer: 3,
    riskLevel: 'critical',
    localizationRate: 30,
    description: 'GPU、NPU、TPU、AI训练/推理芯片',
    keyPlayers: ['英伟达', 'AMD', '华为昇腾', '寒武纪', '海光信息']
  },
  {
    id: 'storage',
    name: '存储与内存',
    icon: '💾',
    layer: 4,
    riskLevel: 'high',
    localizationRate: 40,
    description: 'HBM、NAND、DRAM、企业级SSD',
    keyPlayers: ['SK海力士', '三星', '美光', '长江存储', '长鑫存储']
  },
  {
    id: 'network',
    name: '网络设备',
    icon: '🌐',
    layer: 5,
    riskLevel: 'medium',
    localizationRate: 80,
    description: '光模块、交换机、DPU、路由器',
    keyPlayers: ['华为', '中兴', '新华三', '锐捷网络', '中际旭创']
  },
  {
    id: 'infra',
    name: '基础设施',
    icon: '🏢',
    layer: 6,
    riskLevel: 'low',
    localizationRate: 90,
    description: '数据中心、液冷系统、电力设施',
    keyPlayers: ['世纪互联', '万国数据', '秦淮数据', '腾讯云', '阿里云']
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
  updateDate: '2026-05-09',
  summary: '2026年4-5月，全球AI算力供应链进入"国产替代加速期"与"成本重构期"双重叠加阶段。DeepSeek V4全面适配华为昇腾950PR标志着国产算力生态成熟度质变；英伟达H20综合成本因15%抽成税上升40%，加速国内客户转向国产芯片；SK海力士锁定英伟达70% HBM4订单，存储环节集中度进一步提升；全国34省PUE政策落地（<1.3），液冷渗透率预计2026年突破35%。',
  highlights: [
    {
      icon: '🔥',
      title: '国产算力突破',
      content: 'DeepSeek V4全面适配华为昇腾950PR，单卡算力达H20的2.87倍',
      trend: 'up'
    },
    {
      icon: '💰',
      title: '进口成本飙升',
      content: '英伟达H20综合成本上升40%（含15%抽成税），客户加速国产替代',
      trend: 'up'
    },
    {
      icon: '📦',
      title: 'HBM供应集中',
      content: 'SK海力士获英伟达70% HBM4订单，国内长鑫量产12层HBM3',
      trend: 'stable'
    },
    {
      icon: '❄️',
      title: '液冷渗透加速',
      content: '全国34省PUE政策落地（<1.3），液冷渗透率预计突破35%',
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
    importance: '重磅'
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
  {
    id: 1,
    title: '全国 34 省 PUE 政策全面落地，新建数据中心 PUE 须 < 1.3',
    summary: '截至4月底，全国31省市区+3个直辖市已全部出台数据中心PUE强制标准：新建数据中心PUE须低于1.3，存量数据中心须在2027年前完成改造。北京、上海、深圳进一步要求新建AI数据中心PUE<1.2。政策倒逼液冷技术大规模应用。',
    date: '2026-04-30',
    category: 'PUE政策',
    region: '全国',
    tags: ['PUE政策', '强制标准', '数据中心', '节能'],
    source: '工信部 / 各省发改委',
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
