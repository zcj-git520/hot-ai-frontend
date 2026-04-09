export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const query = getQuery(event)
  const params = new URLSearchParams()
  if (query.path_id) params.set('path_id', String(query.path_id))
  if (query.user_id) params.set('user_id', String(query.user_id))

  const url = `${API_BASE_URL}/learning-paths/completed-chapters?${params.toString()}`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
