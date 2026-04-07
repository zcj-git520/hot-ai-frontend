export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.category) params.set('category', String(query.category))
  if (query.keyword) params.set('keyword', String(query.keyword))

  const url = `http://localhost:8001/api/articles?${params.toString()}`
  const res = await fetch(url)
  const data = await res.json()

  return data
})
