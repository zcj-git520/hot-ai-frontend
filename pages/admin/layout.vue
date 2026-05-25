<template>
  <div class="flex min-h-screen" style="background: #1a1a2e;">
    <AdminSidebar
      :active-key="activeMenu"
      :pending-tools="pendingToolsCount"
      :pending-articles="pendingArticlesCount"
      @navigate="handleNavigate"
    />
    <main class="flex-1 p-8 overflow-auto" style="background: #1a1a2e; margin-left: 240px;">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/app/components/admin/AdminSidebar.vue'

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
