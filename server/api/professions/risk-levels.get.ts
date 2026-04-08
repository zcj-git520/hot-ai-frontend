export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'
  
  const url = `${API_BASE_URL}/professions/risk-levels`
  const res = await fetch(url)
  return res.json()
})
