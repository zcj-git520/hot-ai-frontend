<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">控制台</h1>
        <p class="dashboard-subtitle">欢迎回来，查看平台整体状态</p>
      </div>
    </header>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.learningPaths }}</span>
          <span class="stat-label">课程</span>
        </div>
        <div class="stat-trend up" v-if="stats.learningPaths > 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.chapters }}</span>
          <span class="stat-label">章节总数</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.published }}</span>
          <span class="stat-label">已发布</span>
        </div>
        <div class="stat-badge published">{{ publishedPercent }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.draft }}</span>
          <span class="stat-label">草稿</span>
        </div>
        <div class="stat-badge draft" v-if="stats.draft > 0">{{ stats.draft }} 待发布</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">快捷操作</h2>
      <div class="actions-grid">
        <NuxtLink to="/admin/learning-paths" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div class="action-content">
            <span class="action-title">课程管理</span>
            <span class="action-desc">创建、编辑、发布课程</span>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </NuxtLink>

        <NuxtLink to="/admin/learning-paths" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div class="action-content">
            <span class="action-title">创建新课程</span>
            <span class="action-desc">添加新的课程</span>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Paths -->
    <div class="recent-section" v-if="recentPaths.length > 0">
      <div class="section-header">
        <h2 class="section-title">最近的课程</h2>
        <NuxtLink to="/admin/learning-paths" class="view-all">查看全部</NuxtLink>
      </div>
      <div class="recent-list">
        <div v-for="path in recentPaths" :key="path.id" class="recent-item">
          <div class="recent-icon">{{ path.icon || '📚' }}</div>
          <div class="recent-info">
            <span class="recent-title">{{ path.title }}</span>
            <span class="recent-meta">{{ path.chapter_count }} 章节 · {{ getDifficultyText(path.difficulty) }}</span>
          </div>
          <span class="recent-status" :class="path.status === 1 ? 'published' : 'draft'">
            {{ path.status === 1 ? '已发布' : '草稿' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { LearningPathListItem } from '~/types/admin'

const stats = ref({
  learningPaths: 0,
  chapters: 0,
  published: 0,
  draft: 0
})

const recentPaths = ref<LearningPathListItem[]>([])

const publishedPercent = computed(() => {
  if (stats.value.learningPaths === 0) return 0
  return Math.round((stats.value.published / stats.value.learningPaths) * 100)
})

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = { beginner: '入门', intermediate: '进阶', advanced: '高级' }
  return map[difficulty] || difficulty
}

onMounted(async () => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    const data = await adminApi.learningPath.getList({ page: 1, pageSize: 1 })
    if (data) {
      stats.value.learningPaths = data.total || 0

      const [publishedData, draftData, recentData] = await Promise.all([
        adminApi.learningPath.getList({ page: 1, pageSize: 100, status: 1 }),
        adminApi.learningPath.getList({ page: 1, pageSize: 100, status: 0 }),
        adminApi.learningPath.getList({ page: 1, pageSize: 5 })
      ])

      stats.value.published = publishedData?.total || 0
      stats.value.draft = draftData?.total || 0
      recentPaths.value = recentData?.list || []
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0 0 0.375rem 0;
}

.dashboard-subtitle {
  font-size: 0.875rem;
  color: #6b6b73;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.stat-value {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f5f5f5;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b6b73;
}

.stat-trend {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-trend svg {
  width: 16px;
  height: 16px;
}

.stat-trend.up {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.stat-badge {
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
}

.stat-badge.published {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.stat-badge.draft {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

/* Section Title */
.section-title {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0 0 1rem 0;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .actions-grid { grid-template-columns: 1fr; }
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(234, 179, 8, 0.3);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 22px;
  height: 22px;
  color: #000;
}

.action-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.action-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #f5f5f5;
}

.action-desc {
  font-size: 0.8125rem;
  color: #6b6b73;
}

.action-arrow {
  color: #6b6b73;
  transition: transform 0.2s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(4px);
  color: #eab308;
}

.action-arrow svg {
  width: 20px;
  height: 20px;
}

/* Recent Section */
.recent-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header .section-title {
  margin: 0;
}

.view-all {
  font-size: 0.8125rem;
  color: #eab308;
  text-decoration: none;
  transition: color 0.15s ease;
}

.view-all:hover {
  color: #f59e0b;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  transition: background 0.15s ease;
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.recent-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #f5f5f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  font-size: 0.75rem;
  color: #6b6b73;
}

.recent-status {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
  flex-shrink: 0;
}

.recent-status.published {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.recent-status.draft {
  background: rgba(255, 255, 255, 0.08);
  color: #a0a0a8;
}
</style>
