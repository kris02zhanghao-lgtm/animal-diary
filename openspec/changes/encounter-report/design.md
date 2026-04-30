## Context

当前产品有四个主要页面：时间线 ListPage、地图 MapPage、新建 NewEncounterPage、图鉴 CollectionPage，通过 BottomTabBar 切换。

数据存储：Supabase PostgreSQL，每条记录包含 id、imageBase64、location、species、category、journal、createdAt、user_id。

导航模式：BottomTabBar 有四个 tab（时间线、地图、+、图鉴），App.jsx 根据 currentTab 状态条件渲染页面。

## Goals / Non-Goals

**Goals:**
- 新增"报告"tab，展示用户的年度和季度总结
- 实现两种时间窗口切换（最近三个月 vs 自然年）
- 清晰展示核心数据：总数、top 物种、常去地点、最活跃月份
- 处理空状态：无数据、数据不足、数据充足的三种场景
- 保持星露谷 UI 风格一致

**Non-Goals:**
- 不生成 AI 总结文案（可选未来增强）
- 不支持按自定义日期范围查询
- 不涉及数据可视化图表（纯文本+数字呈现）

## Decisions

### D1：时间窗口切换方式
**选择：** 顶部按钮切换（最近三个月 / 自然年），状态保存在 ReportPage 的 useState

**理由：** 
- 最近三个月数据立刻可见（新用户友好）
- 自然年提供壮阔视角（老用户满足感）
- 切换不需要重新加载数据，快速响应

**替代方案：**
- ❌ Swiper 滑动切换：过度设计，实际不需要
- ❌ Dropdown 下拉选择：没有时间窗口这么值得突出

### D2：数据聚合逻辑位置
**选择：** 新建 `src/services/reportService.js`，独立的数据聚合函数 `generateReport(timeRange)`

**理由：** 
- 复用 supabaseService 的读取能力
- 逻辑清晰，易于测试和维护
- ReportPage 只负责 UI，数据逻辑下沉

### D3：UI 布局
**选择：** 卡片式分层展示

结构：
1. 顶部时间窗口切换按钮
2. 大数字亮点区（"你今年遇见了 23 只猫"）
3. 分层数据卡：top 3 物种、常去地点、最活跃月份
4. 底部：数据更新时间提示

**理由：** 
- 与现有卡片风格一致（动物卡片、偶遇档案卡）
- 大数字视觉冲击力强，符合"趣味报告"的目标

### D4：空状态处理
**选择：** 分三种文案

- 无记录（总数 = 0）："还没有偶遇呢，去记录你的第一次发现吧 🐾"
- 数据少（< 5 条）："数据还在积累，继续探索城市吧"
- 数据充足（>= 5 条）：正常展示报告

**理由：** 
- 无数据时直接鼓励用户去记录
- 数据少时给予温暖的等待信号，避免空荡荡的失落感

## Risks / Trade-offs

| 风险 | 缓解方案 |
|------|---------|
| 新用户数据为空，看不到报告 | 首次进入报告页展示空状态文案 + 引导链接到新建页 |
| 数据量大时聚合查询变慢 | 初期数据量小，后续可考虑缓存或物化视图 |
| 自然年和季度两种窗口逻辑相似 | 用同一个聚合函数，参数控制，减少重复代码 |

## Migration Plan

1. 新建 `src/pages/ReportPage.jsx` 和 `src/services/reportService.js`
2. 修改 `src/components/BottomTabBar.jsx`：新增 report tab 和对应的路由逻辑
3. 修改 `src/App.jsx`：添加 ReportPage 的条件渲染分支
4. 本地测试：无数据状态 → 添加几条数据 → 验证报告数据正确
5. 线上验证：部署到 Vercel，手机测试响应式布局

## Open Questions

- Q：最活跃月份如何展示？（柱状图 vs 排名列表 vs 单行文本）
  A：先用单行文本，如有需要后续升级

- Q：top 3 物种中，如果少于 3 个种类怎么办？
  A：有多少展示多少，比如只有 2 种就展示 2 种

- Q：常去地点是否需要排序权重（出现次数 vs 距离）？
  A：按出现次数倒序，简单直接
