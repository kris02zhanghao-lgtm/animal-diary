# Interaction Animations Specification

定义全局交互动画和缓动效果，确保交互流畅、一致。

## ADDED Requirements

### Requirement: Animation timing

所有交互动画 SHALL 遵循以下时长：
- fast（快速）：0.15s（即时反馈，如清除按钮）
- base（标准）：0.25s（常见交互，如悬停、淡显）
- slow（缓慢）：0.35s（过渡效果，如进场）

#### Scenario: Animations use correct timing
- **WHEN** 触发各类交互动画
- **THEN** 使用对应的时长（fast/base/slow）

### Requirement: Easing function

所有动画 SHALL 使用缓动函数：
- cubic-bezier(0.4, 0, 0.2, 1)（标准缓动，快速开始、缓慢结束）

#### Scenario: Animations follow easing curve
- **WHEN** 执行动画
- **THEN** 使用统一的缓动函数，动画节奏一致

### Requirement: Hover float effect

可交互元素（按钮、卡片）在悬停时 SHALL：
- 向上浮起：translateY(-2px) 至 translateY(-4px)
- 动画时长：base 0.25s
- 阴影加深

#### Scenario: Elements float on hover
- **WHEN** 用户悬停按钮或卡片
- **THEN** 元素向上浮起，阴影加深，动画流畅

### Requirement: Fade and zoom animations

进场动画 SHALL 包括：
- fade-in：opacity 0→1，时长 0.25s
- zoom-in：scale(0.92)→scale(1) + opacity，时长 0.3s
- 用于弹窗、提示等

#### Scenario: Components enter with animation
- **WHEN** 弹窗或 toast 出现
- **THEN** 使用 fade-in 或 zoom-in 动画进场

### Requirement: Loading animation

加载状态动画 SHALL：
- 旋转：rotate(360deg)，无限循环
- 时长：0.6s
- 颜色：与组件状态色一致（如绿色加载表示成功路径）

#### Scenario: Loading state animates
- **WHEN** 组件处于加载状态
- **THEN** 显示旋转动画，连贯流畅
