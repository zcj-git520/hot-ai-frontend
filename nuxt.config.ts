// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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
    // 开发服务器代理配置 - 通过环境变量配置后端地址，由 nginx 按路径分发到各微服务
    server: {
      proxy: (() => {
        const baseUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost/api'
        // 提取 host 部分 (如 http://localhost -> http://localhost)
        const url = new URL(baseUrl)
        const target = `${url.protocol}//${url.host}`
        return {
          '/api': { target, changeOrigin: true },
          '/auth': { target, changeOrigin: true },
          '/user': { target, changeOrigin: true },
          '/admin': {
            target: 'http://localhost:8006',
            changeOrigin: true,
            bypass(req) {
              // 页面请求走 Nuxt，API 请求走代理到 admin-svc
              const accept = req.headers.accept || ''
              if (accept.includes('text/html')) {
                return req.url || '/admin'
              }
            },
          },
        }
      })(),
    },
  },

  // 开发服务器
  devServer: {
    port: 3000,
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Nitro 配置
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/admin/**': { ssr: false },
    },
  },
})