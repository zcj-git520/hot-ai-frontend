<template>
  <aside class="admin-sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <NuxtLink to="/admin" class="logo-link">
        <span class="logo-icon">&#128737;</span>
        <div class="logo-text">
          <span class="logo-title">AI 热点追踪</span>
          <span class="logo-subtitle">管理后台</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <span class="nav-section-label">主菜单</span>
        <NuxtLink
          to="/admin"
          class="nav-item"
          active-class="nav-item-active"
        >
          <span class="nav-icon">&#128200;</span>
          <span class="nav-text">Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/learning-paths"
          class="nav-item"
          active-class="nav-item-active"
        >
          <span class="nav-icon">&#128218;</span>
          <span class="nav-text">课程管理</span>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <span class="nav-section-label">内容管理</span>
        <a href="#" class="nav-item">
          <span class="nav-icon">&#128196;</span>
          <span class="nav-text">文章管理</span>
          <span class="nav-badge">即将上线</span>
        </a>

        <a href="#" class="nav-item">
          <span class="nav-icon">&#127891;</span>
          <span class="nav-text">职业管理</span>
          <span class="nav-badge">即将上线</span>
        </a>

        <a href="#" class="nav-item">
          <span class="nav-icon">&#128736;</span>
          <span class="nav-text">工具管理</span>
          <span class="nav-badge">即将上线</span>
        </a>
      </div>
    </nav>

    <!-- User Info -->
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">
          {{ user?.nickname?.charAt(0) || 'A' }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ user?.nickname || 'Admin' }}</span>
          <span class="user-role">管理员</span>
        </div>
      </div>
      <button @click="handleLogout" class="logout-btn">
        <span>&#128682;</span>
        <span>退出登录</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await logout()
  }
}
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  min-height: 100vh;
  background: #1a1a2e;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
}

.admin-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: radial-gradient(ellipse at top, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Header */
.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #b8b8c8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.25rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section-label {
  display: block;
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #a0a0b0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  margin: 0.125rem 0.5rem;
  color: #d8d8e8;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s ease;
  position: relative;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-item-active {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: #f59e0b;
  border-radius: 0 3px 3px 0;
}

.nav-icon {
  font-size: 1.125rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
}

.nav-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.4rem;
  background: rgba(255, 255, 255, 0.08);
  color: #9898a8;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Footer */
.sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #b8b8c8;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
</style>
