# Docker 部署指南

## 项目概述

这是一个 **AI 驱动的动物偶遇图鉴应用**，采用以下技术栈：

- **前端**：React 19 + Vite + Tailwind CSS
- **后端**：Vercel Functions (Node.js)
- **数据库**：Supabase (PostgreSQL + Auth)
- **AI 服务**：OpenRouter API
- **地图服务**：高德地图 API
- **部署**：Docker + Vercel

---

## 功能说明

### 核心功能（已完成）

✅ **照片上传 + AI 识别**
- 用户上传动物照片
- 后端调用 OpenRouter API（Gemini 2.5 Flash Lite）自动识别物种
- AI 生成趣味观察日志

✅ **偶遇记录管理**
- 保存识别结果到 Supabase
- 支持编辑、删除、分享单条记录
- 本地数据隐私（用户数据与设备绑定）

✅ **多维浏览**
- **时间线**：按季度分组展示记录
- **地图**：高德地图标记所有偶遇位置
- **图鉴**：按物种大类聚合展示（猫、狗、鸟等）
- **报告**：年度/季度总结数据 + AI 个性化洞察

✅ **高级功能**
- 回头客识别：AI 判断是否为同一只动物
- 成就系统：5 个解锁目标激发收集欲
- 分享卡片：生成精美分享图片

---

## Docker 快速开始

### 前置条件

1. 安装 [Docker](https://www.docker.com/get-started) 和 [Docker Compose](https://docs.docker.com/compose/install/)
2. 准备以下 API 密钥：
   - Supabase 项目（免费）
   - OpenRouter API Key
   - 高德地图 API Key（可选，不配置时地图功能不可用）

### 步骤 1：准备环境变量

```bash
# 复制环境变量模板
cp .env.docker .env

# 编辑 .env，填入你的实际密钥
nano .env
```

需要填写的内容：

```env
# Supabase（从 https://supabase.com 获取）
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# OpenRouter（从 https://openrouter.ai/keys 获取）
OPENROUTER_API_KEY=sk-or-v1-your_api_key_here

# 高德地图（从 https://lbs.amap.com 获取，可选）
VITE_AMAP_KEY=your_amap_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here

# Supabase 服务角色密钥（用于后端操作）
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 步骤 2：本地构建和测试

```bash
# 方式 A: 使用 Docker Compose（推荐）
docker-compose up --build

# 方式 B: 手动构建和运行
docker build -t animal-diary:latest .
docker run -p 3000:3000 --env-file .env animal-diary:latest
```

### 步骤 3：访问应用

打开浏览器，访问 `http://localhost:3000`

---

## Docker 镜像结构

### Dockerfile 多阶段构建

```
构建阶段 (builder)
  ├─ Node 20 Alpine
  ├─ npm install
  └─ npm run build → dist/

生产阶段
  ├─ Node 20 Alpine (轻量)
  ├─ serve (静态服务器)
  ├─ 复制 dist/ (前端)
  ├─ 复制 api/  (后端)
  └─ npm ci --only=production
```

**优势**：
- 最终镜像仅包含生产依赖，大小更小
- 构建层可缓存，加快重建速度
- 安全性提升（不暴露开发依赖）

---

## 部署到挑战赛平台

### 方案 A: 上传 Docker 镜像

如果挑战赛平台支持 Docker 镜像上传：

```bash
# 构建镜像
docker build -t animal-diary:v1.0 .

# 标记镜像（假设上传到 Docker Hub）
docker tag animal-diary:v1.0 <your-username>/animal-diary:v1.0

# 登录 Docker Hub
docker login

# 推送镜像
docker push <your-username>/animal-diary:v1.0
```

然后在平台上填入镜像地址：`<your-username>/animal-diary:v1.0`

### 方案 B: 上传源代码 + Dockerfile

如果平台会自动构建镜像，上传整个项目，包括：

```
animal-diary/
├── Dockerfile          ← 平台会自动读取此文件
├── docker-compose.yml  ← 平台可选读取
├── .dockerignore       ← 优化镜像大小
├── package.json
├── vite.config.js
├── src/
├── api/
└── ... (其他项目文件)
```

### 方案 C: 生成部署文档（推荐提交方式）

创建 `DEPLOYMENT.md` 文档说明如何部署：

```markdown
# 部署说明

## 环境变量配置

本应用需要以下环境变量：

- `VITE_SUPABASE_URL`: Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `OPENROUTER_API_KEY`: OpenRouter API 密钥
- `VITE_AMAP_KEY`: 高德地图 API Key（可选）
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 服务角色密钥

## Docker 运行

\`\`\`bash
docker build -t animal-diary .
docker run -p 3000:3000 --env-file .env animal-diary
\`\`\`

## 访问

应用运行在 http://localhost:3000
```

---

## 环境变量说明

### 前端环境变量（必需）

| 变量 | 说明 | 获取方式 |
|------|------|---------|
| `VITE_SUPABASE_URL` | Supabase 项目地址 | Supabase Dashboard → Settings → API → URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase Dashboard → Settings → API → anon key |
| `VITE_AMAP_KEY` | 高德地图 API Key | https://lbs.amap.com → 申请 API Key |
| `VITE_AMAP_SECURITY_CODE` | 高德地图安全码 | 申请 API Key 时获得 |

### 后端环境变量（可选，用于 API 调用）

| 变量 | 说明 | 获取方式 |
|------|------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API 密钥 | https://openrouter.ai/keys |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | Supabase Dashboard → Settings → API → Service Role Secret |

---

## 故障排查

### Docker 镜像构建失败

**症状**：`npm install` 阶段卡住或超时

```bash
# 尝试清除缓存重新构建
docker build --no-cache -t animal-diary:latest .
```

### 应用启动后白屏

**症状**：访问 http://localhost:3000 显示空白页面

**原因**：前端环境变量未正确加载

**解决**：
1. 检查 `.env` 文件是否存在且正确
2. 确保 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已填写
3. 查看浏览器控制台 (F12) 是否有错误信息

### 地图功能不可用

**原因**：`VITE_AMAP_KEY` 未配置或无效

**解决**：
1. 从 https://lbs.amap.com 申请 API Key
2. 将 Key 和 Security Code 填入 `.env`
3. 重新构建镜像

### API 识别失败

**原因**：`OPENROUTER_API_KEY` 未配置或余额不足

**解决**：
1. 访问 https://openrouter.ai/keys 检查 API Key
2. 确保账户有足够余额（可以免费试用 $5）
3. 重新构建镜像

---

## 镜像大小优化

当前 Dockerfile 使用以下优化策略：

1. **多阶段构建**：分离构建和生产环境
2. **Alpine 基础镜像**：比 Ubuntu 小 10 倍
3. **生产依赖**：仅安装必要的依赖（`npm ci --only=production`）
4. **.dockerignore**：排除不必要的文件

典型镜像大小：~250-300 MB（包含所有依赖）

---

## 性能考虑

### 前端构建优化

- Vite 默认启用代码分割（React、Swiper、Supabase 单独分包）
- CSS 压缩和树摇（Tailwind CSS）
- 静态资源压缩

### 后端 API 优化

- Vercel Functions 无冷启动（Fluid Compute）
- AI 调用 25 秒超时保护
- 数据库查询索引优化

---

## 下一步

1. **准备环境变量文件** `.env`
2. **本地测试**：`docker-compose up`
3. **验证功能**：上传照片 → AI 识别 → 保存记录
4. **提交到平台**：选择合适的部署方式

---

## 技术支持

有问题？检查以下文档：

- **项目 PRD**：`PRD.md`
- **开发进度**：`progress.md`
- **设计规范**：`design.md`
- **Git 工作流**：`GIT_WORKFLOW.md`

---

**最后更新**：2026-05-06  
**项目版本**：v1.0 (数据驱动 + 体验优化完成)
