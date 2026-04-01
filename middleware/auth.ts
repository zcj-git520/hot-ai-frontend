export default defineNuxtRouteMiddleware(async (to, from) => {
  const { token, restoreAuth } = useAuth()

  // 恢复认证信息
  restoreAuth()

  // 检查是否需要认证
  if (to.meta.middleware === 'auth') {
    if (!token.value) {
      return navigateTo('/login')
    }
  }

  // 已登录用户访问登录/注册页，重定向到首页
  if (token.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
