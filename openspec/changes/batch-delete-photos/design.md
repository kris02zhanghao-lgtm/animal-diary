## 关键决策

### 决策1：长按 500ms 进入选择模式

移动端通过 `onTouchStart` 启动 500ms 定时器，`onTouchEnd`/`onTouchMove` 清除定时器；桌面端通过 `onMouseDown` 同样启动定时器，`onMouseUp`/`onMouseLeave` 清除。500ms 是系统长按惯例，不会和普通点击冲突。

### 决策2：保留单条删除确认弹窗，改为多选后的批量确认

选中若干张后，点击顶部「删除」，弹出原有样式的确认弹窗（"确认删除这X条偶遇记录？"），确认后批量删除。复用现有弹窗样式，不引入新组件。

### 决策3：选择模式 UI 覆层

照片左上角显示圆圈（未选中：灰色空心；已选中：绿色打勾）。顶部替换为操作栏："已选X张 / 取消 / 删除"。不在图片上遮罩，保持照片可见。

### 决策4：全部删除后自动返回第一层

批量删除后，若该物种已无记录，自动调用 `setSelectedSpecies(null)` 回到物种网格，与原有单条删除逻辑一致。

## State 设计

```
isSelectMode: boolean          // 是否处于选择模式
selectedIds: Set<string>       // 已选记录 ID 集合
confirmingBatch: boolean       // 批量删除确认弹窗是否显示
```

## 实现细节

- 修改 `src/pages/CollectionPage.jsx`
- 移除 `confirmingId` 单条删除逻辑和 hover 删除按钮
- 新增 `handleLongPress(recordId)` 函数：进入选择模式并选中该条
- 新增 `toggleSelect(recordId)` 函数：切换某条的选中状态
- 新增 `handleBatchDelete()` 函数：批量调用 deleteRecord，完成后刷新数据
- 顶部操作栏：选择模式下替换返回按钮区域
