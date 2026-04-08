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
              <NuxtLink to="/professions" class="text-white hover:text-[#58a6ff] transition-colors font-medium">职业风险</NuxtLink>
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <nav class="flex items-center gap-2 text-sm text-[#8b949e]">
        <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/professions" class="hover:text-white transition-colors">职业风险</NuxtLink>
        <span>/</span>
        <span class="text-white truncate">{{ profession?.name || '职业详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#58a6ff]"></div>
      <p class="text-[#8b949e] mt-3">加载中...</p>
    </div>

    <!-- 职业详情 -->
    <div v-else-if="profession" class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <!-- 头部信息卡片 -->
      <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div class="flex items-start gap-4">
            <span class="text-5xl sm:text-6xl">{{ profession.icon }}</span>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ profession.name }}</h1>
              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-[#8b949e] text-sm">{{ profession.category_name }}</span>
                <span :class="getRiskLevelStyle(profession.risk_level)" class="px-3 py-1 rounded-full text-sm font-bold">
                  {{ getRiskLevelName(profession.risk_level) }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-center sm:text-right">
            <div class="text-[#8b949e] text-sm mb-2">风险指数</div>
            <div class="flex items-center gap-3">
              <div class="w-32 sm:w-40 h-3 bg-[#21262d] rounded-full overflow-hidden">
                <div 
                  :class="getRiskColor(profession.risk_score)" 
                  class="h-full rounded-full transition-all duration-500" 
                  :style="{ width: profession.risk_score + '%' }"
                ></div>
              </div>
              <span class="text-white font-bold text-xl">{{ profession.risk_score }}%</span>
            </div>
          </div>
        </div>
        
        <p class="text-[#c9d1d9] text-base leading-relaxed">{{ profession.description }}</p>
        
        <!-- 统计数据 -->
        <div class="flex items-center gap-6 mt-6 pt-6 border-t border-[#30363d] text-sm text-[#8b949e]">
          <span>👁️ 浏览 {{ formatNumber(profession.view_count || 0) }}</span>
          <span>⚙️ 自动化率 {{ profession.automation_rate }}%</span>
        </div>
      </div>

      <!-- 影响分析 -->
      <div v-if="profession.impact_analysis" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📊</span> AI 影响分析
        </h2>
        
        <!-- 受影响的任务 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span class="text-red-400">⚠️</span> 受影响的任务
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="task in profession.impact_analysis.affected_tasks" :key="task" 
                 class="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-[#c9d1d9] text-sm">
              {{ task }}
            </div>
          </div>
        </div>

        <!-- 安全的任务 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span class="text-green-400">✅</span> 相对安全的任务
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="task in profession.impact_analysis.safe_tasks" :key="task" 
                 class="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-[#c9d1d9] text-sm">
              {{ task }}
            </div>
          </div>
        </div>

        <!-- 安全技能 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span class="text-blue-400">💡</span> 建议发展的技能
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in profession.impact_analysis.safe_skills" :key="skill" 
                  class="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- 影响时间线 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span class="text-yellow-400">⏱️</span> 影响时间线
          </h3>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex-shrink-0 w-20 text-yellow-400 font-medium text-sm">短期</div>
              <div class="flex-1 bg-[#21262d] rounded-lg px-4 py-3 text-[#c9d1d9] text-sm">
                {{ profession.impact_analysis.impact_timeline?.short_term }}
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex-shrink-0 w-20 text-orange-400 font-medium text-sm">中期</div>
              <div class="flex-1 bg-[#21262d] rounded-lg px-4 py-3 text-[#c9d1d9] text-sm">
                {{ profession.impact_analysis.impact_timeline?.mid_term }}
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex-shrink-0 w-20 text-red-400 font-medium text-sm">长期</div>
              <div class="flex-1 bg-[#21262d] rounded-lg px-4 py-3 text-[#c9d1d9] text-sm">
                {{ profession.impact_analysis.impact_timeline?.long_term }}
              </div>
            </div>
          </div>
        </div>

        <!-- 影响总结 -->
        <div class="bg-[#21262d] rounded-lg px-6 py-4 border-l-4 border-[#58a6ff]">
          <p class="text-[#c9d1d9] text-sm leading-relaxed">{{ profession.impact_analysis.impact_summary }}</p>
        </div>
      </div>

      <!-- 转型建议 -->
      <div v-if="profession.transition_advice" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎯</span> 转型建议
        </h2>

        <!-- 转型路径 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3">推荐转型方向</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="path in profession.transition_advice.transition_paths" :key="path" 
                  class="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
              {{ path }}
            </span>
          </div>
        </div>

        <!-- 推荐技能 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3">推荐学习的技能</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in profession.transition_advice.recommended_skills" :key="skill" 
                  class="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- 推荐工具 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3">推荐掌握的工具</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tool in profession.transition_advice.recommended_tools" :key="tool" 
                  class="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm">
              {{ tool }}
            </span>
          </div>
        </div>

        <!-- 详细学习路径 -->
        <div v-if="profession.transition_advice.recommended_paths && profession.transition_advice.recommended_paths.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-4">详细学习路径</h3>
          <div class="space-y-4">
            <div v-for="(path, index) in profession.transition_advice.recommended_paths" :key="index" 
                 class="bg-[#21262d] rounded-lg p-5">
              <h4 class="text-white font-semibold mb-3">{{ path.title }}</h4>
              <ol class="space-y-2">
                <li v-for="(step, stepIndex) in path.steps" :key="stepIndex" 
                    class="flex items-start gap-3 text-[#c9d1d9] text-sm">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#58a6ff]/20 text-[#58a6ff] flex items-center justify-center text-xs font-bold">
                    {{ stepIndex + 1 }}
                  </span>
                  <span class="flex-1">{{ step }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- 建议总结 -->
        <div class="bg-[#21262d] rounded-lg px-6 py-4 border-l-4 border-green-500">
          <p class="text-[#c9d1d9] text-sm leading-relaxed">{{ profession.transition_advice.advice_summary }}</p>
        </div>
      </div>

      <!-- 市场数据 -->
      <div v-if="profession.market_data" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📈</span> 市场数据
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 市场趋势 -->
          <div class="bg-[#21262d] rounded-lg p-5">
            <div class="text-[#8b949e] text-sm mb-2">市场趋势</div>
            <div class="flex items-center gap-2 mb-2">
              <span :class="getMarketTrendStyle(profession.market_data.market_trend)" class="text-lg font-bold">
                {{ getMarketTrendName(profession.market_data.market_trend) }}
              </span>
              <span :class="getMarketTrendIcon(profession.market_data.market_trend)" class="text-2xl"></span>
            </div>
            <p class="text-[#c9d1d9] text-xs">{{ profession.market_data.market_trend_description }}</p>
          </div>

          <!-- 薪资影响 -->
          <div class="bg-[#21262d] rounded-lg p-5">
            <div class="text-[#8b949e] text-sm mb-2">薪资影响</div>
            <div class="flex items-center gap-2 mb-2">
              <span :class="getSalaryImpactStyle(profession.market_data.salary_impact)" class="text-lg font-bold">
                {{ getSalaryImpactName(profession.market_data.salary_impact) }}
              </span>
            </div>
            <div class="text-[#c9d1d9] text-xs">
              变化率: <span class="text-white font-semibold">{{ profession.market_data.salary_change_rate }}%</span>
            </div>
          </div>

          <!-- 平均薪资 -->
          <div class="bg-[#21262d] rounded-lg p-5">
            <div class="text-[#8b949e] text-sm mb-2">平均薪资</div>
            <div class="text-white text-2xl font-bold mb-1">¥{{ formatNumber(profession.market_data.avg_salary) }}</div>
            <div class="text-[#8b949e] text-xs">月薪</div>
          </div>

          <!-- 就业需求 -->
          <div class="bg-[#21262d] rounded-lg p-5">
            <div class="text-[#8b949e] text-sm mb-2">就业需求</div>
            <div class="text-white text-lg font-semibold mb-1">{{ profession.market_data.job_demand_trend }}</div>
          </div>

          <!-- 供需比 -->
          <div class="bg-[#21262d] rounded-lg p-5">
            <div class="text-[#8b949e] text-sm mb-2">供需比</div>
            <div class="text-white text-2xl font-bold mb-1">{{ profession.market_data.supply_demand_ratio }}</div>
            <div class="text-[#8b949e] text-xs">岗位数/求职人数</div>
          </div>

          <!-- 数据来源 -->
          <div class="bg-[#21262d] rounded-lg p-5">
            <div class="text-[#8b949e] text-sm mb-2">数据来源</div>
            <div class="text-white text-sm mb-1">{{ profession.market_data.data_source }}</div>
            <div class="text-[#8b949e] text-xs">更新: {{ formatDate(profession.market_data.data_update_date) }}</div>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="mt-8 text-center">
        <NuxtLink to="/professions" 
                  class="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white px-6 py-3 rounded-lg transition-colors font-medium">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </NuxtLink>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div class="text-6xl mb-4">😕</div>
      <h2 class="text-2xl font-bold text-white mb-3">职业不存在</h2>
      <p class="text-[#8b949e] mb-6">抱歉，您访问的职业信息不存在或已被删除</p>
      <NuxtLink to="/professions" 
                class="inline-flex items-center gap-2 bg-[#58a6ff] hover:bg-[#1f6feb] text-white px-6 py-3 rounded-lg transition-colors font-medium">
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
