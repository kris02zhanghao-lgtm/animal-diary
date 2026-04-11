## Context

线上流程已恢复 AI 识别，但在"保存到日志"阶段被 Supabase `records` 表的 RLS 策略拒绝。进一步验证发现同一策略同时阻断了首页读取和删除：前端未登录时，`select` / `insert` / `delete` 都会被拦截。前端尚未接入任何登录体系，短期内无法通过 `auth.uid()` 校验。此变更目标是用最小代价，一次性恢复全部记录读写能力。

## Goals / Non-Goals

**Goals:**
- 一次恢复 records 的保存 / 读取 / 删除三条链路。
- 不引入任何前端登录、会话管理逻辑，降低本次变更的复杂度。
- 不把 Supabase 写入权限暴露给公网 anon 角色，避免数据库层面失守。
- 把临时方案边界写清楚，便于后续替换为正式 RLS 方案。

**Non-Goals:**
- 不实现用户身份体系或匿名登录。
- 不做多用户数据隔离。
- 不调整 AI 识别、列表展示 UI 或 Supabase 表结构。

## Decisions

- **采用"后端代理 + service role key"绕过 RLS，而不是放开 RLS 让 anon 直写。**
  - 原因 1：放开 RLS 只能解决 insert，`select` 和 `delete` 还要再开一次，改动点更分散。
  - 原因 2：service role key 放在 Vercel 环境变量里，只在后端函数进程中可见，前端无法触达；相比直接放开数据库权限，攻击面更小。
  - 原因 3：未来切到正式 RLS 时，只需要在后端代理里改为传递用户 token，前端几乎无需改动。
  - 备选方案：放开 `records` 表 anon 写入策略。已否决，理由见上。

- **新增 `api/save-record.js` / `api/list-records.js` / `api/delete-record.js` 三个 Vercel Function 作为唯一入口。**
  - 原因：与现有 `api/recognize.js` 保持一致的后端代理模式，部署路径和环境变量管理都复用。
  - 三个函数各自校验 `req.method`，使用 `createClient(supabaseUrl, serviceRoleKey)` 初始化客户端，直接调用 Supabase SDK 完成增/查/删。

- **前端 `src/services/supabaseService.js` 改写为 fetch 三个后端接口，不再 import supabase client。**
  - 原因：统一入口，杜绝"前端某处又绕过代理直连数据库"的退路。
  - 代价：本地开发需使用 `vercel dev` 才能命中 API 路由，仅跑 `npm run dev` 时保存/列表/删除会失败。已写入 progress.md 的"未解决问题"段。

- **Supabase `records` 表 RLS 保持原策略不动，不向 anon 角色放权。**
  - 原因：一旦放开再收回成本更高；当前方案已经可以在不改数据库的前提下恢复可用。

## Risks / Trade-offs

- **所有用户共享同一把 service role key，无用户隔离。** → 后续必须补匿名登录 + 按用户隔离的 RLS；在此之前不对外公开分享链接。
- **service role key 泄露等同于全库失守。** → 仅配置在 Vercel 服务端环境变量，不写入仓库、不进前端 bundle；如果怀疑泄露需立即在 Supabase 后台轮换。
- **后端代理成为单点，任何 Vercel Function 故障都会同时影响保存/读取/删除。** → 当前阶段可接受；若后续链路变重，再评估拆分或加监控。
- **本地开发调试门槛上升。** → 需要用 `vercel dev` 启动而非纯 `npm run dev`。

## Migration Plan

1. 在 Vercel 项目环境变量中配置 `SUPABASE_SERVICE_ROLE_KEY` 和 `VITE_SUPABASE_URL`（后端函数复用该 URL）。
2. 新增 `api/save-record.js`、`api/list-records.js`、`api/delete-record.js`，各自使用 service role key 调用 Supabase SDK。
3. 改写 `src/services/supabaseService.js`，将 `saveRecord` / `getRecords` / `deleteRecord` 全部改为 fetch 对应后端接口。
4. 本地用 `vercel dev` 跑一次全链路：上传 → 识别 → 保存 → 首页可见 → 删除可用。
5. 部署到 Vercel 线上，重复一次全链路验证。
6. 在 progress.md 中记录该方案为临时过渡，并保留后续匿名登录 + RLS 正式方案的跟进项。

## Rollback

- 临时方案回滚 = 删除三个 API 文件 + 还原 `supabaseService.js` 直连版本。但回滚后前端会重新陷入 RLS 拒写状态，因此只有在切换到"匿名登录 + 正式 RLS"后才建议回滚本方案。

## Open Questions

- 正式方案应走"Supabase 匿名登录 + 前端直连 + RLS 按 `auth.uid()` 过滤"，还是继续保留后端代理并在代理里注入用户 token？两者均可，需在正式方案设计时再决策。
