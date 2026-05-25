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
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'courses', label: '课程管理', icon: '📚' },
  { key: 'tools', label: '工具管理', icon: '🛠️', badge: 0 },
  { key: 'articles', label: '文章管理', icon: '📝', badge: 0 },
  { key: 'professions', label: '职业管理', icon: '💼' },
  { key: 'users', label: '用户管理', icon: '👥' },
]

const handleNavigate = (key: string) => {
  emit('navigate', key)
}
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">管理后台</h2>
    </div>

    <nav class="nav-list">
      <button
        v-for="item in navItems"
        :key="item.key"
        class="nav-item"
        :class="{ active: activeKey === item.key }"
        @click="handleNavigate(item.key)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span
          v-if="item.key === 'tools' && pendingTools && pendingTools > 0"
          class="nav-badge"
        >
          {{ pendingTools }}
        </span>
        <span
          v-if="item.key === 'articles' && pendingArticles && pendingArticles > 0"
          class="nav-badge"
        >
          {{ pendingArticles }}
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
      <button class="logout-btn" @click="handleNavigate('logout')">
        退出登录
      </button>
    </div>
  </aside>
</template>

<style scoped>
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