## MODIFIED Requirements

### Requirement: 展示历史记录列表
ListPage SHALL 从 localStorage 读取所有记录，按季度分组后以 Swiper coverflow 轮播展示卡片。每张卡片右上角 SHALL 有 ⋮ 菜单按钮，用户可通过菜单进行"展开、分享、删除"操作。

#### Scenario: 有记录时展示分组列表
- **WHEN** localStorage 中存在一条或多条记录
- **THEN** ListPage 按季度分组渲染 coverflow 轮播卡片，每张卡片右上角有 ⋮ 菜单按钮

#### Scenario: 无记录时展示空状态
- **WHEN** localStorage 中没有任何记录
- **THEN** 展示空状态提示（松鼠 emoji + 引导文字），不展示列表

#### Scenario: 删除记录后列表更新
- **WHEN** 用户通过菜单点击「删除」并确认删除
- **THEN** 记录从列表中移除，如果该卡片处于展开状态则自动关闭
