export default defineEventHandler(async (event) => {
  const url = 'http://localhost:8002/api/professions/categories'
  const res = await fetch(url)
  return res.json()
})
