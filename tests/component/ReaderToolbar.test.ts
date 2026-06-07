import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReaderToolbar from '~/app/components/article/ReaderToolbar.vue'
import { ref } from 'vue'

function makeWrapper(initialFontSize: 'sm' | 'md' | 'lg' = 'md', initialTheme: 'dark' | 'light' | 'sepia' = 'dark') {
  const fontSize = ref(initialFontSize)
  const theme = ref(initialTheme)
  const wrapper = mount(ReaderToolbar, {
    props: {
      fontSize: fontSize.value,
      theme: theme.value,
      'onUpdate:fontSize': (v: 'sm' | 'md' | 'lg') => { fontSize.value = v },
      'onUpdate:theme': (v: 'dark' | 'light' | 'sepia') => { theme.value = v },
    },
  })
  return { wrapper, fontSize, theme }
}

describe('ReaderToolbar', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('渲染 role=toolbar', () => {
    const { wrapper } = makeWrapper()
    expect(wrapper.find('[role="toolbar"]').exists()).toBe(true)
  })

  it('渲染 3 个字号按钮，当前档位高亮', () => {
    const { wrapper } = makeWrapper('lg')
    const buttons = wrapper.findAll('[role="group"][aria-label="字号"] button')
    expect(buttons.length).toBe(3)
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
    Object.defineProperty(window, 'scrollY', { value: 800, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('.back-to-top')
    expect(btn.classes()).toContain('visible')
  })

  it('点击返回顶部按钮调用 window.scrollTo', async () => {
    const spy = vi.spyOn(window, 'scrollTo')
    const { wrapper } = makeWrapper()
    Object.defineProperty(window, 'scrollY', { value: 800, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('.back-to-top').trigger('click')
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
  })
})
