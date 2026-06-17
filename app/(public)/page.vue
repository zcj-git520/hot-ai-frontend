<template>
  <div class="broadsheet">

    <!-- ============================================================
         卷首 — 头条
         ============================================================ -->
    <section class="pt-12 md:pt-20 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

        <!-- 左：卷首主稿 -->
        <article class="lg:col-span-8">
          <div class="flex items-center gap-4 mb-7 anim-rise">
            <span class="seal-square seal-square--tilt-l anim-seal">卷首</span>
            <span class="kicker">AI 时代 · 头条</span>
            <span class="byline ml-auto">撰文 · 观察编辑部</span>
          </div>

          <h1 class="headline headline--xl text-balance anim-rise anim-rise-1">
            当模型比设计师<br />更快地完成
            <em class="not-italic text-vermillion">「第一稿」</em>
          </h1>

          <p class="deck mt-8 max-w-[40rem] text-pretty anim-rise anim-rise-2">
            我们花了三个月，追踪十二个职业在生成式 AI 浪潮里的真实工作流变化。
            <span class="zhupi">这不是预言</span>，
            而是一份对当前岗位结构的冷静记录——哪些环节被压缩了，哪些技能反而更值钱了。
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute anim-rise anim-rise-3">
            <span>数据 · 风险评估系统</span>
            <span class="text-vermillion">·</span>
            <span>阅读约 14 分钟</span>
            <span class="text-vermillion">·</span>
            <span>{{ todayStr }}</span>
          </div>

          <hr class="rule mt-10 mb-8" />

          <div class="prose-cn indent-cn anim-rise anim-rise-4">
            <p>
              <span class="ink-block">过</span>去六个月，我们对四百一十二位从业者做了访谈，并对照他们日常使用工具的日志数据。
              一个清晰的图景浮现出来：真正发生变化的，不是
              <em class="not-italic text-ink">「职业」</em>本身，而是职业内部的
              <em class="not-italic text-ink">「价值分布」</em>。
            </p>
            <p>
              那些靠「先做出来再说」赢的岗位正在被重新定价，而靠「判断什么是值得做」的岗位，反而获得了更大的议价空间。
              <span class="zhupi">这是好事，也是坏事。</span>
              关键在于你是否看清了这条线。
            </p>
            <p>
              本期卷首，我们将风险评估结果、岗位样本、以及面向普通人的可执行建议，整理为一份完整的观察报告。
            </p>
          </div>

          <div class="mt-10 flex flex-wrap items-center gap-4 anim-rise anim-rise-5">
            <NuxtLink to="/articles" class="btn btn--ink btn--lg">
              阅读完整报告
              <span class="arrow">→</span>
            </NuxtLink>
            <NuxtLink to="/professions" class="btn btn--ghost">
              查询我的职业
            </NuxtLink>
          </div>
        </article>

        <!-- 右：本期目录 -->
        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-12 anim-rise anim-rise-2">
          <div class="flex items-center gap-3 mb-5">
            <span class="seal-round">目</span>
            <span class="kicker kicker--ink">本期目录</span>
          </div>

          <h2 class="font-serif font-black text-[clamp(2rem,2.4vw,2.6rem)] leading-[1.2] mb-7 tracking-[0.04em] text-balance">
            四卷<br />今日之观察
          </h2>

          <ol class="space-y-6">
            <li v-for="(item, i) in indexItems" :key="i" class="flex gap-4">
              <span class="font-serif font-black text-vermillion text-[1.5rem] leading-none w-7 shrink-0 tracking-[0.04em]">
                {{ ['一','二','三','四'][i] }}
              </span>
              <div class="flex-1">
                <NuxtLink :to="item.path" class="font-serif font-bold text-[16.5px] leading-[1.45] text-ink hover:text-vermillion transition-colors block text-balance">
                  {{ item.title }}
                </NuxtLink>
                <p class="text-[11.5px] text-ink-mute mt-1 font-mono tracking-[0.18em] uppercase">
                  {{ item.dek }}
                </p>
              </div>
            </li>
          </ol>

          <hr class="rule-soft my-7" />

          <p class="quote-cn font-serif text-[15.5px] leading-[1.85] text-ink-soft">
            我们不预测未来，我们记录正在发生的事。
          </p>
          <p class="byline mt-2.5">— 创刊词 · 二〇二四</p>
        </aside>

      </div>
    </section>

    <hr class="rule-thick" />

    <!-- ============================================================
         卷一 · 资讯
         ============================================================ -->
    <section class="py-16">
      <header class="mb-10">
        <div class="juan-marker">
          <span class="kicker kicker--indigo">卷一</span>
          <span class="juan-marker__num">壹</span>
          <span class="font-serif text-[clamp(1.6rem,2.2vw,2.2rem)] font-bold leading-none tracking-[0.06em]">本  期  资  讯</span>
          <span class="juan-marker__line"></span>
          <span class="byline">LATEST INTEL</span>
        </div>
        <p class="font-serif text-[16px] text-ink-soft mt-5 max-w-[40rem] text-pretty leading-[1.85]">
          本卷辑录本周值得读的 AI 资讯。我们不追热度，只记那些对岗位结构有真实影响的事。
        </p>
      </header>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-x-10">
        <div v-for="i in 3" :key="i" class="article-card">
          <div class="h-3 w-24 bg-paper-deep mb-4"></div>
          <div class="h-6 w-full bg-paper-deep mb-3"></div>
          <div class="h-6 w-4/5 bg-paper-deep mb-5"></div>
          <div class="h-3 w-full bg-paper-deep mb-2"></div>
          <div class="h-3 w-3/4 bg-paper-deep"></div>
        </div>
      </div>

      <div v-else-if="latestArticles && latestArticles.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-x-10">
        <article v-for="(article, index) in latestArticles" :key="article.id" class="article-card anim-rise" :class="`anim-rise-${(index % 5) + 1}`">
          <div class="article-mast">
            <span class="article-mast__num">№ {{ String(index + 1).padStart(2, '0') }}</span>
            <span :class="['seal-square', getSealClass(article.category_code), sealTilt(index)]">
              {{ article.category_name }}
            </span>
            <span class="byline ml-auto">{{ formatDate(article.published_at) }}</span>
          </div>

          <h3 class="headline headline--sm mt-4 text-balance">
            <NuxtLink :to="`/articles/${article.id}`" class="hover:text-vermillion transition-colors">
              {{ article.title }}
            </NuxtLink>
          </h3>

          <p class="font-serif text-[15.5px] text-ink-soft leading-[1.95] mt-4 text-pretty">
            {{ article.summary }}
          </p>

          <div class="mt-5 pt-4 border-t border-rule-faint flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>来源 · {{ article.source_name }}</span>
            <NuxtLink :to="`/articles/${article.id}`" class="text-ink underline-draw">
              阅全文 →
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="article-card text-center">
        <p class="font-serif italic text-ink-mute py-12">本期尚无资讯。</p>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink to="/articles" class="btn btn--ghost">翻阅全卷 →</NuxtLink>
      </div>
    </section>

    <hr class="rule" />

    <!-- ============================================================
         卷二 · 职业风险
         ============================================================ -->
    <section class="py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

        <div class="lg:col-span-7">
          <header class="mb-10">
            <div class="juan-marker">
              <span class="kicker kicker--moss">卷二</span>
              <span class="juan-marker__num">贰</span>
              <span class="font-serif text-[clamp(1.6rem,2.2vw,2.2rem)] font-bold leading-none tracking-[0.06em]">职  业  风  险</span>
              <span class="juan-marker__line"></span>
              <span class="byline">CAREER INDEX</span>
            </div>
            <h2 class="font-serif font-black text-[clamp(1.7rem,2.4vw,2.4rem)] leading-[1.3] mt-6 tracking-[0.04em] text-balance">
              把抽象的「AI 威胁」<br />换成可读的数字
            </h2>
          </header>

          <div class="prose-cn indent-cn">
            <p>
              我们的评估系统结合了任务自动化率、技能半衰期、市场需求弹性与从业者访谈，
              把每个职业压缩成一个 <span class="zhupi">零到一百</span> 的可读指数。
              数字本身不是命运，但它能告诉你该把学习预算花在哪里。
            </p>
          </div>

          <!-- 风险柱（三个职业） -->
          <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div v-for="(r, i) in featuredRisks" :key="r.job" class="anim-rise" :class="`anim-rise-${i + 1}`">
              <div class="flex items-end gap-4">
                <div class="risk-bar__col h-32" :style="`height: ${r.barH}; background: ${r.color}; border-color: ${r.color};`"></div>
                <div>
                  <div class="risk-bar__readout" :style="`color: ${r.color};`">{{ r.score }}</div>
                  <div class="risk-bar__caption" :style="`color: ${r.color};`">{{ r.label }}</div>
                </div>
              </div>
              <div class="mt-4 font-serif font-bold text-[18px] leading-tight tracking-[0.04em]">{{ r.job }}</div>
              <p class="text-[12.5px] text-ink-mute leading-[1.85] mt-2 max-w-[14rem] font-serif">{{ r.note }}</p>
            </div>
          </div>

          <!-- 查询 -->
          <div class="mt-12 border-t-[2px] border-ink pt-7">
            <label class="label" for="job-search">查 询 你 的 职 业</label>
            <div class="flex flex-col sm:flex-row gap-4 sm:items-end">
              <input id="job-search" type="text" placeholder="如：设计师 / 程序员 / 运营 / 文案" class="field flex-1" />
              <button class="btn btn--cinnabar">
                查 询 指 数
                <span class="arrow">→</span>
              </button>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mr-1">热门查询</span>
              <NuxtLink
                v-for="job in popularJobs"
                :key="job"
                :to="`/professions/${job.toLowerCase()}`"
                class="px-3 py-1.5 text-[12.5px] font-serif border border-ink text-ink hover:bg-ink hover:text-paper-soft transition-colors tracking-[0.06em]"
              >
                {{ job }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- 右：方法说明 -->
        <aside class="lg:col-span-5 lg:border-l lg:border-rule-soft lg:pl-12">
          <div class="kicker kicker--ink mb-4">方法论</div>
          <h3 class="font-serif font-black text-[clamp(1.4rem,1.6vw,1.7rem)] leading-[1.4] mb-7 tracking-[0.04em] text-balance">
            一个「零到一百」的指数，是怎么算出来的
          </h3>

          <ol class="space-y-7">
            <li v-for="(step, i) in methodSteps" :key="i" class="flex gap-5">
              <span class="font-serif font-black text-vermillion text-[1.6rem] leading-none w-9 shrink-0 tracking-[0.04em]">
                {{ ['壹','贰','叁','肆'][i] }}
              </span>
              <div>
                <div class="font-serif font-bold text-[16.5px] leading-tight tracking-[0.06em]">{{ step.title }}</div>
                <p class="font-serif text-[13.5px] text-ink-soft leading-[1.9] mt-2 text-pretty">{{ step.body }}</p>
              </div>
            </li>
          </ol>

          <hr class="rule-soft my-7" />

          <p class="text-[11px] text-ink-mute font-mono tracking-[0.18em] uppercase">
            模 型 · v2.4 &nbsp;·&nbsp; 基 准 · 2026 Q2 &nbsp;·&nbsp; 样 本 · 412
          </p>
        </aside>

      </div>
    </section>

    <hr class="rule" />

    <!-- ============================================================
         卷三 · 学习路径
         ============================================================ -->
    <section class="py-16">
      <header class="mb-10">
        <div class="juan-marker">
          <span class="kicker kicker--ochre">卷三</span>
          <span class="juan-marker__num">叁</span>
          <span class="font-serif text-[clamp(1.6rem,2.2vw,2.2rem)] font-bold leading-none tracking-[0.06em]">学  习  路  径</span>
          <span class="juan-marker__line"></span>
          <span class="byline">LEARNING PATHS</span>
        </div>
        <h2 class="font-serif font-black text-[clamp(1.7rem,2.4vw,2.4rem)] leading-[1.3] mt-6 tracking-[0.04em] max-w-[40rem] text-balance">
          把「学点什么」翻译成<br />一条可以走的路
        </h2>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10">
        <NuxtLink
          v-for="(path, index) in learningPaths"
          :key="path.id"
          to="/learning-paths"
          class="article-card group no-underline-on-hover anim-rise"
          :class="`anim-rise-${(index % 5) + 1}`"
        >
          <div class="article-mast">
            <span class="article-mast__num">№ {{ String(index + 5).padStart(2, '0') }}</span>
            <span :class="['seal-square', sealTilt(index)]">{{ path.level }}</span>
            <span class="byline ml-auto">{{ path.duration }} · {{ path.students }}</span>
          </div>

          <h3 class="headline headline--sm mt-4 group-hover:text-vermillion transition-colors text-balance">
            {{ path.title }}
          </h3>

          <p class="font-serif text-[15.5px] text-ink-soft leading-[1.95] mt-3 text-pretty">
            {{ path.description }}
          </p>

          <div class="mt-5">
            <div class="flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute mb-2">
              <span>进 度</span>
              <span class="text-ink">{{ path.progress }}%</span>
            </div>
            <div class="h-[3px] bg-paper-deep relative overflow-hidden border border-ink">
              <div class="h-full bg-ink" :style="`width: ${path.progress}%`"></div>
            </div>
          </div>

          <div class="mt-5 pt-4 border-t border-rule-faint flex items-center justify-between text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>{{ path.chapters }} 章</span>
            <span class="text-ink flex items-center gap-1 group-hover:gap-2 transition-all">
              即刻启程 <span class="arrow transition-transform">→</span>
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <hr class="rule-thick" />

    <!-- ============================================================
         卷四 · 工具库 短导引
         ============================================================ -->
    <section class="py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div class="lg:col-span-7">
          <div class="juan-marker">
            <span class="kicker kicker--indigo">卷四</span>
            <span class="juan-marker__num">肆</span>
            <span class="font-serif text-[clamp(1.6rem,2.2vw,2.2rem)] font-bold leading-none tracking-[0.06em]">工  具  库</span>
            <span class="juan-marker__line"></span>
            <span class="byline">TOOL LIBRARY</span>
          </div>
          <h2 class="font-serif font-black leading-[1.05] mt-6 tracking-[0.04em] text-balance"
              style="font-size: clamp(2.4rem, 4.6vw, 4.2rem);">
            不追新，<br />只收
            <em class="italic text-vermillion not-italic">「真用得上」</em>的
          </h2>
        </div>
        <div class="lg:col-span-5">
          <p class="font-serif text-[16.5px] text-ink-soft leading-[1.95] text-pretty">
            我们只收录经过真实使用场景验证的工具。每一条都附有明确的「它在哪个工作环节帮上忙」——
            <span class="zhupi">而不是又一个「颠覆性 AI 工具」的标题党</span>。
          </p>
          <div class="mt-7">
            <NuxtLink to="/tools" class="btn btn--ink">
              翻 阅 工 具 库
              <span class="arrow">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: latestArticles } = await useFetch('/api/articles', {
  query: { page: 1, page_size: 3 },
  transform: (data: any) => data?.data?.articles || data?.articles || [],
})

const loading = ref(false)

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})

const indexItems = [
  { title: '当模型比设计师更快地完成第一稿', dek: '卷首 · 实地调研', path: '/articles' },
  { title: '十二个职业的风险指数，本期重排', dek: '卷二 · 数据',     path: '/professions' },
  { title: '三周学完 Copilot，从装到会',     dek: '卷三 · 实操',     path: '/learning-paths' },
  { title: '我们筛掉了六成的「AI 神器」',     dek: '卷四 · 编辑选择', path: '/tools' },
]

const featuredRisks = [
  { job: '客 服 / 销 售',   score: 92, label: '高 风 险', color: 'var(--vermillion)',  barH: '8rem', note: '对话式任务占比最高的职业之一，模型替代路径清晰。' },
  { job: '基 础 设 计 师',  score: 78, label: '中  高',   color: 'var(--ochre)',       barH: '6.8rem', note: '初稿与素材环节被压缩，但视觉判断仍不可替代。' },
  { job: '软 件 工 程 师',  score: 54, label: '中  等',   color: 'var(--ink)',         barH: '4.7rem', note: '编码效率被放大，需求理解与系统设计反而更重要。' },
]

const methodSteps = [
  { title: '拆 任 务',        body: '把每个职业拆成三十到六十个可执行子任务，并标注每个任务的自动化潜力。' },
  { title: '看 市 场',        body: '结合招聘数据、薪资曲线与岗位增长趋势，估算市场对该职业的需求弹性。' },
  { title: '问 从 业 者',     body: '对四百一十二位从业者做访谈，校准「模型实际能用上的环节」与「看上去能用上」的差距。' },
  { title: '给 一 个 数 字',  body: '把以上三个维度合成零到一百的指数。它不是命运，是一张该把学习预算花在哪里的地图。' },
]

const popularJobs = ['设计师', '程序员', '运营', '文案', '产品经理']

const learningPaths = [
  {
    id: 1,
    title: '零基础入门 AI',
    level: '入 门',
    duration: '30 天',
    description: '从零开始，系统学习 AI 基础概念、常用工具和实践场景。不需要任何先验知识。',
    progress: 35,
    students: '1.2k 在学',
    chapters: 18,
  },
  {
    id: 2,
    title: 'AI 辅助编程实战',
    level: '进 阶',
    duration: '45 天',
    description: '掌握 Copilot / Cursor 等 AI 编程工具的真实工作流，把编码效率放大五到十倍。',
    progress: 62,
    students: '890 在学',
    chapters: 24,
  },
  {
    id: 3,
    title: 'AI 产品经理之路',
    level: '高 级',
    duration: '60 天',
    description: '学习如何把 AI 能力变成产品决策、用户场景与可衡量的业务结果。',
    progress: 18,
    students: '456 在学',
    chapters: 32,
  },
]

const getSealClass = (code: string) => {
  const map: Record<string, string> = {
    news:   '',                          // 默认朱砂
    impact: '',
    learn:  '',
    tool:   '',
  }
  return map[code] || ''
}

const sealTilt = (i: number) => i % 2 === 0 ? 'seal-square--tilt-l' : 'seal-square--tilt-r'

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>
