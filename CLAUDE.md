# 动物偶遇图鉴

## 项目描述
用AI记录城市中偶遇小动物的个人图鉴web app。用户上传照片，AI自动识别动物种类并生成趣味日志，保存到本地列表查看。

## 技术栈
- React（Vite）
- Tailwind CSS
- OpenRouter API（封装为aiService.js）
- localStorage
- Vercel部署

## 项目特有规则
- API Key变量名：VITE_OPENROUTER_API_KEY
- 默认模型：google/gemini-2.5-flash-lite
- .env文件不能上传GitHub
- 每次commit后更新progress.md
