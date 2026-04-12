<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">AI 工具库</h1>
      <p class="text-gray-600">
        汇总最新、最实用的 AI 工具，助你提升工作效率
      </p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 搜索框 -->
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具，例如：ChatGPT、Midjourney..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 类别筛选 -->
        <div class="relative">
          <select
            v-model="selectedCategory"
            class="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">全部类别</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707c.293.293.767.293 1.06 0l.707-.707c.293-.293.293-.767 0-1.06s-.767-.293-1.06 0l-.707.707-1.868-1.868c-.275-.275-.685-.4-.934-.503s-.583-.17-.745-.099s-.28.36-.26.839l1.868 1.868z"/>
            </svg>
          </div>
        </div>

        <!-- 排序 -->
        <div class="relative">
          <select
            v-model="sortBy"
            class="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="popularity">热门排序</option>
            <option value="rating">评分排序</option>
            <option value="update_time">更新时间</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707c.293.293.767.293 1.06 0l.707-.707c.293-.293.293-.767 0-1.06s-.767-.293-1.06 0l-.707.707-1.868-1.868c-.275-.275-.685-.4-.934-.503s-.583-.17-.745-.099s-.28.36-.26.839l1.868 1.868z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具列表 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 mt-2">加载中...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {{ error }}
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.id"
          :to="`/tools/${tool.slug}`"
          class="block"
        >
          <ToolCard :tool="tool" />
        </NuxtLink>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center items-center gap-4 mb-8">
        <button
          @click="currentPage--"
          :disabled="currentPage <= 1"
          class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          上一页
        </button>

        <span class="text-gray-700">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 导入工具类型
import type { Tool, ToolCategory } from '~/types/tool'
import ToolCard from '~/components/ToolCard.vue'

// 定义响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('popularity')
const currentPage = ref(1)
const pageSize = ref(12)
const tools = ref<Tool[]>([])
const categories = ref<ToolCategory[]>([])
const loading = ref(false)
const error = ref('')
const totalPages = ref(1)

// 获取工具类别 - 使用Nuxt 3的API调用方式
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/tools/categories')
    if (response.code === 0 && response.data) {
      categories.value = response.data
    }
  } catch (err) {
    error.value = '获取工具类别失败'
    console.error('获取工具类别失败:', err)
  }
}

// 获取工具列表 - 使用Nuxt 3的API调用方式
const fetchTools = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: any = {
      page: currentPage.value,
      page_size: pageSize.value,
      sort_by: sortBy.value,
      order: 'desc'
    }

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    if (selectedCategory.value) {
      params.category_id = selectedCategory.value
    }

    const response = await $fetch('/api/tools', { query: params })
    if (response.code === 0 && response.data) {
      tools.value = response.data.list || []
      totalPages.value = Math.ceil((response.data.total || 0) / pageSize.value)
    } else {
      error.value = response.message || '获取工具列表失败'
    }
  } catch (err) {
    error.value = '网络错误，获取工具列表失败'
    console.error('获取工具列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 初始化数据
onMounted(() => {
  fetchCategories()
  fetchTools()
})

// 监听搜索和筛选条件变化
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
  fetchTools()
})

// 监听分页变化
watch(currentPage, () => {
  if (currentPage.value >= 1) {
    fetchTools()
  }
})
</script>