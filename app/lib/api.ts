import axios from 'axios'

// 客户端: baseURL 留空, axios 会把 "/api/..." 拼到当前页面 origin 后面
//   - 浏览器打开 http://localhost/  → http://localhost/api/...  → nginx → 后端 ✅
//   - 浏览器打开 http://8.130.23.164/ → http://8.130.23.164/api/... → nginx → 后端 ✅
//   - 浏览器打开 http://localhost:3000/ (Nuxt dev, 没人这么做) → Nuxt 没 /api → 404
//     → 强制只能走 nginx, 满足 "必须走nginx代理" 的硬约束
// SSR: 用 http://localhost (NUXT_PUBLIC_API_URL 兜底) 走 nginx, 仅在 server-side 生效
const API_BASE_URL =
  (typeof window !== 'undefined')
    ? ''  // 浏览器端用相对路径, 跟当前 origin 走
    : (process.env.NUXT_PUBLIC_API_URL || 'http://localhost')

// eslint-disable-next-line no-console
console.log('[API] Using baseURL:', JSON.stringify(API_BASE_URL) || '(relative)', 'DEV:', process.dev)

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
        console.log('[API Request]', config.method?.toUpperCase(), config.url)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器 - 处理后端返回的 {code, data, message} 格式
  client.interceptors.response.use(
    (response) => {
      console.log('[API Response]', response.config.url, 'Success')
      const responseData = response.data

      // 如果响应包含 code、data、message 字段，说明是标准格式
      if (responseData && typeof responseData === 'object' && 'code' in responseData) {
        // 成功响应 (code === 200 或 0)
        if (responseData.code === 200 || responseData.code === 0) {
          return responseData.data
        } else {
          // 业务错误
          const error: any = new Error(responseData.message || '请求失败')
          error.code = responseData.code
          error.data = responseData.data
          return Promise.reject(error)
        }
      }

      // 兼容旧格式或非标准格式，直接返回数据
      return responseData
    },
    (error) => {
      console.error('[API Error]', error.config?.url, error.response?.status, error.response?.data)

      // 处理 HTTP 错误
      if (error.response) {
        const responseData = error.response.data

        // 如果错误响应也包含标准格式
        if (responseData && typeof responseData === 'object' && 'code' in responseData) {
          error.code = responseData.code
          error.message = responseData.message || error.message
        }

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
    return apiClient.get('/api/articles/categories')
  },
  getList(params?: { page?: number; pageSize?: number; category?: string }) {
    // Convert camelCase to snake_case for backend compatibility
    const backendParams: any = {
      page: params?.page || 1,
      page_size: params?.pageSize || 10,
    }
    if (params?.category) {
      backendParams.category = params.category
    }
    return apiClient.get('/api/articles', { params: backendParams })
  },
  getById(id: string) {
    return apiClient.get(`/api/articles/${id}`)
  },
  create(data: any) {
    return apiClient.post('/api/articles', data)
  },
  update(id: string, data: any) {
    return apiClient.put(`/api/articles/${id}`, data)
  },
  delete(id: string) {
    return apiClient.delete(`/api/articles/${id}`)
  },
}

export const professionApi = {
  getList(params?: { page?: number; pageSize?: number; riskLevel?: string }) {
    // Convert camelCase to snake_case for backend compatibility
    const backendParams: any = {
      page: params?.page || 1,
      page_size: params?.pageSize || 10,
    }
    if (params?.riskLevel) {
      backendParams.risk_level = params.riskLevel
    }
    return apiClient.get('/api/professions', { params: backendParams })
  },
  getById(id: string) {
    return apiClient.get(`/api/professions/${id}`)
  },
  search(query: string) {
    return apiClient.get('/api/professions/search', { params: { q: query } })
  },
}

// Admin Profession API - 管理后台职业接口
export const adminProfessionApi = {
  getList(params?: { page?: number; pageSize?: number; risk_level?: string; search?: string }) {
    const backendParams: any = {
      page: params?.page || 1,
      page_size: params?.pageSize || 12,
    }
    if (params?.risk_level) backendParams.risk_level = params.risk_level
    if (params?.search) backendParams.search = params.search
    return adminApiClient.get('/professions', { params: backendParams })
  },
  getById(id: string | number) {
    return adminApiClient.get(`/professions/${id}`)
  },
  create(data: {
    name: string
    slug?: string
    icon?: string
    description?: string
    category_id?: number
    risk_level: string
    risk_score: number
    sort_order?: number
    status?: number
  }) {
    return adminApiClient.post('/professions', data)
  },
  update(id: string | number, data: {
    name?: string
    slug?: string
    icon?: string
    description?: string
    category_id?: number
    risk_level?: string
    risk_score?: number
    sort_order?: number
    status?: number
  }) {
    return adminApiClient.put(`/professions/${id}`, data)
  },
  delete(id: string | number) {
    return adminApiClient.delete(`/professions/${id}`)
  },
  getCategories() {
    return adminApiClient.get('/professions/categories')
  },
  getRiskLevels() {
    return adminApiClient.get('/professions/risk-levels')
  },
}

export const learningPathApi = {
  // 获取学习路径列表
  getList(params?: { page?: number; pageSize?: number; difficulty?: string }) {
    return apiClient.get('/api/learning-paths', { params })
  },
  // 获取推荐路径
  getFeatured(limit?: number) {
    return apiClient.get('/api/learning-paths/featured', { params: { limit } })
  },
  // 获取难度等级信息
  getLevels() {
    return apiClient.get('/api/learning-paths/levels')
  },
  // 根据 ID 获取学习路径详情
  getById(id: string | number) {
    return apiClient.get(`/api/learning-paths/${id}`)
  },
  // 根据 slug 获取学习路径详情
  getBySlug(slug: string) {
    return apiClient.get(`/api/learning-paths/slug/${slug}`)
  },
  // 获取路径的所有章节
  getChapters(pathId: string | number) {
    return apiClient.get(`/api/learning-paths/${pathId}/chapters`)
  },
  // 根据章节 ID 获取详情
  getChapterById(chapterId: string | number) {
    return apiClient.get(`/api/chapters/${chapterId}`)
  },
  // 根据 slug 获取章节详情
  getChapterBySlug(pathSlug: string, chapterSlug: string) {
    return apiClient.get(`/api/learning-paths/${pathSlug}/chapters/${chapterSlug}`)
  },
  // 获取路径学习仪表盘
  getDashboard(pathId: string | number, userId?: string) {
    return apiClient.get('/api/learning-paths/dashboard', {
      params: { path_id: pathId, user_id: userId }
    })
  },
  // 获取用户的学习进度
  getProgress(pathId: string | number, userId?: string) {
    return apiClient.get('/api/learning-paths/progress', {
      params: { path_id: pathId, user_id: userId }
    })
  },
  // 获取用户已完成的章节列表
  getCompletedChapters(pathId: string | number, userId?: string) {
    return apiClient.get('/api/learning-paths/completed-chapters', {
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
    return apiClient.post('/api/learning-paths/save-progress', data)
  },
}

export const toolApi = {
  getCategories() {
    return apiClient.get('/api/tools/categories')
  },
  getList(params?: { page?: number; pageSize?: number; category?: number; search?: string }) {
    // 将 camelCase 转换为 snake_case 以匹配后端参数
    const backendParams: any = {}
    if (params) {
      if (params.page !== undefined) backendParams.page = params.page
      if (params.pageSize !== undefined) backendParams.page_size = params.pageSize
      if (params.category !== undefined) backendParams.category_id = params.category
      if (params.search !== undefined && params.search !== '') backendParams.search = params.search
    }
    return apiClient.get('/api/tools', { params: backendParams })
  },
  getById(slug: string) {
    return apiClient.get(`/api/tools/${slug}`)
  },
}

export const authApi = {
  sendRegistrationCode(email: string) {
    return apiClient.post('/api/auth/send-registration-code', { email })
  },
  register(data: { email: string; password: string; nickname: string; verification_code: string }) {
    return apiClient.post('/api/auth/register', data)
  },
  login(email: string, password: string) {
    return apiClient.post('/api/auth/login', { email, password })
  },
  refreshToken(refreshToken: string) {
    return apiClient.post('/api/auth/refresh', { refresh_token: refreshToken })
  },
  logout() {
    return apiClient.post('/api/auth/logout')
  },
  sendVerificationEmail(email: string) {
    return apiClient.post('/api/auth/send-verification-email', { email })
  },
}

export const userApi = {
  getProfile() {
    return apiClient.get('/api/user/profile')
  },
  updateProfile(data: any) {
    return apiClient.put('/api/user/profile', data)
  },
  updatePreferences(data: any) {
    return apiClient.put('/api/user/preferences', data)
  },
  changePassword(data: { old_password: string; new_password: string }) {
    return apiClient.post('/api/user/change-password', data)
  },
}

// Admin API client - 不带 token 认证
const adminApiClient = axios.create({
  baseURL: '/api/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'identity',
  },
})

// Admin API client uses same response interceptor
adminApiClient.interceptors.response.use(
  (response) => {
    const responseData = response.data
    if (responseData && typeof responseData === 'object' && 'code' in responseData) {
      if (responseData.code === 200 || responseData.code === 0) {
        return responseData.data
      } else {
        const error: any = new Error(responseData.message || '请求失败')
        error.code = responseData.code
        error.data = responseData.data
        return Promise.reject(error)
      }
    }
    return responseData
  },
  (error) => {
    console.error('[Admin API Error]', error.config?.url, error.response?.status, error.response?.data)
    if (error.response) {
      const responseData = error.response.data
      if (responseData && typeof responseData === 'object' && 'code' in responseData) {
        error.code = responseData.code
        error.message = responseData.message || error.message
      }
    }
    return Promise.reject(error)
  }
)

// Admin API - 管理后台接口 (无需认证)
export const adminApi = {
  user: {
    // 获取用户列表
    getList(params?: {
      page?: number
      pageSize?: number
      search?: string
      role?: string
      status?: string
    }) {
      const backendParams: any = {}
      if (params?.page) backendParams.page = params.page
      if (params?.pageSize) backendParams.page_size = params.pageSize
      if (params?.search) backendParams.search = params.search
      if (params?.role) backendParams.role = params.role
      if (params?.status) backendParams.status = params.status
      return adminApiClient.get('/users', { params: backendParams })
    },

    // 获取用户详情
    getById(id: string | number) {
      return adminApiClient.get(`/users/${id}`)
    },

    // 更新用户角色
    updateRole(id: string | number, data: { role: 'admin' | 'user' }) {
      return adminApiClient.put(`/users/${id}/role`, data)
    },

    // 禁用用户
    disable(id: string | number) {
      return adminApiClient.post(`/users/${id}/disable`)
    },

    // 启用用户
    enable(id: string | number) {
      return adminApiClient.post(`/users/${id}/enable`)
    },

    // 获取用户操作日志
    getLogs(id: string | number) {
      return adminApiClient.get(`/users/${id}/logs`)
    },

    // 创建用户
    create(data: { email: string; nickname: string; password: string; role?: string }) {
      return adminApiClient.post('/users', data)
    },

    // 修改密码
    updatePassword(id: string | number, data: { password: string }) {
      return adminApiClient.put(`/users/${id}/password`, data)
    },
  },

  learningPath: {
    // 获取学习路径列表
    getList(params?: {
      page?: number
      pageSize?: number
      difficulty?: string
      status?: number
      search?: string
    }) {
      const backendParams: any = {}
      if (params?.page) backendParams.page = params.page
      if (params?.pageSize) backendParams.page_size = params.pageSize
      if (params?.difficulty) backendParams.difficulty = params.difficulty
      if (params?.status !== undefined) backendParams.status = params.status
      if (params?.search) backendParams.search = params.search
      return adminApiClient.get('/learning-paths', { params: backendParams })
    },

    // 获取学习路径详情
    getById(id: string | number) {
      return adminApiClient.get(`/learning-paths/${id}`)
    },

    // 创建学习路径
    create(data: any) {
      return adminApiClient.post('/learning-paths', data)
    },

    // 更新学习路径
    update(id: string | number, data: any) {
      return adminApiClient.put(`/learning-paths/${id}`, data)
    },

    // 删除学习路径 (软删除)
    delete(id: string | number) {
      return adminApiClient.delete(`/learning-paths/${id}`)
    },

    // 发布
    publish(id: string | number) {
      return adminApiClient.post(`/learning-paths/${id}/publish`)
    },

    // 下架
    unpublish(id: string | number) {
      return adminApiClient.post(`/learning-paths/${id}/unpublish`)
    },

    // 设置推荐
    setFeatured(id: string | number, featured: boolean) {
      return adminApiClient.post(`/learning-paths/${id}/feature`, { featured })
    },
  },

  tool: {
    // 获取工具列表
    getPendingTools(params?: { page?: number; pageSize?: number; search?: string; review_status?: string }) {
      const backendParams: any = {}
      if (params?.page) backendParams.page = params.page
      if (params?.pageSize) backendParams.page_size = params.pageSize
      if (params?.search) backendParams.search = params.search
      if (params?.review_status) backendParams.review_status = params.review_status
      return adminApiClient.get('/tools/pending', { params: backendParams })
    },

    // 获取工具详情（含审核历史）
    getToolDetail(id: string | number) {
      return adminApiClient.get(`/tools/${id}`)
    },

    // 审核通过
    approveTool(id: string | number) {
      return adminApiClient.post(`/tools/${id}/approve`)
    },

    // 审核拒绝
    rejectTool(id: string | number, reason: string) {
      return adminApiClient.post(`/tools/${id}/reject`, { reason })
    },

    // 退回修改
    requestRevision(id: string | number, reason: string) {
      return adminApiClient.post(`/tools/${id}/request-revision`, { reason })
    },

    // 上线工具
    setOnline(id: string | number) {
      return adminApiClient.post(`/tools/${id}/online`)
    },

    // 下线工具
    setOffline(id: string | number) {
      return adminApiClient.post(`/tools/${id}/offline`)
    },
  },

  article: {
    // 获取文章列表
    getPendingArticles(params?: { page?: number; pageSize?: number; search?: string; review_status?: string }) {
      const backendParams: any = {}
      if (params?.page) backendParams.page = params.page
      if (params?.pageSize) backendParams.page_size = params.pageSize
      if (params?.search) backendParams.search = params.search
      if (params?.review_status) backendParams.review_status = params.review_status
      return adminApiClient.get('/articles/pending', { params: backendParams })
    },

    // 审核通过
    approveArticle(id: string | number) {
      return adminApiClient.post(`/articles/${id}/approve`)
    },

    // 拒绝文章
    rejectArticle(id: string | number, reason: string) {
      return adminApiClient.post(`/articles/${id}/reject`, { reason })
    },

    // 发布文章
    publishArticle(id: string | number) {
      return adminApiClient.post(`/articles/${id}/publish`)
    },

    // 下架文章
    unpublishArticle(id: string | number) {
      return adminApiClient.post(`/articles/${id}/unpublish`)
    },
  },

  chapter: {
    // 获取章节列表
    getListByPath(pathId: string | number) {
      return adminApiClient.get(`/learning-paths/${pathId}/chapters`)
    },

    // 获取章节详情
    getById(id: string | number) {
      return adminApiClient.get(`/chapters/${id}`)
    },

    // 创建章节
    create(pathId: string | number, data: any) {
      return adminApiClient.post(`/learning-paths/${pathId}/chapters`, data)
    },

    // 更新章节
    update(id: string | number, data: any) {
      return adminApiClient.put(`/chapters/${id}`, data)
    },

    // 删除章节 (软删除)
    delete(id: string | number) {
      return adminApiClient.delete(`/chapters/${id}`)
    },
  },
}

export default apiClient
