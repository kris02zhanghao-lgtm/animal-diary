## ADDED Requirements

### Requirement: 偶遇卡片展示 title、journal 和标签
识别成功后，系统 SHALL 以暖色系偶遇卡片展示识别结果，卡片包含：可编辑大标题、只读时间、可编辑日志正文、底部种类和地点标签（均可编辑）。

#### Scenario: 识别成功后展示完整卡片
- **WHEN** AI 返回识别结果（title + species + journal）
- **THEN** 卡片标题区显示 title（可编辑 input）、当前日期（只读）；内容区显示 journal（可编辑 textarea）；标签行显示 species 和 location（均可编辑 input）

#### Scenario: AI 未返回 title 时降级处理
- **WHEN** AI 返回结果中 title 字段缺失或为空
- **THEN** 系统以 species 值作为标题填入标题 input

### Requirement: 分享发现按钮提示即将上线
用户点击「分享发现」按钮时，系统 SHALL 显示提示"即将上线，敬请期待！"，不执行任何分享操作。

#### Scenario: 点击分享按钮
- **WHEN** 用户点击「分享发现」按钮
- **THEN** 弹出提示文字"即将上线，敬请期待！"
