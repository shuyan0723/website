# Swiper.js 3D 卡片轮播实现方案

## 概述

使用 Swiper.js 实现三个产品卡片的 3D 轮播效果，支持自动播放、进度条指示、平滑过渡动画。

---

## 效果预览

- 三张产品卡片横向排列
- 当前卡片高亮显示（`swiper-slide-active`）
- 两侧卡片有 3D 透视效果（`swiper-slide-prev`/`swiper-slide-next`）
- 自动播放 + 进度条指示
- 点击 Tab 切换对应卡片

---

## 第一步：安装依赖

```bash
npm install swiper
```

---

## 第二步：HTML 结构

```astro
<!-- 产品内容容器 -->
<div class="research-products-wrapper">
  <!-- Swiper 容器 -->
  <div class="swiper products-swiper">
    <!-- Swiper 包装器 -->
    <div class="swiper-wrapper">
      <!-- 产品 1 -->
      <div class="swiper-slide research-product-panel" data-product="aml">
        <!-- 产品内容保持不变 -->
        <div class="research-product-intro">...</div>
        <div class="timeline-area">...</div>
      </div>

      <!-- 产品 2 -->
      <div class="swiper-slide research-product-panel" data-product="ops">
        <!-- 产品内容 -->
      </div>

      <!-- 产品 3 -->
      <div class="swiper-slide research-product-panel" data-product="bid">
        <!-- 产品内容 -->
      </div>
    </div>

    <!-- 分页器（进度条） -->
    <div class="swiper-pagination"></div>
  </div>

  <!-- Tab 切换器（放在 Swiper 外面） -->
  <div class="research-tabs">
    <button class="research-tab-btn active" data-slide="0">
      反洗钱智能管理系统
    </button>
    <button class="research-tab-btn" data-slide="1">
      昆仑智能运维管理平台
    </button>
    <button class="research-tab-btn" data-slide="2">
      标讯信息智能分析平台
    </button>
  </div>
</div>
```

---

## 第三步：SCSS 样式

### 3.1 引入 Swiper 样式

```scss
// 在 research-center.scss 顶部添加
@import 'swiper/swiper';
@import 'swiper/modules/pagination/pagination';
```

### 3.2 核心样式

```scss
// ========== Swiper 容器 ==========
.products-swiper {
  width: 100%;
  overflow: hidden;

  // Swiper 包装器
  .swiper-wrapper {
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
  }
}

// ========== Swiper 幻灯片 ==========
.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: auto;
  transition-property: transform;
  position: relative;

  // 当前激活的幻灯片
  &.swiper-slide-active {
    opacity: 1;
    transform: scale(1);
    z-index: 10;
  }

  // 前一个幻灯片
  &.swiper-slide-prev {
    opacity: 0.5;
    transform: scale(0.9) translateX(-50px);
    z-index: 1;
  }

  // 后一个幻灯片
  &.swiper-slide-next {
    opacity: 0.5;
    transform: scale(0.9) translateX(50px);
    z-index: 1;
  }

  // 其他幻灯片（完全隐藏）
  &.swiper-slide-duplicate {
    opacity: 0;
  }
}

// ========== 进度条分页器 ==========
.swiper-pagination {
  position: relative;
  margin-top: 32px;
  width: 100% !important;

  .swiper-pagination-bullet {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(59, 130, 246, 0.2);
    opacity: 1;
    transition: all 0.3s ease;

    &.swiper-pagination-bullet-active {
      background: linear-gradient(90deg, #3b82f6, #22d3ee);
      height: 6px;
    }
  }
}
```

---

## 第四步：JavaScript 实现

```astro
<script>
  import Swiper from 'swiper';
  import { Pagination, Autoplay } from 'swiper/modules';

  // 初始化 Swiper
  const productsSwiper = new Swiper('.products-swiper', {
    // === 基础配置 ===
    direction: 'horizontal',
    loop: false, // 不循环播放
    speed: 600, // 切换速度 600ms

    // === 自动播放 ===
    autoplay: {
      delay: 5000, // 5秒切换
      disableOnInteraction: false, // 用户操作后继续自动播放
      pauseOnMouseEnter: true, // 鼠标悬停时暂停
    },

    // === 分页器 ===
    pagination: {
      el: '.swiper-pagination',
      clickable: false, // 不可点击分页器切换
      renderBullet: (index: number, className: string) => {
        // 自定义进度条样式
        return `<span class="${className}" style="flex: 1;"></span>`;
      },
    },

    // === 模块 ===
    modules: [Pagination, Autoplay],

    // === 回调函数 ===
    on: {
      // 初始化完成
      init: function () {
        updateActiveTab(0);
      },

      // 幻灯片切换时
      slideChange: function () {
        updateActiveTab(this.activeIndex);
      },
    },
  });

  // 更新 Tab 状态
  function updateActiveTab(index: number) {
    const tabBtns = document.querySelectorAll('.research-tab-btn');
    tabBtns.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Tab 点击切换
  document.querySelectorAll('.research-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt((e.currentTarget as HTMLElement).dataset.slide || '0');
      productsSwiper.slideTo(index);
    });
  });

  // 页面加载后默认滚动时间轴到 v2.0 位置
  setTimeout(() => {
    ['aml', 'ops', 'bid'].forEach(id => {
      const wrapper = document.getElementById(`timeline-${id}`);
      if (wrapper) {
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;
        wrapper.scrollLeft = (scrollWidth - clientWidth) / 3;
      }
    });
  }, 500);
</script>
```

---

## 第五步：进阶配置

### 5.1 添加 3D Coverflow 效果

```javascript
import { EffectCoverflow } from 'swiper/modules';

const productsSwiper = new Swiper('.products-swiper', {
  // ... 其他配置
  effect: 'coverflow',
  coverflowEffect: {
    rotate: 0, // 旋转角度
    stretch: 0, // 拉伸距离
    depth: 100, // 深度
    modifier: 1, // 修正系数
    slideShadows: false, // 幻灯片阴影
  },
  modules: [Pagination, Autoplay, EffectCoverflow],
});
```

### 5.2 添加视差滚动效果

```html
<!-- 在幻灯片中添加视差元素 -->
<div class="swiper-slide" data-swiper-parallax="-300">
  <div class="research-product-intro" data-swiper-parallax="-100">
    <!-- 内容 -->
  </div>
</div>
```

```javascript
import { Parallax } from 'swiper/modules';

const productsSwiper = new Swiper('.products-swiper', {
  parallax: true,
  modules: [Pagination, Autoplay, Parallax],
});
```

---

## 第六步：响应式配置

```javascript
const productsSwiper = new Swiper('.products-swiper', {
  // ... 基础配置

  // 响应式断点
  breakpoints: {
    // 移动端
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    // 平板
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // 桌面
    1024: {
      slidesPerView: 1.2, // 显示部分下一个幻灯片
      spaceBetween: 30,
      centeredSlides: true, // 居中显示
    },
  },
});
```

---

## 样式对比

| 特性 | 原生实现 | Swiper 实现 |
|------|----------|-------------|
| 切换动画 | 自定义 CSS transition | Swiper 内置 transform |
| 自动播放 | 需要手动实现 | autoplay 模块 |
| 进度指示 | 需要手动实现 | pagination 模块 |
| 触摸滑动 | 需要手动实现 | 内置支持 |
| 3D 效果 | 需要大量 CSS | EffectCoverflow 模块 |
| 响应式 | 需要媒体查询 | breakpoints 配置 |

---

## Swiper 核心类说明

| 类名 | 说明 |
|------|------|
| `.swiper` | Swiper 容器，必需 |
| `.swiper-wrapper` | 包装器，包含所有幻灯片 |
| `.swiper-slide` | 单个幻灯片 |
| `.swiper-slide-active` | 当前激活的幻灯片 |
| `.swiper-slide-prev` | 前一个幻灯片 |
| `.swiper-slide-next` | 后一个幻灯片 |
| `.swiper-pagination` | 分页器容器 |
| `.swiper-pagination-bullet` | 分页器指示点 |

---

## 可用模块

```javascript
import {
  Autoplay,      // 自动播放
  Pagination,    // 分页器
  Navigation,    // 前后导航按钮
  EffectCoverflow, // 3D Coverflow 效果
  EffectCards,   // 卡片效果
  EffectFade,    // 淡入淡出效果
  EffectFlip,    // 翻转效果
  Parallax,      // 视差效果
  Thumbs,        // 缩略图导航
  Scrollbar,     // 滚动条
  Zoom,          // 缩放
  Keyboard,      // 键盘控制
  Mousewheel,    // 鼠标滚轮控制
} from 'swiper/modules';
```

---

## 完整示例代码

### research-center.scss 顶部添加

```scss
// ========== Swiper 样式导入 ==========
@import 'swiper/swiper';
@import 'swiper/modules/pagination/pagination';
@import 'swiper/modules/autoplay/autoplay';

// ========== 产品轮播 ==========
.research-products-wrapper {
  position: relative;
}

.products-swiper {
  width: 100%;
  overflow: visible;

  .swiper-wrapper {
    align-items: flex-start;
  }

  .swiper-slide {
    height: auto;
    opacity: 0.4;
    transform: scale(0.95);
    transition: all 0.6s ease;

    &.swiper-slide-active {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.swiper-pagination {
  display: flex;
  gap: 8px;
  margin-top: 32px;
  width: 100% !important;

  .swiper-pagination-bullet {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: rgba(59, 130, 246, 0.2);
    opacity: 1;

    &.swiper-pagination-bullet-active {
      background: #3b82f6;
      height: 6px;
    }
  }
}
```

---

## 给 Claude 的实现指令

如果要让 Claude 实现 Swiper 3D 轮播，可以使用以下指令：

```
请将 ResearchCenter.astro 中的三个产品卡片改为使用 Swiper.js 实现 3D 轮播效果。

要求：
1. 使用 Swiper 的 EffectCoverflow 或自定义 transform 实现 3D 效果
2. 当前卡片高亮，两侧卡片缩小并半透明
3. 添加自动播放功能，5秒切换一次
4. 添加进度条分页器显示当前进度
5. Tab 按钮点击切换到对应卡片
6. 鼠标悬停时暂停自动播放
7. 支持触摸滑动切换
8. 使用 skills-swiper-3d-carousel.md 中的实现方案
```

---

## 常见问题

### Q: 为什么 Swiper 不显示？
A: 确保引入了 Swiper 的 CSS 样式，并且容器有明确的高度。

### Q: 如何禁用用户拖拽？
A: 在幻灯片上添加 `swiper-no-swiping` 类：
```html
<div class="swiper-slide swiper-no-swiping">内容</div>
```

### Q: 如何动态更新 Swiper？
A: 使用 `swiper.update()` 方法：
```javascript
productsSwiper.update();
```

### Q: 如何销毁 Swiper？
A: 使用 `swiper.destroy()` 方法：
```javascript
productsSwiper.destroy();
```

---

## 总结

Swiper.js 是一个成熟的轮播库，相比原生实现具有以下优势：

| 优势 | 说明 |
|------|------|
| 开箱即用 | 内置多种效果和模块 |
| 性能优化 | 使用 GPU 加速的 transform |
| 触摸友好 | 完善的触摸滑动支持 |
| 可配置 | 丰富的配置选项 |
| 文档完善 | 详细的 API 文档 |

**推荐使用场景**：
- 需要多种切换效果
- 需要触摸滑动支持
- 需要复杂的交互逻辑
- 需要快速开发
