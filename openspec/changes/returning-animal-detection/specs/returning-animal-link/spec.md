## ADDED Requirements

### Requirement: 用户确认回头客关联
用户 SHALL 能在弹出提示后确认两条记录为同一只动物，系统将 `confirmed_returning` 标记为 true。

#### Scenario: 用户确认关联
- **WHEN** 用户在 ReturningSuggestionModal 点击「确认关联」
- **THEN** 系统 SHALL 将该记录的 `confirmed_returning` 设为 true，关闭弹窗，并在详情页显示「老朋友」标记

#### Scenario: 用户忽略建议
- **WHEN** 用户在 ReturningSuggestionModal 点击「忽略」或关闭弹窗
- **THEN** 系统 SHALL 关闭弹窗，`confirmed_returning` 保持 false，`similar_record_id` 和 `similarity_score` 保留（仍可在详情页查看）

---

### Requirement: 详情页展示回头客信息
记录详情页 SHALL 展示该记录的回头客检测结果。

#### Scenario: 有相似度结果时展示（≥ 40 分）
- **WHEN** 用户打开一条 `similarity_score ≥ 40` 的记录详情页
- **THEN** 系统 SHALL 在详情页展示回头客信息区域：相似度级别描述（高/中/低）+ 「查看关联记录」入口

#### Scenario: 已确认关联时展示老朋友标记
- **WHEN** 用户打开一条 `confirmed_returning = true` 的记录详情页
- **THEN** 系统 SHALL 显示「老朋友 🐾」标记和关联记录的日期、地点摘要

#### Scenario: 未检测或相似度低时不展示
- **WHEN** 用户打开一条 `similarity_score < 40` 或 `similarity_score IS NULL` 的记录详情页
- **THEN** 系统 SHALL 不显示回头客信息区域（详情页与当前无差别）
