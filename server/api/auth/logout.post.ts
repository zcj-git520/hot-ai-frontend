import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // 获取 Authorization header
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: '未授权访问'
    })
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || 'your-default-jwt-secret-change-in-production'
    
    // 验证 Token（这里只是简单验证，实际可以加入黑名单机制）
    jwt.verify(token, jwtSecret)
    
    console.log('\n👋 【用户登出】')
    console.log('Token:', token.substring(0, 20) + '...')
    console.log()

    return {
      code: 200,
      message: '登出成功',
      data: { success: true }
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Token 无效或已过期'
    })
  }
})
