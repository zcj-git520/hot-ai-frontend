<template>
  <article
    ref="rootEl"
    :class="['article-reader', `theme-${theme}`, `size-${fontSize}`, `width-${maxWidth}`]"
  >
    <!-- 1. 头部信息 -->
    <header class="reader-header">
      <div class="meta-row">
        <span v-if="article.category_name" class="seal-square seal-square--tilt-l category-seal">{{ article.category_name }}</span>
        <span v-if="article.published_at" class="date">{{ formatDate(article.published_at) }}</span>
        <span v-if="article.source_name" class="source">来 源 · {{ article.source_name }}</span>
        <span v-if="readingTime > 0" class="reading-time">约 {{ readingTime }} 分钟</span>
      </div>
      <h1 class="title">{{ article.title }}</h1>
      <p v-if="article.summary" class="summary">{{ article.summary }}</p>
    </header>

    <hr class="rule-cinnabar" />

    <!-- 2. 进度条 -->
    <ReadingProgress v-if="showProgress" target=".article-reader" />

    <!-- 3. 工具栏 -->
    <ReaderToolbar
      v-if="showToolbar"
      :font-size="fontSize"
      :theme="theme"
      @update:font-size="fontSize = $event"
      @update:theme="theme = $event"
    />

    <!-- 4. 统计行 -->
    <div v-if="hasStats" class="stats-row">
      <span v-if="article.view_count" class="stat-item">阅 · {{ formatNumber(article.view_count) }}</span>
      <span v-if="article.like_count" class="stat-item">赞 · {{ formatNumber(article.like_count) }}</span>
      <span v-if="article.comment_count" class="stat-item">评 · {{ formatNumber(article.comment_count) }}</span>
    </div>

    <!-- 5. 标签 -->
    <div v-if="article.tags?.length" class="tags-row">
      <span v-for="tag in article.tags" :key="tag" class="tag"># {{ tag }}</span>
    </div>

    <!-- 6. 主体渲染 -->
    <div v-if="article.content" ref="bodyEl" class="reader-body" v-html="html" />

    <!-- 7. 空内容兜底 -->
    <div v-else class="empty-body">
      <p class="empty-text">暂无正文内容</p>
      <a v-if="article.original_url" :href="article.original_url" target="_blank" rel="noopener noreferrer" class="empty-link">
        查看原文 →
      </a>
    </div>

    <!-- 8. 底部操作 -->
    <footer class="reader-footer">
      <NuxtLink to="/articles" class="back-link">← 返 回 资 讯 列 表</NuxtLink>
      <a v-if="article.original_url" :href="article.original_url" target="_blank" rel="noopener noreferrer" class="original-link">
        查 看 原 文 →
      </a>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import type { Article } from '~/types/article'
import { useArticleRender } from '~/app/composables/useArticleRender'
import { useReaderPrefs } from '~/app/composables/useReaderPrefs'
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

const { html } = useArticleRender(() => props.article.content)
const { fontSize, theme } = useReaderPrefs()

const bodyEl = ref<HTMLElement>()
const rootEl = ref<HTMLElement>()

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
  if (bodyEl.value) {
    enhanceCodeBlocks(bodyEl.value)
    enhanceImages(bodyEl.value)
  }
})
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
  transition: background 200ms, color 200ms;
  letter-spacing: 0.04em;
}
.width-sm { max-width: 768px; }
.width-md { max-width: 896px; }
.width-lg { max-width: 1024px; }
.width-xl { max-width: 1152px; }

.size-sm { --reader-font-size: 15px; }
.size-md { --reader-font-size: 17px; }
.size-lg { --reader-font-size: 19px; }

/* === 主题：宣纸 / 墨 / 朱砂 === */
.theme-paper  { --reader-fg: #1A1714; --reader-muted: #6B6155; --reader-soft: #2E2823; --reader-border: #C8BBA0; --reader-faint: #D9CDB0; --reader-accent: #B5202A; }
.theme-indigo { --reader-fg: #1F3147; --reader-muted: #4A5D7A; --reader-soft: #2E4565; --reader-border: #B5C2D2; --reader-faint: #D2DCE6; --reader-accent: #1F3147; }
.theme-ochre  { --reader-fg: #4A3819; --reader-muted: #8A6B40; --reader-soft: #5C4626; --reader-border: #D9C29A; --reader-faint: #E5D4B5; --reader-accent: #A87326; }

/* === 头部 === */
.reader-header { margin-bottom: 28px; }
.meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: 12px; color: var(--reader-muted); margin-bottom: 20px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.16em; text-transform: uppercase; }
.category-seal { font-size: 11px; }
.title { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.3; font-weight: 900; margin: 0 0 16px; color: var(--reader-fg); font-family: 'Noto Serif SC', serif; letter-spacing: 0.04em; }
.summary { font-size: 1.05rem; color: var(--reader-muted); margin: 0; font-style: italic; line-height: 1.85; }

/* === 统计 / 标签 === */
.stats-row { display: flex; flex-wrap: wrap; gap: 18px; padding: 14px 0; border-top: 1px solid var(--reader-border); border-bottom: 1px solid var(--reader-border); font-size: 12px; color: var(--reader-muted); margin: 20px 0; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.16em; text-transform: uppercase; }
.stat-item::before { content: '§ '; color: var(--reader-accent); }
.tags-row { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 0; font-size: 13px; color: var(--reader-muted); margin: 0 0 24px; font-family: 'Noto Serif SC', serif; }
.tag { padding: 2px 10px; color: var(--reader-soft); }

/* === 主体 === */
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

/* === 复制按钮 === */
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

/* === 空内容 / 底部 === */
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
