<template>
  <div class="broadsheet">

    <!-- ============================================================
         卷四首部
         ============================================================ -->
    <section class="pt-10 md:pt-16 pb-10">
      <div class="flex items-center gap-4 mb-6 anim-rise">
        <span class="seal-square seal-square--tilt-l anim-seal">卷四</span>
        <span class="kicker kicker--indigo">工具库 · TOOL LIBRARY</span>
      </div>

      <h1 class="headline headline--xl anim-rise anim-rise-1 text-balance">
        不追新，<br />只收
        <em class="not-italic text-vermillion">「真用得上」</em>的
      </h1>

      <p class="deck mt-7 max-w-[40rem] text-pretty anim-rise anim-rise-2">
        本卷只收录经过真实使用场景验证的工具。
        每一条都附有明确的「它在哪个工作环节帮上忙」——
        <span class="zhupi">而不是又一个「颠覆性 AI 工具」的标题党</span>。
      </p>
    </section>

    <hr class="rule" />

    <!-- ============================================================
         搜索 + 筛选
         ============================================================ -->
    <section class="py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div class="lg:col-span-6">
          <label for="tool-search" class="label">检 索 · Search</label>
          <div class="flex items-end gap-3">
            <input
              id="tool-search"
              v-model="searchQuery"
              type="text"
              class="field flex-1"
              placeholder="如：ChatGPT / Midjourney / Cursor"
              @keyup.enter="fetchTools"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''; fetchTools()"
              class="btn btn--ghost btn--sm"
            >
              清 空
            </button>
            <button type="button" @click="fetchTools" class="btn btn--cinnabar btn--sm whitespace-nowrap">
              检 索
              <span class="arrow">→</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-3">
          <label for="tool-category" class="label">分 类 · Category</label>
          <select id="tool-category" v-model="selectedCategory" class="field appearance-none cursor-pointer pr-8" @change="fetchTools">
            <option value="">全 部 类 别</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="lg:col-span-3">
          <label for="tool-sort" class="label">排 序 · Sort</label>
          <select id="tool-sort" v-model="sortBy" class="field appearance-none cursor-pointer pr-8" @change="fetchTools">
            <option value="popularity">热 门 排 序</option>
            <option value="rating">评 分 排 序</option>
            <option value="update_time">更 新 时 间</option>
          </select>
        </div>
      </div>
    </section>

    <hr class="rule-soft" />

    <!-- ============================================================
         工具列表
         ============================================================ -->
    <section class="py-10">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        <div v-for="i in 6" :key="i" class="border-t-2 border-ink pt-7">
          <div class="h-3 w-20 bg-paper-deep mb-4"></div>
          <div class="h-6 w-3/4 bg-paper-deep mb-3"></div>
          <div class="h-3 w-full bg-paper-deep mb-2"></div>
          <div class="h-3 w-2/3 bg-paper-deep"></div>
        </div>
      </div>

      <div v-else-if="error" class="py-16 text-center">
        <span class="seal-square seal-square--tilt-r">错</span>
        <p class="mt-5 font-serif italic text-ink-mute">{{ error }}</p>
        <button @click="fetchTools" class="btn btn--ghost mt-6">重 试</button>
      </div>

      <div v-else-if="tools && tools.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        <NuxtLink
          v-for="(tool, i) in tools"
          :key="tool.id"
          :to="`/tools/${tool.slug}`"
          class="group no-underline-on-hover border-t-2 border-ink pt-7 anim-rise block"
          :class="`anim-rise-${(i % 5) + 1}`"
        >
          <ToolCard :tool="tool" />
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <span class="seal-square seal-square--tilt-l">无</span>
        <p class="mt-5 font-serif italic text-ink-mute">本条件下暂未收录工具。</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1 && !loading" class="mt-12 pt-8 border-t border-rule-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
          第 <span class="text-ink">{{ currentPage }}</span> / {{ totalPages }} 页 · 共 <span class="text-ink">{{ totalCount }}</span> 个
        </p>
        <nav class="flex items-center gap-2">
          <button
            type="button"
            @click="currentPage--; fetchTools()"
            :disabled="currentPage <= 1"
            class="btn btn--ghost btn--sm disabled:opacity-30"
          >
            ← 上一页
          </button>
          <button
            type="button"
            @click="currentPage++; fetchTools()"
            :disabled="currentPage >= totalPages"
            class="btn btn--ghost btn--sm disabled:opacity-30"
          >
            下一页 →
          </button>
        </nav>
      </div>

      <!-- 返回 -->
      <div class="mt-12 pt-8 border-t border-rule-soft flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/" class="btn btn--ink">
          返 回 头 版
          <span class="arrow">→</span>
        </NuxtLink>
        <button
          type="button"
          @click="scrollToTop"
          class="btn btn--ghost"
        >
          返 回 顶 部
          <span class="arrow">↑</span>
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { Tool, ToolCategory } from '~/types/tool'
import ToolCard from '~/components/ToolCard.vue'
import { toolApi } from '~/app/lib/api'

definePageMeta({ layout: 'default' })

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('popularity')
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)
const totalPages = ref(1)
const tools = ref<Tool[]>([])
const categories = ref<ToolCategory[]>([])
const loading = ref(false)
const error = ref('')

const fetchCategories = async () => {
  try {
    const response: any = await toolApi.getCategories()
    if (response.code === 0 && response.data) {
      categories.value = response.data
    } else if (Array.isArray(response)) {
      categories.value = response
    }
  } catch (err) {
    /* 静默 */
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
      order: 'desc',
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedCategory.value) params.category_id = selectedCategory.value

    const response: any = await toolApi.getList({
      page: params.page,
      pageSize: params.page_size,
      search: params.search,
      category: params.category_id,
    })
    // axios 拦截器已解包 {code, data, message} → response 已是 data 部分
    if (response && (response.list || response.data)) {
      const list = response.list || response.data.list || []
      tools.value = Array.isArray(list) ? list : []
      totalCount.value = response.total || response.data?.total || 0
      totalPages.value = Math.ceil((response.total || response.data?.total || 0) / pageSize.value)
    } else {
      tools.value = []
      error.value = '获取工具列表失败'
    }
  } catch (err: any) {
    tools.value = []
    error.value = '网络错误，获取工具列表失败'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchTools()
})

watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  if (currentPage.value >= 1) {
    fetchTools()
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

const scrollToTop = () => {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
