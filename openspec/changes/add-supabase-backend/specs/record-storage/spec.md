## MODIFIED Requirements

### Requirement: 保存偶遇记录到 Supabase
系统 SHALL 在识别成功后将记录（id、imageBase64、location、species、journal、title、createdAt）写入 Supabase 的 `records` 表，并自动关联到当前认证用户。

#### Scenario: 首次保存
- **WHEN** 用户点击「保存到日志」，且 species 不为空
- **THEN** 系统调用 supabaseService.saveRecord()，记录被写入 Supabase，user_id 自动设置为当前认证用户

#### Scenario: 多用户隔离
- **WHEN** 用户 A 和用户 B 分别保存记录
- **THEN** 用户 A 的记录只能被用户 A 读取，用户 B 看不到用户 A 的记录（RLS 保证）

#### Scenario: 保存成功后跳转
- **WHEN** Supabase 成功插入记录
- **THEN** 系统跳转回列表页，新记录立即可见

#### Scenario: 保存失败（网络错误）
- **WHEN** Supabase 连接失败或返回错误
- **THEN** 系统展示错误提示，仍保留偶遇卡片，不跳转

### Requirement: 从 Supabase 读取所有记录
系统 SHALL 从 Supabase 读取当前用户所有记录，按 createdAt 降序排列（最新在前）。

#### Scenario: 有记录时读取
- **WHEN** ListPage 加载，当前用户在 Supabase 中有一条或多条记录
- **THEN** 系统调用 supabaseService.getRecords()，返回完整记录数组，最新记录排在第一位

#### Scenario: 无记录时读取
- **WHEN** ListPage 加载，Supabase 中不存在该用户的记录
- **THEN** 返回空数组，ListPage 展示空状态

#### Scenario: 网络不可用
- **WHEN** Supabase 连接失败
- **THEN** 系统返回错误，ListPage 可展示离线提示（可选）

### Requirement: 删除单条记录
系统 SHALL 根据 id 从 Supabase 删除对应记录（仅删除该用户的记录，RLS 保证隔离）。

#### Scenario: 删除存在的记录
- **WHEN** 用户触发删除，且该 id 存在且属于该用户
- **THEN** 该记录从 Supabase 删除，列表实时更新

#### Scenario: 删除权限检查
- **WHEN** 用户尝试删除另一用户的记录（直接调用 API）
- **THEN** Supabase RLS 拒绝删除，返回权限错误

#### Scenario: Supabase 不可用
- **WHEN** Supabase 连接失败或返回错误
- **THEN** 捕获异常，展示删除失败提示
