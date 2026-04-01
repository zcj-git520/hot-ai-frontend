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

    // 获取请求体
    const body = await readBody(event)
    
    // 更新用户信息
    if (body.nickname !== undefined) {
      if (body.nickname.length < 2 || body.nickname.length > 20) {
        throw createError({
          statusCode: 400,
          message: '昵称长度必须在 2-20 个字符之间'
        })
      }
      user.nickname = body.nickname
    }
    
    if (body.bio !== undefined) {
      user.bio = body.bio
    }

    // 保存更新后的用户
    await storage.setItem(`user:${decoded.userId}`, user)
    await storage.setItem(`user:email:${user.email}`, user)

    // 返回更新后的用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user
    
    console.log('\n✏️ 【用户信息已更新】')
    console.log('👤 用户:', user.nickname)
    console.log()

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
