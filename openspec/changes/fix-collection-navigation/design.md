## Context

CollectionPage 目前显示按物种分类的图鉴网格，用户点击卡片应该导航到时间线页（ListPage）查看和编辑该条记录的详情。同时，为支持批量删除功能，需要长按照片进入选择模式。但当前实现无法区分点击和长按，导致交互混乱。

## Goals / Non-Goals

**Goals:**
- 点击照片卡片（非选择模式）→ 导航到时间线页并展开该条记录详情
- 长按照片（500ms） → 进入批量选择模式，显示选择指示器
- 选择模式下点击照片 → 切换选中状态

**Non-Goals:**
- 修改时间线页的详情展开逻辑
- 修改批量删除的确认和执行逻辑

## Decisions

### 决策1：通过定时器区分点击和长按

- **方案A**：使用 500ms 定时器区分（当前长按已用此方案）
  - `onMouseDown/onTouchStart`：启动定时器
  - 定时器触发 → 调用 `handleLongPress`（进入选择模式）
  - `onMouseUp/onTouchEnd`：若定时器未触发，说明是普通点击，执行导航
  - **优点**：保持一致的长按阈值，用户体验统一
  - **缺点**：普通点击也需等待定时器清除，有微小延迟

- **方案B**：点击直接导航，通过 flag 标记是否进入选择模式
  - **缺点**：无法真正区分意图，容易误触发

**选择 A**（已验证可行）

### 决策2：通过 App.jsx 传递导航回调

- CollectionPage 不直接修改 activePage，而是接收 `onExpandRecord` 回调
- 回调负责设置 `expandTargetId` 和切换 `activePage` 到 'timeline'
- 这与 MapView 的现有模式一致，保持代码结构统一

### 决策3：保留对原始 record 对象的引用

- CollectionPage 的 `selectedRecords` 来自 `selectedCategoryData.allRecords`
- 每条记录对象包含完整的 `id`、`species`、`createdAt` 等信息
- 点击时传递 `record.id` 给回调，回调在 App 层处理导航

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|-----|------|--------|
| 普通点击有微小延迟（等待定时器清除） | 用户感知到响应不够快 | 使用 `clearTimeout` 立即清除，延迟 <100ms 可接受 |
| 长按和点击的定时器重复逻辑 | 代码重复，维护成本增加 | 提取为通用的长按/点击判断函数 |
| 触屏设备上长按和滑动冲突 | 用户滑动卡片时误触发长按 | 在滑动时清除定时器（onTouchMove 时清除） |

## Migration Plan

1. 更新 App.jsx：添加 `onExpandRecord` 回调参数传入 CollectionPage
2. 更新 CollectionPage.jsx：
   - 接收 `onExpandRecord` 回调 prop
   - 修改点击处理逻辑：区分点击和长按
   - 点击时调用回调导航，长按时进入选择模式
3. 验证：测试点击导航和长按选择不会相互干扰
