## ADDED Requirements

### Requirement: 前端自动建立匿名用户身份
系统 SHALL 在前端应用首次加载时，通过 Supabase Anonymous Sign-Ins 自动为当前访问者建立匿名会话，并将该会话持久化到浏览器 localStorage；同一浏览器后续访问 MUST 复用同一身份。

#### Scenario: 首次访问自动登录
- **WHEN** 用户首次打开站点且浏览器 localStorage 中不存在 Supabase session
- **THEN** 前端调用 `supabase.auth.signInAnonymously()`，获取 user_id 与 access token，并由 supabase-js 自动写入 localStorage

#### Scenario: 后续访问复用身份
- **WHEN** 用户再次打开站点且浏览器中已存在有效 Supabase session
- **THEN** 前端直接复用该 session，不发起新的匿名登录请求

#### Scenario: 清除缓存后变为新身份
- **WHEN** 用户主动清除浏览器数据、使用无痕模式或更换浏览器/设备
- **THEN** 前端获取一个全新的 user_id，之前保存的记录对该新身份不可见（按产品预期）

### Requirement: 会话就绪前阻塞主界面渲染
系统 SHALL 在 Supabase session 未就绪前阻止主业务页面渲染，以避免首屏请求因缺少用户 token 被后端拒绝。

#### Scenario: 会话就绪后渲染
- **WHEN** App 挂载时调用匿名登录并等待 session 返回
- **THEN** session 返回前展示加载占位，session 就绪后渲染正常路由

#### Scenario: 登录失败
- **WHEN** 匿名登录请求失败（网络错误或 Anonymous Sign-Ins 未开启）
- **THEN** 前端展示友好错误提示，不进入主业务页面，建议用户刷新重试

### Requirement: 对外暴露当前用户 access token
系统 SHALL 提供统一的方法让前端服务层获取当前用户的 access token，以便在向后端代理发起请求时通过 `Authorization` header 携带。

#### Scenario: 服务层获取 token
- **WHEN** `supabaseService.js` 的 save / list / delete 函数准备发起 fetch 请求
- **THEN** 从 auth service 读取当前 access token，将其作为 `Authorization: Bearer <token>` 放入 header

#### Scenario: token 不存在
- **WHEN** 服务层准备发请求时发现 token 缺失（session 尚未就绪或已失效）
- **THEN** 中止请求并抛出错误，由调用方处理（展示登录失败或刷新页面提示）

### Requirement: 预留未来升级为注册账号的路径
系统 SHALL 保证当前匿名身份方案能够在未来通过 Supabase 的 `updateUser` 接口升级为邮箱/密码账号而不丢失历史记录；本变更 MUST NOT 引入任何阻断该升级路径的设计。

#### Scenario: 升级路径可用
- **WHEN** 未来在该匿名 session 上调用 `supabase.auth.updateUser({ email, password })`
- **THEN** 同一 user_id 绑定真实邮箱，`records` 表中已有记录不受影响，用户继续可访问历史记录
