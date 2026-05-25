<template>
  <div class="professions-content">
    <!-- Header -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">职业管理</h2>
        <p class="section-subtitle">管理职业信息与风险评估</p>
      </div>
      <button @click="openCreateModal" class="btn-create">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新建职业
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card stat-total" @click="clearFilters">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 7h-4a2 2 0 01-2-2V3"/>
              <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/>
              <path d="M12 11v6M9 14h6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">全部职业</span>
          </div>
        </div>

        <div class="stat-card stat-low-risk">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ lowRiskCount }}</span>
            <span class="stat-label">低风险</span>
          </div>
        </div>

        <div class="stat-card stat-medium-risk">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 9v2m0 4h.01"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ mediumRiskCount }}</span>
            <span class="stat-label">中风险</span>
          </div>
        </div>

        <div class="stat-card stat-high-risk">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ highRiskCount }}</span>
            <span class="stat-label">高风险</span>
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
            placeholder="搜索职业名称..."
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
          <option value="入门">入门</option>
          <option value="初级">初级</option>
          <option value="中级">中级</option>
          <option value="高级">高级</option>
          <option value="专家">专家</option>
        </select>

        <select v-model="filterRiskLevel" class="filter-select" @change="handleSearch">
          <option value="">全部风险</option>
          <option value="low">低风险</option>
          <option value="medium">中风险</option>
          <option value="high">高风险</option>
        </select>

        <button @click="handleSearch" class="btn-filter-apply">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          应用筛选
        </button>

        <button v-if="filterDifficulty || filterRiskLevel || searchQuery" @click="clearFilters" class="btn-filter-clear">
          清除筛选
        </button>
      </div>
    </div>

    <!-- Professions List -->
    <div class="professions-section">
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
        <h3 class="empty-title">暂无职业</h3>
        <p class="empty-hint">没有找到匹配的职业信息</p>
      </div>

      <!-- Professions List -->
      <div v-else class="professions-list">
        <div
          v-for="(profession, index) in list"
          :key="profession.id"
          class="profession-card"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="card-header">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 7h-4a2 2 0 01-2-2V3"/>
                <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/>
                <path d="M8 13h8M8 17h5"/>
              </svg>
            </div>
            <div class="card-badges">
              <span class="badge-risk" :class="profession.risk_level">
                {{ getRiskLevelText(profession.risk_level) }}
              </span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ profession.name }}</h3>
            <p class="card-desc">{{ profession.description || '暂无描述' }}</p>

            <div class="card-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ profession.difficulty || '未分类' }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                AI影响: {{ profession.ai_impact || '未知' }}
              </span>
            </div>

            <div class="card-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ formatDate(profession.created_at) }}
            </div>
          </div>

          <div class="card-footer">
            <div class="card-actions">
              <button
                @click="openDetailsModal(profession)"
                class="action-btn action-details"
                title="查看详情"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>

              <button
                @click="openEditModal(profession)"
                class="action-btn action-edit"
                title="编辑"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <button
                @click="openDeleteConfirm(profession)"
                class="action-btn action-delete"
                title="删除"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <path d="M10 11v6M14 11v6"/>
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
    <UiAdminModal v-model="showFormModal" :title="isEditing ? '编辑职业' : '新建职业'" size="lg">
      <div v-if="formLoading" class="modal-loading">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>
      <div v-else class="profession-form">
        <div class="form-section">
          <h4 class="form-section-title">基本信息</h4>
          <div class="form-grid">
            <div class="form-item">
              <label class="form-label">职业名称 *</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="请输入职业名称"
              />
            </div>
            <div class="form-item">
              <label class="form-label">难度等级 *</label>
              <select v-model="formData.difficulty" class="form-select">
                <option value="">请选择难度</option>
                <option value="入门">入门</option>
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
                <option value="专家">专家</option>
              </select>
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">职业描述 *</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              placeholder="请输入职业描述..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h4 class="form-section-title">风险评估</h4>
          <div class="form-grid">
            <div class="form-item">
              <label class="form-label">风险等级 *</label>
              <select v-model="formData.risk_level" class="form-select">
                <option value="">请选择风险等级</option>
                <option value="low">低风险</option>
                <option value="medium">中风险</option>
                <option value="high">高风险</option>
              </select>
            </div>
            <div class="form-item">
              <label class="form-label">AI影响程度 *</label>
              <select v-model="formData.ai_impact" class="form-select">
                <option value="">请选择AI影响</option>
                <option value="极低">极低</option>
                <option value="低">低</option>
                <option value="中等">中等</option>
                <option value="高">高</option>
                <option value="极高">极高</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showFormModal = false" class="btn-cancel">取消</button>
        <button @click="handleSubmit" class="btn-submit">
          {{ isEditing ? '保存修改' : '创建职业' }}
        </button>
      </template>
    </UiAdminModal>

    <!-- Details Modal -->
    <UiAdminModal v-model="showDetailsModal" :title="`职业详情 - ${currentProfession?.name || ''}`" size="lg">
      <div v-if="detailsLoading" class="modal-loading">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>
      <div v-else-if="currentProfession" class="profession-details">
        <div class="detail-section">
          <h4 class="detail-title">基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">职业名称</span>
              <span class="detail-value">{{ currentProfession.name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">难度等级</span>
              <span class="detail-value">{{ currentProfession.difficulty || '未分类' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">AI影响</span>
              <span class="detail-value">{{ currentProfession.ai_impact || '未知' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">风险等级</span>
              <span class="detail-value badge-risk" :class="currentProfession.risk_level">
                {{ getRiskLevelText(currentProfession.risk_level) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ formatDate(currentProfession.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="detail-title">职业描述</h4>
          <p class="detail-description">{{ currentProfession.description || '暂无描述' }}</p>
        </div>
      </div>

      <template #footer>
        <button @click="showDetailsModal = false" class="btn-cancel">关闭</button>
        <button
          @click="openEditModal(currentProfession!); showDetailsModal = false"
          class="btn-submit"
        >
          编辑
        </button>
      </template>
    </UiAdminModal>

    <!-- Delete Confirm Dialog -->
    <UiAdminConfirmDialog
      v-model="showDeleteConfirm"
      title="删除职业"
      :message="`确定要删除职业「${deletingProfession?.name}」吗？此操作不可撤销。`"
      confirm-text="删除"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { professionApi } from '~/app/lib/api'

const { toastSuccess, toastError } = useToast()

// Types
interface ProfessionListItem {
  id: number
  name: string
  description: string
  difficulty: string
  risk_level: 'low' | 'medium' | 'high'
  ai_impact: string
  created_at: string
}

interface ProfessionFormData {
  name: string
  description: string
  difficulty: string
  risk_level: 'low' | 'medium' | 'high' | ''
  ai_impact: string
}

// Mock data for demo
const mockProfessions: ProfessionListItem[] = [
  {
    id: 1,
    name: '数据分析师',
    description: '负责收集、处理和分析数据，为业务决策提供支持。需要掌握SQL、Python、数据可视化等技能。',
    difficulty: '中级',
    risk_level: 'low',
    ai_impact: '高',
    created_at: '2026-05-20T10:30:00Z'
  },
  {
    id: 2,
    name: '机器学习工程师',
    description: '开发和部署机器学习模型，解决复杂的业务问题。需要扎实的数学基础和编程能力。',
    difficulty: '高级',
    risk_level: 'medium',
    ai_impact: '极高',
    created_at: '2026-05-18T09:00:00Z'
  },
  {
    id: 3,
    name: '前端开发工程师',
    description: '开发用户界面，实现交互效果。需要掌握HTML、CSS、JavaScript以及主流框架。',
    difficulty: '初级',
    risk_level: 'low',
    ai_impact: '中等',
    created_at: '2026-05-22T14:30:00Z'
  },
  {
    id: 4,
    name: '传统客服代表',
    description: '处理客户咨询和投诉，提供优质服务支持。',
    difficulty: '入门',
    risk_level: 'high',
    ai_impact: '极高',
    created_at: '2026-05-15T11:00:00Z'
  },
  {
    id: 5,
    name: '内容审核员',
    description: '审核用户生成内容，确保符合平台规范。',
    difficulty: '入门',
    risk_level: 'high',
    ai_impact: '极高',
    created_at: '2026-05-19T16:45:00Z'
  },
  {
    id: 6,
    name: 'AI产品经理',
    description: '负责人工智能产品的规划、设计和迭代，需要深入理解AI技术及其应用场景。',
    difficulty: '高级',
    risk_level: 'low',
    ai_impact: '高',
    created_at: '2026-05-21T08:15:00Z'
  }
]

// List state
const list = ref<ProfessionListItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 12
const totalCount = computed(() => list.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

// Stats
const lowRiskCount = computed(() => list.value.filter(i => i.risk_level === 'low').length)
const mediumRiskCount = computed(() => list.value.filter(i => i.risk_level === 'medium').length)
const highRiskCount = computed(() => list.value.filter(i => i.risk_level === 'high').length)

// Filters
const searchQuery = ref('')
const filterDifficulty = ref('')
const filterRiskLevel = ref('')

// Form modal
const showFormModal = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const formData = ref<ProfessionFormData>({
  name: '',
  description: '',
  difficulty: '',
  risk_level: '',
  ai_impact: ''
})
const editingId = ref<number | null>(null)

// Details modal
const showDetailsModal = ref(false)
const currentProfession = ref<ProfessionListItem | null>(null)
const detailsLoading = ref(false)

// Delete confirm
const showDeleteConfirm = ref(false)
const deletingProfession = ref<ProfessionListItem | null>(null)

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
const getRiskLevelText = (level: string) => {
  const map: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  }
  return map[level] || level
}

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
    const response = await professionApi.getList({ page: currentPage.value, pageSize })
    const result = (response as any)?.data || (response as any) || {}

    if (result?.list && Array.isArray(result.list)) {
      list.value = result.list
    } else if (Array.isArray(result)) {
      list.value = result
    } else {
      list.value = [...mockProfessions]
    }

    // Apply filters locally
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      list.value = list.value.filter(p => p.name.toLowerCase().includes(query))
    }
    if (filterDifficulty.value) {
      list.value = list.value.filter(p => p.difficulty === filterDifficulty.value)
    }
    if (filterRiskLevel.value) {
      list.value = list.value.filter(p => p.risk_level === filterRiskLevel.value)
    }
  } catch (error: any) {
    console.error('[ProfessionsContent] Error loading list:', error)
    list.value = [...mockProfessions]
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
  filterRiskLevel.value = ''
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
  formData.value = {
    name: '',
    description: '',
    difficulty: '',
    risk_level: '',
    ai_impact: ''
  }
  showFormModal.value = true
}

// Open edit modal
const openEditModal = (profession: ProfessionListItem) => {
  isEditing.value = true
  editingId.value = profession.id
  formData.value = {
    name: profession.name,
    description: profession.description,
    difficulty: profession.difficulty,
    risk_level: profession.risk_level,
    ai_impact: profession.ai_impact
  }
  showFormModal.value = true
}

// Handle form submit
const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    toastError('请输入职业名称')
    return
  }
  if (!formData.value.difficulty) {
    toastError('请选择难度等级')
    return
  }
  if (!formData.value.risk_level) {
    toastError('请选择风险等级')
    return
  }
  if (!formData.value.ai_impact) {
    toastError('请选择AI影响程度')
    return
  }

  // Mock create/update
  console.log('[ProfessionsContent] Submit form:', isEditing.value ? 'update' : 'create', formData.value)

  if (isEditing.value && editingId.value) {
    toastSuccess('职业信息已更新')
  } else {
    toastSuccess('职业已创建')
  }

  showFormModal.value = false
  loadList()
}

// Details modal
const openDetailsModal = async (profession: ProfessionListItem) => {
  currentProfession.value = profession
  showDetailsModal.value = true

  detailsLoading.value = true
  try {
    const response = await professionApi.getById(profession.id.toString())
    const result = (response as any)?.data || response
    if (result) {
      currentProfession.value = { ...profession, ...result }
    }
  } catch (error: any) {
    console.error('[ProfessionsContent] Error loading details:', error)
  } finally {
    detailsLoading.value = false
  }
}

// Delete confirm
const openDeleteConfirm = (profession: ProfessionListItem) => {
  deletingProfession.value = profession
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!deletingProfession.value) return

  // Mock delete
  console.log('[ProfessionsContent] Delete profession:', deletingProfession.value.id)
  toastSuccess('职业已删除')

  showDeleteConfirm.value = false
  deletingProfession.value = null
  loadList()
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
.professions-content {
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

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%);
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
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
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

.stat-low-risk .stat-icon {
  background: linear-gradient(135deg, var(--accent-green) 0%, #38f9d7 100%);
}

.stat-medium-risk .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.stat-high-risk .stat-icon {
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

/* Professions List */
.professions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profession-card {
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

.profession-card:hover {
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
  background: linear-gradient(135deg, var(--accent-blue) 0%, #67e8f9 100%);
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

.badge-risk {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-risk.low {
  background: rgba(34, 197, 94, 0.15);
  color: var(--accent-green);
}

.badge-risk.medium {
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-gold);
}

.badge-risk.high {
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

.action-edit:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
  color: var(--accent-purple);
}

.action-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--accent-red);
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

/* Profession Form */
.profession-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
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

.form-select {
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23c0c0cc' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}

.form-select option {
  background: #25253a;
  color: #ffffff;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Profession Details */
.profession-details {
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

/* Responsive */
@media (max-width: 768px) {
  .professions-content {
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

  .profession-card {
    flex-direction: column;
  }

  .card-footer {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>