## Why

用户持续记录偶遇后，缺少持续激励和目标感。成就系统能够识别用户的行为模式（如"连续记录"、"地点多样性"、"物种多样性"），用可见的徽章和解锁反馈激发用户继续探索和收集。

## What Changes

- 新增 5 个预定义成就：猫色大师、夜行者、老朋友、跨城旅行家、记录狂人
- 用户打开报告页时，后端检测并计算所有成就的解锁状态
- 报告页新增「你的成就」区块，展示已解锁成就为徽章列表
- 点击成就徽章可展开弹窗查看成就条件、当前进度、描述文案
- 新成就解锁时自动弹窗显示，带缩放进场动效 (zoom-in) 和完成反馈
- 检测逻辑：基于 records 表的已有字段（species_tag、location、created_at），纯前端聚合计算，无需修改数据库结构

## Capabilities

### New Capabilities
- `achievement-detection`: 基于用户记录聚合，检测 5 个成就的解锁条件
- `achievement-display`: 在报告页展示成就徽章，支持点击展开详情
- `achievement-unlocking-feedback`: 解锁成就时弹窗 + zoom-in 动效反馈

### Modified Capabilities
- `report-page`: 新增「你的成就」区块，支持切换时间窗口时重新检测成就

## Impact

- **前端**：ReportPage.jsx 新增成就 section、新增 AchievementModal 弹窗组件
- **服务层**：新增 achievementService.js（getAchievements、checkAchievements）、achievementRules.js（5 个成就判定函数）
- **后端 API**：新增 `/api/get-achievements` POST 接口（鉴权、调用检测逻辑）
- **样式**：复用现有的 StatCard、动画 keyframes (fade-in、zoom-in)，新增 bounce-in 动效
- **测试**：achievementRules 的纯函数需单测覆盖（各成就的边界条件）
