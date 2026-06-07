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
