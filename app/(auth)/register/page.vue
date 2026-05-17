<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
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

    <!-- 注册卡片 -->
    <div class="relative z-10 w-full max-w-lg">
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
          <h1 class="font-tech text-2xl font-bold tracking-wider text-neon-cyan mb-2">创建账号</h1>
          <p class="text-xs text-gray-500 font-mono">NEURAL NETWORK REGISTRATION</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- 昵称 -->
          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 昵称
            </label>
            <input
              v-model="form.nickname"
              type="text"
              class="input-cyber"
              placeholder="your_nickname"
            />
            <p v-if="fieldErrors.nickname" class="mt-1 text-xs text-red-400">{{ fieldErrors.nickname }}</p>
          </div>

          <!-- 邮箱 -->
          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 邮箱地址
            </label>
            <input
              v-model="form.email"
              type="email"
              class="input-cyber"
              placeholder="your@email.com"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-400">{{ fieldErrors.email }}</p>
          </div>

          <!-- 验证码 -->
          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 验证码
            </label>
            <div class="flex gap-3">
              <input
                v-model="form.verificationCode"
                type="text"
                maxlength="6"
                class="input-cyber flex-1"
                placeholder="6位数字"
              />
              <button
                type="button"
                @click="sendVerificationCode"
                :disabled="sendingCode || countdown > 0"
                class="btn-cyber-ghost whitespace-nowrap disabled:opacity-50"
              >
                {{ countdown > 0 ? `${countdown}s` : (sendingCode ? '发送中...' : '获取验证码') }}
              </button>
            </div>
            <p v-if="fieldErrors.verificationCode" class="mt-1 text-xs text-red-400">{{ fieldErrors.verificationCode }}</p>
          </div>

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 密码
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-400">{{ fieldErrors.password }}</p>
            <!-- 密码强度指示 -->
            <div class="mt-2 flex gap-1">
              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full bg-gray-800" :class="{ 'bg-green-500': getPasswordStrength() >= i }"></div>
            </div>
          </div>

          <!-- 确认密码 -->
          <div>
            <label class="block text-sm font-mono text-gray-400 mb-2">
              <span class="text-cyan-400">//</span> 确认密码
            </label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="input-cyber"
              placeholder="••••••••"
            />
            <p v-if="fieldErrors.confirmPassword" class="mt-1 text-xs text-red-400">{{ fieldErrors.confirmPassword }}</p>
          </div>

          <!-- 错误/成功提示 -->
          <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p class="text-xs text-red-400 font-mono flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ error }}
            </p>
          </div>

          <div v-if="successMessage" class="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p class="text-xs text-green-400 font-mono flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ successMessage }}
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
            <span>{{ loading ? '创建账号中...' : '注册' }}</span>
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            已有账号？
            <NuxtLink to="/login" class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              立即登录 →
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '~/app/lib/api'

definePageMeta({
  layout: false
})

const router = useRouter()

const form = ref({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const sendingCode = ref(false)
const codeSent = ref(false)
const countdown = ref(0)
const fieldErrors = ref<Record<string, string>>({})
const showPassword = ref(false)

let countdownTimer: ReturnType<typeof setInterval> | null = null

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const getPasswordStrength = () => {
  const pwd = form.value.password
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[a-z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  return strength
}

const sendVerificationCode = async () => {
  if (!form.value.email) {
    error.value = '请输入邮箱地址'
    return
  }

  if (!isValidEmail(form.value.email)) {
    error.value = '邮箱格式不正确'
    return
  }

  error.value = ''
  successMessage.value = ''
  sendingCode.value = true

  try {
    await authApi.sendRegistrationCode(form.value.email)
    codeSent.value = true
    countdown.value = 60
    successMessage.value = '验证码已发送，请检查邮箱（有效期 5 分钟）'

    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
        codeSent.value = false
        successMessage.value = ''
      }
    }, 1000)
  } catch (err: any) {
    error.value = err.message || '验证码发送失败'
    codeSent.value = false
  } finally {
    sendingCode.value = false
  }
}

const handleRegister = async () => {
  error.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  if (!form.value.nickname || form.value.nickname.trim().length < 2) {
    fieldErrors.value.nickname = '昵称至少 2 个字符'
    return
  }

  if (!form.value.email || !isValidEmail(form.value.email)) {
    fieldErrors.value.email = '请输入有效的邮箱地址'
    return
  }

  if (form.value.password.length < 8) {
    fieldErrors.value.password = '密码长度至少为 8 位'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    fieldErrors.value.confirmPassword = '两次输入的密码不一致'
    return
  }

  if (!form.value.verificationCode) {
    fieldErrors.value.verificationCode = '请输入验证码'
    return
  }

  loading.value = true

  try {
    await authApi.register({
      email: form.value.email,
      password: form.value.password,
      password_confirm: form.value.confirmPassword,
      nickname: form.value.nickname,
      verification_code: form.value.verificationCode
    })

    successMessage.value = '注册成功！正在跳转到登录页...'
    setTimeout(() => {
      navigateTo('/login')
    }, 1000)
  } catch (err: any) {
    if (err.data?.errors) {
      Object.keys(err.data.errors).forEach(field => {
        const messages = err.data.errors[field]
        fieldErrors.value[field === 'password_confirm' ? 'confirmPassword' : field] =
          Array.isArray(messages) ? messages[0] : messages
      })
    }
    error.value = err.message || '注册失败'
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.text-neon-cyan {
  color: var(--accent-cyan);
  text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
}
</style>
