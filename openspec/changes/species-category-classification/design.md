## 关键决策

### 决策1：AI 分类在 `api/recognize.js` 内部，同一 handler 两次调用

在识别完 species 后，立即调用第二个 AI 请求："根据这个物种名，判断它属于哪个大类？猫/狗/鸟/松鼠/兔子/其他"。

**为什么**：保证原子性，一个 API 调用返回完整的 species + category；避免分散为两个端点；用户体验一致。

**放弃方案**：独立 API 端点分类——拆分了职责，增加网络开销，控制流复杂。

### 决策2：大类固定为六个：猫、狗、鸟、松鼠、兔子、其他

覆盖常见城市动物，不常见的归入"其他"。避免大类也膨胀导致聚合失效。

### 决策3：数据库新增 `category` 列，前端聚合时按 category 分组

不在内存里动态映射，而是把 category 持久化到数据库，图鉴读取时直接按 category 聚合。

**优点**：查询高效，聚合逻辑清晰，用户编辑时 category 不会丢失。

### 决策4：CollectionPage 卡片展示 category，species 作为副文本

卡片标题显示"猫"（category），鼠标/长按展开时可显示"虎斑猫"（具体 species）。

## API 设计

### 识别返回结构

```json
{
  "success": true,
  "title": "...",
  "species": "虎斑猫",
  "category": "猫",
  "journal": "..."
}
```

### 分类 prompt

```
根据这个动物物种名，判断它属于以下哪个大类？
物种名：虎斑猫
大类选项：猫、狗、鸟、松鼠、兔子、其他

只返回大类名称，不要有其他文字。
```

## 数据库表变更

`records` 表新增列：

```sql
ALTER TABLE records ADD COLUMN category TEXT DEFAULT '其他';
```

## 前端聚合逻辑变更

`collectionService.js` 的 `getSpeciesStats()` 改为按 category 分组：

```js
const categoryMap = {}
records.forEach((record) => {
  const cat = record.category?.trim() || '其他'
  if (!categoryMap[cat]) {
    categoryMap[cat] = { category: cat, records: [] }
  }
  categoryMap[cat].records.push(record)
})

// 然后对每个 category 统计，latestPhoto 取最新记录的图片
```

## 注意点

- 旧记录（没有 category 的）默认归为"其他"
- 用户编辑物种名时，category 仍需与 AI 返回保持一致（或提供手动修改 category 的界面）
- 图鉴卡片标题改为 category，点开后可显示该大类下的所有细分 species
