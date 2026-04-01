/// <reference types="vite/client" />

/**
 * Nuxt 3 环境变量类型声明
 * 只有以 NUXT_ 开头的变量才会被自动加载
 */
interface ImportMetaEnv {
  readonly NUXT_PUBLIC_API_URL: string
  readonly NUXT_SITE_NAME: string
  readonly NUXT_JWT_SECRET: string
  readonly NUXT_JWT_REFRESH_SECRET: string
  readonly NUXT_DEBUG: string
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
