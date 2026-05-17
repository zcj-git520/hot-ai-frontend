<template>
  <div class="min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
        <h1 class="font-tech text-3xl font-bold tracking-wider">个人中心</h1>
      </div>
      <p class="text-gray-500 font-mono text-sm ml-4">
        <span class="text-cyan-400">//</span> 管理你的个人信息和账户设置 <span class="text-cyan-400">//</span>
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 侧边栏 -->
      <div class="lg:col-span-1">
        <div class="glass-card neon-border p-6 sticky top-24">
          <!-- 用户头像 -->
          <div class="text-center mb-6">
            <div class="relative inline-block">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-3xl font-tech font-bold text-white mx-auto mb-4">
                {{ user?.nickname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[var(--bg-card)]"></div>
            </div>
            <h2 class="text-xl font-semibold text-white">{{ user?.nickname || '用户' }}</h2>
            <p class="text-sm text-gray-500">{{ user?.email }}</p>
          </div>

          <!-- 状态 -->
          <div class="flex items-center justify-center gap-2 py-3 border-t border-b border-cyan-500/10 mb-6">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-xs text-gray-500 font-mono">ONLINE</span>
          </div>

          <!-- 菜单 -->
          <nav class="space-y-1">
            <a href="#profile" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              个人资料
            </a>
            <a href="#password" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              修改密码
            </a>
          </nav>

          <!-- 返回首页 -->
          <div class="mt-6 pt-6 border-t border-cyan-500/10">
            <NuxtLink to="/" class="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              返回首页
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 主内容 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 错误提示 -->
        <div v-if="loadError" class="glass-card p-4 border border-red-500/30">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-400 text-sm flex-1">{{ loadError }}</p>
            <button @click="loadError = ''" class="text-gray-500 hover:text-red-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading && !profileLoaded" class="glass-card p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-2 border-cyan-500/30 border-t-cyan-500 mb-4"></div>
          <p class="text-gray-500">加载中...</p>
        </div>

        <template v-else>
          <!-- 基本信息卡片 -->
          <div id="profile" class="glass-card neon-border p-6">
            <h3 class="font-tech text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span class="text-cyan-400">01</span>
              基本信息
            </h3>

            <form @submit.prevent="updateProfile" class="space-y-5">
              <div>
                <label class="block text-sm font-mono text-gray-400 mb-2">
                  <span class="text-cyan-400">//</span> 昵称
                </label>
                <input
                  v-model="profileForm.nickname"
                  type="text"
                  class="input-cyber"
                  placeholder="your_nickname"
                />
              </div>

              <div>
                <label class="block text-sm font-mono text-gray-400 mb-2">
                  <span class="text-cyan-400">//</span> 个人简介
                </label>
                <textarea
                  v-model="profileForm.bio"
                  rows="3"
                  class="input-cyber resize-none"
                  placeholder="介绍一下自己..."
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="btn-cyber disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? '保存中...' : '保存修改' }}
              </button>
            </form>
          </div>

          <!-- 修改密码卡片 -->
          <div id="password" class="glass-card neon-border p-6">
            <h3 class="font-tech text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span class="text-cyan-400">02</span>
              修改密码
            </h3>

            <form @submit.prevent="changePassword" class="space-y-5">
              <div>
                <label class="block text-sm font-mono text-gray-400 mb-2">
                  <span class="text-cyan-400">//</span> 当前密码
                </label>
                <input
                  v-model="passwordForm.old_password"
                  type="password"
                  required
                  class="input-cyber"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label class="block text-sm font-mono text-gray-400 mb-2">
                  <span class="text-cyan-400">//</span> 新密码
                </label>
                <input
                  v-model="passwordForm.new_password"
                  type="password"
                  required
                  minlength="8"
                  class="input-cyber"
                  placeholder="至少 8 位"
                />
              </div>

              <div v-if="passwordError" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p class="text-xs text-red-400 font-mono">{{ passwordError }}</p>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="btn-cyber disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? '修改中...' : '修改密码' }}
              </button>
            </form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApi } from '~/app/lib/api'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user, logout } = useAuth()

const loading = ref(false)
const submitting = ref(false)
const passwordError = ref('')
const loadError = ref('')
const profileLoaded = ref(false)

const profileForm = ref({
  nickname: '',
  bio: ''
})

const passwordForm = ref({
  old_password: '',
  new_password: ''
})

onMounted(async () => {
  loading.value = true
  loadError.value = ''

  try {
    if (user.value) {
      profileForm.value.nickname = user.value.nickname || ''
      profileForm.value.bio = user.value.bio || ''
      profileLoaded.value = true
    }

    try {
      const userData = await userApi.getProfile()
      profileForm.value.nickname = userData.nickname || ''
      profileForm.value.bio = userData.bio || ''
      profileLoaded.value = true
    } catch (apiError: any) {
      if (!user.value) {
        loadError.value = apiError.data?.message || '加载用户信息失败'
        if (apiError.response?.status === 401) {
          setTimeout(() => navigateTo('/login'), 2000)
        }
      }
    }
  } catch (err: any) {
    loadError.value = '加载失败'
  } finally {
    loading.value = false
  }
})

const updateProfile = async () => {
  submitting.value = true
  try {
    await userApi.updateProfile(profileForm.value)
    if (user.value) {
      user.value.nickname = profileForm.value.nickname
      user.value.bio = profileForm.value.bio
    }
    alert('个人资料已更新')
  } catch (err: any) {
    alert(err.data?.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new_password.length < 8) {
    passwordError.value = '密码长度至少为 8 位'
    return
  }

  submitting.value = true
  passwordError.value = ''

  try {
    await userApi.changePassword(passwordForm.value)
    alert('密码已修改')
    passwordForm.value = { old_password: '', new_password: '' }
  } catch (err: any) {
    passwordError.value = err.data?.message || '修改失败'
  } finally {
    submitting.value = false
  }
}

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await logout()
  }
}
</script>
