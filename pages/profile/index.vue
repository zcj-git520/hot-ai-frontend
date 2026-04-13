<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 sm:gap-8">
            <NuxtLink to="/" class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span class="text-2xl sm:text-3xl">🤖</span>
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
            </NuxtLink>
            <NuxtLink 
              to="/" 
              class="text-[#8b949e] hover:text-white transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="hidden sm:inline">返回主页</span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <template v-if="user">
              <NuxtLink to="/profile" class="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {{ user.nickname?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="font-medium text-sm hidden sm:block">{{ user.nickname || user.email }}</span>
              </NuxtLink>
              <button 
                @click="handleLogout"
                class="text-[#8b949e] hover:text-white transition-colors font-medium text-xs sm:text-sm"
              >
                退出
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">个人中心</h1>

      <!-- 错误提示 -->
      <div v-if="loadError" class="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-start gap-3">
        <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="flex-1">
          <p class="text-red-400 text-sm">{{ loadError }}</p>
        </div>
        <button @click="loadError = ''" class="text-red-400 hover:text-red-300 flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading && !profileLoaded" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#58a6ff]"></div>
        <p class="text-[#8b949e] mt-4">加载中...</p>
      </div>

      <div v-else class="space-y-4 sm:space-y-6">
        <!-- 基本信息卡片 -->
        <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">基本信息</h2>
          
          <div class="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0">
              {{ user?.nickname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="min-w-0">
              <h3 class="text-base sm:text-xl font-bold text-white mb-1 truncate">{{ user?.nickname }}</h3>
              <p class="text-[#8b949e] text-xs sm:text-sm truncate">{{ user?.email }}</p>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">昵称</label>
              <input
                v-model="profileForm.nickname"
                type="text"
                class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                placeholder="请输入昵称"
              />
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">个人简介</label>
              <textarea
                v-model="profileForm.bio"
                rows="3"
                class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                placeholder="介绍一下自己吧..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#30363d] disabled:cursor-not-allowed text-white font-medium py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
            >
              {{ submitting ? '保存中...' : '保存修改' }}
            </button>
          </form>
        </div>

        <!-- 修改密码卡片 -->
        <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">修改密码</h2>
          
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">当前密码</label>
              <input
                v-model="passwordForm.old_password"
                type="password"
                required
                class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                placeholder="请输入当前密码"
              />
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">新密码</label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                required
                minlength="8"
                class="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                placeholder="至少 8 位，包含大写字母、小写字母、数字和特殊字符"
              />
            </div>

            <div v-if="passwordError" class="p-3 bg-red-900/20 border border-red-800 rounded-md">
              <p class="text-red-400 text-xs sm:text-sm">{{ passwordError }}</p>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#30363d] disabled:cursor-not-allowed text-white font-medium py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
            >
              {{ submitting ? '修改中...' : '修改密码' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '~/app/lib/api'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()
const { toastSuccess, toastError, toastInfo } = useToast()

const loading = ref(false)
const submitting = ref(false)
const passwordError = ref('')
const loadError = ref('')
const profileLoaded = ref(false)

const profileForm = ref({
  nickname: '',
  bio: '',
  avatar: ''
})

const passwordForm = ref({
  old_password: '',
  new_password: ''
})

// 加载用户信息
onMounted(async () => {
  loading.value = true
  loadError.value = ''
  
  try {
    // 先从本地 user 状态加载，如果没有再调用 API
    if (user.value) {
      profileForm.value.nickname = user.value.nickname || ''
      profileForm.value.bio = user.value.bio || ''
      profileForm.value.avatar = user.value.avatar || ''
      profileLoaded.value = true
    }
    
    // 尝试从 API 获取最新数据
    try {
      const userData = await userApi.getProfile()
      console.log('获取用户信息成功:', userData)
      profileForm.value.nickname = userData.nickname || ''
      profileForm.value.bio = userData.bio || ''
      profileForm.value.avatar = userData.avatar || ''
      profileLoaded.value = true
    } catch (apiError: any) {
      console.error('API 获取用户信息失败:', apiError)
      // 如果 API 失败但有本地数据，不显示错误
      if (!user.value) {
        loadError.value = apiError.response?.data?.message || apiError.data?.message || '加载用户信息失败，请重新登录'
        
        // 如果是 401 错误，跳转到登录页
        if (apiError.response?.status === 401) {
          toastError('请先登录', '未授权')
          setTimeout(() => {
            navigateTo('/login')
          }, 2000)
        }
      }
    }
  } catch (err: any) {
    console.error('加载用户信息失败:', err)
    loadError.value = '加载失败，请刷新页面重试'
  } finally {
    loading.value = false
  }
})

const updateProfile = async () => {
  submitting.value = true
  try {
    // 确保 avatar 字段有默认值
    const updateData = {
      nickname: profileForm.value.nickname,
      bio: profileForm.value.bio,
      avatar: profileForm.value.avatar || ''
    }
    
    await userApi.updateProfile(updateData)
    // 更新本地用户状态
    if (user.value) {
      user.value.nickname = profileForm.value.nickname
      user.value.bio = profileForm.value.bio
      user.value.avatar = updateData.avatar
    }
    toastSuccess('个人资料已更新')
  } catch (err: any) {
    console.error('更新个人资料失败:', err)
    toastError(err.message || '更新失败', '更新错误')
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
    toastSuccess('密码已修改')
    passwordForm.value = { old_password: '', new_password: '' }
  } catch (err: any) {
    passwordError.value = err.message || '修改失败'
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