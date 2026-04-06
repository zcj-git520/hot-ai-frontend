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
            <!-- 登录状态 -->
            <div v-if="user" class="flex items-center gap-2 sm:gap-4">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-white font-medium text-sm hidden md:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button 
                @click="handleLogout"
                class="text-[#8b949e] hover:text-white transition-colors font-medium text-xs sm:text-sm"
              >
                退出
              </button>
            </div>
            
            <!-- 未登录状态 -->
            <div v-else class="flex items-center gap-2 sm:gap-4">
              <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium text-sm">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl">
                注册
              </NuxtLink>
            </div>
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
              type="text" 
              placeholder="搜索职业，例如：设计师、程序员、运营..."
              class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 text-sm sm:text-lg text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff] transition-all"
            />
            <span class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#8b949e] text-lg sm:text-xl">🔍</span>
          </div>
        </div>
      </div>

      <!-- 职业分类 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <NuxtLink 
          v-for="profession in professions" 
          :key="profession.id"
          :to="profession.link"
          class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
        >
          <div class="flex items-start justify-between mb-3 sm:mb-4">
            <span class="text-3xl sm:text-4xl">{{ profession.icon }}</span>
            <span :class="getRiskLevelStyle(profession.riskLevel)" class="text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold">
              {{ profession.riskLevel }}
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
                    :class="getRiskColor(profession.riskScore)" 
                    class="h-full rounded-full" 
                    :style="{ width: profession.riskScore + '%' }"
                  ></div>
                </div>
                <span class="text-white font-bold text-xs sm:text-sm">{{ profession.riskScore }}%</span>
              </div>
            </div>
            <span class="text-[#58a6ff] font-medium text-xs sm:text-sm">详情 →</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const professions = ref([
  { 
    id: 1, 
    name: '设计师', 
    icon: '🎨', 
    description: '包括 UI/UX 设计师、平面设计师、产品设计师等', 
    riskLevel: '高风险', 
    riskScore: 75,
    link: '/professions/designer'
  },
  { 
    id: 2, 
    name: '程序员', 
    icon: '💻', 
    description: '软件开发工程师、前端/后端工程师、全栈工程师等', 
    riskLevel: '中风险', 
    riskScore: 55,
    link: '/professions/programmer'
  },
  { 
    id: 3, 
    name: '运营专员', 
    icon: '📊', 
    description: '内容运营、用户运营、活动运营等', 
    riskLevel: '高风险', 
    riskScore: 70,
    link: '/professions/operator'
  },
  { 
    id: 4, 
    name: '文案策划', 
    icon: '✍️', 
    description: '广告文案、内容创作者、编辑等', 
    riskLevel: '极高风险', 
    riskScore: 85,
    link: '/professions/writer'
  },
  { 
    id: 5, 
    name: '数据分析师', 
    icon: '📈', 
    description: '商业分析师、数据科学家、BI 工程师等', 
    riskLevel: '中风险', 
    riskScore: 50,
    link: '/professions/analyst'
  },
  { 
    id: 6, 
    name: '产品经理', 
    icon: '📱', 
    description: '互联网产品经理、产品总监等', 
    riskLevel: '低风险', 
    riskScore: 35,
    link: '/professions/manager'
  },
  { 
    id: 7, 
    name: '客服代表', 
    icon: '🎧', 
    description: '电话客服、在线客服、客户支持等', 
    riskLevel: '极高风险', 
    riskScore: 90,
    link: '/professions/support'
  },
  { 
    id: 8, 
    name: '市场营销', 
    icon: '📣', 
    description: '市场专员、品牌经理、数字营销等', 
    riskLevel: '中风险', 
    riskScore: 60,
    link: '/professions/marketing'
  },
  { 
    id: 9, 
    name: '人力资源', 
    icon: '👥', 
    description: 'HRBP、招聘专员、培训发展等', 
    riskLevel: '低风险', 
    riskScore: 40,
    link: '/professions/hr'
  }
])

const getRiskLevelStyle = (level: string) => {
  const styles: Record<string, string> = {
    '极高风险': 'bg-red-500/10 text-red-400',
    '高风险': 'bg-orange-500/10 text-orange-400',
    '中风险': 'bg-yellow-500/10 text-yellow-400',
    '低风险': 'bg-green-500/10 text-green-400'
  }
  return styles[level] || 'bg-gray-500/10 text-gray-400'
}

const getRiskColor = (score: number) => {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-orange-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
}
</script>
