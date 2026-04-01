export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: '邮箱不能为空'
    })
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: '邮箱格式不正确'
    })
  }

  // 生成 6 位随机验证码
  const code = String(100000 + Math.floor(Math.random() * 900000))
  
  // 存储验证码到内存（实际应该用 Redis）
  // 这里使用 Nuxt 的 storage API
  const storage = useStorage()
  await storage.setItem(`verification:${email}`, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 分钟有效期
    used: false
  })

  // 在控制台打印验证码（开发环境）
  console.log('\n📧 【注册验证码】')
  console.log('📮 邮箱:', email)
  console.log('🔢 验证码:', code)
  console.log('⏰ 有效期：5 分钟')
  console.log('💡 提示：请在 5 分钟内使用此验证码完成注册\n')

  // TODO: 实际应该发送邮件
  // await sendEmail({
  //   to: email,
  //   subject: 'Hot AI 注册验证码',
  //   html: `<p>您的验证码是：<strong>${code}</strong></p><p>有效期 5 分钟</p>`
  // })

  return {
    message: '验证码已发送，请检查邮箱',
    email,
    expires_in: 300
  }
})
