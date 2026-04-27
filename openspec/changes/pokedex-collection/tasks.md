## 1. 数据聚合工具函数

- [x] 1.1 创建 `src/services/collectionService.js`
- [x] 1.2 实现 `getSpeciesStats(records)` 函数，返回 `[{ species, count, percentage, latestRecord, latestPhoto, mostRecentLocation }, ...]`，按 count 降序排列
  - count：该物种出现次数
  - percentage：count / total records * 100
  - latestPhoto：最新一条记录的图片
  - latestRecord：最新的一条记录对象

## 2. CollectionPage 组件 - 第一层物种卡片网格

- [x] 2.1 创建 `src/pages/CollectionPage.jsx` 或 `src/components/CollectionPage.jsx`
- [x] 2.2 实现空状态：无记录时显示"还没有发现任何物种，去记录偶遇吧～"
- [x] 2.3 实现物种卡片网格容器：responsive 2 cols (mobile) / 3 cols (desktop)
- [x] 2.4 实现物种卡片样式：[代表照片 | 物种名 | "遇到X次 (百分比%)"]
- [x] 2.5 卡片添加 hover 效果，颜色变化提示可点击
- [x] 2.6 点击卡片时进入第二层（selectedSpecies state）

## 3. CollectionPage - 第二层物种照片网格

- [x] 3.1 当 selectedSpecies 不为空时，显示该物种的所有照片网格
- [x] 3.2 照片网格使用 2-3 列响应式布局
- [x] 3.3 顶部显示「← 返回」按钮和物种标题「物种名（遇到X次）」
- [x] 3.4 点击照片查看完整卡片详情（复用现有详情页逻辑）

## 4. 物种卡片交互与删除

- [x] 4.1 在第二层（照片网格）中支持删除：点击记录的删除按钮弹出确认
- [x] 4.2 确认后删除记录，同时调用 fetchRecords 更新数据
- [x] 4.3 如果该物种最后一条记录被删除，自动返回物种卡片网格

## 5. 数据实时更新

- [x] 5.1 CollectionPage 和 ListPage 共享 records state（通过 App.jsx 管理或通过 fetchRecords）
- [x] 5.2 任何地方新增/删除记录后，CollectionPage 自动刷新（通过依赖监听触发 fetchRecords）
- [x] 5.3 从其他 tab（时间线、地图）切换回图鉴 tab 时，自动刷新数据

## 6. 集成到底部 Tab

- [x] 6.1 确认底部 BottomTabBar 中的「图鉴」tab 能正确导航到 CollectionPage
- [x] 6.2 验证从 CollectionPage 切换到其他 tab（时间线、地图）时状态正确

## 7. 测试与验收

- [ ] 7.1 手机端测试：点击图鉴 tab，验证物种网格显示正确
- [ ] 7.2 手机端测试：每个物种卡片显示正确的计数和百分比
- [ ] 7.3 手机端测试：点击物种卡片展开照片网格，返回按钮工作正常
- [ ] 7.4 手机端测试：新增记录后，图鉴自动显示新物种（或更新已有物种的计数和百分比）
- [ ] 7.5 手机端测试：删除记录，卡片数据实时更新；删除物种最后一条记录，物种卡片消失
- [ ] 7.6 手机端测试：空状态显示正确
- [ ] 7.7 桌面端测试：网格布局为 3 列，样式完整

## 8. 收尾

- [x] 8.1 更新 progress.md 记录 v0.5 完成
- [ ] 8.2 git commit 所有改动
- [ ] 8.3 部署 Vercel 并线上验证
