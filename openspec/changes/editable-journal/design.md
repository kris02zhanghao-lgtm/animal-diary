## Context

当前 NewEncounterPage 在 AI 识别成功后立即自动保存并跳转列表页，用户无法修改识别结果。需要在识别结果展示阶段插入"编辑"环节，让用户可以调整 species 和 journal 再手动触发保存。

## Goals / Non-Goals

**Goals:**
- AI 识别成功后，species 和 journal 以可编辑 input/textarea 展示
- 用户编辑完成后点击「保存这次偶遇」才写入 localStorage
- 保存成功后跳回列表页（与现有行为一致）

**Non-Goals:**
- 不做草稿自动保存
- 不支持编辑历史记录（列表页已有条目不可修改）
- 不改变 AI 调用逻辑或 storageService

## Decisions

**将识别结果存入 state 而非直接保存**
识别成功后，将 `{ species, journal }` 存入 `recognitionResult` state，组件据此渲染可编辑区域。用户在 input/textarea 修改时同步更新 state，点击保存时使用最新 state 值调用 storageService。

这是最小改动方案：只修改 NewEncounterPage.jsx 的状态流转，其余服务层无需变动。

**两个独立字段，不合并为单一编辑框**
species 用单行 input，journal 用多行 textarea，保持语义清晰，也符合现有数据结构。

## Risks / Trade-offs

- [用户清空 species 后保存] → 保存前做非空校验，species 为空时禁用保存按钮或给出提示
- [改动破坏现有自动保存流程] → 只改 NewEncounterPage.jsx，storageService 和 aiService 不动，风险隔离
