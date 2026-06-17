<script setup lang="ts">
definePageMeta({
  middleware: 'admin-auth'
})

const activeMenu = ref('dashboard')
const pendingToolsCount = ref(0)
const pendingArticlesCount = ref(0)

function handleNavigate(key: string) {
  activeMenu.value = key
}
</script>

<template>
  <div class="admin-shell">
    <AdminSidebar
      :active-key="activeMenu"
      :pending-tools="pendingToolsCount"
      :pending-articles="pendingArticlesCount"
      @navigate="handleNavigate"
    />
    <main class="admin-main">
      <div class="broadsheet">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--paper);
  font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
}
.admin-main {
  margin-left: 280px;
  flex: 1;
  min-height: 100vh;
  padding-block: clamp(2rem, 4vw, 4rem);
  position: relative;
  z-index: 1;
}
@media (max-width: 1024px) {
  .admin-main { margin-left: 240px; }
}
</style>
