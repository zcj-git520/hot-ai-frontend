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
      <nav class="flex items-center gap-2 text-sm text-[#8b949e] flex-wrap">
        <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/learning-paths" class="hover:text-white transition-colors">学习路径</NuxtLink>
        <span>/</span>
        <NuxtLink :to="`/learning-paths/${pathId}`" class="hover:text-white transition-colors truncate max-w-[200px]">
          {{ learningPath?.title || '路径详情' }}
        </NuxtLink>
        <span>/</span>
        <span class="text-white truncate max-w-[200px]">{{ chapter?.title || '章节详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#58a6ff]"></div>
      <p class="text-[#8b949e] mt-3">加载中...</p>
    </div>

    <!-- 章节详情 -->
    <div v-else-if="chapter && learningPath" class="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <!-- 章节头部 -->
      <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <div class="flex items-start gap-4 mb-4">
          <span class="flex-shrink-0 w-10 h-10 rounded-full bg-[#58a6ff]/20 text-[#58a6ff] flex items-center justify-center text-lg font-bold">
            {{ chapter.order_index }}
          </span>
          <div class="flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ chapter.title }}</h1>
            <div class="flex items-center gap-3 flex-wrap">
              <span :class="getContentTypeStyle(chapter.content_type)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ getContentTypeName(chapter.content_type) }}
              </span>
              <span class="text-[#8b949e] text-sm">预计 {{ chapter.estimated_hours }} 小时</span>
              <span v-if="chapter.is_free" class="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs">免费</span>
            </div>
          </div>
        </div>

        <p class="text-[#c9d1d9] text-base leading-relaxed">{{ chapter.description }}</p>
      </div>

      <!-- 章节内容 -->
      <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <div class="prose prose-invert max-w-none" v-html="renderedContent"></div>
      </div>

      <!-- 外部链接（如果有） -->
      <div v-if="externalLinks.length > 0" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔗</span> 相关资源
        </h2>
        <ul class="space-y-2">
          <li v-for="(link, index) in externalLinks" :key="index">
            <a :href="link" target="_blank" rel="noopener noreferrer"
               class="text-[#58a6ff] hover:text-[#79c0ff] transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ link }}
            </a>
          </li>
        </ul>
      </div>

      <!-- 章节导航 -->
      <div class="flex items-center justify-between gap-4">
        <NuxtLink v-if="prevChapter"
                  :to="`/learning-paths/${pathId}/chapters/${prevChapter.id}`"
                  class="flex-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-lg p-4 transition-colors group">
          <div class="text-[#8b949e] text-sm mb-1">上一章</div>
          <div class="text-white font-medium group-hover:text-[#58a6ff] transition-colors truncate">
            {{ prevChapter.title }}
          </div>
        </NuxtLink>
        <div v-else class="flex-1"></div>

        <NuxtLink :to="`/learning-paths/${pathId}`"
                  class="bg-[#21262d] hover:bg-[#30363d] text-white px-6 py-4 rounded-lg transition-colors font-medium flex-shrink-0">
          返回路径
        </NuxtLink>

        <NuxtLink v-if="nextChapter"
                  :to="`/learning-paths/${pathId}/chapters/${nextChapter.id}`"
                  class="flex-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-lg p-4 transition-colors group text-right">
          <div class="text-[#8b949e] text-sm mb-1">下一章</div>
          <div class="text-white font-medium group-hover:text-[#58a6ff] transition-colors truncate">
            {{ nextChapter.title }}
          </div>
        </NuxtLink>
        <div v-else class="flex-1"></div>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="text-6xl mb-4">😕</div>
      <h2 class="text-2xl font-bold text-white mb-3">章节不存在</h2>
      <p class="text-[#8b949e] mb-6">抱歉，您访问的章节不存在或已被删除</p>
      <NuxtLink :to="`/learning-paths/${pathId}`"
                class="inline-flex items-center gap-2 bg-[#58a6ff] hover:bg-[#1f6feb] text-white px-6 py-3 rounded-lg transition-colors font-medium">
        返回学习路径
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { marked } from 'marked'

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
const id = route.params.pathId as string
const chapterId = route.params.chapterId as string

// 获取章节详情
const { data: chapter, error, pending: loading } = await useFetch(`/api/learning-paths/${id}/chapters/${chapterId}`, {
  transform: (res: any) => {
    if (!res) return null
    if (res.title) return res
    if (res.data && res.data.title) return res.data
    return null
  }
})

// 获取学习路径信息（用于面包屑）
const { data: learningPath } = await useFetch(`/api/learning-paths/${pathId}`, {
  transform: (res: any) => {
    if (!res) return null
    if (res.title) return res
    if (res.data && res.data.title) return res.data
    return null
  }
})

// 获取路径的所有章节（用于导航）
const { data: allChapters } = await useFetch(`/api/learning-paths/${pathId}/chapters`, {
  transform: (res: any) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.data && Array.isArray(res.data)) return res.data
    if (res.chapters && Array.isArray(res.chapters)) return res.chapters
    return []
  }
})

if (error.value) {
  console.error('Failed to fetch chapter:', error.value)
}

// 计算上一章和下一章
const prevChapter = computed(() => {
  if (!allChapters.value || !chapter.value) return null
  const currentIndex = allChapters.value.findIndex((c: any) => c.id === chapter.value.id)
  if (currentIndex > 0) {
    return allChapters.value[currentIndex - 1]
  }
  return null
})

const nextChapter = computed(() => {
  if (!allChapters.value || !chapter.value) return null
  const currentIndex = allChapters.value.findIndex((c: any) => c.id === chapter.value.id)
  if (currentIndex >= 0 && currentIndex < allChapters.value.length - 1) {
    return allChapters.value[currentIndex + 1]
  }
  return null
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!chapter.value?.content) return ''
  try {
    return marked(chapter.value.content)
  } catch (e) {
    console.error('Markdown 解析失败:', e)
    return chapter.value.content
  }
})

// 解析外部链接
const externalLinks = computed(() => {
  const links = chapter.value?.external_links
  if (!links) return []
  try {
    if (typeof links === 'string') return JSON.parse(links)
    if (Array.isArray(links)) return links
    return []
  } catch {
    return []
  }
})

// 工具函数
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
</script>

<style scoped>
.prose :deep(h1) {
  @apply text-2xl font-bold text-white mt-6 mb-4;
}
.prose :deep(h2) {
  @apply text-xl font-bold text-white mt-5 mb-3;
}
.prose :deep(h3) {
  @apply text-lg font-semibold text-white mt-4 mb-2;
}
.prose :deep(p) {
  @apply text-[#c9d1d9] leading-relaxed mb-4;
}
.prose :deep(ul) {
  @apply list-disc list-inside mb-4;
}
.prose :deep(ol) {
  @apply list-decimal list-inside mb-4;
}
.prose :deep(li) {
  @apply text-[#c9d1d9] mb-2;
}
.prose :deep(code) {
  @apply bg-[#21262d] text-[#c9d1d9] px-1.5 py-0.5 rounded text-sm;
}
.prose :deep(pre) {
  @apply bg-[#21262d] border border-[#30363d] rounded-lg p-4 overflow-x-auto mb-4;
}
.prose :deep(pre code) {
  @apply bg-transparent p-0;
}
.prose :deep(a) {
  @apply text-[#58a6ff] hover:text-[#79c0ff] transition-colors;
}
.prose :deep(blockquote) {
  @apply border-l-4 border-[#30363d] pl-4 italic text-[#8b949e] mb-4;
}
.prose :deep(strong) {
  @apply text-white font-semibold;
}
</style>
