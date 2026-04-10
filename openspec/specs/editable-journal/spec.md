### Requirement: 识别结果可编辑
AI 识别成功后，系统 SHALL 将 species 和 journal 展示为可编辑字段，用户可在保存前自由修改内容。

#### Scenario: 编辑 species
- **WHEN** AI 返回识别结果，用户在 species 输入框中修改文字
- **THEN** 输入框实时更新，保存时使用用户修改后的值

#### Scenario: 编辑 journal
- **WHEN** AI 返回识别结果，用户在 journal 文本框中修改文字
- **THEN** 文本框实时更新，保存时使用用户修改后的值

### Requirement: species 非空校验
用户点击「保存到日志」时，系统 SHALL 校验 species 字段不为空。

#### Scenario: species 为空时阻止保存
- **WHEN** 用户清空 species 输入框后点击保存
- **THEN** 系统不写入 localStorage，保存按钮处于禁用状态
