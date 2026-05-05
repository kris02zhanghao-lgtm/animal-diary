## 1. 前端状态管理改造

- [x] 1.1 修改 `NewEncounterPage.jsx`，新增 `recognitionFailed` boolean 状态，标记当前是否处于识别失败状态
- [x] 1.2 修改 `recognizeAnimal()` 调用的 catch 块，设置 `recognitionFailed = true` 而非直接显示错误提示
- [x] 1.3 新增识别失败时的错误消息状态 `recognitionError`，存储失败原因供显示

## 2. 卡片显示逻辑改造

- [x] 2.1 修改 `NewEncounterPage.jsx` 的条件渲染，使得识别失败时仍显示 `EncounterResultCard` 组件
- [x] 2.2 向 `EncounterResultCard` 新增 `isFailed` prop，接收识别是否失败的标记
- [x] 2.3 修改 `EncounterResultCard.jsx`，当 `isFailed=true` 时：
  - title/journal/species/location 输入框初值为空（覆盖 AI 返回值逻辑）
  - species input placeholder 改为 "AI识别失败，请输入物种"
  - 卡片顶部或物种区域增加 "⚠️ 手动填充" 标签

## 3. 错误提示展示

- [x] 3.1 在 `NewEncounterPage.jsx` 中，于「AI帮我生成」按钮下方新增错误信息区域
- [x] 3.2 错误提示内容为 "❌ AI识别失败，请手动补充"，样式为红色/警示色，但不遮挡卡片
- [x] 3.3 点击「重新生成」时，清空旧的错误提示，显示新的识别中状态

## 4. 保存逻辑调整

- [x] 4.1 修改 `NewEncounterPage.jsx` 中的保存逻辑，确保识别失败时也允许调用 save-record API
- [x] 4.2 保存时向后端传递所有已填字段（即使来自失败卡片），后端正常保存
- [x] 4.3 保存按钮的禁用逻辑维持现状：species 非空时启用（无需特殊处理）

## 5. 重新生成流程优化

- [x] 5.1 修改「重新生成」按钮逻辑，点击时清空 `recognitionFailed` 状态，设置 loading 状态
- [x] 5.2 若重新识别成功，更新 `recognitionFailed = false`，卡片恢复展示 AI 返回内容
- [x] 5.3 若重新识别仍失败，保持或恢复失败提示，允许用户继续手动编辑

## 6. 代码质量验证

- [x] 6.1 运行 `npm run lint` 检查新增代码是否符合 ESLint 规则
- [x] 6.2 运行 `npm run build` 确保打包成功，无类型或编译错误
- [x] 6.3 代码审视：确保没有遗留的 `console.log` 或调试代码

## 7. 浏览器功能测试

- [ ] 7.1 在开发环境模拟网络错误（F12 Network 勾选 offline 或降速），上传照片点击「AI帮我生成」，验证识别失败卡片显示
- [ ] 7.2 在失败卡片中手动填充 species/journal，点击「保存到日志」，验证保存成功并跳回列表页
- [ ] 7.3 在失败卡片中点击「重新生成」，恢复网络后，验证识别成功卡片显示（AI 返回值覆盖手填内容）
- [ ] 7.4 验证保存成功的手填记录出现在列表页，数据完整无误
- [ ] 7.5 在不同网络条件下（如 API 超时）重复测试，确保稳定性

## 8. 集成测试与部署

- [ ] 8.1 完成所有功能测试后，提交 git commit
- [x] 8.2 更新 progress.md，记录本轮完成的识别失败兜底功能
- [ ] 8.3 部署至 Vercel，验证生产环境表现（可选：模拟部分用户识别失败场景）
