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
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    container.innerHTML = '<pre><code>const x = 1</code></pre>'
    enhanceCodeBlocks(container)
    const btn = container.querySelector('.code-copy-btn') as HTMLButtonElement
    btn.click()
    await new Promise(r => setTimeout(r, 10))
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
    btn.click()
    await new Promise(r => setTimeout(r, 10))
    expect(btn.textContent).toContain('已复制')
  })
})
