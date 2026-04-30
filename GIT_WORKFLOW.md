# Git 工作流规范

## Commit 时机（必须等待 kris 明确确认）

1. **开发完成** → 本地 `vercel dev` 测试通过
2. **报告状态** → 告诉 kris："完成了，改了这些文件：xxx"
3. **等待验收** → kris 在手机上真机验收（测试功能、检查UI、找bug）
4. **验收通过** → kris 明确说"可以commit了" 或 "验收通过"
5. **才能 commit** → 此时执行 git 命令

**❌ 禁止行为：**
- 不能自动 commit（kris 没有明确说通过就别动）
- 不能"为了加快速度"跳过验收阶段
- 不能修改后直接 push，必须等确认

---

## Commit Message 格式

每个版本都有固定的 commit 格式，方便日后查阅：

### 单个功能版本

```
feat: v0.X 功能名称（中文）

- 改了哪些文件或模块（简单列举）
```

**例子：**
```
feat: v0.6 偶遇报告功能

- 新增 ReportPage.jsx 展示年度/季度总结
- 新增 reportService.js 数据聚合逻辑
- 修改 BottomTabBar.jsx 添加报告tab
- 修改 App.jsx 集成报告页面
```

### 多个功能合并版本

```
feat: v0.6 v0.7 偶遇报告+分享功能

- 新增 ReportPage.jsx（v0.6 报告）
- 新增 reportService.js（v0.6 数据聚合）
- 新增 ShareModal.jsx（v0.7 分享弹窗）
- 新增 shareUtils.js（v0.7 Canvas卡片生成）
- 修改 BottomTabBar.jsx（添加报告tab）
- 修改 DetailPage.jsx（集成分享功能）
- 修改 App.jsx（路由集成）
```

---

## Commit 后的步骤

### 1. 更新 progress.md

在 commit 之前或之后，**必须**更新 progress.md：

```
在"当前状态"部分改成新版本
列出新增的功能、修复的bug
更新"已完成"和"下一步"部分
```

### 2. 检查 commit 是否成功

```bash
git log --oneline -3  # 看最近的3条 commit，确认你的在最上面
```

### 3. 推送到远程

```bash
git push origin master
```

确保没有冲突错误。如果有冲突，见下面的"异常处理"。

### 4. 等待 Vercel 自动部署

- push 后，Vercel 会自动检测到新 commit
- 在 Vercel Dashboard 可以看到"Deployment in Progress"
- 大约 1-2 分钟后部署完成，显示 "Ready"

### 5. 验证线上版本

- 部署完成后，访问 live URL（例如 https://animal-diary-xxx.vercel.app）
- 在真实的线上环境测试一遍功能
- 确保没有因为线上配置导致的问题

### 6. 报告 kris

```
部署完成了，live URL: https://xxx.vercel.app
已验证 v0.6 和 v0.7 功能正常
```

---

## 异常情况处理

### Q1：commit 后发现代码有问题，怎么办？

❌ **不要用这些：**
- `git reset --hard`（破坏性太强，会丢失代码）
- `git revert`（太复杂）

✅ **正确做法：**
1. 修复问题
2. 再 commit 一次
3. 再 push

**例子：**
```bash
# 修复报告页的空状态文案
git add .
git commit -m "fix: v0.6 修复报告页空状态文案"
git push origin master
```

### Q2：push 失败，说有冲突，怎么办？

1. 运行 `git pull` 先拉最新代码
2. 解决冲突（如果有的话）
3. 再 `git push`
4. 如果不会解决，告诉 kris

### Q3：Vercel 部署失败，怎么办？

1. 检查 Vercel Dashboard 的 Build Logs，看是什么错误
2. 通常是：
   - 环境变量缺失
   - 依赖安装失败
   - 代码语法错误
3. 修复问题 → commit → push → Vercel 会自动重新部署
4. 还是不行的话告诉 kris

---

## 特殊文件的更新时机

### progress.md

**更新时机：** 每次 commit 前必须更新

**更新内容：**
- 当前版本信息（已完成功能）
- 当前状态（开发中/已验收）
- 下一步计划
- 已知问题

**例子：**
```
✅ v0.6「偶遇报告」已完成验收（2026-04-30）

v0.6 新增功能：
- 年度和最近三个月报告视图
- 时间窗口切换功能
- 空状态友好提示
- 数据聚合展示

关键改动：
- 新增 ReportPage.jsx
- 新增 reportService.js
- BottomTabBar 新增报告 tab
```

### growth.md

**更新时机：** 以下情况主动更新

1. **完成一个版本验收后**
   - 记录产品决策
   - 采用的方案
   - 为什么这样选

2. **遇到有代表性的 bug**
   - 问题描述
   - 根本原因
   - 解决方案
   - 下次怎么避免

3. **遇到多轮讨论的方案**
   - 备选方案列表
   - 为什么选了这个
   - 为什么否定了其他的

4. **当 kris 说「结束」「收工」「明天继续」时**
   - 记录当前的工作状态
   - 核心思考和决策
   - 未解决的问题

**参考格式：** 见 growth.md 末尾的模板

---

## 快速参考

| 阶段 | 命令 | 说明 |
|------|------|------|
| 检查状态 | `git status` | 看改了哪些文件 |
| 看改动 | `git diff` | 看具体改了什么 |
| 添加文件 | `git add .` | 添加所有改动 |
| 提交 | `git commit -m "feat: xxx"` | 写清楚 commit message |
| 推送 | `git push origin master` | 推到远程 |
| 查看历史 | `git log --oneline -5` | 看最近5条 commit |

---

## 总结

1. **等 kris 确认** → 再 commit（不要自动）
2. **写清楚 message** → 方便日后查阅
3. **更新 progress.md** → 每次都要
4. **push 后验证** → 确保线上正常
5. **有问题就告诉 kris** → 不要硬干

记住：**Git 是代码的时间机器，commit message 是给未来的自己写的信。**
