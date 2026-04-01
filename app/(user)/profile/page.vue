<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">个人中心</h1>

      <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
        <!-- 基本信息 -->
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          
          <div class="flex items-center space-x-4 mb-6">
            <div class="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-medium text-gray-600">
              {{ user?.nickname?.charAt(0) || 'U' }}
            </div>
            <div>
              <h3 class="text-xl font-medium text-gray-900">{{ user?.nickname }}</h3>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label for="nickname" class="block text-sm font-medium text-gray-700">昵称</label>
              <input
                id="nickname"
                v-model="profileForm.nickname"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">个人简介</label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? '保存中...' : '保存修改' }}
            </button>
          </form>
        </div>

        <!-- 偏好设置 -->
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">偏好设置</h2>
          
          <form @submit.prevent="updatePreferences" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">主题</label>
              <select
                v-model="preferencesForm.theme"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="light">明亮</option>
                <option value="dark">黑暗</option>
                <option value="system">跟随系统</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">通知设置</label>
              
              <div class="flex items-center">
                <input
                  id="system-update"
                  v-model="preferencesForm.email_notifications.system_update"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="system-update" class="ml-2 block text-sm text-gray-700">
                  系统更新通知
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="new-content"
                  v-model="preferencesForm.email_notifications.new_content"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="new-content" class="ml-2 block text-sm text-gray-700">
                  新内容推送
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="weekly-digest"
                  v-model="preferencesForm.email_notifications.weekly_digest"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="weekly-digest" class="ml-2 block text-sm text-gray-700">
                  周报
                </label>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? '保存中...' : '保存偏好' }}
            </button>
          </form>
        </div>

        <!-- 修改密码 -->
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">修改密码</h2>
          
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label for="oldPassword" class="block text-sm font-medium text-gray-700">当前密码</label>
              <input
                id="oldPassword"
                v-model="passwordForm.old_password"
                type="password"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">新密码</label>
              <input
                id="newPassword"
                v-model="passwordForm.new_password"
                type="password"
                required
                minlength="8"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div v-if="passwordError" class="text-red-500 text-sm">
              {{ passwordError }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? '修改中...' : '修改密码' }}
            </button>
          </form>
        </div>

        <!-- 退出登录 -->
        <div class="p-6">
          <button
            @click="handleLogout"
            class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApi } from '~/app/lib/api'

definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()

const loading = ref(false)
const passwordError = ref('')

const profileForm = ref({
  nickname: '',
  bio: ''
})

const preferencesForm = ref({
  theme: 'light',
  email_notifications: {
    system_update: true,
    new_content: true,
    weekly_digest: true
  }
})

const passwordForm = ref({
  old_password: '',
  new_password: ''
})

// 加载用户信息
onMounted(async () => {
  try {
    const userData = await userApi.getProfile()
    profileForm.value.nickname = userData.nickname || ''
    profileForm.value.bio = userData.bio || ''
    
    if (userData.preferences) {
      preferencesForm.value.theme = userData.preferences.theme || 'light'
      preferencesForm.value.email_notifications = userData.preferences.email_notifications || {
        system_update: true,
        new_content: true,
        weekly_digest: true
      }
    }
  } catch (err) {
    console.error('Failed to load user profile')
  }
})

const updateProfile = async () => {
  loading.value = true
  try {
    await userApi.updateProfile(profileForm.value)
    alert('个人资料已更新')
  } catch (err) {
    alert('更新失败')
  } finally {
    loading.value = false
  }
}

const updatePreferences = async () => {
  loading.value = true
  try {
    await userApi.updatePreferences(preferencesForm.value)
    alert('偏好设置已更新')
  } catch (err) {
    alert('更新失败')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new_password.length < 8) {
    passwordError.value = '密码长度至少为 8 位'
    return
  }

  loading.value = true
  passwordError.value = ''

  try {
    await userApi.changePassword(passwordForm.value)
    alert('密码已修改')
    passwordForm.value = { old_password: '', new_password: '' }
  } catch (err: any) {
    passwordError.value = err.data?.message || err.response?.data?.message || '修改失败'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await logout()
  }
}
</script>
