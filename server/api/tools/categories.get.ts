export default defineEventHandler(async () => {
  const url = 'http://localhost:8004/api/tools/categories'
  const res = await fetch(url)
  return await res.json()
})
