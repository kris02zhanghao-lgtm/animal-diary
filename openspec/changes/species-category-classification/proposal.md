## Why

当前图鉴按物种细分聚合（虎斑猫、橘猫、奶牛猫分开显示），但 AI 识别同一动物时品种名不稳定（光线/角度差异），导致同一只狸花猫被识别为"虎斑猫"和"橘猫"，物种卡片零散。

## What Changes

- 识别返回时新增 `category` 字段（大类：猫、狗、鸟、松鼠、兔子、其他）
- 图鉴聚合改为按 `category` 而非 `species`，一张卡片代表一个大类的全部记录
- 保留原始 `species` 字段用于展示细分信息和用户编辑

## Capabilities

### New Capabilities

- `species-auto-categorization`：识别完成后 AI 自动分类为大类（猫/狗/鸟等）
- `pokedex-category-aggregation`：图鉴页按大类聚合，不再被细分品种名的变体分散

### Modified Capabilities

- `animal-recognition`：返回结构新增 `category` 字段
- `pokedex-view`：聚合逻辑改为按 `category`，卡片展示大类名

## Impact

- 修改文件：`api/recognize.js`（新增分类步骤）、`api/save-record.js`（保存 category）、`src/services/supabaseService.js`（读取 category）、`src/services/collectionService.js`（聚合逻辑）
- 数据库：`records` 表新增 `category` 字符串列
- API 成本：每次识别多一次 AI 调用（分类请求）
- 前端：CollectionPage 显示 category 作为卡片标题，species 作为卡片副文本或点开后的详情
