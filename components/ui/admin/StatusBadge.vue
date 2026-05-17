<template>
  <span
    :class="['status-badge', statusClass]"
  >
    <span class="status-dot"></span>
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import type { LearningPathStatus, ChapterStatus } from '~/types/admin'

const props = defineProps<{
  status: LearningPathStatus | ChapterStatus
}>()

const statusMap: Record<number, { text: string; class: string }> = {
  0: { text: '待发布', class: 'status-draft' },
  1: { text: '已发布', class: 'status-published' },
  2: { text: '已删除', class: 'status-deleted' },
  3: { text: '正常', class: 'status-published' }
}

const statusText = computed(() => {
  if (props.status === 1 || props.status === 3) return statusMap[1].text
  if (props.status === 2) return statusMap[2].text
  return statusMap[props.status]?.text || '未知'
})

const statusClass = computed(() => {
  if (props.status === 1 || props.status === 3) return statusMap[1].class
  if (props.status === 2) return statusMap[2].class
  return statusMap[props.status]?.class || 'status-draft'
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
  text-transform: capitalize;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-draft {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
}

.status-draft .status-dot {
  background: #fbbf24;
}

.status-published {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.status-published .status-dot {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.status-deleted {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.status-deleted .status-dot {
  background: #ef4444;
}
</style>
