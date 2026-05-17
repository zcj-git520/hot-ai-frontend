<template>
  <div v-if="total > 1" class="pagination">
    <!-- Previous -->
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage <= 1"
      class="page-btn page-nav"
    >
      <span>&#8249;</span>
    </button>

    <!-- Pages -->
    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="page-ellipsis">...</span>
      <button
        v-else
        @click="handlePageChange(page as number)"
        class="page-btn"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage >= total"
      class="page-btn page-nav"
    >
      <span>&#8250;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  maxVisible?: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const maxVisible = computed(() => props.maxVisible || 5)
const total = computed(() => props.totalPages)

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const current = props.currentPage
  const total = props.totalPages

  if (total <= maxVisible.value) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    const half = Math.floor(maxVisible.value / 2)
    let start = Math.max(1, current - half)
    let end = Math.min(total, start + maxVisible.value - 1)

    if (end - start < maxVisible.value - 1) {
      start = Math.max(1, end - maxVisible.value + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < total) {
      if (end < total - 1) pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= total.value) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.75rem;
  background: #1e1e26;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #a0a0a8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
}

.page-btn.active {
  background: #eab308;
  border-color: #eab308;
  color: #000;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-nav {
  font-size: 1.25rem;
}

.page-ellipsis {
  color: #6b6b73;
  padding: 0 0.25rem;
}
</style>
