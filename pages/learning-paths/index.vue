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
              <NuxtLink to="/learning-paths" class="text-white font-medium">学习路径</NuxtLink>
              <NuxtLink to="/tools" class="text-[#8b949e] hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-4">
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
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">学习路径</h1>
        <p class="text-[#8b949e] text-lg mb-8">系统学习 AI 技能，提升职业竞争力</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="path in paths" 
          :key="path.id"
          class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">{{ path.icon }}</span>
            <span :class="getLevelStyle(path.level)" class="text-xs px-3 py-1.5 rounded-full font-bold">
              {{ path.level }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-2">
            {{ path.title }}
          </h3>
          <p class="text-[#8b949e] text-sm mb-4">
            {{ path.description }}
          </p>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4 text-xs text-[#8b949e]">
              <span>⏱️ {{ path.duration }}</span>
              <span>📚 {{ path.courses }} 门课程</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-[#30363d]">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-[#161b22]"></div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 border-2 border-[#161b22]"></div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 border-2 border-[#161b22]"></div>
            </div>
            <span class="text-sm text-[#8b949e]">{{ path.students }} 人在学</span>
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

const paths = ref([
  { 
    id: 1, 
    title: '零基础入门 AI', 
    icon: '🌱',
    description: '从零开始，系统学习 AI 基础知识，掌握常用工具和实践技能', 
    level: '入门', 
    duration: '30 天', 
    courses: 12,
    students: '12.5k'
  },
  { 
    id: 2, 
    title: '提示词工程进阶', 
    icon: '✍️',
    description: '掌握高级提示词技巧，提升与大模型的交互效率和质量', 
    level: '进阶', 
    duration: '21 天', 
    courses: 8,
    students: '8.3k'
  },
  { 
    id: 3, 
    title: 'AI 编程助手实战', 
    icon: '💻',
    description: '学习使用 Cursor、GitHub Copilot 等工具提升开发效率', 
    level: '进阶', 
    duration: '28 天', 
    courses: 10,
    students: '15.2k'
  },
  { 
    id: 4, 
    title: 'AI 绘画与视觉设计', 
    icon: '🎨',
    description: '掌握 Midjourney、Stable Diffusion 等 AI 绘画工具', 
    level: '入门', 
    duration: '35 天', 
    courses: 14,
    students: '9.7k'
  },
  { 
    id: 5, 
    title: 'AI 应用开发', 
    icon: '🚀',
    description: '学习构建基于大模型的实际应用和产品', 
    level: '高级', 
    duration: '45 天', 
    courses: 16,
    students: '5.6k'
  },
  { 
    id: 6, 
    title: '数据分析与 AI', 
    icon: '📊',
    description: '运用 AI 技术提升数据分析能力和商业洞察', 
    level: '进阶', 
    duration: '40 天', 
    courses: 13,
    students: '7.1k'
  }
])

const getLevelStyle = (level: string) => {
  const styles: Record<string, string> = {
    '入门': 'bg-green-500/10 text-green-400',
    '进阶': 'bg-blue-500/10 text-blue-400',
    '高级': 'bg-purple-500/10 text-purple-400'
  }
  return styles[level] || 'bg-gray-500/10 text-gray-400'
}
</script>
