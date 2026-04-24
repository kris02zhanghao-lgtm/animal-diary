# Encounter Map with Emoji — Implementation Tasks

## 1. 数据准备：坐标字段

- [x] 1.1 在 Supabase records 表中新增 latitude 和 longitude 列（float8，允许 null）
- [x] 1.2 更新 api/save-record.js，接收并保存 latitude、longitude 字段
- [x] 1.3 更新 api/list-records.js，在返回字段中包含 latitude 和 longitude
- [x] 1.4 更新 supabaseService.js 中 saveRecord 的调用方，传入坐标参数

## 2. AnimalEmojiMapper 模块

- [x] 2.1 创建 src/utils/animalEmojiMapper.js，实现三级查找（L1精确/L2关键词/L3兜底）
- [x] 2.2 填充 L1 精确匹配表（参考 spec：猫类、狗类、鸟类、啮齿类等 20+ 种类）
- [x] 2.3 填充 L2 关键词匹配表（猫/狗/鸟/鱼等通用关键词）
- [x] 2.4 导出 getEmojiForSpecies(species) 函数
- [x] 2.5 本地测试：验证橘猫→🐱、无法识别→❓

## 3. 自动定位功能

- [x] 3.1 在 NewEncounterPage.jsx 中，页面加载时调用 navigator.geolocation.getCurrentPosition()
- [x] 3.2 新增 geoStatus state（'idle' | 'loading' | 'success' | 'denied'）
- [x] 3.3 新增 coordinates state（{ lat, lng } 或 null）
- [x] 3.4 geoStatus=loading 时，在 location 字段区域显示"定位中..."提示
- [x] 3.5 geoStatus=success 时，显示"📍 已自动定位"badge（不自动填充文字地点，仅存坐标）
- [x] 3.6 geoStatus=denied 时，显示"无法获取位置，请手动输入"提示
- [x] 3.7 在 handleSave 中，将 coordinates 传给 saveRecord

## 4. 底部导航栏（Bottom Tab Bar）

- [x] 4.1 创建 src/components/BottomTabBar.jsx，实现四个 Tab：时间线 / 地图 / ➕ / 图鉴
- [x] 4.2 ➕ 按钮样式突出（圆形、主色背景），其余 Tab 图标 + 文字
- [x] 4.3 图鉴 Tab 点击时显示 toast "即将上线，敬请期待"
- [x] 4.4 改造 App.jsx：新增 activePage state，根据 activePage 渲染不同视图
- [x] 4.5 ListPage.jsx 移除原有浮动「+」按钮（由 BottomTabBar 替代）
- [x] 4.6 ListPage.jsx 移除原有顶部 Tab 栏（时间线 / 图鉴占位）

## 5. MapView 组件 - 基础地图

- [ ] 5.1 创建 src/components/MapView.jsx
- [ ] 5.2 在 index.html 中通过 CDN 加载高德地图 JS API v2（需申请 Key）
- [ ] 5.3 CLAUDE.md / .env 记录高德 AMAP_KEY 变量
- [ ] 5.4 MapView 组件挂载时初始化高德地图实例（useEffect）
- [ ] 5.5 地图销毁时清理实例（useEffect cleanup）
- [ ] 5.6 地图容器高度：占满剩余视口高度（calc(100vh - header - tab)）

## 6. MapView 组件 - Emoji 标记渲染

- [ ] 6.1 MapView 接收 records props，过滤出有 latitude/longitude 的记录
- [ ] 6.2 对每条记录调用 getEmojiForSpecies 获取 emoji，创建自定义 AMap.Marker
- [ ] 6.3 实现自定义 Marker HTML（div + emoji 大字，40px 以上触摸目标）
- [ ] 6.4 所有 marker 渲染后，调用地图 fitView 自动缩放适配
- [ ] 6.5 无记录时，显示占位提示文字在地图上方

## 7. Marker 点击展开详情

- [ ] 7.1 MapView 新增 selectedRecord state
- [ ] 7.2 点击 marker 时，更新 selectedRecord 为对应记录
- [ ] 7.3 selectedRecord 不为 null 时，在地图上方（或底部 sheet）显示简易详情卡片
- [ ] 7.4 详情卡片内容：物种 emoji + 名称、地点、日期、缩略图（max-h-32）
- [ ] 7.5 详情卡片有关闭按钮或点击遮罩关闭

## 8. 测试与调试

- [ ] 8.1 测试 PC 浏览器：地图渲染、marker 展示、点击详情
- [ ] 8.2 测试移动端：地图触摸缩放、marker 可点击
- [ ] 8.3 测试定位权限：首次询问、拒绝、允许三种场景
- [ ] 8.4 测试无记录时地图空状态
- [ ] 8.5 测试 emoji 映射：至少验证 5 种不同物种的映射结果

## 9. 收尾

- [ ] 9.1 更新 progress.md 记录 v0.4 完成
- [ ] 9.2 git commit 所有改动
- [ ] 9.3 部署到 Vercel 并线上验证地图正常加载
