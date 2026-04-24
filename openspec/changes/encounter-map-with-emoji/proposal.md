## Why

用户每次偶遇都有具体的地点，目前这些地点信息只作为文字标签显示在列表中，无法形成"空间感"。地图视图能让用户看到自己在城市中的偶遇分布，越用越丰富，形成个人专属的"城市动物地图"，强化收集感和探索动机。同时自动定位功能降低用户录入地点的门槛。

## What Changes

- 在列表页顶部的 Tab 中新增「地图」选项，与「时间线」并行
- 点击「地图」展示地图视图，用动物 emoji 标记每次偶遇的位置
- 新建偶遇时自动获取用户当前位置，允许用户手动修改
- emoji 与识别的动物种类动态对应（如橘猫、奶牛猫等具体种类），无法匹配时降级到通用分类（如"猫"、"鸟"）
- 点击地图上的 emoji 标记展开该次偶遇的卡片详情

## Capabilities

### New Capabilities
- `map-tab-view`: 列表页新增"地图"tab，地图视图与时间线视图切换
- `map-rendering`: 使用地图库（高德 Map JS API）渲染地图，标记偶遇位置
- `animal-emoji-mapping`: 根据识别的动物种类映射对应 emoji，支持具体种类和通用分类降级
- `auto-geolocation`: 使用浏览器 Geolocation API 自动获取用户当前位置
- `location-editing`: 新建偶遇时允许用户确认或修改自动获取的位置

### Modified Capabilities
<!-- 列表页的 tab 切换逻辑有修改，但这不涉及规格层面的变化，只是UI交互的扩展 -->

## Impact

- 前端代码：
  - ListPage.jsx: 新增地图 tab 切换逻辑
  - NewEncounterPage.jsx: 新增自动定位和位置确认UI
  - 新增 MapView.jsx 和 AnimalEmojiMapper.js 模块
  
- 后端：暂无后端改动，使用现有的数据API
  
- 依赖：新增高德地图 JS SDK（通过 CDN 加载，无需 npm）
  
- 数据：无需修改现有数据结构（location 字段已存在）

- 用户体验：降低"懒得输入地点"的摩擦，提升地图功能的可用性
