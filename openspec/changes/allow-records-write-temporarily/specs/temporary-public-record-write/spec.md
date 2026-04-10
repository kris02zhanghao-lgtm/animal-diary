## ADDED Requirements

### Requirement: 未登录用户可临时写入 records 表
系统 SHALL 允许未登录前端用户在临时恢复阶段向 `records` 表新增偶遇记录，以恢复“保存到日志”功能可用。

#### Scenario: 未登录用户保存记录
- **WHEN** 前端用户未建立 Supabase 登录会话并提交一条新的偶遇记录
- **THEN** 系统允许该记录写入 `records` 表

### Requirement: 临时开放范围仅限新增写入
系统 SHALL 将临时开放能力限制在恢复新增写入所需的最小范围内，不因本次修复默认放开其他高风险操作。

#### Scenario: 仅恢复新增写入
- **WHEN** 本次临时策略生效
- **THEN** 系统仅保证未登录用户可执行新增写入，不将其解释为删除、更新或长期数据隔离方案已完成
