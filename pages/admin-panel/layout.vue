<template>
  <div class="flex min-h-screen bg-gray-100">
    <LayoutAdminSidebar />
    <main class="flex-1 p-8 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin-auth'
})
</script>
