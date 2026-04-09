## 1. 清理默认内容

- [x] 1.1 清空 `src/App.jsx` 中的默认 Vite 模板代码
- [x] 1.2 清空或重置 `src/App.css`，移除默认样式

## 2. 搭建页面路由结构

- [x] 2.1 在 `src/App.jsx` 中用 `useState` 实现页面状态管理（默认值 `"list"`）
- [x] 2.2 根据状态条件渲染 `ListPage` 或 `NewEncounterPage`
- [x] 2.3 定义 `navigateTo` 函数并通过 props 传递给子页面

## 3. 创建 ListPage 组件

- [x] 3.1 创建 `src/pages/ListPage.jsx` 文件
- [x] 3.2 添加像素字体（引入 Google Fonts 的 Press Start 2P 或类似像素字体）
- [x] 3.3 实现页面标题"我的动物图鉴"，使用像素字体
- [x] 3.4 实现空状态区域（emoji 插图 + 提示文字）
- [x] 3.5 实现右下角固定浮动"+"圆形按钮，颜色为暖绿色
- [x] 3.6 设置页面背景色为 `#fffdf7`

## 4. 创建 NewEncounterPage 组件

- [x] 4.1 创建 `src/pages/NewEncounterPage.jsx` 文件
- [x] 4.2 实现顶部 header：左侧返回箭头按钮 + 居中标题"记录偶遇"
- [x] 4.3 实现图片上传区域（点击触发 file input）
- [x] 4.4 实现图片预览（使用 FileReader API 读取并显示所选图片）
- [x] 4.5 实现地点文字输入框
- [x] 4.6 实现"生成日志"暖绿色全宽按钮
- [x] 4.7 设置页面背景色为 `#fffdf7`

## 5. 样式细化

- [x] 5.1 动物卡片样式：`border: 3px solid #5a4a3a` + `box-shadow: 4px 4px 0px #5a4a3a`
- [x] 5.2 确认所有按钮、输入框使用圆角样式（rounded）
- [x] 5.3 验证移动端布局，确保内容区域不超出屏幕宽度
