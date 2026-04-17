// ResearchCenter 组件客户端脚本

// 等待 DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResearchCenter);
} else {
  initResearchCenter();
}

function initResearchCenter() {
  // Tab切换功能
  const tabBtns = document.querySelectorAll('.research-tab-btn');
  const productPanels = document.querySelectorAll('.research-product-panel');
  let currentIndex = 0;
  let autoPlayInterval: number | null = null;

  function switchProduct(index: number) {
    const tabs = ['aml', 'ops', 'bid'];
    currentIndex = index;

    // 更新按钮样式
    tabBtns.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
        // 重置进度条动画
        const progressBar = btn.querySelector('.tab-progress') as HTMLElement;
        if (progressBar) {
          progressBar.style.animation = 'none';
          progressBar.offsetHeight; // 触发重排
          progressBar.style.animation = 'progressFill 2s linear infinite';
        }
      } else {
        btn.classList.remove('active');
        const progressBar = btn.querySelector('.tab-progress') as HTMLElement;
        if (progressBar) {
          progressBar.style.animation = 'none';
        }
      }
    });

    // 切换产品面板
    productPanels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('active');
        (panel as HTMLElement).style.animation = 'fadeIn 0.3s ease-out';
      } else {
        panel.classList.remove('active');
        (panel as HTMLElement).style.animation = '';
      }
    });

    // 打字机效果更新产品标题
    const activePanel = productPanels[index] as HTMLElement;
    const titleElement = activePanel.querySelector('.research-product-title') as HTMLElement;
    if (titleElement) {
      const originalText = titleElement.dataset.original || '';
      typewriterEffect(titleElement, originalText);
    }

    // 自动滚动到v2.0位置（约1/3处）
    setTimeout(() => {
      const wrapper = document.getElementById(`timeline-${tabs[index]}`);
      if (wrapper) {
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;
        wrapper.scrollLeft = (scrollWidth - clientWidth) / 3;
      }
    }, 100);
  }

  // 打字机效果
  function typewriterEffect(element: HTMLElement, text: string) {
    element.classList.add('typing');
    element.textContent = '';

    let i = 0;
    const speed = 80; // 打字速度（毫秒）

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          element.classList.remove('typing');
        }, 500);
      }
    }

    type();
  }

  // 自动切换功能
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % 3;
      switchProduct(currentIndex);
    }, 2000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // 绑定Tab点击事件（点击时暂停自动切换）
  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      stopAutoPlay();
      switchProduct(index);
      startAutoPlay();
    });
  });

  // 鼠标悬停暂停功能
  const tabsContainer = document.querySelector('.research-tabs');
  const productsWrapper = document.querySelector('.research-products-wrapper');

  // 暂停自动播放
  function pauseOnHover() {
    stopAutoPlay();
  }

  // 恢复自动播放
  function resumeOnLeave() {
    startAutoPlay();
  }

  // Tab区域悬停事件
  if (tabsContainer) {
    tabsContainer.addEventListener('mouseenter', pauseOnHover);
    tabsContainer.addEventListener('mouseleave', resumeOnLeave);
  }

  // 产品展示区域悬停事件
  if (productsWrapper) {
    productsWrapper.addEventListener('mouseenter', pauseOnHover);
    productsWrapper.addEventListener('mouseleave', resumeOnLeave);
  }

  // 启动自动切换
  startAutoPlay();

  // 初始化第一个产品标题的打字机效果和进度条
  setTimeout(() => {
    const firstTitle = document.querySelector('.research-product-panel.active .research-product-title') as HTMLElement;
    if (firstTitle) {
      const originalText = firstTitle.dataset.original || '';
      typewriterEffect(firstTitle, originalText);
    }

    // 初始化第一个Tab的进度条
    const activeTab = document.querySelector('.research-tab-btn.active');
    if (activeTab) {
      const progressBar = activeTab.querySelector('.tab-progress') as HTMLElement;
      if (progressBar) {
        progressBar.style.animation = 'progressFill 2s linear infinite';
      }
    }
  }, 300);

  // 时间线拖拽滑动功能
  const timelineAreas = document.querySelectorAll('.timeline-scroll-area');
  timelineAreas.forEach(area => {
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    area.addEventListener('mousedown', (e: Event) => {
      isDown = true;
      area.classList.add('active');
      const mouseEvent = e as MouseEvent;
      startX = mouseEvent.pageX - (area as HTMLElement).offsetLeft;
      scrollLeft = (area as HTMLElement).scrollLeft;
    });

    area.addEventListener('mouseleave', () => {
      isDown = false;
      area.classList.remove('active');
    });

    area.addEventListener('mouseup', () => {
      isDown = false;
      area.classList.remove('active');
    });

    area.addEventListener('mousemove', (e: Event) => {
      if (!isDown) return;
      e.preventDefault();
      const mouseEvent = e as MouseEvent;
      const x = mouseEvent.pageX - (area as HTMLElement).offsetLeft;
      const walk = (x - startX) * 2; // 滚动速度倍数
      (area as HTMLElement).scrollLeft = scrollLeft - walk;
    });
  });

  // 页面加载后默认滚动到v2.0
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

  // 淡入动画（保留原有滚动触发动画）
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.classList.contains('count-up')) {
          const target = parseInt((entry.target as HTMLElement).dataset.target || '0');
          animateCountUp(entry.target as HTMLElement, target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .count-up').forEach(el => {
    observer.observe(el);
  });

  function animateCountUp(element: HTMLElement, target: number, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toString();
      }
    }, 16);
  }
}
