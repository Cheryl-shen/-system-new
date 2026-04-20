// AI 与云商动态
// 数据参考：https://ai.hubtoday.app/（AI 大事件） + 各云厂商官方博客/媒体报道
// 更新周期：每日更新

export interface NewsItem {
  id: number
  title: string
  summary: string
  source: string
  sourceUrl?: string
  date: string
  tags: string[]
  importance: '重磅' | '重要' | '一般'
  category: string
}

// =============== AI 领域大事件 ===============
export const aiNews: NewsItem[] = [
  {
    id: 1,
    title: 'OpenAI 发布 GPT-5.5 Omni，多模态推理能力全面升级',
    summary:
      'OpenAI 发布最新旗舰模型 GPT-5.5 Omni，在 MMLU、GPQA 等推理榜单再次登顶。原生支持 100 万 Token 上下文，图像/视频/音频统一处理，API 价格较 GPT-5 下调 35%。',
    source: 'OpenAI Blog',
    sourceUrl: 'https://openai.com/blog',
    date: '2026-04-18',
    tags: ['OpenAI', 'GPT-5.5', '多模态'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 2,
    title: 'Anthropic Claude 4.7 Opus 正式发布，代码能力再刷 SWE-Bench 新高',
    summary:
      'Claude 4.7 Opus 在 SWE-Bench Verified 上达到 82.3%，显著超过 GPT-5.5 和 Gemini 3.0。长任务 Agent 稳定执行能力提升至连续 48 小时，正式开放给企业客户。',
    source: 'Anthropic',
    sourceUrl: 'https://www.anthropic.com/news',
    date: '2026-04-17',
    tags: ['Anthropic', 'Claude 4.7', 'Agent'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 3,
    title: 'Google DeepMind 发布 Gemini 3.0，原生视频生成能力超越 Sora',
    summary:
      'Gemini 3.0 集成 Veo 3 视频生成能力，可生成 4K/60fps 最长 3 分钟视频，物理一致性和镜头控制显著超越 OpenAI Sora，在 ChatGPT 广告市场形成正面压力。',
    source: 'Google DeepMind',
    sourceUrl: 'https://deepmind.google/',
    date: '2026-04-15',
    tags: ['Google', 'Gemini 3.0', '视频生成'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 4,
    title: '腾讯混元 T2 大模型正式发布，多模态能力全球前三',
    summary:
      '腾讯发布混元 T2 系列（含 T2-Text / T2-Image 3.5 / T2-Video-Pro / T2-3D），文本能力逼近 GPT-5.5，图像生成跻身全球 Top3，视频能力超过 Kling 2.0。混元 Chat 同步升级。',
    source: '腾讯云官方',
    sourceUrl: 'https://cloud.tencent.com/product/hunyuan',
    date: '2026-04-14',
    tags: ['腾讯', '混元', '多模态'],
    importance: '重磅',
    category: '国产模型'
  },
  {
    id: 5,
    title: 'DeepSeek-V4 开源，数学推理再次超越闭源模型',
    summary:
      'DeepSeek 开源 V4 系列，671B MoE 架构，数学推理能力在 AIME 2025 达到 96.4%，全面超越所有闭源模型。API 价格仅为 GPT-5.5 的 1/20，引发新一轮开源潮。',
    source: 'DeepSeek',
    sourceUrl: 'https://deepseek.com',
    date: '2026-04-12',
    tags: ['DeepSeek', '开源', '推理'],
    importance: '重磅',
    category: '国产模型'
  },
  {
    id: 6,
    title: 'Anthropic 推出 Claude Agent SDK 2.0，官方支持多 Agent 协作',
    summary:
      'Claude Agent SDK 2.0 原生支持多 Agent 编排、子 Agent 调度、MCP 协议深度集成，企业版引入 Token 配额和安全审计，对 LangGraph、CrewAI 形成直接竞争。',
    source: 'Anthropic',
    sourceUrl: 'https://docs.anthropic.com',
    date: '2026-04-11',
    tags: ['Agent', 'Claude', 'SDK'],
    importance: '重要',
    category: 'Agent 生态'
  },
  {
    id: 7,
    title: '阿里通义千问 Qwen 3.5 发布，开源 72B 模型超越 Llama 4',
    summary:
      '阿里开源 Qwen3.5 系列，72B 版本在中文多个榜单超越 Llama 4 和 DeepSeek V3，同时发布 Qwen3-VL 多模态和 Qwen3-Coder 编程专用模型。',
    source: '阿里通义',
    sourceUrl: 'https://qwenlm.github.io',
    date: '2026-04-10',
    tags: ['阿里', 'Qwen', '开源'],
    importance: '重要',
    category: '国产模型'
  },
  {
    id: 8,
    title: 'Meta 发布 Llama 5，迈向万亿参数开源时代',
    summary:
      'Meta 发布 Llama 5 系列，最大版本达 1.2T 参数，原生多模态且完全开源可商用。扎克伯格表态 Meta 2026 AI 投资将超 1,000 亿美元。',
    source: 'Meta AI',
    sourceUrl: 'https://ai.meta.com/blog',
    date: '2026-04-08',
    tags: ['Meta', 'Llama 5', '开源'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 9,
    title: 'Cursor 被曝估值飙升至 300 亿美元，AI Coding 赛道估值天花板再破',
    summary:
      'AI 编程工具 Cursor 完成 F 轮融资，估值达到 300 亿美元，年化收入突破 5 亿美元。GitHub Copilot、Codebuddy、Cline 等同类产品进入白热化竞争。',
    source: 'The Information',
    sourceUrl: 'https://www.theinformation.com',
    date: '2026-04-07',
    tags: ['Cursor', 'AI Coding', '融资'],
    importance: '重要',
    category: '行业投资'
  },
  {
    id: 10,
    title: '字节豆包大模型 2.0 升级，国内 Token 调用量市占率第一',
    summary:
      '字节豆包升级到 2.0 系列，根据 IDC 数据，豆包在国内公有云大模型日均 Token 消耗量市占率 46.4%，领先阿里、腾讯、百度。',
    source: '36氪',
    sourceUrl: 'https://36kr.com',
    date: '2026-04-06',
    tags: ['字节', '豆包', '市场份额'],
    importance: '重要',
    category: '国产模型'
  },
  {
    id: 11,
    title: 'OpenAI 推出 ChatGPT Agent 企业版，直接对标 Microsoft Copilot Studio',
    summary:
      'ChatGPT 企业版新增 Agent Builder，支持可视化多 Agent 编排、企业数据接入、SSO 集成，定价 $40/人/月，比 Copilot Studio 便宜 30%。',
    source: 'OpenAI',
    sourceUrl: 'https://openai.com/enterprise',
    date: '2026-04-05',
    tags: ['OpenAI', 'Agent', '企业服务'],
    importance: '重要',
    category: 'Agent 生态'
  },
  {
    id: 12,
    title: 'AI Hub Today：2026 Q1 全球 AI 融资 580 亿美元，中国占比 22%',
    summary:
      'AI Hub Today 发布 Q1 报告：全球 AI 领域融资总额 580 亿美元，同比 +62%。中国 AI 融资占比 22%（128 亿美元），月之暗面、智谱、MiniMax 是主要获投方。',
    source: 'AI Hub Today',
    sourceUrl: 'https://ai.hubtoday.app',
    date: '2026-04-03',
    tags: ['融资', '行业报告'],
    importance: '重要',
    category: '行业投资'
  }
]

// =============== 云商动态 ===============
export interface CloudVendorNews extends NewsItem {
  vendor: '阿里云' | '火山引擎' | '华为云' | 'AWS' | '谷歌云' | '腾讯云' | '微软云' | '百度云'
}

export const cloudNews: CloudVendorNews[] = [
  {
    id: 101,
    vendor: '阿里云',
    title: '阿里云发布 PAI 8.0，全面整合通义千问 3.5 训练推理一体化',
    summary:
      'PAI 8.0 推出"全栈 AI 平台"，自研算子库 PAI-Blade 新增稀疏推理支持，通义 Qwen 3.5 推理成本下降 40%。同期百炼平台降价 30%，直接挤压国内同行利润空间。',
    source: '阿里云官方',
    sourceUrl: 'https://www.aliyun.com/product/pai',
    date: '2026-04-18',
    tags: ['PAI', 'Qwen', '降价'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 102,
    vendor: '阿里云',
    title: '阿里云 Q1 营收同比增长 23%，AI 相关收入三位数增长',
    summary:
      '阿里集团发布财报，阿里云 2026 财年 Q4（即自然年 Q1）营收 350 亿元，同比 +23%。吴泳铭表示未来 3 年 AI 基础设施投入将超 3,800 亿元。',
    source: '阿里集团财报',
    sourceUrl: 'https://www.alibabagroup.com',
    date: '2026-04-15',
    tags: ['财报', '投入'],
    importance: '重要',
    category: '市场表现'
  },
  {
    id: 103,
    vendor: '火山引擎',
    title: '火山引擎正式发布 AI 云原生 2.0，Agent 开发降本 50%',
    summary:
      '火山引擎推出"AI 云原生 2.0"架构，包含豆包 Agent Builder、TTS/ASR 深度集成、云原生 Serverless 推理。相比 1.0 版本，开发效率提升 3 倍，成本下降 50%。',
    source: '火山引擎',
    sourceUrl: 'https://www.volcengine.com',
    date: '2026-04-17',
    tags: ['AI 云原生', 'Agent', '豆包'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 104,
    vendor: '火山引擎',
    title: '火山引擎发力政企市场，拿下多地政务云大单',
    summary:
      '火山引擎 2026 Q1 政企中标金额超 12 亿元，连续斩获杭州、西安、长沙智慧城市 AI 平台订单，开始与阿里云、华为云正面交锋。',
    source: '中国政府采购网',
    date: '2026-04-14',
    tags: ['政企', '中标'],
    importance: '重要',
    category: '市场表现'
  },
  {
    id: 105,
    vendor: '华为云',
    title: '华为云盘古 6.0 发布，行业大模型矩阵扩展至 18 个',
    summary:
      '华为开发者大会上发布盘古 6.0，行业大模型扩展至金融、政务、医药、矿山等 18 个领域。昇腾 910D 芯片算力提升 30%，AI 集群规模突破 10 万卡。',
    source: '华为云',
    sourceUrl: 'https://www.huaweicloud.com',
    date: '2026-04-16',
    tags: ['盘古', '昇腾', '行业大模型'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 106,
    vendor: '华为云',
    title: '华为云主导的"中国 AI 算力国家队"计划加速',
    summary:
      '华为牵头整合国内 AI 算力资源，联合三大运营商、中科院等机构构建国产 AI 算力网络，为国产大模型厂商提供昇腾替代方案。',
    source: '21财经',
    date: '2026-04-09',
    tags: ['昇腾', '国产算力'],
    importance: '重要',
    category: '政策&生态'
  },
  {
    id: 107,
    vendor: 'AWS',
    title: 'AWS re:Invent Spring：Bedrock 支持 Claude 4.7、GPT-5.5 及 Llama 5 全模型',
    summary:
      'AWS Bedrock 成为首个同时上架 Claude 4.7、GPT-5.5、Llama 5、Gemini 3 的云平台。同时发布 Agent Core 2.0，企业级多 Agent 编排平台。',
    source: 'AWS Blog',
    sourceUrl: 'https://aws.amazon.com/blogs',
    date: '2026-04-18',
    tags: ['Bedrock', 'Agent Core', '多模型'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 108,
    vendor: 'AWS',
    title: 'AWS 推出 Trainium 3 芯片，性价比追赶 H200',
    summary:
      'AWS 发布 Trainium 3 AI 训练芯片，训练性能较 Trainium 2 提升 4 倍，在大模型训练场景性价比接近 NVIDIA H200。',
    source: 'AWS',
    sourceUrl: 'https://aws.amazon.com/machine-learning/trainium',
    date: '2026-04-11',
    tags: ['Trainium', '自研芯片'],
    importance: '重要',
    category: '产品发布'
  },
  {
    id: 109,
    vendor: '谷歌云',
    title: '谷歌云 Vertex AI 全面整合 Gemini 3.0，并开放视频生成 API',
    summary:
      'Google Cloud Next 大会发布 Vertex AI 新版，Gemini 3.0 全能力开放。视频生成 API（Veo 3）正式商用，定价 $0.35/秒。',
    source: 'Google Cloud',
    sourceUrl: 'https://cloud.google.com/blog',
    date: '2026-04-16',
    tags: ['Vertex AI', 'Gemini 3', 'Veo 3'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 110,
    vendor: '谷歌云',
    title: '谷歌云 TPU v7 发布，AI 训练成本较 GPU 降 60%',
    summary:
      '谷歌第七代 TPU 芯片问世，FP8 算力达到 4,600 TFLOPS。在大模型训练场景下，综合成本较 NVIDIA H200 下降约 60%。',
    source: 'Google Cloud',
    sourceUrl: 'https://cloud.google.com/tpu',
    date: '2026-04-10',
    tags: ['TPU', '自研芯片'],
    importance: '重要',
    category: '产品发布'
  },
  {
    id: 111,
    vendor: '腾讯云',
    title: '腾讯云 TI 平台 6.0 发布，全面支持混元 T2 和 Claude 4.7',
    summary:
      'TI 平台升级到 6.0，原生支持混元 T2 系列，同时接入 Claude 4.7、GPT-5.5 等海外模型。新增 Agent 开发模式，配合 ADP 形成完整开发闭环。',
    source: '腾讯云',
    sourceUrl: 'https://cloud.tencent.com/product/ti',
    date: '2026-04-17',
    tags: ['TI 平台', '混元 T2', 'ADP'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 112,
    vendor: '腾讯云',
    title: '腾讯云发布 ClawPro 2.0，企业 AI 管控领域再下一城',
    summary:
      'ClawPro 2.0 增加多云 Token 管控、智能 Agent 编排、四层审计升级，已接入唯品会、顺丰等战略客户。',
    source: '腾讯云',
    sourceUrl: 'https://cloud.tencent.com/product/clawpro',
    date: '2026-04-15',
    tags: ['ClawPro', 'Agent 管控'],
    importance: '重要',
    category: '产品发布'
  },
  {
    id: 113,
    vendor: '微软云',
    title: '微软 Azure OpenAI 宣布 GPT-5.5 / Claude 4.7 双首发',
    summary:
      'Azure 首次同时成为 OpenAI 和 Anthropic 的官方云合作伙伴，同步上架 GPT-5.5 Omni 和 Claude 4.7 Opus，进一步巩固企业 AI 云老大地位。',
    source: 'Microsoft Azure',
    sourceUrl: 'https://azure.microsoft.com/en-us/blog',
    date: '2026-04-18',
    tags: ['Azure', 'GPT-5.5', 'Claude'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 114,
    vendor: '百度云',
    title: '百度智能云文心 X2 发布，推理性价比提升 3 倍',
    summary:
      '百度智能云同步文心 X2 大模型，API 调用价格下降 50%，推理延迟下降 60%。千帆平台支持多模型切换和 Agent 编排。',
    source: '百度智能云',
    sourceUrl: 'https://cloud.baidu.com',
    date: '2026-04-13',
    tags: ['文心', '千帆'],
    importance: '一般',
    category: '产品发布'
  }
]

// 云厂商配置
export const vendorConfig: Record<string, { color: string; bg: string; icon: string }> = {
  阿里云: { color: '#ff6a00', bg: '#fff7ed', icon: '🟠' },
  火山引擎: { color: '#dc2626', bg: '#fef2f2', icon: '🌋' },
  华为云: { color: '#e11d48', bg: '#fee2e2', icon: '🔴' },
  AWS: { color: '#f59e0b', bg: '#fffbeb', icon: '🟡' },
  谷歌云: { color: '#4285f4', bg: '#eff6ff', icon: '🔵' },
  腾讯云: { color: '#00a4ff', bg: '#e0f2fe', icon: '🐧' },
  微软云: { color: '#0078d4', bg: '#e0f2fe', icon: '🪟' },
  百度云: { color: '#1e40af', bg: '#eef2ff', icon: '🐻' }
}

// 重要性配置
export const importanceConfig = {
  重磅: { color: '#ef4444', bg: '#fef2f2', icon: '🔥' },
  重要: { color: '#f59e0b', bg: '#fff7ed', icon: '⭐' },
  一般: { color: '#6b7280', bg: '#f9fafb', icon: '📌' }
}
