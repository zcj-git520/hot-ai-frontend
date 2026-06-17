<template>
  <div class="broadsheet">

    <!-- 面包屑 -->
    <nav class="pt-8 pb-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute flex items-center gap-2 flex-wrap">
      <NuxtLink to="/" class="underline-draw">头版</NuxtLink>
      <span class="text-vermillion">·</span>
      <NuxtLink to="/professions" class="underline-draw">卷二 · 职业</NuxtLink>
      <span class="text-vermillion">·</span>
      <span class="text-ink truncate max-w-[28rem]">{{ profession?.name || '职业详情' }}</span>
    </nav>

    <hr class="rule-soft" />

    <!-- 加载状态 -->
    <div v-if="loading" class="py-24 text-center">
      <span class="seal-square seal-square--tilt-l">载</span>
      <p class="mt-5 font-serif italic text-ink-mute">正在调阅档案…</p>
    </div>

    <!-- 职业详情 -->
    <div v-else-if="profession" class="pt-10 pb-16">

      <!-- ============================================================
           头部：标题 + 风险柱
           ============================================================ -->
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 anim-rise">
        <div class="lg:col-span-8">
          <div class="flex items-center gap-3 mb-5">
            <span class="seal-square seal-square--tilt-l">档案</span>
            <span class="kicker kicker--moss">CAREER DOSSIER</span>
          </div>
          <h1 class="headline headline--xl text-balance">{{ profession.name }}</h1>
          <p class="deck mt-6 max-w-[40rem] text-pretty">{{ profession.description }}</p>

          <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>分 类 · {{ profession.category_name || '—' }}</span>
            <span class="text-vermillion">·</span>
            <span>自 动 化 率 · {{ profession.automation_rate || '—' }}%</span>
            <span class="text-vermillion">·</span>
            <span>编 号 · № {{ String(profession.id).padStart(3, '0') }}</span>
          </div>
        </div>

        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-12 flex flex-col items-start">
          <span class="kicker kicker--ink">综 合 风 险</span>
          <div class="mt-5 flex items-end gap-5">
            <div class="risk-bar__col" :style="`height: ${barHeight}; background: ${riskColor}; border-color: ${riskColor};`"></div>
            <div>
              <div class="risk-bar__readout" :style="`color: ${riskColor};`">{{ profession.risk_score }}</div>
              <div class="risk-bar__caption" :style="`color: ${riskColor};`">{{ riskLevelName }}</div>
            </div>
          </div>
          <hr class="rule-soft w-full mt-7" />
          <p class="font-serif text-[12.5px] text-ink-soft mt-5 leading-[1.85] text-pretty max-w-[18rem]">
            <span class="zhupi">评分越高，风险越大。</span>
            数字本身不是命运，但它能告诉你「该把学习预算花在哪里」。
          </p>
        </aside>
      </header>

      <hr class="rule" />

      <!-- ============================================================
           正文（两栏）
           ============================================================ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12">

        <!-- 左：主文 -->
        <article class="lg:col-span-8 prose-cn indent-cn">
          <h2 class="font-serif font-black text-[clamp(1.5rem,2vw,2rem)] leading-[1.3] mb-5 tracking-[0.04em] text-balance">一份档案，记录这个职业正在发生什么</h2>

          <p>
            <span class="ink-block">{{ profession.name?.charAt(0) || 'A' }}</span>
            本期将「{{ profession.name }}」的风险评定为 <span class="zhupi">{{ riskLevelName }}（{{ profession.risk_score }}）</span>。
            这不是预言，而是一份冷静的工作流对照记录——
            我们把从业者日常使用的工具、近半年的实际工作内容与可观察到的市场变化，
            按统一的口径压缩成一个可读的数字。
          </p>

          <p>
            在「自动化率 {{ profession.automation_rate || '—' }}%」这个数字背后，
            真正在变化的是职业内部的价值分布：哪些环节被压缩了，
            哪些技能反而更值钱了。
            接下来，我们把它逐项拆给你看。
          </p>

          <hr class="rule-soft my-9" />

          <!-- AI 影响分析 -->
          <div v-if="profession.impact_analysis">
            <h3 class="font-serif font-black text-[clamp(1.3rem,1.7vw,1.7rem)] leading-[1.3] mb-5 tracking-[0.04em]">
              <span class="zhupi">§</span> 哪些任务正被替代
            </h3>
            <p>{{ profession.impact_analysis.impact_summary }}</p>

            <div v-if="profession.impact_analysis.affected_tasks?.length" class="not-prose my-7">
              <span class="kicker kicker--moss">受 影 响 的 任 务</span>
              <ul class="mt-4 space-y-2.5">
                <li v-for="task in profession.impact_analysis.affected_tasks" :key="task"
                    class="flex gap-3 font-serif text-[15px] text-ink-soft leading-[1.85]">
                  <span class="text-vermillion font-serif font-black shrink-0 mt-0.5">§</span>
                  {{ task }}
                </li>
              </ul>
            </div>

            <div v-if="profession.impact_analysis.safe_tasks?.length" class="not-prose my-7">
              <span class="kicker kicker--moss">相 对 安 全 的 任 务</span>
              <ul class="mt-4 space-y-2.5">
                <li v-for="task in profession.impact_analysis.safe_tasks" :key="task"
                    class="flex gap-3 font-serif text-[15px] text-ink-soft leading-[1.85]">
                  <span class="text-moss font-serif font-black shrink-0 mt-0.5">§</span>
                  {{ task }}
                </li>
              </ul>
            </div>

            <div v-if="profession.impact_analysis.safe_skills?.length" class="not-prose my-7">
              <span class="kicker kicker--moss">建 议 发 展 的 技 能</span>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="skill in profession.impact_analysis.safe_skills" :key="skill"
                      class="px-3 py-1.5 text-[13px] font-serif border border-ink text-ink tracking-[0.04em]">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="profession.impact_analysis.impact_timeline" class="not-prose my-7">
              <span class="kicker kicker--moss">影 响 时 间 线</span>
              <div class="mt-5 space-y-5">
                <div class="flex gap-5 border-l-[2px] border-ink pl-5">
                  <span class="kicker kicker--indigo shrink-0 mt-1">短 期</span>
                  <p class="font-serif text-[15px] text-ink-soft leading-[1.85] text-pretty">{{ profession.impact_analysis.impact_timeline.short_term }}</p>
                </div>
                <div class="flex gap-5 border-l-[2px] border-ochre pl-5">
                  <span class="kicker kicker--ochre shrink-0 mt-1">中 期</span>
                  <p class="font-serif text-[15px] text-ink-soft leading-[1.85] text-pretty">{{ profession.impact_analysis.impact_timeline.mid_term }}</p>
                </div>
                <div class="flex gap-5 border-l-[2px] border-vermillion pl-5">
                  <span class="kicker shrink-0 mt-1">长 期</span>
                  <p class="font-serif text-[15px] text-ink-soft leading-[1.85] text-pretty">{{ profession.impact_analysis.impact_timeline.long_term }}</p>
                </div>
              </div>
            </div>
          </div>

          <hr class="rule-soft my-9" />

          <!-- 转型建议 -->
          <div v-if="profession.transition_advice">
            <h3 class="font-serif font-black text-[clamp(1.3rem,1.7vw,1.7rem)] leading-[1.3] mb-5 tracking-[0.04em]">
              <span class="zhupi">§</span> 该往哪里转
            </h3>
            <p>{{ profession.transition_advice.advice_summary }}</p>

            <div v-if="profession.transition_advice.transition_paths?.length" class="not-prose my-6">
              <span class="kicker kicker--ochre">推 荐 转 型 方 向</span>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="path in profession.transition_advice.transition_paths" :key="path"
                      class="px-3 py-1.5 text-[13px] font-serif border border-ochre text-ochre tracking-[0.04em]">
                  {{ path }}
                </span>
              </div>
            </div>

            <div v-if="profession.transition_advice.recommended_skills?.length" class="not-prose my-6">
              <span class="kicker kicker--ochre">推 荐 学 习 的 技 能</span>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="skill in profession.transition_advice.recommended_skills" :key="skill"
                      class="px-3 py-1.5 text-[13px] font-serif border border-ink text-ink tracking-[0.04em]">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="profession.transition_advice.recommended_paths?.length" class="not-prose my-8">
              <span class="kicker kicker--ochre">详 细 学 习 路 径</span>
              <div class="mt-5 space-y-6">
                <div v-for="(path, index) in profession.transition_advice.recommended_paths" :key="index" class="border-l-[2px] border-ink pl-6">
                  <div class="flex items-baseline gap-3 mb-3">
                    <span class="font-serif font-black text-vermillion text-[1.6rem] leading-none tracking-[0.04em]">{{ ['壹','贰','叁','肆','伍'][index] || (index + 1) }}</span>
                    <h4 class="font-serif font-bold text-[17px] tracking-[0.04em]">{{ path.title }}</h4>
                  </div>
                  <ol class="space-y-2.5">
                    <li v-for="(step, stepIndex) in path.steps" :key="stepIndex" class="flex gap-3 font-serif text-[14.5px] text-ink-soft leading-[1.85]">
                      <span class="text-vermillion shrink-0 mt-0.5">{{ stepIndex + 1 }}.</span>
                      <span>{{ step }}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- 右：边栏 — 市场数据 -->
        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-10 space-y-8">
          <div v-if="profession.market_data">
            <div class="kicker kicker--ink mb-4">市 场 数 据</div>

            <dl class="space-y-6">
              <div>
                <dt class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">市 场 趋 势</dt>
                <dd class="font-serif font-bold text-[18px] text-ink">{{ getMarketTrendName(profession.market_data.market_trend) }}</dd>
                <p class="text-[12.5px] text-ink-soft leading-[1.85] mt-1.5 font-serif text-pretty">{{ profession.market_data.market_trend_description }}</p>
              </div>

              <div class="border-t border-rule-faint pt-5">
                <dt class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">薪 资 影 响</dt>
                <dd class="font-serif font-bold text-[18px] text-ink">{{ getSalaryImpactName(profession.market_data.salary_impact) }}</dd>
                <p class="text-[12.5px] text-ink-soft leading-[1.85] mt-1.5 font-serif">
                  变 化 率 · <span class="text-vermillion font-mono">{{ profession.market_data.salary_change_rate }}%</span>
                </p>
              </div>

              <div class="border-t border-rule-faint pt-5">
                <dt class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">月 均 薪 资</dt>
                <dd class="font-serif font-black text-[clamp(1.6rem,2.2vw,2rem)] text-ink leading-none">¥ {{ formatNumber(profession.market_data.avg_salary) }}</dd>
              </div>

              <div class="border-t border-rule-faint pt-5">
                <dt class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">就 业 需 求</dt>
                <dd class="font-serif text-[14.5px] text-ink leading-[1.7]">{{ profession.market_data.job_demand_trend }}</dd>
              </div>

              <div class="border-t border-rule-faint pt-5">
                <dt class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">供 需 比</dt>
                <dd class="font-serif font-bold text-[20px] text-ink">{{ profession.market_data.supply_demand_ratio }}</dd>
                <p class="text-[12px] text-ink-faint font-serif mt-1">岗 位 / 求 职 者</p>
              </div>

              <div class="border-t border-rule-faint pt-5">
                <dt class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">数 据 来 源</dt>
                <dd class="font-serif text-[13.5px] text-ink-soft leading-[1.7]">{{ profession.market_data.data_source }}</dd>
                <p class="text-[11.5px] text-ink-faint font-mono tracking-[0.16em] uppercase mt-1.5">更 于 · {{ formatDate(profession.market_data.data_update_date) }}</p>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <hr class="rule" />

      <div class="pt-12 text-center">
        <NuxtLink to="/professions" class="btn btn--ink">
          返 回 职 业 名 录
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="py-24 text-center">
      <span class="seal-square seal-square--tilt-r">无</span>
      <h2 class="font-serif font-black text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.25] mt-7 tracking-[0.06em] text-balance">
        该职业已不在名录中
      </h2>
      <p class="font-serif text-[15px] text-ink-mute mt-4 max-w-[28rem] mx-auto text-pretty">
        这条职业档案可能已被合并、调整，或链接已失效。
      </p>
      <div class="mt-9">
        <NuxtLink to="/professions" class="btn btn--ink">
          查 看 职 业 名 录
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

const { data: profession } = await useFetch(`/api/professions/${id}`, {
  transform: (res: any) => {
    if (res && res.name) return res
    return res?.data || null
  },
})

const loading = ref(false)

const riskLevelName = computed(() => {
  const map: Record<string, string> = { extreme: '极 高 风 险', high: '高 风 险', medium: '中 等 风 险', low: '低 风 险' }
  return map[(profession.value as any)?.risk_level] || (profession.value as any)?.risk_level || '—'
})

const riskColor = computed(() => {
  const score = (profession.value as any)?.risk_score || 0
  if (score >= 80) return '#B5202A'
  if (score >= 60) return '#A87326'
  if (score >= 40) return '#1F3147'
  return '#3F5D3A'
})

const barHeight = computed(() => {
  const score = (profession.value as any)?.risk_score || 0
  const ratio = Math.max(0, Math.min(100, score)) / 100
  return (2 + ratio * 7).toFixed(2) + 'rem'
})

const formatNumber = (n: number) => {
  if (!n) return '—'
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万'
  return String(n)
}

const formatDate = (d: string) => {
  if (!d) return '—'
  const date = new Date(d)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const getMarketTrendName = (t: string) => {
  const map: Record<string, string> = { growing: '上 升', stable: '平 稳', declining: '下 降' }
  return map[t] || t || '—'
}

const getSalaryImpactName = (s: string) => {
  const map: Record<string, string> = { positive: '正 向 影 响', neutral: '中 性 影 响', negative: '负 向 影 响' }
  return map[s] || s || '—'
}
</script>

<style scoped>
.prose-cn :deep(.not-prose),
.not-prose { text-indent: 0; }
.prose-cn :deep(.not-prose p),
.prose-cn :deep(.not-prose li) { text-indent: 0; }
</style>
