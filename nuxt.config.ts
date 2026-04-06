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

  // 运行时配置
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL ,
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
  },

  // Vite 配置
  vite: {
    optimizeDeps: {
      include: ['axios'],
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

  // Nitro
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/api/**': {
        proxy: 'http://localhost/api/**'
      }
    }
  },
})