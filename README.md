# 动物偶遇图鉴

一个把“路上随手拍到的小动物”认真收藏起来的 AI web app。

上传照片后，系统会识别动物、生成一段带情绪的小日志，并把这次偶遇收进你的个人图鉴里。它不是科研工具，也不是宠物社区，更像一本会慢慢长大的城市动物观察手账。

## 项目亮点

- AI 识别照片中的常见城市动物，并生成趣味日志
- 支持手动编辑标题、物种、地点和正文，AI 失败时也能继续保存
- 时间线按季度浏览，支持展开查看单条记录详情
- 地图模式查看偶遇分布，支持定位和地点修正
- 图鉴模式按动物大类收集，展示完成度和最近发现
- 报告页提供时间窗口统计、AI 个性化洞察和成就系统
- 支持单条记录分享与整本图鉴分享
- 匿名登录即可使用，无需注册

## 为什么做这个

很多人手机里都有“今天路上遇到一只猫”这种照片，但它们最后通常只是躺在相册里。这个项目想做的不是更专业的物种数据库，而是把这些轻微却真实的生活瞬间，变成一份值得回看的个人记录。

## 核心功能

### 1. AI 偶遇记录

用户上传照片后，后端调用 OpenRouter 识别动物，并生成标题与日志。生成结果可以继续手动修改，识别失败时也提供可编辑空卡片，不会中断记录流程。

### 2. 时间线与详情

记录会以季度维度分组展示，支持卡片展开、查看大图、编辑内容和删除确认，适合回看某一段时间里遇见过哪些动物。

### 3. 地图与图鉴

地图页负责回答“我在哪里遇见过它们”，图鉴页负责回答“我已经收集到哪些动物”。两种浏览维度一起构成了项目的收藏感。

### 4. 报告、成就与分享

报告页会根据最近三个月或自然年生成统计摘要和 AI 洞察，成就系统负责制造一点游戏化动力，分享功能则让单次偶遇和整本图鉴都可以被展示出去。

## 技术栈

- 前端：React + Vite + Tailwind CSS
- 后端：Vercel Functions
- 数据库：Supabase PostgreSQL
- 认证：Supabase Anonymous Auth
- AI：OpenRouter API
- 地图：高德地图 JS API
- 部署：Vercel

## 架构说明

- 前端负责拍照上传、记录编辑、时间线/地图/图鉴/报告等交互体验
- Vercel Functions 负责代理 AI 识别、洞察生成和记录读写，避免把密钥暴露到前端
- Supabase 负责匿名用户认证、记录存储、事件埋点与分享数据
- 数据隔离通过 Supabase RLS 实现

## 本地开发

安装依赖：

```bash
npm install
```

启动本地环境：

```bash
vercel dev
```

在项目根目录创建 `.env` 文件：

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
VITE_AMAP_KEY=
VITE_AMAP_SECURITY_CODE=
```

如果需要参考变量模板，可查看 `.env.example`。

## 项目状态

当前已完成从“基础记录工具”到“可持续使用的个人动物观察产品”的主链路搭建，包含：

- 记录创建、编辑、删除
- 地图浏览与地点修正
- 图鉴聚合与批量删除
- 报告页、AI 洞察、成就系统
- 回头客识别
- 分享功能
- 识别失败兜底
- 核心行为埋点

更细的版本演进记录见 [progress.md](./progress.md)。

## 线上地址

> 当前线上版本部署在 Vercel，国内网络环境下访问可能不稳定

https://animal-diary-kris-kris-kris-projects.vercel.app
## 体验建议
  该项目当前主要面向手机端使用场景设计。电脑端访问时，建议在浏览器开发者工具中切换到手机尺寸进行体验，以获得更接近真实使
  用场景的效果。受开发时间限制，本次版本优先完成了移动端核心流程，后续会继续优化更完整的多端适配体验。

## 界面预览
<img width="396" height="857" alt="image" src="https://github.com/user-attachments/assets/390a8d40-78f6-4211-8ad1-49bed2804c7d" />

<img width="396" height="857" alt="image" src="https://github.com/user-attachments/assets/f61ed043-0ef5-4f90-89ac-04008cfd224f" />

<img width="396" height="857" alt="image" src="https://github.com/user-attachments/assets/551f402b-e82e-4a34-bcb6-03d1b658e3a4" />

<img width="396" height="857" alt="image" src="https://github.com/user-attachments/assets/689ae8dd-e4d3-4d7a-ac51-a92ee0c30ada" />

<img width="396" height="857" alt="image" src="https://github.com/user-attachments/assets/c118a1e7-91ec-4b03-89a4-83d3eb095a3a" />

<img width="396" height="857" alt="image" src="https://github.com/user-attachments/assets/aaf660d9-7415-460b-bb98-fed75ea4ec2c" />

<img width="349" height="804" alt="image" src="https://github.com/user-attachments/assets/f956e4e1-149f-4cad-bb7f-32aeaa9d0254" />



