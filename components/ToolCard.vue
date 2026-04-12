<template>
  <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ tool.icon }}</span>
        <div>
          <h3 class="text-lg font-semibold">{{ tool.name }}</h3>
          <p class="text-sm text-gray-500">{{ getCategoryName(tool.category_id) }}</p>
        </div>
      </div>
      <span
        :class="['px-2 py-1 rounded-full text-xs font-medium', getDifficultyColor(tool.difficulty)]"
      >
        {{ getDifficultyName(tool.difficulty) }}
      </span>
    </div>

    <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ tool.description }}</p>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-sm">{{ tool.rating.toFixed(1) }}</span>
        <span class="text-xs text-gray-500">({{ tool.review_count }})</span>
      </div>
      <span class="text-sm text-gray-500">{{ formatNumber(tool.view_count) }} 阅读</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '~/types/tool'

defineProps<{
  tool: Tool
}>()

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
  // 在组件内简化处理，实际应用中可能需要获取更详细的类别信息
  return '工具分类'
}

// 数字格式化
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>