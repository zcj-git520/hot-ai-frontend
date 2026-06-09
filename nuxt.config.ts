// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // SPA 模式 — 关掉 SSR。所有页面纯客户端渲染。
  // 理由: 部署形态是 nginx 静态托管 .output/public/ (而不是 nginx 反代到 Nuxt Node 服务器)，
  // 硬约束 "nginx 是唯一入口, 不能前端的代理" 才能 100% 满足。
  //   - 没有 Node SSR 进程 → :3000 这个 Nuxt dev 旁路在生产里压根不需要
  //   - HTML 全部从 .output/public/*.html 静态服务, Nginx 直接 root ... try_files
  //   - useFetch 改在 onMounted 阶段 (客户端) 跑, 走当前 origin /api/... → nginx → 后端
  // dev 模式仍然用 pnpm dev 起 SSR server (本地改代码用), 但生产只看 .output/public/
  ssr: false,

  // 模块
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // 运行时配置 - 通过Nginx代理访问微服务
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost/api',
      siteName: process.env.NUXT_SITE_NAME || 'AI 热点追踪平台',
    },
  },

  // App 配置
  app: {
    head: {
      title: 'AI 热点追踪平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI 时代的职业导航仪 - 帮助普通人理解 AI、应对 AI、利用 AI' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    // Enable file-based routing using pages directory
    pages: 'auto',
  },

  // Vite 配置
  vite: {
    optimizeDeps: {
      include: ['axios'],
    },
    // 监听 IPv4 loopback (127.0.0.1:3000) — 同时支持 nginx (本机 [::1]:80 来的请求) 和
    // 用户的端口转发 (8.130.23.164:3000 → 127.0.0.1:3000)。注意: 监听 127.0.0.1 (不是 0.0.0.0)
    // 仍然只接受本机请求, 不会暴露到外网。
    server: {
      host: '127.0.0.1',
      // Vite 5+ 默认只允许 Host: localhost / 127.0.0.1 / [::1] / 当前 server.host
      // 用户从 http://8.130.23.164:3000 进来, Host header 是 8.130.23.164:3000,
      // 不在白名单 → 整个请求 404 (HTML 都没法返回)。打开 allowedHosts 让它接受。
      // 注意: 这是 dev 模式, 接受任意 Host 没问题; 生产用 pnpm build + nginx 静态托管, 走不到这里。
      allowedHosts: true,
      // HMR WebSocket 配置:
      // 通过 nginx 访问 (http://localhost/) 时, Vite 默认想连 ws://localhost:5173/_nuxt/?token=...
      // 但 5173 没人在听, Nuxt dev 实际在 127.0.0.1:3000
      // 用 clientPort: 3000 + host: 'localhost' 让 client 直接连 Nuxt dev
      // 配合 nginx 的 Upgrade/Connection 头, WebSocket 升级能正常转过去
      hmr: {
        host: 'localhost',
        clientPort: 3000,
        protocol: 'ws',
      },
    },
  },

  // 启用 app manifest - 让 nuxt/dist/app/composables/manifest.js 里的
  // `import("#app-manifest")` 解析得到虚拟模块, 避免 Vite import-analysis 报
  // "Failed to resolve import #app-manifest"
  experimental: {
    appManifest: true,
  },

  // 开发服务器 — 端口 3000, 监听 IPv4 loopback (跟 vite.server.host 保持一致)
  devServer: {
    port: 3000,
    host: '127.0.0.1',
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Nitro 配置
  nitro: {
    compressPublicAssets: false,
    routeRules: {
      '/admin/**': { ssr: false },
      '/api/**': { cors: false, headers: { 'Content-Type': 'application/json' } },
    },
  },
})