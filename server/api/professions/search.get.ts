export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.q) params.set('q', String(query.q))
  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))

  const url = `http://localhost:8002/api/professions/search?${params.toString()}`
  const res = await fetch(url)
  return res.json()
})
