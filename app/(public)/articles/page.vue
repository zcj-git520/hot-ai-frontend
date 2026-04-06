<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">最新资讯</h1>
      <p class="text-gray-600">
        追踪 AI 领域最新动态，洞察职业发展趋势
      </p>
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
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="activeCategory = category.code"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">加载中...</p>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="articles && articles.length > 0" class="space-y-6">
      <article 
        v-for="article in articles"
        :key="article.id"
        class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                getCategoryColor(article.category_code || article.category_name)
              ]"
            >
              {{ article.category_name }}
            </span>
            <span class="text-sm text-gray-500">{{ article.published_at }}</span>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span> {{ article.view_count }}</span>
            <span> {{ article.comment_count }}</span>
          </div>
        </div>
        <h2 class="text-xl font-semibold mb-3">
          <NuxtLink :to="`/articles/${article.id}`" class="hover:text-blue-600">
            {{ article.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-600 mb-4 line-clamp-2">
          {{ article.summary }}
        </p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">来源：</span>
            <span class="text-sm text-gray-700">{{ article.source_name }}</span>
          </div>
          <div class="flex gap-2">
            <NuxtLink 
              :to="`/articles/${article.id}`"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              阅读全文 →
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500">暂无文章数据</p>
    </div>

    <!-- 分页 -->
    <div class="mt-12 flex justify-center">
      <nav class="flex items-center gap-2">
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">上一页</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md">1</button>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">2</button>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">3</button>
        <span class="px-2">...</span>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">10</button>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">下一页</button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const activeCategory = ref('all')
const loading = ref(false)

// 获取分类列表 - 使用useFetch在SSR和客户端都执行
const { data: categories } = await useFetch('/api/articles/categories', {
  transform: (data) => {
    console.log('[API] 分类数据:', data)
    return data || []
  }
})

// 构建查询参数
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

// 获取文章列表 - 使用useFetch在SSR和客户端都执行
const { data: articles, refresh: refreshArticles } = await useFetch('/api/articles', {
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
