<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <LayoutAdminSidebar />

      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">工具审核</h1>

        <!-- 搜索 -->
        <div class="mb-6">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具名称..."
            class="px-4 py-2 border rounded-lg w-64"
            @keyup.enter="fetchPendingTools"
          />
          <button @click="fetchPendingTools" class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">搜索</button>
        </div>

        <!-- 待审核列表 -->
        <div v-if="pendingTools.length === 0" class="text-center text-gray-500 py-12">
          暂无待审核的工具
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="tool in pendingTools"
            :key="tool.id"
            class="bg-white rounded-lg shadow p-6 flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <img v-if="tool.icon" :src="tool.icon" class="w-12 h-12 rounded object-cover" />
              <div v-else class="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">📦</div>
              <div>
                <h3 class="font-semibold">{{ tool.name }}</h3>
                <p class="text-sm text-gray-500">{{ getCategoryName(tool.category_id) }}</p>
                <p class="text-xs text-gray-400 mt-1">提交于: {{ formatDate(tool.submitted_at) }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <NuxtLink
                :to="`/admin/tools/${tool.id}`"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                审核
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > pageSize" class="mt-6 flex justify-center gap-2">
          <button
            @click="changePage(page - 1)"
            :disabled="page <= 1"
            class="px-3 py-1 border rounded"
            :class="{ 'opacity-50': page <= 1 }"
          >
            上一页
          </button>
          <span class="px-3 py-1">{{ page }} / {{ totalPages }}</span>
          <button
            @click="changePage(page + 1)"
            :disabled="page >= totalPages"
            class="px-3 py-1 border rounded"
            :class="{ 'opacity-50': page >= totalPages }"
          >
            下一页
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { adminApi } from '~/lib/api'

const pendingTools = ref([])
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchPendingTools() {
  try {
    const data = await adminApi.tool.getPendingTools({
      page: page.value,
      pageSize: pageSize.value,
      search: searchQuery.value || undefined,
    })
    pendingTools.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取待审核工具失败:', error)
  }
}

function getCategoryName(categoryId: number) {
  return `类别 ${categoryId}`
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function changePage(newPage: number) {
  page.value = newPage
  fetchPendingTools()
}

onMounted(() => {
  fetchPendingTools()
})
</script>