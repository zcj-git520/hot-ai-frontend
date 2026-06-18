<template>
  <article
    ref="rootEl"
    :class="['article-reader', `theme-${theme}`, `size-${fontSize}`, `width-${maxWidth}`]"
  >
    <header class="reader-header">
      <div class="meta-row ignore">
        <span v-if="article.category_name" class="seal-square seal-square--tilt-l category-seal">{{ article.category_name }}</span>
        <span v-if="article.published_at" class="date">{{ formatDate(article.published_at) }}</span>
        <span v-if="article.source_name" class="source">来 源 · {{ article.source_name }}</span>
        <span v-if="readingTime > 0" class="reading-time">约 {{ readingTime }} 分钟</span>
      </div>
      <h1 class="title">{{ article.title }}</h1>
      <p v-if="article.summary" class="summary">{{ article.summary }}</p>
    </header>

    <hr class="rule-cinnabar" />

    <ReadingProgress v-if="showProgress" target=".article-reader" />

    <div v-if="hasStats" class="stats-row ignore">
      <span v-if="article.view_count" class="stat-item">阅 · {{ formatNumber(article.view_count) }}</span>
      <span v-if="article.like_count" class="stat-item">赞 · {{ formatNumber(article.like_count) }}</span>
      <span v-if="article.comment_count" class="stat-item">评 · {{ formatNumber(article.comment_count) }}</span>
    </div>

    <div v-if="article.tags?.length" class="tags-row ignore">
      <span v-for="tag in article.tags" :key="tag" class="tag"># {{ tag }}</span>
    </div>

    <div v-if="article.content" ref="bodyEl" class="reader-body" v-html="html" />

    <div v-else class="empty-body">
      <p class="empty-text">暂无正文内容</p>
      <a v-if="article.original_url" :href="article.original_url" target="_blank" rel="noopener noreferrer" class="empty-link">
        查看原文 →
      </a>
    </div>

    <footer class="reader-footer ignore">
      <NuxtLink to="/articles" class="back-link">← 返 回 资 讯 列 表</NuxtLink>
      <a v-if="article.original_url" :href="article.original_url" target="_blank" rel="noopener noreferrer" class="original-link">
        查 看 原 文 →
      </a>
    </footer>
  </article>

  <ReaderToolbar
    v-if="showToolbar"
    :font-size="fontSize"
    :theme="theme"
    :translatable="canShowTranslate"
    :translating="translating"
    :translated="translated"
    :target-label="sourceLang === 'zh' ? '英文' : '中文'"
    :restore-label="sourceLang === 'zh' ? '中文' : '英文'"
    @update:font-size="fontSize = $event"
    @update:theme="theme = $event"
    @toggle-translate="onTranslateClick"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch } from 'vue'
import type { Article } from '~/types/article'
import { useArticleRender } from '~/app/composables/useArticleRender'
import { useReaderPrefs } from '~/app/composables/useReaderPrefs'
import { useTranslator } from '~/app/composables/useTranslator'
import ReadingProgress from './ReadingProgress.vue'
import ReaderToolbar from './ReaderToolbar.vue'
import { enhanceCodeBlocks } from './CodeBlockEnhancer.client'
import { enhanceImages } from './enhanceImages.client'

const props = withDefaults(
  defineProps<{
    article: Article
    showProgress?: boolean
    showToolbar?: boolean
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { showProgress: true, showToolbar: true, maxWidth: 'md' }
)

const { fontSize, theme } = useReaderPrefs()
const { translating, configure, translateTo, reset: resetTranslation } = useTranslator()

const translated = ref(false)

const { html } = useArticleRender(() => props.article.content)

const bodyEl = ref<HTMLElement>()
const rootEl = ref<HTMLElement>()

const canShowTranslate = computed(() => Boolean(props.article.content))

// 嗅探文章主语言：CJK 字符比例 > 30% 视为中文，否则视为英文
const sourceLang = computed<'zh' | 'en'>(() => {
  const raw = props.article.content || ''
  if (!raw) return 'zh'
  const sample = raw.replace(/<[^>]+>/g, '').slice(0, 2000)
  if (!sample) return 'zh'
  const cjk = (sample.match(/[一-鿿]/g) || []).length
  return cjk / sample.length > 0.3 ? 'zh' : 'en'
})

const translateTargetLang = computed(() => sourceLang.value === 'zh' ? 'english' : 'chinese_simplified')

const hasStats = computed(() =>
  Boolean(props.article.view_count || props.article.like_count || props.article.comment_count)
)

const readingTime = computed(() =>
  Math.max(0, Math.round((props.article.content?.length || 0) / 400))
)

function formatDate(s: string) {
  if (!s) return ''
  const d = new Date(s)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万'
  if (n >= 1000) return (n / 1000).toFixed(1) + ' 千'
  return String(n)
}

onMounted(async () => {
  await nextTick()
  if (!bodyEl.value) return
  enhanceCodeBlocks(bodyEl.value)
  enhanceImages(bodyEl.value)
  if (canShowTranslate.value) {
    await configure(rootEl.value ?? bodyEl.value)
  }
})

watch(() => props.article.id, () => {
  resetTranslation()
  translated.value = false
})

function onTranslateClick() {
  if (translating.value) return
  if (translated.value) {
    resetTranslation()
    translated.value = false
  } else {
    translateTo(translateTargetLang.value)
    translated.value = true
  }
}
</script>

<style scoped>
.article-reader {
  margin: 0 auto;
  padding: 32px 24px 64px;
  --reader-fg: #1A1714;
  --reader-bg: transparent;
  --reader-muted: #6B6155;
  --reader-soft: #2E2823;
  --reader-border: #C8BBA0;
  --reader-faint: #D9CDB0;
  --reader-accent: #B5202A;
  --reader-accent-deep: #8B141C;
  --reader-font-size: 17px;
  --reader-line-height: 1.95;
  font-family: 'Noto Serif SC', 'Source Serif 4', STSong, SimSun, serif;
  background: var(--reader-bg);
  color: var(--reader-fg);
  font-size: var(--reader-font-size);
  line-height: var(--reader-line-height);
  transition: background 200ms, color 200ms, box-shadow 200ms;
  letter-spacing: 0.04em;
  position: relative;
  box-shadow: 0 0 0 1px var(--reader-border), 0 20px 40px -20px rgba(26, 23, 20, 0.18);
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.03) 100%),
    radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.04), transparent 60%);
}
.width-sm { max-width: 768px; }
.width-md { max-width: 896px; }
.width-lg { max-width: 1024px; }
.width-xl { max-width: 1152px; }

.size-sm { --reader-font-size: 15px; }
.size-md { --reader-font-size: 17px; }
.size-lg { --reader-font-size: 19px; }

.theme-paper  { --reader-bg: #F2EBD9; --reader-fg: #1A1714; --reader-muted: #6B6155; --reader-soft: #2E2823; --reader-border: #C8BBA0; --reader-faint: #D9CDB0; --reader-accent: #B5202A; }
.theme-indigo { --reader-bg: #E8EEF5; --reader-fg: #1F3147; --reader-muted: #4A5D7A; --reader-soft: #2E4565; --reader-border: #B5C2D2; --reader-faint: #D2DCE6; --reader-accent: #1F3147; }
.theme-ochre  { --reader-bg: #F4E8D0; --reader-fg: #4A3819; --reader-muted: #8A6B40; --reader-soft: #5C4626; --reader-border: #D9C29A; --reader-faint: #E5D4B5; --reader-accent: #A87326; }

.reader-header { margin-bottom: 28px; }
.meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: 12px; color: var(--reader-muted); margin-bottom: 20px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.16em; text-transform: uppercase; }
.category-seal { font-size: 11px; }
.title { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.3; font-weight: 900; margin: 0 0 16px; color: var(--reader-fg); font-family: 'Noto Serif SC', serif; letter-spacing: 0.04em; }
.summary { font-size: 1.05rem; color: var(--reader-muted); margin: 0; font-style: italic; line-height: 1.85; }

.stats-row { display: flex; flex-wrap: wrap; gap: 18px; padding: 14px 0; border-top: 1px solid var(--reader-border); border-bottom: 1px solid var(--reader-border); font-size: 12px; color: var(--reader-muted); margin: 20px 0; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.16em; text-transform: uppercase; }
.stat-item::before { content: '§ '; color: var(--reader-accent); }
.tags-row { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 0; font-size: 13px; color: var(--reader-muted); margin: 0 0 24px; font-family: 'Noto Serif SC', serif; }
.tag { padding: 2px 10px; color: var(--reader-soft); }

.reader-body { word-wrap: break-word; }
.reader-body :deep(p) { margin: 0 0 1.2em; text-indent: 2em; line-height: 1.95; }
.reader-body :deep(h1),
.reader-body :deep(h2),
.reader-body :deep(h3) { color: var(--reader-fg); margin: 1.8em 0 0.7em; line-height: 1.3; font-family: 'Noto Serif SC', serif; font-weight: 900; letter-spacing: 0.04em; }
.reader-body :deep(h1) { font-size: 1.7em; }
.reader-body :deep(h2) { font-size: 1.4em; border-left: 3px solid var(--reader-accent); padding-left: 14px; }
.reader-body :deep(h3) { font-size: 1.18em; color: var(--reader-soft); }
.reader-body :deep(ul),
.reader-body :deep(ol) { padding-left: 1.8em; margin: 0 0 1.2em; }
.reader-body :deep(li) { margin-bottom: 0.4em; }
.reader-body :deep(li::marker) { color: var(--reader-accent); }
.reader-body :deep(a) { color: var(--reader-accent); text-decoration: none; border-bottom: 1px solid rgba(181, 32, 42, 0.4); transition: border-color 200ms; }
.reader-body :deep(a:hover) { border-bottom-color: var(--reader-accent); }
.reader-body :deep(strong) { color: var(--reader-fg); font-weight: 700; }
.reader-body :deep(em) { color: var(--reader-soft); font-style: italic; }

.reader-body :deep(code) {
  background: rgba(181, 32, 42, 0.06);
  color: var(--reader-accent-deep);
  padding: 2px 8px;
  font-size: 0.88em;
  font-family: 'IBM Plex Mono', 'SF Mono', Consolas, monospace;
  letter-spacing: 0;
}
.reader-body :deep(pre) {
  position: relative;
  background: #1A1714;
  color: #F2EBD9;
  border-left: 3px solid var(--reader-accent);
  padding: 18px 22px;
  overflow-x: auto;
  font-size: 0.85em;
  line-height: 1.75;
  font-family: 'IBM Plex Mono', 'SF Mono', Consolas, monospace;
  margin: 1.4em 0;
  letter-spacing: 0;
}
.reader-body :deep(pre code) { background: none; padding: 0; color: inherit; }

.reader-body :deep(blockquote) {
  border-left: 3px solid var(--reader-accent);
  padding: 14px 22px;
  margin: 1.4em 0;
  background: rgba(181, 32, 42, 0.04);
  color: var(--reader-soft);
  font-style: italic;
  font-size: 1.05em;
}

.reader-body :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.5em 0;
  loading: lazy;
  background: rgba(26, 23, 20, 0.05);
  min-height: 60px;
  display: block;
  border: 1px solid var(--reader-border);
}
.reader-body :deep(img.img-failed) {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(181, 32, 42, 0.06),
      rgba(181, 32, 42, 0.06) 8px,
      rgba(26, 23, 20, 0.06) 8px,
      rgba(26, 23, 20, 0.06) 16px
    );
  border: 1px dashed var(--reader-border);
  min-height: 180px;
  position: relative;
}
.reader-body :deep(video) { max-width: 100%; margin: 1.5em 0; }
.reader-body :deep(hr) { border: 0; border-top: 1px solid var(--reader-border); margin: 2.5em 0; }

.reader-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1.4em 0; font-size: 0.95em; }
.reader-body :deep(th) { background: rgba(26, 23, 20, 0.05); color: var(--reader-fg); padding: 10px 14px; border: 1px solid var(--reader-border); text-align: left; font-weight: 700; }
.reader-body :deep(td) { padding: 10px 14px; border: 1px solid var(--reader-border); }

.reader-body :deep(.code-copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(242, 235, 217, 0.1);
  border: 1px solid rgba(242, 235, 217, 0.2);
  color: #F2EBD9;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms;
  font-family: 'IBM Plex Mono', monospace;
}
.reader-body :deep(.code-copy-btn.copied) { color: #B5202A; opacity: 1; }

.empty-body { text-align: center; padding: 60px 0; color: var(--reader-muted); }
.empty-text { font-size: 18px; margin: 0 0 12px; font-style: italic; }
.empty-link { color: var(--reader-accent); text-decoration: none; border-bottom: 1px solid var(--reader-accent); }
.reader-footer { display: flex; justify-content: space-between; padding-top: 24px; margin-top: 40px; border-top: 2px solid var(--reader-fg); font-size: 13px; font-family: 'Noto Serif SC', serif; letter-spacing: 0.08em; }
.back-link, .original-link { color: var(--reader-fg); text-decoration: none; }
.back-link:hover, .original-link:hover { color: var(--reader-accent); }

@media (max-width: 768px) {
  .article-reader { padding: 20px 16px 48px; }
  .title { font-size: 1.6rem; }
}
</style>
