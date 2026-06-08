// 客户端增强: 为 <img> 添加错误兜底。
// 代理不可达时 (例如 lh3.googleusercontent.com 在服务端就被墙),
// 浏览器会触发 error 事件, 我们替换为占位块而不是显示默认的破图图标。

export function enhanceImages(root: HTMLElement): void {
  const imgs = root.querySelectorAll('img')
  imgs.forEach((img) => {
    if (img.dataset.enhanced === '1') return
    img.dataset.enhanced = '1'
    img.addEventListener(
      'error',
      () => {
        img.classList.add('img-failed')
        const original = img.getAttribute('alt') || ''
        if (!/\[图片加载失败\]/.test(original)) {
          img.setAttribute('alt', `${original} [图片加载失败]`)
        }
      },
      { once: true }
    )
  })
}
