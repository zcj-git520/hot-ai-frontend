<template>
  <div class="articles-content">
    <!-- Header -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">文章管理</h2>
        <p class="section-subtitle">审核、编辑和管理文章内容</p>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card stat-total" @click="clearFilters">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">全部文章</span>
          </div>
        </div>

        <div class="stat-card stat-draft">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ draftCount }}</span>
            <span class="stat-label">草稿</span>
          </div>
        </div>

        <div class="stat-card stat-published">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 19l-7-7 7-7"/>
              <path d="M19 12H5"/>
              <path d="M22 17a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3 3 3 0 013 3z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ publishedCount }}</span>
            <span class="stat-label">已发布</span>
          </div>
        </div>

        <div class="stat-card stat-rejected">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ rejectedCount }}</span>
            <span class="stat-label">已拒绝</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-container">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章标题..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button v-if="searchQuery" @click="clearSearch" class="search-clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="filter-group">
        <select v-model="filterCategory" class="filter-select" @change="handleSearch">
          <option value="">全部分类</option>
          <option value="AI技术">AI技术</option>
          <option value="职业发展">职业发展</option>
          <option value="学习指南">学习指南</option>
          <option value="行业动态">行业动态</option>
        </select>

        <select v-model="filterStatus" class="filter-select" @change="handleSearch">
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="rejected">已拒绝</option>
        </select>

        <button @click="handleSearch" class="btn-filter-apply">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          应用筛选
        </button>

        <button v-if="filterCategory || filterStatus || searchQuery" @click="clearFilters" class="btn-filter-clear">
          清除筛选
        </button>
      </div>
    </div>

    <!-- Articles List -->
    <div class="articles-section">
      <!-- Loading -->
      <div v-if="loading" class="loading-grid">
        <div class="skeleton-card" v-for="i in 6" :key="i">
          <div class="skeleton-icon"></div>
          <div class="skeleton-content">
            <div class="skeleton-line long"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!loading && list.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
            <path d="M60 30v60M30 60h60" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            <circle cx="60" cy="60" r="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
          </svg>
        </div>
        <h3 class="empty-title">暂无文章</h3>
        <p class="empty-hint">没有找到匹配的文章</p>
      </div>

      <!-- Articles List -->
      <div v-else class="articles-list">
        <div
          v-for="(article, index) in list"
          :key="article.id"
          class="article-card"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="card-header">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6"/>
                <path d="M16 13H8"/>
                <path d="M16 17H8"/>
                <path d="M10 9H8"/>
              </svg>
            </div>
            <div class="card-badges">
              <span class="badge-status" :class="article.status">
                {{ getStatusText(article.status) }}
              </span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ article.title }}</h3>
            <p class="card-desc">{{ article.summary || '暂无摘要' }}</p>

            <div class="card-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                {{ article.category || '未分类' }}
              </span>
              <span class="meta-item author">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ article.author || '未知作者' }}
              </span>
            </div>

            <div class="card-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ formatDate(article.created_at) }}
            </div>
          </div>

          <div class="card-footer">
            <div class="card-actions">
              <button
                @click="openDetailsModal(article)"
                class="action-btn action-details"
                title="查看详情"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>

              <button
                v-if="article.status === 0"
                @click="handleApprove(article.id)"
                class="action-btn action-approve"
                title="通过审核"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </button>

              <button
                v-if="article.status === 0"
                @click="openRejectModal(article)"
                class="action-btn action-reject"
                title="拒绝"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </button>

              <button
                v-if="article.status === 1"
                @click="handleUnpublish(article.id)"
                class="action-btn action-unpublish"
                title="取消发布"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5m7-7l-7 7 7 7"/>
                </svg>
              </button>

              <button
                v-if="article.status === 3"
                @click="handleApprove(article.id)"
                class="action-btn action-approve"
                title="重新通过"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </button>

              <button
                v-if="article.status === 3"
                @click="handlePublish(article.id)"
                class="action-btn action-publish"
                title="直接发布"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-section">
      <div class="pagination-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="page-number"
            :class="{ active: page === currentPage, ellipsis: page === '...' }"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Details Modal -->
    <UiAdminModal v-model="showDetailsModal" :title="`文章详情 - ${currentArticle?.title || ''}`" size="lg">
      <div v-if="detailsLoading" class="modal-loading">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>
      <div v-else-if="currentArticle" class="article-details">
        <div class="detail-section">
          <h4 class="detail-title">基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">文章标题</span>
              <span class="detail-value">{{ currentArticle.title }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">分类</span>
              <span class="detail-value">{{ currentArticle.category || '未分类' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">作者</span>
              <span class="detail-value">{{ currentArticle.author || '未知作者' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">状态</span>
              <span class="detail-value badge-status" :class="currentArticle.status">
                {{ getStatusText(currentArticle.status) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ formatDate(currentArticle.created_at) }}</span>
            </div>
            <div class="detail-item" v-if="currentArticle.published_at">
              <span class="detail-label">发布时间</span>
              <span class="detail-value">{{ formatDate(currentArticle.published_at) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="detail-title">文章摘要</h4>
          <p class="detail-description">{{ currentArticle.summary || '暂无摘要' }}</p>
        </div>

        <div class="detail-section" v-if="currentArticle.content">
          <h4 class="detail-title">文章内容</h4>
          <p class="detail-description content-preview">{{ currentArticle.content }}</p>
        </div>

        <div class="detail-section" v-if="currentArticle.rejection_reason">
          <h4 class="detail-title">拒绝原因</h4>
          <p class="detail-description rejection">{{ currentArticle.rejection_reason }}</p>
        </div>
      </div>

      <template #footer>
        <button @click="showDetailsModal = false" class="btn-cancel">关闭</button>
        <button
          v-if="currentArticle?.status === 0"
          @click="handleApprove(currentArticle.id); showDetailsModal = false"
          class="btn-submit btn-approve"
        >
          通过审核
        </button>
        <button
          v-if="currentArticle?.status === 0"
          @click="openRejectModal(currentArticle); showDetailsModal = false"
          class="btn-submit btn-reject"
        >
          拒绝
        </button>
      </template>
    </UiAdminModal>

    <!-- Reject Reason Modal -->
    <UiAdminModal v-model="showRejectModal" title="拒绝文章" size="md">
      <div class="reason-form">
        <p class="reason-desc">请输入拒绝原因，以便作者了解需要修改的内容：</p>
        <textarea
          v-model="rejectReason"
          class="form-textarea"
          placeholder="请输入拒绝原因..."
          rows="4"
        ></textarea>
      </div>

      <template #footer>
        <button @click="showRejectModal = false; rejectReason = ''" class="btn-cancel">取消</button>
        <button @click="handleReject" :disabled="!rejectReason.trim()" class="btn-submit btn-reject">
          确认拒绝
        </button>
      </template>
    </UiAdminModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminApi } from '~/app/lib/api'

const { toastSuccess, toastError } = useToast()

// Types
interface ArticleListItem {
  id: number
  title: string
  summary: string
  category: string
  status: 0 | 1 | 3  // 0=草稿, 1=已发布, 3=已拒绝
  author: string
  created_at: string
  published_at?: string
  content?: string
  rejection_reason?: string
}

// Status text helper
const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '草稿',
    1: '已发布',
    3: '已拒绝'
  }
  return map[status] || String(status)
}

// Stats
const draftCount = computed(() => list.value.filter(i => i.status === 0).length)
const publishedCount = computed(() => list.value.filter(i => i.status === 1).length)
const rejectedCount = computed(() => list.value.filter(i => i.status === 3).length)
const list = ref<ArticleListItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 12
const totalCount = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

// Filters
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

// Details modal
const showDetailsModal = ref(false)
const currentArticle = ref<ArticleListItem | null>(null)
const detailsLoading = ref(false)

// Reject modal
const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectingArticleId = ref<number | null>(null)

// Pagination
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  return pages
})

// Helpers
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Load list
const loadList = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      pageSize
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterStatus.value) params.review_status = filterStatus.value

    const response = await adminApi.article.getPendingArticles(params)
    // adminApi returns the data object directly (interceptor extracts it)
    const result = response as any
    console.log('[ArticlesContent] API response:', JSON.stringify(result).substring(0, 500))

    if (result?.list && Array.isArray(result.list)) {
      list.value = result.list
      totalCount.value = result.total || result.list.length
    } else if (Array.isArray(response)) {
      list.value = response as any[]
      totalCount.value = list.value.length
    } else {
      list.value = []
      totalCount.value = 0
    }
  } catch (error: any) {
    console.error('[ArticlesContent] Error loading list:', error)
    // Don't show toast for load errors, just clear the list
    list.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadList()
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const clearFilters = () => {
  searchQuery.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
  handleSearch()
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    currentPage.value = page
    loadList()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadList()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadList()
  }
}

// Details modal
const openDetailsModal = async (article: ArticleListItem) => {
  currentArticle.value = article
  showDetailsModal.value = true

  detailsLoading.value = true
  try {
    const response = await articleApi.getById(article.id.toString())
    const result = (response as any)?.data || response
    if (result) {
      currentArticle.value = { ...article, ...result }
    }
  } catch (error: any) {
    console.error('[ArticlesContent] Error loading details:', error)
  } finally {
    detailsLoading.value = false
  }
}

// Approve / Review
const handleApprove = async (id: number) => {
  try {
    await adminApi.article.approveArticle(id)
    toastSuccess('文章已通过审核')
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  }
}

// Reject
const openRejectModal = (article: ArticleListItem) => {
  rejectingArticleId.value = article.id
  rejectReason.value = ''
  showRejectModal.value = true
}

const handleReject = async () => {
  if (!rejectingArticleId.value || !rejectReason.value.trim()) return
  try {
    await adminApi.article.rejectArticle(rejectingArticleId.value, rejectReason.value)
    toastSuccess('已拒绝该文章')
    showRejectModal.value = false
    rejectReason.value = ''
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  }
}

// Publish
const handlePublish = async (id: number) => {
  try {
    await adminApi.article.publishArticle(id)
    toastSuccess('文章已发布')
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  }
}

// Unpublish
const handleUnpublish = async (id: number) => {
  try {
    await adminApi.article.unpublishArticle(id)
    toastSuccess('文章已下架')
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  }
}

// Load data on mount
onMounted(loadList)
</script>

<style scoped>
/* CSS Variables - Simplified Theme */
:root {
  --bg-deep: #1a1a2e;
  --bg-surface: #25253a;
  --bg-elevated: #2f2f4a;
  --border-subtle: rgba(255, 255, 255, 0.1);
  --text-primary: #ffffff;
  --text-secondary: #c0c0cc;
  --text-muted: #c0c0cc;
  --accent-gold: #f59e0b;
  --accent-gold-light: #fbbf24;
  --accent-green: #22c55e;
  --accent-red: #ef4444;
  --accent-blue: #06b6d4;
  --accent-purple: #8b5cf6;
  --accent-pink: #ec4899;
}

/* Section Container */
.articles-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #c0c0cc;
  margin: 0;
}

/* Stats Section */
.stats-section {
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
  color: #fff;
}

.stat-total .stat-icon {
  background: linear-gradient(135deg, var(--accent-purple) 0%, #a78bfa 100%);
}

.stat-draft .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.stat-published .stat-icon {
  background: linear-gradient(135deg, var(--accent-green) 0%, #38f9d7 100%);
}

.stat-rejected .stat-icon {
  background: linear-gradient(135deg, var(--accent-red) 0%, #f87171 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #c0c0cc;
}

/* Filters Section */
.filters-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
}

.search-container {
  flex: 1;
  max-width: 320px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #808090;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.08);
}

.search-clear {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #808090;
}

.search-clear:hover {
  color: #ffffff;
}

.search-clear svg {
  width: 16px;
  height: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.75rem 2rem 0.75rem 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23c0c0cc' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.filter-select:focus {
  outline: none;
  border-color: var(--accent-gold);
  background-color: rgba(255, 255, 255, 0.08);
}

.filter-select option,
.filter-select optgroup {
  background: #25253a;
  color: #ffffff;
}

.btn-filter-apply {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter-apply svg {
  width: 14px;
  height: 14px;
}

.btn-filter-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
}

.btn-filter-clear {
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #c0c0cc;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter-clear:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Articles List */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-card {
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.2s ease;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-purple) 0%, #a78bfa 100%);
  border-radius: 12px;
}

.card-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.card-badges {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  align-items: flex-end;
  padding-right: 1rem;
}

.badge-status {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-status.draft {
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-gold);
}

.badge-status.published {
  background: rgba(34, 197, 94, 0.15);
  color: var(--accent-green);
}

.badge-status.rejected {
  background: rgba(239, 68, 68, 0.15);
  color: var(--accent-red);
}

.card-body {
  flex: 1;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.card-desc {
  font-size: 0.8125rem;
  color: #c0c0cc;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #c0c0cc;
}

.meta-item svg {
  width: 14px;
  height: 14px;
}

.card-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #808090;
}

.card-time svg {
  width: 12px;
  height: 12px;
}

.card-footer {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #c0c0cc;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.action-details:hover {
  background: rgba(79, 172, 254, 0.15);
  border-color: rgba(79, 172, 254, 0.3);
  color: #4facfe;
}

.action-approve:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  color: var(--accent-green);
}

.action-reject:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--accent-red);
}

.action-publish:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
  color: var(--accent-purple);
}

.action-unpublish:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--accent-gold);
}

/* Loading State */
.loading-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.25rem;
}

.skeleton-line {
  height: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.long { width: 80%; }
.skeleton-line.short { width: 50%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-illustration {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

.empty-illustration svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Pagination */
.pagination-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
}

.pagination-info {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn svg {
  width: 16px;
  height: 16px;
}

.page-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-number:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.page-number.active {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%);
  border-color: var(--accent-gold);
  color: #000;
  font-weight: 600;
}

.page-number.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
}

/* Modal Loading */
.modal-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem;
  color: var(--text-secondary);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Article Details */
.article-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.detail-description {
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}

.detail-description.content-preview {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.detail-description.rejection {
  color: var(--accent-red);
}

/* Reason Form */
.reason-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reason-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Button Styles */
.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #c0c0cc;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #fbbf24 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #000;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow:
    0 4px 16px rgba(245, 158, 11, 0.4),
    0 0 24px rgba(245, 158, 11, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 8px 24px rgba(245, 158, 11, 0.5),
    0 0 32px rgba(245, 158, 11, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-approve {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow:
    0 4px 16px rgba(34, 197, 94, 0.4),
    0 0 24px rgba(34, 197, 94, 0.2);
}

.btn-reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow:
    0 4px 16px rgba(239, 68, 68, 0.4),
    0 0 24px rgba(239, 68, 68, 0.2);
}

/* Form Elements */
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;
}

.form-textarea::placeholder {
  color: #6b7280;
}

.form-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .articles-content {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: none;
  }

  .article-card {
    flex-direction: column;
  }

  .card-footer {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>