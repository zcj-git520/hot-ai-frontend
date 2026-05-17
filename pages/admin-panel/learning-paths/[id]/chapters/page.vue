<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink :to="`/admin/learning-paths/${route.params.id}`" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&#8592;</span>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">章节管理</h1>
        <span v-if="pathTitle" class="text-gray-500">- {{ pathTitle }}</span>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span>&#43;</span>
        <span>添加章节</span>
      </button>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时长</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">免费</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in list" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-900">{{ item.order_index }}</td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ item.title }}</div>
              <div class="text-sm text-gray-500">{{ item.description?.slice(0, 50) }}{{ item.description?.length > 50 ? '...' : '' }}</div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  contentTypeClass(item.content_type)
                ]"
              >
                {{ contentTypeText(item.content_type) }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-900">{{ item.estimated_hours }}h</td>
            <td class="px-6 py-4">
              <span :class="item.is_free ? 'text-green-600' : 'text-gray-400'">
                {{ item.is_free ? '是' : '否' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  item.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ item.status === 1 ? '正常' : '已删除' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  @click="handleEdit(item)"
                  class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  编辑
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
        icon="&#128196;"
        title="暂无章节"
        description="点击上方按钮添加第一个章节"
      />

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-gray-500">加载中...</div>
      </div>
    </div>

    <!-- 创建/编辑 Modal -->
    <UiAdminModal v-model="showCreateModal" :title="editingId ? '编辑章节' : '添加章节'">
      <form @submit.prevent="handleSubmit" class="space-y-4">
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
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            v-model="formData.description"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">内容类型 *</label>
            <select
              v-model="formData.content_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="article">文章</option>
              <option value="video">视频</option>
              <option value="exercise">练习</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预计学习时长(小时)</label>
            <input
              v-model.number="formData.estimated_hours"
              type="number"
              min="0.5"
              step="0.5"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">排序索引</label>
          <input
            v-model.number="formData.order_index"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- 根据内容类型显示不同字段 -->
        <div v-if="formData.content_type === 'article'">
          <label class="block text-sm font-medium text-gray-700 mb-1">文章内容</label>
          <textarea
            v-model="formData.content"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="输入文章内容..."
          ></textarea>
        </div>

        <div v-if="formData.content_type === 'video'">
          <label class="block text-sm font-medium text-gray-700 mb-1">视频 URL</label>
          <input
            v-model="formData.video_url"
            type="url"
            placeholder="https://..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div v-if="formData.content_type === 'article' || formData.content_type === 'video'">
          <label class="block text-sm font-medium text-gray-700 mb-1">外部链接 (JSON 数组)</label>
          <input
            v-model="externalLinksJson"
            type="text"
            placeholder='["https://...", "https://..."]'
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex items-center">
          <input
            v-model="formData.is_free"
            type="checkbox"
            id="is_free"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="is_free" class="ml-2 text-sm text-gray-700">设为免费章节</label>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="handleSubmit"
            :disabled="submitting"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </template>
    </UiAdminModal>

    <!-- 删除确认 -->
    <UiAdminConfirmDialog
      v-model="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这个章节吗？此操作不可撤销。"
      confirm-text="删除"
      confirm-type="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { PathChapterListItem, ChapterContentType } from '~/types/admin'

const route = useRoute()
const { toastSuccess, toastError } = useToast()

const pathId = computed(() => route.params.id)
const pathTitle = ref('')
const list = ref<PathChapterListItem[]>([])
const loading = ref(false)

// 创建/编辑 Modal
const showCreateModal = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const externalLinksJson = ref('')

const formData = reactive({
  title: '',
  description: '',
  content_type: 'article' as ChapterContentType,
  content: '',
  video_url: '',
  estimated_hours: 1,
  order_index: 0,
  is_free: false
})

// 删除确认
const showDeleteConfirm = ref(false)
const deleteId = ref<number | null>(null)

// 加载章节列表
const loadList = async () => {
  loading.value = true
  try {
    const { adminApi } = await import('~/app/lib/api')

    // 加载路径详情获取标题
    if (!pathTitle.value) {
      const pathData = await adminApi.learningPath.getById(pathId.value)
      if (pathData) {
        pathTitle.value = pathData.title
      }
    }

    const data = await adminApi.chapter.getListByPath(pathId.value)
    if (data) {
      list.value = data.list || []
    }
  } catch (error: any) {
    toastError(error.message || '加载失败')
    console.error('Failed to load list:', error)
  } finally {
    loading.value = false
  }
}

// 内容类型文本
const contentTypeText = (type: string) => {
  const map: Record<string, string> = {
    article: '文章',
    video: '视频',
    exercise: '练习'
  }
  return map[type] || type
}

// 内容类型样式
const contentTypeClass = (type: string) => {
  const map: Record<string, string> = {
    article: 'bg-blue-100 text-blue-800',
    video: 'bg-purple-100 text-purple-800',
    exercise: 'bg-green-100 text-green-800'
  }
  return map[type] || 'bg-gray-100 text-gray-800'
}

// 编辑
const handleEdit = (item: PathChapterListItem) => {
  editingId.value = item.id
  formData.title = item.title
  formData.description = item.description || ''
  formData.content_type = item.content_type
  formData.estimated_hours = item.estimated_hours
  formData.order_index = item.order_index
  formData.is_free = item.is_free

  // 加载详情获取更多信息
  loadChapterDetail(item.id)
}

const loadChapterDetail = async (id: number) => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    const data = await adminApi.chapter.getById(id)
    if (data) {
      formData.content = data.content || ''
      formData.video_url = data.video_url || ''
      externalLinksJson.value = data.external_links ? JSON.stringify(data.external_links) : ''
    }
  } catch (error) {
    console.error('Failed to load chapter detail:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  submitting.value = true
  try {
    const { adminApi } = await import('~/app/lib/api')

    const submitData: any = {
      title: formData.title,
      description: formData.description,
      content_type: formData.content_type,
      estimated_hours: formData.estimated_hours,
      order_index: formData.order_index,
      is_free: formData.is_free
    }

    if (formData.content_type === 'article') {
      submitData.content = formData.content
      if (externalLinksJson.value) {
        try {
          submitData.external_links = JSON.parse(externalLinksJson.value)
        } catch {
          submitData.external_links = []
        }
      }
    }

    if (formData.content_type === 'video') {
      submitData.video_url = formData.video_url
      if (externalLinksJson.value) {
        try {
          submitData.external_links = JSON.parse(externalLinksJson.value)
        } catch {
          submitData.external_links = []
        }
      }
    }

    if (editingId.value) {
      await adminApi.chapter.update(editingId.value, submitData)
      toastSuccess('更新成功')
    } else {
      await adminApi.chapter.create(pathId.value, submitData)
      toastSuccess('创建成功')
    }

    closeModal()
    loadList()
  } catch (error: any) {
    toastError(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 关闭 Modal
const closeModal = () => {
  showCreateModal.value = false
  editingId.value = null
  formData.title = ''
  formData.description = ''
  formData.content_type = 'article'
  formData.content = ''
  formData.video_url = ''
  formData.estimated_hours = 1
  formData.order_index = list.value.length
  formData.is_free = false
  externalLinksJson.value = ''
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
    await adminApi.chapter.delete(deleteId.value)
    toastSuccess('删除成功')
    loadList()
  } catch (error: any) {
    toastError(error.message || '删除失败')
  } finally {
    deleteId.value = null
  }
}

onMounted(() => {
  loadList()
})
</script>
