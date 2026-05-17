// Admin 路由守卫中间件
export default defineNuxtRouteMiddleware(async (to) => {
  const { token, user, restoreAuth } = useAuth()

  // 恢复认证状态
  restoreAuth()

  // 检查是否已登录
  if (!token.value) {
    return navigateTo('/login')
  }

  // 检查是否是管理员
  if (!user.value?.roles?.includes('admin')) {
    // 如果不是管理员，跳转到首页
    return navigateTo('/')
  }
})
