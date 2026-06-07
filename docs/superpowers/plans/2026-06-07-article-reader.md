# 文章详情页「读者视角」渲染改造 · 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `pages/articles/[id].vue` 的文章正文从"给什么渲染什么"（`replace('\n', '<br>')`）改造成支持 Markdown 渲染、3 主题切换、3 档字号、顶部进度条、代码块复制按钮、返回顶部按钮的读者体验。

**Architecture:** 单一职责组件 `ArticleReader.vue`（约 280 行）做主体，2 个 composable 拆关注点（渲染管线、阅读偏好），3 个小组件做阅读辅助（进度条、工具栏、代码块增强），1 个独立的 `renderer.ts` 包 markdown-it + DOMPurify 配置。所有样式走 CSS 变量驱动的 3 主题。

**Tech Stack:** Vue 3 + Nuxt 3 + TypeScript + markdown-it 14 + isomorphic-dompurify 2 + Vitest + @vue/test-utils + happy-dom

**Spec:** `docs/superpowers/specs/2026-06-07-article-reader-design.md`

---

## 重要前置信息

1. **包管理**：本项目用 `pnpm`（已存在 `pnpm-lock.yaml`），所有安装命令用 `pnpm add` / `pnpm add -D`。
2. **`marked` 库**已经在 `dependencies` 里，**但仅被 `learning-paths` 章节页使用**（不在本计划范围）。本计划额外引入 `markdown-it` 作为文章渲染器，**不移除** `marked`（避免影响 learning-paths）。这是已知的双库共存选择，已写进 spec 的非目标里。
3. **测试基础设施**：项目目前**没有 Vitest**，仅 Playwright 用于 E2E。Task 1-2 会建立 Vitest + happy-dom + @vue/test-utils 基础。
4. **路径约定**：所有相对路径用正斜杠（如 `app/lib/reader/renderer.ts`）。Windows 上 git bash 已支持。
5. **commit 频率**：每个 TDD 循环（test fail → implement → test pass）结束就 commit。绝不在测试没跑的情况下 commit。

---

## 文件结构总览（计划结束时落地）

```
app/
├── components/article/                       新建
│   ├── ArticleReader.vue                     新建
│   ├── ReadingProgress.vue                   新建
│   ├── ReaderToolbar.vue                     新建
│   └── CodeBlockEnhancer.client.ts           新建
├── lib/reader/                                新建
│   └── renderer.ts                            新建
└── composables/
    ├── useArticleRender.ts                   新建
    └── useReaderPrefs.ts                     新建

types/
└── article.ts                                 新建

tests/                                         新建
├── unit/renderer.test.ts
├── unit/useArticleRender.test.ts
├── unit/useReaderPrefs.test.ts
├── unit/CodeBlockEnhancer.test.ts
└── component/ReadingProgress.test.ts
    ReaderToolbar.test.ts
    ArticleReader.test.ts

vitest.config.ts                                新建
pages/articles/[id].vue                         改写
package.json                                    改（dependencies / scripts）
```

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装生产依赖**

Run:
```bash
cd hot-ai-frontend && pnpm add markdown-it@^14.1.0 isomorphic-dompurify@^2.16.0
```

Expected: 2 个包安装成功，`package.json` 的 `dependencies` 出现这两个名字，`pnpm-lock.yaml` 更新。

- [ ] **Step 2: 安装开发依赖（测试栈）**

Run:
```bash
pnpm add -D vitest@^1.6.0 @vue/test-utils@^2.4.6 happy-dom@^14.12.0 @types/markdown-it@^14.1.2
```

Expected: 4 个 devDependencies 添加成功。

- [ ] **Step 3: 校验 package.json 字段**

Run: 打开 `package.json`，确认 `dependencies` 包含 `markdown-it` 和 `isomorphic-dompurify`，`devDependencies` 包含 `vitest` / `@vue/test-utils` / `happy-dom` / `@types/markdown-it`。

- [ ] **Step 4: 跑一次 typecheck 确认未破坏现有类型**

Run:
```bash
pnpm typecheck
```

Expected: 退出码 0，输出 `0 errors`。如果有错，是既有错误（与本计划无关），记录下原始错误数，**确认本计划开始前没有新增**。

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(article-reader): add markdown-it, isomorphic-dompurify, vitest stack"
```

---

## Task 2: 配置 Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json:scripts`

- [ ] **Step 1: 写 vitest.config.ts**

Create `vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
```

- [ ] **Step 2: 在 package.json scripts 里加 test 脚本**

Modify `package.json` 的 `scripts` 段，新增（不要删既有 scripts）：

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3: 写一个 smoke test 验证 Vitest 能跑通**

Create `tests/unit/smoke.test.ts`：

```ts
import { describe, it, expect } from 'vitest'

describe('vitest setup', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 4: 跑 smoke test**

Run:
```bash
pnpm test:run tests/unit/smoke.test.ts
```

Expected: 1 个测试通过，输出 `Tests  1 passed (1)`。

- [ ] **Step 5: 删掉 smoke test 文件（不需要入仓）**

Run:
```bash
rm tests/unit/smoke.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json tests/
git commit -m "chore(article-reader): configure vitest with happy-dom"
```

---

## Task 3: 添加 Article 类型

**Files:**
- Create: `types/article.ts`

- [ ] **Step 1: 写 Article 类型**

Create `types/article.ts`：

```ts
/**
 * 文章实体 - 来自 content-svc /api/articles/:id
 *
 * 字段多为可空：后端可能省略空值或老数据缺字段
 */
export interface Article {
  id: string | number
  title: string
  summary?: string
  /** 纯文本 + Markdown 混排，详见 useArticleRender */
  content?: string
  category_name?: string
  category_code?: string
  source_name?: string
  author?: string
  published_at?: string
  view_count?: number
  comment_count?: number
  like_count?: number
  tags?: string[]
  original_url?: string
}
```

- [ ] **Step 2: 跑 typecheck**

Run:
```bash
pnpm typecheck
```

Expected: 退出码 0，0 errors。

- [ ] **Step 3: Commit**

```bash
git add types/article.ts
git commit -m "feat(article-reader): add Article type definition"
```

---

## Task 4: 实现 `app/lib/reader/renderer.ts`（TDD）

**Files:**
- Create: `tests/unit/renderer.test.ts`
- Create: `app/lib/reader/renderer.ts`

- [ ] **Step 1: 写失败测试 - 纯文本换行被处理为段落**

Create `tests/unit/renderer.test.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { renderArticleHtml } from '~/app/lib/reader/renderer'

describe('renderArticleHtml - 纯文本', () => {
  it('空字符串返回空字符串', () => {
    expect(renderArticleHtml('')).toBe('')
  })

  it('单段文本被包到 <p>', () => {
    const html = renderArticleHtml('你好世界')
    expect(html).toMatch(/<p>你好世界<\/p>/)
  })

  it('双换行分隔的段落各自包到 <p>', () => {
    const html = renderArticleHtml('第一段。\n\n第二段。')
    expect(html).toMatch(/<p>第一段。<\/p>/)
    expect(html).toMatch(/<p>第二段。<\/p>/)
  })

  it('单换行变为 <br>', () => {
    const html = renderArticleHtml('第一行\n第二行')
    expect(html).toContain('<br>')
  })
})
```

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/unit/renderer.test.ts
```

Expected: FAIL，错误是 `Cannot find module '~/app/lib/reader/renderer'`。

- [ ] **Step 3: 写最小实现**

Create `app/lib/reader/renderer.ts`：

```ts
import MarkdownIt from 'markdown-it'
import DOMPurify from 'isomorphic-dompurify'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
})

export function renderArticleHtml(raw: string): string {
  if (!raw) return ''
  const html = md.render(raw)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote',
      'ul', 'ol', 'li',
      'strong', 'em', 'code', 'pre', 'a',
      'img', 'figure', 'figcaption',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
  })
}
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/unit/renderer.test.ts
```

Expected: 4 passed。

- [ ] **Step 5: 加 Markdown 元素渲染的测试**

Append to `tests/unit/renderer.test.ts`：

```ts
describe('renderArticleHtml - Markdown 元素', () => {
  it('# 标题渲染为 <h1>', () => {
    const html = renderArticleHtml('# 标题')
    expect(html).toMatch(/<h1>标题<\/h1>/)
  })

  it('## 子标题渲染为 <h2>', () => {
    const html = renderArticleHtml('## 子标题')
    expect(html).toMatch(/<h2>子标题<\/h2>/)
  })

  it('**粗** 渲染为 <strong>', () => {
    const html = renderArticleHtml('**粗体**')
    expect(html).toMatch(/<strong>粗体<\/strong>/)
  })

  it('`code` 渲染为 <code>', () => {
    const html = renderArticleHtml('使用 `npm install`')
    expect(html).toMatch(/<code>npm install<\/code>/)
  })

  it('```代码块``` 渲染为 <pre><code>', () => {
    const html = renderArticleHtml('```\nconst x = 1\n```')
    expect(html).toMatch(/<pre><code>[\s\S]*const x = 1[\s\S]*<\/code><\/pre>/)
  })

  it('[文本](url) 渲染为带 target=_blank 的 <a>', () => {
    const html = renderArticleHtml('[OpenAI](https://openai.com)')
    expect(html).toMatch(/<a href="https:\/\/openai\.com"[^>]*target="_blank"[^>]*>OpenAI<\/a>/)
    expect(html).toMatch(/rel="noopener noreferrer"/)
  })

  it('裸 URL 自动 linkify', () => {
    const html = renderArticleHtml('访问 https://example.com 试试')
    expect(html).toMatch(/<a href="https:\/\/example\.com"/)
  })

  it('无序列表渲染为 <ul><li>', () => {
    const html = renderArticleHtml('- a\n- b')
    expect(html).toMatch(/<ul><li>a<\/li><li>b<\/li><\/ul>/)
  })

  it('有序列表渲染为 <ol><li>', () => {
    const html = renderArticleHtml('1. a\n2. b')
    expect(html).toMatch(/<ol><li>a<\/li><li>b<\/li><\/ol>/)
  })

  it('> 引用渲染为 <blockquote>', () => {
    const html = renderArticleHtml('> 一句话')
    expect(html).toMatch(/<blockquote>[\s\S]*一句话[\s\S]*<\/blockquote>/)
  })
})
```

- [ ] **Step 6: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/unit/renderer.test.ts
```

Expected: 14 passed。

- [ ] **Step 7: 加 XSS 防护测试**

Append to `tests/unit/renderer.test.ts`：

```ts
describe('renderArticleHtml - XSS 防护', () => {
  it('注入 <script> 被过滤', () => {
    const html = renderArticleHtml('<script>alert(1)</script>')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('alert(1)')
  })

  it('注入 <img onerror=...> 被过滤事件属性', () => {
    const html = renderArticleHtml('<img src="x" onerror="alert(1)">')
    expect(html).not.toMatch(/onerror=/)
  })

  it('注入 javascript: URL 链接被过滤协议', () => {
    const html = renderArticleHtml('[点我](javascript:alert(1))')
    expect(html).not.toMatch(/href="javascript:/)
  })

  it('注入 <iframe> 被过滤', () => {
    const html = renderArticleHtml('<iframe src="https://evil.com"></iframe>')
    expect(html).not.toContain('<iframe')
  })
})
```

- [ ] **Step 8: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/unit/renderer.test.ts
```

Expected: 18 passed。

- [ ] **Step 9: Commit**

```bash
git add app/lib/reader/renderer.ts tests/unit/renderer.test.ts
git commit -m "feat(article-reader): add markdown renderer with DOMPurify sanitization"
```

---

## Task 5: 实现 `useArticleRender` composable（TDD）

**Files:**
- Create: `tests/unit/useArticleRender.test.ts`
- Create: `app/composables/useArticleRender.ts`

- [ ] **Step 1: 写失败测试**

Create `tests/unit/useArticleRender.test.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useArticleRender } from '~/app/composables/useArticleRender'

describe('useArticleRender', () => {
  it('空输入返回空字符串', () => {
    const { html } = useArticleRender(ref(''))
    expect(html.value).toBe('')
  })

  it('undefined 输入不抛错，返回空字符串', () => {
    const { html } = useArticleRender(ref(undefined))
    expect(html.value).toBe('')
  })

  it('纯文本渲染为带 <p> 的 HTML', () => {
    const { html } = useArticleRender(ref('你好'))
    expect(html.value).toMatch(/<p>你好<\/p>/)
  })

  it('响应式输入变化时输出重算', () => {
    const content = ref('第一段')
    const { html } = useArticleRender(content)
    expect(html.value).toMatch(/<p>第一段<\/p>/)
    content.value = '## 新标题'
    expect(html.value).toMatch(/<h2>新标题<\/h2>/)
  })

  it('接受 getter 函数作为输入源', () => {
    const article = { content: '动态内容' }
    const { html } = useArticleRender(() => article.content)
    expect(html.value).toMatch(/<p>动态内容<\/p>/)
  })
})
```

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/unit/useArticleRender.test.ts
```

Expected: FAIL，错误是 `Cannot find module`。

- [ ] **Step 3: 写最小实现**

Create `app/composables/useArticleRender.ts`：

```ts
import { computed, type Ref } from 'vue'
import { renderArticleHtml } from '~/app/lib/reader/renderer'

export function useArticleRender(
  content: Ref<string | undefined> | (() => string | undefined)
) {
  const getter = typeof content === 'function' ? content : () => content.value
  const html = computed(() => {
    const raw = getter() ?? ''
    if (!raw) return ''
    return renderArticleHtml(raw)
  })
  return { html }
}
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/unit/useArticleRender.test.ts
```

Expected: 5 passed。

- [ ] **Step 5: Commit**

```bash
git add app/composables/useArticleRender.ts tests/unit/useArticleRender.test.ts
git commit -m "feat(article-reader): add useArticleRender composable"
```

---

## Task 6: 实现 `useReaderPrefs` composable（TDD）

**Files:**
- Create: `tests/unit/useReaderPrefs.test.ts`
- Create: `app/composables/useReaderPrefs.ts`

- [ ] **Step 1: 写失败测试**

Create `tests/unit/useReaderPrefs.test.ts`：

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useReaderPrefs', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('默认值为 md / dark', async () => {
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const { fontSize, theme } = useReaderPrefs()
    expect(fontSize.value).toBe('md')
    expect(theme.value).toBe('dark')
  })

  it('localStorage 已有合法值时启动恢复', async () => {
    localStorage.setItem('reader-prefs', JSON.stringify({ fontSize: 'lg', theme: 'sepia' }))
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const { fontSize, theme } = useReaderPrefs()
    expect(fontSize.value).toBe('lg')
    expect(theme.value).toBe('sepia')
  })

  it('localStorage 损坏时不抛错，保持默认', async () => {
    localStorage.setItem('reader-prefs', '{not valid json')
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const { fontSize, theme } = useReaderPrefs()
    expect(fontSize.value).toBe('md')
    expect(theme.value).toBe('dark')
  })

  it('localStorage 含非法枚举值时回退默认', async () => {
    localStorage.setItem('reader-prefs', JSON.stringify({ fontSize: 'huge', theme: 'cyan' }))
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const { fontSize, theme } = useReaderPrefs()
    expect(fontSize.value).toBe('md')
    expect(theme.value).toBe('dark')
  })

  it('修改 fontSize 写入 localStorage（200ms debounce 后）', async () => {
    vi.useFakeTimers()
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const { fontSize } = useReaderPrefs()
    fontSize.value = 'lg'
    vi.advanceTimersByTime(250)
    const stored = JSON.parse(localStorage.getItem('reader-prefs') || '{}')
    expect(stored.fontSize).toBe('lg')
    vi.useRealTimers()
  })

  it('修改 theme 写入 localStorage', async () => {
    vi.useFakeTimers()
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const { theme } = useReaderPrefs()
    theme.value = 'light'
    vi.advanceTimersByTime(250)
    const stored = JSON.parse(localStorage.getItem('reader-prefs') || '{}')
    expect(stored.theme).toBe('light')
    vi.useRealTimers()
  })

  it('同模块多次 useReaderPrefs 共享同一 ref（单例）', async () => {
    const { useReaderPrefs } = await import('~/app/composables/useReaderPrefs')
    const a = useReaderPrefs()
    const b = useReaderPrefs()
    a.fontSize.value = 'sm'
    expect(b.fontSize.value).toBe('sm')
  })
})
```

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/unit/useReaderPrefs.test.ts
```

Expected: FAIL，错误是 `Cannot find module`。

- [ ] **Step 3: 写最小实现**

Create `app/composables/useReaderPrefs.ts`：

```ts
import { ref, watch } from 'vue'

export type FontSize = 'sm' | 'md' | 'lg'
export type Theme = 'dark' | 'light' | 'sepia'

const STORAGE_KEY = 'reader-prefs'
const FONT_SIZES: FontSize[] = ['sm', 'md', 'lg']
const THEMES: Theme[] = ['dark', 'light', 'sepia']

const fontSize = ref<FontSize>('md')
const theme = ref<Theme>('dark')
let initialized = false

function loadFromStorage() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (FONT_SIZES.includes(parsed.fontSize)) fontSize.value = parsed.fontSize
    if (THEMES.includes(parsed.theme)) theme.value = parsed.theme
  } catch {
    /* 损坏 storage 静默忽略 */
  }
}

let saveTimer: ReturnType<typeof setTimeout> | undefined
watch([fontSize, theme], () => {
  if (typeof window === 'undefined') return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fontSize: fontSize.value, theme: theme.value })
      )
    } catch {
      /* 隐私模式静默 */
    }
  }, 200)
})

export function useReaderPrefs() {
  loadFromStorage()
  return { fontSize, theme }
}
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/unit/useReaderPrefs.test.ts
```

Expected: 7 passed。

- [ ] **Step 5: Commit**

```bash
git add app/composables/useReaderPrefs.ts tests/unit/useReaderPrefs.test.ts
git commit -m "feat(article-reader): add useReaderPrefs composable with localStorage persistence"
```

---

## Task 7: 实现 `ReadingProgress` 组件（TDD）

**Files:**
- Create: `tests/component/ReadingProgress.test.ts`
- Create: `app/components/article/ReadingProgress.vue`

- [ ] **Step 1: 写失败测试**

Create `tests/component/ReadingProgress.test.ts`：

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingProgress from '~/app/components/article/ReadingProgress.vue'

describe('ReadingProgress', () => {
  beforeEach(() => {
    // 重置 window 滚动位置
    window.scrollTo(0, 0)
  })

  it('渲染 progressbar 角色，初始值为 0', () => {
    const wrapper = mount(ReadingProgress)
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('aria-valuenow')).toBe('0')
  })

  it('内部 .bar 元素初始宽度为 0%', () => {
    const wrapper = mount(ReadingProgress)
    const bar = wrapper.find('.bar')
    expect(bar.element.style.width).toBe('0%')
  })

  it('挂载时立刻读一次滚动位置（即使不滚动）', () => {
    // 模拟页面足够长能滚动
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 5000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    window.scrollTo(0, 0)

    const wrapper = mount(ReadingProgress)
    // 初始滚 0，bar 仍为 0
    expect(wrapper.find('.bar').element.style.width).toBe('0%')
  })

  it('卸载时移除 scroll 监听', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(ReadingProgress)
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything())
  })
})
```

> 顶部需 `import { vi } from 'vitest'`。

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/component/ReadingProgress.test.ts
```

Expected: FAIL，错误是 `Cannot find module`。

- [ ] **Step 3: 写组件实现**

Create `app/components/article/ReadingProgress.vue`：

```vue
<template>
  <div
    class="reading-progress"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    role="progressbar"
  >
    <div class="bar" :style="{ width: `${progress}%` }" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    target?: string
  }>(),
  { target: 'document' }
)

const progress = ref(0)
let raf = 0

function update() {
  raf = 0
  const el = props.target === 'document' || !props.target
    ? document.documentElement
    : document.querySelector(props.target)
  if (!el) return
  const rect = (el as HTMLElement).getBoundingClientRect()
  const total = rect.height - window.innerHeight
  if (total <= 0) { progress.value = 0; return }
  const scrolled = Math.min(Math.max(-rect.top, 0), total)
  progress.value = Math.round((scrolled / total) * 100)
}

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: transparent;
  z-index: 60;
  pointer-events: none;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #a78bfa);
  transition: width 80ms linear;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.5);
}
</style>
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/component/ReadingProgress.test.ts
```

Expected: 4 passed。

- [ ] **Step 5: Commit**

```bash
git add app/components/article/ReadingProgress.vue tests/component/ReadingProgress.test.ts
git commit -m "feat(article-reader): add ReadingProgress component with rAF throttling"
```

---

## Task 8: 实现 `ReaderToolbar` 组件（TDD）

**Files:**
- Create: `tests/component/ReaderToolbar.test.ts`
- Create: `app/components/article/ReaderToolbar.vue`

- [ ] **Step 1: 写失败测试**

Create `tests/component/ReaderToolbar.test.ts`：

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReaderToolbar from '~/app/components/article/ReaderToolbar.vue'
import { ref } from 'vue'

function makeWrapper(initialFontSize: 'sm' | 'md' | 'lg' = 'md', initialTheme: 'dark' | 'light' | 'sepia' = 'dark') {
  const fontSize = ref(initialFontSize)
  const theme = ref(initialTheme)
  const wrapper = mount(ReaderToolbar, {
    props: { fontSize, theme },
  })
  return { wrapper, fontSize, theme }
}

describe('ReaderToolbar', () => {
  beforeEach(() => {
    window.scrollTo(0, 0)
  })

  it('渲染 role=toolbar', () => {
    const { wrapper } = makeWrapper()
    expect(wrapper.find('[role="toolbar"]').exists()).toBe(true)
  })

  it('渲染 3 个字号按钮，当前档位高亮', () => {
    const { wrapper } = makeWrapper('lg')
    const buttons = wrapper.findAll('[role="group"][aria-label="字号"] button')
    expect(buttons.length).toBe(3)
    // lg 是第 3 个
    expect(buttons[2].classes()).toContain('active')
  })

  it('点击字号按钮更新 v-model', async () => {
    const { wrapper, fontSize } = makeWrapper('md')
    const smButton = wrapper.findAll('[role="group"][aria-label="字号"] button')[0]
    await smButton.trigger('click')
    expect(fontSize.value).toBe('sm')
  })

  it('渲染 3 个主题按钮，当前主题高亮', () => {
    const { wrapper } = makeWrapper('md', 'sepia')
    const buttons = wrapper.findAll('[role="group"][aria-label="主题"] button')
    expect(buttons.length).toBe(3)
    expect(buttons[2].classes()).toContain('active')
  })

  it('点击主题按钮更新 v-model', async () => {
    const { wrapper, theme } = makeWrapper('md', 'dark')
    const lightButton = wrapper.findAll('[role="group"][aria-label="主题"] button')[1]
    await lightButton.trigger('click')
    expect(theme.value).toBe('light')
  })

  it('返回顶部按钮初始不可见（scrollY=0）', () => {
    const { wrapper } = makeWrapper()
    const btn = wrapper.find('.back-to-top')
    expect(btn.classes()).not.toContain('visible')
  })

  it('滚动超过 600px 后返回顶部按钮可见', async () => {
    const { wrapper } = makeWrapper()
    window.scrollTo(0, 800)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('.back-to-top')
    expect(btn.classes()).toContain('visible')
  })

  it('点击返回顶部按钮调用 window.scrollTo', async () => {
    const spy = vi.spyOn(window, 'scrollTo')
    const { wrapper } = makeWrapper()
    window.scrollTo(0, 800)
    await wrapper.vm.$nextTick()
    await wrapper.find('.back-to-top').trigger('click')
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
  })
})
```

> 顶部需 `import { vi } from 'vitest'`。

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/component/ReaderToolbar.test.ts
```

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 写组件实现**

Create `app/components/article/ReaderToolbar.vue`：

```vue
<template>
  <div class="reader-toolbar" role="toolbar" aria-label="阅读偏好">
    <div class="group" role="group" aria-label="字号">
      <button
        v-for="size in SIZES"
        :key="size.value"
        :class="{ active: fontSize === size.value }"
        :aria-label="`字号 ${size.label}`"
        :aria-pressed="fontSize === size.value"
        @click="fontSize = size.value"
      >
        <span :style="{ fontSize: size.sample }">A</span>
      </button>
    </div>

    <div class="group" role="group" aria-label="主题">
      <button
        v-for="t in THEMES"
        :key="t.value"
        :class="['theme-btn', `theme-${t.value}`, { active: theme === t.value }]"
        :aria-label="`主题 ${t.label}`"
        :aria-pressed="theme === t.value"
        @click="theme = t.value"
      >
        <span class="dot" :style="{ background: t.dot }" />
      </button>
    </div>

    <button
      class="back-to-top"
      :class="{ visible: showTop }"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { FontSize, Theme } from '~/app/composables/useReaderPrefs'

const SIZES = [
  { value: 'sm' as FontSize, label: '小', sample: '12px' },
  { value: 'md' as FontSize, label: '中', sample: '14px' },
  { value: 'lg' as FontSize, label: '大', sample: '16px' },
]
const THEMES = [
  { value: 'dark'  as Theme, label: '深色', dot: '#0d1117' },
  { value: 'light' as Theme, label: '浅色', dot: '#ffffff' },
  { value: 'sepia' as Theme, label: '护眼', dot: '#f5ecd9' },
]

const fontSize = defineModel<FontSize>('fontSize', { required: true })
const theme = defineModel<Theme>('theme', { required: true })

const showTop = ref(false)
function onScroll() { showTop.value = window.scrollY > 600 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.reader-toolbar {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 50;
}
.group {
  display: flex;
  gap: 2px;
  background: rgba(22, 27, 34, 0.85);
  border: 1px solid #30363d;
  border-radius: 999px;
  padding: 4px;
  backdrop-filter: blur(8px);
}
button {
  border: 0;
  background: transparent;
  color: #8b949e;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms;
}
button:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
button.active { color: #fff; background: linear-gradient(135deg, #22d3ee, #a78bfa); }
.theme-btn .dot {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.back-to-top {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22d3ee, #a78bfa);
  color: #0d1117;
  font-weight: 700;
  font-size: 18px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 200ms;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
}
.back-to-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

@media (max-width: 768px) {
  .reader-toolbar { right: 12px; bottom: 12px; }
  .group button { width: 32px; height: 32px; }
  .back-to-top { width: 40px; height: 40px; }
}
</style>
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/component/ReaderToolbar.test.ts
```

Expected: 8 passed。

- [ ] **Step 5: Commit**

```bash
git add app/components/article/ReaderToolbar.vue tests/component/ReaderToolbar.test.ts
git commit -m "feat(article-reader): add ReaderToolbar with font/theme/back-to-top controls"
```

---

## Task 9: 实现 `CodeBlockEnhancer` 客户端指令（TDD）

**Files:**
- Create: `tests/unit/CodeBlockEnhancer.test.ts`
- Create: `app/components/article/CodeBlockEnhancer.client.ts`

- [ ] **Step 1: 写失败测试**

Create `tests/unit/CodeBlockEnhancer.test.ts`：

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { enhanceCodeBlocks } from '~/app/components/article/CodeBlockEnhancer.client'

describe('enhanceCodeBlocks', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('空容器不抛错', () => {
    expect(() => enhanceCodeBlocks(container)).not.toThrow()
  })

  it('给 <pre><code> 注入复制按钮', () => {
    container.innerHTML = '<pre><code>const x = 1</code></pre>'
    enhanceCodeBlocks(container)
    const btn = container.querySelector('.code-copy-btn')
    expect(btn).not.toBeNull()
  })

  it('data-enhanced 守护：重复调用不重复注入', () => {
    container.innerHTML = '<pre><code>x</code></pre>'
    enhanceCodeBlocks(container)
    enhanceCodeBlocks(container)
    const buttons = container.querySelectorAll('.code-copy-btn')
    expect(buttons.length).toBe(1)
  })

  it('点击复制按钮调用 navigator.clipboard.writeText', async () => {
    // mock clipboard
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    container.innerHTML = '<pre><code>const x = 1</code></pre>'
    enhanceCodeBlocks(container)
    const btn = container.querySelector('.code-copy-btn') as HTMLButtonElement
    await btn.click()
    expect(writeText).toHaveBeenCalledWith('const x = 1')
  })

  it('复制成功后按钮显示"已复制"文字', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
    container.innerHTML = '<pre><code>x</code></pre>'
    enhanceCodeBlocks(container)
    const btn = container.querySelector('.code-copy-btn') as HTMLButtonElement
    await btn.click()
    expect(btn.textContent).toContain('已复制')
  })
})
```

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/unit/CodeBlockEnhancer.test.ts
```

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 写实现**

Create `app/components/article/CodeBlockEnhancer.client.ts`：

```ts
/**
 * 在已渲染的 Markdown HTML 容器内，
 * 给所有 <pre><code> 块注入复制按钮。
 *
 * 只在客户端调用（文件后缀 .client.ts → Nuxt 不打包到 SSR）。
 */
export function enhanceCodeBlocks(container: HTMLElement): void {
  const blocks = container.querySelectorAll<HTMLPreElement>('pre > code')
  blocks.forEach((codeEl) => {
    const pre = codeEl.parentElement as HTMLPreElement
    if (!pre || pre.dataset.enhanced) return
    pre.dataset.enhanced = '1'
    pre.style.position = 'relative'

    const btn = document.createElement('button')
    btn.className = 'code-copy-btn'
    btn.type = 'button'
    btn.setAttribute('aria-label', '复制代码')

    const originalContent =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">' +
      '<rect x="9" y="9" width="13" height="13" rx="2"/>' +
      '<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
    btn.innerHTML = originalContent

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEl.innerText)
        btn.classList.add('copied')
        btn.innerHTML = '<span>已复制</span>'
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = originalContent
        }, 1500)
      } catch {
        btn.innerHTML = '<span>复制失败</span>'
        setTimeout(() => {
          btn.innerHTML = originalContent
        }, 1500)
      }
    })

    pre.appendChild(btn)
  })
}
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/unit/CodeBlockEnhancer.test.ts
```

Expected: 5 passed。

- [ ] **Step 5: Commit**

```bash
git add app/components/article/CodeBlockEnhancer.client.ts tests/unit/CodeBlockEnhancer.test.ts
git commit -m "feat(article-reader): add CodeBlockEnhancer for code block copy buttons"
```

---

## Task 10: 实现 `ArticleReader` 组件（TDD）

**Files:**
- Create: `tests/component/ArticleReader.test.ts`
- Create: `app/components/article/ArticleReader.vue`

- [ ] **Step 1: 写失败测试 - 标题/正文/标签渲染**

Create `tests/component/ArticleReader.test.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleReader from '~/app/components/article/ArticleReader.vue'
import type { Article } from '~/types/article'

const sample: Article = {
  id: 1,
  title: 'GPT-5 发布',
  summary: 'AI 能力再次飞跃',
  content: '第一段。\n\n第二段。',
  category_name: '动态',
  source_name: '机器之心',
  published_at: '2026-03-30',
  view_count: 1200,
  comment_count: 34,
  like_count: 56,
  tags: ['GPT-5', 'OpenAI'],
  author: 'AI观察',
  original_url: 'https://example.com/article',
}

describe('ArticleReader', () => {
  it('渲染标题', () => {
    const wrapper = mount(ArticleReader, { props: { article: sample } })
    expect(wrapper.find('h1').text()).toBe('GPT-5 发布')
  })

  it('渲染摘要', () => {
    const wrapper = mount(ArticleReader, { props: { article: sample } })
    expect(wrapper.text()).toContain('AI 能力再次飞跃')
  })

  it('渲染标签', () => {
    const wrapper = mount(ArticleReader, { props: { article: sample } })
    expect(wrapper.text()).toContain('GPT-5')
    expect(wrapper.text()).toContain('OpenAI')
  })

  it('根元素带 theme-dark size-md 默认 class', () => {
    const wrapper = mount(ArticleReader, { props: { article: sample } })
    const root = wrapper.find('.article-reader')
    expect(root.classes()).toContain('theme-dark')
    expect(root.classes()).toContain('size-md')
  })

  it('showProgress=false 时不渲染进度条', () => {
    const wrapper = mount(ArticleReader, { props: { article: sample, showProgress: false } })
    expect(wrapper.find('.reading-progress').exists()).toBe(false)
  })

  it('showToolbar=false 时不渲染工具栏', () => {
    const wrapper = mount(ArticleReader, { props: { article: sample, showToolbar: false } })
    expect(wrapper.find('[role="toolbar"]').exists()).toBe(false)
  })

  it('content 为空时显示兜底文案', () => {
    const empty = { ...sample, content: undefined }
    const wrapper = mount(ArticleReader, { props: { article: empty } })
    expect(wrapper.text()).toContain('暂无正文内容')
  })

  it('content 含 Markdown 渲染为 HTML', () => {
    const md = { ...sample, content: '## 子标题\n\n**粗体**' }
    const wrapper = mount(ArticleReader, { props: { article: md } })
    const body = wrapper.find('.reader-body')
    expect(body.html()).toContain('<h2>子标题</h2>')
    expect(body.html()).toContain('<strong>粗体</strong>')
  })
})
```

- [ ] **Step 2: 跑测试，确认失败**

Run:
```bash
pnpm test:run tests/component/ArticleReader.test.ts
```

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 写 ArticleReader 组件 - 模板和脚本骨架**

Create `app/components/article/ArticleReader.vue`：

```vue
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
    <ReaderToolbar v-if="showToolbar" v-model:font-size="fontSize" v-model:theme="theme" />

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
```

- [ ] **Step 4: 跑测试，应该全过**

Run:
```bash
pnpm test:run tests/component/ArticleReader.test.ts
```

Expected: 8 passed。

- [ ] **Step 5: Commit**

```bash
git add app/components/article/ArticleReader.vue tests/component/ArticleReader.test.ts
git commit -m "feat(article-reader): add ArticleReader main component with 3 themes and 3 sizes"
```

---

## Task 11: 改写 `pages/articles/[id].vue` 为薄壳

**Files:**
- Modify: `pages/articles/[id].vue`（完整重写）

- [ ] **Step 1: 备份现有页面（保险，可选）**

Run:
```bash
cp pages/articles/[id].vue pages/articles/[id].vue.bak
```

- [ ] **Step 2: 重写页面**

Overwrite `pages/articles/[id].vue` 为：

```vue
<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
            </NuxtLink>
            <nav class="hidden lg:flex items-center gap-6">
              <NuxtLink to="/" class="text-[#8b949e] hover:text-white transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-white hover:text-[#58a6ff] transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-[#8b949e] hover:text-white transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-[#8b949e] hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <template v-if="user">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-white font-medium text-sm hidden md:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button @click="handleLogout" class="text-[#8b949e] hover:text-white transition-colors font-medium text-xs sm:text-sm">退出</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium text-sm">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl">注册</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- 面包屑 -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <nav class="flex items-center gap-2 text-sm text-[#8b949e]">
        <NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/articles" class="hover:text-white transition-colors">资讯</NuxtLink>
        <span>/</span>
        <span class="text-white truncate">{{ article?.title || '文章详情' }}</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#58a6ff]"></div>
      <p class="text-[#8b949e] mt-3">加载中...</p>
    </div>

    <!-- 详情主体 -->
    <ArticleReader v-else-if="article" :article="article" />

    <!-- 错误状态 -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
      <svg class="mx-auto w-20 h-20 text-[#30363d] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h2 class="text-2xl font-bold text-white mb-3">文章不存在</h2>
      <p class="text-[#8b949e] mb-8">该文章可能已被删除或链接已失效</p>
      <NuxtLink to="/articles" class="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-medium transition-colors">
        返回资讯列表
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { articleApi } from '~/app/lib/api'
import type { Article } from '~/types/article'

const route = useRoute()
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

onMounted(() => { restoreAuth() })

const handleLogout = async () => {
  try {
    await articleApi.getCategories()  // 占位：触发 import
    const { authApi } = await import('~/app/lib/api')
    await authApi.logout()
    toastSuccess('已退出登录')
  } catch (error) {
    console.error('Logout failed', error)
    toastError('退出登录失败')
  } finally {
    clearAuth()
    navigateTo('/')
  }
}

const article = ref<Article | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) return
  try {
    const data = await articleApi.getById(id)
    if (data && (data as Article).id) {
      article.value = data as Article
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
  } finally {
    loading.value = false
  }
})
</script>
```

- [ ] **Step 3: 跑 typecheck**

Run:
```bash
pnpm typecheck
```

Expected: 0 errors（除了可能遗留的 0 个本计划无关的旧错误）。

- [ ] **Step 4: 跑全部测试**

Run:
```bash
pnpm test:run
```

Expected: 所有测试通过（renderer: 18, useArticleRender: 5, useReaderPrefs: 7, CodeBlockEnhancer: 5, ReadingProgress: 4, ReaderToolbar: 8, ArticleReader: 8 = 55 个）。

- [ ] **Step 5: 跑 lint**

Run:
```bash
pnpm lint
```

Expected: 0 errors。如果有 warn，记录但不阻塞。

- [ ] **Step 6: 删掉备份**

Run:
```bash
rm pages/articles/[id].vue.bak
```

- [ ] **Step 7: Commit**

```bash
git add pages/articles/[id].vue
git commit -m "refactor(article-reader): rewrite detail page as thin shell using ArticleReader"
```

---

## Task 12: 浏览器自测 3 篇文章

**Files:** 无文件改动（手动验证）

- [ ] **Step 1: 启动 dev server（后台）**

Run:
```bash
pnpm dev
```

Wait until 输出 `Local: http://localhost:3000`。这一步可能花 10-30 秒。

- [ ] **Step 2: 用 Playwright 抓 3 篇文章的 ID**

Create `tests/e2e/_collect-ids.cjs`（一次性脚本）：

```js
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/articles', { waitUntil: 'networkidle' })
  const ids = await page.$$eval('a[href^="/articles/"]', (links) =>
    links
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && /^\/articles\/\d+$/.test(h))
      .map((h) => h.split('/').pop())
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 3)
  )
  console.log(JSON.stringify(ids))
  await browser.close()
})()
```

Run:
```bash
node tests/e2e/_collect-ids.cjs
```

Expected: 输出 3 个数字 ID 的 JSON 数组，例如 `[1,2,3]`。

- [ ] **Step 3: 准备 3 篇文章的 content 形态分类（人工/自动混合）**

人工目测或运行下列 curl 判断：

```bash
# 纯文本型
curl -s http://localhost:3000/api/articles/1 | head -c 500
# 含 markdown 型（找带 # 或 **）
curl -s http://localhost:3000/api/articles/2 | head -c 500
# 富格式型（含 ```代码块```）
curl -s http://localhost:3000/api/articles/3 | head -c 500
```

如果现有数据里 3 种形态凑不齐，跳到第 5 步，从管理后台手动加 1-2 篇覆盖缺失形态。

- [ ] **Step 4: 在浏览器里打开 3 篇文章，人工确认**

For each ID in [step 2 输出的 ID 列表]:
- 打开 `http://localhost:3000/articles/<ID>`
- 确认：标题、摘要、来源、日期、标签、统计都正确显示
- 确认：正文有正确段间距（不是单 `<br>` 串起来）
- 确认：如果是 markdown 文章，标题/列表/链接/代码块都渲染
- 确认：进度条随滚动增长
- 确认：代码块右上角 hover 出现复制按钮，点击可复制
- 确认：工具栏切换字号生效，切换主题生效（dark/light/sepia 三态）
- 确认：滚动超过 600px 后右下角"返回顶部"按钮浮现
- 确认：刷新页面后主题/字号保留（localStorage 持久化）

- [ ] **Step 5: 删除一次性收集脚本**

Run:
```bash
rm tests/e2e/_collect-ids.cjs
```

- [ ] **Step 6: 关闭 dev server**

Kill the background `pnpm dev` process (Ctrl-C in the original terminal, or `pkill -f "nuxt dev"` if separate).

- [ ] **Step 7: 记录人工验收结果**

在 commit message 里 or 一个临时文件 `docs/superpowers/notes/article-reader-smoke-2026-06-07.md` 里记录 3 篇文章的人工验收结果（标题、观察到的形态、是否通过）。这是给后续 review 者的痕迹。

- [ ] **Step 8: Commit（如有 notes）**

```bash
git add docs/superpowers/notes/article-reader-smoke-2026-06-07.md
git commit -m "docs(article-reader): record browser smoke test results for 3 articles"
```

---

## Task 13: Lighthouse a11y 检查

**Files:** 无文件改动（手动验证）

- [ ] **Step 1: 启动 dev server**

Run:
```bash
pnpm dev
```

Wait until `Local: http://localhost:3000` 出现。

- [ ] **Step 2: 跑 Lighthouse（Playwright + lighthouse 或 chrome devtools）**

使用 Chrome DevTools → Lighthouse → 仅勾选 Accessibility → Analyze：

针对 URL: `http://localhost:3000/articles/<任一 ID>`

Expected score: ≥ 95。

如果低于 95，常见扣分项和修法：
- 颜色对比度：调整 `.theme-light` 下的 muted 色
- ARIA 标签：检查所有按钮有 `aria-label`
- 标题层级：保证 `<h1>` 唯一且按层级递减

- [ ] **Step 3: 关 dev server**

Kill background process.

- [ ] **Step 4: 在 PR 描述里记录 a11y 分数**

> 自行手动跑 lighthouse 并把分数和上面发现的问题贴到 PR 描述里。

---

## 完成验证清单

- [ ] Task 1-11 的所有 commit 都在 git log 里按顺序
- [ ] `pnpm test:run` 全部通过（≥ 55 个测试）
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm lint` 0 errors
- [ ] 浏览器自测 3 篇文章全部通过
- [ ] Lighthouse a11y ≥ 95

---

## 已知风险与回退

1. **`markdown-it` 与 `marked` 共存**：体积成本 + 包大小监控。如未来要做统一，回到本文档记录原因。
2. **SSR 闪烁**：localStorage 恢复前的 1 帧视觉跳变，目前用 CSS `transition: background 200ms, color 200ms` 兜底；如用户强烈不满，可加 `data-prefers-dark` 媒体查询预设。
3. **`prefers-reduced-motion`**：进度条和工具栏的过渡动画未来应尊重用户偏好。本计划暂未实现。
4. **`CodeBlockEnhancer` 注入时机**：依赖 `onMounted` + `nextTick`。如果未来 `ArticleReader` 的 `v-html` 改成异步渲染（例如 streaming markdown），需重新设计注入时机。
5. **并行实现 `app/(public)/articles/page.vue`**：本次未动。两次详情实现并存是已知的临时状态，应在未来清理。
6. **Spec §10 性能优化的实现偏离**：Spec 要求 `useArticleRender` 内 `await import(...)` 做动态导入；本计划 Task 4-11 用的是**顶层静态 import**（更简单、测试更好写）。如果生产环境需要把 markdown-it (~110KB) + isomorphic-dompurify (~70KB) 从首屏剥离，参考 Task 14。

---

## Task 14（可选）: 性能优化 - 代码分割

**前提条件**：先跑一次 `pnpm build` + `pnpm preview` 查产物大小，确认 `/articles/[id]` 路由的首屏 JS bundle 是否包含 `markdown-it` / `isomorphic-dompurify`（应包含 —— 因为 ArticleReader 是同步引入）。如果 < 200KB gzip 且可接受，**本任务可跳过**。

**Files:**
- Modify: `app/components/article/ArticleReader.vue`
- Modify: `pages/articles/[id].vue`

- [ ] **Step 1: 在 ArticleReader.vue 内对 renderer 做 async 化**

Replace the static imports at the top of `<script setup>` in `app/components/article/ArticleReader.vue`：

```ts
// 旧的（同步）
import { renderArticleHtml } from '~/app/lib/reader/renderer'

// 新的（异步）
async function getRenderer() {
  const mod = await import('~/app/lib/reader/renderer')
  return mod.renderArticleHtml
}
```

- [ ] **Step 2: 把 useArticleRender 改为返回 Promise 包装**

在 `app/composables/useArticleRender.ts` 改为：

```ts
import { ref, watchEffect, type Ref } from 'vue'

export function useArticleRender(
  content: Ref<string | undefined> | (() => string | undefined)
) {
  const getter = typeof content === 'function' ? content : () => content.value
  const html = ref<string>('')
  let lastRendered = ''

  watchEffect(async () => {
    const raw = getter() ?? ''
    if (!raw) { html.value = ''; return }
    if (raw === lastRendered) return
    lastRendered = raw
    const { renderArticleHtml } = await import('~/app/lib/reader/renderer')
    html.value = renderArticleHtml(raw)
  })

  return { html }
}
```

- [ ] **Step 3: 在 ArticleReader.vue 用 Suspense 包裹**

Template 顶部改为：

```vue
<template>
  <article ref="rootEl" :class="...">
    <Suspense>
      <template #default>
        <!-- 原有 header / 进度条 / 工具栏 / 主体 / footer -->
        <div v-if="article.content" ref="bodyEl" class="reader-body" v-html="html" />
      </template>
      <template #fallback>
        <div class="reader-skeleton">正在加载正文...</div>
      </template>
    </Suspense>
  </article>
</template>
```

- [ ] **Step 4: 跑全部测试，更新失败的测试为 async**

跑：
```bash
pnpm test:run
```

针对失败的 ArticleReader / useArticleRender 测试，把 `mount()` 改为 `await mount()`，把 `expect(wrapper.find(...))` 包在 `await flushPromises()` 之后。

- [ ] **Step 5: 跑 typecheck + build + 产物分析**

```bash
pnpm typecheck
pnpm build
ls -lah .output/public/_nuxt/ | grep markdown
```

Expected: 看到 `markdown-*.js` 之类的独立 chunk（说明已被分割出去）。

- [ ] **Step 6: 浏览器验证骨架屏出现 → 正文渲染**

启动 dev，访问文章详情页，**应该看到一瞬间骨架文字**（"正在加载正文..."），然后正文 fade in。

- [ ] **Step 7: Commit**

```bash
git add app/components/article/ArticleReader.vue app/composables/useArticleRender.ts tests/
git commit -m "perf(article-reader): code-split markdown renderer via dynamic import"
```

**回退**：如果引入 Suspense 后体验反而差（闪烁更严重），直接 `git revert <commit>` 回滚。
