<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
    <!-- 背景 -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
    </div>

    <!-- 装饰边框 -->
    <div class="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-3xl"></div>
    <div class="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-3xl"></div>
    <div class="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30 rounded-bl-3xl"></div>
    <div class="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30 rounded-br-3xl"></div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-md">
      <div class="glass-card neon-border p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="relative">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <span class="text-white font-tech font-bold text-xl">AI</span>
              </div>
              <div class="absolute inset-0 rounded-lg bg-cyan-400/30 blur-lg"></div>
            </div>
          </div>
          <h1 class="font-tech text-2xl font-bold tracking-wider text-neon-cyan mb-2">登录系统</h1>
          <p class="text-xs text-gray-500 font-mono">NEURAL NETWORK AUTHENTICATION</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 邮箱地址
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input-cyber"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 密码
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="input-cyber pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p class="text-xs text-red-400 font-mono flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ error }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-cyber w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? '身份验证中...' : '进入系统' }}</span>
          </button>
        </form>

        <!-- 注册链接 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            还没有账号？
            <NuxtLink to="/register" class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              立即注册 →
            </NuxtLink>
          </p>
        </div>

        <!-- 返回首页 -->
        <div class="mt-4 text-center">
          <NuxtLink to="/" class="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </NuxtLink>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-600 font-mono">
          <span class="inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            系统在线
          </span>
          <span class="mx-2">|</span>
          响应时间: 23ms
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '~/app/lib/api'

definePageMeta({
  layout: false
})

const router = useRouter()
const { setToken, setUser } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const data = await authApi.login(form.value.email, form.value.password)
    await setToken(data.access_token, data.refresh_token)
    await setUser(data.user)
    navigateTo('/')
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.text-neon-cyan {
  color: var(--accent-cyan);
  text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
}
</style>
