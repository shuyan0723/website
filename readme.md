技术栈与项目规范
核心框架
技术	版本	用途
Astro	^4.16.10	主框架，用于构建静态站点
React	^18.3.1	UI组件库
React DOM	^18.3.1	React DOM渲染
集成插件
插件	版本	用途
@astrojs/react	^3.6.2	Astro与React集成
@astrojs/ts-plugin	^1.10.4	Astro TypeScript支持
开发工具
工具	版本	用途
TypeScript	^5.7.2	类型系统
@types/react	^18.3.12	React类型定义
@types/react-dom	^18.3.1	React DOM类型定义
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
混合渲染架构 - Astro作为岛架构框架，React用于交互组件
ES Modules - 使用 type: "module" 纯ES模块
TypeScript优先 - 全项目TypeScript支持
零额外UI库 - 无Tailwind、无CSS框架，原生CSS或Astro CSS
复用此技术栈的命令

npm create astro@latest my-project -- --template minimal --no-install --no-git
npm install @astrojs/react react react-dom
npx astro add react
npm install -D typescript @types/react @types/react-dom# website
