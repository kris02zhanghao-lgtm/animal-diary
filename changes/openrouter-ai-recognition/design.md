:x200}
---

## Decisions

1. **API 封装**: 创建独立的 `aiService.js` 模块，不与 UI 组件耦合
2. **模型配置**: 默认模型 `google/gemini-2.5-flash-lite`，可通过环境变量覆盖
3. **图片传输**: 使用 base64 编码将图片发送到 API
4. **错误处理**: 简单的 try/catch，错误时返回友好提示
5. **调用时机**: 用户点击"生成日志"按钮时触发 AI 识别

## File Structure

```
src/
├── services/
│   └── aiService.js      # OpenRouter API 封装
├── pages/
│   └── NewEncounterPage.jsx  # 集成 AI 调用
```

## API Contract

**aiService.recognizeAnimal(imageBase64)**
- 输入: base64 编码的图片
- 输出: `{ success: boolean, animalName: string | null, error: string | null }`

## Environment Variables

```
VITE_OPENROUTER_API_KEY=sk-or-xxx
VITE_OPENROUTER_MODEL=google/gemini-2.5-flash-lite
```

## Risks

- API Key 泄露风险：使用 .env 并确保不提交到 git
- 网络失败：需要处理超时和重试
- 大图片：可能需要压缩或限制大小
