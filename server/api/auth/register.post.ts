import { hash } from 'bcrypt-ts'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, nickname, verification_code } = body

  // 验证必填字段
  if (!email || !password || !nickname || !verification_code) {
    throw createError({
      statusCode: 400,
      message: '请填写所有必填字段'
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

  // 验证密码长度
  if (password.length < 8 || password.length > 32) {
    throw createError({
      statusCode: 400,
      message: '密码长度必须在 8-32 位之间'
    })
  }

  // 验证昵称长度
  if (nickname.length < 2 || nickname.length > 20) {
    throw createError({
      statusCode: 400,
      message: '昵称长度必须在 2-20 个字符之间'
    })
  }

  // 验证验证码
  const storage = useStorage()
  const storedData: any = await storage.getItem(`verification:${email}`)
  
  if (!storedData) {
    throw createError({
      statusCode: 400,
      message: '验证码不存在或已过期，请重新获取'
    })
  }

  if (storedData.used) {
    throw createError({
      statusCode: 400,
      message: '验证码已使用，请重新获取'
    })
  }

  if (Date.now() > storedData.expiresAt) {
    await storage.removeItem(`verification:${email}`)
    throw createError({
      statusCode: 400,
      message: '验证码已过期，请重新获取'
    })
  }

  if (verification_code !== storedData.code) {
    throw createError({
      statusCode: 400,
      message: '验证码错误'
    })
  }

  // 检查邮箱是否已注册（从存储中读取）
  const existingUser: any = await storage.getItem(`user:email:${email}`)
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: '该邮箱已注册'
    })
  }

  // 创建用户
  const userId = `user-${Date.now()}`
  const hashedPassword = await hash(password, 10)
  
  const user = {
    id: userId,
    email,
    password: hashedPassword,
    nickname,
    avatar: '',
    bio: '',
    roles: ['user'],
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      email_notifications: {
        system_update: true,
        new_content: true,
        weekly_digest: true
      }
    }
  }

  // 保存用户到存储
  await storage.setItem(`user:${userId}`, user)
  await storage.setItem(`user:email:${email}`, user)
  
  // 标记验证码为已使用
  await storage.setItem(`verification:${email}`, {
    ...storedData,
    used: true
  })

  console.log('\n✅ 【用户注册成功】')
  console.log('👤 用户 ID:', userId)
  console.log('📧 邮箱:', email)
  console.log('😊 昵称:', nickname)
  console.log('⏰ 时间:', new Date().toLocaleString('zh-CN'))
  console.log()

  return {
    user_id: userId,
    message: '注册成功，请登录'
  }
})
