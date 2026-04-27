## 1. 后端更新接口

- [x] 1.1 新建 `api/update-record.js`，接受 PUT 请求，参数：`{ id, ...fields }`（partial update）
- [x] 1.2 用 `Authorization: Bearer <token>` 初始化 Supabase 客户端（复用 save-record.js 的 token 验证方式）
- [x] 1.3 校验 body 中必须有 id，否则返回 400
- [x] 1.4 执行 Supabase update，条件 `id = req.body.id`，只更新传入字段
- [x] 1.5 返回 `{ success: true }` 或错误信息

## 2. 前端服务层

- [x] 2.1 在 `src/services/supabaseService.js` 新增 `updateRecord(id, fields)` 函数，调用 `PUT /api/update-record`，带 Authorization header

## 3. LocationPicker 组件

- [x] 3.1 新建 `src/components/LocationPicker.jsx`，底部弹出面板结构，含「自动定位」和「搜索地点」两个 tab
- [x] 3.2 实现「自动定位」tab：调用 `navigator.geolocation.getCurrentPosition()`，成功后用高德 `AMap.Geocoder` 逆地理编码为中文地名
- [x] 3.3 处理 GPS 权限拒绝：显示引导去系统设置开启的提示
- [x] 3.4 逆地理编码失败兜底：地名显示「已定位」，坐标仍正常保存
- [x] 3.5 实现「搜索地点」tab：输入框 + 300ms debounce + 调用 `AMap.PlaceSearch` 显示最多 5 条候选结果
- [x] 3.6 点选搜索结果后填入地名和坐标，关闭候选列表
- [x] 3.7 实现「确认」按钮，触发 `onConfirm({ location, latitude, longitude })` 回调
- [x] 3.8 实现关闭/取消逻辑，不触发 onConfirm

## 4. 详情页集成

- [x] 4.1 在 `ListPage.jsx` 详情视图中新增「修改定位」按钮
- [x] 4.2 点击按钮弹出 LocationPicker 面板
- [x] 4.3 LocationPicker onConfirm 触发后，调用 `updateRecord(id, { location, latitude, longitude })`
- [x] 4.4 保存成功后更新 expandedRecord 本地 state，调用 fetchRecords 刷新列表

## 5. 测试与验收

- [x] 5.1 手机端测试：GPS 定位 → 逆地理编码 → 确认保存 → 地图 marker 位置更新
- [x] 5.2 测试 POI 搜索：输入关键词 → 选择结果 → 确认保存
- [x] 5.3 测试 GPS 权限拒绝场景：显示正确提示
- [x] 5.4 测试取消/关闭面板：原有数据不变

## 6. 收尾

- [x] 6.1 更新 progress.md 记录 v0.4.1 完成
- [x] 6.2 git commit 所有改动
- [x] 6.3 部署 Vercel 并线上验证
