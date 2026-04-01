import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { refresh_token } = body

  if (!refresh_token) {
    throw createError({
      statusCode: 400,
      message: 'Refresh Token 不能为空'
    })
  }

  try {
    // 验证 Refresh Token
    const config = useRuntimeConfig()
    const jwtRefreshSecret = config.jwtRefreshSecret || 'your-default-refresh-secret'
    
    const decoded: any = jwt.verify(refresh_token, jwtRefreshSecret)
    
    // 查找用户
    const storage = useStorage()
    const user: any = await storage.getItem(`user:${decoded.userId}`)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '用户不存在'
      })
    }

    // 生成新的 Access Token
    const jwtSecret = config.jwtSecret || 'your-default-jwt-secret-change-in-production'
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        roles: user.roles 
      },
      jwtSecret,
      { expiresIn: '24h' }
    )

    return {
      access_token: accessToken,
      expires_in: 86400
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Refresh Token 已过期'
      })
    }
    
    throw createError({
      statusCode: 401,
      message: 'Refresh Token 无效'
    })
  }
})
