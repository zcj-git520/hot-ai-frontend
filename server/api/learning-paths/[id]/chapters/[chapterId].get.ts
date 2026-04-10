export default defineEventHandler(async (event) => {
  const pathId = getRouterParam(event, 'id')
  const chapterId = getRouterParam(event, 'chapterId')

  if (!pathId || !chapterId) {
    throw createError({ statusCode: 400, message: '缺少路径ID或章节ID' })
  }

  const url = `http://localhost:8003/api/learning-paths/chapters/${chapterId}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      throw createError({ statusCode: res.status, message: '获取章节详情失败' })
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch chapter:', error)
    throw createError({ statusCode: 502, message: '后端服务请求失败' })
  }
})
