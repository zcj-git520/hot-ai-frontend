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
              <NuxtLink to="/" class="text-white hover:text-[#58a6ff] transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-[#8b949e] hover:text-white transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-[#8b949e] hover:text-white transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-[#8b949e] hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <template v-if="user">
              <!-- 已登录：显示用户信息 -->
              <NuxtLink to="/profile" class="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="font-medium text-sm hidden sm:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button
                @click="handleLogout"
                class="text-[#8b949e] hover:text-white transition-colors font-medium text-xs sm:text-sm"
              >
                退出
              </button>
            </template>
            <template v-else>
              <!-- 未登录：显示登录注册 -->
              <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium text-sm">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl">
                注册
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <!-- 主内容区（移动端单列，桌面端双列） -->
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <!-- 主内容区 -->
        <main class="flex-1 min-w-0 order-2 lg:order-1">
          <!-- 统计卡片 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-3 sm:p-4 hover:border-[#58a6ff] transition-all cursor-pointer group">
              <div class="text-[#8b949e] text-xs sm:text-sm mb-1 sm:mb-2">📰 资讯总数</div>
              <div class="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#58a6ff] transition-colors">{{ stats.articles }}</div>
              <div class="text-[#3fb950] text-xs sm:text-sm mt-1">↑ {{ stats.articlesGrowth }} 较上周</div>
            </div>
            <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-3 sm:p-4 hover:border-[#58a6ff] transition-all cursor-pointer group">
              <div class="text-[#8b949e] text-xs sm:text-sm mb-1 sm:mb-2">💼 职业分析</div>
              <div class="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#58a6ff] transition-colors">{{ stats.professions }}</div>
              <div class="text-[#3fb950] text-xs sm:text-sm mt-1">↑ {{ stats.professionsGrowth }} 较上周</div>
            </div>
            <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-3 sm:p-4 hover:border-[#58a6ff] transition-all cursor-pointer group">
              <div class="text-[#8b949e] text-xs sm:text-sm mb-1 sm:mb-2">🎓 学习路径</div>
              <div class="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#58a6ff] transition-colors">{{ stats.learningPaths }}</div>
              <div class="text-[#3fb950] text-xs sm:text-sm mt-1">↑ {{ stats.learningPathsGrowth }} 较上周</div>
            </div>
            <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-3 sm:p-4 hover:border-[#58a6ff] transition-all cursor-pointer group">
              <div class="text-[#8b949e] text-xs sm:text-sm mb-1 sm:mb-2">👥 活跃用户</div>
              <div class="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#58a6ff] transition-colors">{{ stats.users }}</div>
              <div class="text-[#3fb950] text-xs sm:text-sm mt-1">↑ {{ stats.usersGrowth }} 较上周</div>
            </div>
          </div>

          <!-- 最新资讯 -->
          <section class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span class="w-1 h-5 sm:h-6 bg-[#58a6ff] rounded"></span>
                最新资讯
              </h2>
              <NuxtLink to="/articles" class="text-[#58a6ff] hover:text-[#79c0ff] font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors">
                查看更多 <span>→</span>
              </NuxtLink>
            </div>
            <div class="space-y-3">
              <article
                v-for="(article, index) in articles"
                :key="article.id"
                class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5 hover:border-[#58a6ff] transition-all cursor-pointer group"
                @click="navigateTo(`/articles/${article.id}`)"
              >
                <div class="flex flex-col gap-3">
                  <div>
                    <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                      <span :class="getCategoryTagStyle(article.category)" class="text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                        {{ article.category }}
                      </span>
                      <span class="text-[#8b949e] text-xs">{{ article.date }}</span>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2 leading-snug">
                      {{ article.title }}
                    </h3>
                    <p class="text-[#8b949e] text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
                      {{ article.summary }}
                    </p>
                    <div class="flex items-center gap-4 sm:gap-6 text-xs text-[#8b949e]">
                      <span>👁️ {{ article.views }}</span>
                      <span>💬 {{ article.comments }}</span>
                      <span>🔥 {{ article.hot }}</span>
                    </div>
                  </div>
                  <div class="sm:hidden text-xs text-[#3fb950] font-medium">{{ article.change }} · {{ article.impact }}</div>
                </div>
              </article>
            </div>
          </section>

          <!-- 热门话题 -->
          <section>
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span class="w-1 h-5 sm:h-6 bg-[#f0883e] rounded"></span>
                热门话题
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                v-for="topic in topics"
                :key="topic.id"
                class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5 hover:border-[#f0883e] transition-all cursor-pointer group"
              >
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-[#f0883e] transition-colors leading-snug">
                    {{ topic.title }}
                  </h3>
                  <span class="bg-[#f0883e]/10 text-[#f0883e] text-xs px-2 py-1 rounded font-medium flex-shrink-0 ml-2">
                    TOP {{ topic.rank }}
                  </span>
                </div>
                <p class="text-[#8b949e] text-xs sm:text-sm mb-4 line-clamp-2">
                  {{ topic.summary }}
                </p>
                <div class="flex items-center justify-between text-xs text-[#8b949e]">
                  <div class="flex items-center gap-3 sm:gap-4">
                    <span>🔥 {{ topic.hot }}热度</span>
                    <span>📈 {{ topic.trend }}</span>
                  </div>
                  <span class="text-[#58a6ff]">→</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- 右侧边栏（移动端在底部，桌面端在右侧） -->
        <aside class="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2 space-y-4 lg:space-y-6">
          <!-- 搜索框 -->
          <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <div class="relative mb-4">
              <input
                type="text"
                placeholder="搜索资讯、职业、工具..."
                class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2.5 sm:py-3 pl-10 text-sm sm:text-base text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]">🔍</span>
            </div>

            <!-- 热门查询标签 -->
            <div class="flex flex-wrap gap-2">
              <span class="text-xs text-[#8b949e] mr-2">热门：</span>
              <NuxtLink to="/professions" class="text-xs bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] px-3 py-1.5 rounded transition-colors">
                设计师
              </NuxtLink>
              <NuxtLink to="/professions" class="text-xs bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] px-3 py-1.5 rounded transition-colors">
                程序员
              </NuxtLink>
              <NuxtLink to="/professions" class="text-xs bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] px-3 py-1.5 rounded transition-colors">
                运营
              </NuxtLink>
              <NuxtLink to="/professions" class="text-xs bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] px-3 py-1.5 rounded transition-colors">
                文案
              </NuxtLink>
            </div>
          </div>

          <!-- 热门排行 -->
          <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-[#f0883e]">🔥</span> 热门排行
            </h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in rankings"
                :key="item.id"
                class="flex items-start gap-3 group cursor-pointer"
              >
                <span :class="getRankStyle(index)" class="text-sm font-bold w-5 flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm text-[#8b949e] group-hover:text-[#58a6ff] transition-colors line-clamp-2 mb-1">
                    {{ item.title }}
                  </h4>
                  <div class="text-xs text-[#8b949e]">{{ item.hot }}热度</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 推荐工具 -->
          <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>🛠️</span> 推荐工具
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="tool in tools"
                :key="tool.id"
                :to="tool.link"
                class="flex items-center justify-between p-3 bg-[#21262d] hover:bg-[#30363d] rounded-md transition-all group"
              >
                <div class="flex items-center gap-3">
                  <span class="text-xl">{{ tool.icon }}</span>
                  <div>
                    <div class="text-sm font-medium text-white group-hover:text-[#58a6ff] transition-colors">
                      {{ tool.name }}
                    </div>
                    <div class="text-xs text-[#8b949e]">{{ tool.desc }}</div>
                  </div>
                </div>
                <span class="text-[#58a6ff] text-sm">→</span>
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { articleApi, toolApi } from '~/app/lib/api'
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

// 获取认证信息
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

// 恢复用户认证信息
onMounted(() => {
  restoreAuth()
})

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

// 状态数据
const stats = ref({
  articles: 0,
  professions: 0,
  learningPaths: 0,
  users: 0,
  articlesGrowth: '0%',
  professionsGrowth: '0%',
  learningPathsGrowth: '0%',
  usersGrowth: '0%'
})

// 资讯数据
const articles = ref([])

// 热门话题数据
const topics = ref([])

// 热门排行数据
const rankings = ref([])

// 推荐工具数据
const tools = ref([])

// 从 API 获取首页数据
onMounted(async () => {
  try {
    // 获取统计数据 - 使用 Nuxt devProxy
    const statsRes = await fetch('/api/home/stats')
    if (statsRes.ok) {
      const statsData = await statsRes.json()
      stats.value = statsData
    }

    // 获取最新资讯 - 使用封装的 API
    try {
      const articlesData = await articleApi.getList({ page: 1, pageSize: 5 })
      if (articlesData && articlesData.articles) {
        articles.value = articlesData.articles.map((article: any) => ({
          id: article.id,
          category: article.category_name || '资讯',
          date: article.published_at?.split('T')[0] || '',
          title: article.title,
          summary: article.summary,
          views: formatNumber(article.view_count),
          comments: String(article.comment_count),
          hot: formatNumber(article.like_count || 0),
          change: '+0%',
          impact: `来源：${article.source_name || ''}`
        }))
      }
    } catch (error) {
      console.error('Failed to load articles:', error)
    }

    // 获取热门话题 - 使用 Nuxt devProxy
    const topicsRes = await fetch('/api/home/topics')
    if (topicsRes.ok) {
      const topicsData = await topicsRes.json()
      topics.value = topicsData.topics || []
    }

    // 获取热门排行 - 使用 Nuxt devProxy
    const rankingsRes = await fetch('/api/home/rankings')
    if (rankingsRes.ok) {
      const rankingsData = await rankingsRes.json()
      rankings.value = rankingsData.items || []
    }

    // 获取推荐工具 - 使用封装的 API
    try {
      const toolsData = await toolApi.getList({ page: 1, pageSize: 3 })
      if (toolsData && toolsData.list) {
        tools.value = toolsData.list.map((tool: any) => ({
          id: tool.id,
          name: tool.name,
          icon: tool.icon || '🛠️',
          desc: tool.description,
          link: `/tools/${tool.slug}`
        }))
      }
    } catch (error) {
      console.error('Failed to load tools:', error)
    }
  } catch (error) {
    console.error('Failed to fetch home data:', error)
  }
})

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

// 获取分类标签样式
const getCategoryTagStyle = (category: string) => {
  const styles: Record<string, string> = {
    '大模型': 'bg-blue-500/10 text-blue-400',
    '行业动态': 'bg-green-500/10 text-green-400',
    '技术突破': 'bg-purple-500/10 text-purple-400',
    '产品发布': 'bg-orange-500/10 text-orange-400'
  }
  return styles[category] || 'bg-gray-500/10 text-gray-400'
}

// 获取排行样式
const getRankStyle = (index: number) => {
  if (index === 0) return 'text-[#f0883e]'
  if (index === 1) return 'text-[#a371f7]'
  if (index === 2) return 'text-[#3fb950]'
  return 'text-[#8b949e]'
}
</script>
