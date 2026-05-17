<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
        <h1 class="font-tech text-3xl font-bold tracking-wider">职业风险查询</h1>
      </div>
      <p class="text-gray-500 font-mono text-sm ml-4">
        <span class="text-cyan-400">//</span> 了解你的职业在 AI 时代的风险等级和转型建议 <span class="text-cyan-400">//</span>
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="glass-card neon-border p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索职业，例如：设计师、程序员、运营..."
            class="input-cyber pl-12"
          />
        </div>
        <button class="btn-cyber flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          搜索
        </button>
      </div>
    </div>

    <!-- 风险等级说明 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        v-for="level in riskLevels"
        :key="level.id"
        class="glass-card p-4 text-center group hover:border-current transition-all"
        :class="level.hoverClass"
      >
        <div class="text-2xl mb-2">{{ level.icon }}</div>
        <div class="font-tech text-sm font-semibold mb-1" :class="level.textClass">{{ level.name }}</div>
        <p class="text-xs text-gray-600">{{ level.description }}</p>
      </div>
    </div>

    <!-- 职业列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="profession in filteredProfessions"
        :key="profession.id"
        :to="`/professions/${profession.slug}`"
        class="glass-card card-decoration p-6 group hover:border-cyan-400/50 transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold group-hover:text-cyan-400 transition-colors">{{ profession.name }}</h3>
          <span :class="['tag-cyber', getRiskTagClass(profession.riskLevel)]">
            {{ getRiskName(profession.riskLevel) }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">AI 自动化率</span>
            <span class="font-mono font-semibold" :class="getRiskTextClass(profession.riskLevel)">
              {{ profession.automationRate }}%
            </span>
          </div>
          <div class="progress-cyber">
            <div
              :class="['h-full rounded-full', getRiskProgressClass(profession.riskLevel)]"
              :style="{ width: profession.automationRate + '%' }"
            ></div>
          </div>

          <div class="flex flex-wrap gap-1.5 mt-3">
            <span
              v-for="skill in profession.safeSkills.slice(0, 3)"
              :key="skill"
              class="px-2 py-1 text-xs rounded bg-green-500/10 border border-green-500/30 text-green-400"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- 底部装饰 -->
        <div class="mt-4 pt-4 border-t border-cyan-500/10 flex items-center justify-between">
          <span class="text-xs text-gray-600">查看详情</span>
          <span class="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProfessions.length === 0" class="glass-card p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
        <svg class="w-8 h-8 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-gray-400">未找到匹配的职业</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const searchQuery = ref('')

const riskLevels = [
  {
    id: 'extreme',
    name: '极高风险',
    icon: '⚠️',
    description: '高度重复、规则明确',
    hoverClass: 'hover:border-red-500/50',
    textClass: 'text-red-400',
  },
  {
    id: 'high',
    name: '高风险',
    icon: '🔶',
    description: '大部分可被 AI 替代',
    hoverClass: 'hover:border-orange-500/50',
    textClass: 'text-orange-400',
  },
  {
    id: 'medium',
    name: '中等风险',
    icon: '💛',
    description: '部分可被 AI 辅助',
    hoverClass: 'hover:border-yellow-500/50',
    textClass: 'text-yellow-400',
  },
  {
    id: 'low',
    name: '低风险',
    icon: '✅',
    description: '需创造力和复杂决策',
    hoverClass: 'hover:border-green-500/50',
    textClass: 'text-green-400',
  },
]

const professions = ref([
  {
    id: 1,
    name: '文案策划',
    slug: 'copywriter',
    riskLevel: 'extreme',
    automationRate: 85,
    safeSkills: ['创意构思', '品牌策略', '用户洞察']
  },
  {
    id: 2,
    name: '平面设计',
    slug: 'graphic-designer',
    riskLevel: 'high',
    automationRate: 75,
    safeSkills: ['创意思维', '品牌设计', '用户体验']
  },
  {
    id: 3,
    name: '数据录入员',
    slug: 'data-entry',
    riskLevel: 'extreme',
    automationRate: 95,
    safeSkills: ['数据校验', '异常处理']
  },
  {
    id: 4,
    name: '客服代表',
    slug: 'customer-service',
    riskLevel: 'high',
    automationRate: 70,
    safeSkills: ['情感沟通', '复杂问题处理']
  },
  {
    id: 5,
    name: '初级程序员',
    slug: 'junior-developer',
    riskLevel: 'medium',
    automationRate: 60,
    safeSkills: ['系统设计', '架构思维', '业务理解']
  },
  {
    id: 6,
    name: '产品经理',
    slug: 'product-manager',
    riskLevel: 'low',
    automationRate: 35,
    safeSkills: ['战略规划', '用户研究', '商业洞察']
  },
])

const filteredProfessions = computed(() => {
  if (!searchQuery.value) return professions.value
  const query = searchQuery.value.toLowerCase()
  return professions.value.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.safeSkills.some(s => s.toLowerCase().includes(query))
  )
})

const getRiskTagClass = (riskLevel: string) => {
  const map: Record<string, string> = {
    extreme: 'tag-risk-extreme',
    high: 'tag-risk-high',
    medium: 'tag-risk-medium',
    low: 'tag-risk-low',
  }
  return map[riskLevel] || 'tag-cyber'
}

const getRiskName = (riskLevel: string) => {
  const names: Record<string, string> = {
    extreme: '极高风险',
    high: '高风险',
    medium: '中等风险',
    low: '低风险'
  }
  return names[riskLevel] || '未知'
}

const getRiskTextClass = (riskLevel: string) => {
  const map: Record<string, string> = {
    extreme: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  }
  return map[riskLevel] || 'text-gray-400'
}

const getRiskProgressClass = (riskLevel: string) => {
  const map: Record<string, string> = {
    extreme: 'bg-gradient-to-r from-red-500 to-red-400',
    high: 'bg-gradient-to-r from-orange-500 to-orange-400',
    medium: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    low: 'bg-gradient-to-r from-green-500 to-green-400',
  }
  return map[riskLevel] || 'bg-gray-500'
}
</script>
