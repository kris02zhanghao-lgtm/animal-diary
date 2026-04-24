# Card Components Specification

卡片组件用于展示内容块，包括颜色、阴影、交互效果。

## ADDED Requirements

### Requirement: Card layout and styling

卡片 SHALL 具有以下样式：
- 圆角：20px
- 背景色：rgb(247, 243, 223)（米白）
- 内间距：16px 24px
- 阴影：0 4px 10px rgba(107, 92, 67, 0.42)
- 文字色：#725d42（棕色）

#### Scenario: Card renders with correct styling
- **WHEN** 渲染卡片
- **THEN** 背景、圆角、阴影、内间距正确应用

### Requirement: Card hover animation

卡片在悬停时 SHALL：
- 向上浮起 4px（translateY(-4px)）
- 阴影加深
- 响应 0.3s 缓动

#### Scenario: Card floats on hover
- **WHEN** 用户悬停卡片
- **THEN** 卡片向上浮起，阴影加深，动画流畅

### Requirement: Card color variants

卡片 SHALL 支持多种颜色变体（来自动物森友会调色板）：
- app-pink：#f8a6b2
- app-blue：#889df0
- app-yellow：#f7cd67
- app-green：#8ac68a
- app-red：#fc736d
- 以及其他 7 种色系

#### Scenario: Color variants available
- **WHEN** 需要彩色卡片
- **THEN** 可选择预定义的颜色变体，文字颜色自动调整

### Requirement: Card title style

卡片标题 SHALL：
- 背景色：#fdfdf5（极浅白）
- 圆角：不规则圆角（40px 35px 45px 38px / 38px 45px 35px 40px）
- 内间距：12px 32px
- 字重：600

#### Scenario: Card titles stand out
- **WHEN** 显示卡片标题
- **THEN** 标题区域使用指定样式，视觉上突出
