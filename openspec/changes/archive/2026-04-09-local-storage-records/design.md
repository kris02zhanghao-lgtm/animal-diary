## Context

当前 AI 识别结果仅在内存中存在，页面跳转或刷新后即丢失。项目为纯前端应用（无后端），使用 localStorage 是最轻量的持久化方案，无需新增依赖。

## Goals / Non-Goals

**Goals:**
- 识别成功后自动保存完整记录到 localStorage
- ListPage 读取并渲染历史记录
- 支持单条删除

**Non-Goals:**
- 云端同步
- 记录编辑
- 分页或搜索

## Decisions

**数据结构：每条记录存为对象，统一存入 `animal-diary-records` key 下的数组**

```json
{
  "id": "uuid-timestamp",
  "imageBase64": "data:image/jpeg;base64,...",
  "location": "上海",
  "species": "橘猫",
  "journal": "在上海，你...",
  "createdAt": "2026-04-09T10:00:00.000Z"
}
```

用单一 key 存数组，读写原子，逻辑简单。id 用 `Date.now() + Math.random()` 生成，无需引入 uuid 库。

**storageService.js 封装三个方法：`getRecords()` / `saveRecord(record)` / `deleteRecord(id)`**

集中管理存储逻辑，页面组件不直接操作 localStorage。

**识别成功后自动保存，不需要用户额外点击确认**

减少操作步骤，档案感更强。保存完成后跳回列表页。

## Risks / Trade-offs

- [图片 base64 体积大，记录多时 localStorage 可能接近 5MB 上限] → 当前为个人图鉴，记录数量有限，暂不处理；后续可考虑压缩或只存缩略图
- [localStorage 在隐私模式下可能被禁用] → 捕获异常，降级展示错误提示
