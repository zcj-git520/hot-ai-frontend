<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
            </NuxtLink>
            <nav class="hidden lg:flex items-center gap-6">
              <NuxtLink to="/" class="text-[#8b949e] hover:text-white transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-[#8b949e] hover:text-white transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-white hover:text-[#58a6ff] transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-[#8b949e] hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <template v-if="user">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-white font-medium text-sm hidden md:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button @click="handleLogout" class="text-[#8b949e] hover:text-white transition-colors font-medium text-xs sm:text-sm">退出</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium text-sm">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl">注册</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- 面包屑导航 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <nav class="flex items-center gap-2 text-sm text-[#8b949e]">
        <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/learning-paths" class="hover:text-white transition-colors">学习路径</NuxtLink>
        <span>/</span>
        <span class="text-white truncate">{{ learningPath?.title || '路径详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#58a6ff]"></div>
      <p class="text-[#8b949e] mt-3">加载中...</p>
    </div>

    <!-- 学习路径详情 -->
    <div v-else-if="learningPath" class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <!-- 头部信息卡片 -->
      <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div class="flex items-start gap-4">
            <span class="text-5xl sm:text-6xl">{{ learningPath.icon }}</span>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ learningPath.title }}</h1>
              <div class="flex items-center gap-3 flex-wrap">
                <span :class="getLevelStyle(learningPath.difficulty)" class="px-3 py-1 rounded-full text-sm font-bold">
                  {{ learningPath.level_label }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p class="text-[#c9d1d9] text-base leading-relaxed">{{ learningPath.description }}</p>
        
        <!-- 统计数据 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#30363d]">
          <div class="text-center">
            <div class="text-[#8b949e] text-sm mb-1">预计天数</div>
            <div class="text-white font-bold text-xl">{{ learningPath.estimated_days }} 天</div>
          </div>
          <div class="text-center">
            <div class="text-[#8b949e] text-sm mb-1">预计时长</div>
            <div class="text-white font-bold text-xl">{{ learningPath.estimated_hours }} 小时</div>
          </div>
          <div class="text-center">
            <div class="text-[#8b949e] text-sm mb-1">章节数</div>
            <div class="text-white font-bold text-xl">{{ learningPath.chapter_count }} 章</div>
          </div>
          <div class="text-center">
            <div class="text-[#8b949e] text-sm mb-1">在学人数</div>
            <div class="text-white font-bold text-xl">{{ formatStudentCount(learningPath.student_count) }}</div>
          </div>
        </div>
      </div>

      <!-- 学习目标 -->
      <div v-if="parsedLearningGoals.length > 0" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎯</span> 学习目标
        </h2>
        <ul class="space-y-3">
          <li v-for="(goal, index) in parsedLearningGoals" :key="index" class="flex items-start gap-3 text-[#c9d1d9]">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold mt-0.5">
              {{ index + 1 }}
            </span>
            <span>{{ goal }}</span>
          </li>
        </ul>
      </div>

      <!-- 适合人群 -->
      <div v-if="parsedTargetAudience.length > 0" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>👥</span> 适合人群
        </h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="(audience, index) in parsedTargetAudience" :key="index" 
                class="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
            {{ audience }}
          </span>
        </div>
      </div>

      <!-- 章节列表 -->
      <div v-if="chapters.length > 0" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📚</span> 课程章节
        </h2>
        <div class="space-y-3">
          <NuxtLink v-for="chapter in chapters" :key="chapter.id" 
               :to="`/learning-paths/${id}/chapters/${chapter.id}`"
               class="flex items-center justify-between bg-[#21262d] hover:bg-[#30363d] rounded-lg px-5 py-4 transition-colors group block">
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#58a6ff]/20 text-[#58a6ff] flex items-center justify-center text-sm font-bold">
                {{ chapter.order_index }}
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="text-white font-medium group-hover:text-[#58a6ff] transition-colors truncate">
                  {{ chapter.title }}
                </h3>
                <p class="text-[#8b949e] text-sm truncate">{{ chapter.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 ml-4 flex-shrink-0">
              <span class="text-[#8b949e] text-sm">{{ chapter.estimated_hours }} 小时</span>
              <span :class="getContentTypeStyle(chapter.content_type)" class="px-2 py-1 rounded text-xs">
                {{ getContentTypeName(chapter.content_type) }}
              </span>
              <svg class="w-5 h-5 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="mt-8 text-center">
        <NuxtLink to="/learning-paths" 
                  class="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white px-6 py-3 rounded-lg transition-colors font-medium">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </NuxtLink>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="text-6xl mb-4">😕</div>
      <h2 class="text-2xl font-bold text-white mb-3">学习路径不存在</h2>
      <p class="text-[#8b949e] mb-6">抱歉，您访问的学习路径不存在或已被删除</p>
      <NuxtLink to="/learning-paths" 
                class="inline-flex items-center gap-2 bg-[#58a6ff] hover:bg-[#1f6feb] text-white px-6 py-3 rounded-lg transition-colors font-medium">
        查看学习路径列表
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

onMounted(() => { restoreAuth() })

const handleLogout = async () => {
  try {
    const { authApi } = await import('~/app/lib/api')
    await authApi.logout()
    toastSuccess('已退出登录')
  } catch (error) {
    toastError('退出登录失败')
  } finally {
    clearAuth()
    navigateTo('/')
  }
}

const route = useRoute()
const id = route.params.id as string

// 获取学习路径详情
const { data: learningPath, error, pending: loading } = await useFetch(`/api/learning-paths/${id}`, {
  transform: (res: any) => {
    if (!res) return null
    // 后端直接返回对象
    if (res.title) return res
    // 尝试从 data 字段获取
    if (res.data && res.data.title) return res.data
    return null
  }
})

// 获取章节列表
const { data: chapters } = await useFetch(`/api/learning-paths/${id}/chapters`, {
  transform: (res: any) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.data && Array.isArray(res.data)) return res.data
    if (res.chapters && Array.isArray(res.chapters)) return res.chapters
    return []
  }
})

if (error.value) {
  console.error('Failed to fetch learning path:', error.value)
}

// 工具函数
const formatStudentCount = (count: number) => {
  if (!count) return '0'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k'
  return count.toString()
}

const getLevelStyle = (difficulty: string) => {
  const map: Record<string, string> = {
    'beginner': 'bg-green-500/10 text-green-400',
    'intermediate': 'bg-blue-500/10 text-blue-400',
    'advanced': 'bg-purple-500/10 text-purple-400'
  }
  return map[difficulty] || 'bg-gray-500/10 text-gray-400'
}

const getContentTypeName = (type: string) => {
  const map: Record<string, string> = {
    'article': '文章',
    'video': '视频',
    'practice': '实践',
    'external': '外部链接'
  }
  return map[type] || type
}

const getContentTypeStyle = (type: string) => {
  const map: Record<string, string> = {
    'article': 'bg-yellow-500/10 text-yellow-400',
    'video': 'bg-red-500/10 text-red-400',
    'practice': 'bg-green-500/10 text-green-400',
    'external': 'bg-purple-500/10 text-purple-400'
  }
  return map[type] || 'bg-gray-500/10 text-gray-400'
}

// 解析学习目标
const parsedLearningGoals = computed(() => {
  const goals = learningPath.value?.learning_goals
  if (!goals) return []
  try {
    if (typeof goals === 'string') return JSON.parse(goals)
    if (Array.isArray(goals)) return goals
    return []
  } catch {
    return []
  }
})

// 解析适合人群
const parsedTargetAudience = computed(() => {
  const audience = learningPath.value?.target_audience
  if (!audience) return []
  try {
    if (typeof audience === 'string') return JSON.parse(audience)
    if (Array.isArray(audience)) return audience
    return []
  } catch {
    return []
  }
})
</script>
