## Why

当前 UI 配色温暖但缺乏整体风格统一，参赛需要更高品质的视觉呈现。通过引入《动物森友会》游戏美学的设计系统（参考 Animal Island UI 的设计理念），建立完整的颜色、圆角、阴影、动画规范，提升整体质感。

## What Changes

- 所有页面改用新的色彩体系（米白背景、棕色文字、青绿主色等）
- 按钮、卡片、输入框、弹窗等组件统一应用 3D 按压效果（下方阴影）
- 优化圆角、间距、阴影的规范（参照 design.md）
- 添加悬停浮起、进场动画等交互细节
- 确保响应式设计在各屏幕尺寸正常显示

## Capabilities

### New Capabilities
- `ui-color-system`: 完整的色彩定义（主色、中性色、状态色）
- `button-components`: 按钮组件的统一样式（各类型、尺寸、状态）
- `card-components`: 卡片组件的统一样式（圆角、阴影、颜色变体）
- `input-components`: 输入框的统一样式（圆角、3D 效果、状态反馈）
- `modal-components`: 弹窗的统一样式（进场动画、布局、按钮）
- `interaction-animations`: 全局交互动画（悬停浮起、fade-in、zoom-in）
- `page-list-redesign`: 列表页的布局和样式升级
- `page-new-encounter-redesign`: 新建偶遇页的布局和样式升级

### Modified Capabilities
- `record-list`: 列表页卡片的样式改造（但数据逻辑不变）
- `new-encounter`: 新建页的组件样式改造（但业务逻辑不变）

## Impact

**修改文件**：
- `src/App.jsx`, `src/index.css` - 全局样式和变量
- `src/components/ListPage.jsx` - 列表页结构和样式
- `src/components/NewEncounterPage.jsx` - 新建页结构和样式
- `src/components/` 下的所有子组件

**无影响**：
- 业务逻辑（数据保存、读取、删除）完全不变
- AI 识别流程不变
- 后端 API 不变

**浏览器兼容性**：所有改动都在 CSS 和结构层面，不涉及新 API
