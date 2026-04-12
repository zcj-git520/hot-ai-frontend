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

// 工具相关类型
declare module 'nitropack' {
  interface NitroRouteConfig {
    ssr?: boolean
  }
}

// 工具API类型
declare global {
  interface ToolCategory {
    id: number
    name: string
    slug: string
    icon: string
    description: string
    sort_order: number
    featured: boolean
    status: number
    created_at: string
    updated_at: string
  }

  interface Tool {
    id: number
    name: string
    slug: string
    icon: string
    description: string
    official_url: string
    documentation_url: string
    pricing: string
    pricing_description: string
    category_id: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    rating: number
    review_count: number
    view_count: number
    popularity: number
    tags: string | number[]
    featured: boolean
    status: number
    created_at: string
    updated_at: string
  }

  interface ToolListResponse {
    code: number
    message: string
    data: {
      list: Tool[]
      total: number
      page: number
      page_size: number
    }
  }

  interface ToolDetailResponse {
    code: number
    message: string
    data: Tool
  }

  interface ToolCategoryListResponse {
    code: number
    message: string
    data: ToolCategory[]
  }
}
