## Context

项目已接入高德地图 JS API v2（VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE）。MapView 组件内已有地图实例和 marker 渲染。新建偶遇页已有 GPS 自动定位逻辑，但只存坐标、不做逆地理编码，也不支持搜索。详情页目前完全只读。后端已有 save/list/delete 三条代理链路，token 鉴权逻辑在 save-record.js 中，可直接复用。

## Goals / Non-Goals

**Goals:**
- 封装可复用 `LocationPicker` 组件，在详情页集成
- GPS 定位后自动逆地理编码为中文地名（如"朝阳区建国路"）
- POI 搜索：输入关键词 → 候选列表 → 点选后填入地名 + 坐标
- 新建后端接口 `api/update-record.js`，供本次和 v0.4.2 复用

**Non-Goals:**
- 不在 MapView 地图页内内嵌搜索框（那是地图查看页，不是编辑页）
- 不支持拖拽地图 pin 来选点（复杂度过高，当前用户量不需要）
- 不修改新建偶遇页的定位逻辑（那里已有 GPS，可后续单独升级）

## Decisions

**决策 1：LocationPicker 的 UI 形态**
采用「底部弹出面板（bottom sheet）」，内含两个 tab：
- 「自动定位」：一个按钮 + 状态文字，点击触发 GPS
- 「搜索地点」：输入框 + 结果列表（最多显示 5 条）

理由：底部面板在手机端体验好，不遮挡主内容；两个 tab 让用户自主选择方式。

**决策 2：高德 API 调用方式**
直接在前端调用高德 JS API（已加载）：
- 逆地理编码：`AMap.Geocoder.getAddress(lnglat)`
- POI 搜索：`AMap.PlaceSearch.search(keyword)`

理由：高德 Key 已在前端暴露（VITE_ 前缀），增加后端代理无收益；高德 JS API 的 Key 本来就是公开的（通过域名白名单控制滥用），这是官方推荐的用法。

**决策 3：后端 update-record.js 接口设计**
PUT `/api/update-record`，body: `{ id, ...fields }`，只更新传入的字段（partial update）。
理由：v0.4.1 只更新 location/latitude/longitude，v0.4.2 还会更新 title/species/journal；用同一个接口做 partial update 可避免重复建接口。

**决策 4：逆地理编码结果处理**
优先用「区县 + 街道」格式（如"朝阳区建国路"），若失败则显示「已定位（坐标：xxx,xxx）」作为兜底文字。
理由：比经纬度数字对用户更友好，比完整地址更简洁。

## Risks / Trade-offs

- [高德 POI 搜索限速] 用户快速输入时触发多次请求 → 加 300ms debounce 防抖
- [GPS 权限已拒绝] 用户之前拒绝过定位权限 → 显示提示引导去系统设置开启，不静默失败
- [逆地理编码失败] 网络问题或高德 API 异常 → 兜底显示坐标字符串，不阻塞保存
