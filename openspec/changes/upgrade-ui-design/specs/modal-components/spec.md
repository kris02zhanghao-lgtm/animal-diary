# Modal Components Specification

弹窗组件统一样式和进场动画，包括蒙层、内容区、按钮组。

## ADDED Requirements

### Requirement: Modal mask overlay

弹窗蒙层 SHALL：
- 背景色：rgba(0, 0, 0, 0.35)（半透明黑）
- 覆盖全屏（position: fixed; inset: 0）
- 进场动画：fade-in 0.25s

#### Scenario: Modal mask displays
- **WHEN** 打开弹窗
- **THEN** 蒙层显示，渐显动画

### Requirement: Modal container styling

弹窗内容区 SHALL：
- 背景色：rgb(247, 243, 223)（米白）
- 内边距：48px 48px 32px 48px
- 最大宽度：calc(100vw - 32px)
- 进场动画：zoom-in 0.3s（缩放+渐显）
- 文字色：rgb(128, 115, 89)（棕色）

#### Scenario: Modal enters with animation
- **WHEN** 打开弹窗
- **THEN** 内容区从小缩放并渐显，视觉上弹出

### Requirement: Modal header and close button

弹窗头部 SHALL：
- 标题字号：28px，字重：700
- 标题色：rgba(114, 93, 66, 1)（棕色）
- 关闭按钮：32px × 32px，圆形，悬停时背景加深

#### Scenario: Header renders with close button
- **WHEN** 显示弹窗头部
- **THEN** 标题大字体显示，关闭按钮在右上角

### Requirement: Modal footer buttons

弹窗底部按钮 SHALL：
- 排列：flex 右对齐，gap 12px
- 取消按钮：描边样式，#794f27 边框
- 确认按钮：填充样式，#ffcc00 背景
- 悬停时：边框/背景变深

#### Scenario: Modal buttons respond to interaction
- **WHEN** 用户悬停或点击按钮
- **THEN** 按钮样式改变，点击触发对应动作
