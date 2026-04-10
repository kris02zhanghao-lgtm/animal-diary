## Why

目前项目在 MVP 阶段，使用 localStorage 存储数据和在前端直接调用 OpenRouter API。这带来两个问题：

1. **API Key 安全隐患**：OpenRouter API Key 被打包到前端代码里，任何访问网站的人都能看到，存在被滥用消耗配额的风险。需要迁移到后端代理才能分享给他人使用。

2. **数据隔离不足**：localStorage 只存本地，不同浏览器/设备间无法同步。后续版本规划（v0.4 图鉴页、v0.5 地图功能）需要用户认证和云端存储来支撑。

现在迁移到 Supabase 作为一站式后端，既解决安全问题，又为后续功能扩展（社交分享、地理查询）打好基础。

## What Changes

- **数据存储**：从 localStorage 迁移到 Supabase PostgreSQL，用户每条记录关联到自己的账户
- **用户认证**：集成 Supabase Auth（匿名自动注册，无需用户操作）
- **API 代理**：创建 Supabase Edge Function 代理 OpenRouter API 调用，隐藏 API Key
- **前端改动**：
  - 用 `@supabase/supabase-js` 替代 localStorage 服务
  - NewEncounterPage 调用后端 API 而不是直接调 OpenRouter
  - ListPage 实时同步 Supabase 数据
- **环境配置**：添加 Supabase URL、Key、API 代理密钥等环境变量

## Capabilities

### New Capabilities

- `supabase-auth`：用户认证系统，支持匿名自动注册和邮箱登录
- `api-proxy`：OpenRouter API 后端代理，隐藏 API Key，支持请求验证
- `user-data-isolation`：行级安全规则，确保用户只能访问自己的数据

### Modified Capabilities

- `record-storage`：数据源从 localStorage 改为 Supabase，实现跨设备同步
- `new-encounter`：AI 识别调用后端代理而不是直接调 OpenRouter
- `record-list`：数据来源改为 Supabase，实时更新

## Impact

**新增依赖：**
- `@supabase/supabase-js`（前端）
- Supabase Edge Functions（后端）

**需要配置：**
- Supabase 项目创建、API Key 配置
- Vercel 环境变量：VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY、SUPABASE_API_KEY（后端用）
- Supabase 数据库表结构和 RLS 权限

**代码文件改动：**
- `src/services/` - 新增 supabaseService.js，删除 localStorage 相关
- `api/` - 新增 recognize.js（Vercel Function 代理 OpenRouter）
- `src/pages/NewEncounterPage.jsx` - 改成调用后端 API
- `src/pages/ListPage.jsx` - 改成调用 Supabase 查询
- `.env.example` - 添加 Supabase 相关配置
- `PRD.md` - 更新版本规划和技术方案

**向前兼容性：**
无（localStorage 数据会丢弃，但这是 MVP 数据，可接受）
