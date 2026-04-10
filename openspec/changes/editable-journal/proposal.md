## Why

AI生成的日志质量不稳定，用户有时需要修改措辞或补充细节。当前版本识别后直接保存，用户没有机会调整内容，导致部分记录不够准确或不符合个人偏好。

## What Changes

- AI生成日志后，日志文字从只读展示变为可编辑的文本框
- 动物种类字段同样支持手动修改
- 编辑完成后点击「保存这次偶遇」才真正写入 localStorage
- 保存后跳回列表页（现有流程保持不变）

## Capabilities

### New Capabilities
- `editable-journal`: 识别结果展示阶段提供可编辑的日志文本框和种类输入框，用户可在保存前修改AI生成的内容

### Modified Capabilities
- `new-encounter`: 新建偶遇流程新增"编辑"环节，识别成功后不再自动保存，改为显示可编辑结果 + 手动点击保存

## Impact

- `src/pages/NewEncounterPage.jsx`：识别结果区域改为可编辑输入框
- `src/services/aiService.js`：无需修改
- `src/services/storageService.js`：无需修改
