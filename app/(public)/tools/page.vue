<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
        <h1 class="font-tech text-3xl font-bold tracking-wider">AI 工具库</h1>
      </div>
      <p class="text-gray-500 font-mono text-sm ml-4">
        <span class="text-cyan-400">//</span> 汇总最新、最实用的 AI 工具，助你提升工作效率 <span class="text-cyan-400">//</span>
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="glass-card neon-border p-6 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 搜索框 -->
        <div class="relative flex-1">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具，例如：ChatGPT、Midjourney..."
            class="input-cyber pl-12"
          />
        </div>

        <!-- 类别筛选 -->
        <div class="relative min-w-[160px]">
          <select
            v-model="selectedCategory"
            class="input-cyber appearance-none pr-10 cursor-pointer"
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
          <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- 排序 -->
        <div class="relative min-w-[160px]">
          <select
            v-model="sortBy"
            class="input-cyber appearance-none pr-10 cursor-pointer"
          >
            <option value="popularity">热门排序</option>
            <option value="rating">评分排序</option>
            <option value="update_time">更新时间</option>
          </select>
          <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="glass-card p-6">
        <div class="skeleton h-6 w-24 mb-4"></div>
        <div class="skeleton h-6 w-full mb-2"></div>
        <div class="skeleton h-4 w-3/4 mb-4"></div>
        <div class="skeleton h-4 w-full"></div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="glass-card p-6 border border-red-500/30">
      <p class="text-red-400 text-center">{{ error }}</p>
    </div>

    <!-- 工具列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <NuxtLink
        v-for="tool in tools"
        :key="tool.id"
        :to="`/tools/${tool.slug}`"
        class="glass-card card-decoration p-6 group hover:border-cyan-400/50 transition-all duration-300"
      >
        <ToolCard :tool="tool" />
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && tools.length === 0" class="glass-card p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
        <svg class="w-8 h-8 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p class="text-gray-400">未找到工具</p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1 && !loading" class="flex justify-center items-center gap-4">
      <button
        @click="currentPage--"
        :disabled="currentPage <= 1"
        class="btn-cyber-ghost disabled:opacity-30 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      <span class="text-sm text-gray-500 font-mono">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage >= totalPages"
        class="btn-cyber-ghost disabled:opacity-30 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

import type { Tool, ToolCategory } from '~/types/tool'
import ToolCard from '~/components/ToolCard.vue'

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

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/tools/categories')
    if (response.code === 0 && response.data) {
      categories.value = response.data
    }
  } catch (err) {
    error.value = '获取工具类别失败'
  }
}

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
    if ((response.code === 0 || response.code === 200) && response.data) {
      tools.value = Array.isArray(response.data.list) ? response.data.list : []
      totalPages.value = Math.ceil((response.data.total || 0) / pageSize.value)
    } else {
      tools.value = []
      error.value = response.message || '获取工具列表失败'
    }
  } catch (err: any) {
    tools.value = []
    error.value = '网络错误，获取工具列表失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchTools()
})

watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
  fetchTools()
})

watch(currentPage, () => {
  if (currentPage.value >= 1) {
    fetchTools()
  }
})
</script>
