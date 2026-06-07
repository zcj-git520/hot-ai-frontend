import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingProgress from '~/app/components/article/ReadingProgress.vue'

describe('ReadingProgress', () => {
  beforeEach(() => {
    // jsdom 不实现 window.scrollTo，用 stub 静默
    window.scrollTo = vi.fn()
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
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 5000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    window.scrollTo(0, 0)

    const wrapper = mount(ReadingProgress)
    expect(wrapper.find('.bar').element.style.width).toBe('0%')
  })

  it('卸载时移除 scroll 监听', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(ReadingProgress)
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
