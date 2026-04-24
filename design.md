# 动物偶遇图鉴 - UI 设计规范

参考自 [Animal Island UI](https://github.com/guokaigdg/animal-island-ui) 的动物森友会风格设计系统。

## 色彩体系

### 主色
```css
主色青绿：#19c8b9
  - 悬停态：#3dd4c6
  - 激活态：#11a89b
  - 背景色：#e6f9f6
```

### 中性色
```css
背景色：
  - 主背景：#f8f8f0（米白）
  - 次级背景：#f0e8d8（浅棕）
  - 禁用背景：#f0ece2

文字色：
  - 主文字：#794f27（棕色）
  - 次级文字：#9f927d（灰棕）
  - 禁用文字：#c4b89e

边框色：
  - 默认边框：#aaa69d
  - 悬停边框：#827157
```

### 状态色
```css
成功色：#6fba2c
  - 悬停：#85cc45
  - 激活：#5a9e1e

警告色：#f5c31c
  - 悬停：#f7d04a
  - 激活：#dba90e

错误色：#e05a5a
  - 悬停：#e87878
  - 激活：#c94444
```

## 排版系统

### 字体栈
```css
font-family: Nunito, 'Zen Maru Gothic', 'M PLUS Rounded 1c',
             'Smiley Sans', 'HarmonyOS Sans SC', 'MiSans',
             -apple-system, 'PingFang SC', 'Hiragino Sans GB',
             'Microsoft YaHei', sans-serif;
```

### 字号
```css
font-size-sm：12px
font-size-base：14px
font-size-lg：16px
line-height-base：1.5715
```

## 间距系统

严格遵循 4px 倍数：
```css
spacing-xs：4px
spacing-sm：8px
spacing-md：12px
spacing-lg：16px
spacing-xl：24px
```

## 形状与圆角

```css
/* 圆角规格 */
border-radius-sm：12px（小圆角）
border-radius-base：18px（标准圆角）
border-radius-lg：24px（大圆角）

/* 特殊用途 */
按钮圆角：50px（完全圆角）
边框宽度：2px（标准） / 2.5px（强调）
```

## 阴影系统

### 标准投影
```css
shadow-sm：0 2px 4px 0 rgba(61, 52, 40, 0.06)
shadow-base：0 3px 10px 0 rgba(61, 52, 40, 0.1)
shadow-lg：0 8px 24px 0 rgba(61, 52, 40, 0.14)
```

### 3D 按压效果（核心特色）
组件下方加深色阴影，点击时阴影缩小，造成"按压"感觉：

**按钮**
```css
默认状态：box-shadow: 0 5px 0 0 #bdaea0;
悬停状态：box-shadow: 0 6px 0 0 #bdaea0;（阴影增加）
激活状态：box-shadow: 0 1px 0 0 #bdaea0;（阴影缩小）
```

**输入框**
```css
默认状态：box-shadow: 0 3px 0 0 #d4c9b4;
悬停状态：box-shadow: 0 3px 0 0 #c4b89e;
```

**Switch 开关**
```css
手柄：box-shadow: 0 3px 0 0 #bdaea0;（未激活）
手柄激活：box-shadow: 0 3px 0 0 #5a9e1e;（激活）
```

## 动画与交互

### 缓动函数
```css
motion-ease：cubic-bezier(0.4, 0, 0.2, 1)（标准缓动）
```

### 动画时长
```css
motion-duration-fast：0.15s（快速反馈）
motion-duration-base：0.25s（标准）
motion-duration-slow：0.35s（缓慢）
```

### 常见动画
```css
/* 悬停浮起 */
&:hover {
  transform: translateY(-2px);  /* 小型组件 */
  transform: translateY(-4px);  /* 大型组件 */
}

/* 弹窗进场 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* 加载旋转 */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## 尺寸规格

```css
/* 高度规格 */
height-sm：32px（小）
height-base：40px（标准）
height-lg：48px（大）

/* 按钮内间距 */
padding-sm：0 14px
padding-base：0 18px
padding-lg：0 22px
```

## 组件设计模式

### 按钮（Button）
- **类型**：primary(填充) / default(描边) / dashed(虚线) / text(文字) / link(链接) / danger(危险)
- **尺寸**：small / middle / large
- **特殊**：带 3D 按压效果、悬停浮起、激活下压
- **加载状态**：loading 时显示动画条纹

### 卡片（Card）
- **圆角**：20px
- **背景**：rgb(247, 243, 223)（米白）
- **阴影**：0 4px 10px rgba(107, 92, 67, 0.42)
- **交互**：悬停时 translateY(-4px) 浮起
- **颜色变体**：12 种（来自动物森友会调色板）

### 输入框（Input）
- **圆角**：50px（完全圆角）
- **尺寸**：small / middle / large
- **特殊**：支持前缀、后缀、清除按钮
- **状态**：normal / error / warning / disabled
- **3D 效果**：有下方阴影，悬停加深

### 弹窗（Modal）
- **背景蒙层**：rgba(0, 0, 0, 0.35)
- **进场动画**：fade-in (0.25s) + zoom-in (0.3s)
- **边界**：用 clip-path 实现不规则边框
- **内间距**：padding 48px 48px 32px 48px
- **按钮**：两个按钮对齐右侧，gap 12px

### 开关（Switch）
- **尺寸**：small / middle
- **未激活**：灰棕色背景 #d4c9b4
- **已激活**：绿色背景 #86d67a
- **手柄**：圆形，有 3D 阴影，滑动时移动
- **文字**：可显示"ON"/"OFF"，白色，0.1 的文字阴影

## 待处理设计元素

以下组件在 animal-island-ui 中使用 SVG 图片实现，暂时不集成，后续如需使用再补充：

- **分割线（Divider）**：使用 SVG 图片（divider-line-*.svg）
  - 可选样式：brown / teal / white / yellow
  - wave 样式：wave-yellow.svg

- **页脚（Footer）**：使用 SVG + WebP 背景图
  - 海浪背景：footer-sea.svg（80px 高）
  - 树木背景：footer-tree.webp（60px 高）

需要时可自行绘制 SVG 或使用背景图片替代。

## 响应式设计

- **移动端优先**：所有组件默认适配移动端
- **最大宽度**：弹窗 `calc(100vw - 32px)`
- **卡片在小屏**：全宽或使用 Swiper 横向滚动

## 使用建议

1. **颜色**：直接在 Tailwind config 或 CSS 变量中定义这些颜色值
2. **圆角**：Tailwind 的 `rounded-full` 用于 50px，自定义 `rounded-[18px]` 等
3. **阴影**：使用 `box-shadow` 而非 Tailwind `shadow`，以保留 3D 按压效果
4. **动画**：定义关键帧 `@keyframes`，配合 Tailwind 的 `animate-*` 或自定义
5. **间距**：严格遵循 4px 倍数，使用 Tailwind 的间距缩放

---

最后更新：2026-04-24  
参考项目：https://github.com/guokaigdg/animal-island-ui
