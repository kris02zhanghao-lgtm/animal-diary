## MODIFIED Requirements

### Requirement: 展示历史记录列表
ListPage SHALL 从 localStorage 读取所有记录，按季度分组后以横向滑动卡片轨道展示。页面顶部 SHALL 显示"时间线 / 图鉴"tab 占位 UI，默认"时间线"为选中态，"图鉴"为未选中态，tab 点击暂不响应（v0.4 实现）。

#### Scenario: 有记录时展示分组列表
- **WHEN** localStorage 中存在一条或多条记录
- **THEN** ListPage 按季度分组渲染卡片，每组含分组标题和横向滑动轨道，最新季度在最前

#### Scenario: 无记录时展示空状态
- **WHEN** localStorage 中没有任何记录
- **THEN** 展示空状态提示（松鼠 emoji + 引导文字），不展示分组列表

#### Scenario: 顶部 tab 占位展示
- **WHEN** 用户进入列表页
- **THEN** 顶部显示"时间线"和"图鉴"两个 tab，"时间线"为激活样式，"图鉴"为非激活样式，点击均不触发页面变化
