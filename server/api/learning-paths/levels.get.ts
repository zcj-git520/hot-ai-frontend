export default defineEventHandler(async () => {
  const url = `http://localhost:8003/api/learning-paths/levels`
  const res = await fetch(url)

  if (!res.ok) {
    throw createError({ statusCode: res.status, message: '获取难度等级失败' })
  }

  return res.json()
})
