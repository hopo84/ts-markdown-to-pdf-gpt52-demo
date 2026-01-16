
import fs from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import MarkdownIt from "markdown-it";
import puppeteer from "puppeteer";
import hljs from "highlight.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// HTML 转义函数
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function main() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str: string, lang?: string): string {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs" style="background: #191922 !important; color: #e8eaf6 !important; padding: 16px 20px; border-radius: 8px; border: 1px solid #3e4451; margin: 16px 0; font-family: \'SF Mono\', Monaco, \'Cascadia Code\', \'Roboto Mono\', Consolas, \'Courier New\', monospace; tab-size: 4; white-space: pre; overflow-x: auto;"><code style="background: transparent !important; color: #e8eaf6 !important; font-family: inherit; font-size: 13px; line-height: 1.5; display: block; padding: 0; margin: 0;">' +
                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                 '</code></pre>';
        } catch (__) {}
      }
      return '<pre class="hljs" style="background: #191922 !important; color: #e8eaf6 !important; padding: 16px 20px; border-radius: 8px; border: 1px solid #3e4451; margin: 16px 0; font-family: \'SF Mono\', Monaco, \'Cascadia Code\', \'Roboto Mono\', Consolas, \'Courier New\', monospace; tab-size: 4; white-space: pre; overflow-x: auto;"><code style="background: transparent !important; color: #e8eaf6 !important; font-family: inherit; font-size: 13px; line-height: 1.5; display: block; padding: 0; margin: 0;">' + escapeHtml(str) + '</code></pre>';
    }
  });
  const markdown = fs.readFileSync("sample.md", "utf-8");
  const htmlBody = md.render(markdown);

  // 读取 highlight.js 的 Atom One Dark 主题 CSS（黑底白字）
  const highlightCss = fs.readFileSync(
    require.resolve("highlight.js/styles/atom-one-dark.css"),
    "utf-8"
  );

  const html = `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        /* 强制 PDF 打印时保留背景色和颜色 */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        ${highlightCss}
        /* 强制覆盖所有 highlight.js 样式，确保黑底白字 */
        pre.hljs,
        pre.hljs code,
        .hljs,
        .hljs * {
          background: #191922 !important;
          color: #e8eaf6 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        /* 确保所有代码块都是黑底 */
        pre {
          background: #191922 !important;
          color: #e8eaf6 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        pre code {
          background: transparent !important;
          color: #e8eaf6 !important;
        }
        /* 覆盖 highlight.js 中所有可能的语法高亮颜色，统一使用浅色 */
        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-literal,
        .hljs-title,
        .hljs-section,
        .hljs-doctag,
        .hljs-type,
        .hljs-name,
        .hljs-strong,
        .hljs-string,
        .hljs-number,
        .hljs-emphasis,
        .hljs-attr,
        .hljs-symbol,
        .hljs-bullet,
        .hljs-code,
        .hljs-addition,
        .hljs-deletion,
        .hljs-variable,
        .hljs-template-variable,
        .hljs-link,
        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-meta,
        .hljs-comment,
        .hljs-quote,
        .hljs-built_in,
        .hljs-function,
        .hljs-class,
        .hljs-params,
        .hljs-operator,
        .hljs-punctuation,
        .hljs-property,
        .hljs-attribute,
        .hljs-subst,
        .hljs-tag,
        .hljs-regexp {
          color: #e8eaf6 !important;
          background: transparent !important;
        }
        /* 确保所有 span 元素也使用正确的颜色 */
        pre.hljs code span,
        pre.hljs code * {
          color: #e8eaf6 !important;
          background: transparent !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
            "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
          line-height: 1.7;
          padding: 40px;
        }
        /* 标题样式 - 统一使用深蓝色 */
        h1, h2, h3, h4, h5, h6 {
          margin-top: 1.2em;
          color: #354869 !important;
          font-weight: 600;
        }
        h1 {
          margin-bottom: 0.8em;
          font-size: 2em;
        }
        h2 {
          margin-bottom: 0.6em;
          font-size: 1.5em;
        }
        h3 {
          margin-bottom: 0.5em;
          font-size: 1.25em;
        }
        img { max-width: 100%; margin: 20px 0; }
        /* 加粗文字样式 - 统一使用深蓝色 */
        strong, b {
          font-weight: 600;
          color: #354869 !important;
        }
        /* 表格样式 */
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
          border: 2px solid #354869;
          font-size: 14px;
        }
        thead {
          background-color: #f5f7fa;
        }
        th {
          background-color: #f5f7fa;
          color: #354869;
          font-weight: 600;
          padding: 12px 16px;
          text-align: left;
          border: 1px solid #354869;
        }
        td {
          padding: 10px 16px;
          border: 1px solid #354869;
          color: #333;
        }
        tr:nth-child(even) {
          background-color: #fafbfc;
        }
        tr:hover {
          background-color: #f0f2f5;
        }
        /* 确保所有代码块都应用黑底白字样式 */
        pre {
          padding: 16px 20px;
          border-radius: 8px;
          overflow-x: auto;
          overflow-y: hidden;
          margin: 16px 0;
          background: #191922 !important;
          background-color: #191922 !important;
          border: 1px solid #3e4451;
          tab-size: 4;
          -moz-tab-size: 4;
          white-space: pre;
          word-wrap: normal;
          font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        pre.hljs {
          background: #191922 !important;
          background-color: #191922 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        pre code {
          font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
          font-size: 13px;
          line-height: 1.5;
          color: #e8eaf6 !important;
          background: transparent !important;
          padding: 0;
          margin: 0;
          display: block;
          white-space: pre;
          tab-size: 4;
          -moz-tab-size: 4;
          font-variant-ligatures: none;
          font-feature-settings: "liga" 0;
        }
        pre code * {
          font-family: inherit;
          color: inherit;
        }
        /* 行内代码 */
        code:not(pre code) {
          font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
          background: #191922;
          color: #e8eaf6;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      ${htmlBody}
    </body>
  </html>
  `;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // 生成秒级时间戳
  const timestamp = Math.floor(Date.now() / 1000);
  const outputPath = `output/output_${timestamp}.pdf`;

  await page.pdf({
    path: outputPath,
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    printBackground: true  // 强制打印背景色
  });

  await browser.close();
  console.log(`PDF generated: ${outputPath}`);
}

main();
