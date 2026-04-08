export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'
  
  const url = `${API_BASE_URL}/articles/categories`
  const res = await fetch(url)
  const data = await res.json()
  return data
})
