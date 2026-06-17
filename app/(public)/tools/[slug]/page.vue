<template>
  <div class="broadsheet">

    <!-- 面包屑 -->
    <nav class="pt-8 pb-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute flex items-center gap-2 flex-wrap">
      <NuxtLink to="/" class="underline-draw">头版</NuxtLink>
      <span class="text-vermillion">·</span>
      <NuxtLink to="/tools" class="underline-draw">卷四 · 工具</NuxtLink>
      <span class="text-vermillion">·</span>
      <span class="text-ink truncate max-w-[28rem]">{{ tool?.name || '工具详情' }}</span>
    </nav>

    <hr class="rule-soft" />

    <!-- 加载状态 -->
    <div v-if="loading" class="py-24 text-center">
      <span class="seal-square seal-square--tilt-l">载</span>
      <p class="mt-5 font-serif italic text-ink-mute">正在调阅工具档案…</p>
    </div>

    <div v-else-if="error" class="py-24 text-center">
      <span class="seal-square seal-square--tilt-r">错</span>
      <p class="mt-5 font-serif italic text-ink-mute">{{ error }}</p>
    </div>

    <!-- 工具详情 -->
    <div v-else-if="tool" class="pt-10 pb-16">

      <!-- ============================================================
           头部
           ============================================================ -->
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10 anim-rise">
        <div class="lg:col-span-8">
          <div class="flex items-center gap-3 mb-5">
            <span class="seal-square seal-square--tilt-l">工具</span>
            <span class="kicker kicker--indigo">TOOL DOSSIER</span>
            <span v-if="tool.difficulty" class="ml-auto byline">{{ getDifficultyName(tool.difficulty) }}</span>
          </div>
          <h1 class="headline headline--xl text-balance">{{ tool.name }}</h1>
          <p class="deck mt-6 max-w-[40rem] text-pretty">{{ tool.description }}</p>

          <div v-if="tool.pricing_description" class="mt-7 border-l-[2px] border-vermillion pl-5">
            <span class="kicker">价 格 说 明</span>
            <p class="font-serif text-[15px] text-ink-soft leading-[1.85] mt-2 text-pretty">{{ tool.pricing_description }}</p>
          </div>

          <div v-if="tool.official_url || tool.documentation_url" class="mt-7 flex flex-wrap gap-3">
            <a v-if="tool.official_url" :href="tool.official_url" target="_blank" rel="noopener noreferrer" class="btn btn--cinnabar">
              访 问 官 网
              <span class="arrow">→</span>
            </a>
            <a v-if="tool.documentation_url" :href="tool.documentation_url" target="_blank" rel="noopener noreferrer" class="btn btn--ghost">
              查 看 文 档
            </a>
          </div>
        </div>

        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-10">
          <span class="kicker kicker--ink">评 分</span>
          <div class="mt-4 flex items-end gap-3">
            <span class="font-serif font-black text-[clamp(2.6rem,3.6vw,3.4rem)] leading-none text-vermillion tracking-[0.02em]">{{ tool.rating?.toFixed(1) || '—' }}</span>
            <span class="text-[12px] text-ink-mute font-mono tracking-[0.16em] uppercase">/ 5.0</span>
          </div>
          <p class="text-[12px] text-ink-mute font-mono tracking-[0.18em] uppercase mt-2">基 于 {{ formatNumber(tool.review_count) }} 条 评 价</p>

          <hr class="rule-soft my-6" />

          <dl class="space-y-4 text-[12.5px]">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase">浏 览 量</dt>
              <dd class="font-serif font-bold text-ink">{{ formatNumber(tool.view_count) }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase">受 欢 迎 度</dt>
              <dd class="font-serif font-bold text-ink">{{ tool.popularity || '—' }}%</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase">更 新 日</dt>
              <dd class="font-serif font-bold text-ink">{{ formatDate(tool.updated_at) }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase">入 录 日</dt>
              <dd class="font-serif font-bold text-ink">{{ formatDate(tool.created_at) }}</dd>
            </div>
          </dl>
        </aside>
      </header>

      <hr class="rule" />

      <!-- 标签 -->
      <section v-if="tags && tags.length" class="py-9">
        <div class="kicker kicker--ink mb-4">相 关 标 签</div>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in tags" :key="tag" class="px-3 py-1.5 text-[13px] font-serif border border-ink text-ink tracking-[0.04em]">
            # {{ tag }}
          </span>
        </div>
      </section>

      <hr v-if="tags && tags.length" class="rule-soft" />

      <!-- 详细介绍 -->
      <section class="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article class="lg:col-span-8 prose-cn indent-cn">
          <h2 class="font-serif font-black text-[clamp(1.5rem,2vw,2rem)] leading-[1.3] mb-5 tracking-[0.04em] text-balance">
            它在哪个工作环节帮上忙
          </h2>
          <p>
            <span class="ink-block">{{ tool.name?.charAt(0) || 'A' }}</span>
            「{{ tool.name }}」属于「<span class="zhupi">{{ getDifficultyName(tool.difficulty) }}</span>」类工具，
            适合用于以下工作场景：{{ tool.description }}
          </p>
          <p>
            本档案由编辑组按统一口径整理：
            是否经真实使用场景验证，是否能在具体工作环节帮上忙——
            我们只收录满足这两条的工具。
          </p>
        </article>

        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-10 space-y-7">
          <div>
            <div class="kicker kicker--ink mb-3">基 本 信 息</div>
            <dl class="space-y-3 text-[13px] font-serif">
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">分 类</dt>
                <dd class="text-ink font-bold">{{ getCategoryName(tool.category_id) }}</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">难 度</dt>
                <dd class="text-ink font-bold">{{ getDifficultyName(tool.difficulty) }}</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">浏 览</dt>
                <dd class="text-ink font-bold">{{ formatNumber(tool.view_count) }}</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">评 价</dt>
                <dd class="text-ink font-bold">{{ formatNumber(tool.review_count) }}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>

      <!-- 相关推荐 -->
      <section v-if="relatedTools && relatedTools.length" class="py-12 border-t border-rule">
        <div class="kicker kicker--indigo mb-5">相 关 工 具</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          <NuxtLink
            v-for="(rt, i) in relatedTools"
            :key="rt.id"
            :to="`/tools/${rt.slug}`"
            class="group no-underline-on-hover border-t-2 border-ink pt-6"
          >
            <div class="flex items-center gap-3 mb-3">
              <span class="font-serif font-black text-vermillion text-[1.8rem] leading-none w-10 h-10 flex items-center justify-center border border-ink">
                {{ rt.name?.charAt(0) }}
              </span>
              <h3 class="font-serif font-bold text-[16px] text-ink group-hover:text-vermillion transition-colors">{{ rt.name }}</h3>
            </div>
            <p class="font-serif text-[13.5px] text-ink-soft leading-[1.85] line-clamp-2 text-pretty">{{ rt.description }}</p>
            <div class="mt-4 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute flex items-center justify-between">
              <span>★ {{ rt.rating?.toFixed(1) || '—' }} · {{ formatNumber(rt.review_count) }} 评</span>
              <span class="text-ink">→</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <hr class="rule" />

      <div class="pt-12 text-center">
        <NuxtLink to="/tools" class="btn btn--ink">
          返 回 工 具 库
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="py-24 text-center">
      <span class="seal-square seal-square--tilt-r">无</span>
      <h2 class="font-serif font-black text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.25] mt-7 tracking-[0.06em] text-balance">
        该工具已不在卷中
      </h2>
      <p class="font-serif text-[15px] text-ink-mute mt-4 max-w-[28rem] mx-auto text-pretty">
        这条工具档案可能已被合并、调整，或链接已失效。
      </p>
      <div class="mt-9">
        <NuxtLink to="/tools" class="btn btn--ink">
          查 看 工 具 库
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Tool, ToolCategoryListResponse } from '~/types/tool'

definePageMeta({ layout: 'default' })

const route = useRoute()
const tool = ref<Tool | null>(null)
const relatedTools = ref<Tool[]>([])
const loading = ref(false)
const error = ref('')
const tags = ref<string[]>([])

const slug = route.params.slug as string

const getDifficultyName = (difficulty: string) => {
  const names: Record<string, string> = {
    beginner: '入 门',
    intermediate: '进 阶',
    advanced: '高 级',
  }
  return names[difficulty] || '未 知'
}

const getCategoryName = (categoryId: number) => '工 具 分 类'

const formatDate = (dateString: string) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 10000) return (num / 10000).toFixed(1) + ' 万'
  if (num >= 1000) return (num / 1000).toFixed(1) + ' 千'
  return String(num)
}

const fetchTool = async () => {
  if (!slug) {
    error.value = '工具 ID 无效'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response: any = await $fetch(`/api/tools/${slug}`)
    if ((response.code === 0 || response.code === 200) && response.data) {
      tool.value = response.data
      try {
        if (typeof tool.value.tags === 'string') {
          tags.value = JSON.parse(tool.value.tags)
        } else if (Array.isArray(tool.value.tags)) {
          tags.value = tool.value.tags as string[]
        }
      } catch (e) {
        tags.value = []
      }
      await fetchRelatedTools()
    } else {
      error.value = response.message || '获取工具详情失败'
    }
  } catch (err) {
    error.value = '网络错误，获取工具详情失败'
    console.error('获取工具详情失败:', err)
  } finally {
    loading.value = false
  }
}

const fetchRelatedTools = async () => {
  try {
    const response: any = await $fetch('/api/tools', {
      query: {
        page: 1,
        page_size: 3,
        category_id: tool.value!.category_id,
      },
    })
    if ((response.code === 0 || response.code === 200) && response.data) {
      relatedTools.value = response.data.list.filter((t: Tool) => t.id !== tool.value!.id)
    }
  } catch (err) {
    /* 静默 */
  }
}

onMounted(() => {
  fetchTool()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
