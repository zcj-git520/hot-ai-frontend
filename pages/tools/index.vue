<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span class="text-2xl sm:text-3xl">🤖</span>
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
            </NuxtLink>
            <nav class="hidden lg:flex items-center gap-6">
              <NuxtLink to="/" class="text-[#8b949e] hover:text-white transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-[#8b949e] hover:text-white transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-[#8b949e] hover:text-white transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-white font-medium">工具库</NuxtLink>
            </nav>
          </div>
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
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">AI 工具库</h1>
        <p class="text-[#8b949e] text-base sm:text-lg mb-6 sm:mb-8">精选 AI 工具，提升工作效率</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p class="text-[#8b949e] mt-4">加载中...</p>
      </div>

      <!-- 空数据提示 -->
      <div v-else-if="tools.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🔧</div>
        <h3 class="text-xl font-bold text-white mb-2">暂无工具数据</h3>
        <p class="text-[#8b949e]">请先执行数据库迁移脚本插入测试数据</p>
      </div>

      <!-- 搜索栏 -->
      <div class="mb-6">
        <div class="relative max-w-xl mx-auto">
          <input
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="搜索 AI 工具名称或描述..."
            class="w-full bg-[#161b22] border border-[#30363d] rounded-full py-2.5 sm:py-3 px-4 sm:px-5 pr-12 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all text-sm"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-[#58a6ff] hover:bg-[#388bfd] text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div v-if="categories.length > 0" class="mb-8">
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <button
            @click="selectedCategory = 0; currentPage = 1; loadTools()"
            :class="selectedCategory === 0 ? 'bg-blue-500 text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'"
            class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all"
          >
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id; currentPage = 1; loadTools()"
            :class="selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'"
            class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- 工具列表 -->
      <div v-if="tools.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
          @click="navigateTo(`/tools/${tool.slug}`)"
        >
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <span class="text-3xl sm:text-4xl">{{ tool.icon }}</span>
            <span :class="getCategoryStyle(tool.category_id)" class="text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold">
              {{ getCategoryName(tool.category_id) }}
            </span>
          </div>
          <h3 class="text-base sm:text-xl font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2 leading-snug">
            {{ tool.name }}
          </h3>
          <p class="text-[#8b949e] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {{ tool.description }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-[#8b949e]">
              <span>⭐ {{ tool.rating.toFixed(1) }}</span>
              <span>👥 {{ tool.review_count }}</span>
            </div>
            <span class="text-[#58a6ff] font-medium text-xs sm:text-sm">详情 →</span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#30363d]'"
          class="bg-[#21262d] text-[#8b949e] px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          ← 上一页
        </button>

        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page === '...'" 
            class="bg-[#21262d] text-[#8b949e] px-3 py-2 rounded-lg text-sm"
          >
            ...
          </button>
          <button
            v-else
            @click="goToPage(page as number)"
            :class="page === currentPage ? 'bg-blue-500 text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'"
            class="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#30363d]'"
          class="bg-[#21262d] text-[#8b949e] px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          下一页 →
        </button>

        <span class="text-[#8b949e] text-sm ml-4">
          共 {{ totalCount }} 条
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import type { Tool, ToolCategory } from '~/types/tool'

// 获取认证信息
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

// 恢复用户认证信息
onMounted(() => {
  restoreAuth()
  loadTools()
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

// 工具列表和类别
const tools = ref<Tool[]>([])
const categories = ref<ToolCategory[]>([])
const loading = ref(false)

// 分页和筛选状态
const currentPage = ref(1)
const pageSize = ref(9)
const selectedCategory = ref(0)
const totalCount = ref(0)
const searchKeyword = ref('')

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadTools()
}

// 计算总页数
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 计算可见页码
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 3) pages.push('...')
    pages.push(total)
  }

  return pages
})

// 切换页面
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  loadTools()
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 加载工具数据
const loadTools = async () => {
  loading.value = true
  try {
    const { toolApi } = await import('~/app/lib/api')
    
    // 构建请求参数
    const params: any = { page: currentPage.value, pageSize: pageSize.value }
    if (selectedCategory.value > 0) {
      params.category = selectedCategory.value
    }
    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }
    
    // 并行加载工具和类别
    const [toolsRes, categoriesRes] = await Promise.all([
      toolApi.getList(params),
      toolApi.getCategories()
    ])
    
    // axios 拦截器返回 response.data，所以 toolsRes 已经是 { list, page, page_size, total }
    if (toolsRes.list) {
      tools.value = toolsRes.list
      totalCount.value = toolsRes.total || 0
    }
    
    // categories API 直接返回数组
    if (Array.isArray(categoriesRes)) {
      categories.value = categoriesRes
    } else if (categoriesRes.data) {
      categories.value = categoriesRes.data
    }
    
    console.log('Loaded tools:', tools.value.length, 'Total:', totalCount.value)
    console.log('Loaded categories:', categories.value.length)
  } catch (error) {
    console.error('Failed to load tools:', error)
    toastError('加载工具列表失败')
  } finally {
    loading.value = false
  }
}

// 获取类别名称
const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '其他'
}

// 获取类别样式
const getCategoryStyle = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  const styles: Record<string, string> = {
    'writing': 'bg-blue-500/10 text-blue-400',
    'image': 'bg-purple-500/10 text-purple-400',
    'video': 'bg-red-500/10 text-red-400',
    'audio': 'bg-yellow-500/10 text-yellow-400',
    'code': 'bg-green-500/10 text-green-400',
    'office': 'bg-indigo-500/10 text-indigo-400',
    'other': 'bg-gray-500/10 text-gray-400'
  }
  return category ? (styles[category.slug] || 'bg-gray-500/10 text-gray-400') : 'bg-gray-500/10 text-gray-400'
}
</script>
