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
- API Key变量名：OPENROUTER_API_KEY
- 默认模型：google/gemini-2.5-flash-lite
- 高德地图 Key 变量名：VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE
- .env文件不能上传GitHub
- 每次commit后更新progress.md
- 项目PRD见PRD.md，其中标注了MVP范围和版本规划
- 每次更新progress.md前，先读PRD.md确认还有哪些功能未完成

## 成长复盘规则
- growth.md 记录产品决策思考、踩坑复盘、方法论总结，不记流水账（那是progress.md的工作）
- 以下情况主动提示更新 growth.md：
  - 完成一个版本的功能验收后
  - 遇到需要多轮讨论才确定方案的决策
  - 发现并修复了一个有代表性的 bug
  - 用户说「结束」「收工」「明天继续」时
- 更新格式参考 growth.md 末尾的模板
- 重点记录：为什么这样决策、有哪些选项被否定了、下次怎么做得更好
