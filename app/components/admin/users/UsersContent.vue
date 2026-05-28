<template>
  <div class="users-content">
    <!-- Header -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">用户管理</h2>
        <p class="section-subtitle">管理系统用户、角色和操作日志</p>
      </div>
      <button @click="openCreateModal" class="btn-create">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新建用户
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card stat-total" @click="clearFilters">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">全部用户</span>
          </div>
        </div>

        <div class="stat-card stat-admin">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ adminCount }}</span>
            <span class="stat-label">管理员</span>
          </div>
        </div>

        <div class="stat-card stat-user">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ userCount }}</span>
            <span class="stat-label">普通用户</span>
          </div>
        </div>

        <div class="stat-card stat-disabled">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M4.93 4.93l14.14 14.14"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ disabledCount }}</span>
            <span class="stat-label">已禁用</span>
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
            placeholder="搜索用户名..."
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
        <select v-model="filterRole" class="filter-select" @change="handleSearch">
          <option value="">全部角色</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>

        <select v-model="filterStatus" class="filter-select" @change="handleSearch">
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="disabled">已禁用</option>
        </select>

        <button @click="handleSearch" class="btn-filter-apply">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          应用筛选
        </button>

        <button v-if="filterRole || filterStatus || searchQuery" @click="clearFilters" class="btn-filter-clear">
          清除筛选
        </button>
      </div>
    </div>

    <!-- Users List -->
    <div class="users-section">
      <!-- Loading -->
      <div v-if="loading" class="loading-grid">
        <div class="skeleton-card" v-for="i in 6" :key="i">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-line long"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!loading && filteredUsers.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
            <path d="M60 30v60M30 60h60" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            <circle cx="60" cy="60" r="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
          </svg>
        </div>
        <h3 class="empty-title">暂无用户</h3>
        <p class="empty-hint">没有找到匹配的用户</p>
      </div>

      <!-- Users List -->
      <div v-else class="users-list">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="user-card"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="card-avatar">
            <span class="avatar-text">{{ getInitials(user.username) }}</span>
          </div>

          <div class="card-body">
            <div class="card-header">
              <h3 class="card-title">{{ user.username }}</h3>
              <div class="card-badges">
                <span class="badge-role" :class="user.role">
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
                <span class="badge-status" :class="user.status">
                  {{ user.status === 'active' ? '正常' : '已禁用' }}
                </span>
              </div>
            </div>

            <p class="card-email">{{ user.email }}</p>

            <div class="card-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                注册于 {{ formatDate(user.created_at) }}
              </span>
              <span class="meta-item" v-if="user.last_login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                最后登录 {{ formatDate(user.last_login) }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="card-actions">
              <!-- Role Management -->
              <button
                @click="openRoleModal(user)"
                class="action-btn action-role"
                title="修改角色"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              </button>

              <!-- Enable/Disable -->
              <button
                v-if="user.status === 'active'"
                @click="handleDisable(user.id)"
                class="action-btn action-disable"
                title="禁用用户"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M4.93 4.93l14.14 14.14"/>
                </svg>
              </button>

              <button
                v-else
                @click="handleEnable(user.id)"
                class="action-btn action-enable"
                title="启用用户"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </button>

              <button
                @click="openPasswordModal(user)"
                class="action-btn action-password"
                title="修改密码"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </button>

              <!-- View Logs -->
              <button
                @click="openLogsModal(user)"
                class="action-btn action-logs"
                title="操作日志"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <path d="M14 2v6h6"/>
                  <path d="M16 13H8"/>
                  <path d="M16 17H8"/>
                  <path d="M10 9H8"/>
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

    <!-- Role Management Modal -->
    <UiAdminModal v-model="showRoleModal" title="修改用户角色" size="md">
      <div v-if="currentUser" class="role-form">
        <div class="user-info-header">
          <div class="user-avatar-lg">
            <span class="avatar-text">{{ getInitials(currentUser.username) }}</span>
          </div>
          <div class="user-info-text">
            <span class="user-name">{{ currentUser.username }}</span>
            <span class="user-email">{{ currentUser.email }}</span>
          </div>
        </div>

        <div class="role-select-section">
          <label class="role-label">选择角色</label>
          <div class="role-options">
            <label class="role-option" :class="{ active: newRole === 'user' }">
              <input type="radio" v-model="newRole" value="user" />
              <div class="role-option-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="role-name">普通用户</span>
                <span class="role-desc">基本功能访问权限</span>
              </div>
            </label>

            <label class="role-option" :class="{ active: newRole === 'admin' }">
              <input type="radio" v-model="newRole" value="admin" />
              <div class="role-option-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                <span class="role-name">管理员</span>
                <span class="role-desc">完整管理权限</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showRoleModal = false" class="btn-cancel">取消</button>
        <button @click="handleUpdateRole" class="btn-submit btn-role">
          确认修改
        </button>
      </template>
    </UiAdminModal>

    <!-- Logs Modal -->
    <UiAdminModal v-model="showLogsModal" :title="`操作日志 - ${currentUser?.username || ''}`" size="lg">
      <div v-if="logsLoading" class="modal-loading">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-else-if="logs.length === 0" class="logs-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <path d="M14 2v6h6"/>
          <path d="M16 13H8"/>
          <path d="M16 17H8"/>
          <path d="M10 9H8"/>
        </svg>
        <span>暂无操作记录</span>
      </div>

      <div v-else class="logs-list">
        <div
          v-for="log in logs"
          :key="log.id"
          class="log-item"
        >
          <div class="log-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="log-content">
            <div class="log-header">
              <span class="log-action">{{ log.action }}</span>
              <span class="log-time">{{ formatDateTime(log.created_at) }}</span>
            </div>
            <p class="log-target">目标: {{ log.target }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showLogsModal = false" class="btn-cancel">关闭</button>
      </template>
    </UiAdminModal>

    <!-- Create User Modal -->
    <UiAdminModal v-model="showCreateModal" title="新建用户" size="md">
      <div class="create-form">
        <div class="form-section">
          <h4 class="form-section-title">基本信息</h4>
          <div class="form-item">
            <label class="form-label">邮箱 *</label>
            <input
              v-model="createForm.email"
              type="text"
              class="form-input"
              :class="{ 'input-error': createEmailError }"
              placeholder="请输入邮箱地址"
              @input="createEmailError = ''"
            />
            <span v-if="createEmailError" class="error-text">{{ createEmailError }}</span>
          </div>
          <div class="form-item">
            <label class="form-label">昵称 *</label>
            <input
              v-model="createForm.nickname"
              type="text"
              class="form-input"
              :class="{ 'input-error': createNicknameError }"
              placeholder="请输入用户昵称"
              @input="createNicknameError = ''"
            />
            <span v-if="createNicknameError" class="error-text">{{ createNicknameError }}</span>
          </div>
        </div>
        <div class="form-section">
          <h4 class="form-section-title">账户设置</h4>
          <div class="form-item">
            <label class="form-label">密码 *</label>
            <input
              v-model="createForm.password"
              type="password"
              class="form-input"
              :class="{ 'input-error': createPasswordError }"
              placeholder="请输入密码（至少6位）"
              @input="createPasswordError = ''"
            />
            <span v-if="createPasswordError" class="error-text">{{ createPasswordError }}</span>
          </div>
          <div class="form-item">
            <label class="form-label">角色</label>
            <select v-model="createForm.role" class="form-select">
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>
      </div>

      <template #footer>
        <button type="button" @click="showCreateModal = false" class="btn-cancel">取消</button>
        <button type="button" @click="handleCreate" class="btn-submit">
          创建用户
        </button>
      </template>
    </UiAdminModal>

    <!-- Password Modal -->
    <UiAdminModal v-model="showPasswordModal" title="修改密码" size="md">
      <div v-if="currentUser" class="password-form">
        <div class="user-info-header">
          <div class="user-avatar-lg">
            <span class="avatar-text">{{ getInitials(currentUser.username) }}</span>
          </div>
          <div class="user-info-text">
            <span class="user-name">{{ currentUser.username }}</span>
            <span class="user-email">{{ currentUser.email }}</span>
          </div>
        </div>
        <div class="form-item">
          <label class="form-label">新密码 *</label>
          <input
            v-model="newPassword"
            type="password"
            class="form-input"
            placeholder="请输入新密码（至少6位）"
          />
        </div>
      </div>

      <template #footer>
        <button @click="showPasswordModal = false" class="btn-cancel">取消</button>
        <button @click="handleUpdatePassword" class="btn-submit">
          确认修改
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
interface UserListItem {
  id: number | string
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'disabled'
  created_at: string
  last_login: string
}

interface OperationLog {
  id: number
  user_id: number | string
  action: string
  target: string
  created_at: string
}

// Backend response type (before mapping)
interface BackendUser {
  id: number | string
  username: string  // backend returns username, not nickname
  nickname?: string // fallback in case backend uses nickname
  email?: string
  status: string
  role: string       // backend returns "admin" | "user" as string, not object
  last_login_at?: string
  created_at?: string
}

interface BackendUserListResponse {
  users: BackendUser[]
  total: number
  page: number
  page_size: number
}

// Map backend user to frontend format
const mapBackendUser = (backendUser: BackendUser): UserListItem => {
  // Determine status: backend sends "active", "inactive", or "banned"
  let status: 'active' | 'disabled' = 'active'
  if (backendUser.status === 'inactive' || backendUser.status === 'banned') {
    status = 'disabled'
  }

  return {
    id: backendUser.id,
    username: backendUser.username || backendUser.nickname || '',
    email: backendUser.email || '',
    role: (backendUser.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
    status,
    created_at: backendUser.created_at || '',
    last_login: backendUser.last_login_at || ''
  }
}

// Mock data for demo
const mockUsers: UserListItem[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    created_at: '2026-01-15T10:30:00Z',
    last_login: '2026-05-25T08:00:00Z'
  },
  {
    id: 2,
    username: 'zhang_san',
    email: 'zhangsan@example.com',
    role: 'user',
    status: 'active',
    created_at: '2026-02-20T14:00:00Z',
    last_login: '2026-05-24T16:30:00Z'
  },
  {
    id: 3,
    username: 'li_si',
    email: 'lisi@example.com',
    role: 'user',
    status: 'active',
    created_at: '2026-03-10T09:00:00Z',
    last_login: '2026-05-23T11:00:00Z'
  },
  {
    id: 4,
    username: 'wang_wu',
    email: 'wangwu@example.com',
    role: 'user',
    status: 'disabled',
    created_at: '2026-03-15T11:30:00Z',
    last_login: '2026-04-10T09:00:00Z'
  },
  {
    id: 5,
    username: 'zhao_liu',
    email: 'zhaoliu@example.com',
    role: 'user',
    status: 'active',
    created_at: '2026-04-01T15:00:00Z',
    last_login: '2026-05-25T10:00:00Z'
  },
  {
    id: 6,
    username: 'sun_qi',
    email: 'sunqi@example.com',
    role: 'admin',
    status: 'active',
    created_at: '2026-01-20T08:00:00Z',
    last_login: '2026-05-25T07:30:00Z'
  },
  {
    id: 7,
    username: 'zhou_ba',
    email: 'zhouba@example.com',
    role: 'user',
    status: 'active',
    created_at: '2026-04-15T10:00:00Z',
    last_login: '2026-05-22T14:00:00Z'
  },
  {
    id: 8,
    username: 'wu_jiu',
    email: 'wujiu@example.com',
    role: 'user',
    status: 'disabled',
    created_at: '2026-02-28T13:00:00Z',
    last_login: '2026-03-15T10:00:00Z'
  }
]

const mockLogs: OperationLog[] = [
  {
    id: 1,
    user_id: 1,
    action: '登录系统',
    target: '后台管理系统',
    created_at: '2026-05-25T08:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    action: '修改用户角色',
    target: 'user_id: 3',
    created_at: '2026-05-24T15:30:00Z'
  },
  {
    id: 3,
    user_id: 1,
    action: '禁用用户',
    target: 'user_id: 4',
    created_at: '2026-05-23T10:00:00Z'
  },
  {
    id: 4,
    user_id: 1,
    action: '审核文章',
    target: 'article_id: 5',
    created_at: '2026-05-22T14:00:00Z'
  },
  {
    id: 5,
    user_id: 1,
    action: '删除工具',
    target: 'tool_id: 8',
    created_at: '2026-05-21T09:00:00Z'
  }
]

// List state
const list = ref<UserListItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const totalCount = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

// Stats
const adminCount = computed(() => list.value.filter(u => u.role === 'admin').length)
const userCount = computed(() => list.value.filter(u => u.role === 'user').length)
const disabledCount = computed(() => list.value.filter(u => u.status === 'disabled').length)

// Filters
const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')

// Filtered users
const filteredUsers = computed(() => {
  let result = [...list.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  if (filterRole.value) {
    result = result.filter(u => u.role === filterRole.value)
  }

  if (filterStatus.value) {
    result = result.filter(u => u.status === filterStatus.value)
  }

  return result
})

// Role modal
const showRoleModal = ref(false)
const currentUser = ref<UserListItem | null>(null)
const newRole = ref<'admin' | 'user'>('user')

// Logs modal
const showLogsModal = ref(false)
const logs = ref<OperationLog[]>([])
const logsLoading = ref(false)

// Create user modal
const showCreateModal = ref(false)
const createForm = ref({
  email: '',
  nickname: '',
  password: '',
  role: 'user'
})
const createEmailError = ref('')
const createNicknameError = ref('')
const createPasswordError = ref('')

// Password modal
const showPasswordModal = ref(false)
const newPassword = ref('')

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
const getInitials = (name: string) => {
  return name.slice(0, 2).toUpperCase()
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

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load list
const loadList = async () => {
  loading.value = true
  try {
    console.log('[UsersContent] Loading list from API...')
    const params: any = {
      page: currentPage.value,
      page_size: pageSize
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterRole.value) params.role = filterRole.value
    if (filterStatus.value) params.status = filterStatus.value

    const response = await adminApi.user.getList(params)
    console.log('[UsersContent] API response:', response)

    // Response is already extracted by interceptor (BackendUserListResponse directly)
    const result = response as BackendUserListResponse

    if (result?.users && Array.isArray(result.users)) {
      list.value = result.users.map(mapBackendUser)
      totalCount.value = result.total || result.users.length
      console.log('[UsersContent] Loaded', list.value.length, 'users, total:', totalCount.value)
    } else if (Array.isArray(result)) {
      list.value = (result as BackendUser[]).map(mapBackendUser)
      totalCount.value = list.value.length
    } else {
      console.warn('[UsersContent] Unexpected response format, using mock data')
      list.value = [...mockUsers]
      totalCount.value = mockUsers.length
    }
  } catch (error: any) {
    console.error('[UsersContent] Error loading list:', error)
    toastError('加载用户列表失败')
    // Fall back to mock data on error
    list.value = [...mockUsers]
    totalCount.value = mockUsers.length
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
  filterRole.value = ''
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

// Role management
const openRoleModal = (user: UserListItem) => {
  currentUser.value = user
  newRole.value = user.role
  showRoleModal.value = true
}

const handleUpdateRole = async () => {
  if (!currentUser.value) return

  const userId = currentUser.value.id
  const role = newRole.value

  try {
    console.log('[UsersContent] Updating role for user:', userId, 'to', role)
    await adminApi.user.updateRole(userId, { role })
    toastSuccess(`用户角色已更新为 ${role === 'admin' ? '管理员' : '普通用户'}`)

    // Update local state
    const userIndex = list.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      list.value[userIndex].role = role
    }
  } catch (error: any) {
    console.error('[UsersContent] Error updating role:', error)
    toastError('更新角色失败')
  }

  showRoleModal.value = false
}

// Enable/Disable
const handleDisable = async (id: number | string) => {
  try {
    console.log('[UsersContent] Disabling user:', id)
    await adminApi.user.disable(id)
    toastSuccess('用户已禁用')

    // Update local state
    const userIndex = list.value.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      list.value[userIndex].status = 'disabled'
    }
  } catch (error: any) {
    console.error('[UsersContent] Error disabling user:', error)
    toastError('禁用用户失败')
  }
}

const handleEnable = async (id: number | string) => {
  try {
    console.log('[UsersContent] Enabling user:', id)
    await adminApi.user.enable(id)
    toastSuccess('用户已启用')

    // Update local state
    const userIndex = list.value.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      list.value[userIndex].status = 'active'
    }
  } catch (error: any) {
    console.error('[UsersContent] Error enabling user:', error)
    toastError('启用用户失败')
  }
}

// Logs
const openLogsModal = async (user: UserListItem) => {
  currentUser.value = user
  showLogsModal.value = true
  logsLoading.value = true
  logs.value = []

  try {
    console.log('[UsersContent] Loading logs for user:', user.id)
    const response = await adminApi.user.getLogs(user.id)
    const result = (response as any) || {}

    if (Array.isArray(result)) {
      logs.value = result
    } else {
      // Mock logs filtered by user
      logs.value = mockLogs.filter(log => log.user_id === user.id)
    }
    console.log('[UsersContent] Loaded', logs.value.length, 'logs')
  } catch (error: any) {
    console.error('[UsersContent] Error loading logs:', error)
    toastError('加载操作日志失败')
    // Mock logs filtered by user
    logs.value = mockLogs.filter(log => log.user_id === user.id)
  } finally {
    logsLoading.value = false
  }
}

// Create user
const openCreateModal = () => {
  createForm.value = {
    email: '',
    nickname: '',
    password: '',
    role: 'user'
  }
  showCreateModal.value = true
}

const handleCreate = async () => {
  // Clear previous errors
  createEmailError.value = ''
  createNicknameError.value = ''
  createPasswordError.value = ''

  // Validate email
  const emailTrimmed = createForm.value.email.trim()
  if (!emailTrimmed) {
    createEmailError.value = '请输入邮箱'
    return
  }
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailTrimmed)) {
    createEmailError.value = '邮箱格式不正确'
    return
  }

  if (!createForm.value.nickname.trim()) {
    createNicknameError.value = '请输入昵称'
    return
  }
  if (!createForm.value.password || createForm.value.password.length < 6) {
    createPasswordError.value = '密码至少6位'
    return
  }

  try {
    await adminApi.user.create(createForm.value)
    toastSuccess('用户创建成功')
    showCreateModal.value = false
    loadList()
  } catch (error: any) {
    console.error('[UsersContent] Error creating user:', error)
    toastError(error?.message || '创建用户失败')
  }
}

// Update password
const openPasswordModal = (user: UserListItem) => {
  currentUser.value = user
  newPassword.value = ''
  showPasswordModal.value = true
}

const handleUpdatePassword = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    toastError('密码至少6位')
    return
  }

  if (!currentUser.value) return

  try {
    console.log('[UsersContent] Updating password for user:', currentUser.value.id)
    await adminApi.user.updatePassword(currentUser.value.id, { password: newPassword.value })
    toastSuccess('密码修改成功')
    showPasswordModal.value = false
  } catch (error: any) {
    console.error('[UsersContent] Error updating password:', error)
    toastError(error?.message || '修改密码失败')
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
.users-content {
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

.stat-admin .stat-icon {
  background: linear-gradient(135deg, var(--accent-pink) 0%, #f472b6 100%);
}

.stat-user .stat-icon {
  background: linear-gradient(135deg, var(--accent-blue) 0%, #22d3ee 100%);
}

.stat-disabled .stat-icon {
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

/* Users List */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-card {
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

.user-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-avatar {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-purple) 0%, #a78bfa 100%);
}

.avatar-text {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.card-body {
  flex: 1;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.card-badges {
  display: flex;
  gap: 0.375rem;
}

.badge-role {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-role.admin {
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-purple);
}

.badge-role.user {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
}

.badge-status {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-status.active {
  background: rgba(34, 197, 94, 0.15);
  color: var(--accent-green);
}

.badge-status.disabled {
  background: rgba(239, 68, 68, 0.15);
  color: var(--accent-red);
}

.card-email {
  font-size: 0.8125rem;
  color: #c0c0cc;
  margin: 0;
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

.action-role:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
  color: var(--accent-purple);
}

.action-enable:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  color: var(--accent-green);
}

.action-disable:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--accent-red);
}

.action-logs:hover {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.3);
  color: var(--accent-blue);
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

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 0;
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

/* Role Form */
.role-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-lg {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-purple) 0%, #a78bfa 100%);
  border-radius: 12px;
}

.user-avatar-lg .avatar-text {
  font-size: 1.25rem;
}

.user-info-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.user-email {
  font-size: 0.8125rem;
  color: #c0c0cc;
}

.role-select-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.role-option {
  position: relative;
  cursor: pointer;
}

.role-option input {
  position: absolute;
  opacity: 0;
}

.role-option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.role-option-content svg {
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
}

.role-option-content span {
  display: flex;
  flex-direction: column;
}

.role-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ffffff;
}

.role-desc {
  font-size: 0.75rem;
  color: #c0c0cc;
}

.role-option:hover .role-option-content {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

.role-option.active .role-option-content {
  background: rgba(139, 92, 246, 0.1);
  border-color: var(--accent-purple);
}

.role-option.active .role-option-content svg {
  color: var(--accent-purple);
}

/* Create/Password Form */
.create-form,
.password-form {
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
.form-select {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #6b7280;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.form-input.input-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.form-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.error-text {
  display: block;
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.8125rem;
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

/* Logs List */
.logs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-muted);
}

.logs-empty svg {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
}

.log-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.log-icon svg {
  width: 16px;
  height: 16px;
  color: var(--accent-blue);
}

.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.log-action {
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
}

.log-time {
  font-size: 0.75rem;
  color: #808090;
}

.log-target {
  font-size: 0.8125rem;
  color: #c0c0cc;
  margin: 0;
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

.btn-role {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow:
    0 4px 16px rgba(139, 92, 246, 0.4),
    0 0 24px rgba(139, 92, 246, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .users-content {
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

  .user-card {
    flex-direction: column;
  }

  .card-avatar {
    width: 100%;
    height: 60px;
  }

  .card-footer {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .role-options {
    flex-direction: column;
  }
}
</style>