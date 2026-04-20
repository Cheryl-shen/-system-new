// 产品售卖指引数据
export const productGuideData = {
  // 大背景
  background: {
    strategic: [
      {
        title: '1.1 腾讯战略层',
        items: [
          '2026年AI投资至少翻倍；2025年元宝+混元投入已达18亿元',
          '战略从"赋能现有业务"升级为"创造全新应用"',
          'Pony首谈"养虾"构想：Agent将与微信去中心化生态深度结合',
          '<strong>对一线意义</strong>：内部资源、产品迭代、高层重视度均在历史高位'
        ]
      },
      {
        title: '1.2 市场层',
        table: [
          { key: '中国AI大模型日均Token消耗', value: '140万亿+（2年增长1400倍）' },
          { key: '中国大模型周调用量', value: '4.69万亿Token（连续两周反超美国）' },
          { key: '企业AI支出占IT预算比例', value: '超20%（2年前不足10%）' },
          { key: '企业进入集采流程比例', value: '60%以上（2025年）' }
        ]
      },
      {
        title: '1.3 客户信号应对',
        items: [
          '客户对AI从观望转向实操，预算开始落地',
          'ToB决策链路缩短，销售周期有望压缩',
          '竞争加剧，需快速建立产品+服务壁垒'
        ]
      }
    ]
  },

  // 行业分析
  industry: {
    industries: [
      {
        name: '电商',
        icon: '🛒',
        directions: [
          '智能客服升级：从规则匹配到意图理解',
          '商品推荐优化：基于用户画像的精准推荐',
          '供应链智能：库存预测、补货建议'
        ],
        products: ['混元大模型', '智能数智人', 'TI平台']
      },
      {
        name: '物流',
        icon: '🚚',
        directions: [
          '运力调度优化：实时路径规划',
          '仓储管理智能化：拣货路径优化',
          '配送预测：需求预测与资源匹配'
        ],
        products: ['混元大模型', '企业AI智能体管控平台']
      },
      {
        name: '音视频',
        icon: '🎬',
        directions: [
          '内容审核自动化：AI内容安全',
          '智能剪辑：自动内容生成',
          '直播电商：虚拟主播、实时翻译'
        ],
        products: ['腾讯混元大模型', '内容安全四件套', '智能数智人']
      },
      {
        name: '社交',
        icon: '💬',
        directions: [
          '智能推荐：兴趣匹配算法',
          '内容生成：AI头像、表情',
          '风控能力：社区治理、反欺诈'
        ],
        products: ['混元大模型', 'TI平台', '内容安全四件套']
      }
    ]
  },

  // 产品全景
  products: {
    categories: [
      {
        name: '腾讯大模型（3款）',
        color: 'blue',
        products: [
          { name: '腾讯混元大模型', desc: '千亿参数大模型，支持文本/图像/视频多模态' },
          { name: '大模型服务平台 TokenHub', desc: '一站式Token管理，成本优化' },
          { name: '智能体开发平台 ADP', desc: '低代码Agent开发，快速落地' }
        ]
      },
      {
        name: '企业AI管控（1款）🆕',
        color: 'purple',
        products: [
          { name: '企业AI智能体管控平台 ClawPro', desc: '企业级Agent管理，安全可控' }
        ]
      },
      {
        name: 'AI应用产品（7款）',
        color: 'yellow',
        products: [
          { name: '人脸核身', desc: '远程身份核验' },
          { name: '智能数智人', desc: '数字人直播/客服' },
          { name: '腾讯同传', desc: '实时翻译服务' },
          { name: '内容安全四件套', desc: 'AI内容审核' },
          { name: '企业级AI办公助手 WorkBuddy', desc: '智能办公协作' }
        ]
      },
      {
        name: 'AI平台产品（2款）',
        color: 'red',
        products: [
          { name: 'TI平台（MLOps）', desc: '机器学习全生命周期管理' },
          { name: '觅影开放实验平台', desc: '医疗AI研究平台' }
        ]
      }
    ]
  },

  // 售卖案例
  cases: [
    {
      title: '案例一：电商智能客服升级',
      background: '某头部电商平台，日均客服对话量超10万次，人工客服成本高、响应时效不稳定',
      strategy: [
        '1. 诊断痛点：客服响应慢、重复问题多、夜间覆盖不足',
        '2. 方案设计：混元大模型+智能数智人+TI平台',
        '3. 实施路径：4周POC验证 → 8周全量上线 → 持续优化'
      ],
      result: {
        metrics: [
          { label: '响应时效', before: '平均3分钟', after: '平均30秒' },
          { label: '人力成本', before: '100人团队', after: '20人+AI' },
          { label: '客户满意度', before: '4.2/5', after: '4.7/5' }
        ]
      }
    },
    {
      title: '案例二：物流运力智能调度',
      background: '某物流集团，日均配送订单50万单，运力调度依赖经验',
      strategy: [
        '1. 数据梳理：历史订单、运力、时效数据',
        '2. 方案设计：混元大模型+企业AI智能体管控平台',
        '3. 实施路径：6周算法开发 → 4周系统对接 → 2周上线'
      ],
      result: {
        metrics: [
          { label: '调度时效', before: 'T+1', after: '实时' },
          { label: '空载率', before: '25%', after: '8%' },
          { label: '配送成本', before: '5元/单', after: '3.5元/单' }
        ]
      }
    },
    {
      title: '案例三：内容审核效率提升',
      background: '某视频平台，日均新增内容500万条，人工审核压力大',
      strategy: [
        '1. 需求分析：UGC内容审核、热点监测、合规检测',
        '2. 方案设计：混元大模型+内容安全四件套',
        '3. 实施路径：2周部署 → 1周调优 → 持续迭代'
      ],
      result: {
        metrics: [
          { label: '审核时效', before: '平均2小时', after: '平均5分钟' },
          { label: '审核准确率', before: '92%', after: '98%' },
          { label: '人力节省', before: '200人', after: '50人' }
        ]
      }
    }
  ]
}
