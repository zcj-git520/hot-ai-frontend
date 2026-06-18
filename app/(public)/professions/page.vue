<template>
  <div class="broadsheet">

    <!-- ============================================================
         卷二首部
         ============================================================ -->
    <section class="pt-10 md:pt-16 pb-10">
      <div class="flex items-center gap-4 mb-6 anim-rise">
        <span class="seal-square seal-square--tilt-l anim-seal">卷二</span>
        <span class="kicker kicker--moss">职业风险 · CAREER INDEX</span>
      </div>

      <h1 class="headline headline--xl anim-rise anim-rise-1 text-balance">
        把抽象的「AI 威胁」<br />
        换成可读的<em class="not-italic text-vermillion">数字</em>
      </h1>

      <p class="deck mt-7 max-w-[40rem] text-pretty anim-rise anim-rise-2">
        本卷收录十二个职业在生成式 AI 浪潮下的真实工作流变化。
        数字本身不是命运，
        <span class="zhupi">它只告诉你该把学习预算花在哪里</span>。
      </p>
    </section>

    <hr class="rule" />

    <!-- ============================================================
         搜索 + 风险等级
         ============================================================ -->
    <section class="py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div class="lg:col-span-7">
          <label for="profession-search" class="label">检 索 · Search</label>
          <div class="flex items-end gap-3">
            <input
              id="profession-search"
              v-model="searchKeyword"
              type="text"
              class="field flex-1"
              placeholder="如：设计师 / 程序员 / 运营 / 文案"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchKeyword"
              type="button"
              @click="clearSearch"
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
          <span class="label">风 险 等 级 · Risk Level</span>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              :class="['px-3 py-1.5 text-[12.5px] font-serif border tracking-[0.06em] transition-colors',
                       activeRiskLevel === 'all' ? 'bg-ink text-paper-soft border-ink' : 'border-ink text-ink hover:bg-ink hover:text-paper-soft']"
              @click="handleRiskLevelChange('all')"
            >
              全 部
            </button>
            <button
              v-for="level in riskLevels"
              :key="level.id"
              type="button"
              :class="['px-3 py-1.5 text-[12.5px] font-serif border tracking-[0.06em] transition-colors flex items-center gap-1.5',
                       activeRiskLevel === level.level ? 'bg-ink text-paper-soft border-ink' : 'border-ink text-ink hover:bg-ink hover:text-paper-soft']"
              @click="handleRiskLevelChange(level.level)"
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
         职业列表（卷二·风险柱卡片）
         ============================================================ -->
    <section class="py-10">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        <div v-for="i in 6" :key="i" class="border-t border-ink pt-7">
          <div class="h-3 w-16 bg-paper-deep mb-4"></div>
          <div class="h-6 w-3/4 bg-paper-deep mb-4"></div>
          <div class="h-3 w-full bg-paper-deep mb-2"></div>
          <div class="h-3 w-2/3 bg-paper-deep"></div>
        </div>
      </div>

      <div v-else-if="professions && professions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        <NuxtLink
          v-for="(p, i) in professions"
          :key="p.id"
          :to="`/professions/${p.id}`"
          class="block group no-underline-on-hover border-t-2 border-ink pt-7 anim-rise"
          :class="`anim-rise-${(i % 5) + 1}`"
        >
          <div class="flex items-end justify-between mb-5">
            <div class="flex items-end gap-4">
              <div class="risk-bar__col" :style="`height: ${getBarHeight(p.risk_score)}; background: ${getRiskColor(p.risk_score)}; border-color: ${getRiskColor(p.risk_score)};`"></div>
              <div>
                <div class="risk-bar__readout" :style="`color: ${getRiskColor(p.risk_score)};`">{{ p.risk_score }}</div>
                <div class="risk-bar__caption">{{ getRiskLevelName(p.risk_level) }}</div>
              </div>
            </div>
            <span class="byline">№ {{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <h3 class="headline headline--md group-hover:text-vermillion transition-colors text-balance">
            {{ p.name }}
          </h3>

          <p class="font-serif text-[14.5px] text-ink-soft leading-[1.9] mt-3 text-pretty line-clamp-2">
            {{ p.description || `${p.name} 当前的 AI 自动化率约 ${p.automation_rate || '—'}%，市场呈现 ${getRiskTrend(p.risk_level)} 趋势。` }}
          </p>

          <div class="mt-5 pt-4 border-t border-rule-faint flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>自 动 化 率 · {{ p.automation_rate || '—' }}%</span>
            <span class="text-ink flex items-center gap-1 group-hover:gap-2 transition-all">
              阅 详 情 <span class="arrow">→</span>
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <span class="seal-square seal-square--tilt-l">无</span>
        <p class="mt-5 font-serif italic text-ink-mute">本类暂无职业记录。</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-12 pt-8 border-t border-rule-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
          第 <span class="text-ink">{{ currentPage }}</span> / {{ totalPages }} 页 · 共 <span class="text-ink">{{ totalCount }}</span> 个
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
    </section>

    <!-- ============================================================
         方法论提示
         ============================================================ -->
    <section class="py-12 border-t border-rule">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4">
          <div class="kicker kicker--ink mb-3">方法论 · METHOD</div>
          <h2 class="headline headline--md text-balance">
            一个「零到一百」的指数，<br />是怎么算出来的
          </h2>
        </div>
        <div class="lg:col-span-8">
          <ol class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            <li v-for="(step, i) in methodSteps" :key="i" class="flex gap-4">
              <span class="font-serif font-black text-vermillion text-[1.6rem] leading-none w-9 shrink-0 tracking-[0.04em]">
                {{ ['壹','贰','叁','肆'][i] }}
              </span>
              <div>
                <div class="font-serif font-bold text-[15.5px] leading-tight tracking-[0.06em]">{{ step.title }}</div>
                <p class="font-serif text-[13.5px] text-ink-soft leading-[1.9] mt-2 text-pretty">{{ step.body }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

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

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const searchKeyword = ref('')
const activeRiskLevel = ref('all')
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)
const totalPages = ref(0)
const loading = ref(false)

const riskLevels = [
  { id: 'extreme', level: 'extreme', name: '极 高', dot: '#B5202A' },
  { id: 'high',    level: 'high',    name: '高',   dot: '#A87326' },
  { id: 'medium',  level: 'medium',  name: '中',   dot: '#1F3147' },
  { id: 'low',     level: 'low',     name: '低',   dot: '#3F5D3A' },
]

const methodSteps = [
  { title: '拆 任 务',  body: '把每个职业拆成三十到六十个可执行子任务，标注每个任务的自动化潜力。' },
  { title: '看 市 场',  body: '结合招聘数据、薪资曲线与岗位增长趋势，估算市场对该职业的需求弹性。' },
  { title: '问 从 业 者', body: '对四百一十二位从业者做访谈，校准「模型实际能用上」与「看上去能用上」的差距。' },
  { title: '给 一 个 数 字', body: '把以上三个维度合成零到一百的指数。它是一张「该把学习预算花在哪里」的地图。' },
]

const professions = ref<any[]>([])

const fetchProfessions = async () => {
  loading.value = true
  try {
    const params: any = { page: currentPage.value, page_size: pageSize.value }
    if (activeRiskLevel.value !== 'all') params.risk_level = activeRiskLevel.value
    if (searchKeyword.value) params.keyword = searchKeyword.value
    const res: any = await $fetch('/api/professions', { query: params })
    const data = res?.data || res
    professions.value = data?.professions || []
    totalCount.value = data?.total || 0
    totalPages.value = data?.total_pages || 0
  } catch (err) {
    console.error('Failed to fetch professions:', err)
  } finally {
    loading.value = false
  }
}

const { data: initial } = await useAsyncData('professions-initial', () => $fetch('/api/professions', {
  query: { page: 1, page_size: 12 },
}), {
  transform: (res: any) => {
    const data = res?.data || res
    return {
      list: data?.professions || [],
      total: data?.total || 0,
      totalPages: data?.total_pages || 0,
    }
  },
})
professions.value = initial.value?.list || []
totalCount.value = initial.value?.total || 0
totalPages.value = initial.value?.totalPages || 0

const handleSearch = async () => {
  currentPage.value = 1
  await fetchProfessions()
}
const clearSearch = async () => {
  searchKeyword.value = ''
  currentPage.value = 1
  await fetchProfessions()
}
const handleRiskLevelChange = async (level: string) => {
  activeRiskLevel.value = level
  currentPage.value = 1
  await fetchProfessions()
}
const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  await fetchProfessions()
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

const getRiskLevelName = (level: string) => {
  const map: Record<string, string> = { extreme: '极 高 风 险', high: '高 风 险', medium: '中 等 风 险', low: '低 风 险' }
  return map[level] || level
}

const getRiskColor = (score: number) => {
  if (score >= 80) return '#B5202A'
  if (score >= 60) return '#A87326'
  if (score >= 40) return '#1F3147'
  return '#3F5D3A'
}

const getBarHeight = (score: number) => {
  // score 0-100 → 1.2rem to 8rem
  const ratio = Math.max(0, Math.min(100, score)) / 100
  return (1.2 + ratio * 6.8).toFixed(2) + 'rem'
}

const getRiskTrend = (level: string) => {
  const map: Record<string, string> = { extreme: '替代加速', high: '显著上升', medium: '缓慢变化', low: '相对稳定' }
  return map[level] || '波动'
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
