// 售卖弹药 · AI 产品报价知识库
// 整合所有 AI 相关产品（大模型 / MaaS / SaaS / 智能体平台 / AI 基础能力）的报价信息
// 每个产品卡片包含：官方介绍、产品定义、售卖策略、内部报价资料（腾讯文档链接）

export interface OfficialLink {
  label: string
  url: string
}

export interface PricingDoc {
  name: string // 报价文档标题
  url: string // 腾讯文档 / 企微文档链接（用户点击外跳）；若为待补充占位条目，url 为空字符串
  type: '报价表' | '折扣政策' | '销售策略' | '成本资料' | '套餐说明' | '调价通知' | '其他'
  updatedAt?: string
  owner?: string // 文档 owner
  restricted?: boolean // 是否内部受限
  placeholder?: boolean // true = 该条目仅为目录占位，尚未绑定真实文档链接，前端应渲染为「待 BD 补充」并禁用点击
}

export interface AmmoProduct {
  id: number
  productName: string // 产品名称
  productCode?: string // 产品代号 / 简称
  category: 'AI 大模型' | '智能体平台' | 'AI SaaS 应用' | 'AI 基础能力' | 'AI 平台 (MaaS/PaaS)' | 'AI 算力 (GPU/HCC)' // 对标腾讯云官网 AI 产品分类
  subCategory?: string // 细分子类（如：大模型服务、语音、视觉、数字人、内容安全等）
  tag?: string // 状态标签：新品 / 主推 / 战略 / 热门
  priority: '高' | '中' | '低'
  logo: string
  oneLiner: string // 一句话定位

  // —— 官方介绍 ——（取自腾讯云官网）
  officialDesc: string // 官方介绍（简述，1-2 段）
  officialLinks: OfficialLink[] // 官方产品链接 / 文档

  // —— 产品介绍和定义 ——
  definition: string // 产品定义（markdown，回答"是什么"）
  capabilities: string[] // 核心能力清单
  architecture?: string // 产品架构（可选）

  // —— 售卖策略 ——
  strategy: {
    positioning: string // 市场定位 / 主打客群
    pricingModel: string // 计费模式
    priceAnchor: string // 价格锚点（起步价 / 套餐价）
    discountPolicy: string // 折扣政策
    comboStrategy?: string // 联卖 / 组合策略
    keyScenes: string[] // 重点场景
    battleCard?: string[] // 竞争话术要点
  }

  // —— 内部报价资料 ——（只展示入口，不在站内解析）
  pricingDocs: PricingDoc[]

  contact: string // 产品 BD / 接口人
  lastUpdate: string
}

export const salesGuideData: AmmoProduct[] = [
  // ============================================================
  // 1. 混元大模型
  // ============================================================
  {
    id: 1,
    productName: '腾讯混元大模型',
    productCode: 'Tencent Hunyuan',
    category: 'AI 大模型',
    subCategory: '通用大模型 / 多模态',
    tag: '战略',
    priority: '高',
    logo: '🧠',
    oneLiner: '腾讯自研通用大模型家族，覆盖文本 / 图像 / 视频 / 3D 全模态，MoE 架构国产旗舰',
    officialDesc: `腾讯混元大模型是由腾讯全链路自研的万亿级参数通用大模型，采用 MoE（混合专家）架构，具备强大的中文创作、逻辑推理、多轮对话、多模态理解与生成能力。产品矩阵包括：混元 Turbo / Lite / Standard / Pro / T1 等文本模型，混元文生图、混元文生视频、混元 3D 等多模态模型，覆盖对话、创作、代码、推理、内容生成等典型场景，并通过腾讯云 TokenHub、云智能体开发平台（ADP）对外提供 API 与企业级能力。`,
    officialLinks: [
      { label: '混元大模型官网', url: 'https://cloud.tencent.com/product/hunyuan' },
      { label: '混元大模型开发文档', url: 'https://cloud.tencent.com/document/product/1729' },
      { label: '混元大模型 API 调用说明', url: 'https://cloud.tencent.com/document/product/1729/97732' },
      { label: '混元文生图', url: 'https://cloud.tencent.com/product/hunyuan-image' },
      { label: '混元文生视频', url: 'https://cloud.tencent.com/product/hunyuan-video' },
      { label: '混元 3D', url: 'https://cloud.tencent.com/product/hunyuan3d' }
    ],
    definition: `## 一、产品定义
**腾讯混元大模型（Tencent Hunyuan）** 是腾讯自研的通用大语言模型家族，基于 **MoE 混合专家架构** 训练，参数规模达 **万亿级**，是腾讯 AI 战略的**底层模型底座**，支撑腾讯所有 To B / To C / 内部产品的 AI 能力。

## 二、产品矩阵（2026 年版）
- **文本模型**：混元 Turbo（旗舰）/ Pro / Standard / Lite / T1（推理增强）
- **多模态**：混元文生图（HY-Image V3.0）、混元文生视频（HY-Video 1.5 / 2.0）、混元 3D（HY-3D 3.0 / 3.1）
- **专项模型**：混元 Code（代码）、混元 Role（角色扮演）、混元 Instruct（指令）、混元 Think（深度思考）
- **行业模型**：金融 / 医疗 / 政务 / 教育 / 传媒 / 文旅 等 10 + 行业精调版本

## 三、核心定位
在腾讯 **Agent 产品全景图** 中，混元大模型是"第零层 - 模型底座"，向上通过 **TokenHub** 输出 API、通过 **ADP（云智能体开发平台）** 输出 Agent 构建能力、通过 **ClawPro / CodeBuddy / WorkBuddy** 输出场景化应用。`,
    capabilities: [
      '通用文本生成：对话、创作、改写、翻译、总结，中文效果国产 TOP 水平',
      '复杂推理：混元 T1 在数学、代码、逻辑推理等 Benchmark 领先',
      '多模态理解与生成：文 + 图 + 视频 + 3D 全模态一站式',
      '超长上下文：支持 256K tokens，可处理长文档、长对话场景',
      '行业精调：金融 / 医疗 / 政务 / 教育等 10+ 行业精调模型',
      'Agent 原生能力：Function Calling、Tool Use、Multi-Agent 协同',
      '信创合规：国产自主可控，数据不出境，过等保三级',
      'RAG 增强：联网搜索 API + 向量检索，降低幻觉'
    ],
    architecture: 'MoE 混合专家架构 · 万亿级参数 · 256K 超长上下文 · 全模态一体化训练',
    strategy: {
      positioning: '国产旗舰通用大模型，面向信创合规强需求客户（金融 / 政务 / 央国企）+ 追求中文效果与性价比的互联网 / 企业客户',
      pricingModel: 'API 按 Token 计费（输入 / 输出分别计费）+ 月度套餐订阅（走 TokenHub Token Plan）+ 企业专属部署（一事一议）',
      priceAnchor: '混元 Lite 输入 0.001 元/千 tokens，输出 0.002 元/千 tokens；混元 Turbo 输入 0.015 元/千 tokens，输出 0.06 元/千 tokens（远低于 GPT-4 Turbo）',
      discountPolicy: '新客户赠送百万 Tokens 体验额度；年付 8 折；千万级 Token 采购可申请战略折扣；通过 TokenHub Token Plan 订阅比按量便宜 50%+',
      comboStrategy: '标准联卖："混元模型底座 + TokenHub（Token 锁价层）+ ClawPro（管控层）+ CodeBuddy/WorkBuddy（场景应用）" 四件套，集团级 AI 成本可预测、可管控、可审计',
      keyScenes: [
        '企业智能客服 / 智能问答（替代传统 NLP 方案）',
        '内容创作辅助（传媒 / 营销 / 电商文案）',
        '代码辅助（配合 CodeBuddy）',
        '多模态营销素材生成（文生图 / 文生视频）',
        '金融 / 政务等合规强需求场景（信创合规）',
        '长文档分析与知识问答（RAG 场景）'
      ],
      battleCard: [
        '对标 GPT-4 / Claude：中文效果领先、价格低 60%+、数据不出境',
        '对标 阿里通义千问 / 百度文心：MoE 架构更先进、多模态矩阵更全、腾讯生态协同优势',
        '对标 DeepSeek / Kimi：行业精调版本更全、企业级合规资质完整、服务 SLA 更强'
      ]
    },
    pricingDocs: [
      {
        name: '【官方】混元大模型购买指南与价格总览',
        url: 'https://cloud.tencent.com/document/product/1729/97731',
        type: '报价表',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【官方】混元大模型产品定价',
        url: 'https://cloud.tencent.com/document/product/1729/97731',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【待补充】混元大模型报价一览表（2026 Q2）',
        url: '',
        type: '报价表',
        owner: 'AI 产品部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】混元大模型战略客户折扣政策（2026 版）',
        url: '',
        type: '折扣政策',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】混元 vs GPT-4 / Claude / 通义 竞品价格对标',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】混元大模型成本结构与底价线',
        url: '',
        type: '成本资料',
        owner: '财经 BP',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】混元行业精调版报价（金融 / 政务 / 医疗）',
        url: '',
        type: '报价表',
        owner: '行业 BD',
        restricted: true,
        placeholder: true
      }
    ],
    contact: 'hunyuan-bd',
    lastUpdate: '2026-04-20'
  },

  // ============================================================
  // 2. TokenHub（原 MaaS 升级版）
  // ============================================================
  {
    id: 2,
    productName: '腾讯云 TokenHub',
    productCode: 'TokenHub（原 MaaS）',
    category: 'AI 大模型',
    subCategory: '大模型服务平台 / MaaS',
    tag: '主推',
    priority: '高',
    logo: '🔌',
    oneLiner: '一套 API 调所有大模型，Token Plan 月度订阅比直连省 50%+',
    officialDesc: `大模型服务平台 TokenHub（Tencent Cloud Model as a Service）是腾讯云推出的 AI 服务聚合平台，聚合混元、DeepSeek、Kimi、MiniMax、GLM 等 20+ 主流国产大模型，同时兼容 OpenAI 与 Anthropic 两大协议，提供统一 API、Token Plan 月度订阅、多 Key 精细管控、Auto 智能路由、TPM 限速、实时监控大盘等企业级能力，是腾讯 Agent 全景图"第一层模型底座"的核心基础设施，于 2026 年 3 月 27 日腾讯云上海城市峰会正式发布。`,
    officialLinks: [
      { label: 'TokenHub 官方产品页', url: 'https://cloud.tencent.com/product/tokenhub' },
      { label: 'TokenHub 产品文档', url: 'https://cloud.tencent.com/document/product/1823' },
      { label: 'Token Plan 套餐概览', url: 'https://cloud.tencent.com/document/product/1823/130060' },
      { label: 'TokenHub 快速入门（企业版）', url: 'https://cloud.tencent.com/document/product/1823/130660' },
      { label: 'TokenHub API 使用说明', url: 'https://cloud.tencent.com/document/product/1823/130078' },
      { label: 'Token Plan 购买页', url: 'https://console.cloud.tencent.com/tokenhub/tokenplan' }
    ],
    definition: `## 一、产品定义
**TokenHub（原 MaaS 升级版）** 是腾讯云大模型服务聚合平台，定位为 **"Agent 时代的模型调度中枢"**。向下承接混元、DeepSeek、MiniMax、Kimi、GLM 等主流国产大模型（含腾讯自研 + 第三方），向上为 ClawPro、CodeBuddy、WorkBuddy、OpenClaw、ADP 等 Agent 产品线提供统一模型调用能力。

## 二、产品架构
- **多模型聚合层**：聚合 20+ 主流大模型（文本 / 图像 / 视频 / 3D 全模态），统一模型 ID
- **协议兼容层**：**同时兼容 OpenAI 与 Anthropic 两大协议**，仅替换 base_url 即可迁移
- **智能路由（Auto 模型）**：算法自动匹配最优模型，用户无需手动选择
- **Token Plan 计费层**：积分制 + 月度预算订阅（100 积分 = 1 元），类似"话费套餐"
- **精细管控层**：多 API Key、独占额度 / 共享池、TPM 限速、实时监控大盘
- **接入层**：境内境外主备双接入地址（.com / .cn），金融级容灾

## 三、核心定位
"Token 即货币，Agent 即员工" —— 让企业像管理话费一样管理 AI 支出，从按次调用升级为统一套餐计费。`,
    capabilities: [
      '一套 API 调所有模型：混元 / DeepSeek / MiniMax / Kimi / GLM 等 20+ 模型统一接入',
      '双协议兼容：同时支持 OpenAI 和 Anthropic 协议，现有应用仅改 base_url 即可迁移',
      'Token Plan 月度订阅：个人 39 元起、企业 5000 元起，比直连大模型节省 50%+',
      'Auto 智能路由：自动匹配最优模型，开发者无需手动选型',
      '企业级管控：多 API Key、独占额度 / 共享池、TPM 限速、实时监控大盘',
      '全模态覆盖：文本、图像、视频、3D 四大类生成模型一站式接入',
      '工具生态广：无缝对接 CodeBuddy / Cursor / Cline / Claude Code / Codex / OpenClaw',
      '主备高可用：境内境外主备双接入地址，金融级容灾'
    ],
    strategy: {
      positioning: '面向 AI 应用开发者 / 企业 AI 平台团队 / AI SaaS 厂商 / 多模型用户，是"一站式 AI Token 采购入口"',
      pricingModel: '积分制 + 月度套餐订阅（100 积分 = 1 元），支持按量付费与套餐订阅双模式',
      priceAnchor: '个人版 Lite 套餐 39 元/月（3500 万 Tokens）；企业版 5000 元/月起（步长 5000 元，最高 20000 元/月）',
      discountPolicy: '个人版 4 档（Lite 39 / Standard 99 / Pro 299 / Max 599），档位越高单价越低；年付享折扣；企业千席位及以上一事一议',
      comboStrategy: '核心联卖：**ClawPro（管控层） + CodeBuddy/WorkBuddy（场景 AI） + TokenHub（Token 锁价层）** 四件套，集团级 AI 成本可预测、可预算、可审计',
      keyScenes: [
        'AI 编程工具接入（Cursor / Cline / CodeBuddy / Claude Code / Codex）',
        'Agent 应用开发（Auto 智能路由，简单任务小模型、关键决策旗舰模型）',
        '多模型灰度切换（一套 API 下线 OpenAI 换成混元/DeepSeek，零代码改造）',
        '企业级多项目管控（独立 API Key + 独占额度 + 共享池兜底）',
        '全模态内容生成（文本 + 图像 + 视频 + 3D 统一入口）',
        '存量 MaaS 客户升级（平滑迁移 + Token Plan 降价）'
      ],
      battleCard: [
        '对标 OpenRouter（海外）：国产模型全、信创合规、价格降 50%+、数据不出境',
        '对标 硅基流动 SiliconFlow：Token Plan 月度订阅独家、双协议兼容、企业管控更完善',
        '对标 火山方舟 / 阿里百炼：同时兼容 OpenAI + Anthropic 协议、工具生态更广',
        '对标 直连各家官方 API：一套代替 N 套、统一账单、整体省 50%+'
      ]
    },
    pricingDocs: [
      {
        name: '【官方】Token Plan 产品介绍 PDF',
        url: 'https://main.qcloudimg.com/raw/document/product/pdf/1823_130657_cn.pdf',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【官方】Token Plan 套餐概览',
        url: 'https://cloud.tencent.com/document/product/1823/130060',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【官方】TokenHub 快速入门（企业版）',
        url: 'https://cloud.tencent.com/document/product/1823/130660',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【待补充】TokenHub 报价总表（2026 Q2）',
        url: '',
        type: '报价表',
        owner: 'TokenHub BD',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】Token Plan 企业版 5000/10000/20000 档位定价明细',
        url: '',
        type: '套餐说明',
        owner: 'TokenHub 产品',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】TokenHub 战略客户折扣申报流程',
        url: '',
        type: '折扣政策',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】TokenHub vs OpenRouter / SiliconFlow / 直连大模型 价格对标表',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】存量 MaaS 客户升级 TokenHub 迁移指引 + 优惠政策',
        url: '',
        type: '销售策略',
        owner: 'TokenHub 产品',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】TokenHub 底价线与毛利核算模型',
        url: '',
        type: '成本资料',
        owner: '财经 BP',
        restricted: true,
        placeholder: true
      }
    ],
    contact: 'tokenhub-bd',
    lastUpdate: '2026-04-20'
  },

  // ============================================================
  // 3. ClawPro
  // ============================================================
  {
    id: 3,
    productName: '腾讯云 ClawPro',
    productCode: 'ClawPro（OpenClaw 企业版）',
    category: '智能体平台',
    subCategory: '企业 AI 智能体管控平台',
    tag: '新品',
    priority: '高',
    logo: '🦞',
    oneLiner: '企业 AI 智能体管控平台，10 分钟给全员配发合规可控的 AI 助手',
    officialDesc: `ClawPro 是腾讯云面向企业推出的一站式 AI 智能体管控平台（OpenClaw 企业版），底层与腾讯轻量云 Lighthouse 同源同构，承接 OpenClaw 百万级用户实战经验，于 2026 年 3 月 15 日启动企业邀测、4 月 2 日正式发布公测。产品帮助企业管理员零代码、分钟级为全员规模化部署安全可控的专属数字助手，用统一的管控台解决"员工用什么模型、消耗多少 Token、数据是否合规、能不能审计"四个核心问题。`,
    officialLinks: [
      { label: 'ClawPro 官方产品文档', url: 'https://cloud.tencent.com/document/product/213/129156' },
      { label: 'ClawPro 管控端介绍', url: 'https://cloud.tencent.com/document/product/213/129158' },
      { label: 'ClawPro 用户端介绍', url: 'https://cloud.tencent.com/document/product/213/129159' },
      { label: 'ClawPro 企业版产品概要（开发者社区）', url: 'https://cloud.tencent.cn/developer/article/2648114' }
    ],
    definition: `## 一、产品定义
**ClawPro（OpenClaw 企业版）** 是腾讯云面向中大型企业的 **一站式 AI 智能体管控平台**，定位为"企业 AI 统一入口 + 成本管控 + 合规审计中心"。

## 二、产品架构
- **管控端（企业管理员）**：成员管理、模型配置、IM 通道配置（企微/QQ/飞书/钉钉）、Skill 库管理、镜像管理、安全组、Token 监控、操作记录、安全审计、一键全员升级
- **用户端（企业员工）**：三步创建个人 AI 助理（取名 → 选模型 → 绑 IM），1 分钟开始对话，在 IM 中直接使用

## 三、核心差异点
- **三级 Token 配额**：企业 → 部门 → 个人，逐级校验、可视化大盘
- **四层纵深防护**：看得见（AI 资产盘点）→ 审得了（全链路审计）→ 管得住（租户级物理隔离 + 随机端口）→ 扫得全（Skill 供应链扫描）
- **CVM Ai2 专属机型**：刊例价仅为标准 CVM 的 **40%**，面向 AI Agent 场景优化
- **开放生态**：不限定模型（混元 / DeepSeek / GLM / Claude / Qwen 等任意接入）、不限定 Agent（默认 OpenClaw，支持自定义镜像）`,
    capabilities: [
      '10 分钟上线：管理员三步（选套餐 - 配模型 - 发链接），员工扫码 1 分钟用上 AI 助手',
      '三级 Token 配额管控（企业 / 部门 / 个人），彻底解决 AI 成本失控',
      '四层纵深安全防护：AI 资产可见、全链路可审计、租户级物理隔离、Skill 供应链扫描',
      '多租户物理隔离 + 端口隐身（10000-40000 随机端口），金融 / 政务级合规',
      'CVM Ai2 专属机型，刊例价仅为标准型 40%，TCO 业内最低',
      '首发四大 IM（企微 / QQ / 飞书 / 钉钉）一键接入',
      '基于 OpenClaw 百万级用户验证，ClawHub 提供 1.3 万+ AI Skills 生态',
      '支持一键全员升级，CVM 重装 + TAT 软件包双通道平滑迭代'
    ],
    strategy: {
      positioning: '面向中大型企业（1000 人以上）、金融 / 政务 / 央国企（强合规）、AI Agent 服务商、预算敏感成长型企业，提供"企业级 AI 统一管控"',
      pricingModel: '席位费 + Token 消耗 +（可选）模型 API 费用',
      priceAnchor: '百元起步，1 席即可开通；CVM Ai2 机型刊例价为标准型 40%',
      discountPolicy: '年付 8 折，千席位以上 7 折，战略客户一事一议；与 CodeBuddy / WorkBuddy / TokenHub 联卖组合优惠；公测首批企业邀测免费体验 30 天',
      comboStrategy: '**四件套标准打法**：ClawPro（管控层） + CodeBuddy（研发 AI） + WorkBuddy（办公 AI） + TokenHub（Token 锁价层），集团级 AI 统一管控，整体 TCO 比分散采购低 40%+',
      keyScenes: [
        '全员 AI 助手部署（企业一次性采购，员工在企微/飞书里@AI 直接用）',
        '成本统一管控（三级 Token 配额 + 实时大盘）',
        '合规审计（等保三级 / 金融级审计）',
        'AI 供应链安全（Skill 上架前扫描）',
        '业务系统联动（邮箱/日历/CRM/GitLab/HR 集成）',
        '对外商业化（AI SaaS 厂商快速搭建自有品牌 AI 助手）',
        '教育教学辅助（按班级/学科分配配额）',
        '知识沉淀（个人 Memory + 团队 COS + 企业 CLS 全文检索）'
      ],
      battleCard: [
        '对标 微软 M365 Copilot：数据不出境 + 信创 + 三级 Token 配额 + 物理隔离 + 价格 50%+',
        '对标 阿里云百炼企业版：与 Lighthouse 同源同构、物理隔离更彻底、IM 生态更广、Skill 供应链扫描独家',
        '对标 字节扣子企业版：三级 Token 配额独家、企业级审计更完善、不锁模型',
        '对标 百度千帆 AgentBuilder：OpenClaw 百万级用户沉淀 + ClawHub Skills 生态',
        '对标 客户自建方案：部署效率 +80%、环境统一率 100%、TCO 最低'
      ]
    },
    pricingDocs: [
      {
        name: '【官方】ClawPro 计费概述',
        url: 'https://cloud.tencent.com/document/product/213/129160',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【官方】ClawPro 管控端介绍',
        url: 'https://cloud.tencent.com/document/product/213/129158',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【乐享】ClawPro 售卖弹药（主文档）',
        url: 'https://csig.lexiangla.com/teams/k100006/docs/50ba2418327511f1993eceb137c2be1e?company_from=csig',
        type: '销售策略',
        owner: 'ClawPro BD',
        updatedAt: '2026-04-20',
        restricted: true
      },
      {
        name: '【待补充】ClawPro 刊例价 + 底价线（2026 Q2）',
        url: '',
        type: '报价表',
        owner: 'ClawPro 产品',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ClawPro 战略客户折扣政策与审批流程',
        url: '',
        type: '折扣政策',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ClawPro + CodeBuddy + WorkBuddy + TokenHub 四件套联卖方案',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ClawPro vs 百炼 / 扣子 / 千帆 竞品价格对标',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ClawPro 金融 / 政务私有化部署报价模型',
        url: '',
        type: '报价表',
        owner: '行业 BD',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】Ai2 机型成本结构与毛利分析',
        url: '',
        type: '成本资料',
        owner: '财经 BP',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】公测邀测期优惠政策与转正方案',
        url: '',
        type: '折扣政策',
        owner: 'ClawPro 产品',
        restricted: true,
        placeholder: true
      }
    ],
    contact: 'clawpro-bd',
    lastUpdate: '2026-04-20'
  },

  // ============================================================
  // 4. GPU 云服务器（AI 算力底座）
  // ============================================================
  {
    id: 4,
    productName: '腾讯云 GPU 云服务器',
    productCode: 'GPU CVM / HCC / HAI',
    category: 'AI 算力 (GPU/HCC)',
    subCategory: 'AI 算力 / GPU 服务器 / 高性能计算集群',
    tag: '主推',
    priority: '高',
    logo: '🎮',
    oneLiner: 'AI 时代的算力底座：覆盖 H20 / L20 / L40S / A100 / V100 / T4 全系 GPU，支撑大模型训练、推理、渲染',
    officialDesc: `腾讯云 GPU 云服务器是为 AI 训练、AI 推理、科学计算、图形渲染、视频编解码等场景专门优化的高性能计算产品家族,包含 GPU CVM(按需 GPU 虚拟机)、HCC 高性能计算集群(大模型训练专用,支持 3.2Tbps RDMA 无阻塞网络)、HAI 高性能应用服务(一键部署 AI 应用)三大形态。型号覆盖 NVIDIA H20 / L20 / L40S / A100 / A10 / V100 / T4 以及国产信创 GPU,支持按量 / 包年包月 / 竞价 / 预留实例多种计费,是承载混元大模型、TokenHub、ClawPro 等 AI 产品的底层算力。`,
    officialLinks: [
      { label: 'GPU 云服务器官网', url: 'https://cloud.tencent.com/product/gpu' },
      { label: 'HCC 高性能计算集群', url: 'https://cloud.tencent.com/product/hccpnv' },
      { label: 'HAI 高性能应用服务', url: 'https://cloud.tencent.com/product/hai' },
      { label: 'GPU 实例规格族文档', url: 'https://cloud.tencent.com/document/product/560/19700' },
      { label: 'GPU 计费方式说明', url: 'https://cloud.tencent.com/document/product/560/8025' },
      { label: 'GPU 价格计算器', url: 'https://buy.cloud.tencent.com/price/gpu' }
    ],
    definition: `## 一、产品定义
**腾讯云 GPU 云服务器** 是 AI 时代企业级算力的核心采购品类,定位为 **"AI 产品全栈的算力底座"** —— 上层所有 AI 产品(混元大模型训练、TokenHub 推理集群、ClawPro Ai2 机型、CodeBuddy / WorkBuddy 后端)的算力消耗都最终落到 GPU 采购上。

## 二、产品矩阵
- **GPU CVM(通用 GPU 虚拟机)**:按需购买、按需释放,适合推理、小规模训练、开发测试
  - 推理卡:T4 / A10 / L4 / L20(中小模型推理、视频编解码)
  - 训练/推理卡:V100 / A100 / L40S / H20(大模型训练、微调、高吞吐推理)
- **HCC 高性能计算集群**:大模型训练专用,**3.2Tbps RDMA 无阻塞网络**,千卡 / 万卡级集群
- **HAI 高性能应用服务**:一键部署 Stable Diffusion / ChatGLM / Llama 等 AI 应用,按分钟计费
- **竞价实例 / 预留实例**:适合容错性强的批量推理、离线训练任务,最高可省 90%

## 三、在 AI 战略中的位置
在腾讯 Agent 产品全景图中,GPU 是 **"第 -1 层 - 物理算力底座"**,向上支撑:
- 混元大模型(训练 + 推理)
- TokenHub(多模型推理集群)
- ClawPro(Ai2 专属机型底层 GPU)
- 客户自建大模型场景(金融 / 政务 / 央国企私有化)`,
    capabilities: [
      '全系 NVIDIA GPU 覆盖:H20 / L40S / L20 / L4 / A100 / A10 / V100 / T4',
      'HCC 高性能计算集群:3.2Tbps RDMA 无阻塞网络,支持千卡/万卡级大模型训练',
      'HAI 极速部署:一键拉起 SD / ChatGLM / Llama 环境,新手 5 分钟用上 AI',
      '多计费模式:按量 / 包年包月 / 竞价实例(省 90%) / 预留实例(1-3 年长约)',
      '裸金属 + 虚拟化双形态,满足最高性能与最佳性价比两种需求',
      '信创 GPU 适配:国产 GPU 整机柜方案,过等保三级',
      '与 TKE / EKS 深度集成,支持 GPU 虚拟化切分、MIG 多实例 GPU',
      '与 COS / CFS / GooseFS 存储深度优化,训练数据吞吐提速 3-10 倍'
    ],
    architecture: 'GPU CVM(按需) + HCC(训练集群,RDMA) + HAI(应用一键部署) · 全系 NVIDIA + 国产信创 GPU',
    strategy: {
      positioning: '面向 AI 训练 / 推理客户(AI Lab、互联网大厂、AI SaaS)、大模型客户(自研 / 微调 / 私有化部署)、视频渲染 / 科学计算客户、金融政务信创客户(国产 GPU)',
      pricingModel: '按量计费(小时级) + 包年包月(1-5 年) + 竞价实例(最高省 90%) + 预留实例(长约锁价) + HCC 整集群一事一议',
      priceAnchor: 'T4 推理卡最低 5 元/小时起;L20 约 18-25 元/小时;H20 / L40S 训练卡约 60-120 元/小时;H20 包年七折 + 万卡 HCC 战略价一事一议',
      discountPolicy: '**五档折扣体系(对齐公司统一折扣政策)**:¥0-1W / 1-10W / 10-100W / 100-500W / 500W+ 分档审批;**高价值客户**(AI 大客户 / 战略客户 / 央国企)可直接走 BD 特价 + 财经 BP 联审;**普通客户**按官方折扣页(包月 88 折 / 年付 7.5 折 / 3 年 5 折);竞价实例额外最高省 90%;预留实例承诺使用量可再降 20-40%',
      comboStrategy: '**AI 算力联卖组合**:① GPU(算力底座) + 混元/TokenHub(上层 API 服务) + COS/CFS(存储) + VPC/CCN(网络) = AI 完整方案;② HCC 集群 + TACO Train 训练加速 + GooseFS 数据湖 = 大模型训练全栈;③ CVM Ai2 机型(ClawPro 专属) 刊例价已是标准 GPU 40%,作为轻量 AI Agent 场景首选',
      keyScenes: [
        '大模型预训练 / 持续预训练(HCC 千卡万卡集群)',
        '大模型微调 / RLHF(A100 / H20 8 卡机型)',
        '大模型推理集群(L20 / L40S / H20 混合部署)',
        'AIGC 内容生成(SD / 文生视频,L4 / L20 批量推理)',
        '自动驾驶模型训练(HCC + 海量视频数据吞吐)',
        '科学计算 / 生物医药(基因测序、分子动力学)',
        '视频编解码与渲染(T4 / A10 视频转码、影视渲染)',
        '信创场景 GPU 替换(国产 GPU 整机柜,金融政务)'
      ],
      battleCard: [
        '对标 阿里云 GPU / 火山引擎 GPU:HCC 集群 RDMA 带宽领先、混元生态独家、Ai2 机型价格优势',
        '对标 华为云 昇腾 / 百度云 昆仑:NVIDIA 生态最全、框架兼容性最好、训练效率最高',
        '对标 GMI Cloud / RunPod 等 AI 新云:企业级 SLA + 合规资质 + 与腾讯云全栈协同',
        '对标 客户自建 IDC:TCO 低 30-50%、免运维、弹性扩容、无资本开支',
        '对标 海外 AWS / GCP GPU:国产 GPU + 数据不出境 + 信创合规 + 价格低 40%+'
      ]
    },
    pricingDocs: [
      {
        name: '【官方】GPU 云服务器计费概述',
        url: 'https://cloud.tencent.com/document/product/560/8025',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【官方】GPU 实例规格族全量列表',
        url: 'https://cloud.tencent.com/document/product/560/19700',
        type: '报价表',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【官方】GPU 价格计算器',
        url: 'https://buy.cloud.tencent.com/price/gpu',
        type: '报价表',
        owner: '官方文档',
        updatedAt: '2026-04'
      },
      {
        name: '【企微文档】GPU 报价 · 折扣 Discount:五档 + 高价值客户 + 普通客户',
        url: 'https://doc.weixin.qq.com/sheet/e3_AYAAwAayAO8CNGmZ7GwP5SsOfYB25?scode=AJEAIQdfAAoOKccIXfAaoAsgb_ADs&tab=0qse9y',
        type: '折扣政策',
        owner: 'GPU 战略客户部',
        updatedAt: '2026-04-20',
        restricted: true
      },
      {
        name: '【待补充】GPU 全系机型报价一览表（H20/L40S/L20/A100/V100/T4）',
        url: '',
        type: '报价表',
        owner: 'GPU 产品中心',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】HCC 高性能计算集群（千卡/万卡）报价与交付方案',
        url: '',
        type: '报价表',
        owner: 'HCC 大客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】GPU 竞价实例 / 预留实例使用场景与折扣组合策略',
        url: '',
        type: '销售策略',
        owner: 'GPU 产品中心',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】GPU vs 阿里云/火山/华为 竞品价格对标（2026 Q2）',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】GPU 底价线 / 毛利模型 / 成本结构（CAPEX + OPEX）',
        url: '',
        type: '成本资料',
        owner: '财经 BP',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】国产信创 GPU 整机柜方案与报价（金融/政务）',
        url: '',
        type: '报价表',
        owner: '信创 BD',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】AI 客户 GPU + 大模型联卖报价模板（组合优惠）',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      }
    ],
    contact: 'gpu-bd',
    lastUpdate: '2026-04-20'
  }
]

// 分类配置 - 对齐腾讯云官网 AI 产品分类
export const salesGuideCategories = [
  { value: 'all', label: '全部产品' },
  { value: 'AI 大模型', label: 'AI 大模型' },
  { value: '智能体平台', label: '智能体平台' },
  { value: 'AI SaaS 应用', label: 'AI SaaS 应用' },
  { value: 'AI 基础能力', label: 'AI 基础能力' },
  { value: 'AI 平台 (MaaS/PaaS)', label: 'AI 平台 (MaaS/PaaS)' },
  { value: 'AI 算力 (GPU/HCC)', label: 'AI 算力 (GPU/HCC)' }
]

// 报价文档类型配置
export const pricingDocTypeConfig: Record<string, { color: string; bg: string }> = {
  报价表: { color: '#c2410c', bg: '#fff7ed' },
  折扣政策: { color: '#b91c1c', bg: '#fee2e2' },
  销售策略: { color: '#6d28d9', bg: '#f3e8ff' },
  成本资料: { color: '#047857', bg: '#d1fae5' },
  套餐说明: { color: '#1d4ed8', bg: '#dbeafe' },
  调价通知: { color: '#dc2626', bg: '#fef2f2' },
  其他: { color: '#64748b', bg: '#f1f5f9' }
}
