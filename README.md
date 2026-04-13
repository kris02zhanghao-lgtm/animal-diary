# 动物偶遇图鉴

用 AI 记录城市中偶遇小动物的个人图鉴 web app。上传照片，AI 自动识别动物种类并生成趣味日志，保存到专属图鉴中慢慢回味。

## 功能

- 上传照片，AI 自动识别动物种类并生成偶遇日志
- 支持手动编辑 AI 生成的内容
- 按季度分组展示偶遇记录
- 卡片展开查看大图与完整日志
- 匿名登录，数据与设备绑定，无需注册

## 技术栈

- **前端**：React + Vite + Tailwind CSS
- **后端**：Vercel Functions
- **数据库**：Supabase PostgreSQL（Row Level Security 数据隔离）
- **认证**：Supabase Anonymous Auth
- **AI**：OpenRouter API（Google Gemini Flash Lite）
- **部署**：Vercel

## 本地开发

```bash
# 安装依赖
npm install

# 启动（需要同时跑前端和后端 API）
vercel dev
```

在项目根目录创建 `.env` 文件并填入：

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
```

## 线上地址

> 国内访问需要梯子

https://animal-diary-kris-kris-kris-projects.vercel.app
