## Why

After v0.8.1 的成就，用户已经有了数据的记录。现在我们升级报告功能，从静态数据汇总升级到**动态洞察生成**——用AI理解用户的动物观察模式，生成有趣的个性化总结。这将把"数据表"变成"故事"，激发用户的持续参与动力。

## What Changes

- 报告页面（`ReportPage`）新增「你的动物观察记录」section，展示AI生成的个性化洞察
- 后端新增 `/api/generate-insights` 接口，调用AI分析用户历史记录，提取模式：
  - 时间偏好（什么时间段更容易遇到某物种）
  - 地点热点（哪些地点最容易遇到某物种）
  - 物种相关性（哪些物种经常一起出现）
  - 用户观察特征总结（如"你是傍晚鸟类观察家"）
- 数据分层：少于 5 条记录时不展示此section，避免样本偏差导致的假洞察
- 支持「最近三个月」和「自然年」两个时间窗口的洞察生成

## Capabilities

### New Capabilities
- `personalized-animal-insights`: 基于历史记录和时间窗口生成个性化动物观察洞察，包括时间偏好、地点特征、观察行为总结等
- `insights-api-generation`: 后端API接口，接收时间窗口参数，返回AI生成的洞察结果

### Modified Capabilities
- `report-page-display`: 报告页面需要集成新的洞察section，展示生成结果或加载态

## Impact

- 前端：修改 `src/pages/ReportPage.jsx`，新增洞察section和loading/empty状态
- 后端：新增 `api/_lib/insightsGenerator.js`（AI调用逻辑）和 `api/generate-insights.js`（API endpoint）
- AI成本：每次生成报告时额外调用一次AI（可考虑缓存）
- 依赖：无新增依赖
