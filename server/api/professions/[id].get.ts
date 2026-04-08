export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少职业ID'
    })
  }

  const url = `http://localhost:8002/api/professions/${id}`
  const res = await fetch(url)
  
  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      message: '职业不存在'
    })
  }
  
  return res.json()
})
