<template>
  <div class="min-h-screen bg-[#0a0e14]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-white/5 bg-[#0d1117]/90 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI 热点追踪</span>
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
              <NuxtLink to="/register" class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl">注册</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- 章节进度条 -->
    <div v-if="chapter && allChaptersRaw && allChaptersRaw.length > 0" class="bg-[#0d1117] border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="flex items-center gap-2 text-sm text-[#8b949e]">
              <span class="text-[#58a6ff] font-medium">{{ chapter.order_index }}</span>
              <span>/</span>
              <span>{{ allChaptersRaw.length }}</span>
            </div>
            <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                   :style="{ width: `${(chapter.order_index / allChaptersRaw.length) * 100}%` }"></div>
            </div>
          </div>
          <NuxtLink :to="`/learning-paths/${id}`" class="text-sm text-[#8b949e] hover:text-white transition-colors flex-shrink-0">
            查看全部章节
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <nav class="flex items-center gap-2 text-sm text-[#8b949e] flex-wrap">
        <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        <NuxtLink to="/learning-paths" class="hover:text-white transition-colors">学习路径</NuxtLink>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        <NuxtLink :to="`/learning-paths/${id}`" class="hover:text-white transition-colors truncate max-w-[200px]">
          {{ learningPath?.title || '路径详情' }}
        </NuxtLink>
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        <span class="text-white truncate max-w-[200px] font-medium">{{ chapter?.title || '章节详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent"></div>
      </div>
      <p class="text-[#8b949e]">正在加载章节内容...</p>
    </div>

    <!-- 章节详情 -->
    <div v-else-if="chapter && learningPath" class="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
      <!-- 章节头部卡片 -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161b22] to-[#1a2030] border border-white/10 p-6 sm:p-8 mb-8">
        <!-- 背景装饰 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        
        <div class="relative flex items-start gap-5">
          <div class="flex-shrink-0">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
              {{ chapter.order_index }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap mb-3">
              <span :class="getContentTypeStyle(chapter.content_type)" class="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {{ getContentTypeName(chapter.content_type) }}
              </span>
              <span class="text-[#8b949e] text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ chapter.estimated_hours }} 小时
              </span>
              <span v-if="chapter.is_free" class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-medium">免费</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">{{ chapter.title }}</h1>
            <p class="text-[#8b949e] text-base leading-relaxed">{{ chapter.description }}</p>
          </div>
        </div>
      </div>

      <!-- 章节内容区域 -->
      <div class="bg-[#0d1117] rounded-2xl border border-white/5 overflow-hidden mb-8">
        <!-- 内容标题 -->
        <div class="border-b border-white/5 px-6 sm:px-8 py-4 flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-green-400"></div>
          <span class="text-white font-medium">章节内容</span>
        </div>
        
        <!-- Markdown 内容 -->
        <div class="px-6 sm:px-8 py-8">
          <article class="prose prose-invert max-w-none article-content" v-html="renderedContent"></article>
        </div>
      </div>

      <!-- 外部链接 -->
      <div v-if="externalLinks.length > 0" class="bg-[#0d1117] rounded-2xl border border-white/5 overflow-hidden mb-8">
        <div class="border-b border-white/5 px-6 sm:px-8 py-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-[#58a6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          <span class="text-white font-medium">相关资源</span>
        </div>
        <div class="px-6 sm:px-8 py-5">
          <ul class="space-y-3">
            <li v-for="(link, index) in externalLinks" :key="index">
              <a :href="link" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-3 text-[#58a6ff] hover:text-[#79c0ff] transition-colors group p-3 rounded-lg hover:bg-white/5">
                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
                <span class="truncate">{{ link }}</span>
                <svg class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 章节导航 - 改进版 -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <!-- 上一章 -->
        <NuxtLink v-if="prevChapter"
                  :to="`/learning-paths/${id}/chapters/${prevChapter.id}`"
                  class="group relative overflow-hidden rounded-xl bg-[#161b22] border border-white/10 hover:border-blue-500/30 transition-all duration-300 p-5">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <div class="flex items-center gap-2 text-[#8b949e] text-sm mb-2">
              <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              <span>上一章</span>
            </div>
            <div class="text-white font-medium group-hover:text-[#58a6ff] transition-colors line-clamp-2">
              {{ prevChapter.title }}
            </div>
          </div>
        </NuxtLink>
        <div v-else class="rounded-xl bg-white/5 border border-white/5 p-5 flex items-center justify-center text-[#484f58] text-sm">
          已是第一章
        </div>

        <!-- 中间按钮 -->
        <div class="flex items-center justify-center">
          <NuxtLink :to="`/learning-paths/${id}`"
                    class="w-12 h-12 rounded-xl bg-[#161b22] border border-white/10 hover:border-white/20 hover:bg-[#21262d] transition-all flex items-center justify-center group">
            <svg class="w-5 h-5 text-[#8b949e] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </NuxtLink>
        </div>

        <!-- 下一章 -->
        <NuxtLink v-if="nextChapter"
                  :to="`/learning-paths/${id}/chapters/${nextChapter.id}`"
                  class="group relative overflow-hidden rounded-xl bg-[#161b22] border border-white/10 hover:border-purple-500/30 transition-all duration-300 p-5">
          <div class="absolute inset-0 bg-gradient-to-l from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative text-right">
            <div class="flex items-center justify-end gap-2 text-[#8b949e] text-sm mb-2">
              <span>下一章</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </div>
            <div class="text-white font-medium group-hover:text-[#a78bfa] transition-colors line-clamp-2">
              {{ nextChapter.title }}
            </div>
          </div>
        </NuxtLink>
        <div v-else class="rounded-xl bg-white/5 border border-white/5 p-5 flex items-center justify-center text-[#484f58] text-sm">
          已是最后一章
        </div>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
        <svg class="w-10 h-10 text-[#484f58]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h2 class="text-2xl font-bold text-white mb-3">章节不存在</h2>
      <p class="text-[#8b949e] mb-8">抱歉，您访问的章节不存在或已被删除</p>
      <NuxtLink :to="`/learning-paths/${id}`"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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

// 获取学习路径详情（包含所有章节）
const { data: learningPath, pending: lpLoading } = await useFetch(`/api/learning-paths/${id}`, {
  transform: (res: any) => {
    if (!res) return null
    const responseData = res?.data || res
    if (!responseData) return null
    if (responseData.title) return responseData
    return null
  }
})

// 获取所有章节（后端没有单个章节详情接口，需要从列表中找到）
const { data: allChaptersRaw, pending: chaptersLoading } = await useFetch(`/api/learning-paths/${id}/chapters`, {
  transform: (res: any) => {
    if (!res) return []
    const responseData = res?.data || res
    if (!responseData) return []
    if (Array.isArray(responseData)) return responseData
    if (responseData.chapters && Array.isArray(responseData.chapters)) return responseData.chapters
    return []
  }
})

const loading = computed(() => lpLoading.value || chaptersLoading.value)

// 从章节列表中找到当前章节，并计算 prev/next
const chapter = computed(() => {
  if (!allChaptersRaw.value || !chapterId) return null
  return allChaptersRaw.value.find((ch: any) => String(ch.id) === String(chapterId)) || null
})

const chapterIndex = computed(() => {
  if (!allChaptersRaw.value || !chapter.value) return -1
  return allChaptersRaw.value.findIndex((ch: any) => String(ch.id) === String(chapterId))
})

const prevChapter = computed(() => {
  if (!allChaptersRaw.value || chapterIndex.value <= 0) return null
  return allChaptersRaw.value[chapterIndex.value - 1]
})

const nextChapter = computed(() => {
  if (!allChaptersRaw.value || chapterIndex.value >= allChaptersRaw.value.length - 1) return null
  return allChaptersRaw.value[chapterIndex.value + 1]
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
    'article': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    'video': 'bg-red-500/10 text-red-400 border border-red-500/20',
    'practice': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'external': 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  }
  return map[type] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
}
</script>

<style scoped>
.article-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.3;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e6edf3;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-content :deep(h4) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e6edf3;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.article-content :deep(p) {
  color: #c9d1d9;
  line-height: 1.8;
  margin-bottom: 1.25rem;
  font-size: 1rem;
}

.article-content :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.25rem;
}

.article-content :deep(ul > li) {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: #c9d1d9;
  line-height: 1.7;
}

.article-content :deep(ul > li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #58a6ff;
}

.article-content :deep(ol) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.25rem;
  counter-reset: item;
}

.article-content :deep(ol > li) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
  color: #c9d1d9;
  line-height: 1.7;
  counter-increment: item;
}

.article-content :deep(ol > li)::before {
  content: counter(item);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: rgba(88, 166, 255, 0.15);
  color: #58a6ff;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-content :deep(li) {
  color: #c9d1d9;
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.article-content :deep(code) {
  background: rgba(110, 118, 129, 0.2);
  color: #f0f6fc;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 0.875em;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.article-content :deep(pre) {
  background: #161b22;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.article-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #e6edf3;
  font-size: 0.875rem;
  line-height: 1.6;
}

.article-content :deep(a) {
  color: #58a6ff;
  text-decoration: none;
  transition: color 0.2s;
}

.article-content :deep(a:hover) {
  color: #79c0ff;
  text-decoration: underline;
}

.article-content :deep(blockquote) {
  border-left: 3px solid #58a6ff;
  padding-left: 1rem;
  margin: 1.25rem 0;
  color: #8b949e;
  font-style: italic;
}

.article-content :deep(strong) {
  color: #ffffff;
  font-weight: 600;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.25rem;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.article-content :deep(th) {
  background: rgba(88, 166, 255, 0.1);
  color: #ffffff;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.article-content :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #c9d1d9;
}

.article-content :deep(tr:last-child td) {
  border-bottom: none;
}

.article-content :deep(tr:hover td) {
  background: rgba(255, 255, 255, 0.02);
}

.article-content :deep(hr) {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
