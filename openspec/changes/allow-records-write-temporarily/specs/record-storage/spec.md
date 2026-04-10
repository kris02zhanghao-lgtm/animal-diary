## MODIFIED Requirements

### Requirement: 保存偶遇记录
系统 SHALL 在识别成功后将记录写入存储层；在临时恢复阶段，前端未登录用户也必须能够将新记录写入 Supabase `records` 表，以恢复“保存到日志”功能。

#### Scenario: 未登录用户写入 Supabase
- **WHEN** 前端用户未建立 Supabase 登录会话并提交包含 image_base64、location、title、species、journal 的新记录
- **THEN** 系统将该记录成功写入 `records` 表

#### Scenario: 写入被策略拒绝
- **WHEN** `records` 表的权限策略阻止未登录用户新增记录
- **THEN** 系统返回明确错误，表示当前存储权限未正确配置
