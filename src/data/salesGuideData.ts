// TokenHub+GPU+Agent弹药库
// 整合 TokenHub、GPU 云服务器、WorkBuddy、ClawPro、ADP 全线 Agent 产品的报价信息
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
  // 1. TokenHub（原 MaaS 升级版）
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
        name: '【腾讯文档】TokenHub 国内模型报价表',
        url: 'https://doc.weixin.qq.com/sheet/e3_AdIA9wZkAMYCNPO700K5YSe04Wn4d?scode=AJEAIQdfAAojjF5R4nAaoAsgb_ADs&tab=BB08J2',
        type: '报价表',
        owner: 'TokenHub BD',
        updatedAt: '2026-05'
      },
      {
        name: '【腾讯文档】TokenHub 国外模型报价表',
        url: 'https://doc.weixin.qq.com/sheet/e3_AcwAMAbJAPECNG3jounAtT8mDkziO?scode=AJEAIQdfAAoJfJxwaFAaoAsgb_ADs&tab=78ric9',
        type: '报价表',
        owner: 'TokenHub BD',
        updatedAt: '2026-05'
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
  // 2. ClawPro
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
  // 3. GPU 云服务器（AI 算力底座）
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
  },

  // ============================================================
  // 4. WorkBuddy（AI 效率智能体）
  // ============================================================
  {
    id: 5,
    productName: '腾讯云 WorkBuddy',
    productCode: 'WorkBuddy',
    category: '智能体平台',
    subCategory: 'AI 效率智能体 / 办公 AI 助手',
    tag: '主推',
    priority: '高',
    logo: '🤖',
    oneLiner: '国内最受欢迎的 AI 效率智能体，深度集成企微/飞书/钉钉/Slack，让一人拥有整个数字团队',
    officialDesc: `WorkBuddy 是腾讯云面向企业员工推出的 AI 效率智能体产品，帮助员工在日常办公协作中借助 AI 完成行业趋势分析、报告生成、数据整理、会议纪要、知识问答等复杂工作。产品深度集成企微、飞书、钉钉等国内主流协作平台，以及 Slack、Telegram、Discord 等海外平台（国际版），用户通过手机即可便捷操控。国内版已覆盖百万级用户，2026年5月28日于香港正式发布国际版。`,
    officialLinks: [
      { label: 'WorkBuddy 官方产品页', url: 'https://cloud.tencent.com/product/workbuddy' },
      { label: 'WorkBuddy 产品文档', url: 'https://cloud.tencent.com/document/product/workbuddy' },
      { label: 'WorkBuddy 国际版介绍', url: 'https://cloud.tencent.com/product/workbuddy-intl' }
    ],
    definition: `## 一、产品定义
**WorkBuddy** 是腾讯云推出的 **AI 效率智能体**，定位为"企业员工的数字同事"。在办公 IM 中以对话方式完成复杂任务，覆盖从行业趋势分析、竞品研究、报告撰写到数据整理、会议纪要、知识检索的全流程工作。

## 二、产品矩阵
- **WorkBuddy 企业版（国内）**：深度集成企微、飞书、钉钉，面向国内企业客户
- **WorkBuddy 国际版**：深度集成 Slack、Telegram、Discord，面向海外企业客户（2026.05.28 香港发布）
- **WorkBuddy 个人版**：面向个人效率用户，轻量体验

## 三、核心定位
在腾讯 Agent 产品全景图中，WorkBuddy 是 **"场景应用层 - 办公效率"** 的核心产品：
- 底层调用 TokenHub 模型服务
- 由 ClawPro 统一管控 Token 消耗与合规
- 与 CodeBuddy（研发 AI）形成"办公 + 研发"双引擎覆盖`,
    capabilities: [
      '行业趋势分析与研报生成：一句话生成行业分析报告，覆盖竞品、市场、政策',
      '深度集成 IM 协作平台：企微/飞书/钉钉（国内）+ Slack/Telegram/Discord（国际）',
      '多模态内容创作：PPT 生成、文案撰写、数据可视化图表',
      '会议智能助手：实时会议纪要、待办提取、后续跟进提醒',
      '知识问答与 RAG：连接企业内部知识库，精准检索回答',
      '手机端便捷操控：在手机 IM 中直接@使用，随时随地',
      '百万级用户验证：国内版已覆盖百万级企业用户',
      '多语言支持：国际版支持 20+ 语言，全球化部署'
    ],
    architecture: '办公 IM 接入层 + Agent 编排引擎 + TokenHub 模型服务 + 知识库检索 + 工具生态',
    strategy: {
      positioning: '面向中大型企业办公场景（1000+ 人），企业 AI 办公统一入口，与 ClawPro（管控）+ CodeBuddy（研发）形成全员 AI 覆盖三件套',
      pricingModel: '席位费（月/年） + Token 消耗（超出套餐部分按量计费）',
      priceAnchor: '企业版起步 29 元/席/月（含基础 Token 额度）；旗舰版 99 元/席/月（无限量）；千席以上一事一议',
      discountPolicy: '年付 8 折；千席以上 7 折；万席级战略客户一事一议；与 ClawPro/CodeBuddy/TokenHub 联卖组合优惠',
      comboStrategy: '**核心联卖**：WorkBuddy（办公 AI）+ CodeBuddy（研发 AI）+ ClawPro（管控层）+ TokenHub（Token 锁价层）四件套，全员 AI 覆盖，统一管控统一成本',
      keyScenes: [
        '企业全员 AI 办公助手部署（在企微/飞书中@WorkBuddy 即用）',
        '行业研究与竞品分析（一句话出研报）',
        '会议纪要与待办管理（自动提取 Action Items）',
        '数据分析与可视化（连接企业数据源）',
        '知识管理与问答（接入企业知识库 RAG）',
        '海外团队协作（国际版 Slack/Telegram 集成）',
        '销售辅助（客户信息整理、方案生成）',
        'HR/行政辅助（制度问答、流程办理）'
      ],
      battleCard: [
        '对标 微软 M365 Copilot：价格低 70%+、数据不出境、支持国内 IM（企微/飞书/钉钉）',
        '对标 字节 Coze/豆包：百万级用户验证、企业级管控、与 ClawPro 联动',
        '对标 钉钉 AI / 飞书 AI：不锁定平台，同时支持企微+飞书+钉钉+Slack',
        '对标 Notion AI / Jasper AI：深度中文理解、企业级合规、IM 原生体验'
      ]
    },
    pricingDocs: [
      {
        name: '【官方】WorkBuddy 产品定价',
        url: 'https://cloud.tencent.com/document/product/workbuddy/pricing',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-05'
      },
      {
        name: '【待补充】WorkBuddy 企业版报价一览表（2026 Q2）',
        url: '',
        type: '报价表',
        owner: 'WorkBuddy BD',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】WorkBuddy 战略客户折扣政策',
        url: '',
        type: '折扣政策',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】WorkBuddy + ClawPro + CodeBuddy 三件套联卖方案',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】WorkBuddy vs Copilot / 豆包 / 飞书AI 竞品价格对标',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】WorkBuddy 国际版定价与出海策略',
        url: '',
        type: '报价表',
        owner: 'WorkBuddy 产品',
        restricted: true,
        placeholder: true
      }
    ],
    contact: 'workbuddy-bd',
    lastUpdate: '2026-05-28'
  },

  // ============================================================
  // 5. ADP 云智能体开发平台
  // ============================================================
  {
    id: 6,
    productName: '腾讯云 ADP 智能体开发平台',
    productCode: 'ADP（Agent Development Platform）',
    category: '智能体平台',
    subCategory: '智能体开发平台 / Agent Factory',
    tag: '战略',
    priority: '高',
    logo: '🏭',
    oneLiner: '企业级智能体工厂：自然语言一句话生成 Agent 应用，支持 Bot/Flow/Multi-Agent/Claw 四种模式',
    officialDesc: `腾讯云智能体开发平台 ADP（Agent Development Platform）是面向企业和开发者的一站式智能体构建工具，支持 Bot（对话式）、Flow（工作流）、Multi-Agent（多智能体协同）、Claw（代码执行）四种应用模式。提供可视化编排、智能工作台（自然语言建 Agent）、Agent Portal（统一门户）、Agentic RAG（智能检索）、连接器与工具生态等核心能力。与 ClawPro 共同打造"智能体工厂 + 应用商店"闭环，是腾讯 Agent 战略的开发基础设施。`,
    officialLinks: [
      { label: 'ADP 官方产品页', url: 'https://cloud.tencent.com/product/adp' },
      { label: 'ADP 产品文档', url: 'https://cloud.tencent.com/document/product/adp' },
      { label: 'ADP 智能体开发平台控制台', url: 'https://console.cloud.tencent.com/adp' },
      { label: 'ADP Agent Portal 介绍', url: 'https://adp.tencentcloud.com/zh/blog/adp-agent-portal' }
    ],
    definition: `## 一、产品定义
**ADP（Agent Development Platform）** 是腾讯云面向企业的 **一站式智能体开发平台**，定位为"Agent 时代的应用工厂"。让企业无需深厚 AI 背景，通过可视化编排或自然语言即可快速构建、发布、管理企业级 Agent 应用。

## 二、四种应用模式
- **Bot 模式**：对话式智能体，适合客服、知识问答等场景
- **Flow 模式**：工作流编排，适合复杂业务流程自动化
- **Multi-Agent 模式**：多智能体协同，适合跨领域复杂任务
- **Claw 模式（第四种，2026.05新增）**：独立工作空间，自主编写运行代码完成复杂任务

## 三、核心产品能力（2026年最新）
- **智能工作台**：自然语言一句话生成完整工作流和可运行的 Agent 应用
- **Agent Portal**：跨平台智能体统一门户，提供智能路由和可观测治理
- **Agentic RAG**：基于 Agent Loop 框架的智能检索，自主反思、策略切换、多轮迭代
- **连接器与工具**：接入第三方 SaaS/企业系统/生态产品，支持内置与自定义
- **多渠道发布**：官网/企微/飞书/钉钉机器人/API 等

## 四、在腾讯 Agent 战略中的位置
ADP 是 **"第二层 - 应用开发层"**，向下承接 TokenHub 模型服务与 Agent Runtime 运行底座，向上为 ClawPro 管控平台输出智能体应用，与 ClawPro 共同构成"智能体工厂 + 应用商店"闭环。`,
    capabilities: [
      '四种应用模式：Bot / Flow / Multi-Agent / Claw，覆盖从简单问答到复杂代码执行全场景',
      '智能工作台：自然语言一句话生成企业级 Agent 应用，无需编码',
      'Agent Portal：跨平台智能体统一入口、智能路由、可观测治理',
      'Agentic RAG：智能体自主反思 + 策略切换 + 多轮迭代检索',
      'Claw 模式沙箱：独立工作空间，自主编写运行代码（限时免费体验）',
      '连接器与工具生态：接入企业 SaaS / IM / CRM 等系统',
      '多渠道一键发布：官网/企微/飞书/钉钉机器人/API/小程序',
      'Agent Memory 集成：跨会话长期记忆，越用越懂业务',
      'Agent Runtime 底座：含 SandBox/CBS/Bucket/Gateway/Memory 五大组件'
    ],
    architecture: '模型层(TokenHub) + 运行层(Agent Runtime) + 开发层(ADP 四种模式) + 管控层(ClawPro) + 应用层(WorkBuddy/CodeBuddy)',
    strategy: {
      positioning: '面向 AI 应用开发者 / 企业 IT 部门 / ISV（独立软件商） / AI SaaS 创业公司，是"智能体批量生产工厂"',
      pricingModel: 'Agent 调用次数计费 + 模型 Token 消耗 + 专属资源（可选）；专业版/企业版分级',
      priceAnchor: '免费版：每月 1000 次 Agent 调用；专业版 999 元/月起；企业版一事一议；Claw 沙箱限时免费体验',
      discountPolicy: '年付 8 折；企业版千 Agent 以上一事一议；与 ClawPro 联卖组合优惠；ISV 合作伙伴专属折扣',
      comboStrategy: '**核心闭环**：ADP（开发） + ClawPro（管控） + TokenHub（模型服务） + Agent Runtime（运行底座）形成"开发-运行-管控-模型"四位一体的 Agent 产品全景',
      keyScenes: [
        '企业智能客服/知识问答系统（Bot 模式 + RAG）',
        '业务流程自动化（Flow 模式 + 连接器）',
        '多部门协同 Agent（Multi-Agent 模式）',
        '数据分析与报告生成（Claw 模式，自主编码执行）',
        'ISV 快速开发 AI SaaS 应用（ADP 作为开发底座）',
        '企业内部 Agent 门户统一管理（Agent Portal）',
        '金融/政务合规场景 Agent（ClawPro 专有云 + ADP）',
        '海外智能体应用出海（Agent Runtime 全球发布）'
      ],
      battleCard: [
        '对标 字节 Coze：四种应用模式更全（Claw 独家）、企业级管控联动 ClawPro、不锁模型',
        '对标 阿里百炼：智能工作台+自然语言建 Agent、Agent Portal 统一门户独家、Agentic RAG 更先进',
        '对标 百度千帆 AgentBuilder：与 ClawPro "工厂+商店"闭环、Multi-Agent 协同、Agent Runtime 底座完善',
        '对标 Dify / FastGPT（开源）：企业级 SLA + 安全合规 + Agent Portal 统一治理 + 原生多渠道发布',
        '对标 AWS Bedrock Agent / Azure AI Agent Service：国产信创合规 + 价格低 50%+ + IM 生态'
      ]
    },
    pricingDocs: [
      {
        name: '【官方】ADP 智能体开发平台计费说明',
        url: 'https://cloud.tencent.com/document/product/adp/pricing',
        type: '套餐说明',
        owner: '官方文档',
        updatedAt: '2026-05'
      },
      {
        name: '【待补充】ADP 企业版报价一览表（2026 Q2）',
        url: '',
        type: '报价表',
        owner: 'ADP BD',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ADP 战略客户折扣与 ISV 合作政策',
        url: '',
        type: '折扣政策',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ADP + ClawPro + TokenHub 全栈 Agent 联卖方案',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ADP vs Coze / 百炼 / 千帆 / Dify 竞品价格对标',
        url: '',
        type: '销售策略',
        owner: '战略客户部',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】ADP Claw 模式沙箱资源定价与免费额度策略',
        url: '',
        type: '套餐说明',
        owner: 'ADP 产品',
        restricted: true,
        placeholder: true
      },
      {
        name: '【待补充】Agent Runtime 五大组件定价明细',
        url: '',
        type: '报价表',
        owner: 'ADP 产品',
        restricted: true,
        placeholder: true
      }
    ],
    contact: 'adp-bd',
    lastUpdate: '2026-05-28'
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
