## Context

当前 NewEncounterPage 状态：`title`、`species`、`journal` 初始值均为 `null`，偶遇档案卡片和操作按钮用 `{species && ...}` 条件渲染，只有 AI 识别成功后才出现。

改造目标：让卡片和按钮从进入页面起就存在，AI 只是填充字段的辅助手段。

## Goals / Non-Goals

**Goals:**
- 进入页面即展示完整偶遇档案卡片（含标题、日志、物种输入框）
- 操作按钮始终可见（保存/分享不依赖 AI 状态）
- AI 生成后覆盖填充各字段，生成前字段为空占位符
- 按钮布局：AI生成独占全宽一行，保存+分享并排一行

**Non-Goals:**
- 不改变 aiService 的调用逻辑
- 不改变 storageService 的存储结构
- 不改动 ListPage

## Decisions

**将 title/species/journal 初始值改为空字符串（而非 null）**

现有条件渲染 `{species && ...}` 依赖 null 判断是否"已生成"。改为空字符串后，卡片始终渲染，"是否已生成"的概念不再需要。
`recognizedAt` 也改为 `null`，AI 生成后设为当前时间，卡片日期区域在 null 时不显示日期（或显示今天日期）。

**保存按钮禁用条件改为 `!species.trim()`**

原逻辑不变，species 为空串时禁用保存，符合现有校验。

**handleImageSelect 不再重置 title/species/journal**

原来换图时会清空识别结果（因为图换了，AI结果失效）。新流程中用户可能已手动填写内容，不应自动清空。只重置 `recognizedAt` 和 `error`。
权衡：用户换图后如果忘记重新生成，可能保存了旧图+新内容的记录。可接受，因为是用户主动决策。

**AI 生成按钮文字随状态变化**
- 未生成过（`recognizedAt === null`）：「✨ AI 帮我识别并生成」
- 已生成过（`recognizedAt !== null`）：「重新生成」
- 加载中：「识别中...」

**日期显示改为"今天"兜底**
卡片标题区日期：`recognizedAt` 为 null 时显示今天日期（`new Date()`），不再留空，让卡片看起来始终完整。

## Risks / Trade-offs

- [用户换图后没有重新生成] → 数据不一致（新图+旧AI日志）。可接受，用户可以感知到，且可以手动修改日志内容。
- [空状态卡片视觉空洞] → 各字段 placeholder 文案需要有引导性，让用户知道可以直接填写或点AI生成。
