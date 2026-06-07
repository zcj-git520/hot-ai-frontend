import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

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
    await nextTick() // 让 watch 调度
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
    await nextTick() // 让 watch 调度
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
