# Page New Encounter Redesign Specification

新建偶遇页的整体布局和样式升级，应用新的颜色系统和交互效果。

## ADDED Requirements

### Requirement: Page header with back button

新建页顶部 SHALL：
- 背景色：#f8f8f0（米白）
- 左上角：← 返回箭头按钮
- 标题：「新建偶遇」或无标题
- 无多余装饰

#### Scenario: Header displays correctly
- **WHEN** 进入新建页
- **THEN** 返回按钮可点击，背景统一

### Requirement: Image upload area

图片上传区域 SHALL：
- 背景：渐变或浅色，如 #f0e8d8（浅棕）
- 圆角：20px
- 支持点击或拖拽上传
- 上传后显示预览（object-contain，不裁剪竖图）

#### Scenario: Upload and preview
- **WHEN** 用户上传照片
- **THEN** 预览显示，图片完整展示，不被裁剪

### Requirement: AI generation button

AI 生成按钮 SHALL：
- 样式：primary 按钮（填充，3D 阴影）
- 文案：「✨ AI 帮我生成档案」（首次）或「重新生成」（之后）
- 位置：上传区下方
- 点击后显示「识别中...」加载状态

#### Scenario: AI generation works
- **WHEN** 用户点击生成按钮
- **THEN** 按钮变为加载状态，之后显示结果

### Requirement: Encounter result card

结果卡片 SHALL：
- 应用新卡片样式（20px 圆角、米白背景、阴影）
- 包含：标题、日志、物种、地点、日期
- 所有字段可编辑（input / textarea）
- 底部按钮：「保存到日志」/ 「分享发现」

#### Scenario: Result card editable
- **WHEN** AI 生成结果显示
- **THEN** 卡片显示，用户可修改内容

### Requirement: Form fields styling

表单字段 SHALL：
- 物种输入：单行 input，应用输入框样式
- 日志编辑：多行 textarea，应用输入框样式
- 地点输入：单行 input
- 所有字段圆角、边框、阴影统一

#### Scenario: Form fields render
- **WHEN** 显示编辑表单
- **THEN** 所有输入框样式统一，可交互

### Requirement: Action buttons

页面底部按钮 SHALL：
- 「保存到日志」：primary 按钮，filled，3D 阴影
- 「分享发现」：default 按钮，描边
- 颜色统一，悬停浮起
- 禁用状态：物种为空时禁用保存按钮

#### Scenario: Buttons respond to form state
- **WHEN** 物种字段为空
- **THEN** 保存按钮禁用，颜色变淡
- **WHEN** 物种有值
- **THEN** 保存按钮可点击
