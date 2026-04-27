## Context

当前详情视图（card-expand）展示记录的完整内容，但所有字段均为只读。数据存储在 Supabase，Vercel Function 已有 save/list/delete 三条后端代理链路，RLS UPDATE 策略在 v0.3 已配置完毕（用户只能更新自己的记录）。

## Goals / Non-Goals

**Goals:**
- 详情视图内直接编辑标题、日志、物种、地点四个字段
- 通过新后端接口将改动持久化到 Supabase
- 保存成功后列表页数据实时反映改动

**Non-Goals:**
- 不支持在详情页替换图片（图片一经保存不可更改）
- 不支持批量编辑多条记录

## Decisions

**决策 1：编辑态 vs 查看态**
采用"始终可编辑"方案——标题、日志、物种字段默认渲染为 input/textarea，用户直接点击即可修改，无需切换"编辑模式"开关。
- 理由：表单字段少，切换开关增加操作步骤，收益低；与新建偶遇页风格一致。
- 备选方案：查看态 + 点击「编辑」切换，较繁琐，排除。

**决策 2：地点字段使用 LocationPicker**
地点字段不做纯文字输入，改为集成 v0.4.1 的 `LocationPicker` 组件（GPS + 搜索），保证修改地点时坐标同步更新。
- 理由：纯文字编辑地点会导致坐标与文字地名对不上，地图 marker 位置错误。

**决策 3：后端接口复用 v0.4.1**
`api/update-record.js` 和 `supabaseService.updateRecord` 在 v0.4.1 已建好，本版本直接复用，只需调用时传入 `{ id, title, species, journal }` 即可。

**决策 4：列表数据刷新**
保存成功后，在 `ListPage` 的 `expandedRecord` state 中直接更新该条记录，同时重新从后端拉取列表（调用已有 `fetchRecords`）。
- 理由：简单直接，避免本地状态与后端数据不一致。

## Risks / Trade-offs

- [并发编辑] 用户在两个标签页同时编辑同一条记录 → 后保存的覆盖先保存的。当前用户量极小，接受此风险，不做乐观锁。
- [字段为空] 用户清空物种字段后点保存 → 保存按钮禁用（与新建页逻辑一致）。
