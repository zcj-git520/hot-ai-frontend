export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const pathId = event.context.params?.path_id
  if (!pathId) {
    throw createError({
      statusCode: 400,
      message: '缺少学习路径ID'
    })
  }

  const url = `${API_BASE_URL}/learning-paths/${pathId}/chapters`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
