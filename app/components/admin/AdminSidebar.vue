<script setup lang="ts">
defineProps<{
  activeKey: string
  pendingTools?: number
  pendingArticles?: number
}>()

const emit = defineEmits<{
  (e: 'navigate', key: string): void
}>()

const navItems = [
  { key: 'dashboard',   label: '总 览',  seal: '览' },
  { key: 'courses',     label: '课 程',  seal: '课' },
  { key: 'tools',       label: '工 具',  seal: '具' },
  { key: 'articles',    label: '资 讯',  seal: '闻' },
  { key: 'professions', label: '职 业',  seal: '业' },
  { key: 'users',       label: '订 户',  seal: '人' },
]

const handleNavigate = (key: string) => {
  emit('navigate', key)
}
</script>

<template>
  <aside class="admin-sidebar">
    <!-- 报头 -->
    <div class="px-6 pt-7 pb-6 border-b-2 border-ink">
      <div class="flex items-center gap-2 mb-3">
        <span class="seal-square seal-square--tilt-l">编 辑 部</span>
      </div>
      <h2 class="font-serif font-black text-[1.7rem] leading-[1.05] tracking-[0.04em] text-ink">编 辑 卷 次</h2>
      <p class="text-[10.5px] font-mono tracking-[0.18em] uppercase text-ink-mute mt-1.5">
        Editor Console · v 1.0
      </p>
    </div>

    <!-- 导航 -->
    <nav class="flex-1 py-4">
      <div class="kicker kicker--mute px-6 mb-3">操 作 卷 次</div>
      <ul class="space-y-0.5">
        <li v-for="item in navItems" :key="item.key">
          <button
            class="admin-nav-item w-full text-left"
            :class="{ 'is-active': activeKey === item.key }"
            @click="handleNavigate(item.key)"
          >
            <span class="font-serif font-black text-[12px] tracking-[0.18em] w-7 h-7 inline-flex items-center justify-center border"
                  :class="activeKey === item.key ? 'bg-paper-soft text-seal border-paper-soft' : 'border-ink text-ink'">
              {{ item.seal }}
            </span>
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.key === 'tools' && pendingTools && pendingTools > 0"
              class="admin-nav-badge"
            >
              {{ pendingTools }}
            </span>
            <span
              v-if="item.key === 'articles' && pendingArticles && pendingArticles > 0"
              class="admin-nav-badge"
            >
              {{ pendingArticles }}
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- 底部 -->
    <div class="px-6 py-6 border-t-2 border-ink">
      <div class="flex items-center gap-3 mb-5">
        <span class="font-serif font-black text-paper-soft text-[1.2rem] leading-none w-10 h-10 flex items-center justify-center bg-seal">A</span>
        <div>
          <p class="font-serif font-bold text-[14px] text-ink leading-tight">主 编</p>
          <p class="text-[10.5px] font-mono tracking-[0.18em] uppercase text-ink-mute mt-0.5">EDITOR</p>
        </div>
      </div>
      <button class="btn btn--ghost btn--sm w-full" @click="handleNavigate('logout')">
        退 出 编 辑
      </button>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 280px;
  height: 100vh;
  background: var(--paper);
  border-right: 3px solid var(--ink);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  font-family: 'Noto Serif SC', serif;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 1.5rem;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  background: transparent;
  border: 0;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: background-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
              color 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
              border-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
  text-align: left;
  position: relative;
}
.admin-nav-item:hover {
  background: var(--paper-deep);
  color: var(--ink);
}
.admin-nav-item.is-active {
  background: var(--ink);
  color: var(--paper-soft);
  border-left-color: var(--vermillion);
}
.admin-nav-item.is-active .admin-nav-badge {
  background: var(--vermillion);
  color: var(--paper-soft);
  border-color: var(--vermillion);
}

.admin-nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.4rem;
  background: var(--vermillion);
  color: var(--paper-soft);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  font-weight: 600;
  border: 1px solid var(--vermillion);
  letter-spacing: 0;
}

@media (max-width: 1024px) {
  .admin-sidebar {
    width: 240px;
  }
}
</style>
