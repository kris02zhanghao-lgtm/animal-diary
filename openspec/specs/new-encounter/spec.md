### Requirement: 识别成功后保存并跳转
识别成功后，系统 SHALL 自动将结果连同图片、地点、时间保存到 localStorage，保存完成后跳转回列表页。

#### Scenario: 识别并保存成功
- **WHEN** AI 返回识别结果（species + journal）
- **THEN** 系统调用 storageService.saveRecord() 写入记录，然后调用 navigateTo('list') 返回列表页

#### Scenario: 保存失败
- **WHEN** localStorage 写入抛出异常
- **THEN** 仍展示识别结果，显示"保存失败"提示，不跳转
