<template>
  <div class="broadsheet">

    <!-- ============================================================
         卷一首部 — 标题 / 搜索 / 分类
         ============================================================ -->
    <section class="pt-10 md:pt-16 pb-10">
      <div class="flex items-center gap-4 mb-6 anim-rise">
        <span class="seal-square seal-square--tilt-l anim-seal">卷一</span>
        <span class="kicker kicker--indigo">资讯 · LATEST INTEL</span>
      </div>

      <h1 class="headline headline--xl anim-rise anim-rise-1 text-balance">
        本期<br />
        收录 <em class="not-italic text-vermillion">{{ totalCount || '—' }}</em> 条
      </h1>

      <p class="deck mt-7 max-w-[40rem] text-pretty anim-rise anim-rise-2">
        本卷辑录每周值得读的 AI 资讯。追的是对岗位结构有真实影响的事，
        不是又一条<span class="zhupi">「颠覆性发布」</span>的标题党。
      </p>
    </section>

    <hr class="rule" />

    <!-- ============================================================
         搜索 + 分类筛选
         ============================================================ -->
    <section class="py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div class="lg:col-span-7">
          <label for="article-search" class="label">检 索 · Search</label>
          <div class="flex items-end gap-3">
            <input
              id="article-search"
              v-model="searchKeyword"
              type="text"
              class="field flex-1"
              placeholder="如：GPT-5 / 设计师 / 多模态"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchKeyword"
              type="button"
              @click="clearSearch"
              class="btn btn--ghost btn--sm"
              aria-label="清空"
            >
              清 空
            </button>
            <button type="button" @click="handleSearch" class="btn btn--cinnabar btn--sm whitespace-nowrap">
              检 索
              <span class="arrow">→</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <span class="label">分 类 · Category</span>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              :class="['px-3 py-1.5 text-[12.5px] font-serif border tracking-[0.06em] transition-colors',
                       activeCategory === 'all'
                         ? 'bg-ink text-paper-soft border-ink'
                         : 'border-ink text-ink hover:bg-ink hover:text-paper-soft']"
              @click="handleCategoryChange('all')"
            >
              全 部
            </button>
            <button
              v-for="category in categories || []"
              :key="category.id"
              type="button"
              :class="['px-3 py-1.5 text-[12.5px] font-serif border tracking-[0.06em] transition-colors',
                       activeCategory === category.code
                         ? 'bg-ink text-paper-soft border-ink'
                         : 'border-ink text-ink hover:bg-ink hover:text-paper-soft']"
              @click="handleCategoryChange(category.code)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <hr class="rule-soft" />

    <!-- ============================================================
         文章列表（卷一·印张式）
         ============================================================ -->
    <section class="py-10">
      <div v-if="loading" class="space-y-0">
        <div v-for="i in 3" :key="i" class="article-card">
          <div class="h-3 w-24 bg-paper-deep mb-4"></div>
          <div class="h-6 w-full bg-paper-deep mb-3"></div>
          <div class="h-6 w-4/5 bg-paper-deep mb-5"></div>
          <div class="h-3 w-full bg-paper-deep mb-2"></div>
          <div class="h-3 w-3/4 bg-paper-deep"></div>
        </div>
      </div>

      <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <article
          v-for="(article, index) in articles"
          :key="article.id"
          class="article-card anim-rise"
          :class="`anim-rise-${(index % 5) + 1}`"
        >
          <div class="article-mast">
            <span class="article-mast__num">№ {{ String(index + 1).padStart(2, '0') }}</span>
            <span :class="['seal-square', sealTilt(index)]">
              {{ article.category_name }}
            </span>
            <span
              v-if="article.is_locked"
              class="ml-2 seal-square seal-square--tilt-r"
              :class="article.required_level >= 2 ? 'seal-square--cinnabar' : 'seal-square--ink'"
              :title="article.required_level >= 2 ? '会员专享' : '登录后阅读'"
            >
              {{ article.required_level >= 2 ? '会' : '锁' }}
            </span>
            <span class="byline ml-auto">{{ formatDate(article.published_at) }}</span>
          </div>

          <h2 class="headline headline--md mt-5 text-balance">
            <NuxtLink :to="`/articles/${article.id}`" class="hover:text-vermillion transition-colors">
              {{ article.title }}
            </NuxtLink>
          </h2>

          <p class="font-serif text-[15.5px] text-ink-soft leading-[1.95] mt-4 text-pretty line-clamp-3">
            {{ article.summary }}
          </p>

          <div class="mt-5 pt-4 border-t border-rule-faint flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>来 源 · {{ article.source_name }}</span>
            <span class="flex items-center gap-4">
              <span v-if="article.view_count">{{ formatNumber(article.view_count) }} 阅</span>
              <NuxtLink :to="`/articles/${article.id}`" class="text-ink underline-draw">阅全文 →</NuxtLink>
            </span>
          </div>
        </article>
      </div>

      <div v-else class="py-20 text-center">
        <span class="seal-square seal-square--tilt-l">空</span>
        <p class="mt-5 font-serif italic text-ink-mute">本期本类尚无资讯。</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-12 pt-8 border-t border-rule-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
          第 <span class="text-ink">{{ currentPage }}</span> / {{ totalPages }} 页 · 共 <span class="text-ink">{{ totalCount }}</span> 条
        </p>
        <nav class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn--ghost btn--sm disabled:opacity-30"
          >
            ← 上一页
          </button>
          <template v-for="page in displayPages" :key="page">
            <span v-if="page === '...'" class="px-2 text-ink-faint font-mono">…</span>
            <button
              v-else
              type="button"
              @click="goToPage(page as number)"
              :class="['min-w-[2.5rem] h-9 px-2 text-[13px] font-mono border tracking-wider transition-colors',
                       currentPage === page
                         ? 'bg-ink text-paper-soft border-ink'
                         : 'border-ink text-ink hover:bg-ink hover:text-paper-soft']"
            >
              {{ page }}
            </button>
          </template>
          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
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
import { articleApi } from '~/app/lib/api'

definePageMeta({ layout: 'default' })

const activeCategory = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const totalPages = ref(0)
const loading = ref(false)

const { data: categories } = await useFetch('/api/articles/categories', {
  transform: (data: any) => data?.data || data || [],
})

const buildQuery = () => {
  const params: any = {
    page: currentPage.value,
    page_size: pageSize.value,
  }
  if (activeCategory.value !== 'all') params.category = activeCategory.value
  if (searchKeyword.value) params.keyword = searchKeyword.value
  return params
}

const articles = ref<any[]>([])

const fetchArticles = async () => {
  loading.value = true
  try {
    const res: any = await articleApi.getList({
      page: buildQuery().page,
      pageSize: buildQuery().page_size,
      category: buildQuery().category,
    })
    const data = res?.data || res
    articles.value = data?.articles || []
    totalCount.value = data?.total || 0
    totalPages.value = data?.total_pages || 0
  } catch (err) {
    console.error('获取文章列表失败:', err)
  } finally {
    loading.value = false
  }
}

const { data: initial } = await useAsyncData('articles-initial', () => articleApi.getList({
  page: 1,
  pageSize: pageSize.value,
}), {
  transform: (res: any) => {
    const data = res?.data || res
    return {
      articles: data?.articles || [],
      total: data?.total || 0,
      totalPages: data?.total_pages || 0,
    }
  },
})
articles.value = initial.value?.articles || []
totalCount.value = initial.value?.total || 0
totalPages.value = initial.value?.totalPages || 0

const handleCategoryChange = async (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
  await fetchArticles()
}

const handleSearch = async () => {
  currentPage.value = 1
  await fetchArticles()
}

const clearSearch = async () => {
  searchKeyword.value = ''
  currentPage.value = 1
  await fetchArticles()
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  await fetchArticles()
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToTop = () => {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

const displayPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  } else if (current >= total - 3) {
    pages.push(1)
    pages.push('...')
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push('...')
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  }
  return pages
})

const sealTilt = (i: number) => (i % 2 === 0 ? 'seal-square--tilt-l' : 'seal-square--tilt-r')

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万'
  if (n >= 1000) return (n / 1000).toFixed(1) + ' 千'
  return String(n)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
