# Page List Redesign Specification

列表页的整体布局和样式升级，应用新的颜色系统和组件样式。

## ADDED Requirements

### Requirement: List page header

列表页顶部 SHALL：
- 背景色：#f8f8f0（米白）
- 标题字号：大（press start 2P 像素字体）
- tab 栏：时间线/图鉴 tab，当前 tab 激活色为主色青绿
- 无滚动条显示

#### Scenario: Header renders correctly
- **WHEN** 进入列表页
- **THEN** 标题和 tab 正确显示，背景统一

### Requirement: Seasonal grouping display

记录按季度分组 SHALL：
- 分组标题：「YYYY年春/夏/秋/冬」格式
- 标题样式：棕色文字，无额外样式
- 卡片按分组下方排列

#### Scenario: Records group by season
- **WHEN** 列表页加载数据
- **THEN** 记录按季度分组，标题正确显示

### Requirement: Card styling in list

列表中的卡片 SHALL：
- 应用新卡片样式（20px 圆角、阴影、米白背景）
- 显示三行信息：🐾 物种名 / 📍 地点 / 日期
- 悬hover 时浮起（translateY(-4px)）
- 点击可展开详情

#### Scenario: Cards display and interact
- **WHEN** 列表显示卡片
- **THEN** 样式统一，悬停浮起，可点击

### Requirement: Empty state styling

空状态 SHALL：
- 显示松鼠 emoji 和引导文字
- 背景色：#f8f8f0（米白）
- 文字色：棕色
- 按钮：带新的按钮样式

#### Scenario: Empty state displays
- **WHEN** 用户首次打开应用或删除所有记录
- **THEN** 显示友好的空状态提示

### Requirement: Delete confirmation modal

删除时的确认弹窗 SHALL：
- 应用新的弹窗样式
- 文案：「它会永远离开你的图鉴...」
- 按钮：「再想想」（取消）/ 「挥手道别」（确认）
- 动画：zoom-in 进场

#### Scenario: Delete confirmation shows
- **WHEN** 用户点击删除按钮
- **THEN** 弹窗以动画显示，样式统一
