## ADDED Requirements

### Requirement: 记录读写通过后端代理入口
系统 SHALL 将 `records` 表的所有保存、读取、删除操作统一通过 Vercel Function 代理接口（`api/save-record`、`api/list-records`、`api/delete-record`）完成，前端 MUST NOT 直接与 Supabase `records` 表建立连接。

#### Scenario: 前端保存新记录
- **WHEN** 前端提交包含 `image_base64` / `location` / `title` / `species` / `journal` 的新记录
- **THEN** 前端 POST `api/save-record`，后端使用 service role key 将记录写入 `records` 表并返回完整记录

#### Scenario: 前端读取记录列表
- **WHEN** 首页加载或刷新
- **THEN** 前端 GET `api/list-records`，后端按 `created_at` 倒序返回全部记录

#### Scenario: 前端删除记录
- **WHEN** 用户在列表页或详情页确认删除
- **THEN** 前端向 `api/delete-record` 发送待删除记录 id，后端执行删除并返回成功标识

### Requirement: 后端代理使用 service role key 访问 Supabase
系统 SHALL 在后端函数中使用 `SUPABASE_SERVICE_ROLE_KEY` 初始化 Supabase 客户端以绕过 `records` 表现有 RLS 策略，且该 key MUST NOT 出现在前端 bundle、代码仓库或任何公开环境中。

#### Scenario: 环境变量缺失
- **WHEN** 后端函数启动时未读取到 `VITE_SUPABASE_URL` 或 `SUPABASE_SERVICE_ROLE_KEY`
- **THEN** 函数返回 500 错误并提示"Supabase 服务端配置缺失"，不再尝试访问数据库

#### Scenario: service role key 泄露风险
- **WHEN** 任何前端代码或公开产物中检测到 service role key
- **THEN** 必须立即在 Supabase 后台轮换该 key，并从泄露源移除

### Requirement: 后端代理作为临时过渡方案
系统 SHALL 将后端代理定义为在接入用户身份体系之前的临时方案，不将其视为最终的数据隔离或权限方案。

#### Scenario: 临时方案边界
- **WHEN** 本次方案部署生效
- **THEN** 所有用户共享同一把 service role key，后端不做用户归属区分，记录对所有访问者可见

#### Scenario: 切换到正式方案
- **WHEN** 匿名登录 + 正式 RLS 上线
- **THEN** 需重新评估后端代理是否继续保留，或改由前端携带用户 token 直连 Supabase
