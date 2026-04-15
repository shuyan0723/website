# 智能横向滚动功能实现方案

## 概述

将 demo/2.html 中的智能横向滚动功能应用到 ResearchCenter.astro 的时间轴区域。实现效果：滚动到时间轴时，向下滚轮自动转为向右滚动；到边界后继续向下翻页。

---

## 功能特点

- 滚动到时间轴区域时，向下滚轮自动转为向右滚动
- 滚动到最右边边界后，继续向下滚轮会向下翻页
- 向上滚动时，先向左滚动，到最左边边界后才向上翻页
- 离开时间轴区域后，恢复正常纵向滚动

---

## 核心原理分析

### 1. IntersectionObserver API

监听元素是否进入可视区，只有当横向滚动区域进入视口时才开启横向滚动拦截。

```javascript
const observer = new IntersectionObserver((entries) => {
  const isInView = entries[0].isIntersecting;

  if (isInView) {
    // 进入区域 → 开启横向滚动
    document.addEventListener('wheel', handleWheel, { passive: false });
  } else {
    // 离开区域 → 关闭，恢复正常滚动
    document.removeEventListener('wheel', handleWheel);
  }
}, { threshold: 0.5 });
```

**关键参数**：
- `threshold: 0.5` - 当 50% 的元素进入视口时触发

---

### 2. Wheel 事件处理

#### 核心逻辑

```javascript
function handleWheel(e) {
  const left = slider.scrollLeft;           // 当前横向滚动位置
  const max = slider.scrollWidth - slider.clientWidth;  // 最大可滚动距离
  const delta = e.deltaY;                   // 垂直滚动增量（正=向下，负=向上）

  // 向右没滚完 → 强制横向
  if (delta > 0 && left < max) {
    e.preventDefault();
    slider.scrollLeft += Math.min(delta, 120);
    return;
  }

  // 向左没滚完 → 强制横向
  if (delta < 0 && left > 0) {
    e.preventDefault();
    slider.scrollLeft += Math.max(delta, -120);
    return;
  }
}
```

#### 逻辑分解

| 条件 | 行为 |
|------|------|
| `delta > 0 && left < max` | 用户向下滚动 + 还有横向滚动空间 → 拦截，向右滚动 |
| `delta < 0 && left > 0` | 用户向上滚动 + 还有横向滚动空间 → 拦截，向左滚动 |
| 其他情况 | 不拦截，保持默认纵向滚动 |

#### 关键点

1. **`passive: false`** - 必须设置，否则无法调用 `preventDefault()`
2. **`Math.min(delta, 120)`** - 限制单次滚动速度，防止滚动过快
3. **边界检测** - 只有在边界内才拦截，保证页面能继续向下滚动

---

## 应用到 ResearchCenter.astro 的具体步骤

### 第一步：准备 HTML 结构

确认时间轴区域的结构：

```astro
<!-- 当前结构（已存在） -->
<div class="timeline-scroll-area">
  <div class="timeline-wrapper">
    <!-- 时间轴内容 -->
  </div>
</div>
```

需要添加 id 或 class 用于选择：

```astro
<div class="timeline-scroll-area" id="timelineSection">
  <div class="timeline-wrapper" id="timelineSlider">
    <!-- 时间轴内容 -->
  </div>
</div>
```

---

### 第二步：添加 JavaScript 代码

在 ResearchCenter.astro 的 `<script>` 标签中添加以下代码：

```javascript
// ============================================
// 智能横向滚动功能
// ============================================

// 获取所有时间轴区域
const timelineSections = document.querySelectorAll('.timeline-scroll-area');

timelineSections.forEach((section) => {
  const slider = section.querySelector('.timeline-wrapper');

  // 确保元素存在
  if (!slider) return;

  // 创建 IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    const isInView = entries[0].isIntersecting;

    if (isInView) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      document.removeEventListener('wheel', handleWheel);
    }
  }, { threshold: 0.3 });

  observer.observe(section);

  // 横向滚动处理函数
  function handleWheel(e) {
    const left = slider.scrollLeft;
    const max = slider.scrollWidth - slider.clientWidth;
    const delta = e.deltaY;

    // 向右滚动（向下滚轮）
    if (delta > 0 && left < max) {
      e.preventDefault();
      slider.scrollLeft += Math.min(delta, 100);
      return;
    }

    // 向左滚动（向上滚轮）
    if (delta < 0 && left > 0) {
      e.preventDefault();
      slider.scrollLeft += Math.max(delta, -100);
      return;
    }
  }
});
```

---

### 第三步：确保 CSS 滚动设置

确认 `research-center.scss` 中时间轴区域有以下设置：

```scss
.timeline-scroll-area {
  overflow: hidden; // 或 visible，取决于外层容器
}

.timeline-wrapper {
  display: flex;
  gap: 40px;
  overflow-x: auto;
  scroll-behavior: smooth; // 平滑滚动

  // 隐藏滚动条（可选）
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 多个时间轴区域的处理

由于有三个产品（反洗钱、运维、标讯），每个都有独立的时间轴区域，需要考虑：

### 方案 A：独立监听（推荐）

每个时间轴区域独立触发横向滚动，互不干扰。

```javascript
document.querySelectorAll('.timeline-scroll-area').forEach((section) => {
  const slider = section.querySelector('.timeline-wrapper');

  let handleWheel = null;

  const observer = new IntersectionObserver((entries) => {
    const isInView = entries[0].isIntersecting;

    if (isInView) {
      // 创建专属的 handleWheel 函数
      handleWheel = (e) => {
        const left = slider.scrollLeft;
        const max = slider.scrollWidth - slider.clientWidth;
        const delta = e.deltaY;

        if (delta > 0 && left < max) {
          e.preventDefault();
          slider.scrollLeft += Math.min(delta, 100);
        } else if (delta < 0 && left > 0) {
          e.preventDefault();
          slider.scrollLeft += Math.max(delta, -100);
        }
      };

      document.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      if (handleWheel) {
        document.removeEventListener('wheel', handleWheel);
      }
    }
  }, { threshold: 0.3 });

  observer.observe(section);
});
```

---

### 方案 B：统一监听

只监听当前激活的 Tab 对应的时间轴。

```javascript
// 与 Tab 切换逻辑结合
let currentSlider = null;
let currentObserver = null;

function updateHorizontalScroll() {
  // 移除旧的监听
  if (currentObserver) {
    currentObserver.disconnect();
  }

  // 获取当前激活的时间轴
  const activeSection = document.querySelector('.tab-content.active .timeline-scroll-area');
  if (!activeSection) return;

  const slider = activeSection.querySelector('.timeline-wrapper');
  if (!slider) return;

  currentSlider = slider;

  // 创建新的监听
  currentObserver = new IntersectionObserver((entries) => {
    const isInView = entries[0].isIntersecting;

    if (isInView) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      document.removeEventListener('wheel', handleWheel);
    }
  }, { threshold: 0.3 });

  currentObserver.observe(activeSection);
}

function handleWheel(e) {
  if (!currentSlider) return;

  const left = currentSlider.scrollLeft;
  const max = currentSlider.scrollWidth - currentSlider.clientWidth;
  const delta = e.deltaY;

  if (delta > 0 && left < max) {
    e.preventDefault();
    currentSlider.scrollLeft += Math.min(delta, 100);
  } else if (delta < 0 && left > 0) {
    e.preventDefault();
    currentSlider.scrollLeft += Math.max(delta, -100);
  }
}

// Tab 切换时更新
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', updateHorizontalScroll);
});

// 初始化
updateHorizontalScroll();
```

---

## 调试技巧

### 1. 添加调试日志

```javascript
function handleWheel(e) {
  const left = slider.scrollLeft;
  const max = slider.scrollWidth - slider.clientWidth;
  const delta = e.deltaY;

  console.log({
    delta,
    left,
    max,
    willPrevent: (delta > 0 && left < max) || (delta < 0 && left > 0)
  });

  // ... 其余代码
}
```

### 2. 视觉反馈

在滚动时添加视觉提示：

```javascript
// 添加/移除滚动状态类
if ((delta > 0 && left < max) || (delta < 0 && left > 0)) {
  section.classList.add('is-horizontal-scrolling');
} else {
  section.classList.remove('is-horizontal-scrolling');
}
```

```scss
.timeline-scroll-area.is-horizontal-scrolling {
  cursor: ew-resize; // 改变鼠标样式
}
```

---

## 兼容性说明

| 技术 | 浏览器支持 |
|------|-----------|
| IntersectionObserver | Chrome 51+, Firefox 55+, Safari 12.1+ |
| WheelEvent | 所有现代浏览器 |
| preventDefault | 所有浏览器 |

---

## 参数调优建议

| 参数 | 默认值 | 说明 | 建议范围 |
|------|--------|------|----------|
| `threshold` | 0.5 | 触发监听的可见比例 | 0.3 - 0.5 |
| 速度限制 | 120 | 单次滚动最大像素 | 80 - 150 |
| `scroll-behavior` | smooth | 滚动动画 | smooth / auto |

---

## 注意事项

1. **事件监听器泄漏**：确保在离开区域时移除事件监听器
2. **被动监听器**：必须设置 `{ passive: false }` 才能调用 preventDefault
3. **多实例冲突**：如果有多个横向区域，确保每个区域有独立的处理函数
4. **性能**：使用 throttle/debounce 限制频繁触发（可选）

---

## 完整代码示例

```javascript
// 智能横向滚动 - 完整实现
(() => {
  const timelineSections = document.querySelectorAll('.timeline-scroll-area');

  timelineSections.forEach((section) => {
    const slider = section.querySelector('.timeline-wrapper');
    if (!slider) return;

    let handleWheel = null;

    const observer = new IntersectionObserver((entries) => {
      const isInView = entries[0].isIntersecting;

      if (isInView) {
        handleWheel = (e) => {
          const left = slider.scrollLeft;
          const max = slider.scrollWidth - slider.clientWidth;
          const delta = e.deltaY;

          if (delta > 0 && left < max) {
            e.preventDefault();
            slider.scrollLeft += Math.min(delta, 100);
            section.classList.add('horizontal-scrolling');
          } else if (delta < 0 && left > 0) {
            e.preventDefault();
            slider.scrollLeft += Math.max(delta, -100);
            section.classList.add('horizontal-scrolling');
          } else {
            section.classList.remove('horizontal-scrolling');
          }
        };

        document.addEventListener('wheel', handleWheel, { passive: false });
      } else {
        if (handleWheel) {
          document.removeEventListener('wheel', handleWheel);
          handleWheel = null;
        }
        section.classList.remove('horizontal-scrolling');
      }
    }, { threshold: 0.3 });

    observer.observe(section);
  });
})();
```
