import { describe, it, expect, beforeEach, vi } from 'vitest'
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
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

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
