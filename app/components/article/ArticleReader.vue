<template>
  <article
    ref="rootEl"
    :class="['article-reader', `theme-${theme}`, `size-${fontSize}`, `width-${maxWidth}`]"
  >
    <!-- 1. 头部信息 -->
    <header class="reader-header">
      <div class="meta-row">
        <span v-if="article.category_name" class="category-badge">{{ article.category_name }}</span>
        <span v-if="article.published_at" class="date">{{ formatDate(article.published_at) }}</span>
        <span v-if="article.source_name" class="source">来源：{{ article.source_name }}</span>
        <span v-if="readingTime > 0" class="reading-time">{{ readingTime }} 分钟阅读</span>
      </div>
      <h1 class="title">{{ article.title }}</h1>
      <p v-if="article.summary" class="summary">{{ article.summary }}</p>
    </header>

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
      <span v-if="article.view_count">👁 阅读 {{ formatNumber(article.view_count) }}</span>
      <span v-if="article.like_count">🔥 {{ formatNumber(article.like_count) }}</span>
      <span v-if="article.comment_count">💬 {{ formatNumber(article.comment_count) }}</span>
    </div>

    <!-- 5. 标签 -->
    <div v-if="article.tags?.length" class="tags-row">
      <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
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
      <NuxtLink to="/articles" class="back-link">← 返回列表</NuxtLink>
      <a v-if="article.original_url" :href="article.original_url" target="_blank" rel="noopener noreferrer" class="original-link">
        查看原文 →
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

function formatDate(s: string) { return s.split('T')[0] }
function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

onMounted(async () => {
  await nextTick()
  if (bodyEl.value) enhanceCodeBlocks(bodyEl.value)
})
</script>

<style scoped>
.article-reader {
  margin: 0 auto;
  padding: 32px 24px 64px;
  --reader-fg: #c9d1d9;
  --reader-bg: transparent;
  --reader-muted: #8b949e;
  --reader-border: #30363d;
  --reader-accent-from: #22d3ee;
  --reader-accent-to: #a78bfa;
  --reader-font-size: 16px;
  --reader-line-height: 1.85;
  background: var(--reader-bg);
  color: var(--reader-fg);
  font-size: var(--reader-font-size);
  line-height: var(--reader-line-height);
  transition: background 200ms, color 200ms;
}
.width-sm { max-width: 768px; }
.width-md { max-width: 896px; }
.width-lg { max-width: 1024px; }
.width-xl { max-width: 1152px; }

.size-sm { --reader-font-size: 14px; }
.size-md { --reader-font-size: 16px; }
.size-lg { --reader-font-size: 18px; }

/* === 主题 === */
.theme-dark  { --reader-fg: #c9d1d9; --reader-bg: transparent; --reader-muted: #8b949e; --reader-border: #30363d; }
.theme-light { --reader-fg: #1a1a1a; --reader-bg: #ffffff;     --reader-muted: #6b7280; --reader-border: #e5e7eb; }
.theme-sepia { --reader-fg: #433422; --reader-bg: #f5ecd9;     --reader-muted: #7a6852; --reader-border: #d6c9b0; }

/* === 头部 === */
.reader-header { margin-bottom: 32px; }
.meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 13px; color: var(--reader-muted); margin-bottom: 16px; }
.category-badge {
  background: linear-gradient(90deg, var(--reader-accent-from), var(--reader-accent-to));
  color: #0a0e1a; font-weight: 600;
  padding: 4px 12px; border-radius: 12px;
}
.title { font-size: 30px; line-height: 1.3; font-weight: 700; margin: 0 0 12px; color: var(--reader-fg); }
.summary { font-size: 16px; color: var(--reader-muted); margin: 0; font-style: italic; }

/* === 统计 / 标签 === */
.stats-row, .tags-row { display: flex; flex-wrap: wrap; gap: 12px; padding: 12px 0; border-top: 1px solid var(--reader-border); border-bottom: 1px solid var(--reader-border); font-size: 13px; color: var(--reader-muted); margin: 16px 0; }
.tag { background: var(--reader-border); padding: 2px 10px; border-radius: 999px; font-size: 12px; }

/* === 主体 === */
.reader-body { word-wrap: break-word; }
.reader-body :deep(p) { margin: 0 0 1.2em; }
.reader-body :deep(h1),
.reader-body :deep(h2),
.reader-body :deep(h3) { color: var(--reader-fg); margin: 1.6em 0 0.6em; line-height: 1.3; }
.reader-body :deep(h1) { font-size: 1.8em; }
.reader-body :deep(h2) { font-size: 1.5em; border-left: 3px solid; padding-left: 12px; border-image: linear-gradient(180deg, var(--reader-accent-from), var(--reader-accent-to)) 1; }
.reader-body :deep(h3) { font-size: 1.25em; }
.reader-body :deep(ul),
.reader-body :deep(ol) { padding-left: 1.6em; margin: 0 0 1.2em; }
.reader-body :deep(li) { margin-bottom: 0.4em; }
.reader-body :deep(a) { color: var(--reader-accent-from); text-decoration: none; border-bottom: 1px solid rgba(34, 211, 238, 0.4); }
.reader-body :deep(a:hover) { color: var(--reader-accent-to); }
.reader-body :deep(code) { background: var(--reader-border); color: var(--reader-fg); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: 'SF Mono', Consolas, monospace; }
.reader-body :deep(pre) {
  position: relative;
  background: rgba(13, 17, 23, 0.7);
  border: 1px solid var(--reader-border);
  border-radius: 8px;
  padding: 16px 18px;
  overflow-x: auto;
  font-size: 0.85em;
  line-height: 1.7;
  font-family: 'SF Mono', Consolas, monospace;
  backdrop-filter: blur(6px);
  margin: 0 0 1.2em;
}
.reader-body :deep(pre code) { background: none; padding: 0; }
.reader-body :deep(blockquote) {
  border-left: 3px solid;
  padding: 12px 18px;
  margin: 0 0 1.2em;
  background: rgba(167, 139, 250, 0.06);
  border-radius: 0 8px 8px 0;
  color: var(--reader-muted);
  font-style: italic;
  border-image: linear-gradient(180deg, var(--reader-accent-from), var(--reader-accent-to)) 1;
}
.reader-body :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; loading: lazy; }
.reader-body :deep(hr) { border: 0; border-top: 1px solid var(--reader-border); margin: 2em 0; }

/* === 复制按钮 === */
.reader-body :deep(.code-copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--reader-muted);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms;
}
.reader-body :deep(.code-copy-btn.copied) { color: #22c55e; opacity: 1; }

/* === 空内容 / 底部 === */
.empty-body { text-align: center; padding: 60px 0; color: var(--reader-muted); }
.empty-text { font-size: 18px; margin: 0 0 12px; }
.empty-link { color: var(--reader-accent-from); text-decoration: none; }
.reader-footer { display: flex; justify-content: space-between; padding-top: 24px; margin-top: 32px; border-top: 1px solid var(--reader-border); }
.back-link, .original-link { color: var(--reader-accent-from); text-decoration: none; font-size: 14px; }
.back-link:hover, .original-link:hover { color: var(--reader-accent-to); }

@media (max-width: 768px) {
  .article-reader { padding: 20px 16px 48px; }
  .title { font-size: 24px; }
}
</style>
