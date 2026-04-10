## 1. 修改 NewEncounterPage 状态流转

- [x] 1.1 将识别结果存入 `recognitionResult` state（`{ species, journal }`），识别成功后不再自动保存
- [x] 1.2 根据 `recognitionResult` 渲染可编辑区域：species 单行 input + journal 多行 textarea，预填 AI 返回值
- [x] 1.3 移除识别成功后的自动 saveRecord + navigateTo 调用

## 2. 实现手动保存

- [x] 2.1 添加「保存这次偶遇」按钮，仅在 `recognitionResult` 存在时显示
- [x] 2.2 点击保存时用当前 state 中的 species/journal 值调用 storageService.saveRecord()
- [x] 2.3 保存成功后调用 navigateTo('list')
- [x] 2.4 保存失败时展示"保存失败"提示，不跳转

## 3. species 非空校验

- [x] 3.1 species 输入框为空时禁用保存按钮（或保存时显示"动物种类不能为空"提示）
