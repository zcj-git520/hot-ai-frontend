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
              <NuxtLink to="/articles" class="text-white hover:text-[#58a6ff] transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-[#8b949e] hover:text-white transition-colors font-medium">学习路径</NuxtLink>
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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <nav class="flex items-center gap-2 text-sm text-[#8b949e]">
        <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/articles" class="hover:text-white transition-colors">资讯</NuxtLink>
        <span>/</span>
        <span class="text-white truncate">{{ article?.title || '文章详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#58a6ff]"></div>
      <p class="text-[#8b949e] mt-3">加载中...</p>
    </div>

    <!-- 文章详情 -->
    <div v-else-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <article class="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
        <!-- 标题区 -->
        <div class="p-6 sm:p-8 border-b border-[#30363d]">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span :class="getCategoryBadgeClass(article.category_name)">
              {{ article.category_name }}
            </span>
            <span class="flex items-center gap-1 text-[#8b949e] text-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(article.published_at) }}
            </span>
            <span v-if="article.source_name" class="text-[#8b949e] text-sm">来源：{{ article.source_name }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            {{ article.title }}
          </h1>
        </div>

        <!-- 统计栏 -->
        <div class="flex items-center gap-6 px-6 sm:px-8 py-4 border-b border-[#30363d] text-sm text-[#8b949e]">
          <span>👁️ 阅读 {{ formatNumber(article.view_count || 0) }}</span>
          <span>💬 评论 {{ formatNumber(article.comment_count || 0) }}</span>
          <span>🔥 点赞 {{ formatNumber(article.like_count || 0) }}</span>
        </div>

        <!-- 标签 -->
        <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 px-6 sm:px-8 py-4 border-b border-[#30363d]">
          <span v-for="tag in article.tags" :key="tag" class="inline-flex items-center gap-1 bg-[#21262d] text-[#8b949e] text-xs px-3 py-1 rounded-full">
            {{ tag }}
          </span>
        </div>

        <!-- 文章内容 -->
        <div class="p-6 sm:p-8">
          <div v-if="article.content" class="text-[#c9d1d9] leading-relaxed text-sm sm:text-base whitespace-pre-line" v-html="formatContent(article.content)"></div>
          <div v-else class="text-[#8b949e] text-center py-8">
            <p class="text-lg">暂无正文内容</p>
            <p class="text-sm mt-2">该文章可能以摘要形式呈现，或请点击下方链接查看原文</p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-[#30363d] bg-[#21262d]">
          <NuxtLink to="/articles" class="flex items-center gap-2 text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回列表
          </NuxtLink>
          <a
            :href="article.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors"
          >
            查看原文
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </article>
    </div>

    <!-- 错误状态 -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
      <svg class="mx-auto w-20 h-20 text-[#30363d] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h2 class="text-2xl font-bold text-white mb-3">文章不存在</h2>
      <p class="text-[#8b949e] mb-8">该文章可能已被删除或链接已失效</p>
      <NuxtLink to="/articles" class="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-medium transition-colors">
        返回资讯列表
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

onMounted(() => {
  restoreAuth()
})

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

const article = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) return

  try {
    const res = await fetch(`/api/articles/${id}`)
    const raw = await res.json()
    // 后端返回 {code, data, message},提取 data 字段
    const data = raw?.data || raw
    if (data && data.id) {
      article.value = data
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
  } finally {
    loading.value = false
  }
})

const getCategoryBadgeClass = (categoryName: string) => {
  const classMap: Record<string, string> = {
    '动态': 'bg-blue-500/10 text-blue-400',
    '职业': 'bg-orange-500/10 text-orange-400',
    '学习': 'bg-green-500/10 text-green-400',
    '工具': 'bg-purple-500/10 text-purple-400'
  }
  return `text-xs px-3 py-1 rounded-full font-medium ${classMap[categoryName] || 'bg-gray-500/10 text-gray-400'}`
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return String(num)
}

const formatContent = (content: string) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}
</script>
