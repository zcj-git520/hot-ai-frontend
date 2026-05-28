<template>
  <div class="flex min-h-screen" style="background: #1a1a2e;">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">管理后台</h2>
      </div>

      <nav class="nav-list">
        <button
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeMenu === item.key }"
          @click="handleNavigate(item.key)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span
            v-if="item.key === 'tools' && pendingToolsCount > 0"
            class="nav-badge"
          >
            {{ pendingToolsCount }}
          </span>
          <span
            v-if="item.key === 'articles' && pendingArticlesCount > 0"
            class="nav-badge"
          >
            {{ pendingArticlesCount }}
          </span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <div class="user-details">
            <span class="user-name">Admin</span>
            <span class="user-role">管理员</span>
          </div>
        </div>
        <button class="logout-btn">
          退出登录
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-auto" style="background: #1a1a2e; margin-left: 240px;">
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi, articleApi, professionApi } from '~/app/lib/api'
import DashboardContent from '~/app/components/admin/dashboard/DashboardContent.vue'
import CoursesContent from '~/app/components/admin/courses/CoursesContent.vue'
import ToolsContent from '~/app/components/admin/tools/ToolsContent.vue'
import ArticlesContent from '~/app/components/admin/articles/ArticlesContent.vue'
import ProfessionsContent from '~/app/components/admin/professions/ProfessionsContent.vue'
import UsersContent from '~/app/components/admin/users/UsersContent.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const route = useRoute()
const router = useRouter()
const activeMenu = ref('dashboard')

// Navigation items
const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'courses', label: '课程管理', icon: '📚' },
  { key: 'tools', label: '工具管理', icon: '🛠️' },
  { key: 'articles', label: '文章管理', icon: '📝' },
  { key: 'professions', label: '职业管理', icon: '💼' },
  { key: 'users', label: '用户管理', icon: '👥' },
]

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

const pendingToolsCount = ref(0)
const pendingArticlesCount = ref(0)

function handleNavigate(key: string) {
  activeMenu.value = key
  router.push({ query: { tab: key } })
}

// Fetch stats data
async function fetchStats() {
  try {
    const results = await Promise.allSettled([
      adminApi.learningPath.getList({ pageSize: 1 }),
      adminApi.tool.getPendingTools({ pageSize: 1 }).catch(() => ({ total: 0 })),
      articleApi.getList({ pageSize: 1 }),
      professionApi.getList({ pageSize: 1 }),
    ])

    stats.value = {
      courses: results[0].status === 'fulfilled' ? results[0].value?.total || 0 : 0,
      tools: results[1].status === 'fulfilled' ? results[1].value?.total || 0 : 0,
      articles: results[2].status === 'fulfilled' ? results[2].value?.total || 0 : 0,
      professions: results[3].status === 'fulfilled' ? results[3].value?.total || 0 : 0,
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

// Fetch pending counts
async function fetchPendingCounts() {
  try {
    const [toolsRes, articlesRes] = await Promise.all([
      adminApi.tool.getPendingTools({ pageSize: 1 }).catch(() => ({ total: 0 })),
      articleApi.getList({ pageSize: 1, category: 'pending' }),
    ])
    pendingToolsCount.value = toolsRes?.total || 0
    pendingArticlesCount.value = articlesRes?.total || 0
    pending.value = {
      tools: pendingToolsCount.value,
      articles: pendingArticlesCount.value,
    }
  } catch (error) {
    console.error('Failed to fetch pending counts:', error)
  }
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
/* Sidebar styles */
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background: #1a1a2e;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.nav-list {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-right: 3px solid transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border-right: 3px solid #6366f1;
}

.nav-icon {
  font-size: 1.125rem;
  margin-right: 0.75rem;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.logout-btn {
  width: 100%;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.375rem;
  color: #ef4444;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}
</style>
