## Why

当前记录的「地点」字段是纯文字，与地图坐标（latitude/longitude）彼此独立。用户事后想修改或补充定位时，只能编辑文字，坐标不会更新，导致地图上的 pin 位置对不上或缺失。需要一个能同时更新文字地名和 GPS 坐标的位置选择方式，支持自动定位（GPS）和手动搜索两种入口。

## What Changes

- 新建可复用 `LocationPicker` 组件，提供两种定位方式：
  - **GPS 自动定位**：调用浏览器 Geolocation，成功后逆地理编码为中文地名
  - **POI 搜索**：用户输入关键词，调用高德搜索 API，选择结果后自动填入地名和坐标
- 在卡片详情页（card-expand）集成 LocationPicker，允许对已有记录补充或修改定位
- 新建 `api/update-record.js` 后端接口，支持更新记录的任意字段（地名 + 坐标，供 v0.4.2 复用）
- 定位成功后同时写入：`location`（文字）、`latitude`、`longitude`（坐标）

## Capabilities

### New Capabilities

- `location-picker`: 可复用的位置选择组件，支持 GPS 自动定位和 POI 关键词搜索
- `record-update-api`: 后端 PUT 接口，更新已有记录的任意字段

### Modified Capabilities

- `record-list`: 详情视图新增「修改定位」入口，调用 LocationPicker

## Impact

- 新建 `src/components/LocationPicker.jsx`
- 修改 `src/pages/ListPage.jsx`：详情视图集成 LocationPicker
- 新建 `api/update-record.js`：PUT 接口，token 鉴权 + Supabase update
- 新增 `src/services/supabaseService.js` 的 `updateRecord` 函数
- 高德地图已接入（VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE），可直接使用搜索和逆地理编码 API
