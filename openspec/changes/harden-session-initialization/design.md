## Context

`App` 在渲染业务页面前等待 `ensureSession()`。现有实现直接调用 Supabase SDK，没有超时边界；请求若保持 pending，`authReady` 和 `authError` 都不会更新。React StrictMode 还会在开发环境重复执行 effect，可能产生并发初始化调用。

## Goals / Non-Goals

**Goals:**
- 所有会话初始化尝试都在有限时间内结束。
- 瞬时失败自动重试一次，最终失败后允许用户原地重试。
- 并发调用复用同一个初始化 Promise。
- 完整保留 Supabase localStorage 中的匿名 session。

**Non-Goals:**
- 本轮不把 Supabase Auth 迁移到 Vercel 同域代理。
- 不改变匿名登录、JWT、RLS 或记录归属机制。
- 不自动清理浏览器缓存或创建替代身份。

## Decisions

1. 单次尝试设置 8 秒超时；明确返回的瞬时错误自动重试一次，中间等待 500 毫秒。超时后不自动并发启动底层请求，改由用户手动重试。
2. 用模块级 pending Promise 合并并发调用；请求结束后清除引用，以便错误页手动重试。
3. 超时只负责让 UI 收口，不调用 `signOut()`、`removeSession()` 或清理 localStorage。
4. App 的重试按钮通过递增 attempt key 重新运行初始化 effect，重试期间恢复加载态。
5. 抽取无框架依赖的异步工具，使用 Node 内置测试验证成功、超时、重试和最终失败。

## Risks / Trade-offs

- Promise 超时无法物理取消 Supabase SDK 内部请求；因此超时不自动重试，避免两个匿名登录请求重叠。UI 会在约 8 秒后收口，并允许用户手动重试。
- Supabase 长期不可达时仍无法进入业务页；根治需后续同域认证代理改造。
