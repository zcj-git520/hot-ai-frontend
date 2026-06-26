<template>
  <div class="broadsheet">

    <!-- ============================================================
         卷三首部
         ============================================================ -->
    <section class="pt-10 md:pt-16 pb-10">
      <div class="flex items-center gap-4 mb-6 anim-rise">
        <span class="seal-square seal-square--tilt-l anim-seal">卷三</span>
        <span class="kicker kicker--indigo">学习路径 · LEARNING PATHS</span>
      </div>

      <h1 class="headline headline--xl anim-rise anim-rise-1 text-balance">
        别在「收藏夹」<br />里<em class="not-italic text-vermillion">自我感动</em>，
        <br />先把这一条走完
      </h1>

      <p class="deck mt-7 max-w-[40rem] text-pretty anim-rise anim-rise-2">
        每一卷都是编辑部亲自走过的。
        多少天、几章、卡在哪一节——写得清楚明白。
        <span class="zhupi">不会学的，先从一份能读完的学起</span>。
      </p>
    </section>

    <hr class="rule" />

    <!-- ============================================================
         检索 + 难度筛选
         ============================================================ -->
    <section class="py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div class="lg:col-span-7">
          <label for="path-search" class="label">检 索 · Search</label>
          <div class="flex items-end gap-3">
            <input
              id="path-search"
              v-model="searchKeyword"
              type="text"
              class="field flex-1"
              placeholder="如：Prompt 工程师 / 向量数据库 / Midjourney"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchKeyword"
              type="button"
              @click="searchKeyword = ''; handleSearch()"
              class="btn btn--ghost btn--sm"
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
          <span class="label">难 度 等 级 · Difficulty</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="level in levels"
              :key="level.id"
              type="button"
              :class="['px-3 py-1.5 text-[12.5px] font-serif border tracking-[0.06em] transition-colors flex items-center gap-1.5',
                       selectedDifficulty === level.id
                         ? 'bg-ink text-paper-soft border-ink'
                         : 'border-ink text-ink hover:bg-ink hover:text-paper-soft']"
              @click="handleFilter(level.id)"
            >
              <span class="w-2 h-2 inline-block" :style="{ background: level.dot }"></span>
              {{ level.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <hr class="rule-soft" />

    <!-- ============================================================
         路径列表（印张式）
         ============================================================ -->
    <section class="py-10">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        <div v-for="i in 6" :key="i" class="border-t-2 border-ink pt-7">
          <div class="h-3 w-20 bg-paper-deep mb-5"></div>
          <div class="h-6 w-3/4 bg-paper-deep mb-3"></div>
          <div class="h-3 w-full bg-paper-deep mb-2"></div>
          <div class="h-3 w-2/3 bg-paper-deep"></div>
        </div>
      </div>

      <div v-else-if="error" class="py-16 text-center">
        <span class="seal-square seal-square--tilt-r">错</span>
        <p class="mt-5 font-serif italic text-ink-mute">{{ error }}</p>
        <button @click="loadPaths" class="btn btn--ghost mt-6">重 试</button>
      </div>

      <div v-else-if="paths && paths.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        <NuxtLink
          v-for="(path, i) in paths"
          :key="path.id"
          :to="`/learning-paths/${path.id}`"
          class="group no-underline-on-hover border-t-2 border-ink pt-7 block anim-rise"
          :class="`anim-rise-${(i % 5) + 1}`"
        >
          <div class="flex items-start justify-between mb-5">
            <div class="flex items-center gap-3">
              <span class="font-serif font-black text-vermillion text-[2.4rem] leading-none w-12 h-12 flex items-center justify-center border border-ink">
                {{ path.title?.charAt(0) || '学' }}
              </span>
              <div>
                <span class="kicker kicker--indigo">№ {{ String(i + 1).padStart(2, '0') }}</span>
                <p class="text-[11px] text-ink-mute font-mono tracking-[0.16em] uppercase mt-1">
                  {{ getLevelName(path.difficulty) }}
                </p>
              </div>
            </div>
            <span :class="difficultyTilt(path.difficulty)" class="seal-square">
              {{ getLevelName(path.difficulty) }}
            </span>
            <span
              v-if="path.is_locked"
              class="seal-square seal-square--tilt-r text-[10px] mt-1.5"
              :class="path.required_level >= 2 ? 'seal-square--cinnabar' : 'seal-square--ink'"
              :title="path.required_level >= 2 ? '会员专享' : '登录后阅读'"
            >
              {{ path.required_level >= 2 ? '会' : '锁' }}
            </span>
          </div>

          <h3 class="headline headline--md group-hover:text-vermillion transition-colors text-balance">
            {{ path.title }}
          </h3>

          <p class="font-serif text-[14.5px] text-ink-soft leading-[1.9] mt-3 text-pretty line-clamp-2">
            {{ path.description || '本卷系统讲解这一主题的工作流——从基础到实战，逐章推进。' }}
          </p>

          <div class="mt-5 pt-4 border-t border-rule-faint flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span class="flex items-center gap-3">
              <span>≈ {{ path.estimated_days || '—' }} 日</span>
              <span class="text-vermillion">·</span>
              <span>{{ path.chapter_count || 0 }} 章</span>
            </span>
            <span class="text-ink flex items-center gap-1 group-hover:gap-2 transition-all">
              阅 详 情 <span class="arrow">→</span>
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <span class="seal-square seal-square--tilt-l">无</span>
        <p class="mt-5 font-serif italic text-ink-mute">本条件下暂无学习路径。</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1 && !loading" class="mt-12 pt-8 border-t border-rule-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
          第 <span class="text-ink">{{ currentPage }}</span> / {{ totalPages }} 页 · 共 <span class="text-ink">{{ total }}</span> 条
        </p>
        <nav class="flex items-center gap-2">
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="btn btn--ghost btn--sm disabled:opacity-30"
          >
            ← 上一页
          </button>
          <button
            type="button"
            @click="goToPage(currentPage + 1)"
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
definePageMeta({ layout: 'default' })

const searchKeyword = ref('')
const selectedDifficulty = ref('all')
const currentPage = ref(1)
const total = ref(0)
const paths = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const levels = [
  { id: 'all',         name: '全 部',  dot: '#9A8E7E' },
  { id: 'beginner',    name: '入 门',  dot: '#3F5D3A' },
  { id: 'intermediate', name: '进 阶',  dot: '#1F3147' },
  { id: 'advanced',    name: '高 级',  dot: '#B5202A' },
]

const totalPages = computed(() => Math.ceil(total.value / 12))

const getLevelName = (d: string) => {
  const map: Record<string, string> = { beginner: '入 门', intermediate: '进 阶', advanced: '高 级' }
  return map[d] || '未 知'
}

const difficultyTilt = (d: string) => {
  const map: Record<string, string> = {
    beginner: 'seal-square--tilt-l',
    intermediate: '',
    advanced: 'seal-square--tilt-r',
  }
  return map[d] || 'seal-square--tilt-l'
}

const loadPaths = async () => {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      page_size: 12,
    }
    if (selectedDifficulty.value !== 'all') params.difficulty = selectedDifficulty.value
    if (searchKeyword.value) params.search = searchKeyword.value

    const query = new URLSearchParams(params as any)
    const res: any = await $fetch(`/api/learning-paths?${query.toString()}`)
    const data = res?.data || res
    paths.value = data.professions || data.list || data.paths || []
    total.value = data.total || paths.value.length
  } catch (err: any) {
    console.error('加载学习路径失败:', err)
    error.value = err.message || '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPaths()
})

const handleSearch = () => {
  currentPage.value = 1
  loadPaths()
}

const handleFilter = (id: string) => {
  selectedDifficulty.value = id
  currentPage.value = 1
  loadPaths()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
