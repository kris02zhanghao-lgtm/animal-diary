## 1. 移除旧的 hover 删除逻辑

- [x] 1.1 删除 `CollectionPage.jsx` 中照片卡片上的 hover 删除按钮（`opacity-0 group-hover:opacity-100` 的 × 按钮）
- [x] 1.2 删除 `confirmingId` state 和单条删除相关逻辑（`handleDelete`、确认弹窗）

## 2. 新增选择模式 State

- [x] 2.1 新增 `isSelectMode` state（boolean，默认 false）
- [x] 2.2 新增 `selectedIds` state（Set，默认空）
- [x] 2.3 新增 `confirmingBatch` state（boolean，控制批量删除确认弹窗）

## 3. 实现长按/右键进入选择模式

- [x] 3.1 手机端：`onTouchStart` 启动 500ms 定时器，`onTouchEnd` 清除
- [x] 3.2 PC 端：`onContextMenu`（右键）直接进入选择模式
- [x] 3.3 照片卡片绑定事件，长按或右键后进入选择模式并选中该条

## 4. 实现选择模式 UI

- [x] 4.1 照片卡片左上角添加圆圈选中指示器（选择模式下显示；未选中：灰圆；已选中：绿色打勾）
- [x] 4.2 照片卡片点击行为：选择模式下切换选中状态（`toggleSelect`）
- [x] 4.3 顶部操作栏：选择模式下替换为「已选X张」文字 + 「取消」按钮 + 「删除」按钮

## 5. 实现批量删除

- [x] 5.1 实现 `handleBatchDelete()`：遍历 `selectedIds`，逐条调用 `deleteRecord`，完成后重新 fetch 数据
- [x] 5.2 删除完成后检查该大类是否还有记录：若无则 `setSelectedSpecies(null)` 返回第一层
- [x] 5.3 删除完成后退出选择模式，清空 `selectedIds`

## 6. 批量删除确认弹窗

- [x] 6.1 复用现有弹窗样式，文案改为"确认删除这X条偶遇记录？"（X 为选中数量）
- [x] 6.2 点击「再想想」关闭弹窗，保持选择模式
- [x] 6.3 点击「挥手道别」执行 `handleBatchDelete()`

## 7. 验收测试

- [x] 7.1 手机端：长按照片进入选择模式，圆圈指示器显示正确
- [x] 7.2 手机端：多选后点删除，确认弹窗显示正确数量
- [x] 7.3 手机端：批量删除全部照片后自动返回第一层
- [x] 7.4 手机端：取消按钮退出选择模式，无误操作
- [x] 7.5 PC 端：右键点击进入选择模式，同样工作正常

## 8. 收尾

- [x] 8.1 更新 progress.md
- [x] 8.2 git commit
