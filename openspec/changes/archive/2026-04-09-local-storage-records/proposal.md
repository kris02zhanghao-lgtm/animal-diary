## Why

用户识别动物后结果无法保存，刷新即丢失。需要本地存储功能，让用户能积累偶遇档案并随时回顾。

## What Changes

- 新增 `storageService.js`，封装 localStorage 读写、删除操作
- 识别成功后自动将记录（图片、地点、物种名、日志、时间）写入 localStorage
- ListPage 从 localStorage 读取并展示历史记录卡片列表
- 每条记录支持删除
- 空状态根据"从未有记录"和"记录已全部删除"场景动态显示

## Capabilities

### New Capabilities

- `record-storage`: 封装 localStorage 的存取/删除逻辑，供各页面调用
- `record-list`: ListPage 展示历史偶遇记录列表，支持删除单条

### Modified Capabilities

- `new-encounter`: 识别成功后触发保存，并在保存完成后跳回列表页

## Impact

- `src/services/storageService.js`（新增）
- `src/pages/NewEncounterPage.jsx`（修改：识别成功后保存并跳转）
- `src/pages/ListPage.jsx`（修改：从 localStorage 读取并渲染记录）
- 无新增依赖
