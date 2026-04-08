export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'
  
  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.q) params.set('q', String(query.q))
  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))

  const url = `${API_BASE_URL}/professions/search?${params.toString()}`
  const res = await fetch(url)
  return res.json()
})
