## 1. Supabase 初始化（人工操作）

- [x] 1.1 在 supabase.com 创建新免费项目
- [x] 1.2 在 Supabase SQL Editor 中执行建表脚本（创建 records 表）
- [x] 1.3 启用 RLS 并创建四个 RLS 策略（SELECT、INSERT、UPDATE、DELETE）
- [x] 1.4 从 Supabase Dashboard 获取 Project URL 和 ANON_KEY

## 2. Vercel 环境变量配置

- [x] 2.1 在 Vercel Dashboard 添加 VITE_SUPABASE_URL 环境变量
- [x] 2.2 在 Vercel Dashboard 添加 VITE_SUPABASE_ANON_KEY 环境变量
- [x] 2.3 在 Vercel Dashboard 添加 VITE_OPENROUTER_API_KEY 环境变量
- [x] 2.4 本地开发：运行 `vercel env pull .env.local` 拉取环境变量

## 3. 前端依赖安装

- [x] 3.1 运行 `npm install @supabase/supabase-js`
- [x] 3.2 在 package.json 中验证 @supabase/supabase-js 版本

## 4. Supabase 认证服务

- [x] 4.1 创建 `src/services/supabaseClient.js`，初始化 Supabase 客户端
- [x] 4.2 导出初始化后的 supabase 客户端供其他模块使用

## 5. 用户认证集成

- [x] 5.1 修改 `src/App.jsx`，在 useEffect 中调用 `supabase.auth.signInAnonymously()`
- [x] 5.2 处理认证错误（用户已存在则跳过，返回错误则 console.error）
- [x] 5.3 确保认证完成后再渲染页面组件（可用 loading state）

## 6. Supabase 数据服务

- [x] 6.1 创建 `src/services/supabaseService.js`，实现 `getRecords()`、`saveRecord()`、`deleteRecord()`
- [x] 6.2 `getRecords()` 从 `records` 表查询所有用户的记录，按 created_at 降序
- [x] 6.3 `saveRecord(record)` 插入新记录（自动关联用户 ID）
- [x] 6.4 `deleteRecord(id)` 删除指定记录（RLS 保证权限检查）
- [x] 6.5 各函数添加错误处理和日志

## 7. Vercel Function - OpenRouter 代理

- [x] 7.1 创建 `api/recognize.js` Vercel Function
- [x] 7.2 实现 `handler(req, res)` 接收 POST 请求，提取 `imageBase64` 和 `location`
- [x] 7.3 在 handler 中调用 OpenRouter API（使用 process.env.VITE_OPENROUTER_API_KEY）
- [x] 7.4 返回 OpenRouter 的结果 `{ species, journal, title }`
- [x] 7.5 添加错误处理（返回 400/500 状态码和错误信息）

## 8. 改进 NewEncounterPage 组件

- [x] 8.1 修改 `src/pages/NewEncounterPage.jsx`，将 AI 识别调用改为 POST /api/recognize
- [x] 8.2 前端发送 `{ imageBase64, location }` 到 `/api/recognize` 而不是直接调 aiService
- [x] 8.3 解析后端返回的 `{ species, journal, title }`，展示在偶遇卡片中
- [x] 8.4 修改「保存到日志」逻辑，调用 `supabaseService.saveRecord()` 而不是 storageService
- [x] 8.5 删除对 aiService 和 storageService 的导入和调用
- [ ] 8.6 测试：上传图片 → 生成日志 → 编辑 → 保存 → 跳回列表

## 9. 改进 ListPage 组件

- [x] 9.1 修改 `src/pages/ListPage.jsx` 中的数据源，从 getRecords() 调用改为 supabaseService.getRecords()
- [x] 9.2 调整 useEffect 和 state 初始化，确保从 Supabase 读取数据
- [x] 9.3 修改删除逻辑，调用 `supabaseService.deleteRecord()` 而不是 storageService
- [x] 9.4 删除对 storageService 的导入
- [ ] 9.5 测试：列表加载 → 展示记录 → 删除记录 → 列表更新

## 10. 清理旧服务

- [x] 10.1 删除 `src/services/storageService.js`（不再需要）
- [x] 10.2 验证没有其他文件导入 storageService
- [x] 10.3 删除 `src/services/aiService.js`（不再需要，改用后端代理）
- [x] 10.4 验证没有其他文件导入 aiService

## 11. 环境变量文件更新

- [x] 11.1 更新 `.env.example`，添加 VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY、VITE_OPENROUTER_API_KEY
- [x] 11.2 添加说明注释（哪些是前端用，哪些是后端用）
- [x] 11.3 删除或注释旧的 VITE_OPENROUTER_KEY（如果有）

## 12. PRD.md 更新

- [x] 12.1 修改技术方案部分，改为"Vercel + Supabase"
- [x] 12.2 修改数据存储说明，从 localStorage 改为 Supabase PostgreSQL
- [x] 12.3 修改部署说明，强调需要 Supabase 环境变量配置
- [x] 12.4 删除旧的安全警告（API Key 前端暴露），改为新的后端代理说明
- [x] 12.5 添加版本规划更新：v0.3 现在包含 Supabase 后端集成

## 13. 本地开发测试

- [ ] 13.1 运行 `npm run dev`，确保开发服务器启动成功
- [ ] 13.2 浏览器打开 http://localhost:5173，确保初始页面加载无错误
- [ ] 13.3 测试认证：检查浏览器 Console 是否有认证成功日志
- [ ] 13.4 测试新建记录：上传图片 → 生成 → 保存 → 列表出现新记录
- [ ] 13.5 测试删除记录：点击删除 → 确认 → 列表更新
- [ ] 13.6 打开开发者工具检查网络：确认 API Key 不暴露

## 14. Vercel Preview 部署测试

- [ ] 14.1 提交代码到 GitHub（新分支或直接 main）
- [ ] 14.2 Vercel 自动部署 Preview 环境
- [ ] 14.3 在 Preview URL 上测试：认证、新建、删除、列表
- [ ] 14.4 手机浏览器打开 Preview URL，测试移动端适配

## 15. 生产部署

- [ ] 15.1 确认所有测试通过
- [ ] 15.2 提交代码到 main 分支（或 merge PR）
- [ ] 15.3 Vercel 自动部署生产环境
- [ ] 15.4 访问生产 URL，验证所有功能正常
- [ ] 15.5 Git commit 和 progress.md 更新

## 16. 文档和清理

- [ ] 16.1 更新 README.md（如果有），说明 Supabase 环境变量配置方法
- [ ] 16.2 删除 localStorage 相关的代码注释或过时文档
- [ ] 16.3 整理 git 提交历史，确保 commit message 清晰
