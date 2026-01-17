# Docker 部署指南

本文档详细说明如何使用 Docker 部署和运行 Markdown to PDF 转换工具。

## 📋 前置要求

- Docker 已安装（版本 20.10 或更高）
- Docker Compose 已安装（可选，但推荐）

## 🚀 快速开始

### 方法 1：使用 Docker Compose（推荐）

#### 1. 构建镜像

```bash
docker-compose build
```

#### 2. 运行容器（处理默认文件）

```bash
docker-compose up
```

#### 3. 处理指定的 Markdown 文件

```bash
# 处理 input/1.md
docker-compose run --rm md-to-pdf npm start -- -f 1.md

# 处理 input/2.md
docker-compose run --rm md-to-pdf npm start -- -f 2.md

# 处理 input/3.md
docker-compose run --rm md-to-pdf npm start -- -f 3.md
```

### 方法 2：使用 Docker 命令

#### 1. 构建镜像

```bash
docker build -t ts-markdown-to-pdf:latest .
```

#### 2. 运行容器

```bash
# 基本用法
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  ts-markdown-to-pdf:latest

# 指定处理的文件
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  ts-markdown-to-pdf:latest \
  npm start -- -f 1.md
```

## 📁 目录挂载说明

### 挂载的目录

- **`./input`** → `/app/input` - Markdown 源文件目录
- **`./output`** → `/app/output` - 生成的 PDF 文件目录

### 目录结构示例

```
ts-markdown-to-pdf-gpt52-demo/
├── input/              # 本地 Markdown 文件目录
│   ├── 1.md
│   ├── 2.md
│   └── 3.md
├── output/             # 本地 PDF 输出目录
│   ├── output_1_1768617529.pdf
│   └── output_2_1768617530.pdf
├── Dockerfile
├── docker-compose.yml
└── ...
```

## 🔧 高级使用

### 批量处理多个文件

创建一个脚本来批量处理：

**`batch-convert.sh`**
```bash
#!/bin/bash

# 批量处理 input 目录下的所有 .md 文件
for file in input/*.md; do
    filename=$(basename "$file")
    echo "正在处理: $filename"
    docker-compose run --rm md-to-pdf npm start -- -f "$filename"
done

echo "所有文件处理完成！"
```

使用方法：
```bash
chmod +x batch-convert.sh
./batch-convert.sh
```

### 自定义配置

如果需要修改 Docker Compose 配置：

**`docker-compose.yml`**
```yaml
version: '3.8'

services:
  md-to-pdf:
    build: .
    image: ts-markdown-to-pdf:latest
    container_name: md-to-pdf-converter
    volumes:
      - ./input:/app/input
      - ./output:/app/output
    # 设置环境变量（如果需要）
    environment:
      - NODE_ENV=production
    # 内存限制（如果处理大文件）
    mem_limit: 2g
    # CPU 限制
    cpus: 2
```

## 🐛 故障排除

### 1. 权限问题

如果遇到输出文件的权限问题：

```bash
# 在 Linux 上，可能需要调整权限
chmod -R 777 output/
```

或者在 Dockerfile 中添加用户：

```dockerfile
# 创建非 root 用户
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser
```

### 2. 中文字体显示问题

如果 PDF 中的中文显示异常，确保 Dockerfile 中已安装中文字体：

```dockerfile
RUN apt-get update && apt-get install -y \
    fonts-wqy-zenhei \
    fonts-wqy-microhei \
    fonts-noto-cjk
```

### 3. 内存不足

处理大文件时可能需要增加内存：

```bash
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  --memory="2g" \
  ts-markdown-to-pdf:latest \
  npm start -- -f large-file.md
```

### 4. 查看容器日志

```bash
# 使用 docker-compose
docker-compose logs

# 使用 docker
docker logs md-to-pdf-converter
```

## 🎯 生产环境建议

### 1. 使用多阶段构建优化镜像大小

```dockerfile
# 构建阶段
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM node:20-slim
# ... 安装依赖
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
```

### 2. 健康检查

在 docker-compose.yml 中添加：

```yaml
healthcheck:
  test: ["CMD", "node", "--version"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### 3. 使用卷标签

```yaml
volumes:
  - type: bind
    source: ./input
    target: /app/input
    read_only: true  # 输入目录设为只读
  - type: bind
    source: ./output
    target: /app/output
```

## 📊 性能优化

### 1. 缓存 node_modules

```bash
# 创建 volume 来缓存 node_modules
docker volume create md-pdf-node-modules

docker run --rm \
  -v md-pdf-node-modules:/app/node_modules \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  ts-markdown-to-pdf:latest
```

### 2. 使用 BuildKit

```bash
# 启用 BuildKit 加速构建
DOCKER_BUILDKIT=1 docker build -t ts-markdown-to-pdf:latest .
```

## 🔄 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t ts-markdown-to-pdf:latest .
      
      - name: Test conversion
        run: |
          docker run --rm \
            -v ${{ github.workspace }}/input:/app/input \
            -v ${{ github.workspace }}/output:/app/output \
            ts-markdown-to-pdf:latest \
            npm start -- -f 1.md
```

## 📝 常用命令速查

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up

# 后台运行
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 进入容器调试
docker-compose exec md-to-pdf sh

# 清理所有容器和镜像
docker-compose down --rmi all --volumes

# 重新构建并启动
docker-compose up --build
```

## 🌐 网络访问（扩展）

如果未来需要添加 Web API 接口：

```yaml
services:
  md-to-pdf:
    # ...
    ports:
      - "3000:3000"  # 映射端口
```

## 📚 更多资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Puppeteer Docker 指南](https://pptr.dev/guides/docker)

---

**提示**：首次运行可能需要较长时间来下载依赖和构建镜像，后续运行会快得多。
