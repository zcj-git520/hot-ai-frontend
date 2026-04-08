export default defineEventHandler(async (event) => {
  const url = 'http://localhost:8002/api/professions/risk-levels'
  const res = await fetch(url)
  return res.json()
})
