## MODIFIED Requirements

### Requirement: 通过后端代理调用 AI 识别
识别成功后，系统 SHALL 调用 `POST /api/recognize` 后端代理（而不是前端直接调 OpenRouter），获取识别结果并展示偶遇卡片。

#### Scenario: 前端调用后端代理
- **WHEN** 用户点击「✨ AI 帮我生成档案」或「重新生成」
- **THEN** 前端发送 POST 请求到 `/api/recognize`，携带 `{ imageBase64, location }`

#### Scenario: 后端返回识别结果
- **WHEN** 后端调用 OpenRouter API 成功
- **THEN** 返回 `{ species, journal, title }`，前端展示偶遇卡片

#### Scenario: 识别成功后展示偶遇卡片
- **WHEN** API 返回识别结果
- **THEN** 系统展示偶遇卡片，填入 AI 返回值（title、species、journal、location），不自动保存

#### Scenario: 用户手动保存成功
- **WHEN** 用户（可选编辑后）点击「保存到日志」且 species 不为空
- **THEN** 系统调用 supabaseService.saveRecord() 写入 Supabase，然后跳转回列表页

#### Scenario: 保存失败（Supabase 错误）
- **WHEN** Supabase 写入抛出异常
- **THEN** 仍展示偶遇卡片，显示"保存失败"提示，不跳转

#### Scenario: 后端代理错误处理
- **WHEN** `/api/recognize` 返回错误（OpenRouter API 失败、网络错误等）
- **THEN** 前端捕获错误，展示友好错误提示，允许用户重试

### Requirement: API Key 不暴露到前端
系统 SHALL 确保 OpenRouter API Key 仅存储在 Vercel 环境变量中，不在前端代码或网络请求中暴露。

#### Scenario: 网络检查不可见 API Key
- **WHEN** 用户打开浏览器开发者工具检查网络请求
- **THEN** `/api/recognize` 请求不包含 API Key，只有 imageBase64 和 location
