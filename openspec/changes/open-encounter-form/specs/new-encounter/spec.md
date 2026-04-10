## MODIFIED Requirements

### Requirement: 识别成功后保存并跳转
进入页面后，系统 SHALL 始终展示偶遇卡片（含 title、journal、species、location 可编辑字段），用户可直接手填或点击「AI 帮我识别并生成」让 AI 填充字段。用户点击「保存到日志」后，系统将所有字段连同图片、时间保存到 localStorage，保存完成后跳转回列表页。

#### Scenario: 进入页面即展示偶遇卡片
- **WHEN** 用户进入新建偶遇页面
- **THEN** 系统展示完整偶遇档案卡片，所有字段为空（含占位符提示文案），操作按钮（AI生成、保存、分享）均可见

#### Scenario: AI 填充字段
- **WHEN** 用户上传图片后点击「AI 帮我识别并生成」
- **THEN** AI 返回识别结果后，系统将 title、species、journal 填入对应字段（覆盖已有内容），按钮文字变为「重新生成」

#### Scenario: 用户手动保存成功
- **WHEN** 用户（直接手填或AI辅助后）点击「保存到日志」且 species 不为空
- **THEN** 系统调用 storageService.saveRecord() 写入记录，然后调用 navigateTo('list')

#### Scenario: 保存失败
- **WHEN** localStorage 写入抛出异常
- **THEN** 仍展示偶遇卡片，显示"保存失败"提示，不跳转
