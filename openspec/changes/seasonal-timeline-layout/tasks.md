## 1. 季度分组计算

- [x] 1.1 在 ListPage 中实现 `getSeasonLabel(date)` 函数：根据月份返回 `YYYY年春/夏/秋/冬`
- [x] 1.2 用 `useMemo` 将 records 聚合为 `{ seasonKey, label, items[] }[]`，按 seasonKey 倒序排列，组内保持原倒序

## 2. 安装 Swiper.js

- [x] 2.1 `npm install swiper` 安装依赖
- [x] 2.2 在 ListPage.jsx 顶部导入 Swiper 和样式：`import { Swiper, SwiperSlide } from 'swiper/react'` 和 `import 'swiper/css'`

## 3. 重构列表渲染

- [x] 3.1 将现有 `records.map(...)` 替换为分组渲染：外层遍历季度组，渲染分组标题 + Swiper 轮播容器
- [x] 3.2 Swiper 配置：coverflow 模式、`spaceBetween: 20`、`slidesPerView: 'auto'`、`centeredSlides: true`、rotate/scale 效果
- [x] 3.3 卡片样式（SwiperSlide 内）：固定宽度 260px，上方正方形图片（object-cover）、下方三行信息（🐾物种名 / 📍地点 / 日期）

## 4. 保留删除功能

- [x] 4.1 × 删除按钮保留在新卡片右上角，点击仍触发 `setConfirmingId`，删除确认弹窗逻辑不变

## 5. 顶部 tab 占位 UI

- [x] 5.1 在页面标题下方添加"时间线 / 图鉴"tab 行，使用暖色系样式，"时间线"默认激活（下划线/加粗），"图鉴"为非激活样式
- [x] 5.2 两个 tab 的 `onClick` 为空（不绑定任何事件）

## 6. 更新 PRD.md

- [x] 6.1 将 PRD.md 中 v0.4 改为"图鉴收集页（含首页时间线/图鉴 tab 切换）"，v0.5 改为"偶遇地图 + 自动定位"
