export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.page_size) params.set('page_size', String(query.page_size))
  if (query.difficulty) params.set('difficulty', String(query.difficulty))

  const url = `http://localhost:8003/api/learning-paths?${params.toString()}`
  const res = await fetch(url)

  if (!res.ok) {
    throw createError({ statusCode: res.status, message: '获取学习路径列表失败' })
  }

  return res.json()
})
