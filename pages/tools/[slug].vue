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
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p class="text-[#8b949e] mt-4">加载中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-6xl mb-4">❌</div>
        <h3 class="text-xl font-bold text-white mb-2">加载失败</h3>
        <p class="text-[#8b949e]">{{ error }}</p>
        <button @click="loadToolDetail" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
          重试
        </button>
      </div>

      <!-- 工具详情 -->
      <div v-else-if="tool" class="space-y-8">
        <!-- 返回按钮 -->
        <NuxtLink to="/tools" class="inline-flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors">
          <span>←</span>
          <span>返回工具列表</span>
        </NuxtLink>

        <!-- 工具头部信息 -->
        <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row gap-6">
            <div class="text-6xl sm:text-8xl">{{ tool.icon }}</div>
            <div class="flex-1">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h1 class="text-2xl sm:text-4xl font-bold text-white mb-2">{{ tool.name }}</h1>
                  <div class="flex items-center gap-3 mb-4">
                    <span :class="getCategoryStyle(tool.category_id)" class="text-sm px-3 py-1 rounded-full font-bold">
                      {{ getCategoryName(tool.category_id) }}
                    </span>
                    <span class="text-[#8b949e] text-sm">难度:</span>
                    <span class="text-white text-sm">{{ getDifficultyText(tool.difficulty) }}</span>
                  </div>
                </div>
                <a 
                  :href="tool.official_url" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-md font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  访问官网 →
                </a>
              </div>
              
              <p class="text-[#8b949e] text-base sm:text-lg mb-4">{{ tool.description }}</p>
              
              <div class="flex flex-wrap items-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400 text-xl">⭐</span>
                  <span class="text-white font-bold text-lg">{{ tool.rating.toFixed(1) }}</span>
                  <span class="text-[#8b949e]">({{ tool.review_count }} 评测)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#8b949e]">👁️</span>
                  <span class="text-white">{{ tool.view_count.toLocaleString() }} 浏览</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#8b949e]">🔥</span>
                  <span class="text-white">热度 {{ tool.popularity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 定价信息 -->
        <div v-if="tool.pricing_description" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">💰 定价信息</h2>
          <p class="text-[#8b949e]">{{ tool.pricing_description }}</p>
        </div>

        <!-- 文档链接 -->
        <div v-if="tool.documentation_url" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">📚 相关文档</h2>
          <a 
            :href="tool.documentation_url" 
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 hover:text-blue-300 underline"
          >
            {{ tool.documentation_url }}
          </a>
        </div>

        <!-- 标签 -->
        <div v-if="tool.tags" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">🏷️ 标签</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(tag, index) in parseTags(tool.tags)" 
              :key="index"
              class="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import type { Tool, ToolCategory } from '~/types/tool'

const route = useRoute()
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

const tool = ref<Tool | null>(null)
const categories = ref<ToolCategory[]>([])
const loading = ref(false)
const error = ref('')

onMounted(() => {
  restoreAuth()
  loadToolDetail()
})

const handleLogout = async () => {
  try {
    const { authApi } = await import('~/app/lib/api')
    await authApi.logout()
    toastSuccess('已退出登录')
  } catch (err) {
    console.error('Logout failed', err)
    toastError('退出登录失败')
  } finally {
    clearAuth()
    navigateTo('/')
  }
}

const loadToolDetail = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const slug = route.params.slug as string
    const { toolApi } = await import('~/app/lib/api')
    
    // 加载类别
    const categoriesRes = await toolApi.getCategories()
    if (Array.isArray(categoriesRes)) {
      categories.value = categoriesRes
    } else if (categoriesRes.data) {
      categories.value = categoriesRes.data
    }
    
    // 加载工具详情
    const response = await toolApi.getById(slug)
    
    // axios 拦截器返回 response.data，即工具对象
    if (response && response.id) {
      tool.value = response
    } else {
      error.value = '工具不存在'
    }
  } catch (err) {
    console.error('Failed to load tool:', err)
    error.value = '加载工具详情失败'
    toastError('加载工具详情失败')
  } finally {
    loading.value = false
  }
}

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '其他'
}

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

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  }
  return map[difficulty] || difficulty
}

const parseTags = (tags: string | number[]) => {
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags)
    } catch {
      return []
    }
  }
  return tags
}
</script>
