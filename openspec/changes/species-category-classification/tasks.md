## 1. 数据库迁移

- [ ] 1.1 创建 Supabase migration，为 `records` 表新增 `category` 文本列，默认值 '其他'
  **待执行**：需在 Supabase Dashboard SQL Editor 运行 `supabase/migrations/20260427_add_category_column.sql`

## 2. 修改 API recognize 端点

- [x] 2.1 修改 `api/recognize.js`，识别完成后新增分类步骤
- [x] 2.2 第二次 AI 调用：根据 species 判断 category（猫/狗/鸟/松鼠/兔子/其他）
- [x] 2.3 返回结构改为 `{ success, title, species, category, journal }`
- [x] 2.4 处理分类失败的 fallback（默认返回 "其他"）

## 3. 修改 API save 端点

- [x] 3.1 修改 `api/save-record.js`，保存时同时写入 `category` 字段

## 4. 修改前端 supabaseService

- [x] 4.1 无需改动，list-records.js 已使用 `select('*')` 自动返回所有列

## 5. 修改图鉴聚合逻辑

- [x] 5.1 修改 `src/services/collectionService.js` 的 getSpeciesStats()，改为按 `category` 分组而非 `species`
- [x] 5.2 返回结构改为 `[{ category, count, latestPhoto, allRecords }, ...]`
- [x] 5.3 allRecords 中保留原始 species 信息，用于展开时显示细分品种

## 6. 修改图鉴显示

- [x] 6.1 修改 `src/pages/CollectionPage.jsx` 第一层，卡片标题改为显示 `category`（如"猫"）而非 `species`
- [x] 6.2 卡片副文本改为显示"遇到X次"（category 的总数）
- [x] 6.3 第二层照片网格，顶部标题改为"分类名（遇到X次）"（如"猫（遇到5次）"）

## 7. 测试验收

- [ ] 7.1 上传两张不同品种的猫（虎斑、橘猫等），确认都归到"猫"这一张卡片
- [ ] 7.2 展开"猫"卡片，确认显示多张照片，细分品种在详情里可见
- [ ] 7.3 上传狗和鸟，确认分别显示"狗"和"鸟"卡片，不混淆
- [ ] 7.4 删除某个大类的全部记录，确认卡片消失

## 8. 收尾

- [ ] 8.1 更新 progress.md
- [ ] 8.2 git commit
