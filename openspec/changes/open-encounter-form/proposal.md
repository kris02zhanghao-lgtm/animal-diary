## Why

当前新建偶遇页采用"AI驱动"流程：用户必须先上传图片点击生成，才能看到可编辑的表单字段。这限制了用户自主记录的灵活性——无法在AI生成前预填内容，也无法完全手动记录一次偶遇。

## What Changes

- NewEncounterPage 改为"表单优先"设计：进入页面即展示完整的偶遇卡片表单（标题、日志、物种、地点），所有字段均可直接编辑
- AI 生成降格为辅助操作：按钮改为全宽主按钮「✨ AI帮我识别并生成」，生成后填充各字段（可覆盖用户已填内容），按钮文字变为「重新生成」
- 保存/分享按钮始终可见（物种为空时保存禁用），不再依赖AI生成状态才出现
- 按钮布局：AI生成独占一行（全宽） + 保存/分享并排一行（各占一半）

## Capabilities

### New Capabilities

无新能力，均为现有能力的行为变更。

### Modified Capabilities

- `new-encounter`: 新建偶遇流程从"先识别后编辑"改为"表单常驻，AI可选辅助"
- `encounter-result-card`: 偶遇卡片从"AI识别后出现的结果展示"改为"进入页面即存在的输入表单"

## Impact

- `src/pages/NewEncounterPage.jsx`：大幅重构，状态初始值、渲染逻辑、按钮布局均需修改
- `src/services/aiService.js`：无需修改
- `src/services/storageService.js`：无需修改
