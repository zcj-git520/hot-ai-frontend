<template>
  <div class="broadsheet">

    <!-- 章节进度条 -->
    <div v-if="chapter && allChaptersRaw && allChaptersRaw.length > 0" class="pt-6 pb-2">
      <div class="flex items-center gap-4">
        <div class="flex items-baseline gap-2 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
          <span class="text-vermillion font-serif font-black text-[1.2rem]">{{ chapter.order_index }}</span>
          <span class="text-ink-faint">/</span>
          <span>{{ allChaptersRaw.length }}</span>
        </div>
        <div class="flex-1 relative h-px bg-rule-soft">
          <div class="absolute top-0 left-0 h-px bg-vermillion transition-all duration-500"
               :style="{ width: `${(chapter.order_index / allChaptersRaw.length) * 100}%` }"></div>
        </div>
        <NuxtLink :to="`/learning-paths/${id}`" class="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute hover:text-ink underline-draw whitespace-nowrap">
          查 看 全 部 章 节
        </NuxtLink>
      </div>
    </div>

    <!-- 面包屑 -->
    <nav class="pt-5 pb-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute flex items-center gap-2 flex-wrap">
      <NuxtLink to="/" class="underline-draw">头版</NuxtLink>
      <span class="text-vermillion">·</span>
      <NuxtLink to="/learning-paths" class="underline-draw">卷三</NuxtLink>
      <span class="text-vermillion">·</span>
      <NuxtLink :to="`/learning-paths/${id}`" class="underline-draw truncate max-w-[14rem]">
        {{ learningPath?.title || '路径' }}
      </NuxtLink>
      <span class="text-vermillion">·</span>
      <span class="text-ink truncate max-w-[24rem]">{{ chapter?.title || '章节' }}</span>
    </nav>

    <hr class="rule-soft" />

    <!-- 加载状态 -->
    <div v-if="loading" class="py-24 text-center">
      <span class="seal-square seal-square--tilt-l">载</span>
      <p class="mt-5 font-serif italic text-ink-mute">正在调阅章节…</p>
    </div>

    <!-- 章节详情 -->
    <div v-else-if="chapter && learningPath" class="pt-10 pb-16">

      <!-- ============================================================
           章节头部
           ============================================================ -->
      <header class="anim-rise mb-10">
        <div class="flex items-center gap-3 mb-5 flex-wrap">
          <span class="seal-square seal-square--tilt-l">第 {{ chapter.order_index }} 章</span>
          <span class="kicker kicker--indigo">{{ getContentTypeName(chapter.content_type) }}</span>
          <span v-if="chapter.is_free" class="px-2 py-0.5 text-[10.5px] font-mono tracking-[0.18em] uppercase border border-ochre text-ochre">免 费</span>
          <span
            v-if="chapter.is_locked"
            class="seal-square seal-square--tilt-r text-[10px]"
            :class="chapter.required_level >= 2 ? 'seal-square--cinnabar' : 'seal-square--ink'"
            :title="chapter.required_level >= 2 ? '会员专享' : '登录后阅读'"
          >
            {{ chapter.required_level >= 2 ? '会' : '锁' }}
          </span>
          <span class="ml-auto byline">≈ {{ chapter.estimated_hours || '—' }} 小 时</span>
        </div>

        <h1 class="headline headline--xl text-balance">{{ chapter.title }}</h1>
        <p v-if="chapter.description" class="deck mt-6 max-w-[40rem] text-pretty">{{ chapter.description }}</p>
      </header>

      <hr class="rule" />

      <!-- ============================================================
           章节正文
           ============================================================ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12">
        <article v-if="chapter.is_locked" class="lg:col-span-8">
          <LockNotice
            :required-level="chapter.required_level || 2"
            content-type="chapter"
          />
        </article>

        <article v-else class="lg:col-span-8 prose-cn indent-cn article-content">
          <div v-html="renderedContent" />
        </article>

        <aside class="lg:col-span-4 lg:border-l lg:border-rule-soft lg:pl-10 space-y-7">
          <div>
            <div class="kicker kicker--ink mb-3">本 章 信 息</div>
            <dl class="space-y-3 text-[13px] font-serif">
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">类 型</dt>
                <dd class="text-ink font-bold">{{ getContentTypeName(chapter.content_type) }}</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">时 长</dt>
                <dd class="text-ink font-bold">≈ {{ chapter.estimated_hours || '—' }} 时</dd>
              </div>
              <div class="flex justify-between gap-3">
                <dt class="text-ink-mute">顺 序</dt>
                <dd class="text-ink font-bold">第 {{ chapter.order_index }} / {{ allChaptersRaw.length }} 章</dd>
              </div>
              <div v-if="chapter.is_free !== undefined" class="flex justify-between gap-3">
                <dt class="text-ink-mute">是 否 免 费</dt>
                <dd class="text-ink font-bold">{{ chapter.is_free ? '免 费' : '付 费' }}</dd>
              </div>
            </dl>
          </div>

          <hr class="rule-soft" />

          <div v-if="!chapter.is_locked && externalLinks.length > 0">
            <div class="kicker kicker--moss mb-3">相 关 资 源</div>
            <ul class="space-y-2.5">
              <li v-for="(link, index) in externalLinks" :key="index">
                <a :href="link" target="_blank" rel="noopener noreferrer"
                   class="font-serif text-[13.5px] text-ink underline-draw break-all leading-[1.7]">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <hr class="rule" />

      <!-- ============================================================
           章节导航
           ============================================================ -->
      <div class="pt-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
        <NuxtLink v-if="prevChapter"
                  :to="`/learning-paths/${id}/chapters/${prevChapter.id}`"
                  class="group no-underline-on-hover border-t-2 border-ink pt-5 block hover:bg-paper-deep transition-colors px-1">
          <div class="kicker kicker--ink mb-3">← 上 一 章</div>
          <div class="font-serif font-bold text-[15px] text-ink group-hover:text-vermillion transition-colors leading-snug line-clamp-2">
            {{ prevChapter.title }}
          </div>
        </NuxtLink>
        <div v-else class="border-t-2 border-rule-faint pt-5 px-1">
          <div class="kicker kicker--mute mb-3">上 一 章</div>
          <div class="font-serif italic text-[14px] text-ink-faint">已 是 第 一 章</div>
        </div>

        <div class="flex items-end justify-center pb-1">
          <NuxtLink :to="`/learning-paths/${id}`"
                    class="seal-square seal-square--tilt-r no-underline-on-hover"
                    title="查看全部章节">
            全 章
          </NuxtLink>
        </div>

        <NuxtLink v-if="nextChapter"
                  :to="`/learning-paths/${id}/chapters/${nextChapter.id}`"
                  class="group no-underline-on-hover border-t-2 border-ink pt-5 block hover:bg-paper-deep transition-colors text-right px-1">
          <div class="kicker kicker--ink mb-3">下 一 章 →</div>
          <div class="font-serif font-bold text-[15px] text-ink group-hover:text-vermillion transition-colors leading-snug line-clamp-2">
            {{ nextChapter.title }}
          </div>
        </NuxtLink>
        <div v-else class="border-t-2 border-rule-faint pt-5 text-right px-1">
          <div class="kicker kicker--mute mb-3">下 一 章</div>
          <div class="font-serif italic text-[14px] text-ink-faint">已 是 最 后 一 章</div>
        </div>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="py-24 text-center">
      <span class="seal-square seal-square--tilt-r">无</span>
      <h2 class="font-serif font-black text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.25] mt-7 tracking-[0.06em] text-balance">
        章节已不在卷中
      </h2>
      <p class="font-serif text-[15px] text-ink-mute mt-4 max-w-[28rem] mx-auto text-pretty">
        该章节可能已被合并、调整，或链接已失效。
      </p>
      <div class="mt-9">
        <NuxtLink :to="`/learning-paths/${id}`" class="btn btn--ink">
          返 回 路 径
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import LockNotice from '~/app/components/article/LockNotice.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = route.params.pathId as string
const chapterId = route.params.chapterId as string

const { data: learningPath, pending: lpLoading } = await useFetch(`/api/learning-paths/${id}`, {
  transform: (res: any) => {
    if (!res) return null
    const responseData = res?.data || res
    if (!responseData) return null
    if (responseData.title) return responseData
    return null
  },
})

const { data: allChaptersRaw, pending: chaptersLoading } = await useFetch(`/api/learning-paths/${id}/chapters`, {
  transform: (res: any) => {
    if (!res) return []
    const responseData = res?.data || res
    if (!responseData) return []
    if (Array.isArray(responseData)) return responseData
    if (responseData.chapters && Array.isArray(responseData.chapters)) return responseData.chapters
    return []
  },
})

const loading = computed(() => lpLoading.value || chaptersLoading.value)

const chapter = computed(() => {
  if (!allChaptersRaw.value || !chapterId) return null
  return allChaptersRaw.value.find((ch: any) => String(ch.id) === String(chapterId)) || null
})

const chapterIndex = computed(() => {
  if (!allChaptersRaw.value || !chapter.value) return -1
  return allChaptersRaw.value.findIndex((ch: any) => String(ch.id) === String(chapterId))
})

const prevChapter = computed(() => {
  if (!allChaptersRaw.value || chapterIndex.value <= 0) return null
  return allChaptersRaw.value[chapterIndex.value - 1]
})

const nextChapter = computed(() => {
  if (!allChaptersRaw.value || chapterIndex.value >= allChaptersRaw.value.length - 1) return null
  return allChaptersRaw.value[chapterIndex.value + 1]
})

const renderedContent = computed(() => {
  if (!chapter.value?.content) return ''
  try {
    return marked(chapter.value.content)
  } catch (e) {
    console.error('Markdown 解析失败:', e)
    return chapter.value.content
  }
})

const externalLinks = computed(() => {
  const links = chapter.value?.external_links
  if (!links) return []
  try {
    if (typeof links === 'string') return JSON.parse(links)
    if (Array.isArray(links)) return links
    return []
  } catch {
    return []
  }
})

const getContentTypeName = (type: string) => {
  const map: Record<string, string> = {
    article: '文 章',
    video: '视 频',
    practice: '实 践',
    external: '外 部 链 接',
  }
  return map[type] || type
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Markdown 正文 — 东方刊样式 */
.article-content :deep(h1) {
  font-family: 'Noto Serif SC', serif;
  font-weight: 900;
  font-size: 1.85rem;
  color: var(--ink);
  margin: 2.5rem 0 1.25rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid var(--ink);
  line-height: 1.3;
  letter-spacing: 0.04em;
}
.article-content :deep(h2) {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  font-size: 1.45rem;
  color: var(--ink);
  margin: 2rem 0 0.85rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
}
.article-content :deep(h3) {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--ink);
  margin: 1.5rem 0 0.75rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
}
.article-content :deep(h4) {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--ink-soft);
  margin: 1.25rem 0 0.5rem;
}
.article-content :deep(p) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.0625rem;
  line-height: 1.95;
  color: var(--ink-soft);
  margin-bottom: 0.6em;
  letter-spacing: 0.04em;
}
.article-content :deep(p + p) { text-indent: 2em; }
.article-content :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin: 0 0 1.25rem 0;
}
.article-content :deep(ul > li) {
  position: relative;
  padding-left: 1.6rem;
  margin-bottom: 0.5rem;
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--ink-soft);
  letter-spacing: 0.04em;
}
.article-content :deep(ul > li)::before {
  content: '§';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--vermillion);
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
}
.article-content :deep(ol) {
  list-style: none;
  padding-left: 0;
  margin: 0 0 1.25rem 0;
  counter-reset: li;
}
.article-content :deep(ol > li) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.6rem;
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--ink-soft);
  counter-increment: li;
  letter-spacing: 0.04em;
}
.article-content :deep(ol > li)::before {
  content: counter(li);
  position: absolute;
  left: 0;
  top: 0.05rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid var(--ink);
  color: var(--seal);
  font-family: 'Noto Serif SC', serif;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.article-content :deep(strong) {
  color: var(--ink);
  font-weight: 700;
}
.article-content :deep(em) {
  color: var(--seal);
  font-style: normal;
  font-weight: 500;
}
.article-content :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.92em;
  background: var(--paper-deep);
  color: var(--seal);
  padding: 0.1em 0.45em;
  border: 1px solid var(--rule-soft);
}
.article-content :deep(pre) {
  background: var(--ink);
  color: var(--paper-soft);
  border-left: 3px solid var(--vermillion);
  padding: 1.25rem 1.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.92rem;
  line-height: 1.7;
}
.article-content :deep(pre code) {
  background: transparent;
  color: var(--paper-soft);
  border: 0;
  padding: 0;
}
.article-content :deep(blockquote) {
  border-left: 3px solid var(--vermillion);
  margin: 1.5rem 0;
  padding: 0.4rem 0 0.4rem 1.5rem;
  font-family: 'Noto Serif SC', serif;
  font-style: normal;
  color: var(--ink-soft);
  background: linear-gradient(90deg, rgba(181, 32, 42, 0.05), transparent 30%);
}
.article-content :deep(a) {
  color: var(--vermillion);
  border-bottom: 1px solid var(--vermillion);
  transition: opacity 200ms;
}
.article-content :deep(a:hover) { opacity: 0.7; }
.article-content :deep(hr) {
  border: 0;
  height: 1px;
  background: var(--rule-soft);
  margin: 2rem 0;
}
.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-family: 'Noto Serif SC', serif;
  font-size: 0.95rem;
}
.article-content :deep(th) {
  background: var(--ink);
  color: var(--paper-soft);
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.article-content :deep(td) {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid var(--rule-soft);
  color: var(--ink-soft);
}
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--rule-soft);
  margin: 1rem 0;
}
</style>
