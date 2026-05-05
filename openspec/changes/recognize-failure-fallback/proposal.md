## Why

当前识别失败或超时时，用户无法继续保存记录，体验断裂。需要允许用户在AI识别失败时仍能保存空白或部分卡片，手动填充物种和日志，确保用户不会因为网络/API问题丢失拍照。

## What Changes

- **识别失败时显示空卡片**：不再隐藏结果卡片，改为显示空白模板（照片 + 空物种/日志输入框）
- **失败场景支持保存**：识别失败/超时时，保存按钮仍可用，允许用户保存"用户手填"模式的记录
- **错误提示优化**：识别错误提示改为卡片下方的轻量提示，不影响卡片交互
- **状态区分**：内部区分"识别成功"/"识别失败但可编辑"两种卡片状态

## Capabilities

### New Capabilities
- `recognition-failure-handling`：识别失败/超时时的降级体验，允许用户手动填充并保存

### Modified Capabilities
- `new-encounter`：新建流程需要支持识别失败后继续编辑和保存的路径
- `encounter-result-card`：结果卡片需要支持"失败但可编辑"状态的展示

## Impact

- **前端文件**：`src/pages/NewEncounterPage.jsx`（状态管理、卡片显示逻辑）、`src/components/EncounterResultCard.jsx`（失败状态样式）
- **后端文件**：`api/recognize.js`（确保失败时返回可用格式，不中断流程）
- **用户体验**：识别失败不再是"死路"，用户可以恢复操作、手动编辑、保存记录
