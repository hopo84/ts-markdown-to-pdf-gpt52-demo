#!/bin/bash

# Markdown 批量转换脚本
# 使用 Docker 批量处理 input 目录下的所有 .md 文件

echo "========================================="
echo "Markdown 批量转 PDF 工具"
echo "========================================="
echo ""

# 检查 input 目录是否存在
if [ ! -d "input" ]; then
    echo "❌ 错误: input 目录不存在！"
    exit 1
fi

# 检查是否有 .md 文件
if ! ls input/*.md 1> /dev/null 2>&1; then
    echo "❌ 错误: input 目录下没有找到 .md 文件！"
    exit 1
fi

# 统计文件数量
file_count=$(ls input/*.md | wc -l)
echo "📁 找到 $file_count 个 Markdown 文件"
echo ""

# 创建 output 目录（如果不存在）
mkdir -p output

# 计数器
count=0
success=0
failed=0

# 遍历所有 .md 文件
for file in input/*.md; do
    count=$((count + 1))
    filename=$(basename "$file")
    
    echo "[$count/$file_count] 正在处理: $filename"
    
    # 使用 Docker Compose 运行转换
    if docker-compose run --rm md-to-pdf npm start -- -f "$filename"; then
        success=$((success + 1))
        echo "✅ 成功: $filename"
    else
        failed=$((failed + 1))
        echo "❌ 失败: $filename"
    fi
    
    echo ""
done

echo "========================================="
echo "转换完成！"
echo "========================================="
echo "总计: $file_count 个文件"
echo "✅ 成功: $success 个"
echo "❌ 失败: $failed 个"
echo ""
echo "输出目录: ./output/"
echo "========================================="
