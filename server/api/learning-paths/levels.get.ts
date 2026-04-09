export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const url = `${API_BASE_URL}/learning-paths/levels`
  const res = await fetch(url)
  return res.json()
})
