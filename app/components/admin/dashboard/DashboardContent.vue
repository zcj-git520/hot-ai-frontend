<script setup lang="ts">
defineProps<{
  stats: {
    courses: number
    tools: number
    articles: number
    professions: number
  }
  pending: {
    tools: number
    articles: number
  }
}>()

defineEmits<{
  (e: 'navigate', key: string): void
}>()
</script>

<template>
  <div class="dashboard-content">
    <h1 class="page-title">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" @click="$emit('navigate', 'courses')">
        <div class="stat-icon courses"><span>📚</span></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.courses }}</div>
          <div class="stat-label">课程总数</div>
        </div>
      </div>

      <div class="stat-card" @click="$emit('navigate', 'tools')">
        <div class="stat-icon tools"><span>🛠️</span></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.tools }}</div>
          <div class="stat-label">工具总数</div>
        </div>
      </div>

      <div class="stat-card" @click="$emit('navigate', 'articles')">
        <div class="stat-icon articles"><span>📝</span></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.articles }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>

      <div class="stat-card" @click="$emit('navigate', 'professions')">
        <div class="stat-icon professions"><span>💼</span></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.professions }}</div>
          <div class="stat-label">职业总数</div>
        </div>
      </div>
    </div>

    <!-- Pending Section -->
    <div class="pending-section">
      <h2 class="section-title">待审核</h2>
      <div class="pending-list">
        <div class="pending-item" @click="$emit('navigate', 'tools')">
          <span class="pending-icon">🛠️</span>
          <span class="pending-text">工具待审核</span>
          <span class="pending-count">{{ pending.tools }}</span>
        </div>

        <div class="pending-item" @click="$emit('navigate', 'articles')">
          <span class="pending-icon">📝</span>
          <span class="pending-text">文章待审核</span>
          <span class="pending-count">{{ pending.articles }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-content {
  padding: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #25253a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.stat-icon.courses {
  background: rgba(99, 102, 241, 0.2);
}

.stat-icon.tools {
  background: rgba(34, 197, 94, 0.2);
}

.stat-icon.articles {
  background: rgba(245, 158, 11, 0.2);
}

.stat-icon.professions {
  background: rgba(236, 72, 153, 0.2);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  font-size: 0.875rem;
  color: #808090;
}

.pending-section {
  background: #25253a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pending-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pending-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.pending-icon {
  font-size: 1.25rem;
}

.pending-text {
  color: #ffffff;
  font-size: 0.9375rem;
}

.pending-count {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>