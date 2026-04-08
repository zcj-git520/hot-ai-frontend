export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'
  
  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.category_id) params.set('category_id', String(query.category_id))
  if (query.risk_level) params.set('risk_level', String(query.risk_level))
  if (query.keyword) params.set('keyword', String(query.keyword))

  const url = `${API_BASE_URL}/professions?${params.toString()}`
  const res = await fetch(url)
  return res.json()
})
