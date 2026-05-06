# 本地验收指南 - 一步步教你操作

> 这份指南会一步步教你在自己的电脑上验收这个项目，确保所有功能都能正常工作。

---

## 🎯 验收目标

通过这个流程，你会：
- ✅ 在本地安装 Docker
- ✅ 成功构建项目的 Docker 镜像
- ✅ 启动应用并验证所有功能
- ✅ 确认 API 集成正常
- ✅ 准备提交到挑战赛平台

---

## 阶段 1：环境准备（10 分钟）

### 1.1 安装 Docker

根据你的操作系统选择：

#### Windows 用户
1. 访问 https://www.docker.com/products/docker-desktop
2. 下载 Docker Desktop for Windows
3. 运行安装程序（会提示开启 WSL 2，同意即可）
4. 安装后重启电脑
5. 打开 PowerShell，验证安装：
   ```powershell
   docker --version
   docker run hello-world
   ```

#### Mac 用户
1. 访问 https://www.docker.com/products/docker-desktop
2. 选择对应版本：
   - Apple Silicon (M1/M2/M3): Docker Desktop for Mac - Apple Silicon
   - Intel: Docker Desktop for Mac - Intel Chip
3. 安装后打开终端，验证：
   ```bash
   docker --version
   docker run hello-world
   ```

#### Linux 用户
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# 验证
docker --version
docker-compose --version
```

### 1.2 验证 Docker 安装

打开终端/PowerShell，运行：
```bash
docker --version
# 预期输出：Docker version 24.x 或更高

docker-compose --version
# 预期输出：Docker Compose version 2.x 或更高
```

---

## 阶段 2：项目准备（5 分钟）

### 2.1 打开项目目录

```bash
# 进入项目文件夹
cd /path/to/animal-diary

# 确认你在正确的位置
ls -la Dockerfile docker-compose.yml .env.docker
# 应该看到这三个文件存在
```

### 2.2 准备环境变量

```bash
# 复制环境变量模板
cp .env.docker .env

# 编辑 .env 文件，填入你的 API 密钥
# 使用你喜欢的编辑器：VS Code、nano、记事本等
```

**需要填入的信息**（从以下网站获取，都免费）：

#### ⭐ 必需：Supabase（数据库）
1. 访问 https://supabase.com
2. 登录或注册一个免费账户
3. 创建一个新项目（或用现有项目）
4. 点击 Settings → API
5. 复制：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

#### ⭐ 必需：OpenRouter（AI 识别）
1. 访问 https://openrouter.ai
2. 登录或用 Google 账号快速注册
3. 点击 Settings → API Keys
4. 创建一个新 key（或复制现有 key）
5. 复制 API Key → `OPENROUTER_API_KEY`
6. （可选）创建免费账户会赠送 $5 试用额度

#### 可选：高德地图（地图功能）
1. 访问 https://lbs.amap.com
2. 注册并申请 API Key
3. 获取：
   - **API Key** → `VITE_AMAP_KEY`
   - **Security Code** → `VITE_AMAP_SECURITY_CODE`

### 2.3 你的 .env 文件应该看起来像这样

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...（长字符串）
OPENROUTER_API_KEY=sk-or-v1-...（长字符串）
VITE_AMAP_KEY=xxxxxxxxx
VITE_AMAP_SECURITY_CODE=xxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...（长字符串）
```

---

## 阶段 3：Docker 构建（10 分钟）

### 3.1 开始构建

在项目目录打开终端，执行：

```bash
# 使用 docker-compose 构建和启动
docker-compose up --build

# 这条命令会：
# 1. 读取 docker-compose.yml 配置
# 2. 读取 Dockerfile 
# 3. 安装 npm 依赖
# 4. 编译项目代码
# 5. 启动应用
```

### 3.2 预期输出

**第 1 分钟**：
```
Building animal-diary
Step 1/16 : FROM node:20-alpine AS builder
...
Step 5/16 : RUN npm ci
```

**第 5-8 分钟**（npm install，最耗时）：
```
added 200+ packages in 7m15s
```

**第 9-10 分钟**（编译构建）：
```
Step 16/16 : RUN npm run build
> vite build

✓ 237 modules transformed. 
dist/index.html 1.25 kB
dist/assets/index-xxxx.js 120.45 kB
```

**最后**（应用启动）：
```
animal-diary  | ✔ Accepting connections at http://localhost:3000
```

### 3.3 如果构建失败

**错误 1：npm install 超时**
```bash
# 清除缓存重试
docker-compose down
docker system prune -a
docker-compose up --build
```

**错误 2：磁盘空间不足**
```bash
# Docker 镜像可能会占用 1-2 GB 临时空间
# 清理其他 Docker 数据
docker system prune -a --volumes
```

**错误 3：.env 文件不存在**
```bash
# 确保你已经复制了
cp .env.docker .env

# 检查文件
ls -la .env
```

---

## 阶段 4：功能验收（10 分钟）

构建成功后，你应该看到：
```
✔ Accepting connections at http://localhost:3000
```

### 4.1 打开应用

在浏览器打开：**http://localhost:3000**

你应该看到：
- ✅ 首页正常加载（不是空白或红色错误）
- ✅ 底部有导航栏：时间线 / 地图 / ➕ / 图鉴 / 报告
- ✅ 有"偶遇"和"来发现"相关的文字

### 4.2 验收清单

#### ✅ 基础界面验收
- [ ] 应用能打开，不显示错误
- [ ] 看得到主标题"动物偶遇图鉴"
- [ ] 看得到底部导航栏有 5 个选项卡

#### ✅ 时间线页面
- [ ] 点击"时间线"tab，显示"还没有偶遇记录"（因为是新账户）
- [ ] 底部有一个圆形的 ➕ 按钮

#### ✅ 新建记录流程（需要有图片）
1. [ ] 点击底部 ➕ 按钮
2. [ ] 选择一张你电脑上的动物图片（或用下面的测试图片）
   - 可以从 `sample-animal-images/` 文件夹选
3. [ ] 图片预览显示在页面上
4. [ ] 点击"✨ AI 帮我生成档案"按钮
5. [ ] 等待加载（应该看到"识别中..."）

**预期结果**：
- ✅ AI 返回识别结果：动物种类、有趣的日志
- ✅ 可以编辑文字内容
- ✅ 点击"保存到日志"成功保存
- ✅ 跳回时间线，看到新保存的记录

#### ✅ 图鉴页面
- [ ] 点击"图鉴"tab
- [ ] 保存记录后，这里应该显示该动物的大类（如"猫"、"狗"）
- [ ] 点击大类可以看到该类别的所有照片

#### ✅ 地图页面（需要 API Key）
- [ ] 点击"地图"tab
- [ ] 应该看到高德地图加载
- [ ] 保存记录后，应该看到标记点出现在地图上
- [ ] 点击标记可以看到详情卡片

#### ✅ 报告页面
- [ ] 点击"报告"tab
- [ ] 保存 1-2 条记录后，应该显示统计信息
- [ ] 可以切换时间窗口（最近三个月 / 今年）

#### ✅ 详情页面
- [ ] 从时间线点击某条记录展开
- [ ] 看到大图、完整日志、编辑按钮
- [ ] 可以点击"编辑"修改内容
- [ ] 可以点击"删除"（会弹出确认框）

### 4.3 常见问题排查

**问题 1：应用白屏或显示错误**
- 打开浏览器开发者工具 (F12)
- 查看 Console 标签页的错误信息
- 常见原因：Supabase URL/Key 填错了

**问题 2：AI 识别失败（显示错误）**
- 检查 `.env` 中的 `OPENROUTER_API_KEY` 是否正确
- 检查 OpenRouter 账户是否有余额（$5 试用额度）
- 查看浏览器 F12 → Network 标签，看请求状态

**问题 3：地图不显示**
- 这是因为 `VITE_AMAP_KEY` 未配置，是可选的
- 其他功能不受影响

**问题 4：数据保存成功但刷新后消失**
- 检查 Supabase URL 和 Key 是否正确
- 确保 Supabase 项目的 RLS 策略已启用
- 查看 Supabase Dashboard → Table Editor，看是否有 `records` 表

---

## 阶段 5：测试数据准备（5 分钟）

如果你没有动物照片，可以用项目自带的样本：

```bash
# 项目文件夹中有示例动物图片
ls sample-animal-images/

# 你会看到：
# - cat.jpg      (猫)
# - dog.jpg      (狗)  
# - bird.jpg     (鸟)
# - squirrel.jpg (松鼠)
```

在"新建记录"时上传这些图片进行测试。

---

## 阶段 6：性能检查（5 分钟）

### 6.1 检查镜像大小

```bash
# 在新的终端窗口运行（保持应用运行）

# 查看构建的镜像大小
docker images | grep animal-diary

# 预期输出示例：
# REPOSITORY     TAG       SIZE
# animal-diary   latest    285MB
```

### 6.2 检查容器日志

```bash
# 查看应用运行日志（检查有无错误）
docker logs <container_id>

# 或者通过 docker-compose（更简单）
docker-compose logs -f
```

### 6.3 性能指标

如果一切正常，你应该看到：
- ✅ 镜像大小：~250-300 MB
- ✅ 容器启动时间：<30 秒
- ✅ 首页加载时间：<2 秒
- ✅ AI 识别耗时：5-15 秒（取决于网络）

---

## 阶段 7：清理和总结（2 分钟）

### 7.1 停止应用

```bash
# 停止 docker-compose（在运行的终端按 Ctrl+C）
# 或在另一个终端运行：
docker-compose down

# 预期输出：
# Stopping animal-diary_animal-diary_1 ... done
# Removing animal-diary_animal-diary_1 ... done
# Removing network animal-diary_default
```

### 7.2 清理镜像（可选）

如果你想节省空间：
```bash
# 删除本次构建的镜像
docker rmi animal-diary:latest

# 清理所有未使用的镜像
docker image prune -a
```

### 7.3 验收总结

完成上述验收后，填写以下清单：

```
验收清单：
- [ ] Docker 成功安装并验证
- [ ] .env 文件正确配置
- [ ] Docker 镜像成功构建
- [ ] 应用成功启动（http://localhost:3000）
- [ ] 首页界面正常显示
- [ ] 可以上传图片
- [ ] AI 识别成功
- [ ] 记录保存成功
- [ ] 图鉴页面显示正确
- [ ] 时间线、地图、报告等页面可访问
```

如果所有项都打勾 ✅，则验收通过！

---

## 🎯 验收通过后的下一步

### 选项 A：直接提交源代码（推荐）

如果挑战赛平台支持：
```bash
# 1. 推送到 GitHub
git add .
git commit -m "chore: add Docker deployment configuration"
git push origin main

# 2. 给平台提交 GitHub 仓库地址
# 平台会自动读取 Dockerfile 进行构建
```

### 选项 B：提交预构建镜像

如果平台要求镜像地址：
```bash
# 1. 标记镜像
docker tag animal-diary:latest your-username/animal-diary:v1.0

# 2. 推送到 Docker Hub（需要注册账号）
docker login
docker push your-username/animal-diary:v1.0

# 3. 提交镜像地址给平台
# your-username/animal-diary:v1.0
```

### 选项 C：提交完整文档

如果平台需要部署说明：
- 提交 `DOCKER_DEPLOYMENT.md`
- 提交 `SUBMISSION_CHECKLIST.md`
- 提交 `LOCAL_VERIFICATION_GUIDE.md`（这个文档）

---

## 📞 遇到问题怎么办？

### 问题排查步骤

1. **看有没有错误信息**
   - 打开浏览器 F12 检查 Console
   - 查看应用启动的终端日志

2. **查看相关文档**
   - `DOCKER_DEPLOYMENT.md` → 故障排查章节
   - `SUBMISSION_CHECKLIST.md` → 项目配置检查

3. **重新构建**
   ```bash
   docker-compose down
   docker system prune -a
   docker-compose up --build
   ```

4. **检查环境变量**
   ```bash
   # 确保 .env 文件存在且正确
   cat .env
   ```

---

## ✅ 验收完成后

当你看到这条消息时，说明验收成功了：

> ✔ Accepting connections at http://localhost:3000

此时你可以：
1. 停止 Docker 应用
2. 根据挑战赛要求选择提交方式
3. 提交项目！

---

**预计总耗时**：30-40 分钟（首次构建较慢）

**下次启动**：2-3 分钟（Docker 会缓存）

---

**祝你验收顺利！** 🎉
