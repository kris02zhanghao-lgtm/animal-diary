## MODIFIED Requirements

### Requirement: 识别成功后保存并跳转
识别成功后，系统 SHALL 展示可编辑的识别结果（species 输入框 + journal 文本框），用户手动点击「保存这次偶遇」后，系统将当前编辑内容连同图片、地点、时间保存到 localStorage，保存完成后跳转回列表页。

#### Scenario: 识别成功后展示可编辑结果
- **WHEN** AI 返回识别结果（species + journal）
- **THEN** 系统将 species 填入单行输入框、journal 填入多行文本框，展示「保存这次偶遇」按钮，不自动保存

#### Scenario: 用户手动保存成功
- **WHEN** 用户（可选编辑后）点击「保存这次偶遇」且 species 不为空
- **THEN** 系统调用 storageService.saveRecord() 写入记录，然后调用 navigateTo('list') 返回列表页

#### Scenario: 保存失败
- **WHEN** localStorage 写入抛出异常
- **THEN** 仍展示识别结果，显示"保存失败"提示，不跳转
