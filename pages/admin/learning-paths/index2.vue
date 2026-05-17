<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">学习路径管理</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span>+</span>
        <span>创建学习路径</span>
      </button>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <!-- 搜索 -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索学习路径..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 难度筛选 -->
        <select
          v-model="filterDifficulty"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">全部难度</option>
          <option value="beginner">入门</option>
          <option value="intermediate">进阶</option>
          <option value="advanced">高级</option>
        </select>

        <!-- 状态筛选 -->
        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">全部状态</option>
          <option :value="0">待发布</option>
          <option :value="1">已发布</option>
          <option :value="2">已删除</option>
        </select>

        <!-- 搜索按钮 -->
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学习路径</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">章节数</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推荐</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in list" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ item.icon || '📚' }}</span>
                <div>
                  <div class="font-medium text-gray-900">{{ item.title }}</div>
                  <div class="text-sm text-gray-500">{{ item.description?.slice(0, 50) }}{{ item.description?.length > 50 ? '...' : '' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <UiAdminDifficultyBadge :difficulty="item.difficulty" />
            </td>
            <td class="px-6 py-4 text-gray-900">{{ item.chapter_count }}</td>
            <td class="px-6 py-4">
              <UiAdminStatusBadge :status="item.status" />
            </td>
            <td class="px-6 py-4">
              <button
                @click="toggleFeatured(item)"
                :class="[
                  'text-2xl transition-colors',
                  item.is_featured ? 'text-yellow-500' : 'text-gray-300'
                ]"
              >
                ★
              </button>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(item.created_at) }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="`/admin/learning-paths/${item.id}`"
                  class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  编辑
                </NuxtLink>
                <NuxtLink
                  :to="`/admin/learning-paths/${item.id}/chapters`"
                  class="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                >
                  章节
                </NuxtLink>
                <button
                  v-if="item.status === 0"
                  @click="handlePublish(item.id)"
                  class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  发布
                </button>
                <button
                  v-if="item.status === 1"
                  @click="handleUnpublish(item.id)"
                  class="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded"
                >
                  下架
                </button>
                <button
                  v-if="item.status !== 2"
                  @click="handleDelete(item.id)"
                  class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 空状态 -->
      <UiAdminEmptyState
        v-if="list.length === 0 && !loading"
        icon="📚"
        title="暂无学习路径"
        description="点击上方按钮创建第一个学习路径"
      />

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-gray-500">加载中...</div>
      </div>
    </div>

    <!-- 分页 -->
    <UiAdminPagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- 创建/编辑 Modal -->
    <UiAdminModal v-model="showCreateModal" title="创建学习路径">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">图标</label>
          <input
            v-model="formData.icon"
            type="text"
            placeholder="例如: 🐍"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">难度 *</label>
            <select
              v-model="formData.difficulty"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="beginner">入门</option>
              <option value="intermediate">进阶</option>
              <option value="advanced">高级</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">难度标签</label>
            <input
              v-model="formData.level_label"
              type="text"
              placeholder="例如: 入门"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预计天数</label>
            <input
              v-model.number="formData.estimated_days"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预计小时数</label>
            <input
              v-model.number="formData.estimated_hours"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">封面图片 URL</label>
          <input
            v-model="formData.cover_image"
            type="url"
            placeholder="https://..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex items-center">
          <input
            v-model="formData.is_featured"
            type="checkbox"
            id="is_featured"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="is_featured" class="ml-2 text-sm text-gray-700">设为推荐</label>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="handleCreate"
            :disabled="submitting"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? '创建中...' : '创建' }}
          </button>
        </div>
      </template>
    </UiAdminModal>

    <!-- 删除确认 -->
    <UiAdminConfirmDialog
      v-model="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这个学习路径吗？此操作不可撤销。"
      confirm-text="删除"
      confirm-type="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { LearningPathListItem, LearningPathDifficulty, LearningPathStatus, LearningPathFormData } from '~/types/admin'

const { toastSuccess, toastError } = useToast()

// 列表数据
const list = ref<LearningPathListItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(1)
const total = ref(0)

// 筛选
const searchQuery = ref('')
const filterDifficulty = ref('')
const filterStatus = ref<LearningPathStatus | ''>('')

// 创建表单
const showCreateModal = ref(false)
const submitting = ref(false)
const formData = reactive<LearningPathFormData>({
  title: '',
  icon: '',
  description: '',
  difficulty: 'beginner',
  level_label: '',
  estimated_days: undefined,
  estimated_hours: undefined,
  cover_image: '',
  is_featured: false
})

// 删除确认
const showDeleteConfirm = ref(false)
const deleteId = ref<number | null>(null)

// 加载列表
const loadList = async () => {
  loading.value = true
  try {
    const { adminApi } = await import('~/app/lib/api')
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterDifficulty.value) params.difficulty = filterDifficulty.value
    if (filterStatus.value !== '') params.status = filterStatus.value

    const data = await adminApi.learningPath.getList(params)
    if (data) {
      list.value = data.list || []
      total.value = data.total || 0
      totalPages.value = Math.ceil((data.total || 0) / pageSize.value)
    }
  } catch (error: any) {
    toastError(error.message || '加载失败')
    console.error('Failed to load list:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadList()
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadList()
}

// 创建
const handleCreate = async () => {
  submitting.value = true
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.create(formData)
    toastSuccess('创建成功')
    showCreateModal.value = false
    resetForm()
    loadList()
  } catch (error: any) {
    toastError(error.message || '创建失败')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.title = ''
  formData.icon = ''
  formData.description = ''
  formData.difficulty = 'beginner'
  formData.level_label = ''
  formData.estimated_days = undefined
  formData.estimated_hours = undefined
  formData.cover_image = ''
  formData.is_featured = false
}

// 发布
const handlePublish = async (id: number) => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.publish(id)
    toastSuccess('发布成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '发布失败')
  }
}

// 下架
const handleUnpublish = async (id: number) => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.unpublish(id)
    toastSuccess('下架成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '下架失败')
  }
}

// 设置推荐
const toggleFeatured = async (item: LearningPathListItem) => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.setFeatured(item.id, !item.is_featured)
    toastSuccess(item.is_featured ? '取消推荐成功' : '设置推荐成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  }
}

// 删除
const handleDelete = (id: number) => {
  deleteId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.delete(deleteId.value)
    toastSuccess('删除成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '删除失败')
  } finally {
    deleteId.value = null
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 监听筛选变化
watch([filterDifficulty, filterStatus], () => {
  handleSearch()
})

onMounted(() => {
  loadList()
})
</script>
