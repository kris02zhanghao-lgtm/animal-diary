## 1. 数据库迁移

- [x] 1.1 在 Supabase SQL Editor 执行迁移：records 表新增 `species_tag`（VARCHAR, NOT NULL, DEFAULT 'other-animal'）、`similar_record_id`（UUID, nullable, references records(id)）、`similarity_score`（INTEGER, nullable）、`confirmed_returning`（BOOLEAN, default false）
- [x] 1.2 验证 Supabase 表结构更新正确，四列均存在且类型正确

## 2. 改造 AI 识别流程（第 2 次调用）— 增加 species_tag 归一化

- [x] 2.1 修改 `api/recognize.js` 的第 2 次 AI 调用 prompt：让 AI 同时返回 `{ category, species_tag, reason }`，其中 species_tag 必须从预定义列表中选择
- [x] 2.2 prompt 里明确规则：「猫类优先毛色标签，除非品种特征极其突出；狗类优先品种，不确定选中华田园犬；其他按列表映射」
- [x] 2.3 修改 `NewEncounterPage.jsx`：AI 返回结果后同时获取 `category` 和 `species_tag`，存储到表单数据
- [x] 2.4 修改 `api/save-record.js`：保存时将 `species_tag` 写入数据库（不再依赖前端，由后端直接从识别结果读取）

## 3. 后端检测 API

- [x] 3.1 新建 `api/detect-returning.js`：接收 `recordId`（新记录 ID）和 `accessToken`，从数据库读取该记录的 species_tag、image_base64 和 species（原始）
- [x] 3.2 `api/detect-returning.js`：查询同 user_id + 同 species_tag（中类）的最近 5 条历史记录（排除当前记录，按 created_at 倒序）
- [x] 3.3 `api/detect-returning.js`：若历史记录数 ≥ 1，构造 AI prompt，传入新记录图片和历史记录图片（多模态），要求 AI 返回 `{ similar_record_id, score, reason }` JSON
- [x] 3.4 `api/detect-returning.js`：将 AI 返回的 `similar_record_id` 和 `similarity_score` 写回新记录（用 service role key 更新），返回结果给前端
- [x] 3.5 `api/detect-returning.js`：整体用 try-catch 包住，异常时返回 `{ detected: false }` 而非 500 错误

## 4. 更新确认关联 API

- [x] 4.1 新建 `api/confirm-returning.js`：接收 `recordId` 和 `accessToken`，将该记录 `confirmed_returning` 更新为 true（用用户 token，RLS 保证只能改自己的记录）

## 5. 保存后触发检测

- [x] 5.1 修改 `api/save-record.js`：保存记录成功后，调用 `detect-returning` 逻辑（可直接 import 函数或内联调用），将检测结果附在保存 response 里返回（`{ id, ..., returningDetection: { detected, similarRecordId, score } }`）
- [x] 5.2 修改 `src/services/supabaseService.js` 的 `saveRecord`：解析 response 中的 `returningDetection` 字段并返回给调用方

## 6. 前端弹窗组件

- [x] 6.1 新建 `src/components/ReturningSuggestionModal.jsx`：接收 `similarRecord`（历史记录摘要）、`score`、`onConfirm`、`onDismiss` props
- [x] 6.2 `ReturningSuggestionModal.jsx` UI：展示"与 [日期] 那只 [物种] 相似度 [score]%，是老朋友吗？"文案，「确认关联」和「忽略」两个按钮，暖色系星露谷风格
- [x] 6.3 在新建偶遇保存流程（`NewEncounterPage.jsx`）中：保存成功后若 `score ≥ 60`，弹出 `ReturningSuggestionModal`
- [x] 6.4 用户点「确认关联」时：调用 `api/confirm-returning.js`，成功后关闭弹窗
- [x] 6.5 用户点「忽略」时：直接关闭弹窗，不做额外操作

## 7. 详情页展示回头客信息

- [x] 7.1 修改 `api/list-records.js`：返回的记录对象包含 `species_tag`、`similar_record_id`、`similarity_score`、`confirmed_returning` 字段
- [x] 7.2 修改 `ListPage.jsx` 详情视图：当 `similarity_score ≥ 40` 时，在日志下方展示回头客信息区域（相似度描述 + 「查看关联记录」按钮）
- [x] 7.3 详情页：当 `confirmed_returning = true` 时，显示「老朋友 🐾」标记
- [x] 7.4 「查看关联记录」按钮：点击后展开对应历史记录的详情（复用 `expandTargetId` 模式跳转）

## 8. 手动触发检测

- [x] 8.1 修改 `ListPage.jsx` 详情页菜单：新增「查找回头客」选项
- [x] 8.2 点击「查找回头客」时：调用 `api/detect-returning.js`，展示 loading 状态，完成后刷新详情页回头客区域
- [x] 8.3 若检测结果 score < 40：展示「未找到相似记录」提示，而非弹出弹窗

## 9. 验收测试

- [ ] 9.1 本地 `vercel dev`：新建一条已有同中类（species_tag）历史的记录，确认弹窗出现、分数显示正确、species_tag 写入正确
- [ ] 9.2 确认关联后，刷新详情页，确认「老朋友 🐾」标记和「查看关联记录」按钮均显示
- [ ] 9.3 手动触发「查找回头客」：确认 loading 状态 → 结果更新流程正常
- [ ] 9.4 AI 调用失败时（断网或 mock 错误）：确认保存仍成功，无 500 报错，species_tag 仍正确保存
- [ ] 9.5 线上部署并验收：`https://animal-diary.vercel.app` 完整功能可用，各物种的 species_tag 归一化正确
