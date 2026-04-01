<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">职业风险查询</h1>
      <p class="text-gray-600">
        了解你的职业在 AI 时代的风险等级和转型建议
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="bg-blue-50 rounded-xl p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索职业，例如：设计师、程序员、运营..."
          class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          搜索
        </button>
      </div>
    </div>

    <!-- 风险等级说明 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div 
        v-for="level in riskLevels"
        :key="level.id"
        :class="[
          'p-4 rounded-lg border-2',
          level.borderClass
        ]"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">{{ level.icon }}</span>
          <span class="font-semibold">{{ level.name }}</span>
        </div>
        <p class="text-sm text-gray-600">{{ level.description }}</p>
      </div>
    </div>

    <!-- 职业列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="profession in professions"
        :key="profession.id"
        :to="`/professions/${profession.slug}`"
        class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition block"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ profession.name }}</h3>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              getRiskColor(profession.riskLevel)
            ]"
          >
            {{ getRiskName(profession.riskLevel) }}
          </span>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">自动化率</span>
            <span class="font-medium">{{ profession.automationRate }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              :class="[
                'h-2 rounded-full transition-all',
                getRiskProgressColor(profession.riskLevel)
              ]"
              :style="{ width: profession.automationRate + '%' }"
            ></div>
          </div>
          <div class="flex flex-wrap gap-1 mt-3">
            <span 
              v-for="skill in profession.safeSkills.slice(0, 3)"
              :key="skill"
              class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </NuxtLink>
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
    icon: '🔴',
    description: '高度重复、规则明确的工作内容',
    borderClass: 'border-red-300 bg-red-50'
  },
  {
    id: 'high',
    name: '高风险',
    icon: '🟠',
    description: '大部分工作内容可被 AI 替代',
    borderClass: 'border-orange-300 bg-orange-50'
  },
  {
    id: 'medium',
    name: '中等风险',
    icon: '🟡',
    description: '部分工作内容可被 AI 辅助',
    borderClass: 'border-yellow-300 bg-yellow-50'
  },
  {
    id: 'low',
    name: '低风险',
    icon: '🟢',
    description: '需要创造力和复杂决策',
    borderClass: 'border-green-300 bg-green-50'
  }
]

// 模拟数据
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
  }
])

const getRiskColor = (riskLevel: string) => {
  const colors: Record<string, string> = {
    extreme: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return colors[riskLevel] || 'bg-gray-100 text-gray-800'
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

const getRiskProgressColor = (riskLevel: string) => {
  const colors: Record<string, string> = {
    extreme: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return colors[riskLevel] || 'bg-gray-500'
}
</script>
