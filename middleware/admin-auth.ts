// Admin 路由守卫中间件
export default defineNuxtRouteMiddleware(async (to) => {
  const { token, user, restoreAuth } = useAuth()

  // 恢复认证状态
  restoreAuth()

  // 检查是否已登录
  if (!token.value) {
    return navigateTo('/login')
  }

  // TODO: 临时跳过管理员检查，便于测试工具审核功能
  // if (!user.value?.roles?.includes('admin')) {
  //   return navigateTo('/')
  // }
})
