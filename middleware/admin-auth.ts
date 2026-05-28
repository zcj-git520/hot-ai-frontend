// Admin 路由守卫中间件
export default defineNuxtRouteMiddleware(async (to) => {
  // TODO: 临时跳过管理员检查，便于测试工具审核功能
  // 恢复认证状态
  // const { token, user, restoreAuth } = useAuth()
  // restoreAuth()
  // 检查是否已登录
  // if (!token.value) {
  //   return navigateTo('/login')
  // }
  // if (!user.value?.roles?.includes('admin')) {
  //   return navigateTo('/')
  // }
})
