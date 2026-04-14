<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span class="text-2xl sm:text-3xl"></span>
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
            </NuxtLink>
            <nav class="hidden lg:flex items-center gap-6">
              <NuxtLink to="/" class="text-[#8b949e] hover:text-white transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-white hover:text-[#58a6ff] transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-[#8b949e] hover:text-white transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-[#8b949e] hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- 登录状态 -->
            <div v-if="user" class="flex items-center gap-2 sm:gap-4">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-white font-medium text-sm hidden md:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button 
                @click="handleLogout"
                class="text-[#8b949e] hover:text-white transition-colors font-medium text-xs sm:text-sm"
              >
                退出
              </button>
            </div>
            
            <!-- 未登录状态 -->
            <div v-else class="flex items-center gap-2 sm:gap-4">
              <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium text-sm">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl">
                注册
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <div class="text-center">
        <h1 class="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">资讯列表</h1>
        <p class="text-[#8b949e] text-base sm:text-lg mb-6 sm:mb-8">获取最新的 AI 行业动态和技术进展</p>
        
        <!-- 搜索框 -->
        <div class="max-w-xl mx-auto mb-6">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索文章标题或内容..."
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 sm:py-2.5 pl-10 pr-8 text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchKeyword"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 分类筛选 -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition',
              activeCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
            ]"
            @click="handleCategoryChange('all')"
          >
            全部
          </button>
          <button 
            v-for="category in categories"
            :key="category.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition',
              activeCategory === category.code 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
            ]"
            @click="handleCategoryChange(category.code)"
          >
            {{ category.name }}
          </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#58a6ff]"></div>
          <p class="text-[#8b949e] mt-3">加载中...</p>
        </div>

        <!-- 文章列表 -->
        <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <article 
            v-for="article in articles"
            :key="article.id"
            class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
            @click="navigateTo(`/articles/${article.id}`)"
          >
            <div class="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
              <span :class="getCategoryBadgeClass(article.category_name)">
                {{ article.category_name }}
              </span>
              <span class="flex items-center text-[#8b949e] text-xs gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(article.published_at) }}
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2 sm:mb-3 leading-snug">
              {{ article.title }}
            </h3>
            <p class="text-[#8b949e] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
              {{ article.summary }}
            </p>
            
            <!-- 统计信息 - 与首页统一使用 emoji -->
            <div class="flex items-center gap-3 sm:gap-4 text-xs text-[#8b949e] mb-3">
              <span>👁️ {{ formatNumber(article.view_count || 0) }}</span>
              <span>💬 {{ formatNumber(article.comment_count || 0) }}</span>
              <span>🔥 {{ formatNumber(article.like_count || 0) }}</span>
            </div>
            
            <!-- 来源 -->
            <div class="flex items-center justify-between text-xs text-[#8b949e] pt-3 border-t border-[#30363d]">
              <span>来源：{{ article.source_name }}</span>
              <div class="flex items-center gap-2">
                <a
                  v-if="article.original_url"
                  :href="article.original_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-green-400 hover:text-green-300 transition-colors"
                  @click.stop
                >
                  查看原文 →
                </a>
                <span class="text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors">阅读全文 →</span>
              </div>
            </div>
          </article>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto w-16 h-16 text-[#30363d] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-[#8b949e] text-lg">暂无文章数据</p>
          <p v-if="searchKeyword" class="text-[#484f58] text-sm mt-2">尝试更换搜索关键词或清除筛选条件</p>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <nav class="flex items-center gap-1.5 sm:gap-2">
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-[#8b949e] text-sm hover:bg-[#30363d] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="hidden sm:inline">上一页</span>
            </button>
            
            <!-- 页码按钮 -->
            <template v-for="page in displayPages" :key="page">
              <span v-if="page === '...'" class="px-1 text-[#484f58] text-sm">...</span>
              <button 
                v-else
                @click="goToPage(page as number)"
                :class="[
                  'min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 rounded-md text-sm font-medium transition-all',
                  currentPage === page 
                    ? 'bg-[#58a6ff] text-white' 
                    : 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                ]"
              >
                {{ page }}
              </button>
            </template>

            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-[#8b949e] text-sm hover:bg-[#30363d] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span class="hidden sm:inline">下一页</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
          
          <div class="text-sm text-[#484f58]">
            第 {{ currentPage }} / {{ totalPages }} 页，共 {{ totalCount }} 条
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

// 获取认证信息
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

// 恢复用户认证信息
onMounted(() => {
  restoreAuth()
})

// 退出登录
const handleLogout = async () => {
  try {
    const { authApi } = await import('~/app/lib/api')
    await authApi.logout()
    toastSuccess('已退出登录')
  } catch (error) {
    console.error('Logout failed', error)
    toastError('退出登录失败')
  } finally {
    clearAuth()
    navigateTo('/')
  }
}

const activeCategory = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(9)
const totalCount = ref(0)
const totalPages = ref(0)
const loading = ref(false)

// 获取分类列表
const { data: categories } = await useFetch('/api/articles/categories', {
  transform: (data) => {
    console.log('[API] 分类原始数据:', data)
    // 后端返回 {code, data, message},提取 data 字段
    const responseData = data?.data || data
    console.log('[API] 分类数据:', responseData)
    return responseData || []
  }
})

// 构建查询参数
const buildQuery = () => {
  const params: any = {
    page: currentPage.value,
    page_size: pageSize.value
  }
  if (activeCategory.value !== 'all') {
    params.category = activeCategory.value
  }
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value
  }
  return params
}

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/articles', {
      query: buildQuery(),
      transform: (res) => {
        console.log('[API] 文章原始数据:', res)
        // 后端返回 {code, data, message},提取 data 字段
        const responseData = res?.data || res
        console.log('[API] 文章数据:', responseData)
        totalCount.value = responseData?.total || 0
        totalPages.value = responseData?.total_pages || 0
        return responseData?.articles || []
      }
    })
    articles.value = data.value || []
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始加载
const { data: articles } = await useFetch('/api/articles', {
  query: buildQuery(),
  transform: (res) => {
    console.log('[API] 文章原始数据:', res)
    // 后端返回 {code, data, message},提取 data 字段
    const responseData = res?.data || res
    console.log('[API] 文章数据:', responseData)
    totalCount.value = responseData?.total || 0
    totalPages.value = responseData?.total_pages || 0
    return responseData?.articles || []
  }
})

// 处理分类变化
const handleCategoryChange = async (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
  await fetchArticles()
}

// 处理搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchArticles()
}

// 清除搜索
const clearSearch = async () => {
  searchKeyword.value = ''
  currentPage.value = 1
  await fetchArticles()
}

// 跳转到指定页
const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }
  currentPage.value = page
  await fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 计算显示的页码
const displayPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

const getCategoryBadgeClass = (categoryName: string) => {
  const classMap: Record<string, string> = {
    '动态': 'bg-blue-500/10 text-blue-400',
    '职业': 'bg-orange-500/10 text-orange-400',
    '学习': 'bg-green-500/10 text-green-400',
    '工具': 'bg-purple-500/10 text-purple-400'
  }
  return `text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${classMap[categoryName] || 'bg-gray-500/10 text-gray-400'}`
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}
</script>
