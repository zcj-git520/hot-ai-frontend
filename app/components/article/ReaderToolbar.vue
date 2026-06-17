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
        <span :style="{ fontSize: size.sample }">字</span>
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
  { value: 'sm' as FontSize, label: '小', sample: '11px' },
  { value: 'md' as FontSize, label: '中', sample: '13px' },
  { value: 'lg' as FontSize, label: '大', sample: '15px' },
]
const THEMES = [
  { value: 'paper'  as Theme, label: '宣纸', dot: '#F2EBD9' },
  { value: 'indigo' as Theme, label: '青墨', dot: '#1F3147' },
  { value: 'ochre'  as Theme, label: '赭石', dot: '#A87326' },
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
  font-family: 'Noto Serif SC', serif;
}
.group {
  display: flex;
  gap: 2px;
  background: rgba(242, 235, 217, 0.92);
  border: 1px solid #1A1714;
  padding: 4px;
  backdrop-filter: blur(8px);
}
button {
  border: 0;
  background: transparent;
  color: #6B6155;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms;
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
}
button:hover { color: #1A1714; background: rgba(26, 23, 20, 0.06); }
button.active { color: #F2EBD9; background: #B5202A; }
.theme-btn .dot {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #1A1714;
}

.back-to-top {
  width: 44px;
  height: 44px;
  background: #1A1714;
  color: #F2EBD9;
  font-weight: 700;
  font-size: 18px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 200ms;
  pointer-events: none;
  border: 1px solid #1A1714;
  font-family: 'Noto Serif SC', serif;
}
.back-to-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
.back-to-top:hover { background: #B5202A; border-color: #B5202A; }

@media (max-width: 768px) {
  .reader-toolbar { right: 12px; bottom: 12px; }
  .group button { width: 32px; height: 32px; }
  .back-to-top { width: 40px; height: 40px; }
}
</style>
