<template>
  <div class="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <div class="flex items-center gap-2 justify-center">
            <span class="text-4xl">🤖</span>
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
          </div>
        </NuxtLink>
      </div>

      <!-- 登录表单 -->
      <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
        <h1 class="text-2xl font-bold text-white mb-6 text-center">登录账号</h1>
        
        <!-- 错误提示 -->
        <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="flex-1">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>
          <button @click="error = ''" class="text-red-400 hover:text-red-300 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">邮箱</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">密码</label>
            <input 
              v-model="form.password"
              type="password" 
              required
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-[#58a6ff] focus:ring-[#58a6ff]" />
              <span class="ml-2 text-sm text-[#8b949e]">记住我</span>
            </label>
            <a href="#" class="text-sm text-[#58a6ff] hover:text-[#79c0ff]">忘记密码？</a>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#30363d] disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-all shadow-lg hover:shadow-xl"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-[#8b949e]">
            还没有账号？
            <NuxtLink to="/register" class="text-[#58a6ff] hover:text-[#79c0ff] font-medium">
              立即注册
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '~/app/lib/api'
import { useAuth } from '~/composables/useAuth'

const form = ref({
  email: '',
  password: ''
})

const { setToken, setUser } = useAuth()
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await authApi.login(form.value.email, form.value.password)
    
    // 保存 Token 和用户信息
    setToken(response.access_token, response.refresh_token)
    setUser(response.user)
    
    // 跳转到首页
    navigateTo('/')
  } catch (err: any) {
    console.error('Login failed:', err)
    error.value = err.response?.data?.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
