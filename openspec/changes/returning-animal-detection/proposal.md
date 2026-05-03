## Why

用户多次在同一地点遇到外观相似的同类动物时，无法判断是否是同一只——这是从"照片记录器"升级为"城市动物关系档案"的关键一步。v0.8 引入回头客识别，让产品具备跨记录的动物身份感知能力。

## What Changes

- 建立物种的多层分类体系：大类（category，6 个）用于报告统计；中类（species_tag，~93 个）用于精细识别、回头客匹配、成就系统
- AI 识别增加第二层归一化：第 2 次调用同时返回 category 和 species_tag，按毛色优先规则映射到标准化列表
- 新建偶遇保存成功后，自动触发回头客检测：取同中类（species_tag）最近 5 条历史记录，调用 AI 判断相似度
- AI 返回 0-100 的相似度分数和匹配的历史记录 ID，保存至数据库
- 保存流程结束后，若相似度 ≥ 60，弹出提示卡片："与 3 月 15 日那只橘猫相似度 87%，是老朋友吗？"
- 用户可确认关联（建立回头客关系）或忽略
- 详情页展示该记录的回头客信息：相似度分数 + 历史记录入口
- 手动触发入口：详情页菜单增加"查找回头客"选项，随时触发检测

## Capabilities

### New Capabilities

- `returning-animal-detection`: 回头客检测核心能力——同中类（species_tag）历史记录拉取、AI 图像相似度计算、结果存储与展示
- `returning-animal-link`: 用户手动确认关联关系，建立记录之间的回头客绑定，详情页展示关联档案

### Modified Capabilities

- `record-storage`: records 表新增 `species_tag`（标准化中类物种标签）、`similar_record_id`（关联的历史记录 ID）、`similarity_score`（AI 相似度分数 0-100）、`confirmed_returning`（用户确认标记）四个字段
- `new-encounter`（AI 识别流程）: 第 2 次 AI 调用改为同时返回 category（大类）和 species_tag（中类），按毛色优先规则映射到预定义列表

## Impact

- **新增后端 API**：`api/detect-returning.js` — 接收新记录 ID，拉取同中类（species_tag）历史，调用 AI 判断，写回相似度结果
- **修改 `api/recognize.js`**：第 2 次 AI 调用改为同时返回 category + species_tag，按预定义列表和毛色优先规则映射
- **修改 `api/save-record.js`**：保存完成后同步触发回头客检测，将相似度结果附在 response 返回
- **新增后端 API**：`api/confirm-returning.js` — 用户确认关联时，更新 `confirmed_returning` 字段
- **前端新组件**：`ReturningSuggestionModal.jsx`（保存后弹窗）
- **修改详情页**：`ListPage.jsx` 详情视图新增回头客信息展示区、手动触发「查找回头客」选项
- **数据库迁移**：Supabase records 表新增四列（species_tag、similar_record_id、similarity_score、confirmed_returning）
- **AI 调用增加**：每次保存额外 1 次 AI 调用（第 2 次调用扩展为返回 species_tag，同时检测时额外 1 次图像对比）；仅当同中类历史 ≥ 1 条时触发图像对比
