## Why

用户在详情页（card-expand 展开视图）只能查看记录，无法修改已保存的内容。当 AI 生成的文字不准确，或用户事后想补充地点、修正物种名称时，只能删掉重建，体验差。

## What Changes

- 详情页由纯展示变为可编辑：标题、日志、物种、地点均支持直接点击编辑
- 新增「保存修改」按钮，触发后端更新接口，把改动写回数据库
- 新增后端 `api/update-record.js`，校验 token 后用 Supabase 更新对应记录
- 编辑态与查看态统一在同一视图内，无需跳转新页面

## Capabilities

### New Capabilities

- `record-editing`: 在卡片详情页对已有记录进行编辑并保存到数据库

### Modified Capabilities

- `record-list`: 详情视图从纯展示改为可编辑展示，编辑保存后列表数据实时刷新

## Impact

- `src/pages/ListPage.jsx`：详情视图新增编辑态 state 和保存逻辑
- `src/services/supabaseService.js`：新增 `updateRecord` 函数，调用后端更新接口
- `api/update-record.js`：新建 Vercel Function，处理 PUT 请求，验证用户 token，更新 Supabase 记录
- Supabase RLS：确认现有 UPDATE 策略已允许用户更新自己的记录（v0.3 已配置）
