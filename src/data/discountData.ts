// 报价折扣数据
export const discountData = [
  {
    id: 1,
    category: '五档',
    customerLevel: '战略客户',
    discountRange: '8-9折',
    conditions: '年度合同，预付款50%以上，优先保障资源供给',
    approvalFlow: '销售 → 销售总监 → VP审批',
    notes: '战略客户需单独评估，可突破折扣底线',
    sortOrder: 1
  },
  {
    id: 2,
    category: '五档',
    customerLevel: '大客户',
    discountRange: '8.5-9.5折',
    conditions: '季度合同，预付款30%以上',
    approvalFlow: '销售 → 销售总监审批',
    notes: '需满足最低消费门槛',
    sortOrder: 2
  },
  {
    id: 3,
    category: '五档',
    customerLevel: '中客户',
    discountRange: '9-9.5折',
    conditions: '月度合同，预付款10%以上',
    approvalFlow: '销售 → 销售总监审批',
    notes: '无',
    sortOrder: 3
  },
  {
    id: 4,
    category: '五档',
    customerLevel: '小客户',
    discountRange: '9.5-10折',
    conditions: '无折扣或微幅折扣',
    approvalFlow: '销售审批',
    notes: '小客户以标准价为主',
    sortOrder: 4
  },
  {
    id: 5,
    category: '高价值客户',
    customerLevel: '头部互联网',
    discountRange: '7-8折',
    conditions: '年度大单，深度合作，资源置换',
    approvalFlow: '销售 → 总监 → VP → 总裁审批',
    notes: '需单独商务方案，不适用标准折扣',
    sortOrder: 5
  },
  {
    id: 6,
    category: '高价值客户',
    customerLevel: '政府/金融',
    discountRange: '8-8.5折',
    conditions: '框架合同，分期付款，合规要求',
    approvalFlow: '销售 → 总监 → VP审批',
    notes: '需法务审核，合规审批',
    sortOrder: 6
  },
  {
    id: 7,
    category: '普通客户',
    customerLevel: '商业客户',
    discountRange: '9-9.8折',
    conditions: '标准合同，按月付款',
    approvalFlow: '销售审批',
    notes: '适用标准折扣体系',
    sortOrder: 7
  },
  {
    id: 8,
    category: '普通客户',
    customerLevel: '教育/医疗',
    discountRange: '8.5-9折',
    conditions: '行业政策支持，批量采购优惠',
    approvalFlow: '销售 → 总监审批',
    notes: '需行业解决方案支持',
    sortOrder: 8
  }
]

// 分类配置
export const discountCategories = [
  { value: 'all', label: '全部类型' },
  { value: '五档', label: '五档折扣', count: 4 },
  { value: '高价值客户', label: '高价值客户', count: 2 },
  { value: '普通客户', label: '普通客户', count: 2 }
]
