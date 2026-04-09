export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const query = getQuery(event)
  const params = new URLSearchParams()
  if (query.limit) params.set('limit', String(query.limit))

  const url = `${API_BASE_URL}/learning-paths/featured?${params.toString()}`
  const res = await fetch(url)
  return res.json()
})
