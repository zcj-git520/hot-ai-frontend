export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl as string
  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.risk_level) params.set('risk_level', String(query.risk_level))
  if (query.keyword) params.set('keyword', String(query.keyword))

  const url = `${apiUrl}/professions?${params.toString()}`
  const res = await fetch(url)
  return await res.json()
})
