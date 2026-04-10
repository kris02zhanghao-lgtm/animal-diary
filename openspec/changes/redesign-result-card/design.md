## Context

当前识别结果区域：绿色边框卡片，species 单行 input，journal 多行 textarea，底部一个「保存这次偶遇」按钮。需要全面重构为暖色系偶遇卡片，新增 title 字段（AI 生成），新增「分享发现」按钮。

## Goals / Non-Goals

**Goals:**
- aiService prompt 新增 title（10字以内小标题），返回 `{ title, species, journal }`
- 偶遇卡片：大标题（可编辑 input）+ 日志正文（可编辑 textarea）+ 底部三标签（种类/时间/地点，种类和地点可编辑）
- 两个操作按钮：「保存到日志」（现有保存逻辑）、「分享发现」（toast 提示"即将上线"）
- 暖色系卡片风格（米白/暖橙色调，有层次感）

**Non-Goals:**
- 不实现真实分享功能
- 不改变 storageService 底层逻辑，仅新增 title 字段透传
- 不改动列表页展示

## Decisions

**卡片视觉结构**
```
┌─────────────────────────────┐
│  [大标题 input，1行]          │  ← 暖色标题区，背景略深
│  时间自动填写（只读小字）      │
├─────────────────────────────┤
│  [日志 textarea，4-5行]      │  ← 白色/米白内容区
│                             │
├─────────────────────────────┤
│  🐾 [种类 input]  📍[地点 input]│  ← 标签行，内联可编辑
└─────────────────────────────┘
  [保存到日志]    [分享发现]
```

**title state 独立存储**
新增 `title` state，与 `species`/`journal` 并列，识别成功后填入 AI 返回值，用户可编辑，保存时随其他字段一起写入 storageService。

**分享按钮用简单 alert 实现 toast**
暂时用 `alert('即将上线，敬请期待！')` 实现，不引入 toast 库。后续有需求再替换。

**时间显示**
卡片标题区下方显示当前识别时间（`new Date()` 格式化为"YYYY年MM月DD日"），只读，不存入 state（保存时用 `new Date().toISOString()`）。

## Risks / Trade-offs

- [AI 不返回 title 或返回超长] → 解析时做保底：title 缺失则用 species 作为标题，超过 15 字则截断
- [旧数据无 title 字段] → ListPage 渲染时 title 为 undefined 不影响现有展示，兼容无需额外处理
