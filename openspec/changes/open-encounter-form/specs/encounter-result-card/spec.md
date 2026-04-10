## MODIFIED Requirements

### Requirement: 偶遇卡片展示 title、journal 和标签
系统 SHALL 始终展示暖色系偶遇卡片，卡片包含：可编辑大标题、当前日期（只读）、可编辑日志正文、底部种类和地点标签（均可编辑）。卡片不依赖 AI 识别状态，进入页面即可见。

#### Scenario: 进入页面展示空白卡片
- **WHEN** 用户进入新建偶遇页面，尚未上传图片或生成日志
- **THEN** 卡片始终显示，标题/日志/种类字段为空，显示引导性占位符文案，日期显示今天日期

#### Scenario: AI 识别后填充卡片内容
- **WHEN** AI 返回识别结果（title + species + journal）
- **THEN** 卡片标题区更新为 AI 返回的 title，日志区更新为 journal，标签行种类更新为 species

#### Scenario: AI 未返回 title 时降级处理
- **WHEN** AI 返回结果中 title 字段缺失或为空
- **THEN** 系统以 species 值作为标题填入标题 input

### Requirement: 分享发现按钮提示即将上线
用户点击「分享发现」按钮时，系统 SHALL 显示提示"即将上线，敬请期待！"，不执行任何分享操作。

#### Scenario: 点击分享按钮
- **WHEN** 用户点击「分享发现」按钮
- **THEN** 弹出提示文字"即将上线，敬请期待！"
