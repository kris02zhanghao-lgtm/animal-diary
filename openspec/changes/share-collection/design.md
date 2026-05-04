## Context

当前用户的图鉴数据存储在 Supabase 中，通过 RLS 策略进行用户隔离。用户已经能够看到自己的物种收集页面，但无法与他人分享。分享功能需要在保持数据隐私的前提下，允许特定用户生成一个公开链接，供任何人访问。

## Goals / Non-Goals

**Goals:**
- 用户可以一键生成自己图鉴的公开分享链接
- 公开链接显示用户的所有动物发现（物种、照片、统计数据）
- 用户可以禁用、重置或删除分享链接
- 分享链接支持复制和生成分享卡片
- 实现简单，不引入额外复杂性

**Non-Goals:**
- 不做分享链接的过期机制（无限期有效，直到用户主动删除）
- 不做访问统计和分析
- 不做评论、点赞等社交互动
- 不支持部分数据分享（全部图鉴或不分享）
- 不做私有数据保护（已分享的数据对所有人可见）

## Decisions

### 1. 令牌生成方案
**决策：使用 nanoid 生成短随机令牌（12 字符）**

- **Why**: 足够安全（2^72 种可能性），URL 友好，易于用户手动输入或分享
- **Alternatives**:
  - UUID: 太长，URL 不友好
  - 加密 user_id: 额外复杂性，不必要

### 2. 令牌存储方案
**决策：新建 `collection_shares` 表，存储 user_id、token、created_at**

```sql
CREATE TABLE collection_shares (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token VARCHAR(12) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

- **Why**: 单一职责，便于查询和管理；RLS 策略可以保护用户只能管理自己的分享
- **Alternatives**:
  - 存在 records 表: 冗余，每条记录都保存一份 token 浪费空间
  - 存在 user metadata: 扩展性差，Supabase auth 字段有大小限制

### 3. 公开页面访问模型
**决策：令牌本身即权限证明，无需额外权限表**

- 访问 `/shared/<token>` 时，直接查询 `collection_shares` 找到对应 user_id
- 然后读取该 user_id 的所有 records（未来如果需要隐私字段可再加控制）
- RLS 策略：`collection_shares` 无 RLS（任何人可查询令牌所有者）；`records` 保持现有 RLS（只有所有者可写，任何人可读公开数据）

### 4. 后端 API 设计
**生成/管理分享:**
- `POST /api/share-collection` - 生成新分享链接（若已存在则返回现有链接）
- `DELETE /api/share-collection` - 删除分享链接（禁用分享）
- `GET /api/share-collection` - 查看当前分享链接（如果存在）

**公开访问:**
- `GET /api/public/collection/<token>` - 获取该用户的图鉴数据（物种、照片、统计）
  - 返回格式：`{ owner_name?, records: [...], stats: { total, topSpecies, topLocation } }`
  - 无鉴权，任何人可访问

### 5. 前端流程
**CollectionPage 分享按钮：**
- 点击"分享图鉴"按钮 → 弹窗出现
- 如果未生成过链接：显示"生成分享链接"按钮
- 如果已生成：显示链接（完整 URL）、"复制链接"、"生成分享卡片"、"取消分享"
- 分享卡片复用现有 shareUtils，展示用户名、物种数、照片拼接

**新增 PublicCollectionPage：**
- 路由 `/shared/<token>`
- 显示物种网格（与 CollectionPage 一致）
- 顶部显示"用户的动物发现" 统计卡片
- 无"删除"、"编辑"、"选择"等功能（只读）

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| 令牌碰撞（两个不同用户生成相同 token） | nanoid 碰撞概率极低（<1e-6）；若要绝对安全可在 DB 端加 UNIQUE 约束 |
| 用户分享含敏感位置的动物 | 说明文档提示用户：分享公开后，所有位置和照片对所有人可见 |
| 令牌泄露被滥用（恶意访问、爬虫） | 第一版不限制访问频率；若需要可后续加 rate limit；令牌长度足够安全 |
| 删除分享后，已分享的 URL 仍被访问 | 访问会 404，符合预期；可选在 DB 中软删除（加 deleted_at）以保留历史 |

## Migration Plan

**部署顺序：**
1. 新建 `collection_shares` 表，配置 RLS 策略
2. 部署后端 API（3 个生成/管理端点 + 1 个公开访问端点）
3. 部署 PublicCollectionPage 组件和路由
4. 在 CollectionPage 添加分享按钮
5. 上线验证：生成链接 → 访问公开页面 → 删除分享 → 确认 404

## Open Questions

- 用户签名（owner_name）是否从 auth metadata 读取，还是有单独用户档案表？当前无 user profile，建议第一版不展示签名，后续补充
- 公开页面是否需要 SEO（meta tags、schema.json）？可选，但有利于分享到社交网络
- 是否需要让用户自定义分享链接（如 `/shared/kris-collection`）？不做，复杂度高且收益不明确
