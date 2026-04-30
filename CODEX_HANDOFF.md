# 给 Codex 的项目交接清单

你好！我是一直和 kris 并肩开发这个项目的 Claude（在 Claude Code 里）。下面是你需要知道的一切。

---

## 🎯 项目概况

**动物偶遇图鉴** - 用 AI 记录你在城市中偶遇小动物的个人图鉴 app。用户拍照 → AI 识别 → 生成趣味日志 → 保存并回顾。

**当前版本**：v0.5.1（已验收）  
**你要做**：v0.6（偶遇报告）+ v0.7（分享功能）  

---

## 🛠️ 技术栈

| 项目 | 方案 |
|------|------|
| 框架 | React 18（Vite） |
| 样式 | Tailwind CSS v3 |
| 存储 | Supabase PostgreSQL + 匿名登录 |
| 后端 | Vercel Functions（代理 OpenRouter API） |
| AI | google/gemini-2.5-flash-lite（OpenRouter） |
| 部署 | Vercel |
| 地图 | 高德地图 JS API |

---

## 📂 项目结构（关键目录）

```
src/
├── pages/
│   ├── ListPage.jsx           # 时间线列表（季度分组）
│   ├── NewEncounterPage.jsx   # 新建偶遇
│   ├── DetailPage.jsx         # 展开查看详情
│   ├── MapPage.jsx            # 地图视图（高德地图）
│   ├── CollectionPage.jsx     # 图鉴收集（两层结构）
│   └── ReportPage.jsx         # 【新】偶遇报告（v0.6）
├── components/
│   ├── BottomTabBar.jsx       # 底部导航（5个tab）
│   ├── LocationPicker.jsx     # GPS定位 + POI搜索
│   ├── PhotoCard.jsx          # 图鉴页的照片卡片
│   └── ShareModal.jsx         # 【新】分享弹窗（v0.7）
├── services/
│   ├── aiService.js           # AI 识别和日志生成
│   ├── authService.js         # 匿名登录和 token 管理
│   ├── supabaseService.js     # 数据库操作（save/list/delete）
│   ├── collectionService.js   # 物种大类分类聚合
│   ├── reportService.js       # 【新】报告数据聚合（v0.6）
│   └── storageService.js      # localStorage 备用存储
├── utils/
│   ├── amap.js                # 高德地图初始化
│   └── shareUtils.js          # 【新】Canvas 分享卡片生成（v0.7）
└── App.jsx                    # 主组件（页面路由）

api/
├── recognize.js               # 后端 AI 识别 + 物种分类
├── save-record.js             # 保存记录到 Supabase
├── list-records.js            # 读取记录列表
├── delete-record.js           # 删除记录
└── update-record.js           # 更新记录（编辑用）
```

---

## 🔑 关键技术细节

### 1. 数据结构（Supabase records 表）
```javascript
{
  id: uuid,
  user_id: uuid,
  imageBase64: string,        // 照片（base64，1-3MB）
  species: string,            // "橘猫"
  category: string,           // "猫" (大类)
  journal: string,            // 日志
  title: string,              // 10字以内标题
  location: string,           // "北京，798艺术区"
  latitude: float,
  longitude: float,
  createdAt: timestamp
}
```

### 2. 导航模式（BottomTabBar）
5 个 tab：
- 时间线（ListPage）- 按季度分组
- 地图（MapPage）- emoji marker
- ➕（NewEncounterPage）- 新建
- 图鉴（CollectionPage）- 两层：大类 → 照片
- 📊【新】报告（ReportPage）- 年度/季度总结

### 3. 认证模式（匿名登录）
- 用户自动匿名登录（authService.ensureSession）
- 所有后端 API 需要 `Authorization: Bearer <token>` header
- 数据通过 RLS（行级安全）隔离：`user_id = auth.uid()`

### 4. AI 识别流程
用户上传照片 → `api/recognize.js` 调用 OpenRouter 两次：
1. 第一次：识别物种 + 生成日志
2. 第二次：判断物种属于哪个大类（猫/狗/鸟/松鼠/兔子/其他）

---

## 📝 开发规范（必须遵守）

> 这些规范来自 kris 的 CLAUDE.md，必须遵守，否则会被喷！

### ✅ DO


- **保持现有代码风格**：驼峰命名、函数式组件、Hooks
- **变量命名清晰**：`recordId` 不是 `rid`
- **优先编辑现有文件**，不要乱创建新文件
- **简单直接的方案**，不要为未来假想需求预留扩展点
- **测试完整流程**：不只是看代码通过，要在浏览器上手动测试

### ❌ DON'T

- ❌ 自动 git commit 或 push（kris 手工确认后再做）
- ❌ 添加新依赖（未经确认）
- ❌ 重构未涉及的代码
- ❌ 留下 console.log 调试代码
- ❌ API Key 写进代码（只能在 .env 或 Vercel 环境变量）
- ❌ 不测试直接说完成

### 代码风格示例

```javascript
// ✅ 好
function getReportData(timeRange) {
  const records = await fetchRecords();
  return aggregateByTimeWindow(records, timeRange);
}

// ❌ 不好
// 获取报告数据
function getReportData(r) {  // 缩写+注释
  const d = await fetchRecords();
  return doAgg(d, r);  // 函数名缩写
}
```

---

## 🎨 UI 设计规范（星露谷+动物森友会风格风格）

### 颜色体系
- **背景**：`#fffdf7`（奶油白）
- **暖色**：`#f9f0e6`、`#d4c5a9`、`#5a4a3a`（深棕）
- **强调**：`#4a7c59`（暖绿，用于按钮）

### 组件样式
- **卡片**：`border: 3px solid #5a4a3a; box-shadow: 4px 4px 0px #5a4a3a;`
- **圆角**：统一 `rounded-lg`（Tailwind）
- **字体**：标题用 `Press Start 2P`（像素字），正文用系统字体
- **动物 emoji**：🐾 🐱 🐶 🐦 🦝 🐰 等，做装饰和视觉亮点

### 空状态示例
```
【松鼠图标】
还没有发现任何物种
去记录你的第一次偶遇吧 🐾

[点击这里开始 →]
```

---

## 🚨 已知的坑与注意事项

### 1. Base64 图片存储技术债
- **问题**：照片转 base64 直接存数据库，单张 1-3MB，首页加载会越来越慢
- **当前方案**：先这样用，后续迁移到 Supabase Storage
- **v0.7 做分享时要注意**：Canvas 加载 base64 图片时可能卡顿，需要加 Loading spinner

### 2. 删除确认弹窗与 TabBar 重合
- **问题**：底部弹窗显示不完整
- **当前状态**：已注意但未修复（低优先级）
- **v0.6/0.7 若涉及删除，要检查是否还存在**

### 3. 本地开发需要用 `vercel dev`
- ❌ `npm run dev` 不会启动 `api/*` 的后端函数
- ✅ 正确做法：`vercel dev`，这样才能本地测试后端 API

### 4. 高德地图 Key 配置
- 环境变量：`VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_CODE`
- 已配置在 Vercel，本地开发需要自己加到 `.env.local`

### 5. Supabase 匿名登录
- 自动触发：AuthService.ensureSession() 在 App.jsx 初始化
- 不需要用户输入用户名密码
- 数据隔离依赖 RLS 策略（已配置）

---

## ✅ 验收标准（必须达到）

### v0.6 验收清单
- [ ] ReportPage 能显示（导航栏有报告 tab）
- [ ] 点击时间窗口切换，数据正确更新
- [ ] 无数据/数据不足/数据足够三种空状态显示正确
- [ ] 报告数据与实际记录数量匹配
- [ ] 本地测试通过（`vercel dev`）
- [ ] 部署到 Vercel 后在手机上测试
- [ ] UI 风格与现有页面一致

### v0.7 验收清单
- [ ] 详情页菜单有"分享"按钮（不再是"即将上线"）
- [ ] 点击生成分享卡片（Canvas 图片）
- [ ] 支持下载 PNG 图片
- [ ] 支持复制到剪贴板（有 fallback 方案）
- [ ] Clipboard API 不支持时有降级（文案分享）
- [ ] 分享卡片样式漂亮（符合星露谷风格）
- [ ] 本地测试：生成图片 → 验证样式
- [ ] 部署测试：手机端下载和复制都能用

---

## 🚀 工作流程

### 开始前
1. 读一遍这份交接清单
2. 读 `CLAUDE.md`（项目规范）和 `progress.md`（当前进度）
3. 跑一遍现有项目：`vercel dev` → 打开浏览器 → 测试各页面

### 开发中
1. 按 `openspec/changes/encounter-report/tasks.md` 逐步完成（v0.6）
2. 再按 `openspec/changes/share-encounter/tasks.md` 逐步完成（v0.7）
3. **每完成一个小任务就 commit**，commit message 要清楚
4. **卡住超过 3 轮就停下来**，告诉 kris（参考 CLAUDE.md 的效率原则）

### 完成后
1. 本地 `vercel dev` 测试整个流程
2. 部署到 Vercel
3. 手机真机测试（响应式、性能、交互）
4. 告诉 kris：改了哪些文件、有什么需要注意的
5. **不要自动 commit/push**，等 kris 确认后手工做

---

## 📞 如果卡住了

### 常见问题

**Q1：localhost 改不了代码，改完不刷新**
- A：确保用的是 `vercel dev` 而不是 `npm run dev`

**Q2：Canvas 加载 base64 图片很慢**
- A：正常的，加 Loading spinner，v0.8+ 再优化

**Q3：后端 API 返回 401 Unauthorized**
- A：检查 token 有没有传，authService.getAccessToken() 是否被调用

**Q4：高德地图显示不出来**
- A：检查 VITE_AMAP_KEY 有没有配置，Vercel 环境变量是否生效

### 需要 kris 帮忙的情况
- 🚨 需要修改数据库表结构或 RLS 策略
- 🚨 需要新增 Vercel 环境变量或后端函数
- 🚨 需要改 PRD 或产品逻辑
- 🚨 代码逻辑之外的问题（网络、配置、工具）

---

## 📚 参考文档

- `PRD.md` - 产品需求文档，了解整体功能规划
- `progress.md` - 进度记录，了解每个版本做了什么
- `CLAUDE.md` - 项目规范和工作习惯
- `design.md` - UI 设计规范（颜色、排版、间距）
- `growth.md` - 产品决策和踩坑复盘

---

## 🎁 给你的建议

1. **先不要改代码**，先跑一遍现有项目，摸清楚流程
2. **理解数据结构**，特别是 records 表和 category 字段
3. **理解认证流程**，authService 和 token 怎么流转的
4. **UI 要参考现有组件**，保持风格一致（不要自己创意）
5. **v0.6 比 v0.7 简单**，建议先快速做完 v0.6，再用相同的思路做 v0.7

---

## 最后

这个项目是 kris 精心打磨的小项目，虽然小但五脏俱全：AI、地理信息、实时交互、移动适配、后端代理、数据库都有涉及。

代码不要求完美，但要求**清晰、可维护、符合规范**。每改一行代码都要想：_"6 个月后，其他人读这段代码会不会困惑？"_

加油！有问题直接问 kris，他很友善。

---

**你的前辈**  
Claude（Claude Code 里的那个）
