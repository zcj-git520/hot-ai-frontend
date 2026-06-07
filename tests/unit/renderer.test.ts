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
    expect(html).toMatch(/<ul>[\s\S]*<li>a<\/li>[\s\S]*<li>b<\/li>[\s\S]*<\/ul>/)
  })

  it('有序列表渲染为 <ol><li>', () => {
    const html = renderArticleHtml('1. a\n2. b')
    expect(html).toMatch(/<ol>[\s\S]*<li>a<\/li>[\s\S]*<li>b<\/li>[\s\S]*<\/ol>/)
  })

  it('> 引用渲染为 <blockquote>', () => {
    const html = renderArticleHtml('> 一句话')
    expect(html).toMatch(/<blockquote>[\s\S]*一句话[\s\S]*<\/blockquote>/)
  })
})

describe('renderArticleHtml - XSS 防护', () => {
  it('注入 <script> 被过滤（被转义为文本）', () => {
    const html = renderArticleHtml('<script>alert(1)</script>')
    // markdown-it html:false 会把 <script> 转义为 &lt;script&gt; —— 浏览器渲染为纯文本
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('注入 <img onerror=...> 被转义（事件属性不会执行）', () => {
    const html = renderArticleHtml('<img src="x" onerror="alert(1)">')
    // 整个 <img> 标签被转义为文本，不会有真实 onerror 属性
    expect(html).not.toMatch(/<img\s/)
    expect(html).toContain('&lt;img')
  })

  it('注入 javascript: URL 链接被过滤协议', () => {
    const html = renderArticleHtml('[点我](javascript:alert(1))')
    expect(html).not.toMatch(/href="javascript:/)
  })

  it('注入 <iframe> 被过滤（被转义为文本）', () => {
    const html = renderArticleHtml('<iframe src="https://evil.com"></iframe>')
    expect(html).not.toContain('<iframe')
    expect(html).toContain('&lt;iframe')
  })
})
