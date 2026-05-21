<template>
  <div class="flex min-h-screen" style="background: #1a1a2e;">
    <LayoutAdminSidebar />
    <main class="flex-1 p-8 overflow-auto" style="background: #1a1a2e;">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin-auth'
})
</script>
