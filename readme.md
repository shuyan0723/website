技术栈与项目规范
核心框架
技术	版本	用途
Astro	^4.16.10	主框架，用于构建静态站点
依赖
依赖	版本	用途
swiper	^12.1.3	轮播组件
开发工具
工具	版本	用途
TypeScript	^5.7.2	类型系统
sass	^1.99.0	CSS 预处理器
项目配置规范

{
  "type": "module",
  "scripts": {
    "dev": "astro dev",      // 开发服务器
    "start": "astro dev",    // 启动开发
    "build": "astro build",  // 生产构建
    "preview": "astro preview", // 预览构建结果
    "astro": "astro"         // Astro CLI
  }
}
架构特点
静态站点 - Astro 静态生成，纯 HTML/CSS/JS
ES Modules - 使用 type: "module" 纯ES模块
SCSS 样式 - 使用 Sass 预处理器
