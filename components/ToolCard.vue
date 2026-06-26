<template>
  <div class="h-full flex flex-col">
    <div class="flex items-start justify-between mb-5">
      <div class="flex items-center gap-3">
        <span class="font-serif font-black text-vermillion text-[2.4rem] leading-none w-12 h-12 flex items-center justify-center border border-ink">
          {{ (tool.name?.charAt(0) || '·') }}
        </span>
        <div>
          <h3 class="font-serif font-bold text-[18px] text-ink group-hover:text-vermillion transition-colors tracking-[0.04em] leading-tight">{{ tool.name }}</h3>
          <p class="text-[11px] text-ink-mute font-mono tracking-[0.16em] uppercase mt-1">{{ getCategoryName(tool.category_id) }}</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1.5">
        <span :class="['seal-square', difficultyTilt]">
          {{ getDifficultyName(tool.difficulty) }}
        </span>
        <span
          v-if="tool.is_locked"
          class="seal-square seal-square--tilt-r text-[10px]"
          :class="tool.required_level >= 2 ? 'seal-square--cinnabar' : 'seal-square--ink'"
          :title="tool.required_level >= 2 ? '会员专享' : '登录后阅读'"
        >
          {{ tool.required_level >= 2 ? '会' : '锁' }}
        </span>
      </div>
    </div>

    <p class="font-serif text-[14px] text-ink-soft leading-[1.85] mb-5 line-clamp-2 text-pretty">{{ tool.description }}</p>

    <div class="mt-auto pt-4 border-t border-rule-faint flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
      <span class="flex items-center gap-1.5">
        <span class="text-ochre">★</span>
        <span class="text-ink font-bold">{{ tool.rating?.toFixed(1) || '—' }}</span>
        <span class="text-ink-faint">({{ tool.review_count || 0 }})</span>
      </span>
      <span>{{ formatNumber(tool.view_count) }} 阅</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '~/types/tool'

const props = defineProps<{
  tool: Tool
}>()

const difficultyTilt = computed(() => {
  const map: Record<string, string> = {
    beginner: 'seal-square--tilt-l',
    intermediate: '',
    advanced: 'seal-square--tilt-r',
  }
  return map[props.tool.difficulty] || 'seal-square--tilt-l'
})

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
    beginner: '入 门',
    intermediate: '进 阶',
    advanced: '高 级'
  }
  return names[difficulty] || '未 知'
}

const getCategoryName = (categoryId: number) => {
  return '工 具 分 类'
}

const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + ' 万'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + ' 千'
  }
  return String(num)
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
