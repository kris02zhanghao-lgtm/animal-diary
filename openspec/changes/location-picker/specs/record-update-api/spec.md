## ADDED Requirements

### Requirement: 后端记录更新接口
系统 SHALL 提供 PUT `/api/update-record` 接口，接受 `{ id, ...fields }` 并更新 Supabase 中对应记录的指定字段，仅更新传入的字段（partial update）。

#### Scenario: 更新位置字段成功
- **WHEN** 携带有效 Bearer token 发送 `{ id, location, latitude, longitude }`
- **THEN** Supabase 对应记录的三个字段更新，返回 `{ success: true }`

#### Scenario: 更新其他字段（v0.4.2 复用）
- **WHEN** 携带有效 Bearer token 发送 `{ id, title, species, journal }`
- **THEN** Supabase 对应记录的对应字段更新，返回 `{ success: true }`

#### Scenario: token 无效或记录不属于当前用户
- **WHEN** Bearer token 无效，或请求更新的 id 不属于该 token 对应用户
- **THEN** 返回 403 错误，Supabase RLS 阻止更新

#### Scenario: 缺少 id 参数
- **WHEN** 请求 body 中未包含 id
- **THEN** 返回 400 错误，不执行数据库操作
