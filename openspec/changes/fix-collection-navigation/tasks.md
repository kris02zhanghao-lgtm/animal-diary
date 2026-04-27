## 1. 修改 App.jsx - 添加导航回调

- [x] 1.1 为 CollectionPage 添加 `onExpandRecord` prop，接收 `(recordId)` 回调
- [x] 1.2 在回调中设置 `expandTargetId` 和切换 `activePage` 到 'timeline'（参考 MapView 的实现）

## 2. 修改 CollectionPage.jsx - 接收导航回调

- [x] 2.1 将 CollectionPage 修改为接收 `onExpandRecord` 作为 prop

## 3. 实现点击和长按区分逻辑

- [x] 3.1 在点击处理中添加 `isLongPressed` flag，区分点击和长按
- [x] 3.2 `onMouseUp/onTouchEnd` 时：若长按定时器未触发，说明是普通点击，调用 `onExpandRecord(record.id)` 导航
- [x] 3.3 在 `onTouchMove` 时清除长按定时器，避免滑动时误触发长按

## 4. 修复选择模式下的点击行为

- [x] 4.1 确保选择模式下，点击照片切换选中状态（现有逻辑已实现，验证不受影响）

## 5. 验收测试

- [ ] 5.1 手机端：点击照片 → 导航到时间线详情页
- [ ] 5.2 手机端：长按照片 → 进入选择模式，显示选择指示器
- [ ] 5.3 手机端：滑动卡片 → 不误触发长按
- [ ] 5.4 PC 端：点击照片 → 导航到时间线详情页
- [ ] 5.5 PC 端：右键点击 → 进入选择模式
- [ ] 5.6 选择模式下：点击照片 → 切换选中状态（不导航）

## 6. 收尾

- [ ] 6.1 更新 progress.md
- [ ] 6.2 git commit
