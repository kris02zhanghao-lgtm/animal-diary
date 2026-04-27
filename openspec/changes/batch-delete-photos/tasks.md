## 1. 移除旧的 hover 删除逻辑

- [ ] 1.1 删除 `CollectionPage.jsx` 中照片卡片上的 hover 删除按钮（`opacity-0 group-hover:opacity-100` 的 × 按钮）
- [ ] 1.2 删除 `confirmingId` state 和单条删除相关逻辑（`handleDelete`、确认弹窗）

## 2. 新增选择模式 State

- [ ] 2.1 新增 `isSelectMode` state（boolean，默认 false）
- [ ] 2.2 新增 `selectedIds` state（Set，默认空）
- [ ] 2.3 新增 `confirmingBatch` state（boolean，控制批量删除确认弹窗）

## 3. 实现长按进入选择模式

- [ ] 3.1 实现 `useLongPress(onLongPress, delay=500)` 逻辑（`touchstart`/`touchend`/`touchmove` + `mousedown`/`mouseup`/`mouseleave` 组合定时器）
- [ ] 3.2 照片卡片绑定长按事件：长按后进入选择模式并选中该条（`setIsSelectMode(true)`，`setSelectedIds(new Set([record.id]))`）

## 4. 实现选择模式 UI

- [ ] 4.1 照片卡片左上角添加圆圈选中指示器（选择模式下显示；未选中：空心灰圆；已选中：绿色打勾）
- [ ] 4.2 照片卡片点击行为：选择模式下切换选中状态（`toggleSelect`），普通模式下为空操作（详情页跳转留给后续版本）
- [ ] 4.3 顶部操作栏：选择模式下替换为「已选X张」文字 + 「取消」按钮 + 「删除」按钮

## 5. 实现批量删除

- [ ] 5.1 实现 `handleBatchDelete()`：遍历 `selectedIds`，逐条调用 `deleteRecord`，完成后重新 fetch 数据
- [ ] 5.2 删除完成后检查该物种是否还有记录：若无则 `setSelectedSpecies(null)` 返回第一层
- [ ] 5.3 删除完成后退出选择模式，清空 `selectedIds`

## 6. 批量删除确认弹窗

- [ ] 6.1 复用现有弹窗样式，文案改为"确认删除这X条偶遇记录？"（X 为选中数量）
- [ ] 6.2 点击「再想想」关闭弹窗，保持选择模式
- [ ] 6.3 点击「挥手道别」执行 `handleBatchDelete()`

## 7. 验收测试

- [ ] 7.1 手机端：长按照片进入选择模式，圆圈指示器显示正确
- [ ] 7.2 手机端：多选后点删除，确认弹窗显示正确数量
- [ ] 7.3 手机端：批量删除全部照片后自动返回第一层
- [ ] 7.4 手机端：取消按钮退出选择模式，无误操作
- [ ] 7.5 桌面端：长按（mousedown 500ms）同样进入选择模式

## 8. 收尾

- [ ] 8.1 更新 progress.md
- [ ] 8.2 git commit
