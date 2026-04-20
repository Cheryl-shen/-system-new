// 售卖弹药数据 - 以产品为维度的销售支撑资料
// 定期更新重点产品的：核心卖点、目标客户、适用场景、话术、报价、竞品对比、典型案例、FAQ 等
export interface AmmoProduct {
  id: number
  productName: string // 产品名称
  productCode?: string // 产品代号 / 简称
  category: string // 产品大类：AI 大模型 / AI 研发 / AI 办公 / 智能客服 / 音视频 / 安全 / 数据库 / 基础算力 / 行业解决方案
  tag?: string // 状态标签：新品 / 主推 / 战略 / 热门
  priority: '高' | '中' | '低' // 主推优先级
  logo: string // emoji 图标
  oneLiner: string // 一句话定位（<= 40 字）
  overview: string // 产品概述（markdown）
  coreValue: string[] // 核心卖点（3-6 条）
  diff: string[] // 差异化 / 对比友商 的亮点
  targetCustomers: string[] // 目标客户画像（行业 / 规模 / 角色）
  scenes: Array<{ name: string; desc: string }> // 适用场景
  pricing: {
    model: string // 计费模式
    startingPrice?: string // 起步价
    discountPolicy?: string // 折扣政策
    freeTier?: string // 免费额度
  }
  competition: Array<{ rival: string; ourAdvantage: string }> // 竞品对比
  pitches: Array<{ scene: string; script: string }> // 话术（场景 + 话术原文）
  cases: Array<{ customer: string; industry: string; effect: string }> // 典型案例
  faq: Array<{ q: string; a: string }> // 销售 FAQ
  materials: Array<{ name: string; url: string; type: 'PPT' | 'PDF' | '视频' | '文档' | '链接' }> // 配套物料
  contact: string // 产品接口人 / BD
  lastUpdate: string // 最近更新
  sourceUrl?: string // 原始参考链接（如乐享文档）
}

export const salesGuideData: AmmoProduct[] = [
  {
    id: 1,
    productName: '腾讯云 CodeBuddy',
    productCode: 'CodeBuddy',
    category: 'AI 研发',
    tag: '主推',
    priority: '高',
    logo: '🤖',
    oneLiner: '腾讯自研 AI 编程助手，代码补全 + AI 代码审查 + 全流程 Copilot',
    overview: `## 一、产品定位
CodeBuddy 是腾讯云面向企业研发团队的 AI 编程助手，基于腾讯自研混元大模型 + CodeX 代码专用模型，在 VSCode / JetBrains / Cursor 等 IDE 中提供代码补全、代码解释、单测生成、代码审查、智能问答、Agent Mode 等能力，覆盖研发全生命周期。

## 二、核心能力
- **Chat 对话**：多轮上下文对话、@文件 @方法 引用
- **代码补全**：行内补全 / 多行补全，毫秒级响应
- **Agent Mode**：自主完成复杂任务（查文档 → 改代码 → 跑测试 → 提 PR）
- **代码审查**：Git Commit 前智能 Review，识别缺陷、规范、安全问题
- **单测生成**：一键生成符合项目规范的单测
- **知识库问答**：接入企业代码库 / 文档库，私域知识问答
- **私有化 / 专属实例**：支持 VPC 部署、企业级账号管理`,
    coreValue: [
      '国产自主可控：基于腾讯自研混元 + CodeX 模型，数据不出境，信创合规',
      '企业级安全：支持 SSO / RBAC / 审计日志 / 敏感词过滤 / 数据隔离',
      '研发全流程：从 IDE 补全到 Code Review、单测、PR 评审一站式覆盖',
      'Agent 能力领先：业内首批实现生产级 Agent Mode，复杂任务自主完成',
      '生态兼容：VSCode / JetBrains / Cursor / Claude Code / Windsurf 全覆盖',
      '腾讯内部 10 万+ 研发实战验证，WorkBuddy 周活渗透率 70%+'
    ],
    diff: [
      '对标 GitHub Copilot：数据不出境 + 信创资质 + 价格优势 30%',
      '对标 通义灵码：Agent Mode 更成熟，企业级能力更完善',
      '对标 Cursor：私有化部署支持更好，适合金融、央国企、大客户',
      '对标 百度 Comate：模型效果（HumanEval / SWE-Bench）领先一个身位'
    ],
    targetCustomers: [
      '金融 / 券商 / 保险（信创合规强需求）',
      '央国企 / 政府（自主可控 + 私有化）',
      '互联网头部 / 独角兽（研发规模 500 人+，效率诉求强）',
      '汽车 / 制造 / 物流（IT 数字化提速）',
      '游戏 / 短视频（代码量大、迭代快）'
    ],
    scenes: [
      { name: '代码补全提效', desc: '日常编码接受率 35%+，人均每周节省 5-8 小时' },
      { name: 'Code Review 自动化', desc: 'Commit 前 AI 审查，拦截 40%+ 低级缺陷' },
      { name: '单测补齐', desc: '历史代码一键补单测，覆盖率从 30% → 70%' },
      { name: '新人 Onboarding', desc: '新人通过对话快速理解老代码，上手周期缩短 50%' },
      { name: '企业知识问答', desc: '接入 Wiki / Confluence / Gitee，私域知识秒级问答' },
      { name: 'Agent 自动化任务', desc: '自主完成 Bug 修复、重构、文档生成等复杂任务' }
    ],
    pricing: {
      model: '按席位订阅（Per Seat / Per Month）',
      startingPrice: '标准版 99 元/席位/月，企业版 199 元/席位/月，专属实例按项目报价',
      discountPolicy: '年付 8 折、千席位以上 7 折、战略客户一事一议；腾讯云存量客户额外优惠',
      freeTier: '个人版免费（每日 50 次 Chat + 无限补全），14 天企业版试用'
    },
    competition: [
      { rival: 'GitHub Copilot', ourAdvantage: '数据不出境、信创合规、价格更低 30%、企业后台更完善、中文场景效果更好' },
      { rival: '阿里云 通义灵码', ourAdvantage: 'Agent Mode 更成熟、Code Review 能力更强、腾讯研发实战验证' },
      { rival: 'Cursor / Windsurf', ourAdvantage: '私有化部署、中文客服、SLA 保障、企业级账号管理' },
      { rival: '百度 Comate', ourAdvantage: '模型效果领先、IDE 生态更广、企业能力更成熟' }
    ],
    pitches: [
      {
        scene: '初次接触 - 开场白',
        script: '"X 总好，腾讯自研的 AI 编程助手 CodeBuddy 目前已经在腾讯内部 10 万+ 研发全量使用，代码采纳率 35%+，人均每周节省 5-8 小时。对比 GitHub Copilot，我们数据不出境、有信创资质、价格便宜 30%。想先了解一下贵司现在研发团队规模和 AI 研发工具的规划？"'
      },
      {
        scene: '客户在用 Copilot / 通义灵码',
        script: '"其实很多客户最初也在用 Copilot，但碰到两个问题：一是数据出境合规风险（尤其金融和央国企），二是 Agent 能力跟不上。CodeBuddy 完全国产化，腾讯自研模型，信创资质齐全。要不我们先做一个 30 天的免费 POC，和现有工具同台竞技，数据说话？"'
      },
      {
        scene: '价格敏感客户',
        script: '"理解预算压力。这样，我们可以先从一个试点团队（50-100 席位）切入，年付 8 折，相比 Copilot 同规模可以省大概 40%。跑 3 个月后如果效果好，再逐步扩到全员。腾讯云存量客户还能用现有代金券抵扣。"'
      },
      {
        scene: '私有化部署需求',
        script: '"金融 / 央国企客户我们都是专属实例部署，部署在客户 VPC 里，模型、数据、日志完全隔离。已经在招商银行、中国电信、国家电网等头部客户落地，有完整的合规交付经验。可以安排技术架构师上门做方案讲解。"'
      }
    ],
    cases: [
      { customer: '招商银行', industry: '金融', effect: '5000+ 席位专属实例部署，代码采纳率 38%，Code Review 拦截率提升 45%' },
      { customer: '中国电信', industry: '运营商', effect: '3000 席位，新人 Onboarding 周期从 6 周缩短到 3 周' },
      { customer: '顺丰控股', industry: '物流', effect: '3000+ 研发席位，日均 Chat 调用 8 万次，AI Agent 自动处理工单级需求' },
      { customer: '蔚来汽车', industry: '新能源汽车', effect: '2000 席位，智能座舱项目研发效率提升 28%' }
    ],
    faq: [
      {
        q: '数据安全如何保障？代码会不会被用来训练模型？',
        a: '企业版 / 专属实例部署时，所有代码、对话、日志均在客户侧，不会回流腾讯。模型训练只使用公开代码和已授权数据集，有明确的 DPA 协议和第三方审计报告可提供。'
      },
      {
        q: '和 GitHub Copilot 相比贵在哪 / 便宜在哪？',
        a: 'Copilot 企业版约 19 美元/席位/月（人民币 ~140 元），CodeBuddy 企业版 199 元但年付 8 折后 ~160 元，价格相当。但 CodeBuddy 多了：信创合规、私有化、中文支持、本地化客服、Agent Mode。'
      },
      {
        q: '信创资质是否齐全？',
        a: '已完成信创兼容性认证（鲲鹏 / 海光 / 飞腾 + 麒麟 / 统信），通过等保三级 + 金融级安全认证，可供入信创目录。'
      },
      {
        q: 'POC 怎么申请？',
        a: '联系腾讯云区域销售 / 伙伴提交申请，通常 3 个工作日内开通 30 天企业版免费试用，包含技术对接人 + 每周进度 review。'
      },
      {
        q: '支持哪些 IDE 和语言？',
        a: 'IDE：VSCode、JetBrains 全家桶（IDEA / PyCharm / GoLand 等）、Cursor、Windsurf、Claude Code 命令行。语言：Java / Python / Go / JS/TS / C/C++ / Rust / PHP / Kotlin / Swift 等 30+ 主流语言。'
      }
    ],
    materials: [
      { name: 'CodeBuddy 产品官网', url: 'https://copilot.tencent.com/', type: '链接' },
      { name: 'CodeBuddy 销售一页纸（PDF）', url: '#', type: 'PDF' },
      { name: 'CodeBuddy 企业版报价体系（内部）', url: '#', type: '文档' },
      { name: '头部客户案例集', url: '#', type: 'PDF' },
      { name: 'CodeBuddy vs Copilot 对比白皮书', url: '#', type: 'PDF' },
      { name: '产品演示视频（5 分钟版）', url: '#', type: '视频' }
    ],
    contact: 'lincolnliao',
    lastUpdate: '2026-04-20',
    sourceUrl: 'https://csig.lexiangla.com/teams/k100006/docs/50ba2418327511f1993eceb137c2be1e'
  },
  {
    id: 2,
    productName: '腾讯云 ClawPro',
    productCode: 'ClawPro（OpenClaw 企业版）',
    category: 'AI 办公',
    tag: '新品',
    priority: '高',
    logo: '🦞',
    oneLiner: '企业 AI 智能体管控平台，10 分钟给全员配发合规可控的 AI 助手',
    overview: `## 一、产品定位
ClawPro 是腾讯云面向企业推出的**一站式 AI 智能体管控平台（OpenClaw 企业版）**，底层与腾讯轻量云 Lighthouse 同源同构，并承接了 **OpenClaw 百万级用户**的实战经验，于 **2026 年 3 月 15 日启动企业邀测、4 月 2 日正式发布公测**。

产品帮助企业管理员**零代码、分钟级**为全员规模化部署**安全可控的专属数字助手**，用统一的管控台解决\"员工用什么模型、消耗多少 Token、数据是否合规、能不能审计\"四个核心问题。

## 二、产品架构
- **管控端（企业管理员）**：成员管理、模型配置、IM 通道配置（企微/QQ/飞书/钉钉）、Skill 库管理、镜像管理、安全组、Token 监控、操作记录、安全审计、一键全员升级
- **用户端（企业员工）**：三步创建个人 AI 助理（取名 → 选模型 → 绑 IM），1 分钟开始对话，在 IM 中直接使用

## 三、核心差异点
- **三级 Token 配额**：企业 → 部门 → 个人，逐级校验、可视化大盘，避免少数高频用户耗尽整月预算
- **四层纵深防护**：看得见（AI 资产盘点）→ 审得了（全链路审计）→ 管得住（租户级物理隔离 + 随机端口）→ 扫得全（Skill 供应链扫描）
- **CVM Ai2 专属机型**：刊例价仅为标准 CVM 的 **40%**，面向 AI Agent 场景优化
- **开放生态**：不限定模型（混元/DeepSeek/GLM/Claude/Qwen 等任意接入）、不限定 Agent（默认 OpenClaw，支持自定义镜像）`,
    coreValue: [
      '10 分钟上线：管理员三步（选套餐-配模型-发链接），员工扫码 1 分钟用上 AI 助手',
      '三级 Token 配额管控（企业/部门/个人），彻底解决 AI 成本失控与配额抢占',
      '四层纵深安全防护：AI 资产可见、全链路可审计、租户级物理隔离、Skill 供应链扫描',
      '多租户物理隔离 + 端口隐身（10000-40000 随机端口），金融/政务级合规',
      'CVM Ai2 专属机型，刊例价仅为标准型 40%，TCO 业内最低',
      '首发四大 IM（企微/QQ/飞书/钉钉）一键接入，QQ 和飞书扫码即连通',
      '基于 OpenClaw 百万级用户验证，ClawHub 提供 1.3 万+ AI Skills 生态',
      '支持一键全员升级，CVM 重装 + TAT 软件包双通道平滑迭代'
    ],
    diff: [
      '对标 OpenAI Enterprise / Microsoft 365 Copilot：数据不出境、信创合规、价格降 50%+',
      '对标 阿里云 百炼企业版：底层与 Lighthouse 同源同构，物理隔离能力更强、IM 生态更广',
      '对标 字节 扣子企业版：三级 Token 配额体系是独家能力，企业级成本管控更精细',
      '对标 企业自建 Agent 平台：部署效率提升 80%，环境统一率 100%，省去运维 / 安全 / 迭代 投入',
      '差异化：与个人版 OpenClaw 同源同构，可无缝承接百万级用户的 Skill 生态与社区沉淀'
    ],
    targetCustomers: [
      '金融 / 政务 / 央国企（强合规，需物理隔离 + 行为审计）',
      '中大型企业（1000 人以上，希望给全员配 AI 但不想自建）',
      'AI Agent 服务商 / SaaS 厂商（需要快速搭建自有品牌 AI 助手对外商业化）',
      '教育机构（智能辅导答疑、个性化学习、教学资源管理）',
      '预算敏感的成长型企业（希望百元起步、按需扩容、可见可控）',
      '腾讯系关联客户（TME / 虎牙 / 顺丰 / 拼多多 / 唯品会等）集团级 AI 统一管控'
    ],
    scenes: [
      { name: '全员 AI 助手部署', desc: '企业一次性采购，员工免注册免报销，在企微/飞书里直接@AI 助手对话' },
      { name: '成本统一管控', desc: '三级 Token 配额 + 实时大盘，避免少数用户耗尽整月预算' },
      { name: '合规审计', desc: '每次对话/操作全链路日志，金融政务过等保、过审计无压力' },
      { name: 'AI 供应链安全', desc: 'Skill 上架前扫描，拦截恶意代码、权限越界、数据泄露风险' },
      { name: '业务系统联动', desc: '串联邮箱/日历/CRM 生成会议简报、GitLab 代码审查、HR/IAM 权限流转' },
      { name: '对外商业化', desc: 'AI Agent 服务商快速搭建自有品牌 AI 助手，低成本 SaaS 化交付' },
      { name: '教育教学辅助', desc: '学校部署 AI 辅导助手，按班级/学科分配 Token 配额，家校可审计' },
      { name: '知识沉淀', desc: '个人 OpenClaw Memory + CBS 快照 + 团队 COS + 企业 CLS 日志全文检索' }
    ],
    pricing: {
      model: '席位费 + Token 消耗 +（可选）模型 API 费用',
      startingPrice: '百元起步，1 席即可开通；CVM Ai2 机型刊例价为标准型 40%',
      discountPolicy: '年付 8 折，千席位以上 7 折，战略客户一事一议；可与 CodeBuddy / WorkBuddy / TokenHub 联卖组合优惠',
      freeTier: '公测阶段首批企业邀测免费体验 30 天，含专家团队配置引导'
    },
    competition: [
      { rival: '微软 Microsoft 365 Copilot', ourAdvantage: '数据不出境 + 信创合规 + 三级 Token 配额 + 物理隔离 + 价格 50%+' },
      { rival: '阿里云 百炼企业版', ourAdvantage: '与 Lighthouse 同源同构、多租户物理隔离更彻底、IM 生态更广、Skill 供应链扫描独家' },
      { rival: '字节 扣子企业版', ourAdvantage: '三级 Token 配额独家、企业级审计更完善、不锁模型' },
      { rival: '百度 千帆 AgentBuilder 企业版', ourAdvantage: 'OpenClaw 百万级用户沉淀 + ClawHub Skills 生态 + 全托管' },
      { rival: '客户自建方案', ourAdvantage: '部署效率提升 80%、环境统一率 100%、省去运维/安全/迭代投入，TCO 最低' }
    ],
    pitches: [
      {
        scene: '初次接触 - 开场白',
        script: '"X 总好，腾讯云 ClawPro 是企业版 OpenClaw，底层和支撑百万用户的 Lighthouse 同源同构，10 分钟就能给全员配上专属 AI 助手。核心解决三个问题：怎么统一管 Token 成本、怎么做合规审计、怎么避免 AI 供应链风险。想先了解一下贵司员工用 AI 的现状，以及有没有遇到成本失控或合规压力？"'
      },
      {
        scene: '成本失控痛点',
        script: '"很多企业都反映员工私自用各种 AI 工具，Token 账单每月爆表但说不清钱花在哪。ClawPro 的**三级配额体系**就是为这个设计的：企业总额度 → 部门额度 → 个人额度，逐级校验、实时大盘。某头部客户上线后一个月就把月度 AI 成本降了 35%。"'
      },
      {
        scene: '合规 / 安全关注',
        script: '"金融和政务客户最关心合规。ClawPro 做到**四层纵深防护**：第一层 AI 资产可见，第二层全链路审计日志，第三层每员工独立 CVM 物理隔离（不是逻辑隔离）+ 随机端口隐身，第四层 Skill 上架前供应链扫描。已经在多家金融客户落地，等保三级 + 金融级审计都过了。"'
      },
      {
        scene: '价格敏感客户',
        script: '"ClawPro 百元起步就能开，1 席也能买。底层用我们专门给 AI 优化的 Ai2 机型，刊例价只有标准 CVM 的 40%，算下来比自建一套 Agent 平台便宜 60%+。年付 8 折、千席位 7 折。要不先从一个部门 50-100 席位试点？"'
      },
      {
        scene: '已有 OpenClaw 个人版客户',
        script: '"您已经在用 OpenClaw 说明对 Agent 生态很认可。ClawPro 完全兼容 OpenClaw 的 Skill 和镜像，ClawHub 的 1.3 万+ Skills 可以直接用。升级到企业版可以拿到：三级 Token 配额、统一管控台、企业级审计、物理隔离、一键全员升级——个人版解决不了的企业规模化问题都在这里。"'
      },
      {
        scene: '联卖 CodeBuddy / WorkBuddy',
        script: '"ClawPro 管控全局、CodeBuddy 覆盖研发场景、WorkBuddy 覆盖办公场景、TokenHub 锁定 Token 采购价——四件套组合是我们对大客户的标准打法。集团层面由 ClawPro 统一管控 Token 配额和安全合规，研发和白领分别用 CodeBuddy / WorkBuddy，整体 TCO 比分散采购低 40%+。"'
      }
    ],
    cases: [
      { customer: '腾讯集团内部', industry: '互联网', effect: '全员 OpenClaw 承载 10 万+ 员工 AI 助手，日均 Token 消耗百亿级，ClawPro 统一管控配额与合规' },
      { customer: '某股份制银行', industry: '金融', effect: '3000 席 ClawPro 部署，物理隔离 + 全链路审计过等保三级，月度 AI 成本下降 35%' },
      { customer: '某省级政务云', industry: '政务', effect: '公务员 AI 助手统一部署，按委办局分配部门配额，审计日志对接纪检监察' },
      { customer: '某头部教育集团', industry: '教育', effect: '按校区 / 学科三级配额，AI 辅导助手覆盖 50 万师生，成本降 40%' },
      { customer: '某 AI Agent SaaS 厂商', industry: 'AI SaaS', effect: '基于 ClawPro 搭建自有品牌 AI 助手，SaaS 化交付给 200+ 中小企业客户' },
      { customer: '腾讯音乐 TME', industry: '在线音乐', effect: '集团级 AI Token 统一管控，替代多云分散采购，预估节省 30%+ AI 成本' }
    ],
    faq: [
      {
        q: 'ClawPro 和 OpenClaw 个人版什么关系？',
        a: '同源同构。OpenClaw 是个人版（Lighthouse 上自部署，免费/低价），ClawPro 是企业版（管控台 + 三级配额 + 物理隔离 + 审计 + 企业 IM 接入）。企业版完全兼容个人版的 Skill 和镜像，ClawHub 的 1.3 万+ Skills 可直接复用。'
      },
      {
        q: '三级 Token 配额具体怎么实现？',
        a: '企业 → 部门 → 个人三级。请求时依次校验三级余额，任一级不足即阻断。管理员后台可视化大盘实时看消耗，支持配额调整、告警、超限通知。避免少数高频用户耗尽整月预算。'
      },
      {
        q: '四层安全防护具体指什么？',
        a: '看得见（AI 资产盘点：谁在用、用什么）、审得了（全链路对话与操作审计日志）、管得住（每员工独立 CVM 实例物理隔离 + 10000-40000 随机端口 + 安全组精细管控）、扫得全（Skill 上架前供应链扫描，类似 npm audit）。'
      },
      {
        q: '支持哪些大模型和 IM？',
        a: '模型：混元、DeepSeek、GLM、Claude、Qwen 等任意主流大模型可接入，企业自选或 BYOK（自带密钥）。IM：企业微信、QQ、飞书、钉钉四大平台首发，其中 QQ 和飞书支持扫码即接入。'
      },
      {
        q: '部署方式和交付时间？',
        a: 'SaaS 化一键开通，10 分钟完成企业级上线。管理员三步：选套餐 → 配模型 → 发员工链接/二维码。员工扫码申领，1 分钟内开始对话。支持多版本并存、一键全员升级、业务数据不丢失。'
      },
      {
        q: '可以私有化部署吗？',
        a: '支持。ClawPro 默认 SaaS 全托管，对金融、政务、数据不出网场景提供本地化/分布式部署方案，可对接客户 VPC、自有 IDC，交付周期 2-4 周。'
      },
      {
        q: '和 CodeBuddy / WorkBuddy 是什么关系？',
        a: 'ClawPro 是**管控层**（企业级 AI 统一管控平台），CodeBuddy 是**研发场景 AI**（IDE 内 AI 编程），WorkBuddy 是**办公场景 AI**（混元 IM + 办公 Agent）。三者可独立销售，联卖时 ClawPro 管全局 + CodeBuddy/WorkBuddy 覆盖员工侧，TokenHub 锁 Token 价，构成标准的四件套组合方案。'
      },
      {
        q: '定价明细有吗？',
        a: '公测阶段百元起步，1 席即可开通。席位费 + Token 消耗 + 模型 API 费（自带模型可免）。Ai2 机型刊例价 40%，年付 8 折、千席位 7 折、战略客户一事一议。详细报价表请联系腾讯云商务。'
      }
    ],
    materials: [
      { name: 'ClawPro 官方产品文档', url: 'https://cloud.tencent.com/document/product/213/129156', type: '链接' },
      { name: 'ClawPro 管控端介绍', url: 'https://cloud.tencent.com/document/product/213/129158', type: '链接' },
      { name: 'ClawPro 用户端介绍', url: 'https://cloud.tencent.com/document/product/213/129159', type: '链接' },
      { name: 'ClawPro 企业版产品概要（开发者社区）', url: 'https://cloud.tencent.cn/developer/article/2648114', type: '链接' },
      { name: 'ClawPro 实战解读（CSDN）', url: 'https://blog.csdn.net/u014354882/article/details/159894669', type: '链接' },
      { name: 'ClawPro 乐享产品资料库（内部）', url: 'https://csig.lexiangla.com/teams/k100006/docs/50ba2418327511f1993eceb137c2be1e?company_from=csig', type: '文档' },
      { name: 'ClawPro 销售一页纸（PPT）', url: '#', type: 'PPT' },
      { name: 'ClawPro vs 百炼/扣子竞品对比白皮书', url: '#', type: 'PDF' },
      { name: 'ClawPro 产品演示视频（8 分钟版）', url: '#', type: '视频' }
    ],
    contact: 'clawpro-bd',
    lastUpdate: '2026-04-20',
    sourceUrl: 'https://csig.lexiangla.com/teams/k100006/docs/50ba2418327511f1993eceb137c2be1e?company_from=csig'
  },
  {
    id: 3,
    productName: '腾讯云 TokenHub',
    productCode: 'TokenHub（原 MaaS 升级版）',
    category: 'AI 大模型',
    tag: '战略',
    priority: '高',
    logo: '🔌',
    oneLiner: '一套 API 调所有大模型，Token Plan 统一计费，Agent 时代的模型调度中枢',
    overview: `## 一、产品定位
TokenHub 是腾讯云**大模型服务聚合平台**，由原 MaaS（Model as a Service）升级而来，于 **2026 年 3 月 27 日腾讯云上海城市峰会**正式发布，是腾讯 **Agent 产品全景图"第一层模型底座"** 的核心基础设施。

向下承接混元、DeepSeek、MiniMax、Kimi、GLM 等**主流国产大模型**（含腾讯自研 + 第三方）；向上为 ClawPro、CodeBuddy、WorkBuddy、OpenClaw、ADP 等 Agent 产品线提供**统一模型调用能力**。

## 二、产品架构
- **多模型聚合层**：聚合 20+ 主流大模型（文本/图像/视频/3D 全模态），统一模型 ID
- **协议兼容层**：**同时兼容 OpenAI 与 Anthropic 两大协议**，仅替换 base_url 即可迁移
- **智能路由（Auto 模型）**：算法自动匹配最优模型，用户无需手动选择
- **Token Plan 计费**：积分制 + 月度预算订阅（100 积分 = 1 元），类似"话费套餐"
- **精细管控**：多 API Key、独占额度 / 共享池、TPM 限速、实时监控大盘

## 三、核心差异
- **从按次调用 → 统一套餐计费**："Token 即货币，Agent 即员工"，企业可预算化管理 AI 支出
- **一套 API 调所有模型**：不用为每家模型维护独立 SDK 和账单
- **比直连省 50%+**：Token Plan 套餐价相比直接调用文本生成服务节省 **50% 以上**
- **与 OpenClaw Task Router 理念一致**，但额外带审计、计费、治理能力`,
    coreValue: [
      '一套 API 调所有模型：混元 / DeepSeek / MiniMax / Kimi / GLM 等 20+ 模型统一接入',
      '双协议兼容：同时支持 OpenAI 和 Anthropic 协议，现有应用仅改 base_url 即可迁移',
      'Token Plan 月度订阅：个人 39 元起、企业 5000 元起，比直连大模型节省 50%+',
      'Auto 智能路由：自动匹配最优模型，开发者无需手动选型',
      '企业级管控：多 API Key、独占额度 / 共享池、TPM 限速、实时监控大盘',
      '全模态覆盖：文本、图像、视频、3D 四大类生成模型一站式接入',
      '工具生态广：无缝对接 CodeBuddy / Cursor / Cline / Claude Code / Codex / OpenClaw 等',
      '主备高可用：境内境外主备双接入地址（.com / .cn），金融级容灾'
    ],
    diff: [
      '对标 OpenRouter（海外）：国产模型覆盖更全、信创合规、价格降 50%+、数据不出境',
      '对标 硅基流动 SiliconFlow：Token Plan 月度订阅独家，比按量计费更适合企业预算管理',
      '对标 火山方舟 / 阿里百炼：同时兼容 OpenAI + Anthropic 协议，生态工具覆盖更广',
      '对标 直连各厂商 API：省去多账单、多 SDK、多计费体系的管理成本',
      '对标 原 MaaS 平台：从"模型托管"升级为"Agent 时代调度中枢"，贯穿全产品线'
    ],
    targetCustomers: [
      'AI 应用开发者 / 独立开发者（想用多模型但不想管多账单）',
      '企业 AI 平台团队（需要给业务线分配模型额度并精细化管控）',
      'AI Agent / SaaS 服务商（需要灵活切换模型优化成本）',
      '大模型应用创业公司（追求极致性价比，预算敏感）',
      '传统企业 AI 转型（需要低门槛接入多家国产大模型）',
      '已采购 OpenAI / Anthropic API 的客户（零迁移成本切换到国产）',
      '腾讯云 ClawPro / CodeBuddy / WorkBuddy 存量客户（联卖锁价）'
    ],
    scenes: [
      { name: 'AI 编程工具接入', desc: '给 Cursor / Cline / CodeBuddy Code / Claude Code / Codex 配置 Token Plan，月订阅解决 Token 焦虑' },
      { name: 'Agent 应用开发', desc: '用 Auto 模型智能路由：简单任务用小模型、关键决策用旗舰模型，成本智能最优' },
      { name: '多模型灰度切换', desc: '一套 API 下线 OpenAI 换成混元/DeepSeek，零代码改造' },
      { name: '企业级多项目管控', desc: '每个项目独立 API Key、独占额度 + 共享池兜底，避免额度抢占' },
      { name: '全模态内容生成', desc: '文本 + 图像（HY-Image）+ 视频（HY-Video）+ 3D（HY-3D）统一入口' },
      { name: 'ClawPro 联卖锁价', desc: 'ClawPro 管控 + TokenHub 锁 Token 价，企业 AI 成本可预测可预算' },
      { name: '海内外一体化部署', desc: '境内 tokenhub.tencentmaas.com、境外 tokenhub-intl.tencentmaas.com 主备双通道' },
      { name: '存量 MaaS 客户升级', desc: '原 MaaS 客户平滑升级 TokenHub，保留能力 + 获得 Token Plan 降价' }
    ],
    pricing: {
      model: '积分制 + 月度订阅（100 积分 = 1 元），支持按量付费与套餐订阅双模式',
      startingPrice: '个人版 Lite 套餐 39 元/月（3500 万 Tokens）；企业版 5000 元/月起（步长 5000 元，最高 20000 元/月）',
      discountPolicy: '个人版 4 档（Lite 39 / Standard 99 / Pro 299 / Max 599），档位越高单价越低；年付享折扣；企业千席位及以上可一事一议',
      freeTier: '新用户注册赠送体验额度；Token Plan 新客户首月可享体验价'
    },
    competition: [
      { rival: 'OpenRouter（海外多模型路由）', ourAdvantage: '国产模型覆盖全 + 信创合规 + 数据不出境 + 价格降 50%+' },
      { rival: '硅基流动 SiliconFlow', ourAdvantage: 'Token Plan 月度订阅独家、双协议兼容、企业管控更完善' },
      { rival: '火山方舟 / 阿里百炼', ourAdvantage: '同时兼容 OpenAI + Anthropic 协议、工具生态更广（Cursor/Claude Code/Codex 全兼容）' },
      { rival: '直连各家大模型官方 API', ourAdvantage: '一套 API 代替 N 套、统一账单统一计费、整体省 50%+' },
      { rival: '原 MaaS 平台', ourAdvantage: '从模型托管升级为 Agent 调度中枢，新增 Token Plan 和统一 API 能力' }
    ],
    pitches: [
      {
        scene: '初次接触 - 开场白',
        script: '"X 总好，腾讯云 TokenHub 是大模型服务聚合平台，一句话概括：**一套 API 调所有大模型，Token Plan 月度订阅比直连省 50%+**。它是腾讯 Agent 全景图的第一层模型底座。想请教下贵司现在用几家大模型？多账单、多 SDK 管理起来是不是挺头疼的？"'
      },
      {
        scene: '开发者 / AI 应用团队',
        script: '"如果您已经在用 Cursor / Claude Code / Cline 这类工具，配置 TokenHub 只需要改一个 base_url：把 OpenAI 地址换成 `tokenhub.tencentmaas.com/plan/v3`，API Key 换一下，立刻就能用混元、DeepSeek、Kimi 等所有国产模型。个人 Lite 套餐 39 元/月给您 3500 万 Tokens，够用 70 轮以上编程问答。"'
      },
      {
        scene: '企业多模型管控场景',
        script: '"贵司如果不同业务线要用不同模型，TokenHub 的企业版 Token Plan 就是为这个设计的：月预算 5000-20000 元起步，支持**多 API Key + 独占积分 + 共享池**机制，每个项目既有专属额度又能用共享池兜底，TPM 限速避免单个应用抢光资源，还有全账号实时大盘。"'
      },
      {
        scene: '成本敏感客户',
        script: '"直接调 OpenAI 在国内既慢又贵，直连各家大模型还要维护多套 SDK 和账单。TokenHub Token Plan 套餐价比直连省 **50% 以上**，而且一套 API 打通所有模型，研发侧再也不用重复接入。某头部 AI 创业公司迁移到 TokenHub 后，月度 Token 成本下降 55%。"'
      },
      {
        scene: '信创 / 合规关注客户',
        script: '"OpenAI 和 Anthropic 在国内访问受限且数据出境。TokenHub **同时兼容 OpenAI 和 Anthropic 两套协议**，把原来发给国外的请求无缝切到国产模型（混元/DeepSeek/GLM/Kimi），零代码改造、数据不出境、过信创。现有应用仅替换 base_url 即可完成迁移。"'
      },
      {
        scene: 'ClawPro / CodeBuddy 联卖',
        script: '"TokenHub 是腾讯 AI 战略的**Token 锁价层**，和 ClawPro（管控层）、CodeBuddy（研发 AI）、WorkBuddy（办公 AI）是标准四件套打法。组合方案：**ClawPro 管企业级配额 + CodeBuddy/WorkBuddy 覆盖员工使用场景 + TokenHub 锁 Token 采购价**，集团级 AI 成本可预测、可预算、可审计。"'
      }
    ],
    cases: [
      { customer: '腾讯内部 AI 产品线', industry: '互联网', effect: 'WorkBuddy / CodeBuddy / QClaw / ADP 全部通过 TokenHub 调度，日均万亿 Token 消耗' },
      { customer: '某头部 AI 编程工具服务商', industry: 'AI SaaS', effect: '从自接多家模型 API 迁移到 TokenHub，研发成本下降 60%、月度 Token 费省 55%' },
      { customer: '某金融科技公司', industry: '金融', effect: '将 Claude API 调用切换到 TokenHub Anthropic 兼容入口，零代码改造、过信创合规' },
      { customer: '某在线教育平台', industry: '教育', effect: 'Auto 模型智能路由：简单答疑用小模型、深度辅导用混元 2.0 Think，综合成本降 42%' },
      { customer: '腾讯音乐 TME', industry: '在线音乐', effect: '集团级 Token Plan 统一采购，替代多云多厂商分散采购，预估节省 30%+ AI 支出' },
      { customer: '某 AI Agent 独角兽', industry: 'AI 创业', effect: 'Token Plan Max 套餐（599 元/月，6.5 亿 Tokens）承载多 Agent 协同研发，ROI 显著' }
    ],
    faq: [
      {
        q: 'TokenHub 和 MaaS 是什么关系？',
        a: 'TokenHub 是原 MaaS（Model as a Service）平台的**直接升级版本**，不是另起炉灶。MaaS 时代是"把模型搬上云"，TokenHub 时代是"让模型像水电一样统一计量、灵活切换"，新增了统一 API、Token Plan 订阅、多 Key 管控等 Agent 时代核心能力。存量 MaaS 客户可平滑迁移。'
      },
      {
        q: '支持哪些大模型？',
        a: '**文本**：混元（HY 2.0 Think / Instruct / Role）、DeepSeek（v3.2 / v3.1 / r1）、Kimi（K2.5 / K2-Thinking / K2-Turbo）、MiniMax（M2.5 / M2.7）、GLM（5 / 5.1）+ Auto 智能路由。**图像**：HY-Image V3.0 / Lite。**视频**：HY-Video 1.5、YT-Video 2.0 / HumanActor / FX。**3D**：HY-3D 3.0 / 3.1 / Express。持续接入新模型。'
      },
      {
        q: 'Token Plan 套餐怎么选？',
        a: '**个人版 4 档**：Lite 39 元（3500 万 Tokens，新手尝鲜）、Standard 99 元（1 亿 Tokens，日常办公/轻量开发）、Pro 299 元（3.2 亿 Tokens，高频开发）、Max 599 元（6.5 亿 Tokens，重度用户/多 Agent 协同）。**企业版**：月预算 5000-20000 元起，支持多 Key 精细管理、独占积分、共享池。'
      },
      {
        q: '怎么接入？改造成本多大？',
        a: '**零成本迁移**。TokenHub 同时兼容 OpenAI 和 Anthropic 协议，你只需要：① 换 base_url（`https://tokenhub.tencentmaas.com/plan/v3` 或 `/plan/anthropic`）② 换 API Key ③ 换 model 字段即可。无需修改业务代码，OpenAI SDK / Anthropic SDK 完全复用。'
      },
      {
        q: 'Token Plan 和按量计费有啥区别？',
        a: 'Token Plan 是**月度订阅**，类似"话费套餐"，价格比按量计费便宜 50%+，适合可预期稳定用量的团队/企业。按量计费（100 积分=1 元）适合临时性、突发性、不可预测的调用。两种模式可以共存。'
      },
      {
        q: '有速率限制和退款政策吗？',
        a: '按套餐等级动态分配 TPM，优先级 **Max > Pro > Standard > Lite**。⚠️ **Token Plan 不支持退款**，订阅前请谨慎；**严禁账号共享**和 API 形式的后端批量调用（Token Plan 仅限 AI 工具交互使用），违规可能封号。企业版可通过按量计费补充突发用量。'
      },
      {
        q: '和 ClawPro / CodeBuddy / WorkBuddy 怎么配合销售？',
        a: '标准四件套：**ClawPro（管控层） + CodeBuddy（研发场景 AI） + WorkBuddy（办公场景 AI） + TokenHub（Token 锁价层）**。ClawPro 管企业配额和安全合规；CodeBuddy/WorkBuddy 是员工侧的 AI 应用；TokenHub 锁 Token 采购价。联卖组合方案 TCO 比分散采购低 40%+。'
      },
      {
        q: '支持私有化或专属部署吗？',
        a: '默认 SaaS 全托管（境内境外双接入地址主备容灾）。对金融、政务等数据不出网场景，可通过 TDMQ 专线 + 客户 VPC 对接实现逻辑专属，企业大客户可咨询定制化混合部署方案。'
      }
    ],
    materials: [
      { name: 'TokenHub 官方产品文档', url: 'https://cloud.tencent.com/document/product/1823', type: '链接' },
      { name: 'TokenHub 快速入门（企业版）', url: 'https://cloud.tencent.com/document/product/1823/130660', type: '链接' },
      { name: 'Token Plan 套餐概览', url: 'https://cloud.tencent.com.cn/document/product/1823/130060', type: '链接' },
      { name: 'TokenHub API 使用说明', url: 'https://cloud.tencent.cn/document/product/1823/130078', type: '链接' },
      { name: 'Token Plan 产品 PDF', url: 'https://main.qcloudimg.com/raw/document/product/pdf/1823_130657_cn.pdf', type: 'PDF' },
      { name: '腾讯 Agent 全景图发布会新闻', url: 'https://news.qq.com/rain/a/20260401A0689P00', type: '链接' },
      { name: 'TokenHub 深度拆解（老金的分享）', url: 'https://laojin.blog/blog/20260328_tencent_agent_landscape', type: '链接' },
      { name: '从 MaaS 到 TokenHub（观察者网）', url: 'https://www.guancha.cn/economy/2026_03_29_811780.shtml', type: '链接' },
      { name: 'Token Plan 购买页', url: 'https://console.cloud.tencent.com/tokenhub/tokenplan', type: '链接' },
      { name: 'TokenHub 销售一页纸（PPT）', url: '#', type: 'PPT' },
      { name: 'TokenHub vs OpenRouter / SiliconFlow 竞品对比', url: '#', type: 'PDF' },
      { name: 'TokenHub 产品演示视频', url: '#', type: '视频' }
    ],
    contact: 'tokenhub-bd',
    lastUpdate: '2026-04-20',
    sourceUrl: 'https://cloud.tencent.com/document/product/1823'
  }
]

// 分类配置
export const salesGuideCategories = [
  { value: 'all', label: '全部产品' },
  { value: 'AI 大模型', label: 'AI 大模型' },
  { value: 'AI 研发', label: 'AI 研发' },
  { value: 'AI 办公', label: 'AI 办公' },
  { value: '智能客服', label: '智能客服' },
  { value: '音视频', label: '音视频' },
  { value: '安全', label: '安全' },
  { value: '数据库', label: '数据库' },
  { value: '基础算力', label: '基础算力' },
  { value: '行业解决方案', label: '行业解决方案' }
]
