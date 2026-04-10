### Requirement: 识别成功后保存并跳转
识别成功后，系统 SHALL 展示偶遇卡片（含 title、journal、species、location 可编辑字段），用户点击「保存到日志」后，系统将所有字段连同图片、时间保存到 localStorage，保存完成后跳转回列表页。

#### Scenario: 识别成功后展示偶遇卡片
- **WHEN** AI 返回识别结果（title + species + journal）
- **THEN** 系统展示偶遇卡片，填入 AI 返回值，不自动保存

#### Scenario: 用户手动保存成功
- **WHEN** 用户（可选编辑后）点击「保存到日志」且 species 不为空
- **THEN** 系统调用 storageService.saveRecord() 写入含 title 字段的记录，然后调用 navigateTo('list')

#### Scenario: 保存失败
- **WHEN** localStorage 写入抛出异常
- **THEN** 仍展示偶遇卡片，显示"保存失败"提示，不跳转
