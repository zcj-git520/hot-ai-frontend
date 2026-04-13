<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">API 测试</h1>

      <div class="space-y-6">
        <!-- 注册验证码测试 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">1. 发送注册验证码</h2>
          <div class="flex gap-4">
            <input
              v-model="testEmail"
              type="email"
              placeholder="请输入邮箱"
              class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              @click="testSendRegistrationCode"
              :disabled="sendingCode"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ sendingCode ? '发送中...' : '发送验证码' }}
            </button>
          </div>
          <div v-if="registrationCodeResult" class="mt-4 p-4 bg-green-50 rounded-md">
            <p class="text-green-800">{{ registrationCodeResult }}</p>
          </div>
        </div>

        <!-- 注册测试 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">2. 用户注册</h2>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="registerForm.nickname"
              type="text"
              placeholder="昵称"
              class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="邮箱"
              class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              v-model="registerForm.verificationCode"
              type="text"
              placeholder="验证码"
              class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            @click="testRegister"
            :disabled="registering"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ registering ? '注册中...' : '注册' }}
          </button>
          <div v-if="registerResult" class="mt-4 p-4 bg-green-50 rounded-md">
            <p class="text-green-800">{{ registerResult }}</p>
          </div>
        </div>

        <!-- 登录测试 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">3. 用户登录</h2>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="loginForm.email"
              type="email"
              placeholder="邮箱"
              class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            @click="testLogin"
            :disabled="loggingIn"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loggingIn ? '登录中...' : '登录' }}
          </button>
          <div v-if="loginResult" class="mt-4 p-4 bg-green-50 rounded-md">
            <p class="text-green-800">登录成功！Token: {{ loginResult?.access_token?.substring(0, 20) }}...</p>
          </div>
        </div>

        <!-- 获取用户信息测试 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">4. 获取用户信息</h2>
          <button
            @click="testGetProfile"
            :disabled="loadingProfile"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loadingProfile ? '加载中...' : '获取用户信息' }}
          </button>
          <div v-if="profileResult" class="mt-4 p-4 bg-green-50 rounded-md">
            <pre class="text-sm text-green-800 overflow-auto">{{ JSON.stringify(profileResult, null, 2) }}</pre>
          </div>
        </div>

        <!-- 登出测试 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">5. 用户登出</h2>
          <button
            @click="testLogout"
            :disabled="loggingOut"
            class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {{ loggingOut ? '登出中...' : '登出' }}
          </button>
          <div v-if="logoutResult" class="mt-4 p-4 bg-green-50 rounded-md">
            <p class="text-green-800">{{ logoutResult }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authApi, userApi } from '~/app/lib/api'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'auth'
})

const { setToken, setUser, clearAuth } = useAuth()

// 测试数据
const testEmail = ref('')
const sendingCode = ref(false)
const registrationCodeResult = ref('')

const registerForm = ref({
  nickname: '',
  email: '',
  password: '',
  verificationCode: ''
})
const registering = ref(false)
const registerResult = ref('')

const loginForm = ref({
  email: '',
  password: ''
})
const loggingIn = ref(false)
const loginResult = ref<any>(null)

const loadingProfile = ref(false)
const profileResult = ref<any>(null)

const loggingOut = ref(false)
const logoutResult = ref('')

// 测试方法
const testSendRegistrationCode = async () => {
  if (!testEmail.value) {
    alert('请输入邮箱')
    return
  }

  sendingCode.value = true
  registrationCodeResult.value = ''

  try {
    await authApi.sendRegistrationCode(testEmail.value)
    registrationCodeResult.value = '验证码已发送，请检查邮箱'
  } catch (err: any) {
    registrationCodeResult.value = `错误：${err.message || '发送失败'}`
  } finally {
    sendingCode.value = false
  }
}

const testRegister = async () => {
  if (!registerForm.value.nickname || !registerForm.value.email || !registerForm.value.password || !registerForm.value.verificationCode) {
    alert('请填写所有字段')
    return
  }

  registering.value = true
  registerResult.value = ''

  try {
    await authApi.register({
      email: registerForm.value.email,
      password: registerForm.value.password,
      nickname: registerForm.value.nickname,
      verification_code: registerForm.value.verificationCode
    })
    registerResult.value = '注册成功！请登录'
  } catch (err: any) {
    registerResult.value = `错误：${err.message || '注册失败'}`
  } finally {
    registering.value = false
  }
}

const testLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    alert('请填写邮箱和密码')
    return
  }

  loggingIn.value = true
  loginResult.value = null

  try {
    const data = await authApi.login(loginForm.value.email, loginForm.value.password)
    await setToken(data.access_token, data.refresh_token)
    await setUser(data.user)
    loginResult.value = data
  } catch (err: any) {
    alert(`登录失败：${err.message || '请检查邮箱和密码'}`)
  } finally {
    loggingIn.value = false
  }
}

const testGetProfile = async () => {
  loadingProfile.value = true
  profileResult.value = ''

  try {
    const profile = await userApi.getProfile()
    profileResult.value = profile
  } catch (err: any) {
    profileResult.value = { error: err.message || '获取失败' }
  } finally {
    loadingProfile.value = false
  }
}

const testLogout = async () => {
  loggingOut.value = true
  logoutResult.value = ''

  try {
    await authApi.logout()
    clearAuth()
    logoutResult.value = '登出成功'
  } catch (err: any) {
    logoutResult.value = `错误：${err.message || '登出失败'}`
  } finally {
    loggingOut.value = false
  }
}
</script>
