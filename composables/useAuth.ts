export const useAuth = () => {
  const user = useState('user', () => null)
  const token = useState('token', () => null)
  const refreshToken = useState('refreshToken', () => null)

  // 设置 Token
  const setToken = (accessToken: string, refresh: string) => {
    token.value = accessToken
    refreshToken.value = refresh
    
    if (process.client) {
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refresh)
    }
  }

  // 设置用户信息
  const setUser = (userData: any) => {
    user.value = userData
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  // 清除认证信息
  const clearAuth = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  // 从 localStorage 恢复认证信息
  const restoreAuth = () => {
    if (!process.client) return
    
    const savedToken = localStorage.getItem('token')
    const savedRefreshToken = localStorage.getItem('refreshToken')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken) {
      token.value = savedToken
    }
    if (savedRefreshToken) {
      refreshToken.value = savedRefreshToken
    }
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse user data')
      }
    }
  }

  // 刷新 Token
  const refreshAccessToken = async () => {
    if (!refreshToken.value) return false
    
    try {
      const { authApi } = await import('~/app/lib/api')
      const response = await authApi.refreshToken(refreshToken.value as string)
      
      if (response.access_token) {
        setToken(response.access_token, refreshToken.value as string)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed')
      clearAuth()
      return false
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      const { authApi } = await import('~/app/lib/api')
      await authApi.logout()
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      clearAuth()
      if (process.client) {
        window.location.href = '/'
      }
    }
  }

  // 检查是否已登录
  const isAuthenticated = () => {
    return !!token.value
  }

  return {
    user,
    token,
    refreshToken,
    setToken,
    setUser,
    clearAuth,
    restoreAuth,
    refreshAccessToken,
    logout,
    isAuthenticated
  }
}
