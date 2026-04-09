import { defineConfig } from 'astro/config';

export default defineConfig({
  // 站点配置
  site: 'https://your-domain.com', // 替换为你的域名

  // 图片优化配置
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    // 远程图片域名白名单（允许优化外部图片）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'modao.cc',
      }
    ]
  },

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    // 构建优化
    build: {
      cssCodeSplit: true,
      minify: 'esbuild'
    }
  },

  // 构建配置
  output: 'static', // 静态站点生成（最快）
});
