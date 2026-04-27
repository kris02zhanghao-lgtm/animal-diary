## 1. 前置依赖确认

- [x] 1.1 确认 v0.4.1（location-picker）已完成：`api/update-record.js` 和 `supabaseService.updateRecord` 已存在
- [x] 1.2 确认 `LocationPicker` 组件已存在于 `src/components/LocationPicker.jsx`

## 2. 详情视图改造（ListPage.jsx）

- [x] 2.1 将标题渲染为可编辑 input（预填当前值）
- [x] 2.2 将日志渲染为可编辑 textarea（预填当前值）
- [x] 2.3 将物种渲染为可编辑 input（预填当前值）
- [x] 2.4 地点字段改为集成 LocationPicker 组件（而非纯文字 input），onConfirm 时同时更新地名和坐标
- [x] 2.5 新增 `isSaving` state，控制保存按钮的 loading 状态
- [x] 2.6 新增 `detailSaveError` state，在详情视图内展示保存失败提示
- [x] 2.7 实现「保存修改」按钮：调用 `updateRecord(id, { title, species, journal })`，成功后调用 `fetchRecords` 刷新列表
- [x] 2.8 物种字段为空时禁用「保存修改」按钮

## 4. 测试与验收

- [ ] 4.1 手动测试：在详情页修改物种、地点、日志，保存后返回列表，确认卡片内容已更新
- [ ] 4.2 测试物种清空时保存按钮禁用
- [ ] 4.3 测试网络断开时显示「保存失败，请重试」

## 5. 收尾

- [ ] 5.1 更新 progress.md 记录 v0.4.2 完成
- [ ] 5.2 git commit 所有改动
- [ ] 5.3 部署 Vercel 并线上验证
