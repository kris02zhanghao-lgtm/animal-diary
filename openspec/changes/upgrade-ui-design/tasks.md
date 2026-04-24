# UI Upgrade Implementation Tasks

## 1. Global Styles Setup

- [x] 1.1 在 src/index.css 中定义颜色 CSS 变量（主色、中性色、状态色）
- [x] 1.2 在 src/index.css 中定义圆角、间距、阴影变量
- [x] 1.3 在 src/index.css 中定义动画关键帧（fade-in, zoom-in, spin）
- [x] 1.4 设置全局字体、行高、背景色
- [x] 1.5 定义 3D 按压效果的通用样式规则

## 2. Button Component Styling

- [x] 2.1 改造 Button 组件的基础样式（圆角 50px、高度、内间距）
- [x] 2.2 实现 Button 的 3D 按压效果（box-shadow 默认/悬停/激活）
- [x] 2.3 应用 Button 的颜色变体（primary/default/danger/text）
- [x] 2.4 实现 Button 的悬停浮起动画（translateY(-2px)）
- [x] 2.5 测试 Button 的所有尺寸和类型组合

## 3. Card Component Styling

- [x] 3.1 改造 Card 的基础样式（圆角 20px、背景、阴影）
- [x] 3.2 实现 Card 的悬停浮起效果（translateY(-4px)）
- [x] 3.3 应用 Card 的颜色变体（如需要）
- [x] 3.4 设置 Card 标题的特殊圆角样式
- [x] 3.5 测试 Card 的响应式布局

## 4. Input Component Styling

- [x] 4.1 改造 Input 的基础样式（圆角 50px、边框、阴影）
- [x] 4.2 实现 Input 的 3D 效果（box-shadow）
- [x] 4.3 应用 Input 的状态样式（error/warning/disabled）
- [x] 4.4 优化 placeholder、前缀、后缀的样式
- [x] 4.5 实现清除按钮的样式和交互
- [x] 4.6 测试 Input 在各尺寸下的显示

## 5. Modal Component Styling

- [x] 5.1 改造 Modal 蒙层样式（背景颜色、进场动画）
- [x] 5.2 改造 Modal 内容区样式（背景、圆角、内间距）
- [x] 5.3 实现 Modal 的 zoom-in + fade-in 进场动画
- [x] 5.4 改造 Modal 头部（标题、关闭按钮）
- [x] 5.5 改造 Modal 底部按钮组（颜色、布局、悬停）
- [x] 5.6 测试 Modal 在移动端的显示

## 6. List Page Redesign

- [x] 6.1 改造 ListPage 的整体背景和布局
- [x] 6.2 改造 ListPage 的头部（标题、tab 栏）
- [x] 6.3 应用新的季度分组标题样式
- [x] 6.4 应用新的卡片样式到列表中
- [x] 6.5 改造空状态的样式（松鼠emoji、文字、按钮）
- [x] 6.6 改造删除确认弹窗的样式（应用新的 Modal 样式）
- [x] 6.7 测试列表页的全部交互（点击、删除、返回）

## 7. New Encounter Page Redesign

- [x] 7.1 改造 NewEncounterPage 的整体背景和布局
- [x] 7.2 改造页面头部（返回按钮、标题）
- [x] 7.3 改造图片上传区域的样式（背景、圆角）
- [x] 7.4 改造 AI 生成按钮的样式（应用新 Button 样式）
- [x] 7.5 改造结果卡片的样式（应用新 Card 样式）
- [x] 7.6 改造表单字段的样式（应用新 Input 样式）
- [x] 7.7 改造底部按钮组（保存/分享，颜色、布局）
- [x] 7.8 实现表单字段禁用状态的正确样式
- [x] 7.9 测试新建页的全部流程（上传→生成→编辑→保存）

## 8. Animation and Interaction Polish

- [x] 8.1 审查所有悬停效果是否应用了浮起动画
- [x] 8.2 审查所有加载状态是否有旋转动画
- [x] 8.3 确保所有动画使用统一的缓动函数和时长
- [x] 8.4 测试动画在低端设备上的性能（是否卡顿）
- [x] 8.5 优化动画性能（如需要，禁用某些动画测试）

## 9. Responsive Design Verification

- [x] 9.1 测试移动端（375px）布局是否正确
- [x] 9.2 测试平板端（768px）布局是否正确
- [x] 9.3 测试桌面端（1440px）布局是否正确
- [x] 9.4 检查卡片、按钮、输入框在各屏幕尺寸的显示
- [x] 9.5 确保触摸目标大小足够（移动端）

## 10. Cross-browser Testing

- [x] 10.1 在 Chrome 上测试所有页面和交互
- [x] 10.2 在 Firefox 上测试样式兼容性
- [x] 10.3 在 Safari 上测试样式兼容性（特别是阴影、圆角）
- [x] 10.4 检查 box-shadow 在所有浏览器的显示效果
- [x] 10.5 检查动画在所有浏览器的流畅度

## 11. Functional Testing

- [x] 11.1 验证上传照片→AI 生成→保存的全流程
- [x] 11.2 验证列表页的卡片点击展开详情
- [x] 11.3 验证删除流程（点击删除→确认→删除成功）
- [x] 11.4 验证表单编辑功能（修改物种/日志→保存）
- [x] 11.5 验证空状态的「新建」按钮跳转到新建页

## 12. Final Review and Deployment

- [x] 12.1 全页面截图对比（新旧样式）
- [x] 12.2 检查是否有遗漏的组件或样式不一致
- [x] 12.3 运行 npm run build 确保无编译错误
- [x] 12.4 提交 git commit（所有样式改动）
- [x] 12.5 推送到 main 分支
- [x] 12.6 在 Vercel 线上验证部署成功和样式显示正确
