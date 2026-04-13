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
              <NuxtLink to="/professions" class="text-white font-medium">职业风险</NuxtLink>
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">职业风险查询</h1>
        <p class="text-[#8b949e] text-base sm:text-lg mb-6 sm:mb-8">了解你的职业受 AI 影响的程度和转型建议</p>
        
        <!-- 搜索框 -->
        <div class="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div class="relative">
            <input 
              v-model="searchKeyword"
              type="text" 
              placeholder="搜索职业，例如：设计师、程序员、运营..."
              class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 text-sm sm:text-lg text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff] transition-all"
              @keyup.enter="handleSearch"
            />
            <span class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#8b949e] text-lg sm:text-xl">🔍</span>
            <button v-if="searchKeyword" @click="clearSearch" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white">✕</button>
          </div>
        </div>

        <!-- 风险等级筛选 -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <button 
            :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeRiskLevel === 'all' ? 'bg-blue-600 text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]']"
            @click="handleRiskLevelChange('all')"
          >全部</button>
          <button 
            v-for="level in riskLevels" :key="level.id"
            :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeRiskLevel === level.level ? 'bg-blue-600 text-white' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]']"
            @click="handleRiskLevelChange(level.level)"
          >{{ level.icon }} {{ level.name }}</button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#58a6ff]"></div>
        <p class="text-[#8b949e] mt-3">加载中...</p>
      </div>

      <!-- 职业列表 -->
      <div v-else-if="professions.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <NuxtLink 
          v-for="profession in professions" 
          :key="profession.id"
          :to="`/professions/${profession.id}`"
          class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
        >
          <div class="flex items-start justify-between mb-3 sm:mb-4">
            <span class="text-3xl sm:text-4xl">{{ profession.icon }}</span>
            <span :class="getRiskLevelStyle(profession.risk_level)" class="text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold">
              {{ getRiskLevelName(profession.risk_level) }}
            </span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2 leading-snug">
            {{ profession.name }}
          </h3>
          <p class="text-[#8b949e] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {{ profession.description }}
          </p>
          <div class="flex items-center justify-between">
            <div class="text-xs sm:text-sm">
              <div class="text-[#8b949e] mb-1">风险指数</div>
              <div class="flex items-center gap-2">
                <div class="w-20 sm:w-24 h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div 
                    :class="getRiskColor(profession.risk_score)" 
                    class="h-full rounded-full" 
                    :style="{ width: profession.risk_score + '%' }"
                  ></div>
                </div>
                <span class="text-white font-bold text-xs sm:text-sm">{{ profession.risk_score }}%</span>
              </div>
            </div>
            <span class="text-[#58a6ff] font-medium text-xs sm:text-sm">详情 →</span>
          </div>
        </NuxtLink>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto w-16 h-16 text-[#30363d] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-[#8b949e] text-lg">暂无职业数据</p>
        <p v-if="searchKeyword" class="text-[#484f58] text-sm mt-2">尝试更换搜索关键词</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-2">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-[#8b949e] text-sm hover:bg-[#30363d] disabled:opacity-40 disabled:cursor-not-allowed transition">上一页</button>
        <button v-for="p in totalPages" :key="p" @click="goToPage(p)" :class="['min-w-[40px] h-10 rounded-md text-sm font-medium', currentPage === p ? 'bg-[#58a6ff] text-white' : 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:bg-[#30363d]']">{{ p }}</button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-[#8b949e] text-sm hover:bg-[#30363d] disabled:opacity-40 disabled:cursor-not-allowed transition">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const searchKeyword = ref('')
const activeRiskLevel = ref('all')
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)
const totalPages = ref(0)
const loading = ref(false)

// 风险等级展示
const riskLevels = [
  { id: 'extreme', level: 'extreme', name: '极高风险', icon: '🔴' },
  { id: 'high', level: 'high', name: '高风险', icon: '🟠' },
  { id: 'medium', level: 'medium', name: '中风险', icon: '🟡' },
  { id: 'low', level: 'low', name: '低风险', icon: '🟢' }
]

const getRiskLevelName = (level: string) => {
  const map: Record<string, string> = { extreme: '极高风险', high: '高风险', medium: '中风险', low: '低风险' }
  return map[level] || level
}

// 获取职业列表
const fetchProfessions = async () => {
  loading.value = true
  try {
    const params: any = { page: currentPage.value, page_size: pageSize.value }
    if (activeRiskLevel.value !== 'all') params.risk_level = activeRiskLevel.value
    if (searchKeyword.value) params.keyword = searchKeyword.value

    const { data } = await useFetch('/api/professions', {
      query: params,
      transform: (res: any) => {
        // 后端返回 {code, data, message},提取 data 字段
        const responseData = res?.data || res
        totalCount.value = responseData?.total || 0
        totalPages.value = responseData?.total_pages || 0
        return responseData?.professions || []
      }
    })
    professions.value = data.value || []
  } catch (error) {
    console.error('Failed to fetch professions:', error)
  } finally {
    loading.value = false
  }
}

// 初始加载
const { data: professions } = await useFetch('/api/professions', {
  query: { page: 1, page_size: 12 },
  transform: (res: any) => {
    // 后端返回 {code, data, message},提取 data 字段
    const responseData = res?.data || res
    totalCount.value = responseData?.total || 0
    totalPages.value = responseData?.total_pages || 0
    return responseData?.professions || []
  }
})

const handleSearch = async () => {
  currentPage.value = 1
  await fetchProfessions()
}

const clearSearch = async () => {
  searchKeyword.value = ''
  currentPage.value = 1
  await fetchProfessions()
}

const handleRiskLevelChange = async (level: string) => {
  activeRiskLevel.value = level
  currentPage.value = 1
  await fetchProfessions()
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  await fetchProfessions()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getRiskLevelStyle = (level: string) => {
  const map: Record<string, string> = {
    'extreme': 'bg-red-500/10 text-red-400',
    'high': 'bg-orange-500/10 text-orange-400',
    'medium': 'bg-yellow-500/10 text-yellow-400',
    'low': 'bg-green-500/10 text-green-400'
  }
  return map[level] || 'bg-gray-500/10 text-gray-400'
}

const getRiskColor = (score: number) => {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-orange-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
}
</script>
