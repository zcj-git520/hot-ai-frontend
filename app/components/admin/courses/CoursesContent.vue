<template>
  <div class="courses-content">
    <!-- Header -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">课程管理</h2>
        <p class="section-subtitle">创建、编辑和管理平台课程内容</p>
      </div>
      <button @click="openCreateModal" class="btn-create">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14m-7-7h14"/>
        </svg>
        <span>新建课程</span>
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card stat-total" @click="clearFilters">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">全部课程</span>
          </div>
        </div>

        <div class="stat-card stat-published">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ publishedCount }}</span>
            <span class="stat-label">已发布</span>
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

        <div class="stat-card stat-featured">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ featuredCount }}</span>
            <span class="stat-label">精选推荐</span>
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
            placeholder="搜索课程标题、内容..."
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
        <select v-model="filterDifficulty" class="filter-select" @change="handleSearch">
          <option value="">全部难度</option>
          <option value="beginner">入门级</option>
          <option value="intermediate">进阶型</option>
          <option value="advanced">高级深入</option>
        </select>

        <select v-model="filterStatus" class="filter-select" @change="handleSearch">
          <option value="">全部状态</option>
          <option value="0">草稿</option>
          <option value="1">已发布</option>
        </select>

        <button @click="handleSearch" class="btn-filter-apply">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          应用筛选
        </button>

        <button v-if="filterDifficulty || filterStatus || searchQuery" @click="clearFilters" class="btn-filter-clear">
          清除筛选
        </button>
      </div>
    </div>

    <!-- Course Grid -->
    <div class="courses-section">
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
        <h3 class="empty-title">暂无课程</h3>
        <p class="empty-hint">开始创建你的第一个课程吧</p>
        <button @click="openCreateModal" class="btn-empty-create">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          创建课程
        </button>
      </div>

      <!-- Course Cards Grid -->
      <div v-else class="courses-grid">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          class="course-card"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="card-header">
            <div class="card-icon" :style="{ background: getIconBg(item.icon) }">
              {{ item.icon || '📚' }}
            </div>
            <div class="card-badges">
              <span v-if="item.is_featured" class="badge-featured">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                推荐
              </span>
              <span class="badge-status" :class="item.status === 1 ? 'published' : 'draft'">
                {{ item.status === 1 ? '已发布' : '草稿' }}
              </span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description || '暂无描述' }}</p>

            <div class="card-meta">
              <span class="meta-item difficulty" :class="item.difficulty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                {{ getDifficultyText(item.difficulty) }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ item.chapter_count || 0 }} 章节
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {{ item.estimated_hours || 0 }}h
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="card-actions">
              <button
                @click="handleToggleFeatured(item)"
                class="action-btn action-feature"
                :class="{ active: item.is_featured }"
                :title="item.is_featured ? '取消推荐' : '设为推荐'"
              >
                <svg viewBox="0 0 24 24" :fill="item.is_featured ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>

              <button
                v-if="item.status !== 1"
                @click="handlePublish(item.id)"
                class="action-btn action-publish"
                title="发布"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button
                v-else
                @click="handleUnpublish(item.id)"
                class="action-btn action-unpublish"
                title="下架"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5m7-7l-7 7 7 7"/>
                </svg>
              </button>

              <button
                @click="openChaptersModal(item)"
                class="action-btn action-chapters"
                title="管理章节"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>

              <button
                @click="openEditModal(item)"
                class="action-btn action-edit"
                title="编辑"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <button
                @click="handleDelete(item.id)"
                class="action-btn action-delete"
                title="删除"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
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

    <!-- Create/Edit Modal -->
    <UiAdminModal v-model="showFormModal" :title="isEditing ? '编辑课程' : '创建课程'" size="lg">
      <form @submit.prevent="handleSubmit" class="form-grid">
        <div class="form-group full-width">
          <label class="form-label">课程标题 <span class="required">*</span></label>
          <input
            v-model="formData.title"
            class="form-input"
            :class="{ 'input-error': showValidation && !formData.title.trim() }"
            placeholder="例如：Python入门指南"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">图标</label>
          <div class="icon-picker">
            <button type="button" v-for="icon in iconOptions" :key="icon"
              @click="formData.icon = icon"
              class="icon-option"
              :class="{ selected: formData.icon === icon }"
            >{{ icon }}</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">难度等级</label>
          <select v-model="formData.difficulty" class="form-select">
            <option value="beginner">入门</option>
            <option value="intermediate">进阶</option>
            <option value="advanced">高级</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label class="form-label">描述</label>
          <textarea v-model="formData.description" class="form-textarea" placeholder="简要描述这个课程的目标和内容..." rows="3"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">难度标签</label>
          <input v-model="formData.level_label" class="form-input" placeholder="例如：零基础适用" />
        </div>

        <div class="form-group">
          <label class="form-label">预计天数</label>
          <input v-model.number="formData.estimated_days" type="number" min="1" class="form-input" placeholder="30" />
        </div>

        <div class="form-group">
          <label class="form-label">预计小时数</label>
          <input v-model.number="formData.estimated_hours" type="number" min="1" class="form-input" placeholder="60" />
        </div>

        <div class="form-group">
          <label class="form-label">目标</label>
          <input v-model="learningGoalsInput" class="form-input" placeholder="用逗号分隔多个目标" />
        </div>

        <div class="form-group">
          <label class="form-label">封面图片URL</label>
          <input v-model="formData.cover_image" class="form-input" placeholder="https://..." />
        </div>

        <div class="form-group full-width">
          <label class="form-label">目标受众</label>
          <input v-model="targetAudienceInput" class="form-input" placeholder="用逗号分隔" />
        </div>
      </form>
      <template #footer>
        <button @click="showFormModal = false" class="btn-cancel">取消</button>
        <button @click="handleSubmit" :disabled="submitting" class="btn-submit">
          {{ submitting ? '保存中...' : (isEditing ? '保存修改' : '创建') }}
        </button>
      </template>
    </UiAdminModal>

    <!-- Chapters Modal -->
    <UiAdminModal v-model="showChaptersModal" :title="`章节管理 - ${currentPath?.title || ''}`" size="lg">
      <div class="chapters-panel">
        <div class="chapters-header">
          <span class="chapters-count">共 {{ chapters.length }} 个章节</span>
          <div class="flex gap-2">
            <button @click="openImportArticleModal" class="btn-import-article">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              导入文章
            </button>
            <button @click="openAddChapter" class="btn-add-chapter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 6v12m6-6H6"/>
              </svg>
              添加章节
            </button>
          </div>
        </div>

        <div v-if="chaptersLoading" class="chapters-loading">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>

        <div v-else-if="chapters.length === 0" class="chapters-empty">
          <p>暂无章节，点击上方按钮添加</p>
        </div>

        <div v-else class="chapters-list">
          <div v-for="(chapter, index) in chapters" :key="chapter.id" class="chapter-item">
            <div class="chapter-order">{{ index + 1 }}</div>
            <div class="chapter-info">
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-meta">
                {{ getContentTypeText(chapter.content_type) }} · {{ chapter.estimated_hours }}h · {{ chapter.is_free ? '免费' : '付费' }}
              </span>
            </div>
            <div class="chapter-actions">
              <button @click="openEditChapter(chapter)" class="btn-icon-action">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button @click="handleDeleteChapter(chapter.id)" class="btn-icon-action btn-delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Chapter Form -->
      <div v-if="showChapterForm" class="chapter-form">
        <h4 class="chapter-form-title">{{ editingChapter ? '编辑章节' : '添加章节' }}</h4>
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">章节标题 <span class="required">*</span></label>
            <input v-model="chapterFormData.title" class="form-input" placeholder="章节标题" required />
          </div>
          <div class="form-group full-width">
            <label class="form-label">描述</label>
            <textarea v-model="chapterFormData.description" class="form-textarea" placeholder="章节描述..." rows="2"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">内容类型</label>
            <select v-model="chapterFormData.content_type" class="form-select">
              <option value="article">文章</option>
              <option value="video">视频</option>
              <option value="practice">练习</option>
              <option value="external">外部链接</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">预计小时</label>
            <input v-model.number="chapterFormData.estimated_hours" type="number" min="0.5" step="0.5" class="form-input" />
          </div>
          <div class="form-group full-width" v-if="chapterFormData.content_type === 'video'">
            <label class="form-label">视频URL</label>
            <input v-model="chapterFormData.video_url" class="form-input" placeholder="https://..." />
          </div>
          <div class="form-group full-width" v-if="chapterFormData.content_type === 'article'">
            <label class="form-label">内容</label>
            <textarea v-model="chapterFormData.content" class="form-textarea" placeholder="文章内容..." rows="6"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" v-model="chapterFormData.is_free" class="checkbox" />
              免费章节
            </label>
          </div>
        </div>
        <div class="chapter-form-actions">
          <button @click="cancelChapterForm" class="btn-cancel">取消</button>
          <button @click="handleSaveChapter" :disabled="chapterSubmitting" class="btn-submit">
            {{ chapterSubmitting ? '保存中...' : '保存章节' }}
          </button>
        </div>
      </div>

      <template #footer>
        <button @click="showChaptersModal = false" class="btn-cancel">关闭</button>
      </template>
    </UiAdminModal>

    <!-- Import Article Modal -->
    <UiAdminModal v-model="showImportModal" title="导入文章为章节" size="lg">
      <div class="import-articles-panel">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="articleSearchQuery"
            type="text"
            placeholder="搜索文章标题..."
            class="search-input"
            @keyup.enter="loadArticles"
          />
          <button @click="loadArticles" class="btn-search">搜索</button>
        </div>

        <div v-if="articleLoading" class="chapters-loading">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>

        <div v-else-if="articleList.length === 0" class="chapters-empty">
          <p>暂无文章</p>
        </div>

        <div v-else class="articles-list">
          <div
            v-for="article in articleList"
            :key="article.id"
            class="article-item"
            :class="{ selected: selectedArticle?.id === article.id }"
            @click="selectedArticle = article"
          >
            <div class="article-radio">
              <div class="radio-circle"></div>
            </div>
            <div class="article-info">
              <span class="article-title">{{ article.title }}</span>
              <span class="article-summary">{{ article.summary || '暂无摘要' }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showImportModal = false" class="btn-cancel">取消</button>
        <button @click="handleImportArticle" :disabled="!selectedArticle || chapterSubmitting" class="btn-submit">
          {{ chapterSubmitting ? '导入中...' : '导入选中文章' }}
        </button>
      </template>
    </UiAdminModal>

    <!-- Delete Confirm -->
    <UiAdminConfirmDialog
      v-model="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这个课程吗？此操作不可撤销。"
      confirm-text="删除"
      confirm-type="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { LearningPathListItem, LearningPathFormData, PathChapterListItem, ChapterFormData } from '~/types/admin'
import { ref, reactive, computed, onMounted } from 'vue'
import { adminApi } from '~/app/lib/api'

const { toastSuccess, toastError } = useToast()

// List state
const list = ref<LearningPathListItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 20
const totalCount = ref(0)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

// Filters
const searchQuery = ref('')
const filterDifficulty = ref('')
const filterStatus = ref('')

// Stats
const publishedCount = computed(() => list.value.filter(i => i.status === 1).length)
const draftCount = computed(() => list.value.filter(i => i.status !== 1).length)
const featuredCount = computed(() => list.value.filter(i => i.is_featured).length)

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

// Form modal
const showFormModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const showValidation = ref(false)
const formData = reactive<LearningPathFormData>({
  title: '',
  icon: '📚',
  description: '',
  difficulty: 'beginner',
  level_label: '',
  learning_goals: [],
  target_audience: [],
  estimated_days: 30,
  estimated_hours: 60,
  cover_image: '',
  is_featured: false,
  sort_order: 0
})

// For comma-separated inputs
const learningGoalsInput = ref('')
const targetAudienceInput = ref('')

// Chapters modal
const showChaptersModal = ref(false)
const currentPath = ref<LearningPathListItem | null>(null)
const chapters = ref<PathChapterListItem[]>([])
const chaptersLoading = ref(false)
const showChapterForm = ref(false)
const editingChapter = ref<PathChapterListItem | null>(null)
const chapterSubmitting = ref(false)
const chapterFormData = reactive<ChapterFormData & { order_index?: number }>({
  title: '',
  description: '',
  content_type: 'article',
  content: '',
  video_url: '',
  external_links: [],
  estimated_hours: 1,
  is_free: false,
  order_index: undefined
})

// Delete
const showDeleteConfirm = ref(false)
const deleteId = ref<number | null>(null)

const iconOptions = ['📚', '🚀', '💻', '🎯', '⭐', '🔥', '💡', '🛠️', '📖', '🎓', '💪', '🌟', '🤖', '🎨', '📱', '🌐']

const getIconBg = (icon: string) => {
  const colors: Record<string, string> = {
    '📚': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '🚀': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '💻': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    '🎯': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    '⭐': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    '🔥': 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    '💡': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    '🛠️': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    '📖': 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    '🎓': 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    '💪': 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
    '🌟': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    '🤖': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '🎨': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    '📱': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    '🌐': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
  return colors[icon] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = { beginner: '入门', intermediate: '进阶', advanced: '高级' }
  return map[difficulty] || difficulty
}

const getContentTypeText = (type: string) => {
  const map: Record<string, string> = { article: '文章', video: '视频', practice: '练习', external: '外部' }
  return map[type] || type
}

// Load list
const loadList = async () => {
  loading.value = true
  try {
    const response = await adminApi.learningPath.getList({
      page: currentPage.value,
      pageSize,
      search: searchQuery.value || undefined,
      difficulty: filterDifficulty.value || undefined,
      status: filterStatus.value !== '' ? Number(filterStatus.value) as any : undefined
    })
    // API interceptor returns responseData.data for success (code 200), so response IS the data
    const result = response as any
    if (result?.list) {
      list.value = result.list || []
      totalCount.value = result.total || 0
    } else if (result?.data?.list) {
      list.value = result.data.list || []
      totalCount.value = result.data.total || 0
    }
  } catch (error: any) {
    console.error('[CoursesContent] Error loading list:', error)
    toastError(error.message || '加载失败')
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
  filterDifficulty.value = ''
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

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  showValidation.value = false
  Object.assign(formData, {
    title: '',
    icon: '📚',
    description: '',
    difficulty: 'beginner',
    level_label: '',
    learning_goals: [],
    target_audience: [],
    estimated_days: 30,
    estimated_hours: 60,
    cover_image: '',
    is_featured: false
  })
  learningGoalsInput.value = ''
  targetAudienceInput.value = ''
  showFormModal.value = true
}

// Open edit modal
const openEditModal = (item: LearningPathListItem) => {
  isEditing.value = true
  editingId.value = item.id
  Object.assign(formData, {
    title: item.title,
    icon: item.icon || '📚',
    description: item.description || '',
    difficulty: item.difficulty,
    level_label: item.level_label || '',
    learning_goals: [],
    target_audience: [],
    estimated_days: item.estimated_days || 30,
    estimated_hours: item.estimated_hours || 60,
    cover_image: item.cover_image || '',
    is_featured: !!item.is_featured,
    sort_order: item.sort_order || 0
  })
  learningGoalsInput.value = ''
  targetAudienceInput.value = ''
  showFormModal.value = true
}

// Submit form
const handleSubmit = async () => {
  showValidation.value = true
  if (!formData.title.trim()) {
    toastError('请输入课程标题')
    return
  }

  if (learningGoalsInput.value) {
    formData.learning_goals = learningGoalsInput.value.split(',').map(s => s.trim()).filter(Boolean)
  }
  if (targetAudienceInput.value) {
    formData.target_audience = targetAudienceInput.value.split(',').map(s => s.trim()).filter(Boolean)
  }

  submitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await adminApi.learningPath.update(editingId.value, formData)
      toastSuccess('更新成功')
    } else {
      await adminApi.learningPath.create(formData)
      toastSuccess('创建成功')
    }
    showFormModal.value = false
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// Publish
const handlePublish = async (id: number) => {
  try {
    await adminApi.learningPath.publish(id)
    toastSuccess('发布成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '发布失败')
  }
}

// Unpublish
const handleUnpublish = async (id: number) => {
  try {
    await adminApi.learningPath.unpublish(id)
    toastSuccess('下架成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '下架失败')
  }
}

// Toggle featured
const handleToggleFeatured = async (item: LearningPathListItem) => {
  try {
    await adminApi.learningPath.setFeatured(item.id, !item.is_featured)
    toastSuccess(item.is_featured ? '已取消推荐' : '已设为推荐')
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  }
}

// Delete
const handleDelete = (id: number) => {
  deleteId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  try {
    await adminApi.learningPath.delete(deleteId.value)
    toastSuccess('删除成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '删除失败')
  } finally {
    deleteId.value = null
  }
}

// Chapters
const openChaptersModal = async (item: LearningPathListItem) => {
  currentPath.value = item
  showChaptersModal.value = true
  showChapterForm.value = false
  editingChapter.value = null
  await loadChapters(item.id)
}

const loadChapters = async (pathId: number) => {
  chaptersLoading.value = true
  try {
    const response = await adminApi.chapter.getListByPath(pathId)
    // After interceptor response is already the data part
    chapters.value = Array.isArray(response) ? response : (response?.list || [])
  } catch (error: any) {
    toastError(error.message || '加载章节失败')
  } finally {
    chaptersLoading.value = false
  }
}

const openAddChapter = () => {
  editingChapter.value = null
  Object.assign(chapterFormData, {
    title: '',
    description: '',
    content_type: 'article',
    content: '',
    video_url: '',
    external_links: [],
    estimated_hours: 1,
    is_free: false
  })
  showChapterForm.value = true
}

const openEditChapter = (chapter: PathChapterListItem) => {
  editingChapter.value = chapter
  Object.assign(chapterFormData, {
    title: chapter.title,
    description: chapter.description || '',
    content_type: chapter.content_type,
    content: '',
    video_url: '',
    external_links: [],
    order_index: chapter.order_index,
    estimated_hours: chapter.estimated_hours,
    is_free: Boolean(chapter.is_free)
  })
  showChapterForm.value = true
}

const cancelChapterForm = () => {
  showChapterForm.value = false
  editingChapter.value = null
}

// Import Article Modal
const showImportModal = ref(false)
const articleList = ref<any[]>([])
const articleLoading = ref(false)
const articleSearchQuery = ref('')
const selectedArticle = ref<any>(null)

const openImportArticleModal = async () => {
  showImportModal.value = true
  selectedArticle.value = null
  articleSearchQuery.value = ''
  await loadArticles()
}

const loadArticles = async () => {
  articleLoading.value = true
  try {
    const response = await fetch(`/api/articles?page=1&page_size=20${articleSearchQuery.value ? `&keyword=${encodeURIComponent(articleSearchQuery.value)}` : ''}`)
    const result = await response.json()
    articleList.value = result.data?.articles || []
  } catch (error: any) {
    toastError('加载文章列表失败')
  } finally {
    articleLoading.value = false
  }
}

const handleImportArticle = async () => {
  if (!selectedArticle.value || !currentPath.value) {
    toastError('请选择一篇文章')
    return
  }

  chapterSubmitting.value = true
  try {
    await adminApi.chapter.create(currentPath.value.id, {
      title: selectedArticle.value.title,
      description: selectedArticle.value.summary || '',
      content_type: 'article',
      content: selectedArticle.value.content || selectedArticle.value.summary || '',
      video_url: '',
      external_links: [],
      estimated_hours: 1,
      is_free: false
    })

    toastSuccess('文章已导入为章节')
    showImportModal.value = false
    selectedArticle.value = null
    await loadChapters(currentPath.value.id)
    loadList()
  } catch (error: any) {
    toastError(error.message || '导入失败')
  } finally {
    chapterSubmitting.value = false
  }
}

const handleSaveChapter = async () => {
  if (!chapterFormData.title.trim()) {
    toastError('请输入章节标题')
    return
  }
  if (!currentPath.value) return

  chapterSubmitting.value = true
  try {
    if (editingChapter.value) {
      await adminApi.chapter.update(editingChapter.value.id, {
        title: chapterFormData.title,
        description: chapterFormData.description || '',
        content_type: chapterFormData.content_type,
        content: chapterFormData.content || '',
        video_url: chapterFormData.video_url || '',
        external_links: chapterFormData.external_links || [],
        order_index: chapterFormData.order_index,
        estimated_hours: chapterFormData.estimated_hours || 1,
        is_free: Boolean(chapterFormData.is_free)
      })
      toastSuccess('章节已更新')
    } else {
      await adminApi.chapter.create(currentPath.value.id, {
        title: chapterFormData.title,
        description: chapterFormData.description || '',
        content_type: chapterFormData.content_type,
        content: chapterFormData.content || '',
        video_url: chapterFormData.video_url || '',
        external_links: chapterFormData.external_links || [],
        estimated_hours: chapterFormData.estimated_hours || 1,
        is_free: Boolean(chapterFormData.is_free)
      })
      toastSuccess('章节已添加')
    }
    showChapterForm.value = false
    editingChapter.value = null
    await loadChapters(currentPath.value.id)
    loadList()
  } catch (error: any) {
    toastError(error.message || '保存失败')
  } finally {
    chapterSubmitting.value = false
  }
}

const handleDeleteChapter = async (id: number) => {
  if (!confirm('确定要删除这个章节吗？')) return
  try {
    await adminApi.chapter.delete(id)
    toastSuccess('章节已删除')
    if (currentPath.value) {
      await loadChapters(currentPath.value.id)
      loadList()
    }
  } catch (error: any) {
    toastError(error.message || '删除失败')
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
.courses-content {
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

/* Create Button */
.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #fbbf24 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
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

.btn-create svg {
  width: 20px;
  height: 20px;
}

.btn-create:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 24px rgba(245, 158, 11, 0.5),
    0 0 32px rgba(245, 158, 11, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
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

.stat-published .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-draft .stat-icon {
  background: linear-gradient(135deg, var(--accent-green) 0%, #38f9d7 100%);
  opacity: 0.8;
}

.stat-featured .stat-icon {
  background: linear-gradient(135deg, var(--accent-pink) 0%, #f472b6 100%);
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

/* Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.course-card {
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

.course-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0;
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.5rem;
}

.card-badges {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  align-items: flex-end;
}

.badge-featured {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(234, 179, 8, 0.15);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 6px;
  color: var(--accent-gold);
  font-size: 0.7rem;
  font-weight: 600;
}

.badge-featured svg {
  width: 10px;
  height: 10px;
}

.badge-status {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-status.published {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.badge-status.draft {
  background: rgba(255, 255, 255, 0.08);
  color: #c0c0cc;
}

.card-body {
  padding: 1rem 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.375rem 0;
}

.card-desc {
  font-size: 0.8125rem;
  color: #c0c0cc;
  margin: 0 0 0.875rem 0;
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

.meta-item.difficulty.beginner {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.meta-item.difficulty.intermediate {
  background: rgba(234, 179, 8, 0.1);
  color: var(--accent-gold);
}

.meta-item.difficulty.advanced {
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent-red);
}

.card-footer {
  padding: 0.875rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
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

.action-publish:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.action-unpublish:hover {
  background: rgba(234, 179, 8, 0.15);
  border-color: rgba(234, 179, 8, 0.3);
  color: var(--accent-gold);
}

.action-feature:hover {
  background: rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.3);
  color: #ec4899;
}

.action-feature.active {
  background: rgba(236, 72, 153, 0.2);
  border-color: #ec4899;
  color: #ec4899;
}

.action-chapters:hover {
  background: rgba(79, 172, 254, 0.15);
  border-color: rgba(79, 172, 254, 0.3);
  color: #4facfe;
}

.action-edit:hover {
  background: rgba(234, 179, 8, 0.15);
  border-color: rgba(234, 179, 8, 0.3);
  color: var(--accent-gold);
}

.action-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--accent-red);
}

/* Loading State */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
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
  margin: 0 0 1.5rem 0;
}

.btn-empty-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-empty-create svg {
  width: 16px;
  height: 16px;
}

.btn-empty-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
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

/* Modal Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.required {
  color: var(--accent-red);
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #6b7280;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.input-error,
.input-error:focus {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.08) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238b8b95' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.625rem center;
  padding-right: 2rem;
  cursor: pointer;
}

.form-select option,
.form-select optgroup {
  background: #1a1a2e;
  color: #ffffff;
}

.form-textarea {
  resize: vertical;
  min-height: 70px;
}

.icon-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.icon-option {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-option:hover {
  background: rgba(255, 255, 255, 0.08);
}

.icon-option.selected {
  border-color: var(--accent-gold);
  background: rgba(234, 179, 8, 0.15);
}

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

/* Chapters Panel */
.chapters-panel {
  max-height: 350px;
  overflow-y: auto;
}

.chapters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chapters-count {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.btn-add-chapter,
.btn-import-article {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-add-chapter {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: var(--accent-green);
}

.btn-add-chapter:hover {
  background: rgba(34, 197, 94, 0.15);
}

.btn-add-chapter svg,
.btn-import-article svg {
  width: 14px;
  height: 14px;
}

.btn-import-article {
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.2);
  color: #4facfe;
}

.btn-import-article:hover {
  background: rgba(79, 172, 254, 0.15);
}

.chapters-loading {
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

.chapters-empty {
  padding: 2.5rem;
  text-align: center;
  color: var(--text-secondary);
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  transition: all 0.15s ease;
}

.chapter-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.chapter-order {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chapter-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.chapter-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
}

.chapter-meta {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.chapter-actions {
  display: flex;
  gap: 0.25rem;
}

.btn-icon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon-action svg {
  width: 12px;
  height: 12px;
}

.btn-icon-action:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.btn-icon-action.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: var(--accent-red);
}

.chapter-form {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.chapter-form-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.875rem 0;
}

.chapter-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.875rem;
}

.checkbox {
  margin-right: 0.375rem;
  accent-color: var(--accent-gold);
}

/* Import Modal */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-wrapper .search-icon {
  position: absolute;
  left: 0.875rem;
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.search-wrapper .search-input {
  flex: 1;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.8125rem;
}

.search-wrapper .btn-search {
  padding: 0.625rem 0.875rem;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.import-articles-panel {
  max-height: 400px;
  overflow-y: auto;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.article-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.article-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.article-item.selected {
  background: rgba(79, 172, 254, 0.08);
  border-color: rgba(79, 172, 254, 0.3);
}

.article-radio {
  flex-shrink: 0;
  padding-top: 0.125rem;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.15s ease;
}

.article-item.selected .radio-circle {
  border-color: #4facfe;
  background: #4facfe;
  box-shadow: inset 0 0 0 3px var(--bg-elevated);
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.article-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
}

.article-summary {
  font-size: 0.7rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive */
@media (max-width: 768px) {
  .courses-content {
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

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>