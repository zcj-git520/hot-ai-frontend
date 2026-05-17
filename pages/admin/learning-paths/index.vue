<template>
  <div class="lp-page">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">课程管理</h1>
          <p class="page-subtitle">创建、编辑和管理平台课程</p>
        </div>
        <button @click="openCreateModal" class="btn-create">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6v12m6-6H6"/>
          </svg>
          <span>新建课程</span>
        </button>
      </div>
    </header>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ totalCount }}</span>
        <span class="stat-label">全部</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value published">{{ publishedCount }}</span>
        <span class="stat-label">已发布</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value draft">{{ draftCount }}</span>
        <span class="stat-label">草稿</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ featuredCount }}</span>
        <span class="stat-label">推荐</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索课程标题..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      <select v-model="filterDifficulty" class="filter-select" @change="handleSearch">
        <option value="">全部难度</option>
        <option value="beginner">入门</option>
        <option value="intermediate">进阶</option>
        <option value="advanced">高级</option>
      </select>
      <select v-model="filterStatus" class="filter-select" @change="handleSearch">
        <option value="">全部状态</option>
        <option value="0">草稿</option>
        <option value="1">已发布</option>
      </select>
      <button @click="handleSearch" class="btn-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="skeleton-list">
          <div class="skeleton-item" v-for="i in 5" :key="i"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!loading && list.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <p class="empty-text">暂无课程</p>
        <p class="empty-hint">点击上方「新建课程」开始创建</p>
      </div>

      <!-- Table -->
      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="th-main">课程信息</th>
            <th>难度</th>
            <th>状态</th>
            <th>章节</th>
            <th>时长</th>
            <th class="th-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id" class="table-row">
            <td class="td-main">
              <div class="path-info">
                <div class="path-icon" :style="{ background: getIconBg(item.icon) }">
                  {{ item.icon || '📚' }}
                </div>
                <div class="path-details">
                  <div class="path-title-row">
                    <span class="path-title">{{ item.title }}</span>
                    <span v-if="item.is_featured" class="featured-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      推荐
                    </span>
                  </div>
                  <span class="path-desc">{{ item.description || '暂无描述' }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="difficulty-badge" :class="item.difficulty">
                {{ getDifficultyText(item.difficulty) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="item.status === 1 ? 'published' : 'draft'">
                {{ item.status === 1 ? '已发布' : '草稿' }}
              </span>
            </td>
            <td class="chapters-count">{{ item.chapter_count || 0 }}</td>
            <td class="time-info">
              <span>{{ item.estimated_hours || 0 }}h</span>
            </td>
            <td class="td-actions">
              <div class="action-buttons">
                <!-- Publish/Unpublish -->
                <button
                  v-if="item.status !== 1"
                  @click="handlePublish(item.id)"
                  class="btn-action btn-publish"
                  title="发布"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <button
                  v-else
                  @click="handleUnpublish(item.id)"
                  class="btn-action btn-unpublish"
                  title="下架"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5m7-7l-7 7 7 7"/>
                  </svg>
                </button>

                <!-- Featured Toggle -->
                <button
                  @click="handleToggleFeatured(item)"
                  class="btn-action"
                  :class="item.is_featured ? 'btn-featured-active' : 'btn-featured'"
                  :title="item.is_featured ? '取消推荐' : '设为推荐'"
                >
                  <svg viewBox="0 0 24 24" :fill="item.is_featured ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>

                <!-- Chapters -->
                <button
                  @click="openChaptersModal(item)"
                  class="btn-action btn-chapters"
                  title="管理章节"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </button>

                <!-- Edit -->
                <button @click="openEditModal(item)" class="btn-action btn-edit" title="编辑">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>

                <!-- Delete -->
                <button @click="handleDelete(item.id)" class="btn-action btn-delete" title="删除">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <UiAdminModal v-model="showFormModal" :title="isEditing ? '编辑课程' : '创建课程'" size="lg">
      <form @submit.prevent="handleSubmit" class="form-grid">
        <div class="form-group full-width">
          <label class="form-label">课程标题 <span class="required">*</span></label>
          <input v-model="formData.title" class="form-input" placeholder="例如：Python入门指南" required />
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
import { ref, reactive, computed, onMounted, watch } from 'vue'

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

// Form modal
const showFormModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
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
  is_featured: false
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

// Load list - use internal API route instead of going to /admin directly
const loadList = async () => {
  loading.value = true
  try {
    // Use absolute URL to avoid any proxy issues
    const response = await fetch('/api/admin/learning-paths?page=' + currentPage.value + '&page_size=' + pageSize)
    const result = await response.json()
    if (result.data) {
      list.value = result.data.list || []
      totalCount.value = result.data.total || 0
    }
  } catch (error: any) {
    toastError(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadList()
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
    is_featured: item.is_featured,
    sort_order: item.sort_order || 0
  })
  learningGoalsInput.value = ''
  targetAudienceInput.value = ''
  showFormModal.value = true
}

// Submit form
const handleSubmit = async () => {
  if (!formData.title.trim()) {
    toastError('请输入课程标题')
    return
  }

  // Parse comma-separated fields
  if (learningGoalsInput.value) {
    formData.learning_goals = learningGoalsInput.value.split(',').map(s => s.trim()).filter(Boolean)
  }
  if (targetAudienceInput.value) {
    formData.target_audience = targetAudienceInput.value.split(',').map(s => s.trim()).filter(Boolean)
  }

  submitting.value = true
  try {
    const url = isEditing.value && editingId.value
      ? `/api/admin/learning-paths/${editingId.value}`
      : '/api/admin/learning-paths'
    const method = isEditing.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (!response.ok) throw new Error('操作失败')

    toastSuccess(isEditing.value ? '更新成功' : '创建成功')
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
    const response = await fetch(`/api/admin/learning-paths/${id}/publish`, { method: 'POST' })
    if (!response.ok) throw new Error('发布失败')
    toastSuccess('发布成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '发布失败')
  }
}

// Unpublish
const handleUnpublish = async (id: number) => {
  try {
    const response = await fetch(`/api/admin/learning-paths/${id}/unpublish`, { method: 'POST' })
    if (!response.ok) throw new Error('下架失败')
    toastSuccess('下架成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '下架失败')
  }
}

// Toggle featured
const handleToggleFeatured = async (item: LearningPathListItem) => {
  try {
    const response = await fetch(`/api/admin/learning-paths/${item.id}/feature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !item.is_featured })
    })
    if (!response.ok) throw new Error('操作失败')
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
    const response = await fetch(`/api/admin/learning-paths/${deleteId.value}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('删除失败')
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
    const response = await fetch(`/api/admin/learning-paths/${pathId}/chapters`)
    const result = await response.json()
    // API returns data as array directly
    chapters.value = Array.isArray(result.data) ? result.data : (result.data?.list || [])
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
    const query = articleSearchQuery.value ? `&keyword=${encodeURIComponent(articleSearchQuery.value)}` : ''
    const response = await fetch(`/api/articles?page=1&page_size=20${query}`)
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
    const response = await fetch(`/api/admin/learning-paths/${currentPath.value.id}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: selectedArticle.value.title,
        description: selectedArticle.value.summary || '',
        content_type: 'article',
        content: selectedArticle.value.content || selectedArticle.value.summary || '',
        video_url: '',
        external_links: [],
        estimated_hours: 1,
        is_free: false
      })
    })

    if (!response.ok) throw new Error('导入失败')

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
    const url = editingChapter.value
      ? `/api/admin/chapters/${editingChapter.value.id}`
      : `/api/admin/learning-paths/${currentPath.value.id}/chapters`
    const method = editingChapter.value ? 'PUT' : 'POST'

    const submitData = {
      title: chapterFormData.title,
      description: chapterFormData.description || '',
      content_type: chapterFormData.content_type,
      content: chapterFormData.content || '',
      video_url: chapterFormData.video_url || '',
      external_links: chapterFormData.external_links || [],
      order_index: chapterFormData.order_index,
      estimated_hours: chapterFormData.estimated_hours || 1,
      is_free: Boolean(chapterFormData.is_free)
    }
    console.log('Submitting chapter:', JSON.stringify(submitData))
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    })
    console.log('Response status:', response.status, 'ok:', response.ok)

    if (!response.ok) throw new Error('保存失败')

    toastSuccess(editingChapter.value ? '章节已更新' : '章节已添加')
    showChapterForm.value = false
    editingChapter.value = null
    await loadChapters(currentPath.value.id)
    loadList() // Refresh to update chapter count
  } catch (error: any) {
    toastError(error.message || '保存失败')
  } finally {
    chapterSubmitting.value = false
  }
}

const handleDeleteChapter = async (id: number) => {
  if (!confirm('确定要删除这个章节吗？')) return
  try {
    const response = await fetch(`/api/admin/chapters/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('删除失败')
    toastSuccess('章节已删除')
    if (currentPath.value) {
      await loadChapters(currentPath.value.id)
      loadList()
    }
  } catch (error: any) {
    toastError(error.message || '删除失败')
  }
}

onMounted(loadList)
</script>

<style scoped>
.lp-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: pageIn 0.4s ease-out;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Header */
.page-header { margin-bottom: 1.5rem; }

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.page-title {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0 0 0.375rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b6b73;
  margin: 0;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-create svg {
  width: 18px;
  height: 18px;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(234, 179, 8, 0.35);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f5f5;
}

.stat-value.published { color: #34d399; }
.stat-value.draft { color: #eab308; }

.stat-label {
  font-size: 0.75rem;
  color: #6b6b73;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.06);
}

/* Filters */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b6b73;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: #1e1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #f5f5f5;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input::placeholder { color: #6b6b73; }
.search-input:focus {
  outline: none;
  border-color: #eab308;
  background: #252530;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.15);
}

.filter-select {
  position: relative;
  padding: 0.75rem 2.75rem 0.75rem 1rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  transition: all 0.2s ease;
}

.filter-select:hover {
  background-color: #111;
  border-color: rgba(255, 255, 255, 0.25);
}

.filter-select:focus {
  outline: none;
  border-color: #eab308;
  background-color: #111;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.15), 0 0 0 1px rgba(234, 179, 8, 0.3) inset;
}

.filter-select option {
  background: #000;
  color: #fff;
  padding: 0.5rem;
}

.btn-search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-search svg { width: 1.125rem; height: 1.125rem; }
.btn-search:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
}

/* Table */
.table-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.loading-state { padding: 2rem; }

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-item {
  height: 64px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%);
  background-size: 200% 100%;
  border-radius: 10px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #3f3f46;
}

.empty-icon svg { width: 100%; height: 100%; }
.empty-text { font-size: 1rem; color: #a0a0a8; margin: 0 0 0.5rem 0; }
.empty-hint { font-size: 0.875rem; color: #6b6b73; margin: 0; }

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b6b73;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.th-main { width: 40%; }
.th-actions { width: 200px; text-align: right; }

.table-row {
  transition: background 0.15s ease;
}

.table-row:hover { background: rgba(255, 255, 255, 0.02); }
.table-row:not(:last-child) td { border-bottom: 1px solid rgba(255, 255, 255, 0.04); }

.data-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
}

/* Path Info */
.path-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.path-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.path-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.path-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.path-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #f5f5f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  flex-shrink: 0;
}

.path-desc {
  font-size: 0.8125rem;
  color: #6b6b73;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badges */
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
}

.difficulty-badge.beginner { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.difficulty-badge.intermediate { background: rgba(234, 179, 8, 0.15); color: #eab308; }
.difficulty-badge.advanced { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
}

.status-badge.published { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.status-badge.draft { background: rgba(255, 255, 255, 0.08); color: #a0a0a8; }

.chapters-count {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 0.9375rem;
  color: #a0a0a8;
}

.time-info {
  font-size: 0.8125rem;
  color: #6b6b73;
}

/* Actions */
.td-actions { text-align: right; }

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #a0a0a8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-action svg { width: 1rem; height: 1rem; }

.btn-action:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f5f5f5;
}

.btn-publish:hover {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.btn-unpublish:hover {
  background: rgba(234, 179, 8, 0.15);
  border-color: rgba(234, 179, 8, 0.3);
  color: #eab308;
}

.btn-featured:hover {
  background: rgba(234, 179, 8, 0.15);
  border-color: rgba(234, 179, 8, 0.3);
  color: #eab308;
}

.btn-featured-active {
  background: rgba(234, 179, 8, 0.2);
  border-color: #eab308;
  color: #eab308;
}

.btn-chapters:hover {
  background: rgba(79, 172, 254, 0.15);
  border-color: rgba(79, 172, 254, 0.3);
  color: #4facfe;
}

.btn-edit:hover {
  background: rgba(234, 179, 8, 0.15);
  border-color: rgba(234, 179, 8, 0.3);
  color: #eab308;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #a0a0a8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn svg { width: 1.125rem; height: 1.125rem; }
.page-btn:not(:disabled):hover { background: rgba(255, 255, 255, 0.08); color: #f5f5f5; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 0.875rem; color: #a0a0a8; font-variant-numeric: tabular-nums; }

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width { grid-column: 1 / -1; }

.form-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #a0a0a8;
}

.required { color: #ef4444; }

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem 1rem;
  background: #1e1e26;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f5f5f5;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input::placeholder,
.form-textarea::placeholder { color: #6b6b73; }

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #eab308;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.15), 0 0 0 1px rgba(234, 179, 8, 0.3) inset;
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b6b73' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  cursor: pointer;
  padding-right: 2.75rem;
}

.form-select:hover {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.form-select option {
  background: #1e1e26;
  color: #f5f5f5;
  padding: 0.5rem;
}

.form-textarea { resize: vertical; min-height: 80px; }

.icon-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.icon-option {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-option:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
}

.icon-option.selected {
  border-color: #eab308;
  background: rgba(234, 179, 8, 0.1);
}

/* Chapters Panel */
.chapters-panel {
  max-height: 400px;
  overflow-y: auto;
}

.chapters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chapters-count {
  font-size: 0.875rem;
  color: #6b6b73;
}

.btn-add-chapter {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: rgba(52, 211, 153, 0.15);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 8px;
  color: #34d399;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-add-chapter svg { width: 16px; height: 16px; }
.btn-add-chapter:hover { background: rgba(52, 211, 153, 0.25); }

.chapters-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #6b6b73;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #eab308;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.chapters-empty {
  padding: 3rem;
  text-align: center;
  color: #6b6b73;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  transition: all 0.15s ease;
}

.chapter-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.chapter-order {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #6b6b73;
  font-size: 0.8125rem;
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #f5f5f5;
}

.chapter-meta {
  font-size: 0.75rem;
  color: #6b6b73;
}

.chapter-actions {
  display: flex;
  gap: 0.375rem;
}

.btn-icon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  border-radius: 6px;
  color: #6b6b73;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon-action svg { width: 14px; height: 14px; }
.btn-icon-action:hover { background: rgba(255, 255, 255, 0.08); color: #f5f5f5; }
.btn-icon-action.btn-delete:hover { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

/* Chapter Form */
.chapter-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.chapter-form-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0 0 1rem 0;
}

.chapter-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.checkbox {
  margin-right: 0.5rem;
  accent-color: #eab308;
}

/* Modal Footer */
.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #a0a0a8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover { background: rgba(255, 255, 255, 0.04); color: #f5f5f5; }

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
}

.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* Import Article Modal */
.btn-import-article {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: rgba(79, 172, 254, 0.15);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 8px;
  color: #4facfe;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-import-article svg { width: 16px; height: 16px; }
.btn-import-article:hover { background: rgba(79, 172, 254, 0.25); }

.import-articles-panel {
  max-height: 500px;
  overflow-y: auto;
}

.import-articles-panel .search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.import-articles-panel .search-icon {
  position: absolute;
  left: 1rem;
  width: 1rem;
  height: 1rem;
  color: #6b6b73;
}

.import-articles-panel .search-input {
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: #1e1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #f5f5f5;
  font-size: 0.875rem;
}

.import-articles-panel .btn-search {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.article-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.article-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.article-item.selected {
  background: rgba(79, 172, 254, 0.1);
  border-color: rgba(79, 172, 254, 0.4);
}

.article-radio {
  flex-shrink: 0;
  padding-top: 0.25rem;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.15s ease;
}

.article-item.selected .radio-circle {
  border-color: #4facfe;
  background: #4facfe;
  box-shadow: inset 0 0 0 3px #1e1e26;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.article-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #f5f5f5;
}

.article-summary {
  font-size: 0.75rem;
  color: #6b6b73;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>