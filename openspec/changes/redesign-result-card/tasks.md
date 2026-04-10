## 1. 修改 aiService 新增 title 字段

- [x] 1.1 在 prompt 中新增 title 字段说明：10字以内的偶遇小标题，语气简练有趣
- [x] 1.2 更新 prompt 返回 JSON 格式为 `{ "title": "...", "species": "...", "journal": "..." }`
- [x] 1.3 函数返回值新增 title 字段；title 缺失时降级为 species 值

## 2. 更新 NewEncounterPage state

- [x] 2.1 新增 `title` state，识别成功后填入 AI 返回的 title（含降级逻辑）
- [x] 2.2 handleSave 中将 title 传入 saveRecord

## 3. 重构识别结果区域 UI

- [x] 3.1 移除原有绿色结果卡片，新建暖色系偶遇卡片容器
- [x] 3.2 卡片标题区：title 可编辑 input（大字加粗）+ 当前日期只读小字
- [x] 3.3 卡片内容区：journal 可编辑 textarea（4-5行）
- [x] 3.4 卡片底部标签行：🐾 species 可编辑 input + 📍 location 可编辑 input
- [x] 3.5 卡片下方两个按钮：「保存到日志」（主色调）+ 「分享发现」（次要样式）
- [x] 3.6 「分享发现」点击后 alert 提示"即将上线，敬请期待！"
- [x] 3.7 species 为空时「保存到日志」按钮禁用
