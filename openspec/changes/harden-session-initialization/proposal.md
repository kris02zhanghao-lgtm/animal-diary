## Why

应用首屏依赖 Supabase 匿名会话。当前会话请求失败时只提示刷新，请求挂起时则永久显示“加载中”，在 Supabase 或网络不稳定时用户无法自行恢复。

## What Changes

- 会话初始化增加明确超时和一次自动重试，避免无限等待。
- 合并同一时刻的重复初始化请求，避免 React StrictMode 发起并发匿名登录。
- 会话失败页提供“重新连接”按钮，并区分超时与普通连接失败文案。
- 不清理、替换或主动登出现有匿名会话，保留本机身份及数据访问关系。

## Capabilities

### Modified Capabilities

- `user-identity`：补充会话初始化超时、有限重试和原地恢复要求。

## Impact

- 前端：`src/services/authService.js`、`src/App.jsx`
- 测试：新增异步超时与重试工具的单元测试
- 数据：不涉及数据库、RLS 或已有匿名身份迁移
