# 文章详情页「读者视角」渲染改造 · 设计文档

- **日期**：2026-06-07
- **范围**：`pages/articles/[id].vue` 详情页主体渲染 + 阅读辅助
- **状态**：已通过 brainstorming，待用户审阅

---

## 1. 背景与动机

### 1.1 现状

详情页 `pages/articles/[id].vue` 的正文渲染逻辑只有一行：

```ts
const formatContent = (content: string) =>
  content.replace(/\n/g, '<br>')
```

它把"给什么就渲染什么"做到了极致：后端原文输出 → `\n` 换行 → `<br>` 标签。导致：

- **段间距丢失**：`\n\n`（段落分隔）和 `\n`（行分隔）被同样处理为单个 `<br>`，段落之间没有视觉留白
- **Markdown 符号裸露**：管理员/爬虫可能录入的 `**粗体**`、`# 标题`、`` `代码` ``、`[链接](url)` 全部以字面量显示
- **代码块无样式**：纯文本里的代码段不会变 mono 字体、没有边框、没有复制能力
- **无阅读辅助**：没有进度条、没有字号/主题切换、没有返回顶部
- **可访问性差**：直接 `v-html` 注入，没有 sanitize；`html: false` 也没启用

### 1.2 后端数据形态

经查后端 migrations（`002_seed_article_data.sql`）和 `apps/content-svc/handler/article_handler.go`：

- `articles.content` 是 MySQL `longtext` 字段
- 后端不做任何转换，原样透传给前端
- 种子数据是纯中文段落 + `\n\n` 分段
- 后端没有 markdown 库依赖（只有 `learning-path-svc` 的章节内容被声明为 Markdown）
- 管理员后台可能手动录入含 Markdown 符号的内容

**结论**：主力数据是纯文本，但需"宽松地"接受 Markdown 边缘情况。

---

## 2. 目标与非目标

### 2.1 目标

- 详情页正文提供**适合长文阅读**的排版（字号、行距、段间距、字宽）
- **Markdown 友好**：纯文本自然呈现，链接/标题/代码块/列表/引用渲染正确
- 提供 4 个阅读辅助：顶部进度条 / 代码块复制按钮 / 返回顶部 / 字号与主题切换
- 视觉风格延续项目科技感（青→紫渐变）+ 暗色阅读底
- 保留 SSR 能力，不破 SEO
- 关键风险点：XSS、闪烁、首屏体积

### 2.2 非目标（本次不做）

- 相关文章推荐、上下篇导航
- 收藏 / 分享 / 关注作者
- 评论、点赞交互
- 学习路径章节 reader 改造
- 详情页 SEO meta 改造
- `app/(public)/articles/page.vue`（cyber 风格版本）的合并或重做
- 代码语法高亮（shiki/highlight.js）

---

## 3. 用户已选决策

| 维度 | 决定 |
|---|---|
| 范围 | 详情页主体渲染 + 阅读辅助 |
| 视觉风格 | C：科技 + 阅读（暗色 + 青→紫渐变点缀） |
| 渲染管线 | markdown-it + isomorphic-dompurify（无代码高亮） |
| 阅读辅助 | 顶部进度条 + 代码块复制按钮 + 返回顶部 + 字号/主题切换 |
| 架构 | A：单组件大块 + 2 个 composables |
| 主题档位 | dark（默认）/ light / sepia |
| 字号档位 | sm (14px) / md (16px, 默认) / lg (18px) |

---

## 4. 文件结构

### 4.1 新增

```
app/
├── components/article/                       ← 新建
│   ├── ArticleReader.vue                     (~280 行)  详情页主体
│   ├── ReadingProgress.vue                   (~25 行)   顶部进度条
│   ├── ReaderToolbar.vue                     (~80 行)   字号/主题/返回顶部
│   └── CodeBlockEnhancer.client.ts           (~40 行)   代码块注入复制按钮
├── lib/reader/                                ← 新建
│   └── renderer.ts                            (~50 行)   markdown-it + DOMPurify 单例
└── composables/
    ├── useArticleRender.ts                   (~35 行)   渲染管线包装
    └── useReaderPrefs.ts                     (~55 行)   字号/主题 + 持久化

types/
└── article.ts                                 (~20 行)   Article 类型
```

### 4.2 改动

- `pages/articles/[id].vue`：改写为薄壳，只取数据 + 调 `<ArticleReader :article="article" />`；删除原 `formatContent()`

### 4.3 新增依赖（package.json）

```json
"dependencies": {
  "markdown-it": "^14.1.0",
  "isomorphic-dompurify": "^2.16.0"
},
"devDependencies": {
  "@types/markdown-it": "^14.1.2"
}
```

**注意**：用 `isomorphic-dompurify`（非 `dompurify`），避免 SSR 时 `window` 缺失报错。

---

## 5. 数据流

```
pages/articles/[id].vue
  └─ articleApi.getById(id)
     └─ <ArticleReader :article="article" :max-width="'md'" />
        ├─ useArticleRender(() => article.content)
        │   └─ 调 renderer.renderArticleHtml(raw) → 安全 HTML
        ├─ useReaderPrefs()
        │   └─ fontSize / theme（模块单例 ref + localStorage 持久化）
        ├─ <ReadingProgress target=".article-reader" />
        ├─ <ReaderToolbar v-model:font-size v-model:theme />
        └─ onMounted → CodeBlockEnhancer.enhanceCodeBlocks(bodyEl)
```

---

## 6. 组件设计

### 6.1 `ArticleReader.vue`

**Props**

```ts
interface Props {
  article: Article
  showProgress?: boolean    // 默认 true
  showToolbar?: boolean     // 默认 true
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'   // 默认 'md'，对应 4xl/5xl/6xl/7xl
}
```

**模板结构**（从上到下）：

1. `<header>` 标题区：分类徽章 + 日期 + 来源 + 阅读时长
2. `<h1>` 文章标题
3. `<p v-if="article.summary">` 摘要
4. `<ReadingProgress v-if="showProgress" />`（fixed 定位，独立组件）
5. `<ReaderToolbar v-if="showToolbar" />`（fixed 定位右下，独立组件）
6. 统计行（阅读/评论/点赞），字段缺失不渲染
7. 标签行，`v-if="article.tags?.length"`
8. `<div class="reader-body" v-html="renderedHtml" ref="bodyEl" />` —— 主体
9. 空内容兜底
10. `<footer>` 返回列表 / 原文链接

**关键实现**：

```ts
const bodyEl = ref<HTMLElement>()
const { html: renderedHtml } = useArticleRender(() => article.content)
const { fontSize, theme } = useReaderPrefs()
const readingTime = computed(() =>
  Math.max(1, Math.round((article.content?.length || 0) / 400)))

onMounted(async () => {
  await nextTick()
  if (bodyEl.value) enhanceCodeBlocks(bodyEl.value)
})
```

**主题/字号作用方式**：根元素加 `theme-${theme}` 与 `size-${fontSize}` class，由 scoped CSS 用 CSS 变量驱动派生样式。**不**用 v-if 切多套 stylesheet，不 dynamic import。

**容器宽度映射**：

| `maxWidth` | 实际 Tailwind 类 |
|---|---|
| `sm` | `max-w-3xl` (768px) |
| `md`（默认）| `max-w-4xl` (896px) |
| `lg` | `max-w-5xl` (1024px) |
| `xl` | `max-w-6xl` (1152px) |

### 6.2 `ReadingProgress.vue`

- 固定顶部，3px 高，青→紫渐变填充
- 用 `requestAnimationFrame` 节流 scroll/resize
- 用 `getBoundingClientRect().top` 负值算滚动百分比
- `aria-valuenow` 同步可访问性

### 6.3 `ReaderToolbar.vue`

- 固定右下角，垂直堆叠 3 个圆角按钮组
- 字号组：3 个 `A` 按钮，文字 12/14/16px 示意当前档位
- 主题组：3 个色点按钮（深灰/白/米色）
- 返回顶部：默认隐藏，scrollY > 600 浮现；带渐变发光阴影
- 移动端（<768px）整体缩小到 32px

### 6.4 `CodeBlockEnhancer.client.ts`

- `.client.ts` 后缀 → Nuxt 不打进 SSR bundle
- 在 `ArticleReader` 的 `onMounted` 里调用，对 `bodyEl` 内的 `pre > code` 注入：
  - 右上角 hover 才出现的复制按钮
  - 复制成功显示"已复制"1.5s 后回退
  - `data-enhanced` 标记防重复注入

---

## 7. 渲染管线

### 7.1 `app/lib/reader/renderer.ts`

```ts
import MarkdownIt from 'markdown-it'
import DOMPurify from 'isomorphic-dompurify'

const md = new MarkdownIt({
  html: false,        // 防 XSS 第一道闸：拒绝原始 HTML 输入
  linkify: true,      // 自动识别 URL 为链接
  typographer: true,  // 智能中文标点
  breaks: true,       // 单 \n → <br>（保留现有行为）
})

// 外部链接自动新窗口
const defaultLinkOpen = md.renderer.rules.link_open
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const href = token.attrGet('href') || ''
  if (/^https?:\/\//.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return (defaultLinkOpen ?? self.renderToken.bind(self))(tokens, idx, options, env, self)
}

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

### 7.2 `app/composables/useArticleRender.ts`

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

### 7.3 `app/composables/useReaderPrefs.ts`

```ts
import { ref, watch } from 'vue'

export type FontSize = 'sm' | 'md' | 'lg'
export type Theme = 'dark' | 'light' | 'sepia'

const STORAGE_KEY = 'reader-prefs'
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
    if (['sm','md','lg'].includes(parsed.fontSize)) fontSize.value = parsed.fontSize
    if (['dark','light','sepia'].includes(parsed.theme)) theme.value = parsed.theme
  } catch {/* 损坏的 storage 静默忽略 */}
}

let saveTimer: number | undefined
watch([fontSize, theme], () => {
  if (typeof window === 'undefined') return
  clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fontSize: fontSize.value, theme: theme.value
      }))
    } catch {/* 隐私模式静默 */}
  }, 200)
})

export function useReaderPrefs() {
  loadFromStorage()
  return { fontSize, theme }
}
```

**关键决策**：模块级单例 ref，保证 toolbar 与 reader 内部对同一状态读写一致。

### 7.4 类型

`types/article.ts`：

```ts
export interface Article {
  id: string | number
  title: string
  summary?: string
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

---

## 8. 错误处理与边界

| 场景 | 处理 |
|---|---|
| `article.content` 为空 | `.reader-body` 不渲染，下方显示"暂无正文"+原文链接 |
| 注入 `<script>` 等危险标签 | markdown-it `html: false` + DOMPurify 白名单双保险 |
| 图片 404 | 破损图标，不影响布局（白名单禁了事件属性） |
| 50KB+ 长文 | 渲染不卡；未来可加 `virtualScroll`（本次不做） |
| markdown/DOMPurify 异常 | 两者都容错，最坏显示源码 |
| 字段缺失（标签/统计为 0） | `v-if` 兜底，不显示空容器 |
| SSR 主题/字号未定 | 初始按 `md/dark` 渲染，客户端 `useReaderPrefs` 启动后从 localStorage 恢复，会有一帧视觉跳变（CSS `transition` 兜底） |
| localStorage 不可用 | `try/catch` 静默吞，工具栏仍可用 |
| 复制代码失败（旧浏览器） | catch 显示"复制失败"1.5s 回退 |
| 进度条 target 找不到 | 静默 0% |
| 移动端小屏 | 工具栏缩到 32px，间距收紧 |

---

## 9. 可访问性

- 进度条 `role="progressbar"` + `aria-valuenow`
- 工具栏 `role="toolbar"`，每组 `role="group"` + `aria-label`，按钮 `aria-label`
- 复制按钮 `aria-label="复制代码"`，复制成功切到文字"已复制"给屏幕阅读器
- 颜色对比度（dark/light/sepia 三套均 ≥ 9.8:1，AAA）
- 键盘可达：所有交互是 `<button>`，Tab 顺序自然

---

## 10. 性能

- **首屏体积**：`markdown-it` ~110KB gzip + `isomorphic-dompurify` ~70KB gzip ≈ 180KB gzip
- **优化**：在 `useArticleRender` 内部 `await import(...)` 异步加载库，`<ArticleReader>` 包在 `<Suspense>` 里；SSR 阶段渲染骨架，正文 ready 后 hydrate。**首屏 SEO 不掉，体感顺滑**
- **图片懒加载**：`:deep(img)` 模板强制 `loading="lazy"`
- **滚动节流**：`requestAnimationFrame` 节流 scroll/resize 回调
- **进度条计算**：CSS `transition: width 80ms linear` 视觉平滑，无需每帧算

---

## 11. 测试策略

| 层 | 工具 | 覆盖点 |
|---|---|---|
| `renderer.ts` 单测 | Vitest | 纯文本/标题/粗体/code/link 各自渲染正确；`<script>` 被过滤；空输入返回 `''` |
| `useReaderPrefs` 单测 | Vitest | 初始 `md/dark`；改字号写 localStorage；已有值恢复；损坏 JSON 不抛 |
| `useArticleRender` 单测 | Vitest | 输入变化 → 输出 computed 重算；空值不报错 |
| `ArticleReader` 组件测 | @vue/test-utils | 标题/正文/标签渲染；切主题/字号 → 根 class 变化；prop 控制显隐 |
| `CodeBlockEnhancer` 单测 | Vitest + happy-dom | 注入按钮；点击触发 clipboard；重复调用不重复注入 |
| E2E（可选） | Playwright | 切主题→刷新仍保留；复制代码后剪贴板正确 |

**Mock 边界**：renderer 测试用 happy-dom stub 即可，不拉起 Nuxt。

---

## 12. 实施分阶段（具体计划由 writing-plans 阶段产出）

1. 装依赖 + 写 `renderer.ts` + 单测
2. 写 `useArticleRender` + `useReaderPrefs` + 单测
3. 写 `ArticleReader.vue`（先用最朴素样式打通数据流）
4. 写 3 个辅助组件
5. 接入主题/字号 CSS 变量
6. 改造 `pages/articles/[id].vue`
7. 浏览器自测 3 篇文章（纯文本 / 含 markdown / 富格式）
8. Lighthouse a11y ≥ 95

---

## 13. 待用户审阅

请用户确认：
- 范围 / 非目标
- 视觉风格选择（C：科技 + 阅读）
- 主题档位（dark/light/sepia）
- 字号档位（sm/md/lg）
- 架构选型（A：单组件大块 + 2 composables）
- 性能优化策略（动态 import + Suspense）
- 测试覆盖范围

审阅通过后进入 writing-plans 阶段生成实施计划。
