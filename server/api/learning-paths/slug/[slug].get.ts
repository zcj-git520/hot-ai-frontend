export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: '缺少学习路径slug'
    })
  }

  const url = `${API_BASE_URL}/learning-paths/slug/${slug}`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
