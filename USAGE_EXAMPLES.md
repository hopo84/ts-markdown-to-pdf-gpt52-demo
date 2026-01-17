# 使用示例

本文档提供了详细的使用示例和最佳实践。

## 📝 基本使用

### 1. 处理 Markdown 文件

```bash
# 处理单个 Markdown 文件
npm start -- -f 1.md

# 输出示例：
# 正在处理文件: input/1.md (MD)
# 📝 使用 Markdown 渲染器处理...
# PDF generated: output/output_1_1768634149.pdf
```

### 2. 处理 HTML 文件

```bash
# 处理单个 HTML 文件
npm start -- -f test.html

# 输出示例：
# 正在处理文件: input/test.html (HTML)
# 🌐 直接读取 HTML 内容...
# PDF generated: output/output_test_1768634159.pdf
```

## 🎨 文件类型对比

### Markdown (.md)
**适用场景：**
- 技术文档、博客文章
- 需要代码高亮的文档
- 需要 Markdown 语法的内容

**示例输入 (sample.md)：**
```markdown
# 标题

这是一个**加粗**文本和*斜体*文本。

## 代码块

```javascript
function hello() {
    console.log("Hello World!");
}
```

## 列表

- 项目 1
- 项目 2
- 项目 3
```

**处理命令：**
```bash
npm start -- -f sample.md
```

### HTML (.html)
**适用场景：**
- 已有的 HTML 页面
- 需要精确控制样式的内容
- 复杂的网页布局

**示例输入 (page.html)：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>示例页面</title>
</head>
<body>
    <h1>这是 HTML 页面</h1>
    <p>直接从 HTML 转换为 PDF</p>
    
    <div style="background: #f0f0f0; padding: 20px;">
        <p>可以使用自定义样式</p>
    </div>
</body>
</html>
```

**处理命令：**
```bash
npm start -- -f page.html
```

## 🔄 批量处理

### 处理多个文件

```bash
# 方法 1：逐个处理
npm start -- -f 1.md
npm start -- -f 2.md
npm start -- -f test.html

# 方法 2：使用脚本
for file in input/*.md; do
    filename=$(basename "$file")
    npm start -- -f "$filename"
done
```

### Shell 脚本示例

创建 `convert-all.sh`:

```bash
#!/bin/bash

echo "开始批量转换..."

# 转换所有 Markdown 文件
for file in input/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "处理: $filename"
        npm start -- -f "$filename"
    fi
done

# 转换所有 HTML 文件
for file in input/*.html; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "处理: $filename"
        npm start -- -f "$filename"
    fi
done

echo "转换完成！"
```

使用：
```bash
chmod +x convert-all.sh
./convert-all.sh
```

## 🎯 高级用例

### 1. 从外部 API 获取内容

```javascript
// fetch-and-convert.js
const fs = require('fs');
const { execSync } = require('child_process');

async function fetchAndConvert(url, outputName) {
    // 从 API 获取 HTML 内容
    const response = await fetch(url);
    const html = await response.text();
    
    // 保存为 HTML 文件
    fs.writeFileSync(`input/${outputName}.html`, html);
    
    // 转换为 PDF
    execSync(`npm start -- -f ${outputName}.html`);
}

// 使用示例
fetchAndConvert('https://api.example.com/page', 'api-page');
```

### 2. 动态生成 HTML

```javascript
// generate-html.js
const fs = require('fs');

function generateReport(data) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>报告</title>
</head>
<body>
    <h1>数据报告</h1>
    <table>
        <thead>
            <tr>
                <th>项目</th>
                <th>数值</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.value}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
    `;
    
    fs.writeFileSync('input/report.html', html);
    console.log('HTML 生成完成！');
}

// 使用示例
const data = [
    { name: '销售额', value: '100万' },
    { name: '利润', value: '20万' }
];

generateReport(data);
```

然后转换：
```bash
npm start -- -f report.html
```

## ⚠️ 注意事项

### 1. 文件编码
确保输入文件使用 **UTF-8** 编码，特别是包含中文内容的文件。

### 2. 图片路径
- **Markdown**: 使用相对路径或绝对 URL
- **HTML**: 可以使用 base64 编码或外部 URL

```markdown
# Markdown 中的图片
![描述](https://example.com/image.png)
![本地图片](./images/photo.jpg)
```

```html
<!-- HTML 中的图片 -->
<img src="https://example.com/image.png" alt="描述">
<img src="data:image/png;base64,iVBORw0KG..." alt="Base64">
```

### 3. CSS 样式
HTML 文件中的内联样式会被保留，但程序会应用全局样式表。如需完全自定义样式，建议在 HTML 中使用 `<style>` 标签。

### 4. 输出文件命名
- 输出文件格式：`output_文件名_时间戳.pdf`
- 时间戳为秒级 Unix 时间戳
- 文件名会自动移除扩展名

示例：
```
1.md → output_1_1768634149.pdf
test.html → output_test_1768634159.pdf
```

## 🐛 故障排除

### 问题 1: 文件不存在
```bash
错误: 文件 "input/example.md" 不存在！
```
**解决方案：** 确保文件在 `input/` 目录下

### 问题 2: 不支持的文件类型
```bash
错误: 不支持的文件类型！仅支持 .md 和 .html 文件
```
**解决方案：** 只能处理 `.md` 和 `.html` 文件

### 问题 3: 中文乱码
**解决方案：** 
1. 确保文件使用 UTF-8 编码
2. 在 HTML 中添加 `<meta charset="UTF-8">`

### 问题 4: 图片不显示
**解决方案：**
- 使用完整的 HTTP/HTTPS URL
- 或使用 base64 编码的图片
- 本地相对路径可能无法正常显示

## 📊 性能建议

### 处理大文件
对于较大的文件（> 10MB），建议：
1. 增加 Node.js 内存限制
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm start -- -f large.md
   ```
2. 分割为多个小文件处理

### 批量处理优化
```bash
# 并行处理（小心系统资源）
npm start -- -f 1.md & \
npm start -- -f 2.md & \
npm start -- -f 3.md & \
wait
echo "所有任务完成"
```

## 🎓 最佳实践

1. **文件组织**：将相关文件放在同一目录下
2. **命名规范**：使用有意义的文件名
3. **版本控制**：将生成的 PDF 添加到 `.gitignore`
4. **定期清理**：定期清理 `output/` 目录
5. **测试先行**：先用小文件测试，再处理大文件

## 📚 更多资源

- [Markdown 语法指南](https://www.markdownguide.org/)
- [HTML 参考文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [Puppeteer 文档](https://pptr.dev/)

---

**提示**：如有问题，请查看项目的 README.md 或提交 Issue。
