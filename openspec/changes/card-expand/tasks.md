## 1. 添加展开状态管理

- [x] 1.1 在 ListPage 添加 `expandedId` state，初始值为 null
- [x] 1.2 在 ListPage 添加 `expandingMenuId` state，记录当前打开菜单的卡片 id

## 2. 实现卡片菜单 UI（折叠态）

- [x] 2.1 在 Swiper 卡片右上角添加 ⋮ 按钮，点击切换 `expandingMenuId`
- [x] 2.2 菜单下拉浮层：`position: absolute`、`z-index: 20`、三个选项（展开、分享、删除）
- [x] 2.3 点击菜单外（包括卡片其他区域）时关闭菜单，改为 `expandingMenuId = null`
- [x] 2.4 「展开」选项点击后：设置 `expandedId`、关闭菜单
- [x] 2.5 「分享」选项点击后：alert("即将上线，敬请期待！")、关闭菜单
- [x] 2.6 「删除」选项点击后：触发 `setConfirmingId(record.id)`、关闭菜单

## 3. 实现详情视图 UI（展开态）

- [x] 3.1 条件渲染：当 `expandedId !== null` 时显示详情视图
- [x] 3.2 详情视图左上角：← 返回按钮，点击时 `setExpandedId(null)`
- [x] 3.3 详情视图右上角：⋮ 菜单按钮（同样点击切换 `expandingMenuId`）
- [x] 3.4 详情视图菜单：仅包含「分享」和「删除」两项（不显示「展开」）
- [x] 3.5 详情视图内容：大图（w-full object-contain，限制最大高度）+ 完整日志 + 物种/地点/日期信息

## 4. 删除逻辑调整

- [x] 4.1 删除确认弹窗逻辑保持不变
- [x] 4.2 删除成功后，主动 `setExpandedId(null)`（关闭展开态）、`setExpandingMenuId(null)`（关闭菜单）

## 5. 多卡片切换

- [x] 5.1 验证：展开一张卡片后，点击另一张卡片的菜单「展开」，原卡片自动关闭，新卡片展开
