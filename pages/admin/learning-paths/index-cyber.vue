<template>
  <div class="courses-page">
    <!-- Animated Background -->
    <div class="bg-effects">
      <div class="bg-mesh"></div>
      <div class="bg-scanlines"></div>
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
    </div>

    <!-- Page Header -->
    <header class="page-header">
      <div class="header-top">
        <NuxtLink to="/admin" class="breadcrumb">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
          <span>管理后台</span>
        </NuxtLink>
        <div class="header-time">{{ currentTime }}</div>
      </div>

      <div class="header-main">
        <div class="header-left">
          <div class="title-group">
            <div class="title-tag">
              <span class="tag-dot"></span>
              <span>SYSTEM ACTIVE</span>
            </div>
            <h1 class="page-title">
              <span class="title-accent">课程</span>管理中心
            </h1>
            <p class="page-subtitle">创建、编辑和管理平台课程内容</p>
          </div>
        </div>

        <div class="header-right">
          <div class="quick-stats">
            <div class="quick-stat">
              <span class="quick-stat-value">{{ totalCount }}</span>
              <span class="quick-stat-label">总课程</span>
            </div>
            <div class="quick-stat-divider"></div>
            <div class="quick-stat">
              <span class="quick-stat-value">{{ publishedCount }}</span>
              <span class="quick-stat-label">已发布</span>
            </div>
          </div>
          <button @click="openCreateModal" class="btn-create">
            <span class="btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </span>
            <span class="btn-text">新建课程</span>
            <span class="btn-shortcut">⌘N</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Stats Section - Cyberpunk Dashboard -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card stat-total" @click="clearFilters">
          <div class="stat-glitch"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
            <div class="stat-icon-scan"></div>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">全部课程</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: 100%"></div>
          </div>
          <div class="stat-decoration">
            <div class="stat-corner stat-corner-tl"></div>
            <div class="stat-corner stat-corner-br"></div>
          </div>
        </div>

        <div class="stat-card stat-published">
          <div class="stat-glitch"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <div class="stat-icon-scan"></div>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ publishedCount }}</span>
            <span class="stat-label">已发布</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill published" :style="{ width: totalCount ? (publishedCount / totalCount * 100) + '%' : '0%' }"></div>
          </div>
          <div class="stat-glow"></div>
          <div class="stat-decoration">
            <div class="stat-corner stat-corner-tl"></div>
            <div class="stat-corner stat-corner-br"></div>
          </div>
        </div>

        <div class="stat-card stat-draft">
          <div class="stat-glitch"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <div class="stat-icon-scan"></div>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ draftCount }}</span>
            <span class="stat-label">草稿</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill draft" :style="{ width: totalCount ? (draftCount / totalCount * 100) + '%' : '0%' }"></div>
          </div>
          <div class="stat-decoration">
            <div class="stat-corner stat-corner-tl"></div>
            <div class="stat-corner stat-corner-br"></div>
          </div>
        </div>

        <div class="stat-card stat-featured">
          <div class="stat-glitch"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <div class="stat-icon-scan"></div>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ featuredCount }}</span>
            <span class="stat-label">精选推荐</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill featured" :style="{ width: totalCount ? (featuredCount / totalCount * 100) + '%' : '0%' }"></div>
          </div>
          <div class="stat-decoration">
            <div class="stat-corner stat-corner-tl"></div>
            <div class="stat-corner stat-corner-br"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters - Futuristic Control Panel -->
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
          <div class="search-scan"></div>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-select-wrapper">
          <select v-model="filterDifficulty" class="filter-select" @change="handleSearch">
            <option value="">全部难度</option>
            <option value="beginner">入门级</option>
            <option value="intermediate">进阶型</option>
            <option value="advanced">高级深入</option>
          </select>
          <div class="select-indicator"></div>
        </div>

        <div class="filter-select-wrapper">
          <select v-model="filterStatus" class="filter-select" @change="handleSearch">
            <option value="">全部状态</option>
            <option value="0">草稿</option>
            <option value="1">已发布</option>
          </select>
          <div class="select-indicator"></div>
        </div>

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

    <!-- Course Grid - Cyberpunk Cards -->
    <div class="courses-section">
      <!-- Loading -->
      <div v-if="loading" class="loading-grid">
        <div class="skeleton-card" v-for="i in 6" :key="i">
          <div class="skeleton-scan"></div>
          <div class="skeleton-content">
            <div class="skeleton-line long"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!loading && list.length === 0" class="empty-state">
        <div class="empty-illustration">
          <div class="empty-icon-wrapper">
            <svg viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
              <path d="M60 30v60M30 60h60" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
              <circle cx="60" cy="60" r="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            </svg>
            <div class="empty-icon-scan"></div>
          </div>
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
          <div class="card-scan"></div>
          <div class="card-header">
            <div class="card-icon" :style="{ background: getIconBg(item.icon) }">
              {{ item.icon || '📚' }}
              <div class="card-icon-glow"></div>
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

          <div class="card-corner card-corner-tl"></div>
          <div class="card-corner card-corner-br"></div>
        </div>
      </div>
    </div>

    <!-- Pagination - Cyberpunk Style -->
    <div v-if="totalPages > 1" class="pagination-section">
      <div class="pagination-info">
        <span class="pagination-label">页码</span>
        <span class="pagination-value">{{ currentPage }}</span>
        <span class="pagination-separator">/</span>
        <span class="pagination-total">{{ totalPages }}</span>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const { toastSuccess, toastError } = useToast()

// Current time for display
const currentTime = ref('')
let timeInterval: ReturnType<typeof setInterval>

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})

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

// Load list
const loadList = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      page_size: String(pageSize)
    })
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (filterDifficulty.value) params.append('difficulty', filterDifficulty.value)
    if (filterStatus.value) params.append('status', filterStatus.value)

    const response = await fetch('/api/admin/learning-paths?' + params.toString())
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

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    })

    if (!response.ok) throw new Error('保存失败')

    toastSuccess(editingChapter.value ? '章节已更新' : '章节已添加')
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
/* Cyberpunk Theme - Dark with Neon Accents */
:root {
  --bg-deep: #0d0d12;
  --bg-surface: #16161e;
  --bg-elevated: #1e1e28;
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-glow: rgba(0, 255, 255, 0.4);
  --text-primary: #ffffff;
  --text-secondary: #b0b0b8;
  --text-muted: #707078;
  --accent-cyan: #00ffff;
  --accent-cyan-dim: #00cccc;
  --accent-magenta: #ff00ff;
  --accent-purple: #a855f7;
  --accent-pink: #ff6b9d;
  --accent-green: #00ff88;
  --accent-red: #ff3366;
  --accent-yellow: #ffff00;
}

/* Page Container */
.courses-page {
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
  background: var(--bg-deep);
  overflow-x: hidden;
}

/* Animated Background */
.bg-effects {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.bg-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 0, 255, 0.03) 0%, transparent 70%);
}

.bg-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(100px); }
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: pulse 4s ease-in-out infinite alternate;
}

.bg-glow-1 {
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%);
}

.bg-glow-2 {
  bottom: -20%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
  animation-delay: -2s;
}

@keyframes pulse {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.1); }
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.35);
  border-radius: 4px;
  color: #00ffff;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.breadcrumb svg {
  width: 14px;
  height: 14px;
}

.breadcrumb:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.header-time {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--accent-cyan);
  opacity: 0.8;
}

.header-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
}

.title-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 2px;
  font-size: 0.625rem;
  font-family: 'Courier New', monospace;
  color: var(--accent-cyan);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.tag-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-cyan);
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.page-title {
  font-family: 'Rajdhani', system-ui, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.title-accent {
  background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-magenta) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
}

.page-subtitle {
  font-size: 1rem;
  color: #b0b0b8;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.quick-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 255, 255, 0.03);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 4px;
}

.quick-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.quick-stat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #00ffff;
  line-height: 1;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.quick-stat-label {
  font-size: 0.625rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.quick-stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.3), transparent);
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  background: linear-gradient(135deg, #00ffff 0%, #00cccc 50%, #ff00ff 100%);
  border: none;
  border-radius: 6px;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
}

.btn-create::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}

.btn-create:hover::before {
  left: 100%;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.btn-icon svg {
  width: 100%;
  height: 100%;
}

.btn-shortcut {
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  font-size: 0.625rem;
  font-weight: 600;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
}

.stat-glitch {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, transparent 40%, rgba(0, 255, 255, 0.03) 50%, transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover .stat-glitch {
  opacity: 1;
  animation: glitch 0.3s ease-out;
}

@keyframes glitch {
  0% { transform: translate(-50%, -50%) translateX(-10px); }
  100% { transform: translate(-50%, -50%) translateX(10px); }
}

.stat-icon {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: iconScan 2s linear infinite;
  opacity: 0;
}

.stat-card:hover .stat-icon-scan {
  opacity: 1;
}

@keyframes iconScan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.stat-total .stat-icon {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 100%);
  color: var(--accent-purple);
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.stat-published .stat-icon {
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.3) 0%, rgba(0, 255, 136, 0.1) 100%);
  color: var(--accent-green);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.stat-draft .stat-icon {
  background: linear-gradient(135deg, rgba(255, 255, 0, 0.3) 0%, rgba(255, 255, 0, 0.1) 100%);
  color: var(--accent-yellow);
  border: 1px solid rgba(255, 255, 0, 0.3);
}

.stat-featured .stat-icon {
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.3) 0%, rgba(255, 107, 157, 0.1) 100%);
  color: var(--accent-pink);
  border: 1px solid rgba(255, 107, 157, 0.3);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #b0b0b8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta));
  transition: width 0.5s ease;
}

.stat-bar-fill.published {
  background: linear-gradient(90deg, var(--accent-green), #00ffaa);
}

.stat-bar-fill.draft {
  background: linear-gradient(90deg, var(--accent-yellow), #ffaa00);
}

.stat-bar-fill.featured {
  background: linear-gradient(90deg, var(--accent-pink), #ff88aa);
}

.stat-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  pointer-events: none;
}

.stat-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--accent-cyan);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover .stat-corner {
  opacity: 1;
}

.stat-corner-tl {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}

.stat-corner-br {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
}

.stat-glow {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0, 255, 136, 0.2) 0%, transparent 70%);
}

/* Filters Section */
.filters-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 18px;
  height: 18px;
  color: var(--accent-cyan);
  pointer-events: none;
  opacity: 0.7;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--bg-elevated);
  border: 2px solid var(--border-subtle);
  border-radius: 6px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #707078;
}

.search-input:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
}

.search-scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  pointer-events: none;
  opacity: 0;
  animation: none;
}

.search-input:focus + .search-scan {
  opacity: 1;
  animation: searchScan 1.5s ease-in-out infinite;
}

@keyframes searchScan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: rgba(255, 51, 102, 0.2);
  color: var(--accent-red);
}

.search-clear svg {
  width: 14px;
  height: 14px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-select-wrapper {
  position: relative;
}

.filter-select {
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  background: var(--bg-elevated);
  border: 2px solid var(--border-subtle);
  border-radius: 6px;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
}

.filter-select:hover {
  border-color: rgba(0, 255, 255, 0.5);
}

.filter-select:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
}

.filter-select option {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.select-indicator {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: var(--accent-cyan);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-select:focus + .select-indicator,
.filter-select:hover + .select-indicator {
  opacity: 1;
}

.btn-filter-apply {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #00ffff;
  border: none;
  border-radius: 6px;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
}

.btn-filter-apply svg {
  width: 18px;
  height: 18px;
}

.btn-filter-apply:hover {
  background: #00ffaa;
  box-shadow: 0 6px 25px rgba(0, 255, 255, 0.4);
  transform: translateY(-2px);
}

.btn-filter-clear {
  padding: 0.875rem 1rem;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter-clear:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

/* Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.course-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardEntrance 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--accent-cyan), var(--accent-magenta));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover {
  border-color: var(--accent-cyan);
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 40px rgba(0, 255, 255, 0.15);
}

.course-card:hover::before {
  opacity: 1;
}

.card-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 255, 255, 0.02) 50%, transparent 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover .card-scan {
  opacity: 1;
  animation: cardScan 2s linear infinite;
}

@keyframes cardScan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
  position: relative;
}

.card-icon {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 1.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-icon-glow {
  position: absolute;
  inset: -5px;
  background: inherit;
  filter: blur(15px);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.course-card:hover .card-icon-glow {
  opacity: 0.5;
}

.card-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.badge-featured {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 107, 157, 0.2);
  border: 1px solid rgba(255, 107, 157, 0.5);
  border-radius: 4px;
  color: #ff6b9d;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-featured svg {
  width: 12px;
  height: 12px;
}

.badge-status {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-status.published {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.4);
}

.badge-status.draft {
  background: rgba(255, 255, 255, 0.1);
  color: #b0b0b8;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-body {
  padding: 1rem 1.5rem;
}

.card-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.card-desc {
  font-size: 0.9375rem;
  color: #b0b0b8;
  margin: 0 0 1rem 0;
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
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.8125rem;
  color: #b0b0b8;
}

.meta-item svg {
  width: 12px;
  height: 12px;
  opacity: 0.7;
}

.meta-item.difficulty.beginner {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.2);
  color: var(--accent-green);
}

.meta-item.difficulty.intermediate {
  background: rgba(255, 255, 0, 0.1);
  border-color: rgba(255, 255, 0, 0.2);
  color: var(--accent-yellow);
}

.meta-item.difficulty.advanced {
  background: rgba(255, 0, 255, 0.1);
  border-color: rgba(255, 0, 255, 0.2);
  color: var(--accent-magenta);
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-subtle);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #b0b0b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-publish:hover {
  background: rgba(0, 255, 136, 0.2);
  border-color: #00ff88;
  color: #00ff88;
}

.action-unpublish:hover {
  background: rgba(255, 255, 0, 0.2);
  border-color: #ffff00;
  color: #ffff00;
}

.action-feature:hover {
  background: rgba(255, 107, 157, 0.2);
  border-color: #ff6b9d;
  color: #ff6b9d;
}

.action-feature.active {
  background: rgba(255, 107, 157, 0.25);
  border-color: #ff6b9d;
  color: #ff6b9d;
}

.action-chapters:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  color: #00ffff;
}

.action-edit:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: #a855f7;
  color: #a855f7;
}

.action-delete:hover {
  background: rgba(255, 51, 102, 0.2);
  border-color: #ff3366;
  color: #ff3366;
}

.card-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover .card-corner {
  opacity: 1;
}

.card-corner-tl {
  top: 8px;
  left: 8px;
  border-top: 2px solid var(--accent-cyan);
  border-left: 2px solid var(--accent-cyan);
}

.card-corner-br {
  bottom: 8px;
  right: 8px;
  border-bottom: 2px solid var(--accent-magenta);
  border-right: 2px solid var(--accent-magenta);
}

/* Loading State */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.skeleton-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.03), transparent);
  animation: skeletonScan 1.5s ease-in-out infinite;
}

@keyframes skeletonScan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.skeleton-line {
  height: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 2px;
}

.skeleton-line.long { width: 80%; }
.skeleton-line.short { width: 50%; }

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
}

.empty-illustration {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  color: var(--text-muted);
}

.empty-icon-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.empty-icon-wrapper svg {
  width: 100%;
  height: 100%;
}

.empty-icon-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  animation: iconScan 2s linear infinite;
}

.empty-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
}

.btn-empty-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: 1px solid var(--accent-cyan);
  border-radius: 4px;
  color: var(--accent-cyan);
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-empty-create svg {
  width: 18px;
  height: 18px;
}

.btn-empty-create:hover {
  background: var(--accent-cyan);
  color: #000;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

/* Pagination */
.pagination-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.pagination-label {
  color: var(--text-muted);
  text-transform: uppercase;
}

.pagination-value {
  color: var(--accent-cyan);
  font-weight: 700;
}

.pagination-separator {
  color: var(--text-muted);
}

.pagination-total {
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn svg {
  width: 16px;
  height: 16px;
}

.page-btn:not(:disabled):hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.page-number.active {
  background: linear-gradient(135deg, #00ffff, #00cccc);
  border-color: #00ffff;
  color: #000000;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
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
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #b0b0b8;
}

.required {
  color: var(--accent-red);
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.875rem 1rem;
  background: var(--bg-elevated);
  border: 2px solid var(--border-subtle);
  border-radius: 6px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #707078;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}

.form-select option {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

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
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid var(--border-subtle);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-option:hover {
  background: rgba(0, 255, 255, 0.1);
  transform: scale(1.05);
}

.icon-option.selected {
  border-color: var(--accent-cyan);
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.btn-submit {
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #00ffff, #00cccc);
  border: none;
  border-radius: 6px;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 255, 255, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  color: var(--text-secondary);
  font-family: 'Courier New', monospace;
}

.btn-add-chapter,
.btn-import-article {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-add-chapter {
  background: rgba(0, 255, 136, 0.15);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: var(--accent-green);
}

.btn-add-chapter:hover {
  background: rgba(0, 255, 136, 0.25);
}

.btn-add-chapter svg,
.btn-import-article svg {
  width: 14px;
  height: 14px;
}

.btn-import-article {
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: var(--accent-cyan);
}

.btn-import-article:hover {
  background: rgba(0, 255, 255, 0.25);
}

.chapters-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--accent-cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chapters-empty {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
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
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  transition: all 0.15s ease;
}

.chapter-item:hover {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.2);
}

.chapter-order {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.2);
  color: var(--accent-cyan);
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
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
  color: var(--text-primary);
}

.chapter-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: 'Courier New', monospace;
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
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon-action svg {
  width: 14px;
  height: 14px;
}

.btn-icon-action:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.btn-icon-action.btn-delete:hover {
  background: rgba(255, 51, 102, 0.15);
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.chapter-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-subtle);
}

.chapter-form-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--accent-cyan);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chapter-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.checkbox {
  margin-right: 0.5rem;
  accent-color: var(--accent-cyan);
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
  left: 1rem;
  width: 1rem;
  height: 1rem;
  color: var(--accent-cyan);
}

.search-wrapper .search-input {
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-wrapper .btn-search {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta));
  border: none;
  border-radius: 4px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
}

.import-articles-panel {
  max-height: 500px;
  overflow-y: auto;
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
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.article-item:hover {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.2);
}

.article-item.selected {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--accent-cyan);
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
  border-color: var(--accent-cyan);
  background: var(--accent-cyan);
  box-shadow: inset 0 0 0 3px var(--bg-elevated);
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
  color: var(--text-primary);
}

.article-summary {
  font-size: 0.75rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .courses-page {
    padding: 1.5rem;
  }

  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: none;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>