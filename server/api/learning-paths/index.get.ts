export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.difficulty) params.set('difficulty', String(query.difficulty))

  const url = `${API_BASE_URL}/learning-paths?${params.toString()}`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
