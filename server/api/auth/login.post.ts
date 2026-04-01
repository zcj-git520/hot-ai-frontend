import { hash, compare } from 'bcrypt-ts'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // 验证必填字段
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: '请填写邮箱和密码'
    })
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: '邮箱格式不正确'
    })
  }

  // 查找用户
  const storage = useStorage()
  const user: any = await storage.getItem(`user:email:${email}`)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '邮箱或密码错误'
    })
  }

  // 验证密码
  const validPassword = await compare(password, user.password)
  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: '邮箱或密码错误'
    })
  }

  // 生成 JWT Token
  const config = useRuntimeConfig()
  const jwtSecret = config.jwtSecret || 'your-default-jwt-secret-change-in-production'
  const jwtRefreshSecret = config.jwtRefreshSecret || 'your-default-refresh-secret'

  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      roles: user.roles 
    },
    jwtSecret,
    { expiresIn: '24h' }
  )

  const refreshToken = jwt.sign(
    { userId: user.id },
    jwtRefreshSecret,
    { expiresIn: '7d' }
  )

  console.log('\n🔐 【用户登录成功】')
  console.log('👤 用户:', user.nickname)
  console.log('📧 邮箱:', user.email)
  console.log('🎫 Token:', accessToken.substring(0, 20) + '...')
  console.log()

  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = user
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 86400, // 24 小时
    user: userWithoutPassword
  }
})
