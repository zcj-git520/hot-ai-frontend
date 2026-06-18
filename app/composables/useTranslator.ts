import { computed, ref } from 'vue'

/**
 * 基于 translate.js (https://translate.zvo.cn) 的浏览器端翻译
 *
 * 为什么不自己调后端 LLM 翻译？
 *   - 文章正文长（数千字），单次 LLM 翻译慢 + 贵
 *   - translate.js 走的是工业级机器翻译 API（Edge / Google 等），毫秒级返回
 *   - 库自动处理 DOM 节点切片 / 缓存 / 监听
 *
 * 暴露的 API:
 *   configure(scopeEl)         - 限定翻译范围到 .article-reader，按需加载库
 *   translateTo('english')     - 译为英文（库内部会自动检测 source）
 *   translateTo('chinese_simplified') - 译为简体中文
 *   reset()                    - 还原原文
 */

const LIBRARY_URL = 'https://cdn.staticfile.net/translate.js/3.18.66/translate.js'

export type TargetLang = 'english' | 'chinese_simplified'

const _available = ref(false)
const _ready = ref(false)
const _translating = ref(false)
let _scriptLoading: Promise<boolean> | null = null

declare global {
  interface Window {
    translate?: any
  }
}

function loadLibrary(): Promise<boolean> {
  if (_scriptLoading) return _scriptLoading
  _scriptLoading = new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(false); return }
    if (window.translate && typeof window.translate.version === 'string') {
      _available.value = true
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = LIBRARY_URL
    script.async = true
    script.onload = () => {
      _available.value = true
      resolve(true)
    }
    script.onerror = () => {
      console.warn('[useTranslator] translate.js failed to load from', LIBRARY_URL)
      resolve(false)
    }
    document.head.appendChild(script)
  })
  return _scriptLoading
}

export function useTranslator() {
  if (typeof window !== 'undefined') {
    loadLibrary().catch(() => { /* 失败时 available 保持 false，按钮不渲染 */ })
  }
  const available = computed(() => _available.value)
  const ready = computed(() => _ready.value)
  const translating = computed(() => _translating.value)

  async function configure(scopeEl: HTMLElement | null) {
    if (typeof window === 'undefined') return
    const ok = await loadLibrary()
    if (!ok || !scopeEl) return
    const t = window.translate
    if (!t) return

    if (t.selectLanguageTag) t.selectLanguageTag.show = false
    if (typeof t.service?.use === 'function') t.service.use('client.edge')
    if (typeof t.setDocuments === 'function') t.setDocuments(scopeEl)

    if (!t.__hotaiHooked) {
      t.__hotaiHooked = true
      const finish = () => { _translating.value = false }
      t.lifecycle?.execute?.finally?.push?.(finish)
    }

    _ready.value = true
  }

  function translateTo(target: TargetLang) {
    if (!_ready.value) return
    const t = window.translate
    if (!t) return
    try {
      _translating.value = true
      t.changeLanguage(target)
    } catch (err) {
      console.error('[useTranslator] translateTo failed:', err)
      _translating.value = false
    }
  }

  function reset() {
    const t = window.translate
    if (!t) return
    try {
      t.reset()
    } catch (err) {
      console.error('[useTranslator] reset failed:', err)
    } finally {
      _translating.value = false
    }
  }

  return { available, ready, translating, configure, translateTo, reset }
}
