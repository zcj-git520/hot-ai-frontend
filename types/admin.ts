// Admin 模块相关类型定义

// ===== 学习路径相关 =====

export type LearningPathDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type LearningPathStatus = 0 | 1 | 2  // 0-待发布, 1-已发布, 2-已删除

export interface LearningPathFormData {
  title: string
  icon?: string
  description?: string
  difficulty: LearningPathDifficulty
  level_label?: string
  learning_goals?: string[]
  target_audience?: string[]
  estimated_days?: number
  estimated_hours?: number
  cover_image?: string
  is_featured?: boolean
  sort_order?: number
}

export interface LearningPathListItem {
  id: number
  title: string
  slug: string
  icon?: string
  description: string
  difficulty: LearningPathDifficulty
  level_label: string
  estimated_days: number
  estimated_hours: number
  chapter_count: number
  cover_image?: string
  is_featured: boolean
  status: LearningPathStatus
  published_at?: string
  created_at: string
  updated_at: string
}

export interface LearningPathDetail extends LearningPathListItem {
  learning_goals?: string[]
  target_audience?: string[]
  student_count?: number
  chapters?: PathChapterListItem[]
}

// ===== 章节相关 =====

export type ChapterContentType = 'article' | 'video' | 'exercise'
export type ChapterStatus = 1 | 2  // 1-正常, 2-已删除

export interface ChapterFormData {
  title: string
  description?: string
  content_type: ChapterContentType
  content?: string
  video_url?: string
  external_links?: string[]
  estimated_hours?: number
  is_free?: boolean
}

export interface PathChapterListItem {
  id: number
  path_id: number
  title: string
  slug: string
  description: string
  content_type: ChapterContentType
  estimated_hours: number
  order_index: number
  is_free: boolean
  status: ChapterStatus
}

export interface PathChapterDetail extends PathChapterListItem {
  content?: string
  video_url?: string
  external_links?: string[]
  created_at: string
  updated_at: string
}

// ===== API 响应类型 =====

export interface AdminLearningPathListResponse {
  list: LearningPathListItem[]
  total: number
  page: number
  page_size: number
}

export interface AdminChapterListResponse {
  list: PathChapterListItem[]
  total: number
}

// ===== 查询参数类型 =====

export interface LearningPathQueryParams {
  page?: number
  pageSize?: number
  difficulty?: LearningPathDifficulty
  status?: LearningPathStatus
  search?: string
}

export interface ChapterQueryParams {
  page?: number
  pageSize?: number
}
