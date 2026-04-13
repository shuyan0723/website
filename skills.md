# 研发中心模块重构计划

## 概述
将 `research-center-section.html` 转换为 Astro 组件，并替换 `src/pages/research.astro` 中的现有研发中心模块内容（第 11-106 行）。

## 源文件分析
**文件**: `research-center-section.html`
- **结构**: 单一 HTML 文件，包含完整的研发中心模块
- **样式**: 114 行内联 CSS (`<style>` 标签)
- **脚本**: 77 行 JavaScript (`<script>` 标签)
- **外部依赖**:
  - Tailwind CSS CDN
  - Iconify Icon CDN
- **模块组成**:
  1. 研发中心简介（Hero 入口）
  2. 核心技术（四大支柱网格）
  3. 研发团队（人才实力展示）
  4. 专利与资质（荣誉背书）
  5. 研发成果（产品研发历程 Tab 切换）

## 目标文件分析
**文件**: `src/pages/research.astro` (第 11-106 行)
- **当前样式**: 使用 `src/styles/research.scss`
- **当前内容**: 简化的研发中心模块
  - 头部标题区
  - 核心技术与专利
  - 环境与人才卡片
  - 技术规划蓝图

## 实施计划

### 阶段 1: 创建 Astro 组件
**文件**: `src/components/ResearchCenter.astro`

#### 1.1 组件结构
```astro
---
// ResearchCenter.astro
---

<template>
  <!-- 研发中心主模块 -->
  <section class="py-24 scroll-mt-20 overflow-hidden relative" id="research-center">
    <!-- ... 内容 ... -->
  </section>
</template>

<style>
  /* 从 HTML 提取的样式，转换为项目 SCSS 变量 */
</style>

<script>
  /* 客户端交互脚本 */
</script>
```

#### 1.2 HTML 转换要点
- 移除 `<html>`, `<head>`, `<body>` 标签
- 保留 `<section>` 作为根元素
- 保留 `id="research-center"` 用于锚点导航

### 阶段 2: 样式迁移策略

#### 2.1 依赖处理
**问题**: HTML 使用 Tailwind CSS CDN
**解决方案**:
- **选项 A**: 项目已配置 Tailwind，直接使用 Tailwind 类名
- **选项 B**: 将 Tailwind 类转换为项目 SCSS 变量和样式

**推荐**: 选项 A - 保持 Tailwind 类名，确保项目已配置 Tailwind

#### 2.2 样式转换映射表

| HTML 原始样式 | 转换后 SCSS | 说明 |
|--------------|------------|------|
| `background-color: #020617` | `background: $bg-dark` | 使用项目变量 |
| `color: #f8fafc` | `color: $bg-white` | 使用项目变量 |
| `.glass-morphism` | 保留或转换为 mixin | 玻璃态效果 |
| `.tech-gradient-text` | 保留核心渐变 | 渐变文字 |
| `@keyframes float` | 迁移到全局或组件 | 浮动动画 |

#### 2.3 新增样式文件
**文件**: `src/styles/research-center.scss`
- 从 HTML `<style>` 提取自定义样式
- 转换颜色为 SCSS 变量
- 转换响应式断点为项目 mixin

### 阶段 3: 脚本迁移

#### 3.1 脚本功能清单
| 功能 | 行数 | 复杂度 |
|------|------|--------|
| 数字滚动动画 | ~15 | 低 |
| 滚动触发观察器 | ~20 | 中 |
| Tab 切换功能 | ~25 | 中 |
| 时间轴线动画 | ~10 | 低 |

#### 3.2 迁移策略
```astro
<script define:vars={{ ... }}>
  // 保留现有交互逻辑
</script>
```

### 阶段 4: 图标处理

#### 4.1 当前方案
HTML 使用 Iconify Icon CDN:
```html
<iconify-icon icon="mdi:database-lock"></iconify-icon>
```

#### 4.2 替代方案
- **选项 A**: 继续使用 Iconify（需在 Astro 中配置）
- **选项 B**: 转换为 SVG 内联
- **选项 C**: 使用项目现有图标系统

**推荐**: 选项 A - 配置 `@iconify-icon/react` 或保持 CDN

### 阶段 5: 页面集成

#### 5.1 修改 `research.astro`
```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import ResearchCenter from '../components/ResearchCenter.astro';  // 新增
---

<Layout title="研发中心 - 企业官网">
  <div class="page-container">
    <Navbar />
    
    <!-- 替换原有内容 -->
    <ResearchCenter />
    
    <Footer />
  </div>
</Layout>

<style>
  @import '../styles/research-center.scss';  // 更新导入
</style>
```

## 文件清单

### 新建文件
| 文件路径 | 说明 |
|---------|------|
| `src/components/ResearchCenter.astro` | 研发中心组件 |
| `src/styles/research-center.scss` | 组件样式 |

### 修改文件
| 文件路径 | 修改内容 |
|---------|---------|
| `src/pages/research.astro` | 导入组件，替换第 11-106 行 |

### 可删除文件
| 文件路径 | 说明 |
|---------|------|
| `research-center-section.html` | 原始 HTML 文件（迁移后） |
| `src/styles/research.scss` | 旧样式文件（如无其他引用） |

## 注意事项

### 兼容性
1. ✅ 确保 Tailwind CSS 已在项目中配置
2. ✅ 验证 Iconify 图标库可用性
3. ✅ 测试响应式断点与项目一致

### 性能
1. 考虑将滚动动画使用 `IntersectionObserver` 优化
2. 图片使用 Astro `Image` 组件优化加载
3. 脚本使用 `define:vars` 减少客户端体积

### 可访问性
1. 确保所有交互元素有键盘支持
2. 添加适当的 ARIA 标签
3. 验证颜色对比度

## 验收标准

- [ ] 组件正确渲染所有 5 个模块
- [ ] Tab 切换功能正常工作
- [ ] 数字滚动动画在滚动到可视区域时触发
- [ ] 响应式布局在移动端、平板、桌面端正常
- [ ] 样式与 HTML 原始效果一致
- [ ] 无控制台错误或警告
- [ ] 页面加载性能良好（Lighthouse > 90）

## 预估工作量
- 组件创建: 30 分钟
- 样式迁移: 45 分钟
- 脚本迁移: 30 分钟
- 测试调试: 30 分钟
- **总计**: 约 2 小时

---

**生成时间**: 2026-04-13
**状态**: 待执行
