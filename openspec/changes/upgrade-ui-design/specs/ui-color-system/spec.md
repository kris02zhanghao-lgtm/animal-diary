# UI Color System Specification

系统定义并应用完整的色彩体系，确保全应用的颜色统一。

## ADDED Requirements

### Requirement: Primary color definitions

系统 SHALL 定义以下主色：
- 主色青绿：#19c8b9
- 主色悬停：#3dd4c6
- 主色激活：#11a89b
- 主色背景：#e6f9f6

#### Scenario: Primary colors applied
- **WHEN** 页面加载
- **THEN** 所有主色元素（按钮、链接、强调色）使用定义的主色值

### Requirement: Neutral color palette

系统 SHALL 定义中性色：
- 背景主：#f8f8f0（米白）
- 背景次：#f0e8d8（浅棕）
- 背景禁用：#f0ece2
- 文字主：#794f27（棕色）
- 文字次：#9f927d（灰棕）
- 文字禁用：#c4b89e
- 边框色：#aaa69d / #827157

#### Scenario: Neutral colors applied
- **WHEN** 页面渲染
- **THEN** 所有文字、背景、边框使用定义的中性色

### Requirement: Status color definitions

系统 SHALL 定义状态色：
- 成功：#6fba2c（及悬停 #85cc45、激活 #5a9e1e）
- 警告：#f5c31c（及悬停 #f7d04a、激活 #dba90e）
- 错误：#e05a5a（及悬停 #e87878、激活 #c94444）

#### Scenario: Status colors applied
- **WHEN** 组件处于成功/警告/错误状态
- **THEN** 使用对应的状态色，并在悬停和激活时切换变体
