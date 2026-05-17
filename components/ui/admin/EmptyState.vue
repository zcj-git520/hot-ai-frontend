<template>
  <div class="empty-state">
    <div class="empty-icon" v-html="icon || '&#128218;'"></div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.4;
}

.empty-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0 0 0.5rem;
}

.empty-description {
  font-size: 0.875rem;
  color: #6b6b73;
  margin: 0 0 1.5rem;
  max-width: 320px;
}
</style>
