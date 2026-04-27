## Why

图鉴第二层（物种照片网格）目前依赖 hover 显示删除按钮，手机端体验差（hover 不存在，按钮始终可见且误触风险高）。需要改为符合移动端习惯的长按多选删除，与系统相册保持一致。

## What Changes

- **BREAKING**：移除第二层照片卡片上的 hover 删除按钮
- 新增长按进入「选择模式」交互
- 选择模式下支持单选/多选照片
- 选中后批量删除，全部删完自动返回第一层

## Capabilities

### New Capabilities

- `photo-batch-select-delete`：长按照片进入选择模式，支持多选并批量删除，全部删完自动退回物种网格

### Modified Capabilities

- `species-detail-view`：删除交互从 hover 按钮改为长按多选模式（BREAKING：移除旧的删除按钮）

## Impact

- 修改文件：`src/pages/CollectionPage.jsx`
- 移除 `confirmingId` 相关的单条删除逻辑（或改造为多选后的批量确认）
- 新增 `isSelectMode`、`selectedIds` state
- 长按事件：`onTouchStart` + `onTouchEnd` 组合（移动端），`onMouseDown` 定时器（桌面端）
