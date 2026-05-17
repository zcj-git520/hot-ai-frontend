<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">管理后台</h1>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">学习路径</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.learningPaths }}</p>
          </div>
          <div class="text-4xl">&#128218;</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">章节总数</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.chapters }}</p>
          </div>
          <div class="text-4xl">&#128196;</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">已发布</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.published }}</p>
          </div>
          <div class="text-4xl">&#9989;</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">待发布</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.draft }}</p>
          </div>
          <div class="text-4xl">&#128221;</div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
      <div class="flex gap-4">
        <NuxtLink
          to="/admin/learning-paths"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          管理学习路径
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref({
  learningPaths: 0,
  chapters: 0,
  published: 0,
  draft: 0
})

onMounted(async () => {
  try {
    const { adminApi } = await import('~/app/lib/api')
    const data = await adminApi.learningPath.getList({ pageSize: 1 })
    if (data) {
      stats.value.learningPaths = data.total || 0
      // 统计已发布和待发布
      const allData = await adminApi.learningPath.getList({ pageSize: 100, status: 1 })
      stats.value.published = allData?.total || 0
      const draftData = await adminApi.learningPath.getList({ pageSize: 100, status: 0 })
      stats.value.draft = draftData?.total || 0
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>
