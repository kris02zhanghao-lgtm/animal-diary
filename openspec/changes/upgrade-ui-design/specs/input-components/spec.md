# Input Components Specification

输入框组件统一样式，包括圆角、3D 阴影、状态反馈。

## ADDED Requirements

### Requirement: Input box styling

输入框容器 SHALL 具有以下样式：
- 圆角：50px（完全圆角）
- 背景色：rgb(247, 243, 223)（米白）
- 边框：2.5px solid #c4b89e
- 高度：small 32px / middle 40px / large 48px
- 内间距：根据尺寸调整

#### Scenario: Input renders correctly
- **WHEN** 渲染输入框
- **THEN** 尺寸、背景、边框正确应用

### Requirement: Input 3D shadow effect

输入框 SHALL 有下方阴影，模拟 3D 效果：
- 默认：`box-shadow: 0 3px 0 0 #d4c9b4`
- 悬停：`box-shadow: 0 3px 0 0 #c4b89e`（边框变暗）

#### Scenario: Input shadow reacts to interaction
- **WHEN** 用户悬停输入框
- **WHEN** 边框颜色加深、阴影调整

### Requirement: Input states

输入框 SHALL 支持以下状态：
- normal（默认）
- error（错误）：边框 #e05a5a，阴影 #c94444
- warning（警告）：边框 #f5c31c，阴影 #dba90e
- disabled（禁用）：背景变浅，不可交互

#### Scenario: Input states display correctly
- **WHEN** 输入框处于不同状态
- **THEN** 边框、阴影、背景色对应变化

### Requirement: Input helper elements

输入框可 SHALL 支持：
- placeholder：文字色 #c4b89e
- 前缀/后缀：颜色 #a0936e
- 清除按钮：圆形，悬停时背景变淡

#### Scenario: Helper elements render
- **WHEN** 输入框有前缀、后缀、清除按钮
- **THEN** 正确排列和样式，不影响输入框尺寸
