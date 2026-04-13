# 研发中心产品卡片3D轮播 + 自动播放实现方案

## 项目概述
将 `src/components/ResearchCenter.astro` 中的产品Tab切换区域改造为3D卡片轮播效果，支持自动播放、手动切换和触摸滑动。

---

## 一、效果需求

### 视觉效果
```
初始状态（产品1激活）:
┌─────────────────────────────────────────────────────┐
│  [反洗钱小] ← [反洗钱大/当前] → [运维小]           │
│     (倾斜)      (正面显示)      (倾斜)             │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○        │
│  (进度条，5秒倒计时)                                │
└─────────────────────────────────────────────────────┘

自动切换后（产品2激活）:
┌─────────────────────────────────────────────────────┐
│  [反洗钱小] ← [运维大/当前] → [标讯小]             │
│     (倾斜)      (正面显示)      (倾斜)             │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○        │
│  (进度条重置，重新倒计时)                           │
└─────────────────────────────────────────────────────┘
```

### 交互行为
| 用户操作 | 系统响应 |
|----------|----------|
| 页面加载 | 显示第一个产品，进度条开始动画 |
| 等待5秒 | 自动切换到下一个产品，进度条重置 |
| 点击右侧卡片 | 立即切换到该产品，进度条重置 |
| 鼠标悬停 | 暂停自动播放，进度条保持当前位置 |
| 鼠标移开 | 恢复自动播放，进度条继续 |
| 点击左右箭头 | 手动切换，进度条重置 |
| 触摸滑动 | 跟随手指滑动，释放后切换或回弹 |
| 点击圆点指示器 | 跳转到对应产品 |

---

## 二、技术方案

### 技术栈选择

#### 方案A：使用 Swiper.js（推荐）
**优势：**
- 成熟稳定，生产环境验证
- 内置3D Coverflow效果
- 完善的触摸支持
- 体积小（~50KB gzipped）

**安装：**
```bash
npm install swiper
```

#### 方案B：纯CSS + JavaScript自实现
**优势：**
- 无外部依赖
- 完全可控
- 学习价值高

**劣势：**
- 需要处理边界情况
- 触摸手势支持需要额外实现

**本方案采用 Swiper.js**

---

## 三、HTML结构改造

### 当前结构
```astro
<!-- 产品Tab切换器 -->
<div class="research-tabs">
  <button class="research-tab-btn active" data-tab="aml">反洗钱智能管理系统</button>
  <button class="research-tab-btn" data-tab="ops">昆仑智能运维管理平台</button>
  <button class="research-tab-btn" data-tab="bid">标讯信息智能分析平台</button>
</div>

<!-- 产品内容容器 -->
<div class="research-products-wrapper">
  <div class="research-product-panel active" id="product-aml">...</div>
  <div class="research-product-panel" id="product-ops">...</div>
  <div class="research-product-panel" id="product-bid">...</div>
</div>
```

### 目标结构
```astro
<!-- 3D轮播容器 -->
<div class="product-3d-swiper">
  <!-- Swiper容器 -->
  <div class="swiper" id="product-swiper">
    <div class="swiper-wrapper">
      <!-- Slide 1: 反洗钱 -->
      <div class="swiper-slide">
        <div class="product-slide-content" id="product-aml">
          <!-- 原有产品内容 -->
        </div>
      </div>

      <!-- Slide 2: 运维 -->
      <div class="swiper-slide">
        <div class="product-slide-content" id="product-ops">
          <!-- 原有产品内容 -->
        </div>
      </div>

      <!-- Slide 3: 标讯 -->
      <div class="swiper-slide">
        <div class="product-slide-content" id="product-bid">
          <!-- 原有产品内容 -->
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>

  <!-- 自动播放进度条 -->
  <div class="swiper-progress">
    <div class="swiper-progress-bar"></div>
  </div>

  <!-- 产品名称指示器（可选） -->
  <div class="swiper-product-names">
    <span class="product-name active" data-index="0">反洗钱智能管理系统</span>
    <span class="product-name" data-index="1">昆仑智能运维管理平台</span>
    <span class="product-name" data-index="2">标讯信息智能分析平台</span>
  </div>
</div>
```

---

## 四、样式实现（SCSS）

### 文件位置
`src/styles/research-center.scss`

### 新增样式

```scss
// ========== 3D产品轮播 ==========
.product-3d-swiper {
  position: relative;
  padding: 60px 20px 80px; // 为3D效果留出空间
  overflow: hidden;
}

// Swiper容器
#product-swiper {
  width: 100%;
  padding-top: 40px;
  padding-bottom: 40px;
}

// Swiper Slide
.swiper-slide {
  // 基础样式
  opacity: 0.4;
  transition: all 0.5s ease;
  transform: scale(0.85);

  // 当前激活的slide
  &.swiper-slide-active {
    opacity: 1;
    transform: scale(1);
  }

  // 下一个slide
  &.swiper-slide-next {
    opacity: 0.6;
    transform: scale(0.9) translateX(50px);
  }

  // 上一个slide
  &.swiper-slide-prev {
    opacity: 0.6;
    transform: scale(0.9) translateX(-50px);
  }
}

// 产品内容容器
.product-slide-content {
  @extend .glass-morphism;
  border-radius: 20px;
  padding: 32px;
  height: 100%;
  overflow-y: auto;
  max-height: 600px;

  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 3px;

    &:hover {
      background: rgba(59, 130, 246, 0.8);
    }
  }
}

// 分页器（圆点）
.swiper-pagination {
  bottom: 20px !important;

  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.3);
    opacity: 1;
    transition: all 0.3s ease;

    &.swiper-pagination-bullet-active {
      width: 30px;
      border-radius: 5px;
      background: linear-gradient(90deg, #3b82f6, #22d3ee);
    }
  }
}

// 导航按钮
.swiper-button-prev,
.swiper-button-next {
  width: 44px;
  height: 44px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  color: #60a5fa;
  transition: all 0.3s ease;

  &:after {
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
    transform: scale(1.1);
  }
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}

// 自动播放进度条
.swiper-progress {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.swiper-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #3b82f6, #22d3ee);
  border-radius: 2px;

  // 暂停状态
  &.paused {
    animation: none;
  }

  // 进度动画（5秒）
  &.animating {
    animation: progress 5s linear;
  }

  // 立即完成（用于手动切换时）
  &.complete {
    width: 100%;
    transition: width 0.3s ease;
  }
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

// 产品名称指示器
.swiper-product-names {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  padding: 0 24px;

  @include respond-to($breakpoint-md) {
    gap: 48px;
  }
}

.product-name {
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #22d3ee);
    transition: width 0.3s ease;
  }

  &.active {
    color: #60a5fa;
    font-weight: 600;

    &::after {
      width: 100%;
    }
  }

  &:hover {
    color: #94a3b8;
  }
}
```

---

## 五、JavaScript实现

### Swiper配置

```javascript
import Swiper from 'swiper';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';

// 导入Swiper样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// 初始化Swiper
const productSwiper = new Swiper('#product-swiper', {
  // 启用模块
  modules: [Navigation, Pagination, EffectCoverflow, Autoplay],

  // 3D Coverflow效果
  effect: 'coverflow',
  coverflowEffect: {
    rotate: 30,           // 旋转角度
    stretch: 0,           // 拉伸值
    depth: 100,           // 深度
    modifier: 1,          // 修正值
    slideShadows: false,  // 幻灯片阴影
  },

  // 循环模式
  loop: true,

  // 自动播放
  autoplay: {
    delay: 5000,          // 5秒切换
    disableOnInteraction: false, // 用户交互后不停止
    pauseOnMouseEnter: true,     // 鼠标悬停时暂停
  },

  // 分页器
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // 导航按钮
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // 触摸设置
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,

  // 键盘控制
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },

  // 过渡效果
  speed: 600,
  grabCursor: true,
});
```

### 自定义进度条逻辑

```javascript
// 自定义进度条管理器
class SwiperProgressBar {
  constructor(swiper, options = {}) {
    this.swiper = swiper;
    this.delay = options.delay || 5000;
    this.progressBar = document.querySelector('.swiper-progress-bar');
    this.isPaused = false;

    this.init();
  }

  init() {
    // 监听Swiper事件
    this.swiper.on('slideChange', this.onSlideChange.bind(this));
    this.swiper.on('autoplayStart', this.onAutoplayStart.bind(this));
    this.swiper.on('autoplayStop', this.onAutoplayStop.bind(this));

    // 监听鼠标事件
    const swiperEl = this.swiper.el;
    swiperEl.addEventListener('mouseenter', this.pause.bind(this));
    swiperEl.addEventListener('mouseleave', this.resume.bind(this));

    // 启动初始动画
    this.startAnimation();
  }

  onSlideChange() {
    // 切换slide时重置进度条
    this.resetAnimation();
    this.startAnimation();
    this.updateProductNames();
  }

  onAutoplayStart() {
    this.isPaused = false;
    this.startAnimation();
  }

  onAutoplayStop() {
    this.isPaused = true;
    this.pauseAnimation();
  }

  startAnimation() {
    if (!this.progressBar) return;

    // 移除所有状态类
    this.progressBar.classList.remove('paused', 'complete', 'animating');

    // 强制重绘以重置动画
    void this.progressBar.offsetWidth;

    // 添加动画类
    this.progressBar.classList.add('animating');
  }

  pauseAnimation() {
    if (!this.progressBar) return;
    this.progressBar.classList.add('paused');
  }

  resetAnimation() {
    if (!this.progressBar) return;

    // 计算当前进度并立即完成
    const computedStyle = window.getComputedStyle(this.progressBar);
    const currentWidth = computedStyle.width;

    this.progressBar.classList.remove('animating');
    this.progressBar.style.width = currentWidth;
    this.progressBar.classList.add('complete');

    // 短暂延迟后重置
    setTimeout(() => {
      this.progressBar.classList.remove('complete');
      this.progressBar.style.width = '';
    }, 300);
  }

  pause() {
    this.isPaused = true;
    this.swiper.autoplay.stop();
    this.pauseAnimation();
  }

  resume() {
    this.isPaused = false;
    this.swiper.autoplay.start();
    this.startAnimation();
  }

  updateProductNames() {
    const activeIndex = this.swiper.realIndex;
    const productNames = document.querySelectorAll('.product-name');

    productNames.forEach((name, index) => {
      if (index === activeIndex) {
        name.classList.add('active');
      } else {
        name.classList.remove('active');
      }
    });
  }
}

// 初始化进度条
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = new SwiperProgressBar(productSwiper, {
    delay: 5000
  });
});
```

### 产品名称点击跳转

```javascript
// 产品名称点击跳转
document.querySelectorAll('.product-name').forEach((name, index) => {
  name.addEventListener('click', () => {
    productSwiper.slideTo(index, 600);
  });
});
```

---

## 六、完整执行步骤

### 步骤1：安装Swiper.js

```bash
cd c:/Users/Administrator/Desktop/website
npm install swiper
```

### 步骤2：修改 ResearchCenter.astro

#### 2.1 添加Swiper导入
在文件顶部的 `---` 前置代码区域添加：

```astro
---
import Swiper from 'swiper';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
---
```

#### 2.2 替换产品Tab切换器区域
找到 `<!-- 产品Tab切换器 -->` 注释，将以下内容：

```astro
<!-- 产品Tab切换器 -->
<div class="research-tabs">
  <button class="research-tab-btn active" data-tab="aml">...</button>
  <button class="research-tab-btn" data-tab="ops">...</button>
  <button class="research-tab-btn" data-tab="bid">...</button>
</div>

<!-- 产品内容容器 -->
<div class="research-products-wrapper">
  <div class="research-product-panel active" id="product-aml">...</div>
  <div class="research-product-panel" id="product-ops">...</div>
  <div class="research-product-panel" id="product-bid">...</div>
</div>
```

替换为：

```astro
<!-- 3D产品轮播 -->
<div class="product-3d-swiper">
  <div class="swiper" id="product-swiper">
    <div class="swiper-wrapper">
      <!-- Slide 1 -->
      <div class="swiper-slide">
        <div class="product-slide-content">
          <!-- 将原 product-aml 的内容移到这里 -->
        </div>
      </div>

      <!-- Slide 2 -->
      <div class="swiper-slide">
        <div class="product-slide-content">
          <!-- 将原 product-ops 的内容移到这里 -->
        </div>
      </div>

      <!-- Slide 3 -->
      <div class="swiper-slide">
        <div class="product-slide-content">
          <!-- 将原 product-bid 的内容移到这里 -->
        </div>
      </div>
    </div>

    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>

  <div class="swiper-progress">
    <div class="swiper-progress-bar"></div>
  </div>

  <div class="swiper-product-names">
    <span class="product-name active" data-index="0">反洗钱智能管理系统</span>
    <span class="product-name" data-index="1">昆仑智能运维管理平台</span>
    <span class="product-name" data-index="2">标讯信息智能分析平台</span>
  </div>
</div>
```

#### 2.3 替换<script>部分
找到原有的Tab切换脚本，替换为新的Swiper脚本：

```astro
<script>
  import Swiper from 'swiper';
  import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import 'swiper/css/effect-coverflow';

  // 初始化Swiper
  const productSwiper = new Swiper('#product-swiper', {
    modules: [Navigation, Pagination, EffectCoverflow, Autoplay],
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    speed: 600,
    grabCursor: true,
  });

  // 进度条管理器
  class SwiperProgressBar {
    constructor(swiper, options = {}) {
      this.swiper = swiper;
      this.delay = options.delay || 5000;
      this.progressBar = document.querySelector('.swiper-progress-bar');

      this.swiper.on('slideChange', this.onSlideChange.bind(this));
      this.swiper.on('autoplayStart', () => this.startAnimation());
      this.swiper.on('autoplayStop', () => this.pauseAnimation());

      const swiperEl = this.swiper.el;
      swiperEl.addEventListener('mouseenter', () => this.pause());
      swiperEl.addEventListener('mouseleave', () => this.resume());

      this.startAnimation();
    }

    onSlideChange() {
      this.resetAnimation();
      this.startAnimation();
      this.updateProductNames();
    }

    startAnimation() {
      if (!this.progressBar) return;
      this.progressBar.classList.remove('paused', 'complete', 'animating');
      void this.progressBar.offsetWidth;
      this.progressBar.classList.add('animating');
    }

    pauseAnimation() {
      if (!this.progressBar) return;
      this.progressBar.classList.add('paused');
    }

    resetAnimation() {
      if (!this.progressBar) return;
      this.progressBar.classList.remove('animating');
      this.progressBar.classList.add('complete');
      setTimeout(() => {
        this.progressBar.classList.remove('complete');
      }, 300);
    }

    pause() {
      this.swiper.autoplay.stop();
      this.pauseAnimation();
    }

    resume() {
      this.swiper.autoplay.start();
      this.startAnimation();
    }

    updateProductNames() {
      const activeIndex = this.swiper.realIndex;
      document.querySelectorAll('.product-name').forEach((name, index) => {
        name.classList.toggle('active', index === activeIndex);
      });
    }
  }

  // 初始化进度条
  new SwiperProgressBar(productSwiper, { delay: 5000 });

  // 产品名称点击跳转
  document.querySelectorAll('.product-name').forEach((name, index) => {
    name.addEventListener('click', () => {
      productSwiper.slideTo(index, 600);
    });
  });
</script>
```

### 步骤3：添加样式到 research-center.scss

在 `src/styles/research-center.scss` 文件末尾添加上面"样式实现"部分的完整样式。

### 步骤4：删除旧样式

在 `research-center.scss` 中删除以下不再需要的旧样式：
- `.research-tabs`
- `.research-tab-btn`
- `.research-product-panel`
- `.research-products-wrapper`

### 步骤5：测试

```bash
npm run dev
```

访问 http://localhost:4322/research 并验证：
1. 3D效果正常显示
2. 自动播放每5秒切换一次
3. 鼠标悬停时暂停
4. 左右箭头可以切换
5. 圆点指示器可以点击
6. 产品名称可以点击跳转
7. 进度条动画正常

---

## 七、文件修改清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `package.json` | 修改 | 添加swiper依赖 |
| `src/components/ResearchCenter.astro` | 重构 | 替换Tab区域为Swiper结构 |
| `src/styles/research-center.scss` | 修改 | 添加Swiper样式，删除旧Tab样式 |

---

## 八、验收标准

### 功能验收
- [ ] 页面加载后显示3D轮播效果
- [ ] 每5秒自动切换到下一张卡片
- [ ] 鼠标悬停时自动播放暂停
- [ ] 鼠标移开后自动播放恢复
- [ ] 进度条显示当前倒计时
- [ ] 点击左右箭头可以手动切换
- [ ] 点击圆点指示器可以跳转
- [ ] 点击产品名称可以跳转
- [ ] 支持键盘左右方向键切换
- [ ] 支持触摸滑动切换（移动端）

### 视觉验收
- [ ] 中间卡片完全显示，两侧卡片倾斜
- [ ] 切换动画流畅（600ms）
- [ ] 当前激活的卡片有高亮效果
- [ ] 非激活卡片有透明度和缩放效果
- [ ] 进度条动画平滑
- [ ] 产品名称指示器有下划线动画

### 性能验收
- [ ] Swiper.js正确加载
- [ ] 无控制台错误
- [ ] 移动端滑动流畅
- [ ] 自动播放不会因为用户交互而停止

---

## 九、注意事项

### 兼容性
1. **浏览器支持**：Swiper支持现代浏览器，IE11需要polyfill
2. **移动端**：确保触摸事件正常工作
3. **Astro SSR**：Swiper的客户端脚本需要正确加载

### 优化建议
1. **按需导入**：只导入需要的Swiper模块
2. **懒加载**：产品内容中的图片可以添加懒加载
3. **性能监控**：使用Lighthouse检测性能影响

### 可选增强
1. 添加切换音效
2. 添加视差背景效果
3. 支持URL参数控制初始显示哪个产品
4. 添加分享功能（当前产品的永久链接）

---

## 十、故障排查

### 问题1：Swiper样式不生效
**原因**：CSS没有正确导入
**解决**：检查`import`语句是否在`<script>`标签内

### 问题2：自动播放不工作
**原因**：可能与Astro的客户端加载有关
**解决**：确保脚本在`DOMContentLoaded`后执行

### 问题3：3D效果不明显
**原因**：容器高度不够
**解决**：增加`.product-3d-swiper`的padding

### 问题4：进度条动画不同步
**原因**：CSS动画和Swiper的autoplay时间不一致
**解决**：确保两者都是5000ms

---

## 十一、时间估算

| 任务 | 预计时间 |
|------|----------|
| 安装Swiper | 5分钟 |
| 修改HTML结构 | 20分钟 |
| 编写SCSS样式 | 30分钟 |
| 编写JavaScript逻辑 | 30分钟 |
| 测试调试 | 30分钟 |
| **总计** | **约2小时** |

---

## 十二、参考资源

- [Swiper.js官方文档](https://swiperjs.com/)
- [Coverflow Effect参数说明](https://swiperjs.com/swiper-api#effect-coverflow)
- [Autoplay参数说明](https://swiperjs.com/swiper-api#autoplay)

---

**文档生成时间**：2026-04-13
**状态**：待执行
**优先级**：高
