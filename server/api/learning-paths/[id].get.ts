export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: '缺少路径ID' })
  }

  const url = `http://localhost:8003/api/learning-paths/${id}`
  const res = await fetch(url)
  
  if (!res.ok) {
    throw createError({ statusCode: res.status, message: '学习路径不存在' })
  }
  
  return res.json()
})
