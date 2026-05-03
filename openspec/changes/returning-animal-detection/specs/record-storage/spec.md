## MODIFIED Requirements

### Requirement: 记录数据结构
records 表 SHALL 存储每条偶遇记录的完整信息，包括回头客检测结果字段。

#### Scenario: 新增记录包含回头客字段
- **WHEN** 系统创建一条新记录
- **THEN** records 表 SHALL 包含以下字段：id、user_id、image_base64、species、category、title、journal、location、latitude、longitude、created_at，以及新增的 `similar_record_id`（UUID，可为 NULL）、`similarity_score`（INTEGER 0-100，可为 NULL）、`confirmed_returning`（BOOLEAN，默认 false）

#### Scenario: 回头客检测写回数据库
- **WHEN** AI 检测完成后
- **THEN** 系统 SHALL 通过后端 API 将 `similar_record_id` 和 `similarity_score` 更新至对应记录，使用 service role key 绕过 RLS

#### Scenario: 用户确认关联写回数据库
- **WHEN** 用户确认回头客关联
- **THEN** 系统 SHALL 通过后端 API 将 `confirmed_returning` 更新为 true，使用用户的 anon token（RLS 保证只能更新自己的记录）
