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
