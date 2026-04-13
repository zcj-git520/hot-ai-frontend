<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">最新资讯</h1>
      <p class="text-gray-600">
        追踪 AI 领域最新动态，洞察职业发展趋势
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="mb-6">
      <div class="relative max-w-2xl">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icons name="search" class="text-gray-400" />
        </div>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文章标题或内容..."
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          @keyup.enter="handleSearch"
        />
        <button
          v-if="searchKeyword"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button 
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          activeCategory === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="handleCategoryChange(category.code)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">加载中...</p>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="articles && articles.length > 0" class="space-y-6">
      <article 
        v-for="article in articles"
        :key="article.id"
        class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3 flex-wrap">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                getCategoryColor(article.category_code || article.category_name)
              ]"
            >
              {{ article.category_name }}
            </span>
            <span class="flex items-center text-sm text-gray-500">
              <Icons name="calendar" class="mr-1" />
              {{ formatDate(article.published_at) }}
            </span>
            <span v-if="article.author" class="flex items-center text-sm text-gray-500">
              <Icons name="user" class="mr-1" />
              {{ article.author }}
            </span>
          </div>
        </div>

        <h2 class="text-xl font-semibold mb-3">
          <NuxtLink :to="`/articles/${article.id}`" class="hover:text-blue-600 transition">
            {{ article.title }}
          </NuxtLink>
        </h2>

        <p class="text-gray-600 mb-4 line-clamp-2">
          {{ article.summary }}
        </p>

        <!-- 统计信息 -->
        <div class="flex items-center gap-6 text-sm text-gray-500 mb-4">
          <span class="flex items-center gap-1">
            <Icons name="eye" class="text-gray-400" />
            {{ formatNumber(article.view_count || 0) }}
          </span>
          <span class="flex items-center gap-1">
            <Icons name="chat" class="text-gray-400" />
            {{ formatNumber(article.comment_count || 0) }}
          </span>
          <span class="flex items-center gap-1">
            <Icons name="heart" class="text-gray-400" />
            {{ formatNumber(article.like_count || 0) }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-4 border-t">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">来源：</span>
            <span class="text-sm text-gray-700 font-medium">{{ article.source_name }}</span>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="toggleFavorite(article)"
              class="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
              :class="{ 'text-red-500': article.is_favorited }"
            >
              <Icons name="bookmark" />
              <span class="text-sm">{{ article.is_favorited ? '已收藏' : '收藏' }}</span>
            </button>
            <NuxtLink 
              :to="`/articles/${article.id}`"
              class="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              阅读全文
              <Icons name="external-link" />
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-500 text-lg">暂无文章数据</p>
      <p v-if="searchKeyword" class="text-gray-400 text-sm mt-2">尝试更换搜索关键词或清除筛选条件</p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="mt-12 flex justify-center">
      <nav class="flex items-center gap-2">
        <button 
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Icons name="chevron-left" />
          上一页
        </button>
        
        <!-- 页码按钮 -->
        <template v-for="page in displayPages" :key="page">
          <span v-if="page === '...'" class="px-2 text-gray-500">...</span>
          <button 
            v-else
            @click="goToPage(page as number)"
            :class="[
              'px-4 py-2 rounded-md transition',
              currentPage === page 
                ? 'bg-blue-600 text-white' 
                : 'border hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button 
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          下一页
          <Icons name="chevron-right" />
        </button>
      </nav>
      
      <div class="ml-4 flex items-center text-sm text-gray-500">
        第 {{ currentPage }} / {{ totalPages }} 页，共 {{ totalCount }} 条
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 状态管理
const activeCategory = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
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
  currentPage.value = 1 // 重置到第一页
  await fetchArticles()
}

// 处理搜索
const handleSearch = async () => {
  currentPage.value = 1 // 重置到第一页
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
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 计算显示的页码
const displayPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 总页数 <= 7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数 > 7，显示省略号
    if (current <= 4) {
      // 当前页在前面
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后面
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
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

// 收藏/取消收藏
const toggleFavorite = async (article: any) => {
  // TODO: 实现收藏功能
  console.log('切换收藏状态:', article.id)
  article.is_favorited = !article.is_favorited
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getCategoryColor = (code: string) => {
  const colorMap: Record<string, string> = {
    'news': 'bg-blue-100 text-blue-800',
    'impact': 'bg-orange-100 text-orange-800',
    'learn': 'bg-green-100 text-green-800',
    'tool': 'bg-purple-100 text-purple-800'
  }
  return colorMap[code] || 'bg-gray-100 text-gray-800'
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
