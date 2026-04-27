## MODIFIED Requirements

### Requirement: 展示历史记录列表
ListPage SHALL 从后端 API 读取所有记录并以卡片形式展示，每张卡片显示动物图片、物种名、地点、日志摘要和时间。编辑保存成功后，列表数据 SHALL 实时反映最新内容。

#### Scenario: 有记录时展示
- **WHEN** 后端返回一条或多条记录
- **THEN** ListPage 渲染对应数量的记录卡片，按最新在前排列

#### Scenario: 无记录时展示空状态
- **WHEN** 后端返回空列表
- **THEN** 展示空状态提示（松鼠 emoji + 引导文字），不展示卡片列表

#### Scenario: 编辑保存后列表刷新
- **WHEN** 用户在详情视图保存修改成功
- **THEN** 列表页重新拉取数据，对应卡片显示最新的物种名、地点等字段
