## Why

当前"后端代理 + service role key"方案虽然恢复了保存 / 读取 / 删除三条链路，但所有用户共享同一把万能钥匙，没有用户数据隔离——一旦把链接分享出去，不同用户会互相看到和删除对方的记录。这是项目正式对外分享前必须解决的最后一个阻塞点。

## What Changes

- 在 Supabase Authentication 中启用 Anonymous Sign-Ins，允许前端在用户不注册的情况下获取会话身份。
- 前端 App 启动时调用 `supabase.auth.signInAnonymously()` 建立匿名会话，session 自动持久化到浏览器 localStorage；后续所有请求共用该会话。
- 前端三个 fetch 调用（`/api/save-record`、`/api/list-records`、`/api/delete-record`）在请求头中携带 `Authorization: Bearer <access_token>`。
- 后端三个 API 改为从请求头读取用户 token，用该 token 初始化 Supabase client，所有数据库操作以该用户身份执行；不再使用 service role key 做日常读写。
- 重写 `records` 表的 RLS 策略为按 `auth.uid()` 过滤（SELECT / INSERT / UPDATE / DELETE 四条），实现真正的用户数据隔离。
- **BREAKING**: 改造完成后，未携带有效 token 的请求将被全部拒绝；线上老的后端代理行为（匿名写入任意记录）作废。
- service role key 仍保留在 Vercel 环境变量中作应急备用，但不再参与日常读写链路。
- 当前阶段只做匿名登录，注册登录（邮箱 + 密码）留作后期版本升级，届时通过 Supabase 的匿名账号升级路径无损迁移。

## Capabilities

### New Capabilities
- `user-identity`: 定义匿名用户身份的建立、持久化、在前后端之间的传递方式，以及未来注册登录升级的衔接点。

### Modified Capabilities
- `record-storage`: 保存 / 读取 / 删除必须携带用户身份，仅能操作属于当前用户的记录；后端代理改为使用用户 token 初始化 Supabase client。

## Impact

- **Supabase**: Authentication 配置开启 Anonymous Sign-Ins；`records` 表 RLS 策略重写（四条按 `auth.uid()` 过滤）。
- **前端**:
  - `src/services/supabaseClient.js` 恢复使用，用于匿名登录与 session 管理
  - 新增 `src/services/authService.js`（或等价模块）负责启动时初始化 session 并对外暴露获取 access token 的方法
  - `src/services/supabaseService.js` 三个 fetch 调用改为携带 `Authorization` header
  - `src/App.jsx` 在首次渲染前确保 session 已就绪
- **后端**: `api/save-record.js`、`api/list-records.js`、`api/delete-record.js` 从 header 读取 token，用 token 初始化 Supabase client，去掉 service role key 调用路径
- **环境变量**: `SUPABASE_SERVICE_ROLE_KEY` 保留但不再在日常路径使用；`VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY` 继续使用
- **数据**: `records` 表结构无需改动（user_id 列已存在且配置正确，表为空无需迁移）
- **文档**: `progress.md` 更新 v0.3 状态与 v0.4 升级路径说明；`allow-records-write-temporarily` 变更在本次上线后可考虑归档
