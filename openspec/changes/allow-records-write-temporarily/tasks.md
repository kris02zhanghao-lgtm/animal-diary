## 1. 后端代理接口

- [x] 1.1 在 Vercel 项目环境变量中配置 `SUPABASE_SERVICE_ROLE_KEY`
- [x] 1.2 新增 `api/save-record.js`，使用 service role key 向 `records` 表写入新记录
- [x] 1.3 新增 `api/list-records.js`，使用 service role key 读取 `records` 表并按 `created_at` 倒序返回
- [x] 1.4 新增 `api/delete-record.js`，使用 service role key 按 id 删除记录

## 2. 前端服务层改造

- [x] 2.1 改写 `src/services/supabaseService.js`，移除前端 supabase client 直连
- [x] 2.2 `saveRecord` / `getRecords` / `deleteRecord` 改为 fetch 对应后端接口
- [x] 2.3 保持对外函数签名不变，`NewEncounterPage` 和 `ListPage` 无需改动调用方式

## 3. 线上验证

- [x] 3.1 部署到 Vercel 线上，验证上传 → AI 识别 → 保存 → 首页可见 → 删除全链路可用
- [x] 3.2 在 progress.md 标记本方案为临时过渡，保留后续匿名登录 + 正式 RLS 的跟进项

## 4. 文档对齐

- [x] 4.1 重写 proposal.md / design.md / tasks.md / spec delta，使其与实际落地方案（后端代理）一致
