export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: '缺少路径ID' })
  }

  const url = `http://localhost:8003/api/learning-paths/${id}/chapters`
  
  try {
    const res = await fetch(url)
    
    if (!res.ok) {
      throw createError({ statusCode: res.status, message: '获取章节列表失败' })
    }
    
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch chapters:', error)
    throw createError({ statusCode: 502, message: '后端服务请求失败' })
  }
})
