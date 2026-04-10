## Context

**当前状态：**
- 前端直接调用 OpenRouter API，API Key 暴露在浏览器代码中
- 数据存储在 localStorage，只能本地访问，无跨设备同步
- 无用户认证系统，无法区分不同使用者的数据

**约束：**
- 部署在 Vercel（Serverless 环境）
- 前端使用 React + Vite
- 需要保持现有 UI/UX 不变
- 已有的本地数据需要支持（可选迁移或清空）

**关键需求：**
- 隐藏 OpenRouter API Key，防止被滥用
- 多设备间数据同步
- 为后续功能（地图、图鉴、分享）预留用户隔离能力

## Goals / Non-Goals

**Goals：**
- 建立用户认证系统（优先匿名自动注册，可选邮箱登录）
- 将记录存储到 Supabase，实现云端同步
- 创建后端 API 代理 OpenRouter，隐藏 API Key
- 确保行级安全（RLS）：用户只能访问自己的数据
- Vercel 部署无缝工作，环境变量自动注入

**Non-Goals：**
- 不改变前端 UI/UX（保持星露谷风格）
- 不支持数据迁移（localStorage 数据清空）
- 不实现社交分享（后续 P3 功能）
- 不支持离线模式（依赖网络）

## Decisions

### 1. 认证方案：Supabase 匿名登录 + 可选邮箱扩展

**决策：** 使用 Supabase Auth 的匿名登录，自动为每个浏览器/设备生成用户 ID，无需用户主动注册。

**理由：**
- 降低用户入门门槛（无需注册邮箱）
- 允许后续升级为邮箱登录（用户可选关联账户）
- Supabase 原生支持，无需额外后端代码

**实现：**
```
页面加载 → 调用 supabase.auth.signInAnonymously()
→ 如果 session 存在则使用，否则自动创建
→ 存储 session token 到 localStorage
```

**权衡：**
- ✓ 用户体验好
- ✗ 每个设备是独立用户（可接受，后续可升级）

---

### 2. 数据存储：Supabase PostgreSQL

**决策：** 用 Supabase 的 PostgreSQL 数据库存储记录，表结构如下：

```sql
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  species TEXT NOT NULL,
  journal TEXT NOT NULL,
  location TEXT,
  image_base64 TEXT NOT NULL,  -- base64 编码的图片
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- RLS 策略：用户只能读写自己的数据
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own records" 
  ON records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records"
  ON records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records"
  ON records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records"
  ON records FOR DELETE USING (auth.uid() = user_id);
```

**理由：**
- Supabase 原生支持 RLS，无需后端逻辑判断
- PostgreSQL 支持后续需求（地理查询 PostGIS、复杂聚合）
- 数据跨设备/浏览器同步

**权衡：**
- ✓ 安全、可扩展
- ✗ 图片 base64 体积大（单条记录可能数 MB），但用户数据量小时可接受

---

### 3. API 代理：Vercel Function（而非 Supabase Edge Function）

**决策：** 在 Vercel 创建 `/api/recognize` 函数代理 OpenRouter 调用。

**理由：**
- Vercel Function 和前端在同一 project，统一部署和环境变量管理
- Node.js 生态熟悉，代码简单
- 免费额度足够

**实现：**
```javascript
// api/recognize.js
export default async function handler(req, res) {
  const { imageBase64, location } = req.body;
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  
  // 调用 OpenRouter
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ ... })
  });
  
  return res.json(await response.json());
}
```

**权衡：**
- ✓ 简单、快速
- ✗ 冷启动延迟（~1-2s 首次调用，可接受）

---

### 4. 前端数据访问：直接 Supabase SDK vs. 自建 API

**决策：** 前端直接调用 Supabase SDK（`@supabase/supabase-js`），无需二次包装。

**理由：**
- Supabase RLS 自动处理权限检查，前端无法越权
- 减少后端代码
- 实时更新（可选用 Supabase Realtime）

**实现：**
```javascript
// src/services/supabaseService.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export async function getRecords() {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}
```

**权衡：**
- ✓ 简化架构，RLS 保证安全
- ✗ 暴露 Supabase URL 和 ANON_KEY（但这是按设计，ANON_KEY 权限受 RLS 限制）

---

### 5. 环境变量管理

**决策：** 使用 `vercel env` 管理敏感信息：

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # 前端用，受 RLS 保护
VITE_OPENROUTER_API_KEY=sk-...  # 后端用，Vercel Function 环境变量
```

**理由：**
- Vercel 集成管理，自动注入
- 本地开发用 `vercel env pull` 拉取

## Risks / Trade-offs

| 风险 | 影响 | 缓解方案 |
|-----|------|--------|
| **base64 图片体积** | 单条记录 base64 可能 2-5MB，Supabase 存储无大小限制但传输慢 | 后续考虑用 Vercel Blob 或 Supabase Storage（文件存储）分离图片 |
| **RLS 性能** | 每次查询都要检查权限，大数据量时可能慢 | 当前用户数据量小（<1000 记录），短期不需优化 |
| **Supabase URL 暴露** | ANON_KEY 虽然受 RLS 保护，但仍是可见的 | 这是设计，恶意用户无法越权，只能创建/读自己的数据 |
| **认证状态丢失** | localStorage 被清空或 session 过期时丢失登录状态 | 重新 signInAnonymously()，生成新用户，旧数据保留在原用户名下 |
| **API 代理冷启动** | 首次调用 `/api/recognize` 延迟 1-2s | 可接受，可后续用 Vercel 预热或迁移到 Edge Functions |

## Migration Plan

### 步骤 1：Supabase 初始化（人工操作）
1. 在 supabase.com 创建免费项目
2. 创建 `records` 表和 RLS 规则（SQL 脚本）
3. 获取 URL 和 ANON_KEY

### 步骤 2：Vercel 配置
1. 在 Vercel Dashboard 添加环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY`
2. 创建 `/api/recognize.js` Vercel Function

### 步骤 3：前端改动
1. 删除 `src/services/storageService.js`
2. 创建 `src/services/supabaseService.js`
3. 改 `NewEncounterPage.jsx` 调用后端 `/api/recognize`
4. 改 `ListPage.jsx` 调用 `supabaseService.getRecords()`
5. 改 `App.jsx` 初始化 Supabase Auth

### 步骤 4：测试
1. 本地开发：`vercel env pull .env.local`，运行 `npm run dev`
2. 测试认证、增删改查、API 代理
3. Vercel Preview 环境验证

### 步骤 5：灰度上线
1. 推送到 GitHub
2. Vercel 自动 Preview 部署
3. 手机测试
4. 推送 main 分支 → 生产部署

### 回滚策略
- 如果出现问题，立即 revert commit
- localStorage 数据已清空，用户数据在 Supabase（可备份）
- 无法恢复 localStorage（但用户可以重新上传）

## Open Questions

1. **图片存储方案** — 当前用 base64 存 Supabase，后续是否迁移到 Vercel Blob（CDN 加速）？
2. **邮箱登录升级** — 何时实现用户注册邮箱、关联匿名账户的功能？
3. **实时更新** — 是否启用 Supabase Realtime（多设备间实时同步数据库更新）？当前异步查询足够吗？
4. **离线支持** — 是否需要离线模式（Service Worker + IndexedDB）？当前假设网络可用。
