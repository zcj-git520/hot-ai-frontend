export default defineEventHandler(async (event) => {
  const url = 'http://localhost:8001/api/articles/categories'
  const res = await fetch(url)
  const data = await res.json()
  return data
})
