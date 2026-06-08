// 服务端图片代理: 浏览器通过 /img-proxy?url=... 拉取第三方图片,
// 由 Node 进程代为请求 (Node 端通常比浏览器端网络可达性更好)。
// 仅放行 http/https, 设置超时与缓存, 上游失败返回 502 让前端走兜底。

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const raw = query.url
  const url = Array.isArray(raw) ? raw[0] : raw
  if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid url' })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Malformed url' })
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported protocol' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HotAI-ImgProxy/1.0)',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    })
    if (!upstream.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: `Upstream ${upstream.status}`,
      })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const cacheControl = upstream.headers.get('cache-control') || 'public, max-age=86400'

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', cacheControl)
    setHeader(event, 'Access-Control-Allow-Origin', '*')

    const buffer = await upstream.arrayBuffer()
    return new Uint8Array(buffer)
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: `Proxy failed: ${err?.message || 'unknown'}`,
    })
  } finally {
    clearTimeout(timeout)
  }
})
