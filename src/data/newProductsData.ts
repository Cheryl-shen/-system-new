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
    weekKey: '2026-W22',
    weekLabel: '本周 · 5月26日 – 5月31日',
    startDate: '2026-05-26',
    endDate: '2026-05-31',
    summary: '腾讯云本周双线出击：5月28日香港面向全球发布Agent Runtime升级、Miora/WorkBuddy国际版；5月29日上海「数据库+AI」发布会推出DatabaseClaw、TDSQL-C Branch分支管理、多模态混合检索等十余项AI原生数据库能力。',
    products: [
      {
        id: 401,
        name: 'Agent Runtime 全面升级',
        category: 'AI大模型',
        updateType: '版本升级',
        date: '2026-05-28',
        summary: '首次构建覆盖运行、存储、记忆与安全访问的Agent原生运行底座，含5大核心组件',
        description: '腾讯云Agent Runtime完成系统性升级，首次构建覆盖运行、存储、记忆与安全访问的原生运行底座。包含Agent SandBox（休眠唤醒机制，唤醒延迟低至50ms）、Agent CBS（按用量计费）、Agent Bucket（亿级用户共享空间）、Agent Gateway（安全访问）、Agent Memory（长任务成功率提升30%，Token消耗降低60%）五大组件。',
        highlights: [
          'Agent SandBox 休眠唤醒延迟低至 50ms',
          'Agent Memory 长任务成功率提升 30%',
          'Token 消耗降低 60%',
          '首次构建运行+存储+记忆+安全的完整底座'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: true,
        tags: ['Agent', '基础设施', '全球发布', '重点推荐']
      },
      {
        id: 402,
        name: 'Miora 全场景创意智能体工作室',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-05-28',
        summary: '一句话生成图片、视频、UI/UX设计和3D内容，让一人拥有整个创意工作室',
        description: 'Miora是腾讯云面向全球发布的全场景创意智能体工作室。能理解并记忆用户的审美偏好与创作风格，仅凭一句需求描述即可自动拆解任务，生成包含图片、视频、UI/UX设计、3D资产的整套视觉方案。搭载全球主流视觉模型，支持节点式自由创作与协同，允许定制和分享专属Skills。',
        highlights: [
          '记忆用户审美偏好，越用越懂你',
          '一句话生成图片/视频/UI/3D 多模态内容',
          '节点式画布，支持多模态自由创作与协同',
          '可定制并分享专属 Skills'
        ],
        officialUrl: 'https://cloud.tencent.com/product/miora',
        isHot: true,
        tags: ['Agent', '创意', 'AIGC', '全球首发', '重点推荐']
      },
      {
        id: 403,
        name: 'WorkBuddy 国际版',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-05-28',
        summary: '国内最受欢迎的效率智能体正式出海，深度集成Slack/Telegram/Discord',
        description: 'WorkBuddy国际版是腾讯云效率智能体产品面向海外市场的版本。深度集成Slack、Telegram、Discord等主流国际协作工具，支持从行业趋势分析到报告生成的全流程工作，用户可通过手机便捷操控。',
        highlights: [
          '深度集成 Slack/Telegram/Discord',
          '支持全流程工作：趋势分析→报告生成',
          '手机端便捷操控',
          '国内百万级用户验证后正式出海'
        ],
        officialUrl: 'https://cloud.tencent.com/product/workbuddy',
        isHot: false,
        tags: ['Agent', '效率', '出海']
      },
      {
        id: 404,
        name: 'TokenHub 海外版',
        category: 'AI大模型',
        updateType: '新品发布',
        date: '2026-05-28',
        summary: '腾讯云大模型服务平台TokenHub正式面向海外用户提供模型服务',
        description: '腾讯云TokenHub（大模型服务平台）正式面向海外用户提供模型服务，构建"一云多模"的全流程AI引擎，支持海外开发者便捷调用混元及第三方模型能力。',
        highlights: [
          '正式面向海外用户开放',
          '一云多模全流程 AI 引擎',
          '支持混元及第三方模型调用',
          '配合 Agent Runtime 形成完整出海方案'
        ],
        officialUrl: 'https://cloud.tencent.com/product/hunyuan',
        isHot: false,
        tags: ['模型服务', '出海']
      },
      {
        id: 405,
        name: 'DatabaseClaw 数据库智能运维Agent',
        category: '数据库',
        updateType: '新品发布',
        date: '2026-05-29',
        summary: '基于OpenClaw框架，DBA用自然语言即可执行复杂运维操作',
        description: 'DatabaseClaw是腾讯云在「数据库+AI」发布会上正式推出的数据库智能运维方案，基于OpenClaw框架开发。DBA只需通过自然语言指令即可执行复杂运维操作，集成大量实战经验可自动化解决常见问题，极大简化跨多个平台和服务的操作流程。',
        highlights: [
          '基于 OpenClaw 框架开发',
          '自然语言驱动，一句话定位故障根因',
          '集成实战经验，自动化解决常见问题',
          '越用越懂业务环境'
        ],
        officialUrl: 'https://cloud.tencent.com/product/tdsql',
        isHot: true,
        tags: ['Agent', '数据库', 'DBA', '重点推荐']
      },
      {
        id: 406,
        name: 'TDSQL-C 数据库分支管理（Branch）',
        category: '数据库',
        updateType: '新功能',
        date: '2026-05-29',
        summary: 'AI编程场景必备：秒级创建生产环境一致的数据副本，支持回滚与协作',
        description: 'TDSQL-C新增Branch分支管理功能，允许快速创建独立但与生产环境一致的数据副本，支持秒级创建、回滚及协作。专为AI编程场景设计，满足频繁复制、测试和恢复的需求，同时保持金融级稳定性和秒级弹性伸缩能力。',
        highlights: [
          '秒级创建生产环境一致的数据副本',
          '支持快速回滚与多人协作',
          '专为 AI 编程频繁测试场景设计',
          '金融级稳定性 + 秒级弹性伸缩'
        ],
        officialUrl: 'https://cloud.tencent.com/product/cynosdb',
        isHot: true,
        tags: ['数据库', 'AI编程', '重点推荐']
      },
      {
        id: 407,
        name: 'AgentMemory 升级版（多模态混合检索）',
        category: '数据库',
        updateType: '版本升级',
        date: '2026-05-29',
        summary: '三层记忆架构升级：短期压缩+长期固化+团队结构化，支持多模态混合检索',
        description: 'AgentMemory在数据库+AI发布会上发布升级版，通过短期记忆压缩、长期记忆固化、团队记忆结构化三层优化Agent工作效率。新增多模态数据混合检索能力，支持处理上下文记忆、知识库及多媒体内容等多种数据类型的统一检索。',
        highlights: [
          '短期记忆压缩 + 长期记忆固化',
          '团队记忆结构化，支持多 Agent 协作',
          '多模态数据混合检索',
          '显著提高任务完成率并降低成本'
        ],
        officialUrl: 'https://cloud.tencent.com/product/agm',
        isHot: false,
        tags: ['Agent', '记忆', '数据库']
      },
      {
        id: 408,
        name: '电子签海外版',
        category: '其他',
        updateType: '新品发布',
        date: '2026-05-28',
        summary: '腾讯云电子签正式出海，面向全球用户提供电子签约服务',
        description: '腾讯云电子签海外版同步上线，面向全球用户提供电子签约服务，配合腾讯云AI全球化战略为海外企业客户提供合规、安全的电子签约解决方案。',
        highlights: [
          '正式面向海外用户开放',
          '合规安全的电子签约方案',
          '配合腾讯云全球化战略',
          '支持多语言多地区'
        ],
        officialUrl: 'https://cloud.tencent.com/product/ess',
        isHot: false,
        tags: ['出海', '电子签']
      }
    ]
  },
  {
    weekKey: '2026-W21',
    weekLabel: '往期 · 5月19日 – 5月25日',
    startDate: '2026-05-19',
    endDate: '2026-05-25',
    summary: '5月20日腾讯云融合创新峰会重磅升级"6T"国产软件体系：TencentOS AI增强版发布、TDSQL企业版性能飙升（OLAP提升20倍）、TDSQL基础版全新推出、TBDS升级为智能Agent架构、TI平台全面适配国产AI芯片。',
    products: [
      {
        id: 501,
        name: 'TencentOS AI 增强版',
        category: '计算',
        updateType: '版本升级',
        date: '2026-05-20',
        summary: '为AI Agent打造的AI-Ready操作系统，覆盖9大领域24个运维场景，无需命令即可运维',
        description: 'TencentOS AI增强版是腾讯云在融合创新峰会发布的面向AI Agent智能体的操作系统版本。提供AI Agent部署、AI辅助运维、开箱即得AI开发环境等能力，自带开发与部署核心组件，覆盖9大领域24个真实运维场景，DBA/运维人员无需记忆命令即可完成OS运维。累计装机量已超1000万套。',
        highlights: [
          '面向 AI Agent 的 AI-Ready 操作系统',
          '覆盖 9 大领域 24 个运维场景',
          '无需记忆命令，自然语言运维',
          '累计装机量超 1000 万套'
        ],
        officialUrl: 'https://cloud.tencent.com/product/tencentos',
        isHot: true,
        tags: ['操作系统', 'Agent', '融合创新', '重点推荐']
      },
      {
        id: 502,
        name: 'TDSQL 企业版升级（OLAP性能提升20倍）',
        category: '数据库',
        updateType: '版本升级',
        date: '2026-05-20',
        summary: '计算引擎深度优化：OLTP性能提升50%、OLAP性能提升20倍，深度适配国产芯片',
        description: 'TDSQL企业版在融合创新峰会上宣布重大性能升级：计算引擎全面优化，OLTP性能提升50%，OLAP性能提升20倍。深度基于国产芯片调优，性能追平传统架构，连续多年稳居金融行业市场份额第一，覆盖超100家金融机构核心系统，实现四大行主力数据库全覆盖。',
        highlights: [
          'OLTP 性能提升 50%',
          'OLAP 性能提升 20 倍',
          '深度适配国产芯片，性能追平传统架构',
          '四大行主力数据库全覆盖'
        ],
        officialUrl: 'https://cloud.tencent.com/product/tdsql',
        isHot: true,
        tags: ['数据库', '性能', '国产化', '重点推荐']
      },
      {
        id: 503,
        name: 'TDSQL 基础版（全新发布）',
        category: '数据库',
        updateType: '新品发布',
        date: '2026-05-20',
        summary: '100%兼容MySQL，分钟级部署交付，面向中小企业的轻量级自研数据库',
        description: 'TDSQL基础版是腾讯云在融合创新峰会上全新发布的轻量级数据库产品，100%兼容MySQL，分钟级部署交付，面向中小企业和快速开发场景，降低自研数据库的使用门槛。',
        highlights: [
          '全新发布，100% 兼容 MySQL',
          '分钟级部署交付',
          '面向中小企业快速开发场景',
          '降低自研数据库使用门槛'
        ],
        officialUrl: 'https://cloud.tencent.com/product/tdsql',
        isHot: false,
        tags: ['数据库', 'MySQL兼容', '新品']
      },
      {
        id: 504,
        name: 'TBDS 大数据平台 Agent 架构升级',
        category: 'AI大模型',
        updateType: '版本升级',
        date: '2026-05-20',
        summary: '从多模态融合到智能Agent：新增数据分析Agent、智能自治Agent、业务自助Agent',
        description: 'TBDS大数据平台完成从"多模态融合"到"智能Agent"的架构升级。基础层提供多模态湖仓基座统一支撑全类型数据；智能开发层WeData平台实现DataOps与AIOps一体化；运维层TBDS-Insight提供AIOps自治运维；上层新增数据分析Agent、智能自治Agent、业务自助Agent，让业务人员即问即得。',
        highlights: [
          '新增数据分析/智能自治/业务自助三大 Agent',
          'WeData 实现 DataOps + AIOps 一体化',
          'TBDS-Insight 提供 AIOps 自治运维',
          '业务人员即问即得，无需技术背景'
        ],
        officialUrl: 'https://cloud.tencent.com/product/tbds',
        isHot: false,
        tags: ['大数据', 'Agent', '融合创新']
      },
      {
        id: 505,
        name: 'TI AI平台 全面适配国产AI芯片',
        category: 'AI大模型',
        updateType: '版本升级',
        date: '2026-05-20',
        summary: '一站式大模型训推平台全面适配国产AI芯片和国产操作系统',
        description: '腾讯云TI（一站式大模型训推平台）宣布全面适配国产AI芯片，兼容国产操作系统，是"6T"国产软件体系中AI平台层的核心产品，为企业提供国产化环境下的完整AI模型训练和推理能力。',
        highlights: [
          '全面适配国产 AI 芯片',
          '兼容国产操作系统',
          '一站式大模型训练与推理',
          '"6T"体系 AI 平台层核心产品'
        ],
        officialUrl: 'https://cloud.tencent.com/product/ti',
        isHot: false,
        tags: ['AI平台', '国产化', '融合创新']
      },
      {
        id: 506,
        name: 'ClawPro 专有云版正式商用',
        category: 'AI大模型',
        updateType: '版本升级',
        date: '2026-05-20',
        summary: '公有云百万级用户验证的Agent管控能力完整部署于企业本地，兼容异构算力',
        description: 'ClawPro专有云版在融合创新峰会宣布正式商用，将公有云经百万级用户验证的核心Agent管控能力完整部署于企业本地环境，兼容主流大模型与异构算力。面向金融、政务、能源等对数据安全有高要求的行业客户。',
        highlights: [
          '公有云百万级验证能力落地私有云',
          '兼容主流大模型与异构算力',
          '企业级 Agent 管控平台正式商用',
          '面向金融/政务/能源等行业'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: false,
        tags: ['Agent', '私有云', '商用']
      }
    ]
  },
  {
    weekKey: '2026-W20',
    weekLabel: '往期 · 5月10日 – 5月18日',
    startDate: '2026-05-10',
    endDate: '2026-05-18',
    summary: '腾讯云ADP智能体开发平台密集更新：新增Claw模式（第四种应用模式）、Agentic RAG智能检索、连接器与工具架构升级、钉钉机器人发布渠道；云数据库PostgreSQL全面支持PG 18.0并上线智能索引推荐。',
    products: [
      {
        id: 601,
        name: 'ADP Claw 模式（第四种应用模式）',
        category: 'AI大模型',
        updateType: '新功能',
        date: '2026-05-15',
        summary: 'ADP第四种智能体应用模式：拥有独立工作空间，自主编写和运行代码完成复杂任务',
        description: '腾讯云ADP推出第四种应用模式——Claw模式。该应用类型拥有独立工作空间，通过自主编写和运行代码来完成复杂任务，像一位随时在线的数字同事。适用于数据分析、内容生成、自动化处理等面向非技术用户的复杂任务场景，面向专业版和企业版用户，沙箱能力限时免费体验中。',
        highlights: [
          'ADP 第四种应用模式，独立工作空间',
          '自主编写和运行代码完成复杂任务',
          '适用数据分析/内容生成/自动化处理',
          '沙箱能力限时免费体验'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: true,
        tags: ['Agent', 'ADP', '新模式', '重点推荐']
      },
      {
        id: 602,
        name: 'ADP Agentic RAG 智能检索',
        category: 'AI大模型',
        updateType: '新功能',
        date: '2026-05-15',
        summary: '基于Agent Loop框架，智能体自主反思、切换策略、多轮迭代检索，大幅提升知识问答准确度',
        description: 'Agentic RAG基于Agent Loop框架，实现智能体自主反思、智能切换检索策略、多轮迭代检索，在知识场景中提供更广的回答范围和更高的回答准确度。支持在Claw模式或Multi-Agent模式应用下使用，通过添加知识库问答/AgenticRAGSearch工具实现。',
        highlights: [
          '智能体自主反思与策略切换',
          '多轮迭代检索，覆盖更广',
          '知识问答准确度大幅提升',
          '支持 Claw 模式和 Multi-Agent 模式'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: true,
        tags: ['RAG', 'Agent', '知识库', '重点推荐']
      },
      {
        id: 603,
        name: 'ADP 连接器与工具架构升级',
        category: 'AI大模型',
        updateType: '版本升级',
        date: '2026-05-15',
        summary: '插件广场升级为「连接器与工具」，规范化智能体对外部系统的集成方式',
        description: 'ADP插件广场升级为「连接器与工具」体系。连接器用于接入第三方SaaS、企业系统或生态产品，完成查询/创建/更新/通知等操作；工具提供独立的通用处理能力，面向具体任务提供原子能力。支持内置与用户自定义两种类型。',
        highlights: [
          '插件广场升级为连接器与工具',
          '连接器：接入 SaaS/企业系统/生态产品',
          '工具：独立通用原子能力',
          '支持内置与自定义两种类型'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: false,
        tags: ['ADP', '连接器', '生态']
      },
      {
        id: 604,
        name: 'ADP 应用发布到钉钉机器人',
        category: 'AI大模型',
        updateType: '新功能',
        date: '2026-05-15',
        summary: '支持将ADP智能体应用发布到钉钉机器人渠道，实现知识问答和业务咨询',
        description: '腾讯云ADP新增钉钉机器人发布渠道，可将智能体开发平台中的应用发布到钉钉机器人中使用。用户在钉钉中搜索机器人名称即可发起对话，实现知识问答、业务咨询等场景，拓展了智能体的分发触达能力。',
        highlights: [
          '新增钉钉机器人发布渠道',
          '在钉钉中搜索即可对话',
          '支持知识问答与业务咨询场景',
          '拓展智能体分发触达能力'
        ],
        officialUrl: 'https://cloud.tencent.com/product/adp',
        isHot: false,
        tags: ['ADP', '钉钉', '分发渠道']
      },
      {
        id: 605,
        name: '云数据库 PostgreSQL 全面支持 PG 18.0',
        category: '数据库',
        updateType: '版本升级',
        date: '2026-05-15',
        summary: '腾讯云PostgreSQL全面支持PG 18.0，异步I/O让读取性能翻倍，新增智能索引推荐',
        description: '腾讯云PostgreSQL全面支持PostgreSQL 18.0版本，带来异步I/O支持（读取密集型场景性能提升2-3倍）、逻辑复制支持等关键升级。同时上线智能索引推荐能力，DBbrain全面接入，通过tencentdb_index_advisor扩展的Hypothetical Index技术，不建真实索引即可评估优化效果。',
        highlights: [
          '全面支持 PostgreSQL 18.0',
          '异步 I/O：读取性能提升 2-3 倍',
          '新增智能索引推荐（DBbrain 接入）',
          'Hypothetical Index 技术免真实索引评估'
        ],
        officialUrl: 'https://cloud.tencent.com/product/postgres',
        isHot: false,
        tags: ['数据库', 'PostgreSQL', '性能提升']
      }
    ]
  },
  {
    weekKey: '2026-W19',
    weekLabel: '往期 · 4月27日 – 5月9日',
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
