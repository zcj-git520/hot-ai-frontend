<template>
  <div class="min-h-screen bg-[#0d1117] flex items-center justify-center px-4 py-12">
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

      <!-- 注册表单 -->
      <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
        <h1 class="text-2xl font-bold text-white mb-6 text-center">创建账号</h1>
        
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="flex-1">
            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
          </div>
          <button @click="errorMessage = ''" class="text-red-400 hover:text-red-300 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-md flex items-start gap-3">
          <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="flex-1">
            <p class="text-green-400 text-sm">{{ successMessage }}</p>
          </div>
          <button @click="successMessage = ''" class="text-green-400 hover:text-green-300 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">昵称</label>
            <input 
              v-model="form.nickname"
              type="text" 
              required
              :class="[
                'w-full bg-[#0d1117] border rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all',
                fieldErrors.nickname ? 'border-red-500' : 'border-[#30363d]'
              ]"
              placeholder="你的昵称"
            />
            <p v-if="fieldErrors.nickname" class="mt-1 text-red-400 text-xs">
              {{ fieldErrors.nickname }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">邮箱</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              :class="[
                'w-full bg-[#0d1117] border rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all',
                fieldErrors.email ? 'border-red-500' : 'border-[#30363d]'
              ]"
              placeholder="your@email.com"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-red-400 text-xs">
              {{ fieldErrors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">密码</label>
            <input 
              v-model="form.password"
              type="password" 
              required
              minlength="8"
              :class="[
                'w-full bg-[#0d1117] border rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all',
                fieldErrors.password ? 'border-red-500' : 'border-[#30363d]'
              ]"
              placeholder="至少 8 位，包含大写字母、小写字母、数字和特殊字符"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-red-400 text-xs">
              {{ fieldErrors.password }}
            </p>
            <!-- 密码要求提示 -->
            <p class="mt-2 text-xs text-[#8b949e]">
              <span class="font-medium">密码要求：</span>
              <span :class="hasUppercase ? 'text-green-400' : ''">✓ 大写字母</span>、
              <span :class="hasLowercase ? 'text-green-400' : ''">✓ 小写字母</span>、
              <span :class="hasNumbers ? 'text-green-400' : ''">✓ 数字</span>、
              <span :class="hasSpecialChar ? 'text-green-400' : ''">✓ 特殊字符</span>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">确认密码</label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              required
              minlength="8"
              :class="[
                'w-full bg-[#0d1117] border rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all',
                fieldErrors.confirmPassword ? 'border-red-500' : 'border-[#30363d]'
              ]"
              placeholder="再次输入密码"
            />
            <p v-if="fieldErrors.confirmPassword" class="mt-1 text-red-400 text-xs">
              {{ fieldErrors.confirmPassword }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">邮箱验证码</label>
            <div class="flex gap-2">
              <input 
                v-model="form.verificationCode"
                type="text" 
                required
                maxlength="6"
                :class="[
                  'flex-1 bg-[#0d1117] border rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all',
                  fieldErrors.verificationCode ? 'border-red-500' : 'border-[#30363d]'
                ]"
                placeholder="6 位验证码"
              />
              <button 
                type="button"
                @click="sendVerificationCode"
                :disabled="sendingCode || countdown > 0"
                class="bg-[#1f6feb] hover:bg-[#388bfd] disabled:bg-[#30363d] disabled:cursor-not-allowed text-white font-medium px-4 py-3 rounded-md transition-all whitespace-nowrap"
              >
                {{ countdown > 0 ? `${countdown}秒后重发` : (sendingCode ? '发送中...' : '获取验证码') }}
              </button>
            </div>
            <p v-if="fieldErrors.verificationCode" class="mt-1 text-red-400 text-xs">
              {{ fieldErrors.verificationCode }}
            </p>
          </div>

          <div class="flex items-start">
            <input type="checkbox" required class="w-4 h-4 mt-1 rounded border-[#30363d] bg-[#0d1117] text-[#58a6ff] focus:ring-[#58a6ff]" />
            <span class="ml-2 text-sm text-[#8b949e]">
              我已阅读并同意 <a href="#" class="text-[#58a6ff] hover:text-[#79c0ff]">服务条款</a> 和 <a href="#" class="text-[#58a6ff] hover:text-[#79c0ff]">隐私政策</a>
            </span>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#30363d] disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-all shadow-lg hover:shadow-xl"
          >
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-[#8b949e]">
            已有账号？
            <NuxtLink to="/login" class="text-[#58a6ff] hover:text-[#79c0ff] font-medium">
              立即登录
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { authApi } from '~/app/lib/api'
import { navigateTo } from '#app'

const form = ref({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
})

// 密码复杂度实时检测
const hasUppercase = computed(() => /[A-Z]/.test(form.value.password))
const hasLowercase = computed(() => /[a-z]/.test(form.value.password))
const hasNumbers = computed(() => /\d/.test(form.value.password))
const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.value.password))

const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const errorMessage = ref('')
const successMessage = ref('')
// 字段级别的错误信息
const fieldErrors = ref<Record<string, string>>({})

// 发送验证码
const sendVerificationCode = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}
  
  if (!form.value.email) {
    errorMessage.value = '请先输入邮箱地址'
    return
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = '请输入有效的邮箱地址'
    return
  }
  
  sendingCode.value = true
  try {
    await authApi.sendRegistrationCode(form.value.email)
    successMessage.value = '验证码已发送，请检查邮箱'
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (err: any) {
    console.error('Failed to send verification code:', err)
    errorMessage.value = err.message || '验证码发送失败，请稍后重试'
  } finally {
    sendingCode.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}
  
  // 验证昵称
  if (!form.value.nickname || form.value.nickname.trim().length < 2) {
    fieldErrors.value.nickname = '昵称至少 2 个字符'
    return
  }

  if (form.value.nickname.length > 20) {
    fieldErrors.value.nickname = '昵称不能超过 20 个字符'
    return
  }

  // 验证邮箱
  if (!form.value.email) {
    fieldErrors.value.email = '请输入邮箱地址'
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    fieldErrors.value.email = '请输入有效的邮箱地址'
    return
  }
  
  // 验证密码
  if (form.value.password.length < 8) {
    fieldErrors.value.password = '密码长度至少为 8 位'
    errorMessage.value = '密码长度至少为 8 位'
    return
  }
  
  if (form.value.password.length > 32) {
    fieldErrors.value.password = '密码长度不能超过 32 位'
    errorMessage.value = '密码长度不能超过 32 位'
    return
  }
  
  // 密码复杂度验证
  const hasUppercase = /[A-Z]/.test(form.value.password)
  const hasLowercase = /[a-z]/.test(form.value.password)
  const hasNumbers = /\d/.test(form.value.password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.value.password)
  
  if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
    const requirements: string[] = []
    if (!hasUppercase) requirements.push('大写字母')
    if (!hasLowercase) requirements.push('小写字母')
    if (!hasNumbers) requirements.push('数字')
    if (!hasSpecialChar) requirements.push('特殊字符')
    const errorMsg = `密码必须包含：${requirements.join('、')}`
    fieldErrors.value.password = errorMsg
    errorMessage.value = errorMsg
    return
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    fieldErrors.value.confirmPassword = '两次输入的密码不一致'
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  // 验证验证码
  if (!form.value.verificationCode) {
    fieldErrors.value.verificationCode = '请输入邮箱验证码'
    return
  }
  
  if (form.value.verificationCode.length !== 6 || !/^\d{6}$/.test(form.value.verificationCode)) {
    fieldErrors.value.verificationCode = '请输入 6 位数字验证码'
    return
  }
  
  loading.value = true
  try {
    await authApi.register({
      email: form.value.email,
      password: form.value.password,
      password_confirm: form.value.confirmPassword,  // 添加密码确认字段
      nickname: form.value.nickname,
      verification_code: form.value.verificationCode
    })
    
    successMessage.value = '注册成功，即将跳转到登录页...'
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)
  } catch (err: any) {
    console.error('Registration failed:', err)
    
    // 处理后端返回的验证错误（响应拦截器已将 data 挂载到 err.data）
    if (err.data?.errors) {
      Object.keys(err.data.errors).forEach(field => {
        const messages = err.data.errors[field]
        // 将后端的 password_confirm 映射到前端的 confirmPassword
        fieldErrors.value[field === 'password_confirm' ? 'confirmPassword' : field] = 
          Array.isArray(messages) ? messages[0] : messages
      })
    }
    
    // 设置通用错误信息
    errorMessage.value = err.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
