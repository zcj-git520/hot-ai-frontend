// API 响应类型定义

export interface UserInfo {
  id: string
  email: string
  nickname: string
  avatar: string
  roles: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: UserInfo
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
  verification_code: string
}

export interface RegisterResponse {
  user_id: string
  message: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}

export interface CommonResponse<T = any> {
  code: number
  message: string
  data: T | null
}

export interface SendRegistrationCodeResponse {
  message: string
  email: string
  expires_in: number
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar: string
  bio?: string
  preferences?: {
    theme: string
    email_notifications: {
      system_update: boolean
      new_content: boolean
      weekly_digest: boolean
    }
  }
}

// 学习路径相关类型
export interface LearningPath {
  id: number
  title: string
  slug: string
  icon?: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  level_label: string
  learning_goals?: string[]
  target_audience?: string[]
  estimated_days: number
  estimated_hours: number
  chapter_count: number
  student_count: number
  cover_image?: string
  is_featured: boolean
  published_at?: string
  chapters?: PathChapter[]
}

export interface PathChapter {
  id: number
  path_id: number
  title: string
  slug: string
  description: string
  content_type: 'article' | 'video' | 'practice' | 'external'
  content?: string
  video_url?: string
  external_links?: string[]
  estimated_hours: number
  order_index: number
  is_free: boolean
}

export interface LevelInfo {
  id: string
  level: string
  name: string
  icon: string
  description: string
  color: string
  min_hours: number
  max_hours: number
}

export interface LearningProgress {
  id: number
  user_id: string
  session_id?: string
  path_id: number
  chapter_id: number
  status: 'in_progress' | 'completed'
  completed_at?: string
  time_spent: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface PathDashboard {
  path: LearningPath
  chapters: PathChapter[]
  completed_chapters: number[]
  progress: {
    total_chapters: number
    completed_count: number
    progress_percentage: number
  }
}

// API 请求/响应类型
export interface GetLearningPathsResponse {
  list: LearningPath[]
  total: number
  page: number
}

export interface SaveProgressRequest {
  user_id: string
  session_id?: string
  path_id: number
  chapter_id: number
  status: 'in_progress' | 'completed'
  time_spent?: number
  notes?: string
}
