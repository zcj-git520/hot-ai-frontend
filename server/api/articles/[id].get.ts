export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'
  
  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少文章ID'
    })
  }

  const url = `${API_BASE_URL}/articles/${id}`
  const res = await fetch(url)
  const data = await res.json()

  return data
})
