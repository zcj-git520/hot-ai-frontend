export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Use learning-path-svc on port 8003 for public chapters
  const url = `http://localhost:8003/api/learning-paths/${id}/chapters`
  const res = await fetch(url)
  return await res.json()
})
