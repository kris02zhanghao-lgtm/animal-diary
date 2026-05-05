## ADDED Requirements

### Requirement: 识别失败卡片显示空模板
当识别失败时，系统 SHALL 显示空白卡片模板（保留照片，字段为空可编辑），使用户可手动补充信息。

#### Scenario: 失败状态卡片展示
- **WHEN** 识别失败且系统进入手动填充模式
- **THEN** 卡片显示用户上传的照片、空的 title input、空的 journal textarea、空的 species 和 location 标签（均可编辑），卡片顶部或物种区域标记 "⚠️ 手动填充" 提示

#### Scenario: 失败卡片与成功卡片样式区分
- **WHEN** 卡片处于失败手动填充状态
- **THEN** 卡片可在背景色、边框或标签处微调差异（如淡化或灰色边框），但保持整体暖色系风格一致

### Requirement: 失败状态下物种输入框提示
识别失败时，物种输入框 SHALL 有明确提示，引导用户填写。

#### Scenario: 失败时物种 placeholder 优化
- **WHEN** 卡片处于识别失败状态且 species 字段为空
- **THEN** species input 的 placeholder 改为 "AI识别失败，请输入物种" 或类似，提醒用户需手动补充
