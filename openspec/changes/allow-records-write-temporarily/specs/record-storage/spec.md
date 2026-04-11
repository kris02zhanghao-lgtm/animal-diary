## MODIFIED Requirements

### Requirement: 保存偶遇记录
系统 SHALL 在识别成功后通过后端代理接口 `api/save-record` 将记录写入 Supabase `records` 表；前端 MUST NOT 直接调用 Supabase SDK 写入。

#### Scenario: 通过后端代理保存
- **WHEN** 用户点击"保存到日志"，前端已组装好 `image_base64` / `location` / `title` / `species` / `journal`
- **THEN** 前端向 `api/save-record` 发送 POST 请求，后端使用 service role key 写入 `records` 表并返回新记录

#### Scenario: 后端代理不可用
- **WHEN** `api/save-record` 返回非 2xx 响应或网络失败
- **THEN** 前端展示保存失败提示，保留当前识别/编辑结果不清空

### Requirement: 读取所有记录
系统 SHALL 通过后端代理接口 `api/list-records` 读取 Supabase `records` 表内容，并按 `created_at` 降序排列（最新在前）返回给前端。

#### Scenario: 首页加载
- **WHEN** 首页进入或刷新
- **THEN** 前端 GET `api/list-records`，后端返回完整记录数组，前端按季度分组渲染

#### Scenario: 无记录时读取
- **WHEN** `records` 表为空
- **THEN** 后端返回空数组，前端渲染空状态（松鼠 emoji + 引导文字）

### Requirement: 删除单条记录
系统 SHALL 通过后端代理接口 `api/delete-record` 按 id 删除 Supabase `records` 表中的记录。

#### Scenario: 用户确认删除
- **WHEN** 用户在底部确认弹窗点击"挥手道别"
- **THEN** 前端向 `api/delete-record` 发送待删除 id，后端执行删除并返回成功；前端从列表中移除该记录

#### Scenario: 删除失败
- **WHEN** `api/delete-record` 返回非 2xx 响应或网络失败
- **THEN** 前端展示删除失败提示，列表保持原样不移除该记录
