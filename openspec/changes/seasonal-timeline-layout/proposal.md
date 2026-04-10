## Why

当前列表页是单列时间倒序，随着记录增多会变成一条冗长的流，缺乏时间感和收集感。按季度分组 + 横向滑动卡片能让用户直观感受"这个春天遇到了哪些动物"，同时为后续图鉴 tab 切换做好结构铺垫。

## What Changes

- F2 列表页布局：从单列时间倒序改为**按季度分组**，每个季度为一个横向滑动的卡片轨道
- 分组标题格式：`YYYY年春/夏/秋/冬`（季度判断：3-5月=春，6-8月=夏，9-11月=秋，12-2月=冬）
- 首页顶部新增"时间线 / 图鉴"tab 切换 UI（**仅展示占位，点击不响应**，功能在 v0.4 与图鉴页一起实现）
- PRD 版本规划对调：v0.4 改为图鉴收集页（含 tab 切换功能），v0.5 改为偶遇地图 + 自动定位

## Capabilities

### New Capabilities

- `seasonal-grouping`: 列表记录按季度分组，每组内横向滑动展示卡片

### Modified Capabilities

- `record-list`: 列表展示方式从单列改为季度分组 + 横向滑动；新增顶部 tab 占位 UI

## Impact

- `src/pages/ListPage.jsx`：重构列表渲染逻辑，新增分组计算、横向滑动布局、tab 占位 UI
- `PRD.md`：v0.4 / v0.5 版本描述对调
- `src/services/storageService.js`：无需修改
