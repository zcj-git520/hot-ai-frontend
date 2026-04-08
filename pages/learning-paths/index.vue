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
              <NuxtLink to="/learning-paths" class="text-white font-medium">学习路径</NuxtLink>
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
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">学习路径</h1>
        <p class="text-[#8b949e] text-base sm:text-lg mb-6 sm:mb-8">系统学习 AI 技能，提升职业竞争力</p>

        <!-- 难度筛选 -->
        <div class="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            v-for="level in levels"
            :key="level.id"
            @click="handleFilter(level.id)"
            :class="[
              'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
              selectedDifficulty === level.id
                ? `${level.color}/20 ${level.color} border ${level.color}`
                : 'bg-[#161b22] text-[#8b949e] border border-[#30363d] hover:border-[#58a6ff]'
            ]"
          >
            {{ level.icon }} {{ level.name }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-[#58a6ff] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[#8b949e] mt-4">加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadPaths" class="mt-4 text-[#58a6ff] hover:underline">重试</button>
      </div>

      <!-- 路径列表 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="path in paths"
          :key="path.id"
          @click="goToPathDetail(path.id)"
          class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <span class="text-2xl sm:text-3xl">{{ path.icon || '📚' }}</span>
            <span :class="getLevelStyle(path.difficulty)" class="text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold">
              {{ path.level_label }}
            </span>
          </div>
          <h3 class="text-base sm:text-xl font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2 leading-snug">
            {{ path.title }}
          </h3>
          <p class="text-[#8b949e] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {{ path.description }}
          </p>
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="flex items-center gap-3 sm:gap-4 text-xs text-[#8b949e]">
              <span>⏱️ {{ path.estimated_days }}天</span>
              <span>📚 {{ path.chapter_count }} 章</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#30363d]">
            <div class="flex -space-x-2">
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-[#161b22]"></div>
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 border-2 border-[#161b22]"></div>
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 border-2 border-[#161b22]"></div>
            </div>
            <span class="text-xs sm:text-sm text-[#8b949e]">{{ formatStudentCount(path.student_count) }} 人在学</span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8 sm:mt-12">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#58a6ff]"
        >
          上一页
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="handlePageChange(page)"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium',
            currentPage === page
              ? 'bg-[#58a6ff] text-white'
              : 'bg-[#161b22] border border-[#30363d] text-white hover:border-[#58a6ff]'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#58a6ff]"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

// 获取认证信息
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

// 状态
const paths = ref<any[]>([])
const levels = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const selectedDifficulty = ref<string>('all')
const total = ref(0)

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(total.value / 12)
})

// 恢复用户认证信息
onMounted(() => {
  restoreAuth()
  loadPaths()
  loadLevels()
})

// 监听筛选和分页变化
watch([currentPage, selectedDifficulty], () => {
  loadPaths()
})

// 加载学习路径列表
const loadPaths = async () => {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      page_size: 12
    }
    if (selectedDifficulty.value !== 'all') {
      params.difficulty = selectedDifficulty.value
    }

    const query = new URLSearchParams(params as any)
    const res = await $fetch(`/api/learning-paths?${query.toString()}`)
    
    const data = res?.data || res
    paths.value = data.professions || data.list || data.paths || []
    total.value = data.total || paths.value.length
    
    console.log('学习路径列表:', res)
  } catch (err: any) {
    console.error('加载学习路径失败:', err)
    error.value = err.message || '加载失败，请重试'
    toastError('加载学习路径失败')
  } finally {
    loading.value = false
  }
}

// 加载难度等级信息
const loadLevels = async () => {
  try {
    const res = await $fetch('/api/learning-paths/levels')
    levels.value = [
      { id: 'all', level: 'all', name: '全部', icon: '📚', description: '', color: '#8b949e', min_hours: 0, max_hours: 0 },
      ...(res?.data || res || [])
    ]
  } catch (err) {
    console.error('加载难度等级失败:', err)
    // 使用默认值
    levels.value = [
      { id: 'all', level: 'all', name: '全部', icon: '📚', description: '', color: '#8b949e', min_hours: 0, max_hours: 0 },
      { id: 'beginner', level: 'beginner', name: '入门', icon: '🌱', description: '', color: '#4ade80', min_hours: 0, max_hours: 0 },
      { id: 'intermediate', level: 'intermediate', name: '进阶', icon: '✍️', description: '', color: '#60a5fa', min_hours: 0, max_hours: 0 },
      { id: 'advanced', level: 'advanced', name: '高级', icon: '🚀', description: '', color: '#a855f7', min_hours: 0, max_hours: 0 }
    ]
  }
}

// 处理筛选
const handleFilter = (levelId: string) => {
  selectedDifficulty.value = levelId
  currentPage.value = 1
}

// 处理分页
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

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

// 跳转到路径详情
const goToPathDetail = (id: number) => {
  navigateTo(`/learning-paths/${id}`)
}

// 获取难度样式
const getLevelStyle = (difficulty: string) => {
  const styles: Record<string, string> = {
    'beginner': 'bg-green-500/10 text-green-400',
    'intermediate': 'bg-blue-500/10 text-blue-400',
    'advanced': 'bg-purple-500/10 text-purple-400'
  }
  return styles[difficulty] || 'bg-gray-500/10 text-gray-400'
}

// 格式化学生数量
const formatStudentCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
