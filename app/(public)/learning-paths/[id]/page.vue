<template>
  <div class="broadsheet">

    <!-- 面包屑 -->
    <nav class="pt-8 pb-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute flex items-center gap-2 flex-wrap">
      <NuxtLink to="/" class="underline-draw">头版</NuxtLink>
      <span class="text-vermillion">·</span>
      <NuxtLink to="/learning-paths" class="underline-draw">卷三 · 学习</NuxtLink>
      <span class="text-vermillion">·</span>
      <span class="text-ink truncate max-w-[28rem]">{{ learningPath?.title || '路径详情' }}</span>
    </nav>

    <hr class="rule-soft" />

    <!-- 加载状态 -->
    <div v-if="loading" class="py-24 text-center">
      <span class="seal-square seal-square--tilt-l">载</span>
      <p class="mt-5 font-serif italic text-ink-mute">正在调阅卷宗…</p>
    </div>

    <div v-else-if="learningPath" class="pt-10 pb-16">

      <!-- ============================================================
           头部
           ============================================================ -->
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10 anim-rise">
        <div class="lg:col-span-8">
          <div class="flex items-center gap-3 mb-5">
            <span class="seal-square seal-square--tilt-l">路径</span>
            <span class="kicker kicker--indigo">LEARNING DOSSIER</span>
            <span
              v-if="learningPath.is_locked"
              class="seal-square seal-square--tilt-r text-[10px]"
              :class="learningPath.required_level >= 2 ? 'seal-square--cinnabar' : 'seal-square--ink'"
              :title="learningPath.required_level >= 2 ? '会员专享' : '登录后阅读'"
            >
              {{ learningPath.required_level >= 2 ? '会' : '锁' }}
            </span>
            <span class="ml-auto byline">{{ getLevelName(learningPath.difficulty) }}</span>
          </div>
          <h1 class="headline headline--xl text-balance">{{ learningPath.title }}</h1>
          <p class="deck mt-6 max-w-[40rem] text-pretty">{{ learningPath.description }}</p>

          <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>难 度 · {{ getLevelName(learningPath.difficulty) }}</span>
            <span class="text-vermillion">·</span>
            <span>约 {{ learningPath.estimated_days || '—' }} 日</span>
            <span class="text-vermillion">·</span>
            <span>共 {{ chapters.length }} 章</span>
          </div>
        </div>

        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-10 space-y-7">
          <div>
            <div class="kicker kicker--ink">档 案 信 息</div>
            <dl class="mt-4 space-y-4 text-[12.5px] font-serif">
              <div class="flex items-baseline justify-between gap-3">
                <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase text-[11px]">预 估 时 长</dt>
                <dd class="font-bold text-ink">{{ learningPath.estimated_hours || '—' }} 小 时</dd>
              </div>
              <div class="flex items-baseline justify-between gap-3">
                <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase text-[11px]">章 节 数</dt>
                <dd class="font-bold text-ink">{{ chapters.length }} 章</dd>
              </div>
              <div class="flex items-baseline justify-between gap-3">
                <dt class="text-ink-mute font-mono tracking-[0.16em] uppercase text-[11px]">在 学 人 数</dt>
                <dd class="font-bold text-ink">{{ formatStudentCount(learningPath.student_count) }}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </header>

      <hr class="rule" />

      <!-- 学习目标 -->
      <section v-if="parsedLearningGoals.length" class="py-10">
        <div class="kicker kicker--ochre mb-5">学 习 目 标</div>
        <ol class="space-y-3">
          <li v-for="(goal, index) in parsedLearningGoals" :key="index" class="flex gap-4 font-serif text-[15.5px] text-ink-soft leading-[1.85]">
            <span class="font-serif font-black text-vermillion text-[1.4rem] leading-none w-9 shrink-0 tracking-[0.04em]">
              {{ ['壹','贰','叁','肆','伍','陆'][index] || (index + 1) }}
            </span>
            <span class="text-pretty">{{ goal }}</span>
          </li>
        </ol>
      </section>

      <hr v-if="parsedLearningGoals.length" class="rule-soft" />

      <!-- 适合人群 -->
      <section v-if="parsedTargetAudience.length" class="py-10">
        <div class="kicker kicker--moss mb-5">适 合 人 群</div>
        <div class="flex flex-wrap gap-2">
          <span v-for="(audience, index) in parsedTargetAudience" :key="index"
                class="px-4 py-2 text-[13.5px] font-serif border border-ink text-ink tracking-[0.04em]">
            {{ audience }}
          </span>
        </div>
      </section>

      <hr v-if="parsedTargetAudience.length" class="rule-soft" />

      <!-- 章节列表 -->
      <section v-if="chapters.length" class="py-10">
        <div class="kicker kicker--indigo mb-5">课 程 章 节</div>
        <div class="border-t-2 border-ink">
          <NuxtLink
            v-for="(chapter, i) in chapters"
            :key="chapter.id"
            :to="`/learning-paths/${id}/chapters/${chapter.id}`"
            class="group no-underline-on-hover border-b border-rule-soft grid grid-cols-12 gap-4 items-center py-5 hover:bg-paper-deep transition-colors"
          >
            <div class="col-span-1">
              <span class="font-serif font-black text-vermillion text-[1.6rem] leading-none tracking-[0.04em]">
                {{ ['壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'][i] || (i + 1) }}
              </span>
            </div>
            <div class="col-span-7 md:col-span-8">
              <h3 class="font-serif font-bold text-[16px] text-ink group-hover:text-vermillion transition-colors tracking-[0.04em] leading-tight">
                {{ chapter.title }}
              </h3>
              <p class="font-serif text-[13px] text-ink-mute leading-[1.7] mt-1 line-clamp-1">
                {{ chapter.description }}
              </p>
            </div>
            <div class="col-span-4 md:col-span-3 flex items-center justify-end gap-3 text-[11px] font-mono tracking-[0.16em] uppercase text-ink-mute">
              <span class="hidden sm:inline">{{ chapter.estimated_hours || '—' }} 时</span>
              <span class="px-2 py-1 border border-rule-soft text-ink-soft text-[10.5px]">
                {{ getContentTypeName(chapter.content_type) }}
              </span>
              <span
                v-if="chapter.is_locked"
                class="seal-square text-[9px] w-7 h-7"
                :class="chapter.required_level >= 2 ? 'seal-square--cinnabar' : 'seal-square--ink'"
                :title="chapter.required_level >= 2 ? '会员专享' : '登录后阅读'"
              >
                {{ chapter.required_level >= 2 ? '会' : '锁' }}
              </span>
              <span class="text-ink">→</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <hr class="rule" />

      <div class="pt-12 text-center">
        <NuxtLink to="/learning-paths" class="btn btn--ink">
          返 回 路 径 总 览
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="py-24 text-center">
      <span class="seal-square seal-square--tilt-r">无</span>
      <h2 class="font-serif font-black text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.25] mt-7 tracking-[0.06em] text-balance">
        该路径已不在卷中
      </h2>
      <p class="font-serif text-[15px] text-ink-mute mt-4 max-w-[28rem] mx-auto text-pretty">
        这条学习路径可能已被合并、调整，或链接已失效。
      </p>
      <div class="mt-9">
        <NuxtLink to="/learning-paths" class="btn btn--ink">
          查 看 路 径 总 览
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const id = route.params.id as string

const { data: learningPath, pending: loading } = await useFetch(`/api/learning-paths/${id}`, {
  transform: (res: any) => {
    if (!res) return null
    const responseData = res?.data || res
    if (!responseData) return null
    if (responseData.title) return responseData
    return null
  },
})

const { data: chaptersData } = await useFetch(`/api/learning-paths/${id}/chapters`, {
  transform: (res: any) => {
    if (!res) return []
    const responseData = res?.data || res
    if (!responseData) return []
    if (Array.isArray(responseData)) return responseData
    if (responseData.chapters && Array.isArray(responseData.chapters)) return responseData.chapters
    return []
  },
})

const chapters = computed(() => chaptersData.value || [])

const formatStudentCount = (count: number) => {
  if (!count) return '0'
  if (count >= 10000) return (count / 10000).toFixed(1) + ' 万'
  if (count >= 1000) return (count / 1000).toFixed(1) + ' 千'
  return String(count)
}

const getLevelName = (d: string) => {
  const map: Record<string, string> = { beginner: '入 门', intermediate: '进 阶', advanced: '高 级' }
  return map[d] || '未 知'
}

const getContentTypeName = (type: string) => {
  const map: Record<string, string> = {
    article: '文 章',
    video: '视 频',
    practice: '实 践',
    external: '外 部 链 接',
  }
  return map[type] || type
}

const parsedLearningGoals = computed(() => {
  const goals = learningPath.value?.learning_goals
  if (!goals) return []
  try {
    if (typeof goals === 'string') return JSON.parse(goals)
    if (Array.isArray(goals)) return goals
    return []
  } catch {
    return []
  }
})

const parsedTargetAudience = computed(() => {
  const audience = learningPath.value?.target_audience
  if (!audience) return []
  try {
    if (typeof audience === 'string') return JSON.parse(audience)
    if (Array.isArray(audience)) return audience
    return []
  } catch {
    return []
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
