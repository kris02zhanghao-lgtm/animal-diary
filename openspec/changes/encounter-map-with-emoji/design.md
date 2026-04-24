## Context

当前应用已完成 v0.3：用户可以记录偶遇、编辑日志、查看列表（按季度分组）。每条记录包含 location 字段（文字形式），但缺乏地理可视化。用户需要看到自己的偶遇在城市中的分布，感受"城市动物地图"在成长。同时新建偶遇时手动输入地点成为摩擦点，自动定位可以显著降低这个门槛。

## Goals / Non-Goals

**Goals:**
1. 实现地图视图，用 emoji 标记每次偶遇的位置
2. emoji 与识别的动物种类自动对应，具体种类（如"橘猫"）映射到具体 emoji，无法精确匹配时降级到通用分类（如"猫"）
3. 新建偶遇时自动获取用户当前位置，允许手动修改
4. 点击地图上的 emoji 展开偶遇详情
5. 引入底部导航栏（Bottom Tab Bar），地图、时间线、图鉴作为同级独立入口

**Non-Goals:**
- 不做地点搜索、地址反地理编码
- 不做高级地图功能（热力图、聚类、路线规划）
- 不做位置历史轨迹
- 不做权限持久化（地理位置权限弹窗每次都可能出现）

## Decisions

### 1. 地图库选择：高德 Map JS API（而非 Mapbox）

| 维度 | 高德 | Mapbox |
|------|------|--------|
| 国内加载速度 | ✅ 快（国内 CDN） | ❌ 可能被墙 |
| 学习成本 | ✅ 中文文档完善 | ❌ 英文，学习曲线陡 |
| 自动定位集成 | ✅ 有专用 plugin | ❌ 需自己集成 |
| 价格 | ✅ 免费额度充足 | ❌ 需付费 |
| 样式定制 | ❌ 有限 | ✅ 极灵活 |

**选择理由**：项目目标是给国内普通用户用，高德性价比最优。定位需求简单，不需要 Mapbox 的极致定制能力。

### 2. Emoji 映射方案：静态对照表 + 降级策略

实现 AnimalEmojiMapper.js，维护动物种类 → emoji 的映射表。

**映射层级**：
- **L1（具体种类）**：橘猫 → 🐱、奶牛猫 → 🐱、黑猫 → 🐱（都是猫，同一 emoji），山雀 → 🐦、喜鹊 → 🐦
- **L2（通用分类）**：猫 → 🐱、狗 → 🐶、鸟 → 🐦、松鼠 → 🐿️、兔子 → 🐰
- **L3（兜底）**：无法识别 → ❓

**实现**：
```js
// AnimalEmojiMapper.js
const SPECIES_TO_EMOJI = {
  '橘猫': '🐱', '奶牛猫': '🐱', '黑猫': '🐱', '虎斑猫': '🐱',
  '山雀': '🐦', '喜鹊': '🐦', '乌鸦': '🐦',
  '松鼠': '🐿️', '兔子': '🐰', '刺猬': '🦔',
  // ...
}

const CATEGORY_TO_EMOJI = {
  '猫': '🐱', '狗': '🐶', '鸟': '🐦', '啮齿': '🐿️'
  // ...
}

export function getEmojiForSpecies(species) {
  return SPECIES_TO_EMOJI[species] 
    || CATEGORY_TO_EMOJI[extractCategory(species)]
    || '❓'
}
```

**为什么不调用 AI 动态匹配 emoji**：API 调用成本和延迟太高，不值得。静态表维护成本低，可以随用户反馈逐步完善。

### 3. 浏览器定位权限处理

使用 Geolocation API，自动请求权限（首次新建偶遇时）。

**流程**：
- 用户点「新建偶遇」→ 后台触发 `navigator.geolocation.getCurrentPosition()`
- 浏览器弹窗："动物偶遇图鉴请求访问你的位置"
- 用户允许 → 获取 { latitude, longitude } → 反地理编码为"文字地点"（高德 API）
- 用户拒绝 → 地点字段为空，用户手动输入
- 用户已授权 → 无弹窗，直接获取位置

**兼容性**：
- ✅ PC Chrome/Firefox/Safari：完全支持
- ✅ 移动 iOS Safari/Chrome：支持但需 HTTPS（Vercel 已支持）
- ⚠️ 微信/QQ 内置浏览器：受限，可能无法获取

### 4. 导航架构：底部 Tab Bar（方案 A）

放弃原有的顶部 Tab 切换，改为 App 级底部导航栏（Bottom Tab Bar）。

**布局：**
```
[🕐 时间线]  [🗺️ 地图]  [➕]  [📖 图鉴]
```

- **时间线**：默认激活，即原 ListPage 季度分组视图
- **地图**：v0.4 新增，MapView 组件
- **➕**：居中突出，点击跳转新建偶遇页，替代原有浮动按钮
- **图鉴**：v0.5 实现，v0.4 阶段点击显示"即将上线"

**为什么选底部导航而非顶部 Tab：**
- 三个内容入口层级相同，不相互从属，顶部 Tab 会让地图像是时间线的"子视图"
- 底部导航符合移动端主流交互范式（微信、Instagram 等）
- ➕ 放中间位置更突出，核心操作更易触达
- 扩展性强，v0.5 图鉴接入无需重构导航

**实现方式：**

在 App.jsx 中抽出底部导航栏，通过 `activePage` state 控制渲染哪个视图。

```jsx
// App.jsx
const [activePage, setActivePage] = useState('timeline') // 'timeline' | 'map' | 'new' | 'field-guide'

return (
  <>
    {activePage === 'timeline' && <ListPage />}
    {activePage === 'map' && <MapPage />}
    {activePage === 'new' && <NewEncounterPage onBack={() => setActivePage('timeline')} />}
    <BottomTabBar active={activePage} onChange={setActivePage} />
  </>
)
```

原 ListPage 中的浮动「+」按钮移除，由 BottomTabBar 的中间按钮承担。

### 5. 地图标记点击展开详情

点击 marker emoji → 显示该记录的卡片（用现有的展开态组件复用）。

## Risks / Trade-offs

| 风险 | 影响 | 缓解方案 |
|------|------|---------|
| **位置权限弹窗频繁** | 用户烦躁 | 只在新建时请求，不在首页自动弹。记住用户选择，但浏览器会定期重置权限状态 |
| **Emoji 映射不准** | 用户看到"❓" | 可接受，提醒用户手动修改物种名字以命中映射表 |
| **高德 API 反地理编码费用** | 可能产生费用 | 目前用量低，先不用。改用硬编码或用户手动输入地点名 |
| **移动端地图缩放困难** | 小屏幕用户体验差 | 默认自适应显示所有 marker，用户可手动缩放 |
| **地图库加载时间** | 首次打开地图卡顿 | CDN 加载，通常 < 1s。可加 loading 骨架屏 |

## Migration Plan

**阶段 1：开发（本地环境）**
- 集成高德地图库（CDN）
- 实现 MapView 组件和 AnimalEmojiMapper
- 实现 Geolocation 和位置输入
- ListPage Tab 切换逻辑

**阶段 2：测试（本地 + dev 环境）**
- 多浏览器测试（Chrome、Firefox、Safari、移动浏览器）
- 权限场景测试：首次询问、已拒绝、已允许
- 地图渲染性能测试（百个 marker）

**阶段 3：部署（Vercel）**
- 部署到生产环境
- 验证高德库加载正常
- 验证 Geolocation HTTPS 正常工作

**回滚**：若高德 API 不稳定，可在 ListPage 隐藏地图 tab 并降级到时间线视图。

## Open Questions

1. **反地理编码用高德 API 还是用户手动输入？**
   - 当前方案：用户手动输入（更简单、无 API 成本）
   - 讨论点：若要自动化，需评估高德 API 费用
   
2. **emoji 映射表的初始内容有多全？**
   - 当前计划：覆盖常见的 20+ 物种分类
   - 后续可根据用户识别的物种逐步补充

3. **地图上同一位置多条记录如何处理？**
   - 当前：显示多个独立 marker，点击任意一个
   - 未来可考虑聚类或列表展开
