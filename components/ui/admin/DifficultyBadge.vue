<template>
  <span :class="['difficulty-badge', difficultyClass]">
    <span class="difficulty-icon" v-html="difficultyIcon"></span>
    {{ difficultyText }}
  </span>
</template>

<script setup lang="ts">
import type { LearningPathDifficulty } from '~/types/admin'

const props = defineProps<{
  difficulty: LearningPathDifficulty
}>()

const difficultyMap: Record<LearningPathDifficulty, { text: string; class: string; icon: string }> = {
  beginner: {
    text: '入门',
    class: 'difficulty-beginner',
    icon: '&#127968;'
  },
  intermediate: {
    text: '进阶',
    class: 'difficulty-intermediate',
    icon: '&#127919;'
  },
  advanced: {
    text: '高级',
    class: 'difficulty-advanced',
    icon: '&#127942;'
  }
}

const difficultyText = computed(() => difficultyMap[props.difficulty]?.text || '未知')
const difficultyClass = computed(() => difficultyMap[props.difficulty]?.class || 'difficulty-beginner')
const difficultyIcon = computed(() => difficultyMap[props.difficulty]?.icon || '&#127968;')
</script>

<style scoped>
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
}

.difficulty-icon {
  font-size: 0.8rem;
}

.difficulty-beginner {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.difficulty-intermediate {
  background: rgba(234, 179, 8, 0.12);
  color: #eab308;
}

.difficulty-advanced {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}
</style>
