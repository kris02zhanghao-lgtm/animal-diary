## Why

当前识别结果展示区域过于朴素（绿色边框卡片 + 纯文本），缺乏设计感和情感温度，与"个人动物图鉴"的产品定位不符。需要重新设计成有标题感、有层次的精美偶遇卡片，提升用户保存和分享的欲望。

## What Changes

- AI prompt 新增 `title` 字段（10字以内的偶遇小标题），aiService 返回值同步新增 title
- 识别结果区域重新设计为暖色系偶遇卡片，包含：大标题、日志正文（可编辑）、底部三标签（种类/时间/地点，其中种类和地点可编辑）
- 底部两个操作按钮：「保存到日志」（原有保存逻辑）和「分享发现」（暂时 toast 提示"即将上线"）
- 数据结构新增 `title` 字段，存入 localStorage

## Capabilities

### New Capabilities
- `encounter-result-card`: 识别结果以精美偶遇卡片形式展示，含标题、日志、标签和操作按钮

### Modified Capabilities
- `new-encounter`: 识别成功后展示新版偶遇卡片，替换原有绿色结果区域；AI 返回数据新增 title 字段

## Impact

- `src/services/aiService.js`：prompt 新增 title 字段，返回值新增 title
- `src/pages/NewEncounterPage.jsx`：识别结果区域 UI 全面重构
- `src/services/storageService.js`：saveRecord 传入新增 title 字段（兼容旧数据，title 可为空）
