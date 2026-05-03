## ADDED Requirements

### Requirement: 保存新记录后自动触发回头客检测
保存新记录成功后，系统 SHALL 自动检测是否存在同物种的历史记录。若存在，则调用 AI 对比图像相似度，将结果（最相似记录 ID 和分数）写回该记录。

#### Scenario: 有同物种历史记录时触发检测
- **WHEN** 用户保存一条新偶遇记录，且数据库中已有同物种的历史记录
- **THEN** 系统 SHALL 取最近 5 条同物种历史记录，调用 AI 对比图像相似度，将最高分对应的记录 ID 和分数写入 `similar_record_id` 和 `similarity_score`

#### Scenario: 无同物种历史记录时跳过检测
- **WHEN** 用户保存一条新偶遇记录，且数据库中没有同物种的历史记录
- **THEN** 系统 SHALL 跳过 AI 对比，`similar_record_id` 和 `similarity_score` 保持 NULL，不增加额外 API 调用

#### Scenario: AI 检测失败时静默降级
- **WHEN** AI 对比调用超时或返回错误
- **THEN** 系统 SHALL 静默忽略检测结果，保存记录仍视为成功，不向用户报错

---

### Requirement: 相似度达到阈值时弹出提示卡片
检测完成后，若最高相似度 ≥ 60 分，系统 SHALL 在保存成功后弹出回头客建议卡片。

#### Scenario: 相似度高时弹出建议
- **WHEN** AI 检测返回相似度 ≥ 60 分
- **THEN** 系统 SHALL 弹出 ReturningSuggestionModal，展示："与 [历史记录日期] 那只 [物种] 相似度 [分数]%，是老朋友吗？"，并提供「确认关联」和「忽略」两个操作

#### Scenario: 相似度低时不弹出
- **WHEN** AI 检测返回相似度 < 60 分，或未检测（NULL）
- **THEN** 系统 SHALL 不弹出提示卡片，正常完成保存流程

---

### Requirement: 手动触发回头客检测
用户 SHALL 能在详情页手动触发对任意一条记录的回头客检测。

#### Scenario: 手动触发检测
- **WHEN** 用户在详情页菜单点击「查找回头客」
- **THEN** 系统 SHALL 对该记录执行同物种历史对比，完成后展示结果或提示「未找到相似记录」

#### Scenario: 已有检测结果时重新检测
- **WHEN** 用户点击「查找回头客」且该记录已有 `similarity_score`
- **THEN** 系统 SHALL 重新执行检测，用新结果覆盖旧结果
