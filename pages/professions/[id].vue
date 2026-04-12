<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- 顶部导航栏 -->
    <header class="border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI 热点追踪
            </NuxtLink>
            <nav class="hidden lg:flex items-center gap-6">
              <NuxtLink to="/" class="text-slate-400 hover:text-white transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-slate-400 hover:text-white transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-white hover:text-blue-400 transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-slate-400 hover:text-white transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-slate-400 hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <template v-if="user">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-white font-medium text-sm hidden md:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button @click="handleLogout" class="text-slate-400 hover:text-white transition-colors font-medium text-xs sm:text-sm">退出</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-slate-400 hover:text-white transition-colors font-medium text-sm">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-1.5 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-xl">注册</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- 面包屑导航 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <nav class="flex items-center gap-2 text-sm text-slate-400">
        <NuxtLink to="/" class="hover:text-blue-400 transition-colors">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/professions" class="hover:text-blue-400 transition-colors">职业风险</NuxtLink>
        <span>/</span>
        <span class="text-white truncate">{{ profession?.name || '职业详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
      <p class="text-slate-400 mt-4 text-lg">正在加载职业信息...</p>
    </div>

    <!-- 职业详情 -->
    <div v-else-if="profession" class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <!-- 头部信息卡片 -->
      <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div class="flex items-start gap-5">
            <div class="text-6xl sm:text-7xl filter drop-shadow-lg">{{ profession.icon }}</div>
            <div>
              <div class="flex items-center gap-3 mb-3">
                <h1 class="text-3xl sm:text-4xl font-bold text-white">{{ profession.name }}</h1>
                <span :class="getRiskBadgeStyle(profession.risk_level)" class="px-4 py-1.5 rounded-full text-sm font-bold">
                  {{ getRiskLevelName(profession.risk_level) }}
                </span>
              </div>
              <div class="flex items-center gap-3 flex-wrap text-slate-400">
                <span class="text-sm">{{ profession.category_name }}</span>
                <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span class="text-sm">{{ profession.automation_rate }}% 自动化率</span>
              </div>
            </div>
          </div>
          <div class="text-center lg:text-right">
            <div class="text-slate-400 text-sm mb-2">综合风险指数</div>
            <div class="flex items-center gap-3 justify-center lg:justify-end">
              <div class="relative w-40 h-4">
                <div class="absolute inset-0 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    :class="getRiskBarColor(profession.risk_score)"
                    class="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                    :style="{ width: profession.risk_score + '%' }"
                  ></div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-white font-bold text-lg drop-shadow-md">{{ profession.risk_score }}</span>
                </div>
              </div>
              <span class="text-white font-bold text-2xl">%</span>
            </div>
          </div>
        </div>

        <p class="text-slate-300 text-base leading-relaxed mb-6">{{ profession.description }}</p>

        <!-- 统计数据 -->
        <div class="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 border-t border-white/10">
          <div class="flex items-center gap-2 text-slate-400">
            <span class="text-xl">👁️</span>
            <span class="text-sm">浏览 {{ formatNumber(profession.view_count || 0) }} 次</span>
          </div>
          <div class="flex items-center gap-2 text-slate-400">
            <span class="text-xl">⚙️</span>
            <span class="text-sm">自动化率 {{ profession.automation_rate }}%</span>
          </div>
        </div>
      </div>

      <!-- AI 影响分析 -->
      <div v-if="profession.impact_analysis" class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span class="text-3xl">📊</span>
          <span>AI 影响分析</span>
        </h2>

        <!-- 影响总结卡片 -->
        <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-5 mb-6 border border-blue-500/30">
          <p class="text-slate-300 text-base leading-relaxed">{{ profession.impact_analysis.impact_summary }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 受影响的任务 -->
          <div class="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
            <h3 class="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">⚠️</span>
              受影响的任务
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="task in profession.impact_analysis.affected_tasks" :key="task"
                   class="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-slate-300 text-sm">
                {{ task }}
              </div>
            </div>
          </div>

          <!-- 相对安全的任务 -->
          <div class="bg-green-500/5 rounded-xl p-5 border border-green-500/20">
            <h3 class="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">✅</span>
              相对安全的任务
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="task in profession.impact_analysis.safe_tasks" :key="task"
                   class="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-slate-300 text-sm">
                {{ task }}
              </div>
            </div>
          </div>
        </div>

        <!-- 建议发展的技能 -->
        <div class="mt-6 bg-blue-500/5 rounded-xl p-5 border border-blue-500/20">
          <h3 class="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">💡</span>
            建议发展的技能
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in profession.impact_analysis.safe_skills" :key="skill"
                  class="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- 影响时间线 -->
        <div class="mt-6 bg-slate-700/30 rounded-xl p-5 border border-white/10">
          <h3 class="text-lg font-semibold text-yellow-400 mb-5 flex items-center gap-2">
            <span class="text-2xl">⏱️</span>
            影响时间线
          </h3>
          <div class="space-y-4">
            <div class="flex gap-4 items-start">
              <div class="flex-shrink-0 w-24 text-yellow-400 font-bold text-sm">短期 (1-2年)</div>
              <div class="flex-1 bg-slate-800/50 rounded-lg px-4 py-3 text-slate-300 text-sm border border-white/5">
                {{ profession.impact_analysis.impact_timeline?.short_term }}
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div class="flex-shrink-0 w-24 text-orange-400 font-bold text-sm">中期 (3-5年)</div>
              <div class="flex-1 bg-slate-800/50 rounded-lg px-4 py-3 text-slate-300 text-sm border border-white/5">
                {{ profession.impact_analysis.impact_timeline?.mid_term }}
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div class="flex-shrink-0 w-24 text-red-400 font-bold text-sm">长期 (5年以上)</div>
              <div class="flex-1 bg-slate-800/50 rounded-lg px-4 py-3 text-slate-300 text-sm border border-white/5">
                {{ profession.impact_analysis.impact_timeline?.long_term }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 转型建议 -->
      <div v-if="profession.transition_advice" class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span class="text-3xl">🎯</span>
          <span>转型建议</span>
        </h2>

        <!-- 建议总结 -->
        <div class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-5 mb-6 border border-green-500/30">
          <p class="text-slate-300 text-base leading-relaxed">{{ profession.transition_advice.advice_summary }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 推荐转型方向 -->
          <div class="bg-purple-500/5 rounded-xl p-5 border border-purple-500/20">
            <h3 class="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">🚀</span>
              推荐转型方向
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="path in profession.transition_advice.transition_paths" :key="path"
                    class="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                {{ path }}
              </span>
            </div>
          </div>

          <!-- 推荐技能 -->
          <div class="bg-green-500/5 rounded-xl p-5 border border-green-500/20">
            <h3 class="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📚</span>
              推荐学习的技能
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in profession.transition_advice.recommended_skills" :key="skill"
                    class="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- 推荐工具 -->
          <div class="bg-orange-500/5 rounded-xl p-5 border border-orange-500/20">
            <h3 class="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">🛠️</span>
              推荐掌握的工具
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tool in profession.transition_advice.recommended_tools" :key="tool"
                    class="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm">
                {{ tool }}
              </span>
            </div>
          </div>
        </div>

        <!-- 详细学习路径 -->
        <div v-if="profession.transition_advice.recommended_paths && profession.transition_advice.recommended_paths.length > 0" class="mt-6 space-y-4">
          <h3 class="text-lg font-semibold text-white mb-4">详细学习路径</h3>
          <div class="space-y-4">
            <div v-for="(path, index) in profession.transition_advice.recommended_paths" :key="index"
                 class="bg-slate-800/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
              <div class="flex items-center gap-3 mb-4">
                <span class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {{ index + 1 }}
                </span>
                <h4 class="text-xl font-bold text-white">{{ path.title }}</h4>
              </div>
              <ol class="space-y-3 ml-4">
                <li v-for="(step, stepIndex) in path.steps" :key="stepIndex"
                    class="flex items-start gap-3 text-slate-300 text-sm">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold border border-white/10">
                    {{ stepIndex + 1 }}
                  </span>
                  <span class="flex-1">{{ step }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- 市场数据 -->
      <div v-if="profession.market_data" class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span class="text-3xl">📈</span>
          <span>市场数据</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 市场趋势 -->
          <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div class="text-slate-400 text-sm mb-3">市场趋势</div>
            <div class="flex items-center gap-2 mb-2">
              <span :class="getMarketTrendStyle(profession.market_data.market_trend)" class="text-3xl font-bold">
                {{ getMarketTrendIcon(profession.market_data.market_trend) }}
              </span>
              <span :class="getMarketTrendStyle(profession.market_data.market_trend)" class="text-xl font-bold">
                {{ getMarketTrendName(profession.market_data.market_trend) }}
              </span>
            </div>
            <p class="text-slate-400 text-xs">{{ profession.market_data.market_trend_description }}</p>
          </div>

          <!-- 薪资影响 -->
          <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div class="text-slate-400 text-sm mb-3">薪资影响</div>
            <div class="flex items-center gap-2 mb-2">
              <span :class="getSalaryImpactStyle(profession.market_data.salary_impact)" class="text-3xl font-bold">
                {{ getSalaryImpactName(profession.market_data.salary_impact) }}
              </span>
            </div>
            <div class="text-slate-400 text-xs">
              变化率: <span class="text-white font-semibold">{{ profession.market_data.salary_change_rate }}%</span>
            </div>
          </div>

          <!-- 平均薪资 -->
          <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div class="text-slate-400 text-sm mb-3">平均薪资</div>
            <div class="text-white text-3xl font-bold mb-2">¥{{ formatNumber(profession.market_data.avg_salary) }}</div>
            <div class="text-slate-400 text-xs">月薪</div>
          </div>

          <!-- 就业需求 -->
          <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div class="text-slate-400 text-sm mb-3">就业需求</div>
            <div class="text-white text-2xl font-bold">{{ profession.market_data.job_demand_trend }}</div>
          </div>

          <!-- 供需比 -->
          <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div class="text-slate-400 text-sm mb-3">供需比</div>
            <div class="text-white text-3xl font-bold mb-2">{{ profession.market_data.supply_demand_ratio }}</div>
            <div class="text-slate-400 text-xs">岗位数/求职人数</div>
          </div>

          <!-- 数据来源 -->
          <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div class="text-slate-400 text-sm mb-3">数据来源</div>
            <div class="text-white text-sm mb-2">{{ profession.market_data.data_source }}</div>
            <div class="text-slate-400 text-xs">更新: {{ formatDate(profession.market_data.data_update_date) }}</div>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="text-center py-8">
        <NuxtLink to="/professions"
                  class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </NuxtLink>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="text-7xl mb-6">😕</div>
      <h2 class="text-3xl font-bold text-white mb-4">职业不存在</h2>
      <p class="text-slate-400 mb-8 text-lg">抱歉，您访问的职业信息不存在或已被删除</p>
      <NuxtLink to="/professions"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
        查看职业列表
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

// 获取职业详情
const { data: profession, error } = await useFetch(`/api/professions/${id}`, {
  transform: (res: any) => {
    // 后端直接返回 profession 对象，没有 {data: ...} 包装
    if (res && res.name) return res
    return res?.data || null
  }
})

const loading = ref(false)

// 错误处理
if (error.value) {
  console.error('Failed to fetch profession:', error.value)
}

// 工具函数
const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toString()
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const getRiskLevelName = (level: string) => {
  const map: Record<string, string> = { extreme: '极高风险', high: '高风险', medium: '中风险', low: '低风险' }
  return map[level] || level
}

const getRiskBadgeStyle = (level: string) => {
  const map: Record<string, string> = {
    'extreme': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'high': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    'medium': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'low': 'bg-green-500/20 text-green-400 border border-green-500/30'
  }
  return map[level] || 'bg-gray-500/20 text-gray-400'
}

const getRiskBarColor = (score: number) => {
  if (score >= 80) return 'bg-gradient-to-r from-red-500 to-orange-500'
  if (score >= 60) return 'bg-gradient-to-r from-orange-500 to-yellow-500'
  if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-green-500'
  return 'bg-gradient-to-r from-green-500 to-emerald-500'
}

const getMarketTrendName = (trend: string) => {
  const map: Record<string, string> = { growing: '增长', stable: '稳定', declining: '下降' }
  return map[trend] || trend
}

const getMarketTrendStyle = (trend: string) => {
  const map: Record<string, string> = {
    'growing': 'text-green-400',
    'stable': 'text-yellow-400',
    'declining': 'text-red-400'
  }
  return map[trend] || 'text-gray-400'
}

const getMarketTrendIcon = (trend: string) => {
  const map: Record<string, string> = {
    'growing': '📈',
    'stable': '➡️',
    'declining': '📉'
  }
  return map[trend] || '❓'
}

const getSalaryImpactName = (impact: string) => {
  const map: Record<string, string> = { positive: '正向', neutral: '中性', negative: '负向' }
  return map[impact] || impact
}

const getSalaryImpactStyle = (impact: string) => {
  const map: Record<string, string> = {
    'positive': 'text-green-400',
    'neutral': 'text-yellow-400',
    'negative': 'text-red-400'
  }
  return map[impact] || 'text-gray-400'
}
</script>
