export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少文章ID'
    })
  }

  const url = `http://localhost:8001/api/articles/${id}`
  const res = await fetch(url)
  const data = await res.json()

  return data
})
