<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/tools" class="text-blue-600 hover:text-blue-700 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回工具列表
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">加载中...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {{ error }}
    </div>

    <div v-else-if="tool" class="bg-white rounded-xl shadow-sm border p-6">
      <!-- 工具基本信息 -->
      <div class="flex flex-col md:flex-row gap-8 mb-8">
        <div class="flex-shrink-0">
          <span class="text-6xl">{{ tool.icon }}</span>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ tool.name }}</h1>
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ getCategoryName(tool.category_id) }}
            </span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getDifficultyColor(tool.difficulty)]">
              {{ getDifficultyName(tool.difficulty) }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatNumber(tool.view_count) }} 阅读
            </span>
            <!-- 评分 -->
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="ml-1 text-sm font-medium">{{ tool.rating.toFixed(1) }}</span>
              <span class="text-xs text-gray-500">({{ tool.review_count }} 评价)</span>
            </div>
          </div>
          <p class="text-gray-700 mb-4">{{ tool.description }}</p>

          <!-- 价格信息 -->
          <div v-if="tool.pricing_description" class="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 class="font-semibold text-gray-900 mb-2">价格信息</h3>
            <p class="text-gray-700">{{ tool.pricing_description }}</p>
          </div>

          <!-- 工具链接 -->
          <div class="flex flex-wrap gap-3">
            <a
              v-if="tool.official_url"
              :href="tool.official_url"
              target="_blank"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              访问官网
            </a>
            <a
              v-if="tool.documentation_url"
              :href="tool.documentation_url"
              target="_blank"
              class="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              查看文档
            </a>
          </div>
        </div>
      </div>

      <!-- 工具标签 -->
      <div class="mb-8">
        <h3 class="font-semibold text-gray-900 mb-3">相关标签</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 工具详细介绍 -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">工具介绍</h2>
        <div class="prose max-w-none">
          <p>{{ tool.description }}</p>
          <!-- 可以在这里添加更详细的介绍内容 -->
        </div>
      </div>

      <!-- 工具详情信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-3">基本信息</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">更新时间</span>
              <span>{{ formatDate(tool.updated_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">创建时间</span>
              <span>{{ formatDate(tool.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">受欢迎度</span>
              <span>{{ tool.popularity }}%</span>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-3">使用统计</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">浏览量</span>
              <span>{{ formatNumber(tool.view_count) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">评价数</span>
              <span>{{ formatNumber(tool.review_count) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">评级</span>
              <span>{{ tool.rating.toFixed(1) }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="mt-8">
        <h3 class="text-xl font-bold text-gray-900 mb-4">相关工具</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="relatedTool in relatedTools"
            :key="relatedTool.id"
            class="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div class="flex items-center mb-2">
              <span class="text-xl mr-2">{{ relatedTool.icon }}</span>
              <h4 class="font-semibold">{{ relatedTool.name }}</h4>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2">{{ relatedTool.description }}</p>
            <NuxtLink
              :to="`/tools/${relatedTool.slug}`"
              class="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
            >
              了解详情 →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 导入工具类型
import type { Tool, ToolCategoryListResponse } from '~/types/tool'

const route = useRoute()
const tool = ref<Tool | null>(null)
const relatedTools = ref<Tool[]>([])
const loading = ref(false)
const error = ref('')
const tags = ref<string[]>([])

// 工具难度颜色映射
const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-800'
}

// 工具难度名称映射
const getDifficultyName = (difficulty: string) => {
  const names: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return names[difficulty] || '未知'
}

// 获取类别名称
const getCategoryName = (categoryId: number) => {
  // 实际项目中这里应该用API获取类别信息，简化起见直接显示
  return '工具分类'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 数字格式化
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 获取页面参数
const slug = route.params.slug as string

// 获取工具详情
const fetchTool = async () => {
  if (!slug) {
    error.value = '工具ID无效'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch(`/api/tools/${slug}`)
    if (response.code === 0 && response.data) {
      tool.value = response.data
      // 解析标签
      try {
        if (typeof tool.value.tags === 'string') {
          tags.value = JSON.parse(tool.value.tags)
        } else if (Array.isArray(tool.value.tags)) {
          tags.value = tool.value.tags as string[]
        }
      } catch (e) {
        tags.value = []
      }
      // 获取相关工具
      await fetchRelatedTools()
    } else {
      error.value = response.message || '获取工具详情失败'
    }
  } catch (err) {
    error.value = '网络错误，获取工具详情失败'
    console.error('获取工具详情失败:', err)
  } finally {
    loading.value = false
  }
}

// 获取相关工具
const fetchRelatedTools = async () => {
  try {
    // 简化版实现，实际项目中会根据标签或分类获取相关工具
    const response = await $fetch('/api/tools', {
      query: {
        page: 1,
        page_size: 3,
        category_id: tool.value!.category_id
      }
    })
    if (response.code === 0 && response.data) {
      relatedTools.value = response.data.list.filter((t: Tool) => t.id !== tool.value!.id)
    }
  } catch (err) {
    console.error('获取相关工具失败:', err)
  }
}

// 初始化数据
onMounted(() => {
  fetchTool()
})
</script>