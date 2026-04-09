## ADDED Requirements

### Requirement: 保存偶遇记录
系统 SHALL 在识别成功后将记录（id、imageBase64、location、species、journal、createdAt）写入 localStorage 的 `animal-diary-records` 数组。

#### Scenario: 首次保存
- **WHEN** localStorage 中不存在 `animal-diary-records`
- **THEN** 系统创建新数组并写入该记录

#### Scenario: 追加保存
- **WHEN** localStorage 中已有记录
- **THEN** 新记录追加到数组末尾，原有记录不受影响

### Requirement: 读取所有记录
系统 SHALL 从 localStorage 读取 `animal-diary-records` 并返回数组，按 createdAt 降序排列（最新在前）。

#### Scenario: 有记录时读取
- **WHEN** localStorage 中存在记录
- **THEN** 返回完整记录数组，最新记录排在第一位

#### Scenario: 无记录时读取
- **WHEN** localStorage 中不存在 `animal-diary-records`
- **THEN** 返回空数组

### Requirement: 删除单条记录
系统 SHALL 根据 id 从 localStorage 中删除对应记录。

#### Scenario: 删除存在的记录
- **WHEN** 用户触发删除，且该 id 存在
- **THEN** 该记录从数组中移除，其余记录保留，localStorage 更新

#### Scenario: localStorage 不可用
- **WHEN** localStorage 抛出异常（如隐私模式）
- **THEN** 捕获异常，操作静默失败或返回错误标识
