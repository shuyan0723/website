# 研发中心产品卡片动态化方案

## 概述
将当前Tab切换式的三张产品卡片（反洗钱、运维、标讯）转换为更具交互性和视觉吸引力的动态展示形式。

---

## 方案一：3D卡片轮播 (Swiper 3D Coverflow)

### 效果描述
- 三张产品卡片以3D覆盖流形式排列
- 中间卡片完全展示，两侧卡片倾斜并缩小
- 支持滑动/拖拽切换，也可点击两侧卡片切换
- 带有平滑的过渡动画和阴影效果

### 优点
- ✅ 视觉冲击力强，符合现代设计趋势
- ✅ 用户可以直观看到有多个产品
- ✅ 交互自然（支持触摸滑动）
- ✅ 成熟方案，有现成库支持

### 缺点
- ❌ 需要引入额外库（Swiper.js 或自实现）
- ❌ 移动端空间占用较大

### 技术方案

#### 选项A：使用 Swiper.js
```bash
npm install swiper
```

#### 选项B：纯CSS + JS实现
- 使用 CSS transform 3D 实现视觉效果
- 使用 Intersection Observer API 自动切换
- 支持触摸手势和键盘导航

### 执行步骤
1. 创建 `.product-swiper` 容器
2. 实现卡片3D变换样式（scale、rotateY、translateZ）
3. 添加切换逻辑（前后按钮、指示器）
4. 添加自动播放（可选，5秒切换）
5. 支持键盘方向键和触摸滑动

### 核心代码结构
```astro
<div class="product-swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide product-card">产品1内容</div>
    <div class="swiper-slide product-card">产品2内容</div>
    <div class="swiper-slide product-card">产品3内容</div>
  </div>
  <div class="swiper-pagination"></div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
```

---

## 方案二：卡片堆叠滑动 (Stack Cards)

### 效果描述
- 所有卡片堆叠在一起，只露出顶部边缘
- 用户向上滑动或点击"查看下一个"来切换
- 类似 Tinder 钱包、Apple 钱包的卡片效果
- 切换时卡片有飞出动画

### 优点
- ✅ 节省空间，适合移动端
- ✅ 交互新颖有趣
- ✅ 可以显示卡片数量指示

### 缺点
- ❌ 用户可能不知道后面有卡片
- ❌ 一次性只能看到一个产品

### 技术方案
- 使用 CSS absolute 定位实现堆叠
- 每张卡片有递减的 z-index 和 translate
- 使用 CSS transition 实现飞出动画
- 支持手势滑动和按钮点击

### 执行步骤
1. 将三张卡片绝对定位在同一位置
2. 设置不同的 z-index（2, 1, 0）
3. 后两张卡片向下偏移并缩小
4. 点击或向上滑动时，顶部卡片飞出
5. 飞出的卡片移到底部，循环展示

### 核心样式
```scss
.stack-card {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:nth-child(1) { z-index: 3; transform: translateY(0) scale(1); }
  &:nth-child(2) { z-index: 2; transform: translateY(20px) scale(0.95); }
  &:nth-child(3) { z-index: 1; transform: translateY(40px) scale(0.9); }
}
```

---

## 方案三：手风琴展开效果 (Accordion)

### 效果描述
- 三张产品卡片以垂直列表形式排列
- 默认只显示产品名称和简短描述
- 点击某张卡片时，该卡片展开显示完整内容（包括时间轴）
- 其他卡片自动收起
- 带有平滑的高度过渡动画

### 优点
- ✅ 节省空间，可以预览所有产品
- ✅ 适合内容较多的情况
- ✅ 移动端友好
- ✅ 用户可以选择查看哪个产品

### 缺点
- ❌ 一次只能查看一个产品的完整内容
- ❌ 需要计算动态高度

### 技术方案
- 使用 CSS grid 或 flex 实现布局
- 使用 max-height + transition 实现展开动画
- 使用 JavaScript 计算内容高度

### 执行步骤
1. 重构 HTML 结构，将每个产品包裹在可折叠容器中
2. 默认状态：所有卡片收起（只显示标题行）
3. 激活状态：当前卡片展开，显示完整内容
4. 添加点击事件处理切换
5. 添加平滑过渡动画

### 核心代码结构
```astro
<div class="accordion-container">
  <div class="accordion-item active">
    <div class="accordion-header">
      <h3>反洗钱智能管理系统</h3>
      <span class="accordion-icon">▼</span>
    </div>
    <div class="accordion-content">
      <!-- 产品完整内容 -->
    </div>
  </div>
  <div class="accordion-item">
    <!-- 第二个产品 -->
  </div>
  <div class="accordion-item">
    <!-- 第三个产品 -->
  </div>
</div>
```

---

## 方案四：悬浮卡片放大 (Hover Scale)

### 效果描述
- 三张卡片并排或网格排列
- 鼠标悬停/点击时，当前卡片放大并高亮
- 其他卡片变暗并缩小
- 放大的卡片显示更多信息（时间轴等）
- 类似 macOS Dock 的效果

### 优点
- ✅ 可以同时看到所有产品
- ✅ 交互直观
- ✅ 视觉反馈明显
- ✅ 不需要复杂交互

### 缺点
- ❌ 桌面端效果好，移动端需要点击
- ❌ 放大的卡片可能被遮挡

### 技术方案
- 使用 CSS flex/grid 布局
- 使用 transform: scale() 实现缩放
- 使用 opacity 实现变暗效果
- 移动端使用 click 事件替代 hover

### 执行步骤
1. 将三张卡片横向排列（flex）
2. 默认状态：三张卡片等宽等高，显示摘要
3. 悬停状态：当前卡片放大到 1.2 倍，显示完整内容
4. 其他卡片缩小到 0.9 倍，透明度降低
5. 移动端：点击切换激活状态

### 核心样式
```scss
.product-card {
  flex: 1;
  transition: all 0.4s ease;
  opacity: 0.7;

  &:hover, &.active {
    flex: 2;
    opacity: 1;
    transform: scale(1.05);
    z-index: 10;
  }
}
```

---

## 方案五：时间轴拖拽浏览 (Draggable Timeline)

### 效果描述
- 保留当前的时间轴设计
- 但三个产品的时间轴合并成一条超长横向时间轴
- 用户可以左右拖拽浏览所有版本
- 当前产品版本高亮，其他版本半透明
- 产品切换时自动滚动到对应位置

### 优点
- ✅ 保留原有的时间轴设计
- ✅ 可以看到所有产品的演进
- ✅ 拖拽交互流畅自然
- ✅ 适合展示产品迭代历程

### 缺点
- ❌ 横向空间需求大
- ❌ 可能造成信息过载

### 技术方案
- 将所有时间轴节点放在一个长容器中
- 使用 scroll-snap 实现分段滚动
- 使用 Intersection Observer 检测当前产品
- 添加产品导航指示器

### 执行步骤
1. 合并三个产品的时间轴到一个容器
2. 按时间顺序排列所有版本
3. 每个产品区域用不同颜色标识
4. 添加产品导航跳转按钮
5. 拖拽时高亮当前所在产品区域

---

## 方案六：翻转卡片 (Flip Card)

### 效果描述
- 三张卡片显示产品摘要（正面）
- 点击卡片时，3D 翻转到背面
- 背面显示详细信息（时间轴、技术栈等）
- 再次点击翻回正面

### 优点
- ✅ 交互有趣，像真实的卡片
- ✅ 节省空间
- ✅ 可以隐藏复杂内容直到需要时显示

### 缺点
- ❌ 用户可能不知道可以点击
- ❌ 一次只能看到一个产品详情
- ❌ 需要添加操作提示

### 技术方案
- 使用 CSS transform: rotateY() 实现翻转
- 使用 backface-visibility: hidden 隐藏背面
- 使用 perspective 创建 3D 效果

### 核心样式
```scss
.flip-card {
  perspective: 1000px;

  .flip-inner {
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  &.flipped .flip-inner {
    transform: rotateY(180deg);
  }

  .flip-front, .flip-back {
    backface-visibility: hidden;
  }

  .flip-back {
    transform: rotateY(180deg);
  }
}
```

---

## 方案七：自动播放幻灯片 (Auto Slideshow)

### 效果描述
- 保留当前的 Tab 切换布局
- 添加自动播放功能（5秒切换）
- 添加进度条显示剩余时间
- 鼠标悬停时暂停播放
- 添加手动控制（前后按钮、指示器）

### 优点
- ✅ 实现简单，改动最小
- ✅ 自动展示所有产品
- ✅ 用户可随时干预

### 缺点
- ❌ 自动切换可能打扰用户
- ❌ 创新性一般

### 执行步骤
1. 添加自动播放定时器
2. 添加进度条动画
3. 鼠标悬停时清除定时器
4. 移开后重启定时器
5. 添加前后按钮

---

## 推荐方案对比

| 方案 | 视觉效果 | 实现难度 | 移动端体验 | 推荐度 |
|------|----------|----------|------------|--------|
| 3D卡片轮播 | ⭐⭐⭐⭐⭐ | 中等 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 卡片堆叠 | ⭐⭐⭐⭐ | 中等 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 手风琴展开 | ⭐⭐⭐ | 简单 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 悬浮放大 | ⭐⭐⭐⭐ | 简单 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 时间轴拖拽 | ⭐⭐⭐⭐⭐ | 复杂 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 翻转卡片 | ⭐⭐⭐⭐ | 简单 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 自动幻灯片 | ⭐⭐ | 非常简单 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 个人推荐

**首选：方案一（3D卡片轮播）**
- 视觉效果最出色，符合研发中心的科技感定位
- 有成熟的 Swiper.js 可以直接使用
- 用户体验好，支持多种交互方式

**备选：方案三（手风琴展开）**
- 实现简单，移动端友好
- 用户可以预览所有产品
- 适合内容较多的情况

**快速实现：方案七（自动播放幻灯片）**
- 改动最小，可以在现有代码基础上快速添加
- 如果时间紧迫，这个是最稳妥的选择

---

## 下一步

请选择您最喜欢的方案，我将为您生成详细的执行文档和代码实现。
