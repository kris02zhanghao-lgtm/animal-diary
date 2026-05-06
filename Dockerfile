# 第一阶段：构建前端
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 第二阶段：生产镜像
FROM node:20-alpine

WORKDIR /app

# 安装轻量级静态服务器
RUN npm install -g serve

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 复制api文件夹
COPY --from=builder /app/api ./api

# 复制package.json用于生产环境运行
COPY --from=builder /app/package*.json ./

# 安装生产依赖（仅用于api）
RUN npm ci --only=production

# 暴露端口
EXPOSE 3000 5173

CMD ["serve", "-s", "dist", "-l", "3000"]
