## MODIFIED Requirements

### Requirement: 展示历史记录列表
ListPage SHALL 从后端 API 读取所有记录并以卡片形式展示，每张卡片显示动物图片、物种名、地点、日志摘要和时间。详情视图中 SHALL 提供「修改定位」入口，允许用户通过 LocationPicker 补充或更新坐标和地名。

#### Scenario: 有记录时展示
- **WHEN** 后端返回一条或多条记录
- **THEN** ListPage 渲染对应数量的记录卡片，按最新在前排列

#### Scenario: 无记录时展示空状态
- **WHEN** 后端返回空列表
- **THEN** 展示空状态提示（松鼠 emoji + 引导文字），不展示卡片列表

#### Scenario: 详情页补充定位
- **WHEN** 用户在详情视图点击「修改定位」按钮
- **THEN** 底部弹出 LocationPicker 面板，用户选定位置并确认后，调用 PUT /api/update-record 更新坐标和地名，地图页对应 marker 位置随之更新

#### Scenario: 定位保存成功后刷新
- **WHEN** LocationPicker 确认保存成功
- **THEN** 详情视图中的地点文字立即更新，列表页重新拉取数据
