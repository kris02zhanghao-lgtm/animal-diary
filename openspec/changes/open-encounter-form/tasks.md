## 1. 修改 state 初始值

- [x] 1.1 将 `title`、`species`、`journal` 初始值从 `null` 改为 `''`（空字符串）
- [x] 1.2 `handleImageSelect` 中移除重置 title/species/journal 的逻辑，只保留重置 `recognizedAt` 和 `error`

## 2. 重构渲染逻辑

- [x] 2.1 移除偶遇档案卡片外层的 `{species && ...}` 条件，改为始终渲染
- [x] 2.2 移除操作按钮区域外层的 `{species && ...}` 条件，改为始终渲染
- [x] 2.3 卡片日期区：`recognizedAt` 为 null 时改为显示今天日期（`new Date()`）

## 3. 修改 AI 生成按钮

- [x] 3.1 按钮文字：加载中显示「识别中...」，已生成过（`recognizedAt !== null`）显示「重新生成」，否则显示「✨ AI 帮我识别并生成」
- [x] 3.2 按钮禁用条件：`isLoading || !selectedImage`（保持不变）
- [x] 3.3 按钮移至操作区底部，独占全宽一行，排在保存/分享两个按钮的上方

## 4. 调整按钮布局

- [x] 4.1 最终按钮布局（从上到下）：全宽 AI 生成按钮 → 保存+分享并排按钮
- [x] 4.2 保存按钮禁用条件保持 `!species.trim()`

## 5. 更新占位符文案

- [x] 5.1 标题 input placeholder 改为「给这次偶遇起个名字...」
- [x] 5.2 日志 textarea placeholder 改为「记录这次偶遇的故事，或点击上方按钮让 AI 帮你生成...」
- [x] 5.3 种类 input placeholder 保持「动物种类」
