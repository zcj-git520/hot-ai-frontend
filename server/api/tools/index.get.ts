export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const params = new URLSearchParams()
  
  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.category_id) params.set('category_id', String(query.category_id))
  if (query.search) params.set('search', String(query.search))
  
  const url = `http://localhost:8004/api/tools?${params.toString()}`
  const res = await fetch(url)
  return await res.json()
})
