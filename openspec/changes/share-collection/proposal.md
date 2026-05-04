## Why

用户完成了一定数量的动物发现后，希望能分享自己的成果给朋友，建立个人图鉴的公开链接。这既是社交分享的需求，也是产品增长的杠杆——通过分享激励更多人使用产品。

## What Changes

- CollectionPage 顶部新增"分享图鉴"按钮
- 点击后生成公开链接（形如 `https://animal-diary.vercel.app/shared/<token>`）
- 公开链接展示用户的完整图鉴：所有物种、照片、统计数据（总数、Top物种、Top地点）
- 支持复制链接或生成分享卡片（复用现有分享逻辑）
- 用户可管理分享：查看链接、重置链接、禁用分享

## Capabilities

### New Capabilities
- `share-collection`: 生成和管理公开图鉴链接，包括链接生成、数据加密/令牌化、公开页面访问权限控制
- `public-collection-page`: 公开图鉴查看页面，展示物种网格、统计卡片、个人签名（可选）

### Modified Capabilities
- `collection-page`: 新增分享入口按钮和分享弹窗交互

## Impact

- **前端**：CollectionPage 新增分享按钮、分享弹窗；新增 PublicCollectionPage 组件展示公开图鉴
- **后端**：新增 `/api/share-collection.js`（生成/重置分享链接）、`/api/public-collection/<token>.js`（公开访问）
- **数据库**：records 表新增 `is_public` 字段（布尔）；可选新增 collection_shares 表（存储分享令牌、过期时间、访问统计）
- **依赖**：无新增依赖
