<template>
  <div class="h-full">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ tool.icon }}</span>
        <div>
          <h3 class="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">{{ tool.name }}</h3>
          <p class="text-xs text-gray-500 font-mono">{{ getCategoryName(tool.category_id) }}</p>
        </div>
      </div>
      <span
        :class="['tag-cyber', getDifficultyClass(tool.difficulty)]"
      >
        {{ getDifficultyName(tool.difficulty) }}
      </span>
    </div>

    <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ tool.description }}</p>

    <div class="flex items-center justify-between mt-auto pt-4 border-t border-cyan-500/10">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-sm font-mono text-gray-300">{{ tool.rating.toFixed(1) }}</span>
        <span class="text-xs text-gray-600">({{ tool.review_count }})</span>
      </div>
      <span class="text-xs text-gray-500 font-mono">{{ formatNumber(tool.view_count) }} 阅读</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '~/types/tool'

defineProps<{
  tool: Tool
}>()

const getDifficultyClass = (difficulty: string) => {
  const map: Record<string, string> = {
    beginner: 'tag-risk-low',
    intermediate: 'tag-risk-medium',
    advanced: 'tag-risk-high',
  }
  return map[difficulty] || 'tag-cyber'
}

const getDifficultyName = (difficulty: string) => {
  const names: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return names[difficulty] || '未知'
}

const getCategoryName = (categoryId: number) => {
  return '工具分类'
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
