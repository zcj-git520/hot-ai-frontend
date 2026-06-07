<template>
  <div
    class="reading-progress"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    role="progressbar"
  >
    <div class="bar" :style="{ width: `${progress}%` }" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    target?: string
  }>(),
  { target: 'document' }
)

const progress = ref(0)
let raf = 0

function update() {
  raf = 0
  const el = props.target === 'document' || !props.target
    ? document.documentElement
    : document.querySelector(props.target)
  if (!el) return
  const rect = (el as HTMLElement).getBoundingClientRect()
  const total = rect.height - window.innerHeight
  if (total <= 0) { progress.value = 0; return }
  const scrolled = Math.min(Math.max(-rect.top, 0), total)
  progress.value = Math.round((scrolled / total) * 100)
}

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: transparent;
  z-index: 60;
  pointer-events: none;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #a78bfa);
  transition: width 80ms linear;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.5);
}
</style>
