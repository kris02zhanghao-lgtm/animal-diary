## 1. storageService 封装

- [x] 1.1 创建 `src/services/storageService.js`，定义 `STORAGE_KEY = 'animal-diary-records'`
- [x] 1.2 实现 `getRecords()`：读取并解析 localStorage，异常时返回空数组，结果按 createdAt 降序排列
- [x] 1.3 实现 `saveRecord(record)`：追加到数组并写回 localStorage，异常时抛出错误
- [x] 1.4 实现 `deleteRecord(id)`：过滤掉对应 id 并写回 localStorage

## 2. NewEncounterPage 集成保存逻辑

- [x] 2.1 识别成功后调用 `saveRecord()`，传入 imageBase64、location、species、journal、id、createdAt
- [x] 2.2 保存成功后调用 `navigateTo('list')` 跳回列表页
- [x] 2.3 保存失败时展示"保存失败，请重试"提示，保留当前识别结果

## 3. ListPage 展示记录

- [x] 3.1 组件挂载时调用 `getRecords()` 读取记录，存入 state
- [x] 3.2 有记录时渲染卡片列表：图片缩略图、物种名、地点、日志、时间
- [x] 3.3 无记录时展示空状态（松鼠 emoji + 引导文字）
- [x] 3.4 每张卡片添加删除按钮，点击后调用 `deleteRecord(id)` 并更新 state
