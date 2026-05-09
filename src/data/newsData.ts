// AI 与云商动态
// 数据参考：https://ai.hubtoday.app/（AI 大事件） + 各云厂商官方博客/媒体报道
// 更新周期：每日更新
// 最后更新：2026-05-09
// - AI大事件（4.25-5.9）：月之暗面20亿美元融资/大基金洽投DeepSeek 450亿估值/OpenAI GPT-Realtime-2语音三模型/微软-OpenAI结束独家协议/Mistral Medium 3.5开源128B/Google TPU 8+Gemini Enterprise Agent/Agent 365 GA/Gemini 3.1 Ultra 200万Token/工信部"模数共振"行动
// - 价格动态（4.29-5.9）：OpenAI GPT-Realtime定价/GPT-5.5隐性涨价92%/Claude Opus 4.7分词器涨价/Mistral Medium 3.5定价/豆包付费订阅68-500元/腾讯云涨价生效/DeepSeek V4 Pro优惠延长

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
  // ======= 本周新增（4.25-5.9） =======
  {
    id: 31,
    title: '月之暗面 Kimi 完成 20 亿美元 D 轮融资，估值突破 200 亿美元，国内大模型最大单笔融资',
    summary:
      '5 月 7 日华峰资本披露，月之暗面（Kimi）完成新一轮约 20 亿美元融资，投后估值突破 200 亿美元，为国内大模型创业公司迄今金额最高的私募融资。本轮由美团龙珠领投，水木资本、中国移动、CPE 源峰等参投。至此，月之暗面半年内累计融资超 39 亿美元，估值较去年 11 月翻四倍。',
    source: '华峰资本 / 财新 / 智东西',
    sourceUrl: 'https://finance.sina.com.cn/wm/2026-05-08/doc-inhxefhi2220676.shtml',
    date: '2026-05-07',
    tags: ['月之暗面', 'Kimi', '融资', '200亿美元'],
    importance: '重磅',
    category: '行业投资'
  },
  {
    id: 32,
    title: '大基金洽谈领投 DeepSeek 首轮外部融资，估值或达 450 亿美元',
    summary:
      '5 月 6 日英国《金融时报》等多家媒体报道，国家集成电路产业投资基金（大基金）正与 DeepSeek 洽谈领投其首轮外部融资，估值有望达到约 450 亿美元（约 3,067 亿人民币）。若完成，DeepSeek 将成为全球估值最高的 AI 初创之一，梁文锋持股约 89.5%。此举标志着国家级资本正式入局开源大模型赛道。',
    source: 'Financial Times / 证券时报',
    sourceUrl: 'https://finance.eastmoney.com/a/202605073729525463.html',
    date: '2026-05-06',
    tags: ['DeepSeek', '大基金', '融资', '450亿美元'],
    importance: '重磅',
    category: '行业投资'
  },
  {
    id: 33,
    title: 'OpenAI 发布三款实时语音模型：GPT-Realtime-2 / Translate / Whisper，语音 Agent 时代开启',
    summary:
      '5 月 7 日 OpenAI 在 Realtime API 中发布三款全新音频模型：GPT-Realtime-2 带来 GPT-5 级推理的实时语音对话；GPT-Realtime-Translate 支持跨语言实时翻译；GPT-Realtime-Whisper 提供流式转录。三款模型可分别按 Token/分钟计费，解锁语音 Agent、实时翻译器、智能客服等全新产品形态。',
    source: 'OpenAI / TechCrunch',
    sourceUrl: 'https://techcrunch.com/2026/05/07/openai-launches-new-voice-intelligence-features-in-its-api/',
    date: '2026-05-07',
    tags: ['OpenAI', 'GPT-Realtime-2', '语音AI', '实时翻译'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 34,
    title: '微软与 OpenAI 重组合作关系：结束独家协议，OpenAI 可登陆其他云平台',
    summary:
      '4 月 27 日微软与 OpenAI 联合宣布修订合作协议：微软不再拥有 OpenAI 技术的独家许可权，OpenAI 可将模型上架 AWS、谷歌云等竞争对手平台；收入分成设 2030 年到期日。微软仍持有 OpenAI 约 27% 股权，Azure 仍为首选云伙伴，但独占时代正式终结。该重构被视为 AI 云市场格局重塑的分水岭。',
    source: 'Microsoft Blog / CNBC / Ars Technica',
    sourceUrl: 'https://blogs.microsoft.com/blog/2026/04/27/the-next-phase-of-the-microsoft-openai-partnership/',
    date: '2026-04-27',
    tags: ['微软', 'OpenAI', '合作重组', '非独家'],
    importance: '重磅',
    category: '市场表现'
  },
  {
    id: 35,
    title: 'Mistral 发布 Medium 3.5（128B 稠密模型），SWE-Bench 达 77.6%，开源编程新王者',
    summary:
      '4 月 29 日法国 Mistral AI 发布旗舰模型 Mistral Medium 3.5：128B 稠密架构、256K 上下文窗口，SWE-Bench Verified 得分 77.6%，仅次于 Claude 4.7 Opus。采用修改版 MIT 许可开源权重。同步推出 Vibe 云端远程编码 Agent，支持异步长任务执行，对标 Cursor/Devin 模式。',
    source: 'Mistral AI / Hugging Face',
    sourceUrl: 'https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5',
    date: '2026-04-29',
    tags: ['Mistral', 'Medium 3.5', '128B', '开源', 'Vibe'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 36,
    title: 'Google Cloud Next 2026：发布第八代 TPU + Gemini Enterprise Agent Platform',
    summary:
      '4 月 22 日谷歌在 Cloud Next 2026 大会发布第八代 TPU（TPU 8t 训练 + TPU 8i 推理），首次按训练/推理拆分两款专用芯片。同步推出 Gemini Enterprise Agent Platform（Vertex AI 进化版），整合模型、DevOps、编排与企业安全，支持 A2A 协议多 Agent 互通。Pichai 透露谷歌内部 75% 新代码由 AI 生成。',
    source: 'Google Cloud / TechNews',
    sourceUrl: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/next-2026/',
    date: '2026-04-25',
    tags: ['Google', 'TPU 8', 'Gemini Enterprise', 'Agent Platform', 'A2A'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 37,
    title: 'Microsoft Agent 365 正式上线（GA），企业 AI Agent 治理进入产品化时代',
    summary:
      '5 月 2 日微软宣布 Agent 365 正式商用（GA），为企业环境中的 AI Agent 提供身份验证、安全治理、权限控制和审计工具。Agent 365 深度集成 Copilot Studio 和 Azure OpenAI Service，支持跨部门多 Agent 编排和统一生命周期管理，直接对标 Google Gemini Enterprise Agent Platform。',
    source: 'Microsoft / AI Tools Recap',
    sourceUrl: 'https://www.microsoft.com/en-us/microsoft-365',
    date: '2026-05-02',
    tags: ['微软', 'Agent 365', '企业治理', 'Copilot'],
    importance: '重要',
    category: 'Agent 生态'
  },
  {
    id: 38,
    title: 'Gemini 3.1 Ultra 发布：200 万 Token 上下文窗口，基础设施级突破',
    summary:
      '5 月初 Google DeepMind 正式发布 Gemini 3.1 Ultra，将上下文窗口提升至 200 万 Token，为当前商用模型中最长。原生支持文本/图像/音频/视频统一处理，无需转录中介。附带沙盒化代码执行工具，模型可在对话中编写并运行代码。标志着超长上下文从"实验"进入"可商用"阶段。',
    source: 'Google DeepMind / AI Tools Recap',
    sourceUrl: 'https://deepmind.google/',
    date: '2026-05-01',
    tags: ['Google', 'Gemini 3.1', '200万Token', '超长上下文'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 39,
    title: '工信部联合国家数据局启动"模数共振"行动，AI 赋能制造业 20 个关键领域',
    summary:
      '工信部与国家数据局联合发布通知，正式启动 2026 年"模数共振"行动。聚焦制造业 20 个关键领域，在全国遴选重点城市，突破场景应用、模型开发、智能体构建、数据集建设等核心环节，旨在通过 AI 技术深度赋能新型工业化进程。标志着国家层面 AI 产业政策从"鼓励创新"转向"规模落地"。',
    source: '工信部 / MSN',
    sourceUrl: 'https://www.msn.cn',
    date: '2026-05-05',
    tags: ['工信部', '模数共振', '制造业', '产业政策'],
    importance: '重要',
    category: '政策&生态'
  },
  {
    id: 13,
    title: 'DeepSeek 首次启动外部融资，估值冲击 100 亿美元，联手华为昇腾摆脱英伟达',
    summary:
      'The Information 4 月 17 日援引消息：DeepSeek 正洽谈首轮外部融资，目标至少 3 亿美元、估值不低于 100 亿美元，打破梁文锋长期「不融资」承诺。同期 DeepSeek V4 已深度对接华为昇腾 950PR 芯片与 Atlas 350 加速卡，单卡算力约为 H20 的 2.87 倍，加速国产算力栈替代 CUDA。',
    source: 'The Information / 新浪财经',
    sourceUrl: 'https://finance.sina.com.cn/roll/2026-04-20/doc-inhvayqm8639905.shtml',
    date: '2026-04-20',
    tags: ['DeepSeek', '融资', '昇腾', '国产算力'],
    importance: '重磅',
    category: '行业投资'
  },
  {
    id: 14,
    title: '腾讯、阿里同日发布世界模型，AI 竞争焦点转向空间智能',
    summary:
      '4 月 16 日，腾讯混元开源 3D 世界模型 2.0（HY-World 2.0），支持文本/图片/视频多模态生成 3D 场景；同日阿里 ATH 事业群推出实时交互式世界模型 HappyOyster（快乐生蚝）。两家同步出牌，标志国内 AI 大战从语言/对话转向物理/空间智能新赛道。',
    source: '36氪 / 21世纪经济报道',
    sourceUrl: 'https://www.36kr.com/p/3777841322898182',
    date: '2026-04-16',
    tags: ['腾讯', '阿里', '世界模型', '空间智能'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 15,
    title: '阿里 HappyHorse（欢乐马）AI 视频模型登顶全球榜单，4月27日百炼开放邀测',
    summary:
      '阿里 ATH 4 月 20 日宣布：HappyHorse-1.0 视频生成模型将于 4 月 27 日通过阿里云百炼平台开放 API 测试，首批面向企业级客户，5 月正式推出商用版本。此前 HappyHorse 以 1333 Elo 分登顶 Artificial Analysis 视频竞技场排行榜，直接对标字节 Seedance 2.0。',
    source: 'IT之家 / 新浪财经',
    sourceUrl: 'https://www.ithome.com/0/941/130.htm',
    date: '2026-04-20',
    tags: ['阿里', 'HappyHorse', '视频生成', '百炼'],
    importance: '重磅',
    category: '国产模型'
  },
  {
    id: 16,
    title: '字节 Seedance 2.0 API 升级至原生 1080P，火山引擎 AI 视频规模化落地',
    summary:
      '4 月 21 日字节跳动火山引擎宣布，Seedance 2.0 API 服务正式支持原生 1080P 全高清视频生成。该能力由模型原生支持，可在 1080P 分辨率下直接构建画面，细节密度与光影层次显著提升。火山引擎成都 AI 创新巡展同步披露企业侧调用量环比翻倍。',
    source: 'IT之家 / 火山引擎开发者社区',
    sourceUrl: 'https://developer.volcengine.com/articles/7628567056649125942',
    date: '2026-04-21',
    tags: ['字节', 'Seedance 2.0', '1080P', '视频生成'],
    importance: '重要',
    category: '国产模型'
  },
  {
    id: 17,
    title: '亚马逊追加投资 Anthropic 最高 250 亿美元，千亿美元算力大单锁定 AWS Trainium',
    summary:
      '4 月 21 日亚马逊宣布，将向 Anthropic 追加投资最高 250 亿美元。Anthropic 同步承诺未来十年将在 AWS 技术产品上投入超过 1,000 亿美元，涵盖亚马逊 Trainium 自研 AI 芯片的现有与新一代产品，形成 AWS 对抗微软-OpenAI 联盟的核心护城河。',
    source: 'CNBC / EET电子工程专辑',
    sourceUrl: 'https://www.eet-china.com/news/202604217568.html',
    date: '2026-04-21',
    tags: ['Anthropic', 'AWS', 'Trainium', '千亿投资'],
    importance: '重磅',
    category: '行业投资'
  },
  {
    id: 18,
    title: '群核科技港交所上市，「全球空间智能第一股」首日大涨 171%',
    summary:
      '4 月 17 日，杭州群核科技（Manycore Tech，00068.HK）正式在港交所挂牌，成为「全球空间智能第一股」及「杭州六小龙」首家上市企业。开盘大涨 171.65% 至 20.70 港元，午盘涨 135.96%，总市值约 305 亿港元。结合同期腾讯/阿里世界模型发布，空间智能迎来 ChatGPT 时刻。',
    source: '新浪财经 / 搜狐',
    sourceUrl: 'https://finance.sina.com.cn/roll/2026-04-17/doc-inhuuptn1137695.shtml',
    date: '2026-04-17',
    tags: ['群核科技', 'IPO', '空间智能', '杭州六小龙'],
    importance: '重要',
    category: '行业投资'
  },
  {
    id: 19,
    title: '国家统计局：我国日均 Token 调用量突破 140 万亿，较去年末增长超 40%',
    summary:
      '4 月 16 日国新办发布会披露：截至 2026 年 3 月，我国日均词元（Token）调用量突破 140 万亿，比 2025 年末增长超过 40%。人工智能商业化、规模化运营取得阶段性突破，AI 赋能千行百业，是本轮云厂商算力涨价的核心驱动因素之一。',
    source: '国家统计局 / 腾讯新闻',
    sourceUrl: 'https://news.qq.com/rain/a/20260418A04XH700',
    date: '2026-04-16',
    tags: ['Token', '国家统计局', '行业数据'],
    importance: '重要',
    category: '行业投资'
  },
  // --- 4.22-4.24 ---
  {
    id: 20,
    title: 'OpenAI GPT-5.5 集成 GB300 推出原生 3D 游戏生成能力',
    summary:
      '4 月 24 日 OpenAI 宣布 GPT-5.5 Omni 正式集成 GB300（Game Brain 300）游戏推理引擎，支持通过自然语言描述直接生成可交互的 3D 游戏场景与逻辑。用户可用文字生成完整游戏关卡、NPC 行为树及物理交互规则，标志着 AI 从"对话/创作"向"实时互动娱乐"跨越。',
    source: 'OpenAI / The Verge',
    sourceUrl: 'https://openai.com/blog',
    date: '2026-04-24',
    tags: ['GPT-5.5', 'GB300', '3D游戏', '多模态'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 21,
    title: '谷歌 Gemini 语音合成逼真度突破，TPU v8 芯片正式曝光挑战英伟达',
    summary:
      '4 月 23 日谷歌 I/O Connect 前瞻会披露：Gemini 实时语音合成已达到"无法与人声区分"级别，延迟降至 200ms 以内。同期谷歌首次公开 TPU v8 芯片细节——FP4 算力达 H100 的 3.2 倍，能效比提升 250%，目标 2026 Q4 规模部署。AI 芯片竞争进入白热化阶段。',
    source: 'Google Cloud / TechCrunch',
    sourceUrl: 'https://blog.google/technology/ai/',
    date: '2026-04-23',
    tags: ['Google', 'Gemini', 'TPU v8', '语音合成', '芯片'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 22,
    title: '快手可灵 4K 视频生成上线，国产视频模型进入超清时代',
    summary:
      '4 月 24 日快手可灵（Kling）官方宣布 4K 超高清视频生成能力正式开放 API，单次生成最长 120 秒、4096×2160 分辨率视频。可灵 4K 在人物一致性、物理模拟等维度对标 Sora，价格仅为海外同类产品的 1/5。国内 AI 视频赛道形成字节 Seedance / 阿里 HappyHorse / 快手可灵三足鼎立格局。',
    source: '快手 / IT之家',
    sourceUrl: 'https://klingai.kuaishou.com',
    date: '2026-04-24',
    tags: ['快手', '可灵', '4K', '视频生成'],
    importance: '重要',
    category: '国产模型'
  },
  {
    id: 23,
    title: '腾讯混元开源 SSL-R1 免标视觉学习框架，降低视觉大模型训练门槛 90%',
    summary:
      '4 月 24 日腾讯混元团队开源 SSL-R1（Self-Supervised Representation Learning v1），这是一种免标注视觉预训练框架。SSL-R1 在 ImageNet 上仅用 10% 标注数据即可达到全监督 98% 精度，大幅降低 CV 大模型的标注成本。结合此前 HY-World 2.0 世界模型，腾讯混元在开源生态持续发力。',
    source: 'GitHub / 腾讯混元',
    sourceUrl: 'https://github.com/Tencent/HunYuan',
    date: '2026-04-24',
    tags: ['腾讯', '混元', 'SSL-R1', '开源', '视觉学习'],
    importance: '重要',
    category: '国产模型'
  },
  {
    id: 24,
    title: '阿里 Wan-Image 超清图像渲染引擎发布，文生图质量逼近 Midjourney',
    summary:
      '4 月 24 日阿里 ATH 事业群发布 Wan-Image 图像渲染引擎，主打超高清（最高 8K）图像生成与精细编辑。Wan-Image 在文生图基准测试中综合评分超越 DALL-E 3 和 Stable Diffusion 3，逼近 Midjourney 水平，并将集成至通义 App 和阿里云百炼平台。',
    source: '阿里通义 / 36氪',
    sourceUrl: 'https://tongyi.aliyun.com',
    date: '2026-04-24',
    tags: ['阿里', 'Wan-Image', '文生图', '渲染'],
    importance: '重要',
    category: '国产模型'
  },
  {
    id: 25,
    title: 'OpenAI 推出医疗版 ChatGPT 对话助手，FDA 认证路径启动',
    summary:
      '4 月 23 日 OpenAI 发布 ChatGPT Medical Edition，专攻临床问诊、病历分析和用药推荐场景。该版本已在 5 家美国顶级医院完成试点，准确率较通用版提升 40%。OpenAI 同步启动 FDA 医疗器械认证流程，若获批准将成为首个通过 FDA 认证的 AI 对话产品。',
    source: 'OpenAI / CNBC',
    sourceUrl: 'https://openai.com/healthcare',
    date: '2026-04-23',
    tags: ['OpenAI', 'ChatGPT', '医疗', 'FDA'],
    importance: '重磅',
    category: '行业投资'
  },
  {
    id: 26,
    title: 'Kimi 支持智能体协作模式，月之暗面推进 Agent 生态建设',
    summary:
      '4 月 23日月之暗面宣布 Kimi 2.5 正式支持 Multi-Agent 协作模式，允许多个 Kimi Agent 分工完成复杂任务（如并行调研+汇总报告）。同步推出 Kimi Agent Builder 低代码开发平台，开发者无需编码即可创建专属智能体。',
    source: '月之暗面 / 36氪',
    sourceUrl: 'https://platform.moonshot.cn',
    date: '2026-04-23',
    tags: ['Kimi', 'Agent', '智能体协作', '月之暗面'],
    importance: '重要',
    category: 'Agent 生态'
  },
  {
    id: 27,
    title: 'Chrome 浏览器集成 Gemini 自动办公，谷歌 AI 渗透桌面端',
    summary:
      '4 月 23 日谷歌 Chrome 团队宣布内置 Gemini AI 助手正式上线，支持一键总结网页、自动填写表单、生成邮件/文档、翻译实时字幕等功能。这是继微软 Copilot 集成 Edge 后，浏览器端 AI 助手的又一次重要升级，谷歌借 Chrome 27 亿月活用户快速推广 Gemini。',
    source: 'Google Blog / The Verge',
    sourceUrl: 'https://blog.chromium.org',
    date: '2026-04-23',
    tags: ['Google', 'Chrome', 'Gemini', '浏览器AI'],
    importance: '重要',
    category: 'Agent 生态'
  },
  {
    id: 28,
    title: 'GPT-Image-2 登顶文生图竞技场，OpenAI 图像生成全面超越竞品',
    summary:
      '4 月 22 日 OpenAI 发布 GPT-Image-2 图像生成模型，在 ArtBench 文生图竞技场登顶第一，综合得分超过 Midjourney V7 和 DALL-E 3。GPT-Image-2 支持文本/草图/参考图混合输入，可生成最高 16K 分辨率图像，并原生支持图层编辑和风格迁移。',
    source: 'OpenAI / Ars Technica',
    sourceUrl: 'https://openai.com/image',
    date: '2026-04-22',
    tags: ['OpenAI', 'GPT-Image-2', '文生图', '图像生成'],
    importance: '重磅',
    category: '模型发布'
  },
  {
    id: 29,
    title: '月之暗面开源万亿参数 Moonshot-1T 模型，全球最大开源大模型诞生',
    summary:
      '4 月 21日月之暗面（Moonshot）正式开源 Moonshot-1T 万亿参数 MoE 架构模型，总参数量达 1.3T，激活参数 32B。该模型在长上下文理解（支持 1000 万 Token）和代码生成方面表现突出，API 价格仅 GPT-5.5 的 1/15，被视为 DeepSeek V4 之后又一开源里程碑。',
    source: '月之暗面 / Hacker News',
    sourceUrl: 'https://github.com/moonshotai',
    date: '2026-04-21',
    tags: ['月之暗面', 'Moonshot-1T', '开源', '万亿参数'],
    importance: '重磅',
    category: '国产模型'
  },
  {
    id: 30,
    title: 'Claude 4.7 重构安全架构增强防御，Anthropic 安全投入翻倍',
    summary:
      '4 月 20 日 Anthropic 发布 Claude 4.7 安全更新，重构整个 Constitutional AI 训练架构，引入多层红队测试和实时输出过滤。同步披露：Anthropic 2026 年安全研究预算增至 5 亿美元（同比翻倍），应对日益复杂的 AI 滥用和越狱攻击。PASTA 攻击等新型威胁已被纳入防御体系。',
    source: 'Anthropic',
    sourceUrl: 'https://www.anthropic.com/news',
    date: '2026-04-20',
    tags: ['Anthropic', 'Claude 4.7', 'AI安全', 'PASTA攻击'],
    importance: '重要',
    category: 'Agent 生态'
  },
  // ======= 历史存量（4.18 及以前） =======
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
  vendor: '阿里云' | '火山引擎' | '华为云' | 'AWS' | '谷歌云' | '腾讯云' | '微软云' | '百度云' | '智谱AI' | 'MiniMax' | 'Kimi' | '科大讯飞' | '商汤科技'
}

export const cloudNews: CloudVendorNews[] = [
  // ======= 本周新增（4.25-5.9） =======
  {
    id: 124,
    vendor: '谷歌云',
    title: 'Google Cloud Next 2026 发布第八代 TPU（8t/8i）+ Gemini Enterprise Agent Platform',
    summary:
      '4 月 22-25 日谷歌在 Cloud Next 2026 大会重磅发布：第八代 TPU 首次拆分为 TPU 8t（训练）和 TPU 8i（推理）两款专用芯片，性能对标 B200；同步推出 Gemini Enterprise Agent Platform 作为 Vertex AI 进化版，整合 Agent 建立/部署/治理/优化全链路。A2A 协议发布，实现多 Agent 跨厂商互通。',
    source: 'Google Cloud / TechNews',
    sourceUrl: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/next-2026/',
    date: '2026-04-25',
    tags: ['TPU 8', 'Gemini Enterprise', 'Agent Platform', 'A2A'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 125,
    vendor: '微软云',
    title: '微软与 OpenAI 重构合作协议：结束独家授权，OpenAI 模型可上架竞品云平台',
    summary:
      '4 月 27 日微软与 OpenAI 联合宣布修订合作协议：OpenAI 模型不再独家绑定 Azure，可上架 AWS、谷歌云等竞品；收入分成设 2030 年到期日；微软仍持 27% 股权、仍为首选云合作方。此举打破云 AI 独占格局，AWS/谷歌云有望直接上架 GPT-5.5 等模型，云 AI 市场竞争进入新阶段。',
    source: 'Microsoft Blog / CNBC',
    sourceUrl: 'https://blogs.microsoft.com/blog/2026/04/27/the-next-phase-of-the-microsoft-openai-partnership/',
    date: '2026-04-27',
    tags: ['微软', 'OpenAI', '非独家', '合作重组'],
    importance: '重磅',
    category: '市场表现'
  },
  {
    id: 126,
    vendor: '微软云',
    title: 'Microsoft Agent 365 正式商用（GA），企业级 AI Agent 治理产品化',
    summary:
      '5 月 2 日微软宣布 Agent 365 正式上线（GA），为企业 AI Agent 提供身份验证、安全治理、权限控制和审计全套工具。深度集成 Copilot Studio 和 Azure OpenAI Service，支持跨部门多 Agent 编排、统一生命周期管理。面向 Microsoft 365 E5 企业客户开放，定价含于现有订阅。',
    source: 'Microsoft / AI Tools Recap',
    sourceUrl: 'https://www.microsoft.com/en-us/microsoft-365',
    date: '2026-05-02',
    tags: ['Agent 365', '企业治理', 'Copilot Studio'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 127,
    vendor: '谷歌云',
    title: 'Gemini 3.1 Ultra 发布，上下文窗口突破 200 万 Token，Vertex AI 全面开放',
    summary:
      'Google DeepMind 5 月初正式发布 Gemini 3.1 Ultra，上下文窗口提升至 200 万 Token（当前商用最长），原生支持文本/图像/音频/视频无中介处理。谷歌云 Vertex AI 同步全面开放 Gemini 3.1 Ultra API，附带沙盒化代码执行工具。定价按输入/输出 Token 分计，Flash-Lite 版低至 $0.25/百万 Token。',
    source: 'Google DeepMind / Google Cloud',
    sourceUrl: 'https://deepmind.google/',
    date: '2026-05-01',
    tags: ['Gemini 3.1', '200万Token', 'Vertex AI'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 128,
    vendor: '阿里云',
    title: '阿里云百炼 HappyHorse 视频 API 正式开放邀测，首轮企业客户接入',
    summary:
      '4 月 27 日阿里云百炼平台如期开放 HappyHorse-1.0 视频生成 API 企业级邀测。首批接入企业涵盖短视频、电商、游戏三大行业，单次最长生成 60 秒视频，按 Token 消耗计费。百炼同步上线视频专用资源池，支持多区域部署。HappyHorse 商用版预计 5 月中旬推出正式版定价。',
    source: '阿里云百炼 / IT之家',
    sourceUrl: 'https://bailian.console.aliyun.com',
    date: '2026-04-27',
    tags: ['百炼', 'HappyHorse', '视频API', '正式邀测'],
    importance: '重要',
    category: '产品发布'
  },
  {
    id: 129,
    vendor: '腾讯云',
    title: '腾讯云 5 月 9 日 AI 算力/容器/EMR 涨价正式生效，企业客户批量续约锁价',
    summary:
      '5 月 9 日，腾讯云此前公告的 AI 算力（GPU 云服务器）、容器服务 TKE 原生节点、弹性 MapReduce（EMR）三大类产品统一 5% 涨价正式生效。据了解，涨价生效前最后一周腾讯云企业客户批量完成预留续约锁价，部分大客户通过签署 2-3 年长约获得约 15% 额外折扣。',
    source: '腾讯云官方公告',
    sourceUrl: 'https://cloud.tencent.com/announce',
    date: '2026-05-09',
    tags: ['AI算力', 'TKE', 'EMR', '涨价生效'],
    importance: '重要',
    category: '市场表现'
  },
  // ======= 历史存量（4.18-4.24） =======
  {
    id: 118,
    vendor: '阿里云',
    title: '阿里云百炼平台 4 月 27 日上线 HappyHorse 视频 API，首批开放企业级邀测',
    summary:
      '阿里云百炼 MaaS 平台宣布，4 月 27 日起逐步开放 HappyHorse-1.0 视频生成 API 的企业级邀测。HappyHorse 当前为 Artificial Analysis 视频竞技场榜单第一，预计 5 月推出商用版本。百炼平台同步上线视频生成专用资源池，按 Token 消耗计费。',
    source: '阿里云百炼 / IT之家',
    sourceUrl: 'https://bailian.console.aliyun.com',
    date: '2026-04-20',
    tags: ['百炼', 'HappyHorse', '视频 API', '邀测'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 119,
    vendor: '火山引擎',
    title: '火山引擎 Seedance 2.0 API 全面升级原生 1080P，AI 视频迈入工业化',
    summary:
      '4 月 21 日火山引擎成都 AI 创新巡展上官宣：Seedance 2.0 API 服务新增原生 1080P 全高清视频生成能力，模型可直接在 1080P 分辨率下构建画面，细节密度与光影层次显著提升。企业侧调用量较上线首周环比翻倍。',
    source: '火山引擎官方',
    sourceUrl: 'https://www.volcengine.com',
    date: '2026-04-21',
    tags: ['Seedance 2.0', '1080P', '视频生成'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 120,
    vendor: '腾讯云',
    title: '腾讯混元开源 3D 世界模型 HY-World 2.0，强化空间智能一盘棋',
    summary:
      '4 月 16 日腾讯混元团队开源 3D 世界模型 HY-World 2.0，支持文本/图片/视频多模态输入生成 3D 场景，并原生支持后续导出至游戏引擎。腾讯云 TI 平台同步上线 HY-World 2.0 训练/推理镜像，企业可在腾讯云 GPU 资源池一键部署。',
    source: '腾讯云 / 36氪',
    sourceUrl: 'https://cloud.tencent.com/product/hunyuan',
    date: '2026-04-16',
    tags: ['混元', 'HY-World 2.0', '世界模型', '开源'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 121,
    vendor: 'AWS',
    title: 'AWS 向 Anthropic 追加 250 亿美元投资，锁定十年 1000 亿美元算力长约',
    summary:
      '4 月 21 日 AWS 宣布向 Anthropic 追加最高 250 亿美元投资，Anthropic 承诺未来十年在 AWS（Trainium 为主）投入超过 1,000 亿美元。这是 AWS 对抗 Microsoft-OpenAI 联盟的战略级合作，也将进一步收紧 H100/H200/Trainium 的对外放量节奏。',
    source: 'CNBC',
    sourceUrl: 'https://aws.amazon.com/blogs',
    date: '2026-04-21',
    tags: ['Anthropic', 'Trainium', '战略投资'],
    importance: '重磅',
    category: '市场表现'
  },
  {
    id: 122,
    vendor: '华为云',
    title: '华为昇腾 950PR 芯片与 Atlas 350 加速卡商用放量，单卡算力达 H20 2.87倍',
    summary:
      '华为 3 月发布昇腾 950PR 芯片和 Atlas 350 加速卡，近期开始向 DeepSeek、智谱等头部大模型厂商大规模交付。官方数据显示：Atlas 350 单卡算力约为英伟达 H20 的 2.87 倍，是国内首款支持 FP4 低精度计算的商用推理产品，多模态生成效率提升 60%。',
    source: '腾讯新闻 / EET电子工程专辑',
    sourceUrl: 'https://www.huaweicloud.com',
    date: '2026-04-21',
    tags: ['昇腾 950PR', 'Atlas 350', 'FP4', '国产芯片'],
    importance: '重要',
    category: '产品发布'
  },
  {
    id: 123,
    vendor: '阿里云',
    title: '阿里云发布世界模型 HappyOyster，主打实时交互物理仿真',
    summary:
      '4 月 16 日阿里 ATH 事业群联合阿里云发布实时交互式世界模型 HappyOyster（快乐生蚝），主打物理一致性与低延迟交互，定位与 Meta 的 World Model 路线一致。HappyOyster 将通过阿里云深度集成淘天 3D 商品拍摄、阿里智能体平台等场景。',
    source: '阿里云 / 36氪',
    sourceUrl: 'https://www.aliyun.com',
    date: '2026-04-16',
    tags: ['HappyOyster', '世界模型', 'ATH'],
    importance: '重要',
    category: '产品发布'
  },
  // ======= 历史存量（4.18 及以前） =======
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
  },
  {
    id: 115,
    vendor: '智谱AI',
    title: '智谱 AI 发布 GLM-5.1 旗舰开源模型，Coding Plan 第三次涨价',
    summary:
      '智谱 AI 于 4 月 8 日发布 GLM-5.1 旗舰开源模型，同步调整 GLM Coding Plan 定价：Lite 从 ¥40/月涨至 ¥49/月，Max 涨至 ¥99/月。GLM-5.1 API Input Token 上调 8%，Output Token 上调 12%，并取消首购优惠。',
    source: '智谱 AI / IT时报',
    sourceUrl: 'https://open.bigmodel.cn/pricing',
    date: '2026-04-08',
    tags: ['GLM-5.1', 'Coding Plan', '涨价'],
    importance: '重磅',
    category: '产品发布'
  },
  {
    id: 116,
    vendor: 'MiniMax',
    title: 'MiniMax 2.5 结束公测正式计费，API 价格较公测期上调 15%',
    summary:
      'MiniMax 宣布 MiniMax 2.5 系列模型结束公测期并正式商业计费。Text 模型 API 较公测期上调 15%，Voice 模型上调 12%；同步推出"开发者扶持计划"，月消耗量超 1 亿 Token 的客户可享 9 折返点。',
    source: 'MiniMax 官方',
    sourceUrl: 'https://www.minimaxi.com/pricing',
    date: '2026-03-13',
    tags: ['MiniMax 2.5', 'API', '涨价'],
    importance: '重要',
    category: '产品发布'
  },
  {
    id: 117,
    vendor: 'Kimi',
    title: 'Kimi 2.5 / Kimi 3 系列 API 结束免费公测，正式定价上调 20%',
    summary:
      '月之暗面（Moonshot）宣布 Kimi 2.5 及 Kimi 3 系列模型结束公测免费期，正式开启商业计费。Kimi 2.5 API 价格较此前内测价上调 20%，Kimi 3 长文本模型（支持 200 万上下文）定价为 ¥0.06/千 Token。同步推出"Kimi 开发者联盟"年费套餐。',
    source: '月之暗面 / 36氪',
    sourceUrl: 'https://platform.moonshot.cn/pricing',
    date: '2026-03-13',
    tags: ['Kimi 2.5', 'Kimi 3', '涨价'],
    importance: '重要',
    category: '产品发布'
  }
]

// =============== 全球云厂商涨价动态（2026.04.05 - 2026.04.20 半月内） ===============
export interface PriceChangeItem {
  id: number
  vendor: '阿里云' | '火山引擎' | '华为云' | 'AWS' | '谷歌云' | '腾讯云' | '微软云' | '百度云' | 'OpenAI' | 'Oracle云' | '智谱AI' | 'MiniMax' | 'Kimi' | '科大讯飞' | '商汤科技'
  region: '海外' | '国内'
  title: string
  summary: string
  // 涨价幅度（便于统一展示/排序）
  rangeText: string
  // 生效日期
  effectiveDate: string
  // 涉及产品/服务
  products: string[]
  // 涨价原因
  reason: string
  source: string
  sourceUrl?: string
  date: string
  importance: '重磅' | '重要' | '一般'
}

export const priceChangeNews: PriceChangeItem[] = [
  // ======= 本周新增（4.29-5.9） =======
  // —— 海外云厂商 ——
  {
    id: 216,
    vendor: 'OpenAI',
    region: '海外',
    title: 'OpenAI GPT-Realtime 语音 API 定价公布：推理 + 翻译 + 转录三款模型上线',
    summary:
      '5 月 8 日 OpenAI 正式公布 GPT-Realtime 系列 API 定价：旗舰语音模型 GPT-Realtime-2 音频输入 $32/百万 token、输出 $64/百万 token；实时翻译 GPT-Realtime-Translate $0.034/分钟（约 2 毛人民币）；流式转录 GPT-Realtime-Whisper $0.017/分钟。定价即日起生效，全面开放开发者调用。',
    rangeText: '新定价',
    effectiveDate: '2026-05-08',
    products: ['GPT-Realtime-2', 'GPT-Realtime-Translate', 'GPT-Realtime-Whisper', 'Realtime API'],
    reason: '新品发布配套定价；语音 Agent 场景规模化落地需求',
    source: 'OpenAI / 钛媒体',
    sourceUrl: 'https://platform.openai.com/docs/guides/realtime',
    date: '2026-05-08',
    importance: '重磅'
  },
  {
    id: 217,
    vendor: 'OpenAI',
    region: '海外',
    title: 'GPT-5.5 隐性涨价：标价涨 100%，短 Prompt 实际成本涨幅高达 92%',
    summary:
      '5 月 8 日独立分析显示，GPT-5.5 虽然标价仅翻倍（输入 $2.50→$5.00、输出 $15→$30），但因 completion token 生成机制改变，长 prompt（>10K token）实际涨幅约 49%，短 prompt（<2K token）实际涨幅高达 92%。OpenRouter 数据揭示"相同文本、不同使用模式成本差异超 30%"。',
    rangeText: '+49% ~ +92%（隐性）',
    effectiveDate: '2026-05-08',
    products: ['GPT-5.5', 'GPT-5.5 Pro', 'OpenAI API'],
    reason: '多模态 Token 计费重构；completion 生成机制改变导致实际成本上升',
    source: 'Pasquale Pillitteri / OpenRouter',
    sourceUrl: 'https://pasqualepillitteri.it/zh/news/2109/ai-chengben-shangzhang-claude-opus-gpt-2026',
    date: '2026-05-08',
    importance: '重磅'
  },
  {
    id: 218,
    vendor: '微软云',
    region: '海外',
    title: 'Claude Opus 4.7 隐性涨价：标价不变，分词器改变导致 Token 数增加 32%-45%',
    summary:
      '5 月 8 日独立分析揭示，Anthropic Claude Opus 4.7 虽然声明"每百万 token 价格与 Opus 4.6 相同"，但通过更换分词器，相同文本产生的 token 数增加 32%-45%（官方承认 1.0x-1.35x，OpenRouter 实测上限 1.45x）。中等长度 prompt（10K-25K token）受影响最大，实际成本上涨 12%-27%。',
    rangeText: '+12% ~ +27%（隐性）',
    effectiveDate: '2026-05-08',
    products: ['Claude Opus 4.7', 'Claude API', 'Azure OpenAI Service（Claude）'],
    reason: '分词器（Tokenizer）更换导致相同文本计费 Token 数增加',
    source: 'OpenRouter / Pasquale Pillitteri',
    sourceUrl: 'https://pasqualepillitteri.it/zh/news/2109/ai-chengben-shangzhang-claude-opus-gpt-2026',
    date: '2026-05-08',
    importance: '重磅'
  },
  {
    id: 219,
    vendor: '微软云',
    region: '海外',
    title: 'Mistral Medium 3.5 定价公布：$1.50/M 输入 + $7.50/M 输出，开源权重可自托管',
    summary:
      '4 月 29 日 Mistral AI 发布 128B 稠密模型 Mistral Medium 3.5，同步公布 API 定价：输入 $1.50/百万 token，输出 $7.50/百万 token。采用修改版 MIT 许可开源权重，高收入公司需付费。Le Chat Pro/Team/Enterprise 用户可直接使用，自托管仅需 4 张 GPU。',
    rangeText: '$1.50/M + $7.50/M',
    effectiveDate: '2026-04-29',
    products: ['Mistral Medium 3.5', 'Mistral API', 'Le Chat', 'Vibe'],
    reason: '新品发布定价；开源路线下的商业化探索',
    source: 'Mistral AI',
    sourceUrl: 'https://mistral.ai/pricing',
    date: '2026-04-29',
    importance: '重要'
  },
  // —— 国内云厂商 ——
  {
    id: 220,
    vendor: '火山引擎',
    region: '国内',
    title: '字节豆包 App 测试付费订阅：68/200/500 元三档，3.45 亿月活迈向商业化',
    summary:
      '5 月 4 日字节豆包在 App Store 页面披露付费版本：标准版 68 元/月（年费 688 元）、加强版 200 元/月（年费 2,048 元）、专业版 500 元/月（年费 5,088 元）。官方回应"免费服务继续提供，付费版聚焦 PPT 生成、数据分析等高算力场景"。作为国内 C 端 AI 用户规模第一的应用，此举标志着国内大模型进入"分层收费"时代。',
    rangeText: '68/200/500 元/月',
    effectiveDate: '测试中',
    products: ['豆包 App', '豆包标准版', '豆包加强版', '豆包专业版'],
    reason: '3.45 亿月活算力成本压力；对标 ChatGPT Plus/Pro 商业模式',
    source: '新浪财经 / 虎嗅',
    sourceUrl: 'https://finance.sina.com.cn/wm/2026-05-04/doc-inhwtewm0016011.shtml',
    date: '2026-05-04',
    importance: '重磅'
  },
  {
    id: 221,
    vendor: '腾讯云',
    region: '国内',
    title: '腾讯云 5 月 9 日 AI 算力/TKE/EMR 涨价正式生效，大客户批量续约锁价',
    summary:
      '5 月 9 日，腾讯云此前公告的 AI 算力（GPU 云服务器）、容器服务 TKE 原生节点、弹性 MapReduce（EMR）三大类产品统一 5% 涨价正式生效。据了解，涨价生效前最后一周企业客户批量完成预留续约锁价，部分签署 2-3 年长约的大客户获得约 15% 额外折扣。',
    rangeText: '+5%（生效）',
    effectiveDate: '2026-05-09',
    products: ['AI 算力（GPU 云服务器）', 'TKE 原生节点', 'EMR'],
    reason: '全球 AI 算力需求持续激增；核心硬件供应链成本大幅上涨',
    source: '腾讯云官方公告',
    sourceUrl: 'https://cloud.tencent.com/announce',
    date: '2026-05-09',
    importance: '重要'
  },
  // —— DeepSeek 专项（降价） ——
  {
    id: 222,
    vendor: '智谱AI',
    region: '国内',
    title: 'DeepSeek V4 Pro 限时 2.5 折优惠延长至 5 月 31 日，输入缓存再降至 1/10',
    summary:
      '4 月 28 日 DeepSeek 宣布 V4-Pro 模型 API 2.5 折优惠从 5 月 5 日延长至 5 月 31 日；4 月 26 日深夜全系 API 输入缓存命中价格降至原价的 1/10。叠加优惠后，V4-Pro 输入（缓存命中）仅 0.025 元/百万 token，V4-Flash 缓存命中低至 0.02 元/百万 token，刷新国内最低价。',
    rangeText: '-75%（2.5折）+ 缓存再降 90%',
    effectiveDate: '2026-05-31（优惠截止）',
    products: ['DeepSeek-V4-Pro', 'DeepSeek-V4-Flash', 'DeepSeek API'],
    reason: '开源路线激进定价策略；冲击国内 API 市场份额',
    source: 'DeepSeek 官方 / 新浪财经',
    sourceUrl: 'https://finance.sina.com.cn/tech/roll/2026-04-28/doc-inhvzwqc1673700.shtml',
    date: '2026-04-28',
    importance: '重磅'
  },
  // ======= 历史存量 =======
  // —— 海外云厂商 ——
  {
    id: 201,
    vendor: 'AWS',
    region: '海外',
    title: 'AWS 再次上调 EC2 机器学习容量块价格，P5e 实例时租费涨至 39.80 美元',
    summary:
      '亚马逊云科技 4 月 11 日更新定价页：EC2 Capacity Blocks for ML 核心机型 p5e.48xlarge 时租从 34.61 美元上调至 39.80 美元，涨幅约 15%，是继 1 月后今年第二次上调 AI 算力容量块价格。AWS 同步收紧了 H100/H200 容量块的预留窗口，企业客户预留周期从 1 年延长至 2 年起订。',
    rangeText: '+15%',
    effectiveDate: '2026-04-11',
    products: ['EC2 Capacity Blocks for ML', 'p5e.48xlarge', 'H100/H200 预留'],
    reason: 'H100/H200 GPU 现货紧缺；SemiAnalysis 数据显示 H100 一年期租赁从 1.70 美元/小时飙升至 2.35 美元/小时',
    source: 'AWS 官方定价页 / 财联社',
    sourceUrl: 'https://aws.amazon.com/ec2/capacityblocks/pricing/',
    date: '2026-04-11',
    importance: '重磅'
  },
  {
    id: 202,
    vendor: '微软云',
    region: '海外',
    title: 'Azure OpenAI Service 调价生效：GPT-5.5 / o4 系列 API 单价上调 8%-12%',
    summary:
      '微软 Azure 于 4 月 15 日对 Azure OpenAI Service 的 GPT-5.5、o4-mini、o4 系列模型调价生效：Input Token 上调约 8%，Output Token 上调约 12%，Fine-tuning 训练单价上调 15%。同时取消了此前对新用户的 30 天免费试用额度。',
    rangeText: '+8% ~ +12%',
    effectiveDate: '2026-04-15',
    products: ['Azure OpenAI Service', 'GPT-5.5', 'o4 系列', 'Fine-tuning'],
    reason: '全球企业级 AI Token 消耗量激增；Azure 推理算力持续供不应求',
    source: 'Microsoft Azure Blog',
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/',
    date: '2026-04-15',
    importance: '重磅'
  },
  {
    id: 203,
    vendor: '谷歌云',
    region: '海外',
    title: 'Google Cloud 调整 Vertex AI / TPU 定价，Gemini 3.0 高阶模型提价 10%',
    summary:
      '谷歌云 Cloud Next 大会后于 4 月 16 日起调整 Vertex AI 定价：Gemini 3.0 Pro 的 Output Token 上调约 10%，TPU v5e/v5p 按需价格上调 7%-9%，Veo 3 视频生成 API 定价维持 $0.35/秒不变。谷歌云同步收紧了 TPU 预留折扣力度，1 年期承诺折扣从 55% 降至 45%。',
    rangeText: '+7% ~ +10%',
    effectiveDate: '2026-04-16',
    products: ['Vertex AI', 'Gemini 3.0 Pro', 'TPU v5e/v5p', 'CUD 承诺折扣'],
    reason: '伴随 Gemini 3.0 发布带来的推理需求爆发；TPU 产能释放速度跟不上订单增速',
    source: 'Google Cloud Blog',
    sourceUrl: 'https://cloud.google.com/vertex-ai/pricing',
    date: '2026-04-16',
    importance: '重磅'
  },
  {
    id: 204,
    vendor: 'OpenAI',
    region: '海外',
    title: 'OpenAI 同步上调 API 价格，GPT-5.5 Turbo 变种调价 10%',
    summary:
      'OpenAI 4 月 18 日伴随 GPT-5.5 Omni 发布，对部分旧模型 API 调价：GPT-5 Output Token 上调 10%、GPT-5-mini 上调 6%。官方将此解释为"模型质量升级后的重新定价"，并推出 GPT-5.5 Omni 时宣称比 GPT-5 便宜 35%，但实际上 Omni 计费单位改为"多模态 Token"，综合折算企业客户成本反而增加。',
    rangeText: '+6% ~ +10%（隐性涨价）',
    effectiveDate: '2026-04-18',
    products: ['GPT-5 API', 'GPT-5-mini', 'GPT-5.5 Omni 多模态 Token'],
    reason: '多模态 Token 计费重构，变相提价；企业 API 订阅用户配额收紧',
    source: 'OpenAI Blog',
    sourceUrl: 'https://openai.com/pricing',
    date: '2026-04-18',
    importance: '重要'
  },
  {
    id: 205,
    vendor: 'Oracle云',
    region: '海外',
    title: 'Oracle Cloud OCI GPU 实例价格平均上调 12%',
    summary:
      'Oracle Cloud Infrastructure 于 4 月 10 日调整 GPU 实例定价：配 H100 的 BM.GPU.H100.8 机型按需时租上调 12%，配 B200 的新机型按订阅起售（单月不少于 200 小时）。OCI 同步宣布与 NVIDIA 延长 5 年独家合作，优先保障 B200/GB200 供货。',
    rangeText: '+12%',
    effectiveDate: '2026-04-10',
    products: ['OCI GPU BM 实例', 'H100', 'B200'],
    reason: '锁定 NVIDIA 最新架构芯片，扩大与一线云商的差异化供给',
    source: 'Oracle Cloud',
    sourceUrl: 'https://www.oracle.com/cloud/compute/gpu/',
    date: '2026-04-10',
    importance: '一般'
  },
  // —— 国内云厂商 ——
  {
    id: 206,
    vendor: '腾讯云',
    region: '国内',
    title: '腾讯云混元模型输入价涨 463%，AI 算力/容器/大数据再统一上调 5%',
    summary:
      '腾讯云本轮涨价分两轮：3 月 11 日公告自 3 月 13 日起，腾讯云智能体开发平台调整混元系列模型计费，其中 Tencent HY 2.0 Instruct 输入价格从 0.0008 元/千 tokens 暴涨至 0.004505 元/千 tokens，涨幅高达 463%，为本轮全球云厂商单项涨幅最高；同期 GLM5、MiniMax 2.5、Kimi 2.5 等第三方模型同步上调。4 月 9 日再次发布公告，自 5 月 9 日起，AI 算力、容器服务 TKE 原生节点、弹性 MapReduce（EMR）三大类产品统一上调 5%。',
    rangeText: '+5% ~ +463%',
    effectiveDate: '2026-03-13 / 05-09',
    products: ['混元 HY 2.0 Instruct（Token）', 'AI 算力（GPU 云服务器）', 'TKE 原生节点', 'EMR', 'GLM5/MiniMax/Kimi 代理'],
    reason: '全球 AI 算力需求持续激增；核心硬件供应链成本大幅上涨；混元模型能力升级重新定价',
    source: '腾讯云官方公告 / 新华网',
    sourceUrl: 'https://cloud.tencent.com/announce/detail/2254',
    date: '2026-04-09',
    importance: '重磅'
  },
  {
    id: 207,
    vendor: '阿里云',
    region: '国内',
    title: '阿里云再发调价公告，GPU 算力、对象存储、百炼 API 最高上调 30%',
    summary:
      '继 3 月 18 日首轮涨价后，阿里云 4 月 12 日再发补充公告：GPU 算力（含 A10/A100/H100/H800 实例）按需价格上调 10%-15%；对象存储 OSS 深度归档存储单价上调 20%；百炼平台部分模型 API（Qwen3-Max、Qwen3-VL）单价上调 20%-30%。预留实例折扣力度收紧约 8 个百分点。4 月 15 日再度宣布 DDoS 高防弹性 95 费用上调 50%（7 月 15 日生效）。',
    rangeText: '+2% ~ +50%',
    effectiveDate: '2026-04-20 / 07-15',
    products: ['GPU 云服务器', '对象存储 OSS 归档', '百炼平台 Qwen3-Max / Qwen3-VL', 'DDoS 高防', 'MU 模型服务单元'],
    reason: '首轮涨价后 Q2 GPU 订单仍超负荷；Token 调用增速超产能',
    source: '阿里云官方公告',
    sourceUrl: 'https://help.aliyun.com/',
    date: '2026-04-12',
    importance: '重磅'
  },
  {
    id: 208,
    vendor: '百度云',
    region: '国内',
    title: '百度智能云 AI 算力、文心模型调整，整体上调 5%-30%',
    summary:
      '百度智能云 4 月 7 日发布调整公告，自 5 月 1 日起，AI 算力平台按需计费单价上调 8%-15%；文心 X2 旗舰版 Output Token 单价上调 20%-30%；千帆平台同步调整预置工作流计费规则，部分套餐价格上浮 5%-10%。',
    rangeText: '+5% ~ +30%',
    effectiveDate: '2026-05-01',
    products: ['AI 算力', '文心 X2 旗舰版', '千帆 ModelBuilder'],
    reason: '低价引流周期结束，高性能模型回归正常商业定价；对标 GPT-5.5/Claude 4.7',
    source: '证券日报 / 百度智能云',
    sourceUrl: 'https://cloud.baidu.com',
    date: '2026-04-07',
    importance: '重要'
  },
  {
    id: 209,
    vendor: '火山引擎',
    region: '国内',
    title: '火山引擎调整豆包 Pro 企业版计费，综合单价上调 12%',
    summary:
      '火山引擎 4 月 14 日对豆包 Pro 企业版 API 调价：Input Token 单价上调 8%，Output Token 上调 12%；同时引入"企业 SLA 包年套餐"，相同吞吐量下整包价格较按需便宜约 35%，但承诺期延长至 18 个月起。这是豆包自 2024 年发布以来首次上调价格。',
    rangeText: '+8% ~ +12%',
    effectiveDate: '2026-04-14',
    products: ['豆包 Pro 企业版 API', '企业 SLA 套餐'],
    reason: '国内 Token 调用市占率 46.4%，规模效应下优化价格结构；GPU 供应链压力',
    source: '火山引擎',
    sourceUrl: 'https://www.volcengine.com/pricing',
    date: '2026-04-14',
    importance: '重要'
  },
  {
    id: 210,
    vendor: '华为云',
    region: '国内',
    title: '华为云盘古行业大模型 API 调整计费，整体上调约 8%',
    summary:
      '华为云 4 月 16 日在开发者大会上发布盘古 6.0 同时，更新盘古行业大模型（金融、政务、医药、矿山等 18 个行业版本）的 API 计费：按行业版本平均上调 6%-10%，综合约 8%。昇腾 910D 算力服务单价维持稳定，但预留资源池门槛提高至最低 64 卡起订。',
    rangeText: '+6% ~ +10%',
    effectiveDate: '2026-04-16',
    products: ['盘古行业大模型 API', '昇腾算力预留资源池'],
    reason: '盘古 6.0 能力升级后重新定价；国产算力生态议价权提升',
    source: '华为云',
    sourceUrl: 'https://www.huaweicloud.com/pricing.html',
    date: '2026-04-16',
    importance: '重要'
  },
  {
    id: 211,
    vendor: '智谱AI',
    region: '国内',
    title: '智谱 AI 第三次调价，GLM-5.1 / GLM-Coding 套餐涨价约 10%',
    summary:
      '智谱 AI 于 4 月 8 日发布旗舰开源模型 GLM-5.1 的同时，宣布 GLM Coding Plan 第三次调价：Lite 套餐从 ¥40/月涨至 ¥49/月（+22.5%），Max 套餐涨至 ¥99/月；GLM-5.1 API Input Token 上调 8%，Output Token 上调 12%。同时取消首购优惠及非高峰期 1 倍抵扣福利。',
    rangeText: '+8% ~ +22.5%',
    effectiveDate: '2026-04-08',
    products: ['GLM-5.1 API', 'GLM Coding Plan', 'GLM-5-Turbo'],
    reason: '模型能力升级后重新定价；海外版定价已"直逼"Claude，国内跟进',
    source: '智谱 AI / IT时报',
    sourceUrl: 'https://open.bigmodel.cn/pricing',
    date: '2026-04-08',
    importance: '重磅'
  },
  {
    id: 212,
    vendor: 'MiniMax',
    region: '国内',
    title: 'MiniMax 2.5 结束公测正式计费，API 价格较公测期上调 15%',
    summary:
      'MiniMax 于 3 月 13 日宣布 MiniMax 2.5 系列模型结束公测期并正式商业计费。Text 模型 API 较公测期上调 15%，Voice 模型上调 12%；同步推出"开发者扶持计划"，月消耗量超 1 亿 Token 的客户可享 9 折返点。',
    rangeText: '+12% ~ +15%',
    effectiveDate: '2026-03-13',
    products: ['MiniMax 2.5 Text API', 'MiniMax 2.5 Voice API', '开发者扶持计划'],
    reason: '公测期补贴结束，正式商业定价；算力成本持续攀升',
    source: 'MiniMax 官方',
    sourceUrl: 'https://www.minimaxi.com/pricing',
    date: '2026-03-13',
    importance: '重要'
  },
  {
    id: 213,
    vendor: 'Kimi',
    region: '国内',
    title: 'Kimi 2.5 / Kimi 3 系列 API 结束免费公测，正式定价上调 20%',
    summary:
      '月之暗面（Moonshot）于 3 月 13 日宣布 Kimi 2.5 及 Kimi 3 系列模型结束公测免费期，正式开启商业计费。Kimi 2.5 API 价格较此前内测价上调 20%，Kimi 3 长文本模型（支持 200 万上下文）定价为 ¥0.06/千 Token，处于国内第一梯队。同步推出"Kimi 开发者联盟"年费套餐。',
    rangeText: '+20%',
    effectiveDate: '2026-03-13',
    products: ['Kimi 2.5 API', 'Kimi 3 API', 'Kimi 开发者联盟'],
    reason: '长文本技术领先，结束补贴期回归商业定价；200 万上下文算力成本极高',
    source: '月之暗面 / 36氪',
    sourceUrl: 'https://platform.moonshot.cn/pricing',
    date: '2026-03-13',
    importance: '重要'
  },
  {
    id: 214,
    vendor: '科大讯飞',
    region: '国内',
    title: '科大讯飞智算平台算力服务价格上调 8%',
    summary:
      '科大讯飞 3 月底宣布讯飞智算平台算力服务价格整体上调 8%，覆盖星火大模型 API 及智算中心租赁服务。此次调价主要受国产算力芯片供应紧张及 AI 训练需求激增影响，为科大讯飞年内首次调价。',
    rangeText: '+8%',
    effectiveDate: '2026-03-31',
    products: ['讯飞智算平台', '星火大模型 API', '智算中心租赁'],
    reason: '国产算力芯片供应紧张；AI 训练需求激增',
    source: '科大讯飞',
    date: '2026-03-31',
    importance: '一般'
  },
  {
    id: 215,
    vendor: '商汤科技',
    region: '国内',
    title: '商汤 SenseCore 大模型推理服务平均涨价 12%',
    summary:
      '商汤科技近期调整 SenseCore 大模型推理服务定价，平均涨幅约 12%。日日新 5.5 系列模型 API 价格上调 10%-15%，同时推出"SenseCore 企业算力包"，承诺 12 个月锁价以换取更长合约周期。',
    rangeText: '平均 +12%',
    effectiveDate: '近期',
    products: ['SenseCore 推理服务', '日日新 5.5 API', '企业算力包'],
    reason: '推理算力成本上升；推动客户签订长约锁价',
    source: '商汤科技',
    date: '2026-04-10',
    importance: '一般'
  }
]

// 涨价策略分析（按维度拆解）
export interface PriceStrategyInsight {
  title: string
  icon: string
  color: string
  points: string[]
}

export const priceStrategyInsights: PriceStrategyInsight[] = [
  {
    title: '行业拐点：20 年降价惯例被打破',
    icon: '📈',
    color: '#ef4444',
    points: [
      '全球云计算延续近 20 年的"只降不升"惯例在 2026 Q1 被系统性打破，AWS 于 1 月率先发难，Azure、谷歌云、OpenAI 和国内头部厂商集体跟进',
      '这是自 AWS 2006 年成立以来首次出现"全球主要云厂商同步上调核心产品价格"，标志云算力从"公共服务"转向"稀缺商品"',
      '本轮涨价覆盖 AI 算力、容器服务、对象存储、模型 API 全产品线，不再是单点调价，而是供需关系重构'
    ]
  },
  {
    title: '隐性涨价成新常态：分词器 + 计费重构',
    icon: '🔍',
    color: '#dc2626',
    points: [
      '5 月 8 日独立分析揭示：GPT-5.5 标价涨 100%，但短 prompt 实际涨幅高达 92%，长 prompt 约 49%——同一模型因使用模式差异成本差超 30%',
      'Claude Opus 4.7"标价不变"却通过更换分词器使相同文本 token 数增加 32%-45%，中等 prompt（10K-25K）实际涨 12%-27%',
      '隐性涨价手段：计费单位改为多模态 Token、分词器更换、completion 机制调整、缓存折扣收紧——单看标价已无法反映真实成本'
    ]
  },
  {
    title: '国内 C 端进入付费时代：豆包打响第一枪',
    icon: '💰',
    color: '#f59e0b',
    points: [
      '5 月 4 日字节豆包（3.45 亿月活）披露 68/200/500 元三档付费订阅，标志国内大模型从"免费引流"正式迈向"分层收费"',
      '付费聚焦 PPT 生成、数据分析等高算力场景——算力成本压力是核心驱动，免费模式难以为继',
      '对标 ChatGPT Plus（$20/月约 145 元），豆包 68 元标准版定价策略为"低价抢占习惯"，预计将引发国内 AI 应用付费潮'
    ]
  },
  {
    title: '驱动因素：Token 爆炸 + GPU 紧缺双重挤压',
    icon: '⚡',
    color: '#6366f1',
    points: [
      '中国日均 Token 调用量从 2024 年初约 1,000 亿飙升至 2026 年 3 月约 140 万亿，两年增长超 1,000 倍',
      'H100 一年期租赁合同价从 2025 年 10 月 1.70 美元/小时涨到 2026 年 3 月 2.35 美元/小时，涨幅近 40%',
      'AI Agent 应用爆发让单任务 Token 消耗达到传统 AI 的 10-100 倍，推动云厂商从"抢客户"转向"抢 Token 定价权"'
    ]
  },
  {
    title: '节奏差异：海外更早更狠，国内跟进更稳',
    icon: '🌍',
    color: '#10b981',
    points: [
      '海外节奏：1 月 AWS → 2 月 Azure → 3 月谷歌云 → 4 月 OpenAI → 5 月隐性涨价波，幅度集中在 8%-15%（隐性可达 92%）',
      '国内节奏：3 月 11 日腾讯云混元 → 3 月 13 日 MiniMax/Kimi → 4 月 9 日腾讯云二次调价 → 5 月 4 日豆包付费订阅 → 5 月 9 日腾讯云涨价生效',
      '例外：DeepSeek V4 Pro 逆势 2.5 折 + 缓存再降 90%，刷新国内最低价（0.025 元/百万 token），开源路线持续搅局'
    ]
  },
  {
    title: '涨价类型：直接提价 + 隐性涨价并存',
    icon: '🧮',
    color: '#8b5cf6',
    points: [
      '直接提价：AWS +15%、Azure +8%~12%、阿里云最高 +50%、腾讯云混元最高 +463%、百度智能云 +5%~30%、智谱AI +22.5%、Kimi +20%、MiniMax +15%、商汤 +12%、科大讯飞 +8%',
      '隐性涨价：GPT-5.5 短 prompt +92%；Claude 4.7 分词器 +32%-45% token；AWS 预留窗口延长至 2 年；谷歌云 CUD 折扣从 55% 降到 45%',
      '订阅化趋势：豆包 68-500 元/月、火山引擎 18 个月 SLA 包年、华为云昇腾最低 64 卡起订——将一次性调价转化为持续性收入'
    ]
  },
  {
    title: '对客户影响：分层明显，中小客户压力最大',
    icon: '🎯',
    color: '#0ea5e9',
    points: [
      '大客户（年支出 1 亿+）：通过多云与战略协议谈判可对冲 60%-80% 涨幅；部分获得"价格锁定 12 个月"条款',
      '中型客户（年支出千万级）：面临 API + 算力双涨叠加，综合云成本上升 15%-25%，需加速自建/半自建策略',
      '中小开发者：免费额度取消、Token 单价上调冲击最大；DeepSeek V4 等开源低价路径成为首选替代',
      '策略建议：利用缓存（Anthropic 缓存 token 90% 折扣）、部署模型路由器、避免 2K-10K token 中等 prompt、控制输出（JSON Schema 约束）'
    ]
  },
  {
    title: '未来走势：价格将持续分化，软硬一体是关键',
    icon: '🔮',
    color: '#a855f7',
    points: [
      '拥有自研芯片的云商（AWS Trainium 3、谷歌 TPU v8、华为昇腾、阿里平头哥）在价格谈判中话语权更强，中期有望"通过自研摊薄涨幅"',
      '纯依赖 NVIDIA GPU 的二线云商将承受最大涨价压力，预计 2026 H2 会出现一轮"二线云商退出高端算力市场"的洗牌',
      '开源模型 + 推理专用芯片（Groq、Cerebras、Etched Sohu）将成为成本最优解，可能促使云商在 2026 年底推出"免费基础模型 + 算力捆绑"反制策略',
      '预计 2026 Q3 海外还将出现一轮 5%-10% 跟进涨价；国内将在豆包付费测试后引发通义/文心/Kimi 等跟进'
    ]
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
  百度云: { color: '#1e40af', bg: '#eef2ff', icon: '🐻' },
  OpenAI: { color: '#10a37f', bg: '#ecfdf5', icon: '🤖' },
  Oracle云: { color: '#c74634', bg: '#fef2f2', icon: '🟥' },
  智谱AI: { color: '#3b82f6', bg: '#eff6ff', icon: '🔷' },
  MiniMax: { color: '#8b5cf6', bg: '#f3e8ff', icon: '💜' },
  Kimi: { color: '#10b981', bg: '#ecfdf5', icon: '🌙' },
  科大讯飞: { color: '#f97316', bg: '#fff7ed', icon: '🎙️' },
  商汤科技: { color: '#06b6d4', bg: '#ecfeff', icon: '👁️' }
}

// 重要性配置
export const importanceConfig = {
  重磅: { color: '#ef4444', bg: '#fef2f2', icon: '🔥' },
  重要: { color: '#f59e0b', bg: '#fff7ed', icon: '⭐' },
  一般: { color: '#6b7280', bg: '#f9fafb', icon: '📌' }
}
