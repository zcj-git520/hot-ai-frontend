export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const pathSlug = event.context.params?.path_slug
  const chapterSlug = event.context.params?.chapter_slug

  if (!pathSlug || !chapterSlug) {
    throw createError({
      statusCode: 400,
      message: '缺少学习路径slug或章节slug'
    })
  }

  const url = `${API_BASE_URL}/learning-paths/${pathSlug}/chapters/${chapterSlug}`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
