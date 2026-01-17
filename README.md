
# Markdown → PDF (TypeScript Demo)

一个基于 TypeScript 的 Markdown 转 PDF 工具，支持代码高亮、中文字体、表格和图片。

## 安装

```bash
npm install
npm run build
```

## 使用方法

### 基本用法

```bash
# 使用默认文件 (input/1.md)
npm start

# 指定要处理的 Markdown 文件
npm start -- -f 1.md
npm start -- -f 2.md
npm start -- --file 3.md
```

### 输出格式

生成的 PDF 文件将保存在 `output/` 目录下，文件名格式为：
- `output_文件名_时间戳.pdf`
- 例如：`output_1_1768617037.pdf`

### 项目结构

```
.
├── input/          # 输入的 Markdown 文件目录
│   ├── 1.md
│   ├── 2.md
│   └── ...
├── output/         # 输出的 PDF 文件目录
├── src/
│   └── index.ts    # 主程序
└── README.md
```

## 特性

- ✅ 支持代码语法高亮（基于 highlight.js）
- ✅ 优秀的中文字体渲染
- ✅ 支持表格、图片、引用块
- ✅ 命令行参数支持
- ✅ 自动文件名生成


## 目前遗留问题
- 非系统图标，可能无法正确展示，不好适配解决
- 一些模块样式的微调