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
        
        <!-- 分类筛选 -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition',
              activeCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
            ]"
            @click="activeCategory = 'all'"
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
            @click="activeCategory = category.code"
          >
            {{ category.name }}
          </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-[#8b949e]">加载中...</p>
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
              <span class="text-[#8b949e] text-xs">{{ formatDate(article.published_at) }}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2 sm:mb-3 leading-snug">
              {{ article.title }}
            </h3>
            <p class="text-[#8b949e] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
              {{ article.summary }}
            </p>
            <div class="flex items-center gap-3 sm:gap-4 text-xs text-[#8b949e]">
              <span> {{ article.view_count }}</span>
              <span> {{ article.comment_count }}</span>
              <span class="text-[#8b949e]">来源：{{ article.source_name }}</span>
            </div>
          </article>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <p class="text-[#8b949e]">暂无文章数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
const loading = ref(false)

// 获取分类列表
const { data: categories } = await useFetch('/api/articles/categories', {
  transform: (data) => {
    console.log('[API] 分类数据:', data)
    return data || []
  }
})

// 获取文章列表
const buildQuery = () => {
  const params: any = {
    page: 1,
    page_size: 10
  }
  if (activeCategory.value !== 'all') {
    params.category = activeCategory.value
  }
  return params
}

const { data: articles } = await useFetch('/api/articles', {
  query: buildQuery(),
  transform: (data) => {
    console.log('[API] 文章数据:', data)
    return data?.articles || []
  }
})

// 监听分类变化
watch(activeCategory, async (newCategory) => {
  loading.value = true
  const params: any = {
    page: 1,
    page_size: 10
  }
  if (newCategory !== 'all') {
    params.category = newCategory
  }
  
  const { data } = await useFetch('/api/articles', {
    query: params,
    transform: (res) => res?.articles || []
  })
  articles.value = data.value
  loading.value = false
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
</script>
