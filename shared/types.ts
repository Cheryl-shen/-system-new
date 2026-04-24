/**
 * 全局共享的领域类型（前后端都引）
 */

export interface CustomerRecord {
  id: string;
  name: string;
  createdAt: string;
}

export type ReportStatus = 'draft' | 'submitted' | 'archived';

/** 一张截图（存 Base64） */
export interface ReportImage {
  /** data:image/png;base64,... 形式 */
  dataUrl: string;
  caption?: string;
  /** 字节数，便于前端做限制 */
  size?: number;
}

/** 单个重点事项 */
export interface KeyInitiative {
  id: string;
  title: string;            // 事项标题，如"出海项目"
  isRequired?: boolean;     // 出海/流量为必填
  description: string;      // 事项描述
  todos: string[];          // ToDo 列表
  alignments: Array<{ date: string; content: string }>; // X月X日对齐情况
  blockers: string;         // 卡点
}

/**
 * 汇报的结构化数据（表单模式下前端填这份，后端按它生成 HTML）
 */
export interface ReportContent {
  /** 经营数据 */
  businessData: {
    /** 1-3月累计完成情况截图 */
    q1Completion: ReportImage | null;
    /** 长账龄情况说明（纯文字） */
    agingDescription: string;
    /** 全年损益预估截图 */
    fullYearEstimate: ReportImage | null;
  };
  /** 客户情况刷新（富文本 HTML） */
  customerRefresh: {
    /** TCO 情况刷新 */
    tcoSituation: string;
    /** 产品技术交流情况 */
    techExchange: string;
  };
  /** 重点事项列表 */
  keyInitiatives: KeyInitiative[];
}

/** 汇报记录（存 KV 的完整体） */
export interface ReportRecord {
  id: string;
  customerId: string;
  customerName: string;
  /** 汇报日期，格式 YYYY-MM-DD */
  reportDate: string;
  /** 结构化内容 */
  content: ReportContent;
  /** 自动生成的规范 HTML，预览 / 导出用 */
  generatedHtml: string;

  status: ReportStatus;
  createdBy: string;
  createdByDisplay: string;
  createdAt: string;
  updatedBy: string;
  updatedByDisplay: string;
  updatedAt: string;
  version: number;
  archivedBy?: string;
  archivedAt?: string;
}

/** 列表接口用的精简信息 */
export interface ReportSummary {
  id: string;
  customerId: string;
  customerName: string;
  reportDate: string;
  status: ReportStatus;
  updatedAt: string;
  updatedByDisplay: string;
  version: number;
}

export function toReportSummary(r: ReportRecord): ReportSummary {
  return {
    id: r.id,
    customerId: r.customerId,
    customerName: r.customerName,
    reportDate: r.reportDate,
    status: r.status,
    updatedAt: r.updatedAt,
    updatedByDisplay: r.updatedByDisplay,
    version: r.version
  };
}
