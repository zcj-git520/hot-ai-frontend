export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const chapterId = event.context.params?.chapter_id
  if (!chapterId) {
    throw createError({
      statusCode: 400,
      message: '缺少章节ID'
    })
  }

  const url = `${API_BASE_URL}/chapters/${chapterId}`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
