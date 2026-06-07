/**
 * 在已渲染的 Markdown HTML 容器内，
 * 给所有 <pre><code> 块注入复制按钮。
 *
 * 只在客户端调用（文件后缀 .client.ts → Nuxt 不打包到 SSR）。
 */
export function enhanceCodeBlocks(container: HTMLElement): void {
  const blocks = container.querySelectorAll<HTMLPreElement>('pre > code')
  blocks.forEach((codeEl) => {
    const pre = codeEl.parentElement as HTMLPreElement
    if (!pre || pre.dataset.enhanced) return
    pre.dataset.enhanced = '1'
    pre.style.position = 'relative'

    const btn = document.createElement('button')
    btn.className = 'code-copy-btn'
    btn.type = 'button'
    btn.setAttribute('aria-label', '复制代码')

    const originalContent =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">' +
      '<rect x="9" y="9" width="13" height="13" rx="2"/>' +
      '<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
    btn.innerHTML = originalContent

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEl.textContent ?? '')
        btn.classList.add('copied')
        btn.innerHTML = '<span>已复制</span>'
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = originalContent
        }, 1500)
      } catch {
        btn.innerHTML = '<span>复制失败</span>'
        setTimeout(() => {
          btn.innerHTML = originalContent
        }, 1500)
      }
    })

    pre.appendChild(btn)
  })
}
