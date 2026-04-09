export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost/api'

  const body = await readBody(event)

  const url = `${API_BASE_URL}/learning-paths/save-progress`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return data
})
