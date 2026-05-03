## 1. 弹窗 UI 增强 - 添加被关联动物的照片

- [x] 1.1 修改 `src/components/ReturningSuggestionModal.jsx`：在 `similarRecord` props 中接收 `image_base64`（从 `supabaseService.js` 的 `saveRecord` 返回的 `returningDetection.similarRecord` 获得）
- [x] 1.2 弹窗布局调整：上方展示照片（object-fit: contain, max-height: 300px），下方展示动物信息和相似度
- [x] 1.3 照片容器添加边框和样式，保持星露谷风格一致（暖色系边框）

## 2. 后端数据支持 - 返回反向关联信息

- [x] 2.1 修改 `api/list-records.js`：在 SELECT 查询后增加反向查询逻辑，查找所有 `similar_record_id = 当前记录 ID` 的记录，限制返回前 3 条
- [x] 2.2 将反向关联数据作为 `linked_from` 字段添加到返回的 record 对象中，包含 `id`, `species`, `similarity_score`, `created_at`, `image_base64`
- [x] 2.3 确认性能：测试反向查询在记录较多时的响应时间

## 3. 详情页展示双向关联

- [x] 3.1 修改 `src/pages/ListPage.jsx` 详情页视图：在日志下方新增两个关联区块
- [x] 3.2 实现"我指向的关联"区块：当 `similarity_score >= 40` 时显示，展示 `similar_record_id` 的记录信息和分数
- [x] 3.3 实现"指向我的关联"区块：当 `linked_from` 数组非空时显示，列举最多 3 条指向当前记录的关联
- [x] 3.4 两个区块都添加"查看关联"按钮，点击时更新 `expandTargetId` 跳转到对应记录

## 4. 详情页添加顶部检测按钮

- [x] 4.1 修改 `src/pages/ListPage.jsx` 详情页 header：在「✏️ 编辑」按钮右侧添加「🔍 查找回头客」按钮
- [x] 4.2 按钮样式：与编辑按钮保持一致，hover 时反馈清晰
- [x] 4.3 按钮点击时：调用 `detectReturning(recordId)` API，显示 loading 状态（按钮变灰或显示 spinner）

## 5. 手动检测反馈提示

- [x] 5.1 修改 `src/pages/ListPage.jsx` 详情页：添加 detection 相关的 state（`detectionLoading`, `detectionMessage`, `detectionError`）
- [x] 5.2 `detectReturning()` 调用成功且 score >= 60：弹出 `ReturningSuggestionModal`（现有逻辑）
- [x] 5.3 `detectReturning()` 调用成功但无匹配（score < 40 或无历史记录）：在详情页顶部显示友好提示 "未找到相似记录，可能是新朋友呢"，5 秒后自动消失
- [x] 5.4 `detectReturning()` 调用失败：显示错误提示 "检测失败，请重试"，不关闭详情页

## 6. 兼容性与清理

- [x] 6.1 保留菜单中的「查找回头客」选项（向后兼容），但指向同样的检测逻辑
- [x] 6.2 确保 `NewEncounterPage.jsx` 保存流程中，`returningSuggestionModal` 仍能正常弹出（保存后自动触发检测）

## 7. 本地测试与验收

- [ ] 7.1 本地 `vercel dev` 测试：上传新记录，确认：弹窗中显示被关联动物的照片、相似度分数、文案布局正确
- [ ] 7.2 测试双向关联：确认在被关联的旧记录详情页中能看到"有其他记录关联到我"区块
- [ ] 7.3 测试手动检测：在详情页点击"查找回头客"，确认 loading 状态、成功/失败反馈均显示正确
- [ ] 7.4 测试边界条件：查找回头客找不到时、网络错误时、同物种历史为空时，各场景反馈正确

## 8. 上线部署与验收

- [ ] 8.1 部署到 Vercel：`vercel deploy --prod`
- [ ] 8.2 线上验收：在 https://animal-diary.vercel.app 重复本地测试场景 7.1-7.4
- [ ] 8.3 检查性能：打开多条关联记录，确认反向查询不会造成加载延迟
