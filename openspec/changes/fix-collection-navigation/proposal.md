## Why

当前图鉴页点击照片卡片没有跳转到时间线详情页，用户无法查看和编辑单条记录的详情信息。同时长按和普通点击没有区分，导致交互混乱。修复这个问题能让用户在图鉴中便捷地访问记录详情。

## What Changes

- 修改 CollectionPage，区分点击和长按的行为：普通点击导航到时间线并展开该条记录详情，长按进入批量选择模式
- 修改 App.jsx，为 CollectionPage 传入导航回调，使其能跳转到 ListPage 并指定要展开的记录 ID

## Capabilities

### New Capabilities

### Modified Capabilities
- `batch-delete-photos`: 长按进入选择模式的交互逻辑优化（确保与普通点击导航不冲突）

## Impact

- CollectionPage.jsx：修改点击处理逻辑，区分点击和长按
- App.jsx：添加导航回调传入 CollectionPage
- 交互体验：图鉴卡片现在支持点击查看详情和长按进入批量删除模式
