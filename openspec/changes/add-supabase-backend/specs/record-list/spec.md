## MODIFIED Requirements

### Requirement: 从 Supabase 读取并展示历史记录列表
ListPage SHALL 从 Supabase 读取当前用户的所有记录并以卡片形式展示，每张卡片显示动物图片、物种名、地点、日志和时间。

#### Scenario: 有记录时展示
- **WHEN** ListPage 加载，Supabase 中存在该用户一条或多条记录
- **THEN** ListPage 渲染对应数量的记录卡片，按季度分组，最新记录排在前

#### Scenario: 无记录时展示空状态
- **WHEN** ListPage 加载，Supabase 中不存在该用户的记录
- **THEN** 展示空状态提示（松鼠 emoji + 引导文字），不展示卡片列表

#### Scenario: 多用户隔离
- **WHEN** 用户 A 和用户 B 分别打开列表页
- **THEN** 用户 A 只看到自己的记录，用户 B 只看到自己的记录（Supabase RLS 保证）

#### Scenario: 实时同步
- **WHEN** 在另一设备或浏览器标签页新建记录
- **THEN** 本标签页的列表可手动刷新后看到新记录（或可选启用 Realtime 自动更新）

### Requirement: 删除单条记录
用户 SHALL 能在列表中删除任意一条记录，删除后列表实时更新。

#### Scenario: 删除一条记录
- **WHEN** 用户点击某条记录的菜单「删除」并确认
- **THEN** 该记录从 Supabase 删除，列表立即更新，删除的记录消失

#### Scenario: 删除后为空
- **WHEN** 用户删除最后一条记录
- **THEN** 列表切换为空状态展示

#### Scenario: 删除失败处理
- **WHEN** Supabase 删除失败（网络错误、权限问题）
- **THEN** 系统展示错误提示，记录仍保留在列表中

### Requirement: 卡片展开查看完整内容
用户 SHALL 能点击列表中的卡片，展开为全屏详情视图查看大图和完整日志。

#### Scenario: 点击卡片展开
- **WHEN** 用户点击某条记录卡片右上角菜单的「展开」
- **THEN** 系统隐藏列表，展示该记录的全屏详情视图（大图、完整日志、物种/地点/日期）

#### Scenario: 返回列表
- **WHEN** 用户在详情视图点击左上角「←」返回按钮
- **THEN** 系统隐藏详情视图，显示列表

#### Scenario: 从详情视图删除
- **WHEN** 用户在详情视图菜单点击「删除」并确认
- **THEN** 记录被删除，系统自动关闭详情视图，返回列表
