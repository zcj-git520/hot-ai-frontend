export interface ToolCategory {
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

export interface Tool {
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

export interface ToolListResponse {
  code: number
  message: string
  data: {
    list: Tool[]
    total: number
    page: number
    page_size: number
  }
}

export interface ToolDetailResponse {
  code: number
  message: string
  data: Tool
}

export interface ToolCategoryListResponse {
  code: number
  message: string
  data: ToolCategory[]
}