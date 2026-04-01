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
    
    // 验证 Token
    const decoded: any = jwt.verify(token, jwtSecret)
    
    // 查找用户
    const storage = useStorage()
    const user: any = await storage.getItem(`user:${decoded.userId}`)
    
    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在'
      })
    }

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user
    
    return userWithoutPassword
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Token 已过期'
      })
    }
    
    throw createError({
      statusCode: 401,
      message: 'Token 无效'
    })
  }
})
