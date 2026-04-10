## Why

线上“保存到日志”当前被 Supabase records 表的 RLS 拒绝，导致用户虽然能完成 AI 识别，却无法保存偶遇记录。需要先用一个临时方案恢复保存功能，避免核心流程卡死，再继续补正式的匿名登录和数据隔离方案。

## What Changes

- 临时允许前端未登录状态向 `records` 表写入新记录，恢复“保存到日志”可用。
- 明确该方案仅用于短期恢复可用性，不解决多用户数据隔离问题。
- 保持现有 AI 识别、列表读取和 Vercel 部署方式不变。

## Capabilities

### New Capabilities
- `temporary-public-record-write`: 定义未登录用户可临时写入 records 表的行为边界和限制。

### Modified Capabilities
- `record-storage`: 调整记录写入要求，允许在临时恢复阶段接受未登录写入。

## Impact

- Supabase `records` 表的 RLS 策略
- 线上“保存到日志”用户流程
- 后续匿名登录 + 正式 RLS 方案的切换计划
