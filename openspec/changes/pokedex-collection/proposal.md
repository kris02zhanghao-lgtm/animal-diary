## Why

用户目前只能看时间线视图的偶遇记录，无法快速了解「自己一共遇到过多少种物种」「哪个物种遇到最多次」，缺少收集感。通过图鉴视图，用户能看到自己的"收集成果"，激励更多地去寻找和记录新物种。

## What Changes

- 首页底部 tab 栏的「图鉴」tab 现已存在但未实现内容，现在补充具体功能
- 图鉴页采用两层结构：
  - **第一层**：物种卡片网格，每个物种卡片显示代表性照片（最新）、物种名、遇到次数、该物种占比百分比
  - **第二层**：点击物种卡片后展开该物种的所有照片网格，点击照片可查看完整卡片详情
- 每个物种卡片显示百分比（"遇到3次 / 总共20次记录 = 15%"），为成就系统（v0.6）铺垫

## Capabilities

### New Capabilities

- `pokedex-view`: 图鉴页面主视图，按物种网格布局展示所有收集的物种卡片
- `species-aggregation`: 从时间线记录中聚合物种数据，计算出现次数、地点、最新记录等
- `collection-progress`: 计算用户的物种收集完成度百分比（当前 / 理论值）
- `species-detail-view`: 点击物种卡片后展开该物种的所有记录时间线

### Modified Capabilities

- `record-list`: 原有时间线视图保留，现在首页需要支持「时间线/图鉴」两个 tab 的切换

## Impact

- `src/pages/ListPage.jsx`: 添加 tab 切换逻辑，根据 activeTab state 展示时间线或图鉴视图
- 新增 `src/components/CollectionPage.jsx` 或 `src/components/PokeDexView.jsx`: 图鉴视图主组件
- 新增 `src/services/collectionService.js` 或类似数据聚合函数：物种统计计算
- Supabase 查询优化：需要高效获取物种聚合数据（分组、计数、排序）
