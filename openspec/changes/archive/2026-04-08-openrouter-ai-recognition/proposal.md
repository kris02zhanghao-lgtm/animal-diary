## Why

用户上传动物照片后，需要 AI 自动识别动物种类，这是「动物偶遇图鉴」的核心功能。目前页面框架已完成，需要接入 OpenRouter API 实现图片识别能力。

## What Changes

- 创建 `src/services/aiService.js` 模块，封装 OpenRouter API 调用
- 默认使用 `google/gemini-2.5-flash-lite` 模型
- 支持从 `.env` 文件读取 API Key 和模型配置
- 在 NewEncounterPage 集成图片识别功能
- 识别成功后显示动物名称

## Capabilities

### New Capabilities
- `ai-image-recognition`: 使用 OpenRouter API 识别图片中的动物种类

### Modified Capabilities
- `encounter-capture-form`: 添加生成日志按钮的 AI 调用逻辑

## Impact

- 新增文件：`src/services/aiService.js`
- 修改文件：`src/pages/NewEncounterPage.jsx`
- 新增依赖：无需安装额外依赖（使用原生 fetch）
- 环境变量：需要在 `.env` 中添加 `VITE_OPENROUTER_API_KEY` 和 `VITE_OPENROUTER_MODEL`
