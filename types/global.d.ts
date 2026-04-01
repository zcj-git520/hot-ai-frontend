export {}

declare global {
  interface Window {
    nuxtApp?: any
  }
}

declare module '#app' {
  interface PageMeta {
    middleware?: string | string[]
  }
}

declare module 'nitropack' {
  interface NitroRouteConfig {
    ssr?: boolean
  }
}
