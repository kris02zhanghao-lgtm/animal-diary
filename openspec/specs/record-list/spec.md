### Requirement: 展示历史记录列表
ListPage SHALL 从 localStorage 读取所有记录并以卡片形式展示，每张卡片显示动物图片、物种名、地点、日志摘要和时间。

#### Scenario: 有记录时展示
- **WHEN** localStorage 中存在一条或多条记录
- **THEN** ListPage 渲染对应数量的记录卡片，按最新在前排列

#### Scenario: 无记录时展示空状态
- **WHEN** localStorage 中没有任何记录
- **THEN** 展示空状态提示（松鼠 emoji + 引导文字），不展示卡片列表

### Requirement: 删除单条记录
用户 SHALL 能在列表中删除任意一条记录，删除后列表实时更新。

#### Scenario: 删除一条记录
- **WHEN** 用户点击某条记录的删除按钮并确认
- **THEN** 该记录从列表和 localStorage 中移除，其余记录保留

#### Scenario: 删除后为空
- **WHEN** 用户删除最后一条记录
- **THEN** 列表切换为空状态展示
