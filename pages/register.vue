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
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              placeholder="你的昵称"
            />
          </div>

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
              minlength="8"
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              placeholder="至少 8 位"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">确认密码</label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              required
              minlength="8"
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              placeholder="再次输入密码"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#8b949e] mb-2">邮箱验证码</label>
            <div class="flex gap-2">
              <input 
                v-model="form.verificationCode"
                type="text" 
                required
                maxlength="6"
                class="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-3 text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
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
import { authApi } from '~/app/lib/api'

const form = ref({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
})

const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const errorMessage = ref('')
const successMessage = ref('')

// 发送验证码
const sendVerificationCode = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
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
    errorMessage.value = err.response?.data?.message || '验证码发送失败，请稍后重试'
  } finally {
    sendingCode.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // 验证密码
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  // 验证密码长度
  if (form.value.password.length < 8) {
    errorMessage.value = '密码长度至少为 8 位'
    return
  }
  
  // 验证验证码
  if (!form.value.verificationCode) {
    errorMessage.value = '请输入邮箱验证码'
    return
  }
  
  loading.value = true
  try {
    await authApi.register({
      email: form.value.email,
      password: form.value.password,
      nickname: form.value.nickname,
      verification_code: form.value.verificationCode
    })
    
    successMessage.value = '注册成功，即将跳转到登录页...'
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)
  } catch (err: any) {
    console.error('Registration failed:', err)
    errorMessage.value = err.response?.data?.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
