## ADDED Requirements

### Requirement: GPS 自动定位并逆地理编码
LocationPicker 组件 SHALL 提供「自动定位」功能，调用浏览器 Geolocation 获取坐标后，通过高德 Geocoder 逆地理编码为中文地名，同时返回地名和坐标。

#### Scenario: GPS 定位成功
- **WHEN** 用户在 LocationPicker 内点击「自动定位」按钮且浏览器有定位权限
- **THEN** 按钮显示「定位中...」，成功后地名输入框填入逆地理编码结果（如「朝阳区建国路」），坐标同步更新

#### Scenario: GPS 权限被拒绝
- **WHEN** 用户点击「自动定位」但浏览器定位权限被拒绝
- **THEN** 显示「位置权限已拒绝，请在系统设置中开启」提示，不静默失败

#### Scenario: 逆地理编码失败兜底
- **WHEN** GPS 定位成功但高德逆地理编码 API 返回失败
- **THEN** 地名显示「已定位」，坐标仍正常写入，不阻塞后续保存

### Requirement: POI 关键词搜索选点
LocationPicker 组件 SHALL 提供搜索输入框，用户输入关键词后，调用高德 PlaceSearch 显示最多 5 条候选结果，用户点选后填入地名和坐标。

#### Scenario: 搜索有结果
- **WHEN** 用户在搜索框输入关键词且停止输入 300ms 后
- **THEN** 下方展示最多 5 条 POI 候选结果（名称 + 地址）

#### Scenario: 点选搜索结果
- **WHEN** 用户点击某条搜索结果
- **THEN** 地名填入该 POI 名称，坐标写入该 POI 的经纬度，搜索列表关闭

#### Scenario: 搜索无结果
- **WHEN** 用户输入关键词后高德 API 返回空列表
- **THEN** 显示「未找到相关地点，请尝试其他关键词」提示

### Requirement: 位置选择结果回调
LocationPicker 组件 SHALL 通过 `onConfirm({ location, latitude, longitude })` 回调将选中结果传给父组件，调用方负责将结果保存到数据库。

#### Scenario: 确认选择位置
- **WHEN** 用户通过 GPS 或搜索选定位置后点击「确认」
- **THEN** 触发 onConfirm 回调，传入 location（文字）、latitude、longitude 三个字段

#### Scenario: 取消选择
- **WHEN** 用户关闭 LocationPicker 面板但未确认
- **THEN** 不触发 onConfirm，父组件数据不变
