## Context

ReportPage.jsx 已有时间窗口切换（「最近三个月」/「自然年」），使用 reportService 聚合 records 数据。现有 API 后端模式使用 http.js 工具库 + 鉴权流程。

成就检测需要基于 records 表的已有字段：species_tag（物种中类）、location（地点文字）、created_at（时间戳）。

## Goals / Non-Goals

**Goals:**
- 在报告页集成 5 个成就，检测逻辑基于 records 表聚合
- 点击成就展开弹窗查看条件、进度、描述
- 新成就解锁时弹窗通知，带 zoom-in 动效
- 时间窗口切换时重新检测成就（数据随时间范围变化）

**Non-Goals:**
- 不持久化已解锁成就记录到数据库（无需新表、无需修改 RLS 策略）
- 不做成就等级/进度条动画（仅显示已解锁/未解锁）
- 不做成就分享卡片（后续 v0.9.1+）
- 不做国际化多语言（暂定中文）

## Decisions

### 1. 成就检测在前端还是后端？
**决策**：前端纯函数检测（achievementRules.js）

**理由**：
- 5 个条件都基于 records 本地数据，无需额外 API 调用或 AI 计算
- 前端计算可自动响应本地数据变化，无延迟
- 简化后端负担，降低 API 成本

**实现**：reportService 已聚合 records 数据，achievementRules.js 消费聚合后的数据结构

### 2. 成就数据持久化策略
**决策**：不持久化解锁状态，每次打开报告页重新计算

**理由**：
- 减少数据库写入和 RLS 策略复杂性
- 成就条件简单（记录数、地点数、时间等），重算成本低
- 用户在本设备上行为一致，解锁状态不会变化（除非新增记录）

**权衡**：用户切换设备/浏览器时看不到成就（与产品现状一致——匿名登录设备绑定）

### 3. 如何检测"新成就"（用于触发解锁弹窗）
**决策**：在 ReportPage 内维护 `prevAchievements` 状态，对比本次和上次的结果

**实现**：
```
componentDidMount / useEffect 首次计算 achievements A
用户操作（切换时间窗口 / 保存新记录）→ 重新计算 achievements B
if (B.some(ach => !prevAchievements.includes(ach))) → 弹窗显示新成就
setState(prevAchievements = B)
```

### 4. 成就详情弹窗的UI交互
**决策**：复用现有 ShareModal 的结构（fixed 遮罩 + fade-in、内容卡片 + zoom-in），新增 bounce-in keyframe

**理由**：
- ShareModal 已有成熟的点击遮罩关闭、自动消失逻辑
- z-index、animations 风格统一
- 减少 CSS 代码重复

### 5. 成就清单设计（5 个成就）
**决策**：硬编码成就条件，暂不支持运营侧动态调整

**理由**：初版简单化，避免配置表复杂性。条件定义在 achievementRules.js 作为导出常量，便于后续调整。

**成就定义**：
```
1. 猫色大师：species_tag 包含至少 5 种不同"猫"中类的记录
2. 夜行者：至少 1 条记录的 created_at 时间在 22:00 - 06:00
3. 老朋友：至少 1 个 location，相同 location 的记录数 >= 3
4. 跨城旅行家：location 不同的城市数 >= 2（需从 location 文字提取城市——使用简单规则：分割、去重）
5. 记录狂人：总记录数 >= 50
```

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|--------|
| 城市提取不准确 | "跨城旅行家" 成就判定错误 | 初版使用简单分割（取第一个词），用户反馈后优化 |
| 前端检测性能 | 100+ 条记录时聚合耗时 | achievementRules 用 Set/Map 优化，避免 O(n²)；ReportPage loading 已有加载态 |
| 用户未感知到解锁 | 错过解锁弹窗 | 弹窗默认显示 3 秒自动关闭，用户也可随时点击成就区块查看 |

## Migration Plan

**第一阶段**：实现 achievementRules.js + achievementService.js（纯前端逻辑，无后端修改）
**第二阶段**：集成到 ReportPage，新增成就 section + AchievementModal
**第三阶段**：测试覆盖（边界条件、多时间窗口切换、解锁动效）

**部署策略**：功能完整后一次性上线（无 feature flag，v0.9 版本）；若成就条件需调整，直接修改 achievementRules.js 常量，无需后端部署。

## Open Questions

1. 成就徽章的视觉设计（图标/颜色）是否需要与设计师确认？
2. 未来是否考虑加成就等级/稀有度（影响弹窗样式）？
