export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const params = new URLSearchParams()
  
  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.difficulty) params.set('difficulty', String(query.difficulty))
  
  const url = `http://localhost:8003/api/learning-paths?${params.toString()}`
  const res = await fetch(url)
  return await res.json()
})
