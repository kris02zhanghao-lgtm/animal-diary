## Why

用户现有的偶遇记录分散在"时间线"和"图鉴"两个视图中，缺少一个统一的、有代入感的整体回顾。年度/季度报告能为用户制造"成就感"和"收集感"，激发继续探索和记录的动机——就像网易云音乐年度报告一样，让数据变成故事。

## What Changes

- 新增"报告"页面/tab，展示个人偶遇的年度总结或季度总结
- 支持两种时间窗口切换：最近三个月 + 自然年（按1月-12月统计）
- 报告包含核心数据：总偶遇数、top 3 物种、常去地点、最活跃月份
- 设计有视觉亮点：大数字突出（如"你今年遇见了 23 只猫"）
- 数据不足时展示友好空状态文案

## Capabilities

### New Capabilities
- `encounter-report`: 按年度或季度聚合用户偶遇数据，生成趣味总结报告的能力
- `report-navigation`: 在底部导航栏新增"报告"tab，与时间线/地图/图鉴/新建 并行显示

### Modified Capabilities
- `tab-navigation`: 现有底部 tab 导航需新增"报告"tab 选项

## Impact

**前端代码**：
- 新建 `src/pages/ReportPage.jsx` 组件
- 修改 `src/components/BottomTabBar.jsx`：新增报告 tab 和路由
- 新建 `src/services/reportService.js`：数据聚合逻辑（按时间窗口统计）

**数据层**：
- 需要能按年份/月份聚合 `records` 表数据（查询现有 Supabase 表即可，无新增表）

**UI/UX**：
- 卡片式分层展示，保持星露谷风格一致
- 空状态处理：无记录、数据不足、数据充足的三种状态
