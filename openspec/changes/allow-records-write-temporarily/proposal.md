## Why

线上"保存到日志"在前端直连 Supabase 时被 `records` 表的 RLS 策略拒写，同样地，首页读取和删除记录也一并被拒。前端尚未接入登录，短期内无法通过 `auth.uid()` 通过策略校验，核心流程被整体阻断。需要一个能一次恢复"保存 / 读取 / 删除"全部能力的临时方案，避免再分多次返工。

> 注：本变更目录名沿用最初立项时的 slug `allow-records-write-temporarily`，但实际落地方案从"放开 RLS 让前端直写"调整为"后端代理 + service role key 绕过 RLS"。slug 未改名以保持 git 历史引用一致，能力定义请以下方 `backend-record-proxy` 为准。

## What Changes

- 新增三个 Vercel Function 作为记录读写代理：`api/save-record.js`、`api/list-records.js`、`api/delete-record.js`。
- 后端函数使用 `SUPABASE_SERVICE_ROLE_KEY` 初始化 Supabase 客户端，绕过 `records` 表 RLS 完成写入/读取/删除。
- 前端 `src/services/supabaseService.js` 不再直连 Supabase，改为调用上述三个后端接口。
- Supabase `records` 表的 RLS 策略保持不动，不向 `anon` 角色放开任何权限。
- 明确该方案仍为临时过渡：后端代理对所有用户共享同一把 service role key，没有用户隔离。

## Capabilities

### New Capabilities
- `backend-record-proxy`: 定义由 Vercel Function 作为记录表读写统一入口的行为、边界和限制。

### Modified Capabilities
- `record-storage`: 记录的保存 / 读取 / 删除从前端直连（localStorage 或 Supabase）调整为前端调用后端代理接口。

## Impact

- Vercel Functions：新增 `api/save-record.js`、`api/list-records.js`、`api/delete-record.js`
- Vercel 环境变量：新增 `SUPABASE_SERVICE_ROLE_KEY`（仅后端可见）
- 前端服务层：`src/services/supabaseService.js` 改为 fetch 后端接口
- Supabase：RLS 策略保持不变，不向 anon 放权
- 后续正式方案：需在接入匿名登录 + 正式 RLS 后，重新评估"是否继续走后端代理还是改回前端直连 + RLS"
