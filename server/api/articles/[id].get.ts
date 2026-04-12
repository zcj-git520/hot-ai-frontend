export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const url = `http://localhost:8001/api/articles/${id}`
  const res = await fetch(url)
  return await res.json()
})
