<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
        <h1 class="font-tech text-3xl font-bold tracking-wider">最新资讯</h1>
      </div>
      <p class="text-gray-500 font-mono text-sm ml-4">
        <span class="text-cyan-400">//</span> 追踪 AI 领域最新动态，洞察职业发展趋势 <span class="text-cyan-400">//</span>
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="mb-6">
      <div class="relative max-w-2xl">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文章标题或内容..."
          class="input-cyber pl-12 pr-12"
          @keyup.enter="handleSearch"
        />
        <button
          v-if="searchKeyword"
          @click="clearSearch"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
          activeCategory === 'all'
            ? 'bg-cyan-500 text-gray-900 border border-cyan-400'
            : 'bg-cyan-500/5 border border-cyan-500/20 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50'
        ]"
        @click="handleCategoryChange('all')"
      >
        全部
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
          activeCategory === category.code
            ? 'bg-cyan-500 text-gray-900 border border-cyan-400'
            : 'bg-cyan-500/5 border border-cyan-500/20 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50'
        ]"
        @click="handleCategoryChange(category.code)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 3" :key="i" class="glass-card p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="skeleton h-6 w-20"></div>
          <div class="skeleton h-4 w-32"></div>
        </div>
        <div class="skeleton h-6 w-3/4 mb-2"></div>
        <div class="skeleton h-6 w-1/2 mb-4"></div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-4 w-2/3"></div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="articles && articles.length > 0" class="space-y-6">
      <article
        v-for="article in articles"
        :key="article.id"
        class="glass-card card-decoration p-6 group hover:border-cyan-400/50 transition-all duration-300"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-3 flex-wrap">
            <span :class="['tag-cyber', getCategoryClass(article.category_code || article.category_name)]">
              {{ article.category_name }}
            </span>
            <span class="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(article.published_at) }}
            </span>
            <span v-if="article.author" class="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ article.author }}
            </span>
          </div>
        </div>

        <h2 class="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
          <NuxtLink :to="`/articles/${article.id}`">
            {{ article.title }}
          </NuxtLink>
        </h2>

        <p class="text-gray-500 mb-4 line-clamp-2 text-sm">
          {{ article.summary }}
        </p>

        <!-- 统计信息 -->
        <div class="flex items-center gap-6 text-xs text-gray-600 mb-4">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ formatNumber(article.view_count || 0) }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {{ formatNumber(article.comment_count || 0) }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ formatNumber(article.like_count || 0) }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-cyan-500/10">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-600">来源:</span>
            <span class="text-xs text-cyan-400 font-medium">{{ article.source_name }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="toggleFavorite(article)"
              class="flex items-center gap-1 text-xs transition-colors"
              :class="article.is_favorited ? 'text-red-400' : 'text-gray-500 hover:text-red-400'"
            >
              <svg class="w-4 h-4" :fill="article.is_favorited ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {{ article.is_favorited ? '已收藏' : '收藏' }}
            </button>
            <a
              v-if="article.original_url"
              :href="article.original_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1 text-xs text-gray-500 hover:text-green-400 transition-colors"
              @click.stop
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              查看原文
            </a>
            <NuxtLink
              :to="`/articles/${article.id}`"
              class="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              阅读全文
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-else class="glass-card p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
        <svg class="w-8 h-8 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-400 text-lg mb-2">暂无文章数据</p>
      <p v-if="searchKeyword" class="text-gray-600 text-sm">尝试更换搜索关键词或清除筛选条件</p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
      <nav class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn-cyber-ghost flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一页
        </button>

        <template v-for="page in displayPages" :key="page">
          <span v-if="page === '...'" class="px-2 text-gray-600 font-mono">...</span>
          <button
            v-else
            @click="goToPage(page as number)"
            :class="[
              'w-10 h-10 rounded-lg text-sm font-mono transition-all duration-300',
              currentPage === page
                ? 'bg-cyan-500 text-gray-900 border border-cyan-400'
                : 'btn-cyber-ghost'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn-cyber-ghost flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          下一页
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      <div class="text-xs text-gray-500 font-mono">
        第 <span class="text-cyan-400">{{ currentPage }}</span> / <span>{{ totalPages }}</span> 页，共 <span class="text-cyan-400">{{ totalCount }}</span> 条
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const activeCategory = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const totalPages = ref(0)
const loading = ref(false)

const { data: categories } = await useFetch('/api/articles/categories', {
  transform: (data) => {
    const responseData = data?.data || data
    return responseData || []
  }
})

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

const fetchArticles = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/articles', {
      query: buildQuery(),
      transform: (res) => {
        const responseData = res?.data || res
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

const { data: articles } = await useFetch('/api/articles', {
  query: buildQuery(),
  transform: (res) => {
    const responseData = res?.data || res
    totalCount.value = responseData?.total || 0
    totalPages.value = responseData?.total_pages || 0
    return responseData?.articles || []
  }
})

const handleCategoryChange = async (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
  await fetchArticles()
}

const handleSearch = async () => {
  currentPage.value = 1
  await fetchArticles()
}

const clearSearch = async () => {
  searchKeyword.value = ''
  currentPage.value = 1
  await fetchArticles()
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }
  currentPage.value = page
  await fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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

const toggleFavorite = async (article: any) => {
  article.is_favorited = !article.is_favorited
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const getCategoryClass = (code: string) => {
  const map: Record<string, string> = {
    news: 'category-news',
    impact: 'category-impact',
    learn: 'category-learn',
    tool: 'category-tool',
  }
  return map[code] || 'category-news'
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
