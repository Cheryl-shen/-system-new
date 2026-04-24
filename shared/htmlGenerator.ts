/**
 * 汇报 HTML 生成器
 * 给定结构化内容 + 客户信息 + 汇报人，输出规范 HTML 字符串
 *
 * 设计原则：
 *   - 前后端都能用（只用字符串拼接，不依赖任何运行时）
 *   - 所有用户可控文本都经过 HTML 实体转义，防 XSS
 *   - 富文本字段（customerRefresh.*）已经由前端用 DOMPurify 清洗过，
 *     这里直接内联（否则会连 <p> 都被转义掉）
 */

import type { ReportContent } from './types';

/** HTML 实体转义，处理纯文本内容 */
export function escapeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 保留换行符的纯文本段落渲染 */
function renderPlainText(text: string): string {
  if (!text || !text.trim()) return '<p class="empty-hint">（暂无内容）</p>';
  return text
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

/** 富文本字段：信任前端清洗后的结果，直接内联，仅在为空时兜底 */
function renderRichHtml(html: string): string {
  if (!html || !html.replace(/<[^>]*>/g, '').trim()) {
    return '<p class="empty-hint">（暂无内容）</p>';
  }
  return html;
}

function renderImage(
  img: { dataUrl: string; caption?: string } | null,
  placeholderCaption: string
): string {
  if (!img || !img.dataUrl) {
    return `<div class="image-box empty">
      <div class="image-caption">${escapeHtml(placeholderCaption)}（暂未上传截图）</div>
    </div>`;
  }
  return `<div class="image-box">
    <img src="${img.dataUrl}" alt="${escapeHtml(img.caption || placeholderCaption)}" />
    <div class="image-caption">${escapeHtml(img.caption || placeholderCaption)}</div>
  </div>`;
}

function renderInitiative(init: ReportContent['keyInitiatives'][number], index: number): string {
  const indexLabel = ['事项一', '事项二', '事项三', '事项四', '事项五', '事项六', '事项七', '事项八', '事项九', '事项十'][index] || `事项${index + 1}`;

  const todos = init.todos.filter((t) => t.trim()).map((t) => `<li>${escapeHtml(t)}</li>`).join('');
  const todoBlock = todos
    ? `<p><strong>ToDo（会议中由运营补齐）</strong></p><ul>${todos}</ul>`
    : `<p><strong>ToDo（会议中由运营补齐）</strong></p><ul><li class="empty-hint">（暂未填写）</li></ul>`;

  const alignments = init.alignments
    .filter((a) => a.date.trim() || a.content.trim())
    .map((a) => `<li><strong>${escapeHtml(a.date)}：</strong>${escapeHtml(a.content)}</li>`)
    .join('');
  const alignBlock = alignments
    ? `<p><strong>对齐情况</strong></p><ul>${alignments}</ul>`
    : '';

  const blockerBlock = init.blockers.trim()
    ? `<div class="blocker"><strong>卡点</strong><br/>${escapeHtml(init.blockers)}</div>`
    : `<div class="blocker empty"><strong>卡点</strong><br/><span class="empty-hint">暂无</span></div>`;

  return `<div class="initiative">
    <h4>${escapeHtml(indexLabel)}：${escapeHtml(init.title)}</h4>
    <div class="desc">${renderPlainText(init.description)}</div>
    ${todoBlock}
    ${alignBlock}
    ${blockerBlock}
  </div>`;
}

export interface RenderMeta {
  customerName: string;
  reportDate: string;       // YYYY-MM-DD
  reporterDisplay: string;  // 汇报人显示名
  generatedAt: string;      // ISO
}

/** 把 reportDate (2026-04-20) 转成 "2026.4" 样式，贴近你给的模板 */
function formatDateShort(isoDate: string): string {
  if (!isoDate) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return isoDate;
  return `${m[1]}.${Number(m[2])}`;
}

export function generateReportHtml(
  content: ReportContent,
  meta: RenderMeta
): string {
  const title = `战略客户部YTD总结及后续规划 -- ${meta.customerName}`;
  const dateShort = formatDateShort(meta.reportDate);

  const styles = `
    :root { --primary: #006EFF; --text: #1f2937; --muted: #6b7280; --bg: #f8fafc; --border: #e5e7eb; }
    * { box-sizing: border-box; }
    body { font-family: "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; color: var(--text); max-width: 960px; margin: 0 auto; padding: 40px 48px; line-height: 1.8; background: #fff; }
    h1 { text-align: center; font-size: 22px; margin: 0 0 8px; font-weight: 700; }
    .date { text-align: center; color: var(--muted); margin-bottom: 32px; font-size: 14px; }
    h2 { font-size: 17px; margin-top: 36px; border-bottom: 2px solid var(--primary); padding-bottom: 8px; color: var(--primary); }
    h3 { font-size: 15px; margin-top: 24px; color: #1f2937; }
    h4 { font-size: 14px; margin-top: 16px; color: #374151; }
    p { margin: 8px 0; }
    .empty-hint { color: #9ca3af; font-style: italic; }
    .image-box { border: 1px dashed var(--border); padding: 12px; margin: 12px 0; text-align: center; background: var(--bg); border-radius: 6px; }
    .image-box.empty { padding: 32px 12px; }
    .image-box img { max-width: 100%; height: auto; border-radius: 4px; }
    .image-caption { color: var(--muted); font-size: 12px; margin-top: 8px; }
    .initiative { background: var(--bg); padding: 16px 20px; margin: 18px 0; border-left: 4px solid var(--primary); border-radius: 0 6px 6px 0; }
    .initiative h4 { margin-top: 0; color: var(--primary); font-size: 15px; }
    .initiative .desc p { margin: 4px 0; }
    ul { margin: 6px 0; padding-left: 22px; }
    li { margin: 4px 0; }
    .blocker { background: #fff7ed; padding: 12px 14px; border-radius: 4px; margin-top: 12px; border-left: 3px solid #f97316; font-size: 14px; }
    .blocker.empty { background: #f9fafb; border-left-color: #d1d5db; }
    .intro { color: #4b5563; font-size: 14px; margin-bottom: 8px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid var(--border); color: #9ca3af; font-size: 12px; text-align: center; }
  `.trim();

  const initiativesHtml = content.keyInitiatives.length
    ? content.keyInitiatives.map((init, i) => renderInitiative(init, i)).join('')
    : `<p class="empty-hint">（暂未填写重点事项）</p>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<style>${styles}</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="date">${escapeHtml(dateShort)}</div>

  <h2>一、经营情况与客户变动</h2>

  <h3>1、26年经营数据及全年完成情况预估</h3>

  <h4>1）1-3月累计完成情况</h4>
  ${renderImage(content.businessData.q1Completion, '可截图系统，预计4月13日出3月终稿')}

  <h4>2）长账龄情况说明</h4>
  <div class="aging">${renderPlainText(content.businessData.agingDescription)}</div>

  <h4>3）全年损益预估</h4>
  ${renderImage(content.businessData.fullYearEstimate, '可刷新系统后截图')}

  <h3>2、客户情况刷新</h3>

  <h4>1）客户业务TCO情况刷新</h4>
  <div class="rich">${renderRichHtml(content.customerRefresh.tcoSituation)}</div>

  <h4>2）客户业务产品技术交流情况</h4>
  <div class="rich">${renderRichHtml(content.customerRefresh.techExchange)}</div>

  <h2>二、2026年重点事项</h2>
  <p class="intro">出海、流量等方向覆盖，可以写多个，此两项必须包含；后续事项进展全部以本文档更新为主，其他相关内容可以作为项目补充内容链接进来。</p>

  ${initiativesHtml}

  <div class="footer">
    生成时间：${escapeHtml(meta.generatedAt)} &nbsp;|&nbsp; 汇报人：${escapeHtml(meta.reporterDisplay)} &nbsp;|&nbsp; 战略客户部 · 华南拓展中心
  </div>
</body>
</html>`;
}
