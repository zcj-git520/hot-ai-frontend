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
      v-if="props.translatable"
      class="translate-btn"
      :class="{ active: props.translated, busy: props.translating }"
      :aria-label="props.translated ? `还原为${props.restoreLabel}` : `翻译为${props.targetLabel}`"
      :aria-pressed="props.translated"
      :disabled="props.translating"
      @click="emit('toggle-translate')"
    >
      {{ props.translated ? `原 · ${props.restoreLabel}` : `译 · ${props.targetLabel}` }}
    </button>

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

const props = withDefaults(defineProps<{
  fontSize: FontSize
  theme: Theme
  translatable?: boolean
  translating?: boolean
  translated?: boolean
  targetLabel?: string
  restoreLabel?: string
}>(), {
  translatable: false,
  translating: false,
  translated: false,
  targetLabel: '英文',
  restoreLabel: '中文',
})
const emit = defineEmits<{
  (e: 'update:fontSize', value: FontSize): void
  (e: 'update:theme', value: Theme): void
  (e: 'toggle-translate'): void
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

.translate-btn {
  height: 36px;
  align-self: flex-start;
  width: auto;
  padding: 0 16px;
  background: rgba(242, 235, 217, 0.92);
  color: #1A1714;
  border: 1px solid #1A1714;
  border-radius: 999px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  backdrop-filter: blur(8px);
  transition: all 200ms;
  white-space: nowrap;
}
.translate-btn:hover { background: #1A1714; color: #F2EBD9; }
.translate-btn.active { background: #B5202A; color: #F2EBD9; border-color: #B5202A; }
.translate-btn.busy { cursor: wait; opacity: 0.6; animation: pulse 1.2s ease-in-out infinite; }
@keyframes pulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
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
  .translate-btn { height: 32px; padding: 0 12px; font-size: 11px; }
}
</style>
