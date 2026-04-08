export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'
  
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少职业ID'
    })
  }

  const url = `${API_BASE_URL}/professions/${id}`
  const res = await fetch(url)
  
  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      message: '职业不存在'
    })
  }
  
  return res.json()
})
