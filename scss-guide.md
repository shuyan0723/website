# SCSS 使用说明

本项目已配置 SCSS 支持，可以使用 SCSS 的所有特性来编写样式。

## 📁 文件结构

```
src/
├── styles/
│   ├── _variables.scss    # 全局变量和 mixins
│   └── global.scss        # 全局样式
├── components/
│   └── Navbar.scss        # 组件样式示例
└── layouts/
    └── Layout.astro        # 已导入 global.scss
```

## 🎨 使用方式

### 1. 在组件中使用 SCSS

```astro
---
// 你的组件代码
---

<div class="my-component">
  <h1>标题</h1>
</div>

<style>
  /* 导入 SCSS 文件 */
  @import '../styles/_variables.scss';
  
  .my-component {
    // 使用变量
    color: $primary-color;
    padding: $spacing-lg;
    
    // 使用 mixin
    @include flex-center;
    
    // 嵌套
    h1 {
      font-size: $font-2xl;
      
      &:hover {
        color: $primary-blue;
      }
    }
  }
</style>
```

### 2. 独立的 SCSS 文件

创建 `src/components/MyComponent.scss`:

```scss
@use '../styles/variables' as *;

.my-component {
  // 使用变量和 mixins
  background: $bg-white;
  padding: $spacing-xl;
  @include transition(all);
  
  // 嵌套
  &__title {
    font-size: $font-3xl;
    color: $text-dark;
  }
  
  // 响应式
  @include respond-below($breakpoint-md) {
    padding: $spacing-md;
  }
}
```

在组件中导入：

```astro
<style>
  @import '../components/MyComponent.scss';
</style>
```

## 🔧 可用变量

### 颜色
```scss
$primary-color: #3a4ed5;
$primary-blue: #3a78f5;
$text-dark: #111827;
$text-light: #64748b;
$bg-white: #ffffff;
$bg-gray: #f8fafc;
```

### 间距
```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### Mixins
```scss
@include flex-center;     // 居中对齐
@include flex-between;   // 两端对齐
@include transition();    // 过渡效果

@include respond-to($breakpoint-md);    // 最小宽度
@include respond-below($breakpoint-md); // 最大宽度
```

## 💡 SCSS 优势

1. **变量管理** - 统一管理颜色、间距等
2. **嵌套** - 更清晰的层级关系
3. **Mixins** - 复用常用样式
4. **函数** - 动态计算样式值
5. **导入** - 模块化组织样式

## 📝 示例

```scss
// 使用嵌套和变量
.card {
  background: $bg-white;
  border-radius: 16px;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  &__title {
    font-size: $font-xl;
    color: $text-dark;
  }
  
  &__content {
    padding: $spacing-lg;
  }
}
```
