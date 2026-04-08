import axios from 'axios'

// 使用 import.meta.env 直接读取环境变量（Nuxt 3 规范）
const API_BASE_URL = import.meta.env.NUXT_PUBLIC_API_URL || 'http://localhost/api'

// eslint-disable-next-line no-console
console.log('[API] Using baseURL:', API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 设置拦截器
const setupInterceptors = (client: typeof apiClient) => {
  client.interceptors.request.use(
    (config) => {
      // 从 localStorage 获取 token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('[API Request]', config.method?.toUpperCase(), config.url, 'Token:', token.substring(0, 20) + '...')
      } else {
        console.warn('[API Request] No token found for:', config.url)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      console.log('[API Response]', response.config.url, 'Success')
      return response.data
    },
    (error) => {
      console.error('[API Error]', error.config?.url, error.response?.status, error.response?.data)
      // 处理常见错误
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 未授权，清除本地认证信息并跳转到登录页
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')
              // 如果在客户端，跳转到登录页
              if (process.client) {
                window.location.href = '/login'
              }
            }
            break
          case 403:
            console.error('无权限访问')
            break
          case 404:
            console.error('资源不存在')
            break
          case 500:
            console.error('服务器错误')
            break
          default:
            console.error('请求失败')
        }
      }
      return Promise.reject(error)
    }
  )
}

setupInterceptors(apiClient)

// 导出 API 方法
export const articleApi = {
  getCategories() {
    return apiClient.get('/articles/categories')
  },
  getList(params?: { page?: number; pageSize?: number; category?: string }) {
    return apiClient.get('/articles', { params })
  },
  getById(id: string) {
    return apiClient.get(`/articles/${id}`)
  },
  create(data: any) {
    return apiClient.post('/articles', data)
  },
  update(id: string, data: any) {
    return apiClient.put(`/articles/${id}`, data)
  },
  delete(id: string) {
    return apiClient.delete(`/articles/${id}`)
  },
}

export const professionApi = {
  getList(params?: { page?: number; pageSize?: number; riskLevel?: string }) {
    return apiClient.get('/professions', { params })
  },
  getById(id: string) {
    return apiClient.get(`/professions/${id}`)
  },
  search(query: string) {
    return apiClient.get('/professions/search', { params: { q: query } })
  },
}

export const learningPathApi = {
  // 获取学习路径列表
  getList(params?: { page?: number; pageSize?: number; difficulty?: string }) {
    return apiClient.get('/learning-paths', { params })
  },
  // 获取推荐路径
  getFeatured(limit?: number) {
    return apiClient.get('/learning-paths/featured', { params: { limit } })
  },
  // 获取难度等级信息
  getLevels() {
    return apiClient.get('/learning-paths/levels')
  },
  // 根据 ID 获取学习路径详情
  getById(id: string | number) {
    return apiClient.get(`/learning-paths/id/${id}`)
  },
  // 根据 slug 获取学习路径详情
  getBySlug(slug: string) {
    return apiClient.get(`/learning-paths/slug/${slug}`)
  },
  // 获取路径的所有章节
  getChapters(pathId: string | number) {
    return apiClient.get(`/learning-paths/${pathId}/chapters`)
  },
  // 根据章节 ID 获取详情
  getChapterById(chapterId: string | number) {
    return apiClient.get(`/chapters/${chapterId}`)
  },
  // 根据 slug 获取章节详情
  getChapterBySlug(pathSlug: string, chapterSlug: string) {
    return apiClient.get(`/learning-paths/${pathSlug}/chapters/${chapterSlug}`)
  },
  // 获取路径学习仪表盘
  getDashboard(pathId: string | number, userId?: string) {
    return apiClient.get('/learning-paths/dashboard', {
      params: { path_id: pathId, user_id: userId }
    })
  },
  // 获取用户的学习进度
  getProgress(pathId: string | number, userId?: string) {
    return apiClient.get('/learning-paths/progress', {
      params: { path_id: pathId, user_id: userId }
    })
  },
  // 获取用户已完成的章节列表
  getCompletedChapters(pathId: string | number, userId?: string) {
    return apiClient.get('/learning-paths/completed-chapters', {
      params: { path_id: pathId, user_id: userId }
    })
  },
  // 保存学习进度
  saveProgress(data: {
    user_id: string
    session_id?: string
    path_id: number
    chapter_id: number
    status: 'in_progress' | 'completed'
    time_spent?: number
    notes?: string
  }) {
    return apiClient.post('/learning-paths/save-progress', data)
  },
}

export const toolApi = {
  getList(params?: { page?: number; pageSize?: number; category?: string }) {
    return apiClient.get('/tools', { params })
  },
  getById(id: string) {
    return apiClient.get(`/tools/${id}`)
  },
}

export const authApi = {
  sendRegistrationCode(email: string) {
    return apiClient.post('/auth/send-registration-code', { email })
  },
  register(data: { email: string; password: string; nickname: string; verification_code: string }) {
    return apiClient.post('/auth/register', data)
  },
  login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password })
  },
  refreshToken(refreshToken: string) {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken })
  },
  logout() {
    return apiClient.post('/auth/logout')
  },
  sendVerificationEmail(email: string) {
    return apiClient.post('/auth/send-verification-email', { email })
  },
}

export const userApi = {
  getProfile() {
    return apiClient.get('/user/profile')
  },
  updateProfile(data: any) {
    return apiClient.put('/user/profile', data)
  },
  updatePreferences(data: any) {
    return apiClient.put('/user/preferences', data)
  },
  changePassword(data: { old_password: string; new_password: string }) {
    return apiClient.post('/user/change-password', data)
  },
}

export default apiClient
