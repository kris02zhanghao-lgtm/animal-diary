## ADDED Requirements

### Requirement: 识别图片中的动物
系统 SHALL 能够接收用户上传的图片，调用 OpenRouter API 识别图片中的动物种类，并返回动物名称。

#### Scenario: 成功识别动物
- **GIVEN** 用户上传了一张包含动物的图片
- **WHEN** 调用 recognizeAnimal(imageBase64)
- **THEN** 返回识别出的动物中文名称（如"松鼠"、"鸽子"）

#### Scenario: API 调用失败
- **GIVEN** API Key 无效或网络故障
- **WHEN** 调用 recognizeAnimal
- **THEN** 返回错误信息，不崩溃

#### Scenario: 图片中没有动物
- **GIVEN** 用户上传了不包含动物的图片
- **WHEN** 调用 recognizeAnimal
- **THEN** 返回提示"未能识别出动物"

### Requirement: 使用环境变量配置
系统 SHALL 从环境变量读取 OpenRouter 配置，不在代码中硬编码。

#### Scenario: 读取 API Key
- **GIVEN** .env 文件包含 VITE_OPENROUTER_API_KEY
- **WHEN** 启动应用
- **THEN** aiService 能正确读取并使用该 Key

#### Scenario: 读取模型配置
- **GIVEN** .env 文件包含 VITE_OPENROUTER_MODEL
- **WHEN** 启动应用
- **THEN** aiService 使用指定的模型，默认使用 google/gemini-2.5-flash-lite
