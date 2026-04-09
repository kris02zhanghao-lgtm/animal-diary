## 1. 环境变量配置

- [x] 1.1 创建 `.env.example` 文件，定义 `VITE_OPENROUTER_API_KEY` 和 `VITE_OPENROUTER_MODEL`
- [x] 1.2 更新 `.gitignore`，确保 `.env` 不被提交
- [ ] 1.3 在 `.env` 中添加实际的 API Key（用户自行操作）

## 2. 创建 aiService 模块

- [x] 2.1 创建 `src/services/` 目录
- [x] 2.2 创建 `src/services/aiService.js` 文件
- [x] 2.3 从环境变量读取 `VITE_OPENROUTER_API_KEY`
- [x] 2.4 从环境变量读取 `VITE_OPENROUTER_MODEL`，默认值为 `google/gemini-2.5-flash-lite`
- [x] 2.5 实现 `recognizeAnimal(imageBase64)` 函数
- [x] 2.6 构建 OpenRouter API 请求体（model, messages 包含图片 base64）
- [x] 2.7 使用 fetch 发送 POST 请求到 `https://openrouter.ai/api/v1/chat/completions`
- [x] 2.8 添加 Authorization header，格式为 `Bearer ${apiKey}`
- [x] 2.9 添加 HTTP-Referer 和 X-Title headers
- [x] 2.10 解析 API 响应，提取动物名称
- [x] 2.11 添加错误处理（try/catch），返回标准格式 `{ success, animalName, error }`

## 3. 集成到 NewEncounterPage

- [x] 3.1 导入 `aiService`
- [x] 3.2 添加 `animalName` state 用于显示识别结果
- [x] 3.3 修改 `handleGenerateLog` 函数，调用 `aiService.recognizeAnimal`
- [x] 3.4 传入 `selectedImage`（base64 格式）
- [x] 3.5 调用期间显示"识别中..."加载状态
- [x] 3.6 识别成功后显示动物名称
- [x] 3.7 识别失败时显示错误提示
- [x] 3.8 确保未上传图片时"生成日志"按钮禁用

## 4. 本地测试

- [ ] 4.1 配置有效的 OpenRouter API Key
- [ ] 4.2 启动开发服务器
- [ ] 4.3 上传一张动物照片
- [ ] 4.4 点击"生成日志"按钮
- [ ] 4.5 验证是否正确显示动物名称
- [ ] 4.6 测试网络断开时的错误提示
