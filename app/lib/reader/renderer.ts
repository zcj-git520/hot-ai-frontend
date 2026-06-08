import MarkdownIt from 'markdown-it'
import DOMPurify from 'isomorphic-dompurify'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
})

// 外部链接自动加 target="_blank" rel="noopener noreferrer"
const defaultLinkOpen = md.renderer.rules.link_open ||
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const hrefIdx = token.attrIndex('href')
  const href = hrefIdx >= 0 ? token.attrs![hrefIdx][1] : ''
  if (/^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'blockquote',
  'ul', 'ol', 'li',
  'strong', 'em', 'code', 'pre', 'a',
  'img', 'figure', 'figcaption',
  'video', 'source', 'picture',
]
const ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'id',
  'loading', 'srcset', 'sizes', 'width', 'height', 'decoding',
  'poster', 'controls', 'preload', 'autoplay', 'muted', 'loop', 'playsinline',
  'allow', 'allowfullscreen', 'frameborder',
]

const looksLikeHtml = (s: string): boolean => {
  const t = s.trim()
  return /^<[a-zA-Z][^>]*>/.test(t)
}

const proxyImageUrl = (url: string): string => {
  if (!url) return url
  if (url.startsWith('data:')) return url
  if (url.startsWith('/')) return url
  if (!/^https?:\/\//i.test(url)) return url
  return `/img-proxy?url=${encodeURIComponent(url)}`
}

const proxySrcset = (srcset: string): string => {
  return srcset
    .split(',')
    .map(part => {
      const trimmed = part.trim()
      const match = trimmed.match(/^(\S+)(\s+.*)?$/)
      if (!match) return part
      return `${proxyImageUrl(match[1])}${match[2] || ''}`
    })
    .join(', ')
}

const IMG_SRC_RE = /(<img\b[^>]*?\bsrc=)(["'])(https?:\/\/[^"']+)\2/gi
const SOURCE_SRC_RE = /(<source\b[^>]*?\bsrc=)(["'])(https?:\/\/[^"']+)\2/gi
const VIDEO_SRC_RE = /(<video\b[^>]*?\bsrc=)(["'])(https?:\/\/[^"']+)\2/gi
const POSTER_RE = /(<video\b[^>]*?\bposter=)(["'])(https?:\/\/[^"']+)\2/gi
const SRCSET_RE = /(\bsrcset=)(["'])([^"']+)\2/gi
const HARDEN_RE = /<a\s+([^>]*?)href=(["'])(https?:\/\/[^"']+)\2/gi

const proxyAndHarden = (html: string): string => {
  return html
    .replace(IMG_SRC_RE, (_m, pre, q, url) => `${pre}${q}${proxyImageUrl(url)}${q}`)
    .replace(SOURCE_SRC_RE, (_m, pre, q, url) => `${pre}${q}${proxyImageUrl(url)}${q}`)
    .replace(VIDEO_SRC_RE, (_m, pre, q, url) => `${pre}${q}${proxyImageUrl(url)}${q}`)
    .replace(POSTER_RE, (_m, pre, q, url) => `${pre}${q}${proxyImageUrl(url)}${q}`)
    .replace(SRCSET_RE, (_m, pre, q, srcset) => `${pre}${q}${proxySrcset(srcset)}${q}`)
    .replace(HARDEN_RE, (_m, attrs, q, href) => {
      let next = attrs
      if (!/\btarget\s*=/i.test(next)) next += ' target="_blank"'
      if (!/\brel\s*=/i.test(next)) next += ' rel="noopener noreferrer"'
      return `<a ${next}href=${q}${href}${q}`
    })
}

export function renderArticleHtml(raw: string): string {
  if (!raw) return ''
  const source = looksLikeHtml(raw) ? proxyAndHarden(raw) : md.render(raw)
  return DOMPurify.sanitize(source, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}
