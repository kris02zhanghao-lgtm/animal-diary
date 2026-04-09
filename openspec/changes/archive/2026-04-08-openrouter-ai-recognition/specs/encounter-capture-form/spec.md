## CHANGED Requirements

### delta-spec encounter-capture-form

### Requirement: 点击生成日志触发 AI 识别
用户点击"生成日志"按钮时，SHALL 调用 aiService 识别图片中的动物。

#### Scenario: 成功识别后显示动物名
- **GIVEN** 用户已上传图片并输入地点
- **WHEN** 用户点击"生成日志"按钮
- **THEN** 显示加载状态，识别成功后显示动物名称

#### Scenario: 识别失败提示
- **GIVEN** API 调用失败
- **WHEN** 识别过程出错
- **THEN** 显示友好的错误提示，允许用户重试

#### Scenario: 未上传图片时禁用按钮
- **GIVEN** 用户未上传图片
- **WHEN** 页面渲染时
- **THEN** "生成日志"按钮禁用
