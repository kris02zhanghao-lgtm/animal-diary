# 项目进度

## 当前状态
✅ **v0.6「偶遇报告」+ v0.7「分享功能」已完成上线验收（2026-04-30）**

**本轮已实现：**
- ✅ 新增 `src/services/reportService.js`：支持「最近三个月 / 今年」时间窗口聚合，返回总数、Top 物种、Top 地点、最活跃月份、状态标记
- ✅ 新增 `src/pages/ReportPage.jsx`：报告页完整 UI、空状态/数据积累态/完整报告态、切换时间窗口自动刷新；最近三个月不显示最活跃月份，物种统计统一显示为 `x只`
- ✅ `BottomTabBar` 新增「报告」入口，`App.jsx` 接入 `ReportPage`
- ✅ 新增 `src/utils/shareUtils.js`：Canvas 生成 PNG 分享卡片、下载、复制图片、复制文案 fallback，并对夸克浏览器隐藏无效的系统分享入口
- ✅ 新增 `src/components/ShareModal.jsx`：分享弹窗、生成中 loading、失败降级到文案分享；支持浏览器显示 `分享到...`
- ✅ `ListPage.jsx` 详情页菜单和时间线卡片菜单里的「分享」已接入真实分享流程，不再是占位提示
- ✅ AI 识别链路已恢复：补齐服务端 `OPENROUTER_API_KEY`，模型改为通过环境变量读取，本地使用 `moonshotai/kimi-k2.5`
- ✅ 线上部署完成并验收通过：`https://animal-diary.vercel.app`
- ✅ 本次改动文件定向 ESLint 通过，`npm run build` 通过，Chrome 手机端 `分享到...` 可用，夸克浏览器已做降级处理

✅ **v0.5.1「图鉴长按多选删除 + 点击跳详情」已完成验收（2026-04-27）**

**v0.5.1 新增功能：**
- ✅ 图鉴第二层照片网格点击 → 跳转时间线详情页（复用 expandTargetId 模式）
- ✅ 手机长按 500ms / PC 右键 → 进入选择模式，可多选批量删除
- ✅ 选择模式 UI：顶部「已选 X 张 / 取消 / 删除」操作栏 + 照片左上角圆圈勾选指示器
- ✅ 批量删除确认弹窗（复用现有样式，文案显示删除数量）
- ✅ 删除完一个大类全部照片后自动返回第一层
- ✅ onTouchMove 取消长按定时器，避免滑动时误触发
- ✅ 移除旧的 hover 删除按钮，统一为长按编辑模式

**关键 bug 修复：**
- ✅ CollectionPage 第二层因 `React.useRef` 但未 import React 导致组件崩溃 → 改用 `useRef`
- ✅ 在 map() 中调用 useRef 违反 React Hooks 规则 → 提取 `PhotoCard` 子组件，hooks 在顶层调用

---

✅ **v0.5「图鉴收集页+物种大类分类」已完成验收（2026-04-27）**

**v0.5 新增功能：**
- ✅ 创建 `src/services/collectionService.js`：按物种大类聚合，计算出现次数
- ✅ 创建 `src/pages/CollectionPage.jsx`：两层结构（大类网格 → 照片网格）
- ✅ 第一层：所有大类卡片（猫、狗、鸟等），展示代表照片、大类名、遇到次数、最近地点，响应式 2/3 列网格
- ✅ 第二层：点击大类后展开该大类全部照片，顶部显示返回按钮和标题
- ✅ 第二层支持删除：长按进入选择模式（待后续实施），或 hover 显示删除按钮
- ✅ BottomTabBar「图鉴」tab 从占位改为真实导航（ID: `collection`）
- ✅ App.jsx 集成 CollectionPage，条件渲染保证切换 tab 时自动刷新数据
- ✅ 空状态：无记录时显示「还没有发现任何物种」引导文字

**AI 物种大类分类（新增）：**
- ✅ `api/recognize.js` 识别后新增第二次 AI 调用，自动判断物种属于哪个大类（猫/狗/鸟/松鼠/兔子/其他）
- ✅ 预定义物种列表：避免同一动物因识别差异被分为不同品种（橘色条纹、纯橘都识别为"橘猫"）
- ✅ 数据库新增 `category` 列存储大类
- ✅ 图鉴页按 `category` 聚合而非 `species`，统一展示同大类的全部记录
- ✅ NewEncounterPage 接收和传递 category 字段到保存接口

---

✅ **v0.4.2「详情页编辑功能」已完成验收（2026-04-27）**

**v0.4.2 新增功能：**
- ✅ 详情页顶部新增「✏️ 编辑」按钮（方案A设计）
- ✅ 点击进入编辑态：字段变为可编辑输入框（背景#f0e8d8暖色融合）
- ✅ 编辑态顶部改为「取消 / 保存」，隐藏菜单和编辑按钮
- ✅ 取消时恢复原始内容，不触发保存
- ✅ 保存成功后自动退出编辑态，清晰反馈保存成功
- ✅ 支持编辑：标题、日志、物种、地点（集成 LocationPicker）
- ✅ 切换到其他记录时自动退出编辑态

**v0.4 全部功能：**
- ✅ 底部导航栏（时间线 / 地图 / ➕ / 图鉴）
- ✅ 高德地图页：emoji marker 渲染、fitView 自动适配、点击弹详情卡
- ✅ 地图详情卡新增「展开详情」按钮，可直接跳到时间线详情页
- ✅ 自动定位 + 坐标存储，地图蓝点显示当前位置
- ✅ 图片上传前压缩至 800px
- ✅ 后端 AI 识别加 25s 超时，前端 AI 错误提示移至按钮下方
- ✅ BottomTabBar z-index 修复（Swiper coverflow 遮挡问题）
- ✅ 地图 marker 补 touchend 事件（手机端可点击）

## 已完成

### 基础框架搭建 (build-basic-page-framework)
- Vite + React 项目创建
- Tailwind CSS v3 安装和配置
- npm install 依赖安装完成
- npm run dev 开发服务器启动成功
- 初始化 git 仓库，第一次提交完成

### 页面路由与导航
- `src/App.jsx` 使用 useState 实现页面状态管理（list/new）
- 条件渲染 ListPage 和 NewEncounterPage
- `navigateTo` 函数通过 props 传递给子页面

### 星露谷风格 UI
- **ListPage**: 像素字体标题（Press Start 2P）、松鼠 emoji 空状态、暖绿色浮动按钮、#fffdf7 背景
- **NewEncounterPage**: 返回箭头 header、图片上传区域（支持预览）、地点输入框、生成日志按钮
- 动物卡片样式：`border: 3px solid #5a4a3a` + `box-shadow: 4px 4px 0px #5a4a3a`
- 所有按钮、输入框使用圆角样式
- 移动端适配完成

### AI 服务封装 (openrouter-ai-recognition)
- 创建 `src/services/aiService.js` 模块
- 从环境变量读取 `VITE_OPENROUTER_API_KEY` 和 `VITE_OPENROUTER_MODEL`
- 默认使用 `google/gemini-2.5-flash-lite` 模型
- 实现 `recognizeAnimal(imageBase64, location)` 函数
- Prompt 风格：城市动物观察站，正式偶遇档案语气，动物地位高于用户
- 返回 JSON 格式：`{ species, journal }`
- 错误处理：API Key 缺失、网络失败、识别失败

### 前端集成
- NewEncounterPage 集成 aiService
- 显示识别结果（动物种类粗体展示）
- 加载状态："识别中..."
- 错误提示友好展示

### localStorage 本地存储 (local-storage-records) ✓ 已验收
- 创建 `src/services/storageService.js`，封装 `getRecords` / `saveRecord` / `deleteRecord`
- 数据结构：`animal-diary-records` key 存 JSON 数组，每条含 id、imageBase64、location、species、journal、createdAt
- 识别成功后自动保存并跳回列表页（无需额外点击）
- 保存失败时展示提示，保留识别结果
- ListPage 读取记录渲染卡片列表（图片、物种名、地点、日志、时间）
- 空状态：松鼠 emoji + 引导文字
- 每条记录支持删除（× 按钮，删后实时更新）
- 已 git commit（b4ca79b）

### 日志编辑 (editable-journal) ✓ 已验收
- AI 识别成功后不再自动保存，停留在当前页展示可编辑结果
- 动物种类字段变为单行 input，日志变为多行 textarea，预填 AI 返回值
- 用户可修改内容，点击「保存到日志」手动触发保存
- species 为空时保存按钮自动禁用
- 重新点「生成日志」会覆盖已编辑内容

### 偶遇档案卡片重设计 (redesign-result-card) ✓ 已验收
- AI prompt 新增 title 字段（10字以内偶遇小标题）
- 结果区域重构为暖色系偶遇档案卡片：标题区（渐变暖黄）+ 日志区（米白）+ 标签行
- 标题、日志、种类、地点均可编辑
- 新增「保存到日志」+「分享发现」双按钮（分享暂时提示"即将上线"）
- 已 git commit（3cb9c1e）

### 界面优化
- 首页空状态：标题加大加粗 + 副标题引导文字 + 垂直居中
- 已 git commit（534008a）

### 删除确认弹窗 ✓ 已验收
- 点击 × 不再直接删除，改为弹出底部确认面板
- 星露谷像素风暖色系样式，带 🐾 emoji，文案"它会永远离开你的图鉴..."
- 两个按钮：「再想想」（取消）/ 「挥手道别」（确认删除）
- 点击遮罩也可关闭，防止误删
- 已 git commit（d5746d0）

### 表单优先新建偶遇页 (open-encounter-form) ✓ 已验收
- 进入页面即展示完整偶遇档案卡片，所有字段默认为空，可直接手填
- AI 识别降格为辅助：按钮「✨ AI 帮我生成档案」移至上传照片正下方，生成后变为「重新生成」
- 删除独立地点输入行，地点仅保留在卡片底部标签行
- 图片预览改为 object-contain + 暖色背景，竖版图不再被裁剪
- 保存/分享按钮始终可见，不依赖 AI 生成状态
- 已 git commit（922bf3f）

### 季度分组列表布局 (seasonal-timeline-layout) ✓ 已验收
- 列表页按季度分组展示记录，分组标题格式"YYYY年春/夏/秋/冬"
- 使用 Swiper.js coverflow 效果：中心卡片正常大小（100%），两侧卡片缩小隐退（80%）
- 去除 3D 旋转透视，改为纯缩放隐退效果，更符合"卡片隐退"的设计意图
- 卡片保留三行信息：🐾 物种名 / 📍 地点 / 日期
- 顶部新增"时间线 / 图鉴"tab 占位 UI（时间线激活，图鉴灰色，点击暂不响应）
- 版本规划对调：v0.4 改为图鉴收集页，v0.5 改为偶遇地图 + 自动定位
- 已 git commit（83e5a8d）

### 卡片展开详情 (card-expand) ✓ 已验收
- 卡片右上角添加 ⋮ 菜单按钮（超轻半透明白色背景 rgba(255,255,255,0.6)）
- 菜单选项：「展开」「分享」「删除」（仅 expandingMenuId 对应卡片时显示）
- 点击「展开」进入全屏详情视图（列表完全隐藏）
- 详情视图布局：左上角 ← 返回按钮 + 右上角 ⋮ 菜单（仅「分享」「删除」，无「展开」）
- 详情内容：大图（w-full object-contain，max-h-96）+ 完整日志 + 物种/地点/日期
- 点击菜单外自动关闭菜单（mousedown 事件）
- 删除确认弹窗逻辑不变，删除后自动关闭展开态和菜单
- 已 git commit（fc9bf4f）

### Vercel 部署 + Supabase 后端迁移 ✓ 已验收
- 存储从 localStorage 迁移到 Supabase PostgreSQL
- AI 识别从前端直调改为后端代理（api/recognize.js），API Key 不再暴露前端
- 配置 vercel.json + 环境变量，线上 AI 识别正常可用
- 已 git commit（947ec5f、ce02d84）

### 本轮排障与修复 ✓ 已验收
- 已修复线上 OpenRouter API Key 未生效问题，AI 识别恢复正常
- 保存链路已改为后端代理：新增 `api/save-record.js`，由 Vercel Function 使用服务端 Supabase key 写入数据库
- 首页读取链路已改为后端代理：新增 `api/list-records.js`，首页不再前端直连 Supabase
- 删除链路已改为后端代理：新增 `api/delete-record.js`，列表页删除恢复可用
- `src/services/supabaseService.js` 已统一改为通过后端 API 处理 save/list/delete
- 线上验证通过：上传照片 → AI 生成 → 保存 → 首页可见 → 删除可用

### openspec 变更文档对齐 ✓ 已验收
- `openspec/changes/allow-records-write-temporarily/` 原文档描述的是"放开 Supabase RLS 让 anon 直写"的旧方案，与实际落地的"后端代理 + service role key"不一致
- 重写 proposal.md / design.md / tasks.md，改为描述真实落地方案
- 能力子目录从 `temporary-public-record-write` 重命名为 `backend-record-proxy`，spec delta 重写为：前端禁止直连 Supabase，保存/读取/删除统一走后端代理
- 变更目录 slug 保留 `allow-records-write-temporarily` 不改名，以保留 git 历史引用

## 已完成（v0.4 本轮新增）

### UI 设计规范文档 ✓ 已创建
- 新增 `design.md`，系统整理参考 Animal Island UI 的完整设计规范
- 包含：颜色体系、排版、间距、圆角、3D 阴影、动画、组件模式等
- 后续 UI 改造和新功能开发都参照此文档，确保风格统一

### 匿名登录 + RLS 用户隔离改造 (enable-anonymous-auth-rls) ✓ 已验收
- 新增 `src/services/authService.js`：封装 ensureSession / getAccessToken
- `App.jsx` 改用 authService，加 authReady / authError 状态
- `supabaseService.js` 三个 fetch 统一加 `Authorization: Bearer <token>` header
- 三个后端 API 改为 token 初始化，去掉 service role key 日常路径
- Supabase 开启 Anonymous Sign-Ins，RLS 策略清理至 4 条（删遗留 2 条 + 补 UPDATE WITH CHECK）
- 生产全链路验证通过：自动登录、保存、读取、删除、数据隔离均正常
- records.user_id 列 NOT NULL 约束恢复，安全加固完成
- ListPage 底部加"匿名模式，记录与本设备绑定"小字提示

## 待处理问题
- 删除确认弹窗与底部 TabBar 部分重合，显示不完整

## 下一步
- **v0.6（待规划）**：下一个大功能，具体内容待定
- 后续计划购买自定义域名（当前 vercel.app 域名在国内需要梯子访问)

### 已完成版本历史
- **v0.4 bug 修复 ✅**（2026-04-27）：后端 AI 识别加 25s 超时 + 错误提示移至 AI 按钮下方
- **v0.4.1 ✅**（2026-04-27）：LocationPicker 组件 + 详情页修改定位
  - GPS 一键定位 + 高德逆地理编码为中文地名
  - POI 关键词搜索（300ms 防抖，最多 5 条候选）
  - 确认后同时更新 location 文字和 latitude/longitude 坐标，地图 marker 位置同步
  - 新建 `api/update-record.js` 后端接口
- **v0.4.2 ✅**（2026-04-27）：详情页编辑已有记录——方案A设计
  - 顶部新增「✏️ 编辑」按钮（只读态）→ 「取消 / 保存」（编辑态）
  - 编辑态输入框背景暖色 #f0e8d8，融合卡片风格
  - 支持编辑：标题、日志、物种、地点（集成 LocationPicker）
  - 保存成功后自动退出编辑态，给用户清晰的保存反馈
  - 切换记录时自动退出编辑态

### 会话切分方案（Claude 额度规划）
采用**方案 A 三段式**分会话推进：

| 会话 | 内容 | 吃额度程度 |
|------|------|-----------|
| **会话 1（重）** | 第 2+3+4 组：前端 authService + App.jsx + 服务层 token + 后端三个 API 重构 | 🔴 密集，大部分代码改造集中在此 |
| **会话 2（中）** | 第 5+6+7 组：`vercel dev` 本地测试 → Supabase 开启 Anonymous Sign-Ins → RLS 策略差量调整 | 🟡 中等，多是用户操作我在旁指挥 |
| **会话 3（轻）** | 第 8+9 组：生产部署 + 全链路验证 + 8.7 收尾关闭 Allow Nullable + 文档清理 | 🟢 轻量，基本是贴结果我确认 |

**已知可能让某段会话膨胀的风险点**（撞上需要预留 buffer）：
1. 第 5 组 `vercel dev` 本地环境起不来类问题
2. 第 8 组线上部署后前端白屏 / 登录失败，需要抓 F12 + 日志定位
3. 第 7 组 RLS 策略调整后某条读写突然不通
4. Supabase / Vercel Dashboard UI 再次出现类似今天敏感变量、作用域之类的幺蛾子

**下次开对话的开场白**：直接告诉 Claude "接着做 enable-anonymous-auth-rls 第 2 组"，不用让它重读 progress.md。

## TODO（待处理）
- 按 tasks.md 推进第 2~9 组
- 改造完成稳定观察 1-2 天后，评估归档 `allow-records-write-temporarily` 变更
- 顺手修正 CLAUDE.md 中 `VITE_OPENROUTER_API_KEY` 为 `OPENROUTER_API_KEY`

## 未解决问题
- **图片存储技术债**：当前照片转 base64 直接存数据库，单张 1~3 MB，记录多时首页加载会越来越慢。正确做法是上传到对象存储（Supabase Storage 或 Cloudflare R2），数据库只存 URL。待用户量增长后处理。
- 本地开发若要跑 `api/*`，需要使用 `vercel dev`，而不是仅 `npm run dev`
- 用户清除浏览器缓存、无痕模式或换设备/浏览器会被视为新用户看不到原有记录，这是产品预期，将来通过升级为邮箱账号解决
