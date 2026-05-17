<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/learning-paths" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&#8592;</span>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">编辑学习路径</h1>
        <UiAdminStatusBadge v-if="detail" :status="detail.status" />
      </div>
      <div class="flex gap-2">
        <NuxtLink
          :to="`/admin/learning-paths/${route.params.id}/chapters`"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          管理章节
        </NuxtLink>
        <button
          v-if="detail?.status === 0"
          @click="handlePublish"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          发布
        </button>
        <button
          v-if="detail?.status === 1"
          @click="handleUnpublish"
          class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          下架
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-gray-500">加载中...</div>
    </div>

    <!-- 表单 -->
    <div v-else-if="detail" class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
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
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-3 gap-6">
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预计天数</label>
            <input
              v-model.number="formData.estimated_days"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预计小时数</label>
            <input
              v-model.number="formData.estimated_hours"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">学习目标</label>
          <div class="space-y-2">
            <div v-for="(goal, index) in formData.learning_goals" :key="index" class="flex gap-2">
              <input
                v-model="formData.learning_goals[index]"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                @click="removeGoal(index)"
                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                删除
              </button>
            </div>
            <button
              type="button"
              @click="formData.learning_goals.push('')"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              + 添加学习目标
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">目标受众</label>
          <div class="space-y-2">
            <div v-for="(audience, index) in formData.target_audience" :key="index" class="flex gap-2">
              <input
                v-model="formData.target_audience[index]"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                @click="removeAudience(index)"
                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                删除
              </button>
            </div>
            <button
              type="button"
              @click="formData.target_audience.push('')"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              + 添加目标受众
            </button>
          </div>
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

        <div class="flex justify-end gap-3 pt-4 border-t">
          <NuxtLink
            to="/admin/learning-paths"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { LearningPathDetail, LearningPathDifficulty } from '~/types/admin'

const route = useRoute()
const { toastSuccess, toastError } = useToast()

const loading = ref(false)
const submitting = ref(false)
const detail = ref<LearningPathDetail | null>(null)

const formData = reactive({
  title: '',
  icon: '',
  description: '',
  difficulty: 'beginner' as LearningPathDifficulty,
  level_label: '',
  estimated_days: undefined as number | undefined,
  estimated_hours: undefined as number | undefined,
  cover_image: '',
  is_featured: false,
  learning_goals: [] as string[],
  target_audience: [] as string[]
})

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const { adminApi } = await import('~/app/lib/api')
    const data = await adminApi.learningPath.getById(route.params.id)
    if (data) {
      detail.value = data
      // 填充表单
      formData.title = data.title || ''
      formData.icon = data.icon || ''
      formData.description = data.description || ''
      formData.difficulty = data.difficulty || 'beginner'
      formData.level_label = data.level_label || ''
      formData.estimated_days = data.estimated_days
      formData.estimated_hours = data.estimated_hours
      formData.cover_image = data.cover_image || ''
      formData.is_featured = data.is_featured || false
      formData.learning_goals = data.learning_goals ? [...data.learning_goals] : []
      formData.target_audience = data.target_audience ? [...data.target_audience] : []
    }
  } catch (error: any) {
    toastError(error.message || '加载失败')
    console.error('Failed to load detail:', error)
  } finally {
    loading.value = false
  }
}

// 更新
const handleUpdate = async () => {
  submitting.value = true
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.update(route.params.id, formData)
    toastSuccess('保存成功')
    loadDetail()
  } catch (error: any) {
    toastError(error.message || '保存失败')
  } finally {
    submitting.value = false
  }
}

// 发布
const handlePublish = async () => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.publish(route.params.id)
    toastSuccess('发布成功')
    loadDetail()
  } catch (error: any) {
    toastError(error.message || '发布失败')
  }
}

// 下架
const handleUnpublish = async () => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    await adminApi.learningPath.unpublish(route.params.id)
    toastSuccess('下架成功')
    loadDetail()
  } catch (error: any) {
    toastError(error.message || '下架失败')
  }
}

// 删除学习目标
const removeGoal = (index: number) => {
  formData.learning_goals.splice(index, 1)
}

// 删除目标受众
const removeAudience = (index: number) => {
  formData.target_audience.splice(index, 1)
}

onMounted(() => {
  loadDetail()
})
</script>
