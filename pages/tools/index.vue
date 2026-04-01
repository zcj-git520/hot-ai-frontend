<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 顶部导航栏 -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="text-2xl font-bold text-white flex items-center gap-2">
              <span class="text-3xl">🤖</span>
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 热点追踪</span>
            </NuxtLink>
            <nav class="hidden md:flex items-center gap-6">
              <NuxtLink to="/" class="text-[#8b949e] hover:text-white transition-colors font-medium">首页</NuxtLink>
              <NuxtLink to="/articles" class="text-[#8b949e] hover:text-white transition-colors font-medium">资讯</NuxtLink>
              <NuxtLink to="/professions" class="text-[#8b949e] hover:text-white transition-colors font-medium">职业风险</NuxtLink>
              <NuxtLink to="/learning-paths" class="text-[#8b949e] hover:text-white transition-colors font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-white font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <!-- 登录状态 -->
          <div v-if="user" class="flex items-center gap-4">
            <NuxtLink to="/profile" class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-sm">
                {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <span class="text-white font-medium hidden md:block">{{ user.nickname || user.email }}</span>
            </NuxtLink>
            <button 
              @click="handleLogout"
              class="text-[#8b949e] hover:text-white transition-colors font-medium"
            >
              退出
            </button>
          </div>
          
          <!-- 未登录状态 -->
          <div v-else class="flex items-center gap-4">
            <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium">登录</NuxtLink>
            <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md font-medium transition-all shadow-lg hover:shadow-xl">
              注册
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">AI 工具库</h1>
        <p class="text-[#8b949e] text-lg mb-8">精选 AI 工具，提升工作效率</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="tool in tools" 
          :key="tool.id"
          class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-4xl">{{ tool.icon }}</span>
            <span :class="getCategoryStyle(tool.category)" class="text-xs px-3 py-1.5 rounded-full font-bold">
              {{ tool.category }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2">
            {{ tool.name }}
          </h3>
          <p class="text-[#8b949e] text-sm mb-4">
            {{ tool.description }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-[#8b949e]">
              <span>⭐ {{ tool.rating }}</span>
              <span>👥 {{ tool.users }}</span>
            </div>
            <span class="text-[#58a6ff] font-medium">详情 →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

// 获取认证信息
const { user, clearAuth, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

// 恢复用户认证信息
onMounted(() => {
  restoreAuth()
})

// 退出登录
const handleLogout = async () => {
  try {
    const { authApi } = await import('~/app/lib/api')
    await authApi.logout()
    toastSuccess('已退出登录')
  } catch (error) {
    console.error('Logout failed', error)
    toastError('退出登录失败')
  } finally {
    clearAuth()
    navigateTo('/')
  }
}

const tools = ref([
  { 
    id: 1, 
    name: 'Cursor', 
    icon: '💻', 
    category: '编程开发', 
    description: 'AI 编程助手，支持代码补全、重构和调试', 
    rating: '4.9', 
    users: '120k+' 
  },
  { 
    id: 2, 
    name: 'Midjourney', 
    icon: '🎨', 
    category: '视觉设计', 
    description: 'AI 绘画工具，生成高质量艺术作品', 
    rating: '4.8', 
    users: '200k+' 
  },
  { 
    id: 3, 
    name: 'Notion AI', 
    icon: '📝', 
    category: '写作办公', 
    description: '智能写作助手，支持文档总结、润色和翻译', 
    rating: '4.7', 
    users: '85k+' 
  },
  { 
    id: 4, 
    name: 'GitHub Copilot', 
    icon: '🚀', 
    category: '编程开发', 
    description: 'GitHub 官方 AI 编程助手，智能代码补全', 
    rating: '4.8', 
    users: '300k+' 
  },
  { 
    id: 5, 
    name: 'Stable Diffusion', 
    icon: '🖼️', 
    category: '视觉设计', 
    description: '开源 AI 绘画模型，可本地部署', 
    rating: '4.6', 
    users: '150k+' 
  },
  { 
    id: 6, 
    name: 'Jasper', 
    icon: '✍️', 
    category: '写作办公', 
    description: '专业 AI 写作工具，适合营销和创意写作', 
    rating: '4.5', 
    users: '50k+' 
  }
])

const getCategoryStyle = (category: string) => {
  const styles: Record<string, string> = {
    '编程开发': 'bg-blue-500/10 text-blue-400',
    '视觉设计': 'bg-purple-500/10 text-purple-400',
    '写作办公': 'bg-green-500/10 text-green-400'
  }
  return styles[category] || 'bg-gray-500/10 text-gray-400'
}
</script>
