// 官网上新数据类型
export interface NewProduct {
  id: number
  name: string                // 产品名称
  category: string            // 分类: AI大模型 / 计算 / 存储 / 数据库 / 网络 / 安全 / 音视频 / 通信 / 其他
  updateType: string          // 类型: 新品发布 / 新功能 / 价格变更 / 版本升级 / 开源 / 规格调整
  date: string                // 发布日期 YYYY-MM-DD
  summary: string             // 一句话简介
  description: string         // 详细介绍
  highlights: string[]        // 核心亮点
  officialUrl: string         // 官网链接
  isHot?: boolean             // 是否重点推荐
  tags?: string[]             // 额外标签
}

export interface WeeklyUpdate {
  weekKey: string             // 周标识 e.g. "2026-W16"
  weekLabel: string           // 周展示 e.g. "本周 · 4月13日-4月19日"
  startDate: string
  endDate: string
  summary: string             // 本周概要
  products: NewProduct[]
}

// 本周 + 往期数据
export const weeklyUpdates: WeeklyUpdate[] = [
  {
    weekKey: '2026-W19',
    weekLabel: '本周 · 4月27日 – 5月9日',
    startDate: '2026-04-27',
    endDate: '2026-05-09',
    summary: '本周腾讯云重磅升级全栈企业级Agent产品能力：首发ClawPro专有云版、ADP智能工作台、Agent Memory/Storage；混元Hy3 preview正式上线官网，天御Token防刷与AI Agent安全中心能力升级。',
    products: [
      {
        id: 301,
        name: 'ClawPro 专有云版',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-04-28',
        summary: '国内首个经百万级用户验证的企业级AI智能体管控平台，面向私有云首发',
        description: 'ClawPro专有云版是腾讯云首发的企业级AI智能体管控平台，依托轻量云Lighthouse大规模生产实践打磨，原生支持OpenClaw、Hermes等多类型Agent框架，兼容企业自有镜像接入。面向金融、政务、能源等对数据安全、合规管控有高要求的行业，与ADP共同打造"智能体工厂+应用商店"闭环。',
        highlights: [
          '国内首个百万级用户验证的企业级Agent管控平台',
          '原生支持 OpenClaw、Hermes 等多类型 Agent 框架',
          '面向私有云，满足金融/政务/能源等行业合规需求',
          '与 ADP 形成"智能体工厂+应用商店"闭环'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: true,
        tags: ['Agent', '私有云', '首发', '重点推荐']
      },
      {
        id: 302,
        name: 'ADP 智能工作台',
        category: 'AI大模型',
        updateType: '新功能',
        date: '2026-04-28',
        summary: '自然语言一句话生成企业级智能体应用，无需编写代码和复杂流程图',
        description: '腾讯云智能体开发平台（ADP）全新上线"智能工作台"，企业员工无需画复杂流程图、无需编写代码，只需用自然语言输入需求指令，平台即可自动解析并生成完整的工作流和可运行的企业级智能体应用。几分钟内即可完成从需求到应用的全流程。',
        highlights: [
          '自然语言输入需求，自动生成工作流',
          '无需编码，几分钟生成可运行应用',
          '面向企业员工，降低智能体开发门槛',
          '支持复杂业务场景的智能体构建'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: true,
        tags: ['Agent', '低代码', '企业级', '重点推荐']
      },
      {
        id: 303,
        name: 'ADP Agent Portal',
        category: 'AI大模型',
        updateType: '新功能',
        date: '2026-04-28',
        summary: '跨平台智能体门户，提供统一入口、智能路由及可观测治理能力',
        description: 'ADP Agent Portal是腾讯云推出的企业级AI智能体管理平台，为企业内部分散在ADP、Dify、自研系统、第三方平台的智能体提供统一管理入口。员工只需讲出需求即可快速定位想要的智能体，同时实现跨智能体协作、智能路由与可观测治理。',
        highlights: [
          '统一智能体入口，支持跨平台管理',
          '智能路由，按需求自动匹配最优Agent',
          '可观测治理，效果评估与成本控制',
          '跨智能体协作能力'
        ],
        officialUrl: 'https://adp.tencentcloud.com/zh/blog/adp-agent-portal',
        isHot: false,
        tags: ['Agent Portal', '企业治理']
      },
      {
        id: 304,
        name: 'Agent Memory 智能体记忆服务',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-04-28',
        summary: '腾讯云数据库团队自研的智能体长期记忆底座，重庆峰会正式首发',
        description: 'TencentDB Agent Memory由腾讯云数据库团队完全自研，是一款独立的记忆管理底座。原生提供自动写入、分层沉淀（四层渐进式架构）、按需召回与治理增强能力，支撑智能体跨会话、长周期、多任务场景中业务知识的持续沉淀与精准调用。实测数据显示，接入后OpenClaw回答准确率提升至76.10%。',
        highlights: [
          '四层渐进式记忆架构，结构化与分层管理',
          '跨会话长期记忆，业务知识持续沉淀',
          '回答准确率提升至 76.10%（原生 OpenClaw 显著提升）',
          '以插件形态无缝集成，免费一键开启'
        ],
        officialUrl: 'https://cloud.tencent.com/product/agm',
        isHot: true,
        tags: ['Agent', '记忆服务', '数据库', '重点推荐']
      },
      {
        id: 305,
        name: 'Agent Storage 智能体存储服务',
        category: '存储',
        updateType: '新品发布',
        date: '2026-04-28',
        summary: '面向AI智能体的专用存储服务，重庆峰会首发',
        description: 'Agent Storage是腾讯云面向AI智能体场景推出的专用存储服务，与Agent Memory形成记忆+存储的完整数据底座。为智能体提供高性能、低延迟的数据存取能力，支持大规模智能体应用的数据持久化需求。',
        highlights: [
          '面向 AI 智能体场景的专用存储服务',
          '与 Agent Memory 形成完整数据底座',
          '高性能、低延迟数据存取',
          '支持大规模智能体应用数据持久化'
        ],
        officialUrl: 'https://cloud.tencent.com/product',
        isHot: false,
        tags: ['Agent', '存储', '首发']
      },
      {
        id: 306,
        name: '混元 Hy3 preview 官网上线',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-04-23',
        summary: '混元重建后首个模型正式上线腾讯云，295B MoE + 256K上下文 + 开源',
        description: '腾讯混元Hy3 preview是混元团队完成预训练与强化学习基础设施重建后的首个模型，由首席AI科学家姚顺雨带队。总参数295B，激活参数21B，支持256K上下文。在复杂推理、指令遵循、上下文学习、代码、智能体等能力上大幅提升，推理效率提升40%。已在腾讯云、元宝、ima、CodeBuddy等平台上线，同步开源。',
        highlights: [
          '295B 总参数，21B 激活参数，256K 上下文',
          '推理效率提升 40%，Agent 能力大幅增强',
          '同步开源模型权重',
          '腾讯云提供定制 Token Plan 套餐，最低 28 元/月'
        ],
        officialUrl: 'https://hunyuan.tencent.com',
        isHot: true,
        tags: ['混元', 'Hy3', '开源', '重点推荐']
      },
      {
        id: 307,
        name: '天御 Token 防刷解决方案（升级）',
        category: '安全',
        updateType: '版本升级',
        date: '2026-04-28',
        summary: '重庆峰会发布升级版，新增流量沙箱和运行时防护能力',
        description: '腾讯云天御Token防刷解决方案针对AI编程助手普及后黑产批量注册、低频高耗等滥用免费Token的问题进行全链路防控。重庆峰会发布升级版，新增流量沙箱和运行时防护能力，采用设备指纹识别、全链路行为追踪、账号体系治理等多维度风控能力，确保企业营销预算与算力资源安全可控。',
        highlights: [
          '新增流量沙箱与运行时防护能力',
          '设备指纹识别 + 全链路行为追踪',
          '精准拦截批量注册、低频高耗等异常消耗',
          '极简接入，已开放体验'
        ],
        officialUrl: 'https://cloud.tencent.com/product/tcrsaf',
        isHot: false,
        tags: ['安全', 'Token防刷', '风控']
      },
      {
        id: 308,
        name: 'AI Agent 安全中心（升级）',
        category: '安全',
        updateType: '版本升级',
        date: '2026-04-28',
        summary: 'AI Agent安全网关能力升级，新增内容安全防护与治理增强',
        description: 'AI Agent安全网关是腾讯云为企业AI智能体规模化落地打造的安全基座。作为连接Agent、模型、MCP与应用服务的安全中枢，提供从Token消耗治理、内容安全防护到运行时安全的全链路防护。重庆峰会发布升级版，安全能力进一步增强。',
        highlights: [
          'Agent/模型/MCP/应用服务的安全中枢',
          'Token 消耗治理与内容安全防护',
          '运行时安全与可观测能力',
          '支撑企业智能体规模化落地'
        ],
        officialUrl: 'https://cloud.tencent.com/product/llmsgw',
        isHot: false,
        tags: ['Agent安全', '企业级']
      }
    ]
  },
  {
    weekKey: '2026-W17',
    weekLabel: '往期 · 4月20日 – 4月26日',
    startDate: '2026-04-20',
    endDate: '2026-04-26',
    summary: '本周腾讯云聚焦"音视频AI增强 + 全球加速节点扩展"：云点播上线AIGC大模型能力，GA 2.0新增亚太/中东/南非节点，全球化布局加速。',
    products: [
      {
        id: 201,
        name: '云点播 VOD · AIGC 大模型能力',
        category: '音视频',
        updateType: '新功能',
        date: '2026-04-21',
        summary: '云点播新增大模型视频增强、GLM生文、MiniMax生文 AIGC 大模型能力',
        description: '腾讯云点播（VOD）新增大模型视频增强能力，并接入 GLM、MiniMax 等第三方 AIGC 大模型，支持智能文生文、视频内容增强等场景，进一步丰富音视频 AI 处理能力。',
        highlights: [
          '新增大模型视频增强能力',
          '接入 GLM 生文大模型',
          '接入 MiniMax 生文 AIGC 能力',
          '详情参考官方文档 cloud.tencent.com/document/product/266'
        ],
        officialUrl: 'https://cloud.tencent.com/document/product/266',
        isHot: true,
        tags: ['AIGC', '音视频AI', '重点推荐']
      },
      {
        id: 202,
        name: '全球应用加速 GA 2.0',
        category: '网络',
        updateType: '新功能',
        date: '2026-04-24',
        summary: 'GA 2.0 新增亚太、中东、南非加速节点，全面提升全球加速效果',
        description: '腾讯云全球应用加速（GA）2.0 版本新增亚太、中东、南非等多个海外加速节点，进一步拓展全球覆盖半径，为出海业务提供更优质的网络加速体验。',
        highlights: [
          '新增亚太地区加速节点',
          '新增中东地区加速节点',
          '新增南非地区加速节点',
          '全面提升全球加速效果'
        ],
        officialUrl: 'https://cloud.tencent.com/product/ga',
        isHot: false,
        tags: ['全球加速', '出海', '节点扩展']
      }
    ]
  },
  {
    weekKey: '2026-W16',
    weekLabel: '往期 · 4月13日 – 4月19日',
    startDate: '2026-04-13',
    endDate: '2026-04-19',
    summary: '腾讯云以"大模型生态扩展 + 成本优化"为主线：混元3D世界模型2.0开源、联网搜索API大幅降价，利好AI应用开发者。',
    products: [
      {
        id: 1,
        name: '混元3D世界模型 2.0',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-04-16',
        summary: '腾讯混元3D世界生成大模型2.0开源版重磅发布',
        description: '混元3D世界模型 2.0 是腾讯混元团队推出的新一代3D世界生成大模型，支持从文本/图像生成高质量3D场景，相比1.0版本在几何精度、材质真实度、场景完整性方面均有大幅提升，并同步开源给社区。',
        highlights: [
          '支持文生3D世界、图生3D世界',
          '几何精度提升 2 倍，材质真实感显著增强',
          '开源模型权重与推理代码',
          '适用于游戏开发、元宇宙、XR 等场景'
        ],
        officialUrl: 'https://hunyuan.tencent.com',
        isHot: true,
        tags: ['开源', '3D生成', '重点推荐']
      },
      {
        id: 2,
        name: 'QBotClaw AI浏览器（龙虾）',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-04-09',
        summary: '腾讯发布国内首个AI浏览器"龙虾"，浏览器从访问工具升级为AI助理',
        description: 'QBotClaw 由 QQ 浏览器团队打造，具备全场景感知与复杂任务执行能力，可理解网页、自动操作、跨站协作，标志着浏览器正从单纯的网页访问工具演变为具备全场景感知与复杂任务执行能力的 AI 助理。',
        highlights: [
          '国内首个AI浏览器形态',
          '全场景页面感知',
          '复杂任务自动化执行',
          '跨标签页/跨网站智能协作'
        ],
        officialUrl: 'https://browser.qq.com',
        isHot: true,
        tags: ['AI Agent', '首发']
      },
      {
        id: 3,
        name: 'QClaw V2 多Agent协同',
        category: 'AI大模型',
        updateType: '新功能',
        date: '2026-04-09',
        summary: 'QClaw V2 上线多Agent协同能力，支持任务分工与协作',
        description: 'QClaw V2 新增多智能体协同框架，多个专业Agent可针对复杂任务进行自动分工、互相调用、协同完成，显著提升复杂任务的完成率与准确率。',
        highlights: [
          '多Agent自动分工',
          '任务流水线编排',
          '可视化协作过程',
          '支持自定义Agent角色'
        ],
        officialUrl: 'https://cloud.tencent.com',
        tags: ['Multi-Agent']
      },
      {
        id: 4,
        name: '联网搜索API',
        category: 'AI大模型',
        updateType: '价格变更',
        date: '2026-04-17',
        summary: '联网搜索API大幅降价：轻量版降40%、尊享版降25%',
        description: '腾讯云联网搜索API用于为大模型提供实时互联网搜索能力，本次价格调整对RAG、AI搜索类应用开发者显著利好。',
        highlights: [
          '轻量版：30元/千次 → 18元/千次（↓40%）',
          '尊享版：80元/千次 → 60元/千次（↓25%）',
          '利好 RAG / AI 搜索场景',
          '面向大模型联网增强能力'
        ],
        officialUrl: 'https://cloud.tencent.com/product/events',
        isHot: true,
        tags: ['降价', '成本优化']
      },
      {
        id: 5,
        name: '云点播 VOD',
        category: '音视频',
        updateType: '新功能',
        date: '2026-04-08',
        summary: '云点播 VOD 新增大模型版本，支持智能视频处理',
        description: '云点播新增大模型版本计量项，提供基于大模型的视频智能处理能力，如智能封面、智能标签、智能字幕生成、视频内容理解等。',
        highlights: [
          '智能封面生成',
          '视频内容理解与标签',
          '多语言智能字幕',
          '按量后付费'
        ],
        officialUrl: 'https://cloud.tencent.com/product/vod',
        tags: ['AI + 视频']
      },
      {
        id: 6,
        name: '即时通信 IM',
        category: '通信',
        updateType: '规格调整',
        date: '2026-04-12',
        summary: '智能客服智能体消息量计量单位调整为"千条/日"',
        description: 'IM 智能客服智能体消息量按量后付费的计量单位由"条/日"调整为"千条/日"，价格相应更新，降低计费粒度、便于批量场景成本测算。',
        highlights: [
          '计量单位升级：条/日 → 千条/日',
          '便于批量场景成本核算',
          '价格相应同步调整'
        ],
        officialUrl: 'https://cloud.tencent.com/product/im',
        tags: ['计费调整']
      }
    ]
  },
  {
    weekKey: '2026-W15',
    weekLabel: '往期 · 4月6日 – 4月12日',
    startDate: '2026-04-06',
    endDate: '2026-04-12',
    summary: '聚焦"AI算力成本调整与AI Agent生态"：腾讯云公示AI算力、TKE原生节点、EMR价格上调5%（5月9日生效）。',
    products: [
      {
        id: 101,
        name: 'AI算力/TKE原生节点/EMR',
        category: '计算',
        updateType: '价格变更',
        date: '2026-04-09',
        summary: 'AI算力、容器TKE原生节点、弹性MapReduce刊例价统一上调5%',
        description: '腾讯云发布公告，自2026年5月9日起对AI算力相关产品服务、容器服务TKE-原生节点相关产品、弹性MapReduce（EMR）相关产品刊例价统一上调5%。',
        highlights: [
          '生效时间：2026-05-09',
          '调整范围：AI算力 / TKE原生节点 / EMR',
          '统一上调：5%',
          '建议提前做好预算与合同规划'
        ],
        officialUrl: 'https://cloud.tencent.com/announce',
        isHot: true,
        tags: ['涨价', '重要通知']
      }
    ]
  }
]

// 分类配置
export const categoryConfig: Record<string, { color: string; bg: string }> = {
  'AI大模型': { color: '#7c3aed', bg: '#f5f3ff' },
  '计算':     { color: '#2b5aed', bg: '#eef2ff' },
  '存储':     { color: '#16a34a', bg: '#f0fdf4' },
  '数据库':   { color: '#ef4444', bg: '#fef2f2' },
  '网络':     { color: '#0369a1', bg: '#e0f2fe' },
  '安全':     { color: '#ca8a04', bg: '#fefce8' },
  '音视频':   { color: '#f97316', bg: '#fff7ed' },
  '通信':     { color: '#0891b2', bg: '#ecfeff' },
  '其他':     { color: '#64748b', bg: '#f1f5f9' }
}

// 更新类型配置
export const updateTypeConfig: Record<string, { color: string; bg: string }> = {
  '新品发布': { color: '#ef4444', bg: '#fef2f2' },
  '新功能':   { color: '#2b5aed', bg: '#eef2ff' },
  '版本升级': { color: '#7c3aed', bg: '#f5f3ff' },
  '开源':     { color: '#16a34a', bg: '#f0fdf4' },
  '价格变更': { color: '#f97316', bg: '#fff7ed' },
  '规格调整': { color: '#64748b', bg: '#f1f5f9' }
}
