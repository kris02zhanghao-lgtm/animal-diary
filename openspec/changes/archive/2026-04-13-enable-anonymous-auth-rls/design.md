## Context

当前线上处于"后端代理 + service role key"的临时过渡态：三个 Vercel Function（`api/save-record`、`api/list-records`、`api/delete-record`）使用万能钥匙绕过 `records` 表的 RLS，前端不连 Supabase，统一调后端代理。这个方案虽然跑通了保存 / 读取 / 删除，但没有任何用户身份概念——所有人共享一个超级账号，分享链接后会互相污染数据。

数据库侧的前置条件已经就绪：`records` 表已有 `user_id` 列（uuid 类型、default `auth.uid()`、not null、外键到 `auth.users.id`），且表为空，不需要做任何老数据迁移。Supabase 库 `@supabase/supabase-js` 已经安装、`supabaseClient.js` 仍然存在、`VITE_SUPABASE_ANON_KEY` 环境变量仍在前端可用，所以加回匿名登录的成本非常低。

本次设计目标：在不引入真实注册体系的前提下，以最小改动把"用户身份 + RLS 隔离"正式化，并为未来升级到注册登录预留平滑路径。

## Goals / Non-Goals

**Goals:**
- 前端每个访问者拥有独立的匿名身份（由 Supabase auth 发放），身份持久化在浏览器 localStorage
- `records` 表的所有读写都受 RLS 保护，按 `auth.uid()` 做数据隔离
- 后端代理改为使用请求方用户 token 初始化 Supabase client，日常路径不再使用 service role key
- 改造过程中线上不可用时间尽量短；如出问题可快速回滚
- 预留未来匿名账号升级为邮箱账号的路径，避免数据迁移

**Non-Goals:**
- 不做邮箱 / 密码 / 社交登录注册流程
- 不做跨设备数据同步（匿名 session 与浏览器绑定，换设备会看到新空账号）
- 不重构 AI 识别链路与 UI
- 不清理或重命名 `allow-records-write-temporarily` 目录（归档由独立步骤处理）

## Decisions

### Decision 1: 使用 Supabase Anonymous Sign-Ins，不自建身份体系

**Why**: Supabase 原生支持匿名登录，一次 API 调用即可获取完整的 JWT，且未来可以通过 `supabase.auth.updateUser({ email, password })` 无损升级为真实账号，历史记录自动保留。
**Alternative**: 自己生成 device_id 存 localStorage + 后端用 device_id 过滤。已否决——device_id 可伪造、没有真实安全性、且未来升级到正式账号需要数据迁移。

### Decision 2: 混合模式——登录走前端直连 Supabase，记录读写走后端代理

**Why**: 登录必须由前端发起（浏览器拿到 session 才能持久化）。但记录读写如果前端直连，每一处都要手写 header，且每多一个调用点就多一个"忘了带 token"的风险。统一走后端代理可以让三个 API 成为"带 token 的唯一入口"。
**Alternative A**: 前端全部直连 Supabase，走标准 supabase-js 调用，RLS 自动生效。已否决——需要重写 `supabaseService.js`，和当前代码结构冲突较大，且未来如果想加服务端逻辑（比如图片压缩、审核）还要再改一次。
**Alternative B**: 登录也走后端代理。已否决——后端 function 是无状态的，无法持久化 session。

### Decision 3: 后端代理使用用户 token 初始化 Supabase client，而非 service role key

**Why**: 用户 token 带身份信息，`auth.uid()` 会自动生效，RLS 规则能直接过滤。这样后端代码完全不用写"只查 user_id = xxx 的记录"——RLS 层自动做了。
**实现方式**: `createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: 'Bearer ' + userToken } } })`，Supabase 会把该 token 当作用户身份。
**Alternative**: 继续用 service role key，在 SQL 层手动 `where user_id = ?` 过滤。已否决——任何一处 where 漏写就等于穿透 RLS，风险太大。

### Decision 4: service role key 保留但不参与日常路径

**Why**: 出现紧急情况（用户数据恢复、调试）时，有一把能完全穿透 RLS 的钥匙是必要的；但日常读写不依赖它，减少攻击面。
**做法**: 环境变量保留，代码中移除所有对 `SUPABASE_SERVICE_ROLE_KEY` 的 import。

### Decision 5: 前端在 App 挂载前阻塞等待 session 就绪

**Why**: 如果 session 没准备好就让用户看到 ListPage，第一次 list-records 会因为没有 token 而 401，首页会闪一次"加载失败"。
**做法**: `src/App.jsx` 加一个 `authReady` 状态，未就绪时展示 loading（或用一个简单 splash），就绪后再渲染路由。
**Trade-off**: 用户首次打开会多看到大概 200-500ms 的 loading。可以接受。

### Decision 6: RLS 策略采用四条独立策略（SELECT / INSERT / UPDATE / DELETE）

**Why**: 明确区分四种操作便于后期审计和调整；Supabase 官方推荐做法。
**策略表达式**: 四条都是 `user_id = auth.uid()`，INSERT 额外配合 `WITH CHECK` 确保写入时 user_id 也对。
**删除旧策略**: 先 DROP 现有策略（昨天排障时可能遗留的宽松规则），再 CREATE 新策略，避免新旧并存造成歧义。

## Risks / Trade-offs

| 风险 | 影响 | 缓解 |
|---|---|---|
| RLS 策略写错导致全表不可见 | 🔴 高 | 先在 Supabase SQL Editor 手动用测试用户验证 SELECT/INSERT/DELETE，通过后再改前端 |
| 前端部署和数据库变更之间有不一致窗口 | 🟡 中 | 按"先部署前端 + 后端代码 → 再启用 Anonymous Sign-Ins → 最后改 RLS"的顺序走，每步验证 |
| 用户清缓存后变成"新用户"，老记录看不见 | 🟡 中（产品预期） | 首页加一行小字"匿名模式，数据与本设备绑定"；在 progress.md / PRD 写清楚 |
| 后端代理把 token 透传出错（比如大小写、Bearer 前缀漏了） | 🟡 中 | 后端加最小日志记录 401/403，部署后全链路立刻测一次 |
| service role key 意外被继续使用 | 🟢 低 | 代码中移除 import，并在 review 时检查 |
| Anonymous Sign-Ins 被滥用（机器人批量注册匿名账号） | 🟢 低 | 当前阶段产品规模小可接受；后续如需防滥用再加 Supabase rate limit 或 Cloudflare Turnstile |

## Migration Plan

按依赖顺序执行，每一步都可独立验证，出问题可从下一步开始回滚：

1. **前置检查**（不改任何东西，只确认前提）
   - 确认 Supabase Auth → Anonymous Sign-Ins 开关当前状态
   - 确认 `records` 表 user_id 列配置正确（已确认）
   - 记录当前 RLS 策略（用于回滚）

2. **前端代码改造**（本地 + 预览部署）
   - 新增 `src/services/authService.js`：启动时 `signInAnonymously`，暴露 `getAccessToken()`
   - `src/App.jsx` 加 `authReady` 门禁
   - `src/services/supabaseService.js` 三个 fetch 加 `Authorization` header
   - 本地用 `vercel dev` 跑通整套，但此时 RLS 还没改，service role key 还在用，保存/读取/删除仍然能工作

3. **后端代码改造**（本地 + 预览部署）
   - 三个 API 从 header 读取 `Authorization`，取出 token
   - 用 token + anon key 初始化 Supabase client，不再用 service role key
   - 本地 `vercel dev` 再跑一次，此时后端用用户身份访问——但 RLS 还没改，依然能通过旧策略写入/读取

4. **开启 Anonymous Sign-Ins**（在 Supabase 后台）
   - Authentication → Providers（或 Sign In / Up）→ 开启 Anonymous Sign-Ins
   - 从前端预览部署试一次登录是否能拿到 session

5. **重写 RLS 策略**（在 Supabase SQL Editor）
   - DROP 现有 `records` 表所有策略
   - CREATE 四条新策略（SELECT / INSERT / UPDATE / DELETE）全部基于 `user_id = auth.uid()`
   - 在 SQL Editor 里用 `SET request.jwt.claim.sub = '<测试 uuid>'` 模拟一次 insert / select 通过再关

6. **生产部署 + 全链路验证**
   - Push 代码触发 Vercel 生产部署
   - 打开线上：应当自动登录 → 保存一条测试记录 → 首页可见 → 删除成功
   - 开无痕/隐身浏览器再试一次：应当变成全新空账号，看不到上一个账号的记录

7. **清理**（可选，先观察 1-2 天再做）
   - 从后端代码彻底移除 `SUPABASE_SERVICE_ROLE_KEY` 相关 import（环境变量保留）
   - 更新 progress.md
   - 考虑归档 `allow-records-write-temporarily` change

## Rollback

如果步骤 4-6 出问题：
- **RLS 策略失败**：重建先前的宽松策略（保留的备份），线上依旧可用
- **前端无法登录**：关闭 Anonymous Sign-Ins 开关 + 回滚前端部署到上一个版本
- **后端 token 解析失败**：回滚后端部署到上一版本，恢复 service role key 路径

因为 `records` 表结构没有任何变更（user_id 列早就在），数据库层面零回滚成本。

## Open Questions

- **OQ1**: 前端未就绪时展示什么？方案 A：空白 + spinner；方案 B：复用列表页空状态样式配文案"准备中"。→ 建议在 tasks 阶段再决定，UI 微调，不是架构问题。
- **OQ2**: 后端 API 是否需要在 token 无效时返回 401 明确提示"请刷新页面"？还是静默失败？→ 建议返回 401，前端捕获后刷新 session 或给出提示。
- **OQ3**: RLS 策略中的 UPDATE 条件是否需要双重 check（`USING (user_id = auth.uid())` 且 `WITH CHECK (user_id = auth.uid())`）？→ 推荐双重 check，避免用户把别人的记录 user_id 改成自己的。
