## Why

当前用户记录了有趣的偶遇，但没有便捷的方式分享给朋友。分享能力是社交产品的必需品，能扩大产品的口碑和用户增长。用户应该能一键生成漂亮的分享卡片，分享到朋友圈、小红书等社交平台。

## What Changes

- 在详情页和报告页新增「分享」按钮
- 点击分享后，生成包含照片、物种、地点、日期、日志的分享卡片
- 支持两种分享方式：
  1. **生成图片**：canvas 绘制分享卡片，支持下载或复制到剪贴板
  2. **复制文案**：生成文字版本的分享内容（如果图片生成失败时的降级方案）
- 分享卡片样式与产品风格保持一致（星露谷像素风、温暖色调）

## Capabilities

### New Capabilities
- `encounter-sharing`: 为偶遇记录生成和分享分享卡片的能力，支持图片生成和文案复制

### Modified Capabilities
- `detail-actions`: 详情页菜单需新增「分享」选项
- `report-page`: 报告页需支持单个物种卡片的分享

## Impact

**前端代码**：
- 新建 `src/utils/shareUtils.js`：分享卡片生成逻辑（canvas）
- 修改 `src/pages/DetailPage.jsx`：菜单新增分享选项
- 修改 `src/pages/ReportPage.jsx`：物种卡片新增分享按钮（可选）
- 修改菜单和操作栏 UI：添加分享图标和按钮

**外部依赖**：
- 无新增依赖，使用原生 HTML5 Canvas API

**浏览器能力**：
- 需要 Canvas API（所有现代浏览器支持）
- 可选：Clipboard API（用于一键复制，降级方案为手动复制）
