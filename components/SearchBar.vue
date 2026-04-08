<template>
  <div class="relative">
    <!-- 搜索输入框 -->
    <div class="relative">
      <input
        v-model="query"
        type="text"
        placeholder="搜索文章、职业..."
        class="w-full pl-10 pr-4 py-2 border border-[#30363d] bg-[#0d1117] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
        @keyup.enter="performSearch"
        @input="handleInput"
      />
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        v-if="query"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] hover:text-white"
      >
        ✕
      </button>
    </div>

    <!-- 搜索结果下拉框 -->
    <div
      v-if="showResults && results.length > 0"
      class="absolute top-full mt-1 w-full bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <div v-for="result in results" :key="result.id" class="p-3 hover:bg-[#21262d] border-b border-[#30363d] last:border-b-0 cursor-pointer" @click="goToResult(result)">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 mt-1">
            <div v-if="result.type === 'article'" class="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
              <span class="text-blue-400 text-xs">📰</span>
            </div>
            <div v-else-if="result.type === 'profession'" class="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
              <span class="text-purple-400 text-xs">💼</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="text-white font-medium truncate">{{ result.title }}</h4>
              <span class="text-xs px-2 py-1 rounded-full" :class="getTypeBadgeClass(result.type)">
                {{ result.type === 'article' ? '文章' : '职业' }}
              </span>
            </div>
            <p v-if="result.summary" class="text-[#8b949e] text-sm mt-1 line-clamp-2">{{ result.summary }}</p>
            <div v-if="result.riskLevel" class="mt-2">
              <span class="text-xs px-2 py-0.5 rounded-full" :class="getRiskBadgeClass(result.riskLevel)">
                {{ result.riskLevel === 'extreme' ? '极高风险' : result.riskLevel === 'high' ? '高风险' : result.riskLevel === 'medium' ? '中等风险' : '低风险' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasMore" class="p-3 text-center border-t border-[#30363d]">
        <button @click="viewAllResults" class="text-[#58a6ff] hover:text-[#79c0ff] text-sm">
          查看全部结果 ({{ totalResults }})
        </button>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div
      v-if="showResults && query && results.length === 0 && !loading"
      class="absolute top-full mt-1 w-full bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50 p-4 text-center"
    >
      <p class="text-[#8b949e]">未找到相关结果</p>
    </div>

    <!-- 加载指示器 -->
    <div
      v-if="loading"
      class="absolute top-full mt-1 w-full bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50 p-4 text-center"
    >
      <p class="text-[#8b949e]">搜索中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from '#app'
import { articleApi, professionApi } from '~/app/lib/api'

interface SearchResult {
  id: string
  type: 'article' | 'profession'
  title: string
  summary?: string
  riskLevel?: string
  slug?: string
}

const router = useRouter()
const query = ref('')
const results = ref<SearchResult[]>([])
const showResults = ref(false)
const loading = ref(false)
const totalResults = ref(0)
const hasMore = ref(false)

// 防抖搜索
let searchTimeout: NodeJS.Timeout | null = null

const handleInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!query.value.trim()) {
    results.value = []
    showResults.value = false
    return
  }

  searchTimeout = setTimeout(() => {
    performSearch()
  }, 300)
}

const performSearch = async () => {
  const searchQuery = query.value.trim()
  if (!searchQuery) {
    results.value = []
    showResults.value = false
    return
  }

  loading.value = true
  showResults.value = true

  try {
    // 并行搜索文章和职业
    const [articlesResponse, professionsResponse] = await Promise.allSettled([
      articleApi.getList({ keyword: searchQuery, pageSize: 5 }),
      professionApi.search(searchQuery)
    ])

    const newResults: SearchResult[] = []

    // 处理文章结果
    if (articlesResponse.status === 'fulfilled' && articlesResponse.value?.data?.articles) {
      articlesResponse.value.data.articles.forEach((article: any) => {
        newResults.push({
          id: article.id,
          type: 'article',
          title: article.title,
          summary: article.summary,
          slug: article.id
        })
      })
      totalResults.value += articlesResponse.value.data.total || 0
    }

    // 处理职业结果
    if (professionsResponse.status === 'fulfilled' && professionsResponse.value?.data?.professions) {
      professionsResponse.value.data.professions.forEach((profession: any) => {
        newResults.push({
          id: profession.id,
          type: 'profession',
          title: profession.name,
          summary: profession.description,
          riskLevel: profession.risk_level,
          slug: profession.slug
        })
      })
      totalResults.value += professionsResponse.value.data.total || 0
    }

    results.value = newResults
    hasMore.value = newResults.length > 0 && totalResults.value > newResults.length
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  query.value = ''
  results.value = []
  showResults.value = false
  totalResults.value = 0
  hasMore.value = false
}

const goToResult = (result: SearchResult) => {
  if (result.type === 'article') {
    router.push(`/articles/${result.slug || result.id}`)
  } else if (result.type === 'profession') {
    router.push(`/professions/${result.slug || result.id}`)
  }
  clearSearch()
}

const viewAllResults = () => {
  // 跳转到搜索结果页，传递查询参数
  router.push(`/search?q=${encodeURIComponent(query.value)}`)
  clearSearch()
}

const getTypeBadgeClass = (type: string) => {
  return type === 'article'
    ? 'bg-blue-500/10 text-blue-400'
    : 'bg-purple-500/10 text-purple-400'
}

const getRiskBadgeClass = (riskLevel: string) => {
  const classes: Record<string, string> = {
    extreme: 'bg-red-500/10 text-red-400',
    high: 'bg-orange-500/10 text-orange-400',
    medium: 'bg-yellow-500/10 text-yellow-400',
    low: 'bg-green-500/10 text-green-400'
  }
  return classes[riskLevel] || 'bg-gray-500/10 text-gray-400'
}

// 点击外部关闭搜索结果
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>