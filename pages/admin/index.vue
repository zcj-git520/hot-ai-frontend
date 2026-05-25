<template>
  <div class="admin-page">
    <DashboardContent
      v-if="activeMenu === 'dashboard'"
      :stats="stats"
      :pending="pending"
      @navigate="handleNavigate"
    />
    <CoursesContent
      v-else-if="activeMenu === 'courses'"
      @navigate="handleNavigate"
    />
    <ToolsContent
      v-else-if="activeMenu === 'tools'"
      @navigate="handleNavigate"
    />
    <ArticlesContent
      v-else-if="activeMenu === 'articles'"
      @navigate="handleNavigate"
    />
    <ProfessionsContent
      v-else-if="activeMenu === 'professions'"
      @navigate="handleNavigate"
    />
    <UsersContent
      v-else-if="activeMenu === 'users'"
      @navigate="handleNavigate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardContent from '~/app/components/admin/dashboard/DashboardContent.vue'
import CoursesContent from '~/app/components/admin/courses/CoursesContent.vue'
import ToolsContent from '~/app/components/admin/tools/ToolsContent.vue'
import ArticlesContent from '~/app/components/admin/articles/ArticlesContent.vue'
import ProfessionsContent from '~/app/components/admin/professions/ProfessionsContent.vue'
import UsersContent from '~/app/components/admin/users/UsersContent.vue'

const route = useRoute()
const router = useRouter()
const activeMenu = ref('dashboard')

// Stats data for dashboard
const stats = ref({
  courses: 0,
  tools: 0,
  articles: 0,
  professions: 0
})

const pending = ref({
  tools: 0,
  articles: 0
})

function handleNavigate(key: string) {
  activeMenu.value = key
  router.push({ query: { tab: key } })
}

// Fetch stats data
async function fetchStats() {
  // TODO: Call APIs to get actual stats
}

// Fetch pending counts
async function fetchPendingCounts() {
  // TODO: Call APIs to get pending counts
}

onMounted(() => {
  // Get initial tab from query
  if (route.query.tab) {
    activeMenu.value = route.query.tab as string
  }
  fetchStats()
  fetchPendingCounts()
})

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeMenu.value = newTab as string
  }
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
}
</style>
