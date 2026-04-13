### Requirement: 保存偶遇记录
系统 SHALL 在识别成功后通过后端代理接口 `api/save-record` 将记录写入 Supabase `records` 表；请求 MUST 携带当前用户的 `Authorization: Bearer <access_token>` header，后端 MUST 使用该 token 初始化 Supabase client 以便 RLS 按 `auth.uid()` 过滤生效；前端 MUST NOT 直接调用 Supabase SDK 写入。

#### Scenario: 已登录用户保存记录
- **WHEN** 已完成匿名登录的用户点击"保存到日志"，前端已组装好 `image_base64` / `location` / `title` / `species` / `journal`
- **THEN** 前端向 `api/save-record` 发送 POST 请求，header 中携带当前用户 access token；后端用该 token 初始化 Supabase client 并写入记录，`user_id` 自动使用 `auth.uid()` 的默认值

#### Scenario: 缺失或无效 token
- **WHEN** 请求没有携带 `Authorization` header，或 token 已失效
- **THEN** 后端返回 401，响应体中给出明确错误信息；前端展示保存失败提示并建议刷新页面

#### Scenario: 后端代理不可用
- **WHEN** `api/save-record` 返回非 2xx 响应或网络失败
- **THEN** 前端展示保存失败提示，保留当前识别/编辑结果不清空

### Requirement: 读取所有记录
系统 SHALL 通过后端代理接口 `api/list-records` 读取 Supabase `records` 表内容，并按 `created_at` 降序排列（最新在前）返回给前端；请求 MUST 携带当前用户的 `Authorization: Bearer <access_token>` header，后端 MUST 使用该 token 初始化 Supabase client；RLS 策略 MUST 确保只返回属于当前用户的记录。

#### Scenario: 首页加载
- **WHEN** 首页进入或刷新，且当前用户已建立匿名会话
- **THEN** 前端 GET `api/list-records` 并携带 access token；后端返回该用户的记录数组，前端按季度分组渲染

#### Scenario: 新用户首次访问
- **WHEN** 用户尚未保存任何记录
- **THEN** 后端返回空数组，前端渲染空状态（松鼠 emoji + 引导文字）

#### Scenario: 数据隔离验证
- **WHEN** 用户 A 已保存若干记录，用户 B 首次访问（例如另一浏览器）
- **THEN** 用户 B 看到空列表，用户 A 的记录对用户 B 完全不可见

### Requirement: 删除单条记录
系统 SHALL 通过后端代理接口 `api/delete-record` 按 id 删除 Supabase `records` 表中的记录；请求 MUST 携带当前用户的 `Authorization: Bearer <access_token>` header，后端 MUST 使用该 token 初始化 Supabase client；RLS 策略 MUST 拒绝用户删除不属于自己的记录。

#### Scenario: 用户确认删除自己的记录
- **WHEN** 用户在底部确认弹窗点击"挥手道别"，目标记录的 user_id 等于当前用户
- **THEN** 前端向 `api/delete-record` 发送待删除 id 和 access token；后端执行删除并返回成功；前端从列表中移除该记录

#### Scenario: 尝试删除他人记录
- **WHEN** 请求提交的记录 id 属于其他用户
- **THEN** 后端执行删除时 Supabase RLS 拒绝操作，记录不会被删除，后端返回错误；前端列表保持原样

#### Scenario: 删除失败
- **WHEN** `api/delete-record` 返回非 2xx 响应或网络失败
- **THEN** 前端展示删除失败提示，列表保持原样不移除该记录
