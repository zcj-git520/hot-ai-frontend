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
