## 1. 前置检查（不改动任何东西，仅确认前提）

- [x] 1.1 确认 Supabase Dashboard → Authentication → Anonymous Sign-Ins 开关当前是"关闭"状态（预期关闭，作为基线）
- [x] 1.2 确认 `records` 表 `user_id` 列：类型 uuid、default `auth.uid()`、外键 `records_user_id_fkey` 指向 `auth.users.id`
- [x] 1.3 在 Supabase SQL Editor 导出当前 `records` 表 RLS 策略文本并保存到本地备份文件（用于回滚）
- [x] 1.4 确认 Vercel 环境变量 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` 均已配置（排障中发现后两个变量曾丢值，已重新粘贴并 Redeploy 恢复）
- [x] 1.5 （临时过渡措施）将 `records.user_id` 列的 Allow Nullable 临时重新打开，避免当前后端代理（service role key 模式下 `auth.uid()` 为 null）插入被 NOT NULL 拒绝——此设置将在任务 8.7 收尾阶段再次关闭

## 2. 前端：匿名登录与会话管理

- [x] 2.1 新增 `src/services/authService.js`：封装 `signInAnonymously`、`getSession`、`getAccessToken`、`onAuthStateChange`
- [x] 2.2 `src/services/supabaseClient.js` 验证仍在使用当前的 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`
- [x] 2.3 `src/App.jsx` 在首次挂载时调用 `authService.ensureSession()`，加 `authReady` 状态
- [x] 2.4 `authReady` 为 false 时渲染简单加载占位；为 true 后再渲染 ListPage / NewEncounterPage 路由
- [x] 2.5 登录失败分支：展示友好错误提示（"无法建立会话，请刷新重试"），不进入主业务

## 3. 前端：服务层携带 token

- [x] 3.1 `src/services/supabaseService.js` 的 `saveRecord` / `getRecords` / `deleteRecord` 在 fetch header 中加 `Authorization: Bearer <token>`
- [x] 3.2 如获取 token 失败则中止请求并抛错，由调用方捕获
- [x] 3.3 收到 401 响应时统一抛出可识别错误（供 UI 层展示"登录失效，请刷新页面"）

## 4. 后端：三个 API 使用用户 token 初始化 Supabase client

- [x] 4.1 `api/save-record.js`：从 `req.headers.authorization` 读取 Bearer token，用 `createClient(url, anonKey, { global: { headers: { Authorization: 'Bearer ' + token } } })` 初始化；去掉 service role key 依赖
- [x] 4.2 `api/save-record.js`：token 缺失或无效返回 401
- [x] 4.3 `api/list-records.js`：同样改为 token 初始化，去掉 service role key
- [x] 4.4 `api/list-records.js`：保持按 `created_at` 降序返回
- [x] 4.5 `api/delete-record.js`：同样改为 token 初始化，去掉 service role key
- [x] 4.6 `api/delete-record.js`：Supabase 返回 0 行影响时识别为"删除被 RLS 拒绝"，返回明确错误信息

## 5. 本地预演（vercel dev，RLS 尚未改动）

- [x] 5.1 用 `vercel dev` 启动完整本地环境
- [x] 5.2 手动测试：前端可成功匿名登录并拿到 token（通过 devtools 查看 localStorage 和 network）
- [x] 5.3 手动测试：保存 / 读取 / 删除全链路通（此时 RLS 还是旧的宽松策略，验证的是前后端 token 传递没坏）

## 6. 开启 Supabase Anonymous Sign-Ins

- [x] 6.1 在 Supabase Dashboard → Authentication → Providers（或 Sign In / Up）→ 开启 Anonymous Sign-Ins
- [x] 6.2 在预览部署中再次验证前端能获取匿名 session（无痕窗口打开预览地址）

## 7. 调整 records 表 RLS 策略（基于现有策略差量更新，非整体重写）

> 前置检查发现现有策略 1~4（public 角色按 `auth.uid() = user_id` 过滤 SELECT/INSERT/UPDATE/DELETE）基本就是我们想要的，可直接复用。只需做下列差量调整：

- [x] 7.1 DROP 策略 `Temporary allow anon insert`（昨天排障遗留的宽松 anon INSERT 策略）
- [x] 7.2 DROP 策略 `Temporary allow anon insert 2`（与 7.1 重复的遗留策略）
- [x] 7.3 为 `Users can update own records` 策略补充 `WITH CHECK (user_id = auth.uid())`，防止用户把自己的记录 user_id 改成别人的（先 DROP 再 CREATE 完整版本，或使用 ALTER POLICY）
- [x] 7.4 在 SQL Editor 用 `set request.jwt.claim.sub = '<测试 uuid>'` 模拟一次 insert / select / delete 验证策略生效
- [x] 7.5 再次运行前置检查中的 `SELECT * FROM pg_policies WHERE tablename = 'records'` 确认最终只剩 4 条策略且均基于 `auth.uid() = user_id`

## 8. 生产部署与全链路验证

- [x] 8.1 合并分支触发 Vercel 生产部署
- [x] 8.2 生产地址打开：应当自动登录成功并进入空列表
- [x] 8.3 保存一条测试记录：应当成功写入，首页可见
- [x] 8.4 删除一条测试记录：应当成功从列表移除
- [x] 8.5 用无痕窗口打开同一地址：应当进入全新空账号，看不到上一步保存的记录（数据隔离验证）
- [x] 8.6 在 Supabase Dashboard → `records` 表检查两条记录的 user_id 确实不同
- [x] 8.7 （收尾加固）全链路验证通过后，将 `records.user_id` 列的 Allow Nullable 重新关闭（恢复 NOT NULL），与任务 1.5 对称，作为最终安全加固——此时所有写入都已带有登录 session，auth.uid() 一定非空

## 9. 清理与文档

- [x] 9.1 确认观察 1-2 天线上无异常后，从三个后端 API 的代码中彻底移除 `SUPABASE_SERVICE_ROLE_KEY` import（环境变量仍保留在 Vercel 作应急备用）
- [x] 9.2 更新 `progress.md`：v0.3 追加"匿名登录 + RLS 数据隔离"已完成条目，未解决问题中对应条目移除
- [x] 9.3 在 ListPage 加一行小字"匿名模式，记录与本设备绑定"（UI 微调）
- [ ] 9.4 评估是否归档 `allow-records-write-temporarily` 变更（独立步骤，不在本次任务必做范围）
