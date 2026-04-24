# Button Components Specification

按钮组件统一样式和交互，包括圆角、3D 阴影效果、颜色变体。

## ADDED Requirements

### Requirement: Button shape and sizing

按钮 SHALL 遵循以下规范：
- 圆角：50px（完全圆角）
- 高度：small 32px / middle 40px / large 48px
- 内间距：根据尺寸自动调整
- 边框宽度：2px

#### Scenario: Button sizes render correctly
- **WHEN** 渲染 small/middle/large 按钮
- **THEN** 高度、间距、圆角正确应用

### Requirement: 3D press effect

按钮 SHALL 在下方显示阴影，模拟 3D 按压效果：
- 默认状态：`box-shadow: 0 5px 0 0 #bdaea0`
- 悬停状态：`box-shadow: 0 6px 0 0 #bdaea0`（阴影增加）
- 激活状态：`box-shadow: 0 1px 0 0 #bdaea0`（阴影缩小）

#### Scenario: 3D effect on interaction
- **WHEN** 用户悬停按钮
- **THEN** 阴影增加，视觉上显示向下压
- **WHEN** 用户点击按钮
- **THEN** 阴影缩小，显示被按下的感觉

### Requirement: Button color variants

按钮 SHALL 支持以下类型：
- primary（填充）：#f8f8f0 背景，#794f27 文字
- default（描边）：#aaa69d 边框，#794f27 文字
- danger（危险）：#e05a5a 背景，白色文字
- text（文字）：无背景，#794f27 文字

#### Scenario: Color variants display correctly
- **WHEN** 渲染不同类型的按钮
- **THEN** 颜色、背景、边框正确应用

### Requirement: Hover and active states

按钮在悬停和激活时 SHALL：
- 改变颜色（次级色、激活色）
- 浮起 1-2px（translateY(-2px)）
- 调整阴影深度

#### Scenario: Interactive state transitions
- **WHEN** 用户悬停按钮
- **THEN** 按钮颜色变亮、向上浮起、阴影加深
- **WHEN** 用户点击按钮
- **THEN** 按钮向下压、阴影缩小、颜色变深
