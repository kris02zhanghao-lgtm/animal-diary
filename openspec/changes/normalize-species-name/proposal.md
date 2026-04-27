## Why

AI 识别同一只动物时，物种名会因光线、角度不同而产生细微变体（如"橘猫"/"橘白猫"/"橘黄猫"），导致图鉴页将同一动物聚合为多个物种卡片，破坏收集体验。

## What Changes

- 修改 `api/recognize.js` 的 AI prompt，明确要求 `species` 字段返回标准化中文俗名
- 增加约束：不在物种名中描述颜色/花纹，使用行业通用俗称（如"橘猫"统一不区分橘白/纯橘）

## Capabilities

### New Capabilities

- `species-name-normalization`：AI 识别时对物种名做标准化约束，减少同一物种的名称变体

### Modified Capabilities

（无 spec 级别的行为变更，仅 prompt 实现细节调整）

## Impact

- 修改文件：`api/recognize.js`（prompt 文字）
- 不影响返回 JSON 结构，前端无需改动
- 历史记录中已存在的变体名不会自动修正（用户可通过详情页手动编辑）
