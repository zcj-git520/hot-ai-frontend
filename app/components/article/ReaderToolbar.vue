<template>
  <div class="reader-toolbar" role="toolbar" aria-label="阅读偏好">
    <div class="group" role="group" aria-label="字号">
      <button
        v-for="size in SIZES"
        :key="size.value"
        :class="{ active: props.fontSize === size.value }"
        :aria-label="`字号 ${size.label}`"
        :aria-pressed="props.fontSize === size.value"
        @click="emit('update:fontSize', size.value)"
      >
        <span :style="{ fontSize: size.sample }">A</span>
      </button>
    </div>

    <div class="group" role="group" aria-label="主题">
      <button
        v-for="t in THEMES"
        :key="t.value"
        :class="['theme-btn', `theme-${t.value}`, { active: props.theme === t.value }]"
        :aria-label="`主题 ${t.label}`"
        :aria-pressed="props.theme === t.value"
        @click="emit('update:theme', t.value)"
      >
        <span class="dot" :style="{ background: t.dot }" />
      </button>
    </div>

    <button
      class="back-to-top"
      :class="{ visible: showTop }"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { FontSize, Theme } from '~/app/composables/useReaderPrefs'

const SIZES = [
  { value: 'sm' as FontSize, label: '小', sample: '12px' },
  { value: 'md' as FontSize, label: '中', sample: '14px' },
  { value: 'lg' as FontSize, label: '大', sample: '16px' },
]
const THEMES = [
  { value: 'dark'  as Theme, label: '深色', dot: '#0d1117' },
  { value: 'light' as Theme, label: '浅色', dot: '#ffffff' },
  { value: 'sepia' as Theme, label: '护眼', dot: '#f5ecd9' },
]

const props = defineProps<{
  fontSize: FontSize
  theme: Theme
}>()
const emit = defineEmits<{
  (e: 'update:fontSize', value: FontSize): void
  (e: 'update:theme', value: Theme): void
}>()

const showTop = ref(false)
function onScroll() { showTop.value = window.scrollY > 600 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.reader-toolbar {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 50;
}
.group {
  display: flex;
  gap: 2px;
  background: rgba(22, 27, 34, 0.85);
  border: 1px solid #30363d;
  border-radius: 999px;
  padding: 4px;
  backdrop-filter: blur(8px);
}
button {
  border: 0;
  background: transparent;
  color: #8b949e;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms;
}
button:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
button.active { color: #fff; background: linear-gradient(135deg, #22d3ee, #a78bfa); }
.theme-btn .dot {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.back-to-top {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22d3ee, #a78bfa);
  color: #0d1117;
  font-weight: 700;
  font-size: 18px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 200ms;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
}
.back-to-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

@media (max-width: 768px) {
  .reader-toolbar { right: 12px; bottom: 12px; }
  .group button { width: 32px; height: 32px; }
  .back-to-top { width: 40px; height: 40px; }
}
</style>
