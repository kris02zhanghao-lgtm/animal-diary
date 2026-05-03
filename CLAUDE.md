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
- 项目PRD见PRD.md，其中标注了MVP范围和版本规划
- 每次更新progress.md前，先读PRD.md确认还有哪些功能未完成
- **Git 工作流详见 GIT_WORKFLOW.md**
- 涉及产品行为、交互流程、UI方向、信息架构等非纯技术性改动时，必须先与 kris 逐项讨论方案，得到明确同意后才能动手修改代码；不能先改后报，也不能默认替用户做产品决策

## 成长复盘规则
- growth.md 是 kris 的 PM 成长素材库，用于写简历、准备面试问题、整理项目思考
- 以下情况主动提示更新 growth.md：
  - 完成一个版本验收后
  - 遇到需要多轮讨论才确定的决策
  - 发现有代表性的 bug 或工作方式问题
  - 用户说「结束」「收工」「明天继续」时
- 写作原则：
  - 以 kris 第一人称写，记"我遇到了什么、我是怎么判断的、结果是什么"
  - 每条聚焦一件有价值的事，写到讲清楚为止，不为结构完整凑字数
  - 可用 1-2 个小标题组织思路，但直接叙述而不分点列举
  - 延伸到 PM 视角：产品判断、用户体验、项目节奏、工作方式
  - 最后可加一句"如果被问到这个，我会怎么讲"帮助面试准备
