<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- 背景光效 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -1s;"></div>
      <div class="absolute bottom-1/4 left-1/3 w-72 h-72 bg-magenta-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -2s;"></div>
    </div>

    <!-- 顶部导航 -->
    <header class="relative z-50 border-b border-cyan-500/20 bg-[rgba(3,5,8,0.9)]/80 backdrop-blur-xl">
      <nav class="page-container">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <span class="text-white font-tech font-bold text-lg">AI</span>
              </div>
              <div class="absolute inset-0 rounded-lg bg-cyan-400/30 blur-lg group-hover:bg-cyan-400/50 transition-all"></div>
            </div>
            <div>
              <span class="font-tech font-bold text-lg tracking-wider text-neon-cyan">AI 热点追踪</span>
              <span class="hidden sm:inline text-xs text-gray-500 ml-2 font-mono">v2.0</span>
            </div>
          </NuxtLink>

          <!-- 桌面导航 -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link relative px-5 py-2 font-medium text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300"
              :class="{ 'text-cyan-400': isActiveRoute(item.path) }"
            >
              <span class="relative z-10 flex items-center gap-2">
                <component :is="item.icon" class="w-4 h-4" />
                {{ item.name }}
              </span>
              <div
                v-if="isActiveRoute(item.path)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              ></div>
            </NuxtLink>
          </div>

          <!-- 用户区域 -->
          <div class="flex items-center gap-4">
            <template v-if="isAuthenticated">
              <NuxtLink to="/profile" class="flex items-center gap-3 group">
                <div class="relative">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-tech font-semibold text-sm group-hover:border-cyan-400 transition-all">
                    {{ user?.nickname?.charAt(0) || 'U' }}
                  </div>
                  <div class="absolute inset-0 rounded-full border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all"></div>
                </div>
                <span class="hidden sm:block text-sm text-gray-400 group-hover:text-cyan-400 transition-colors">
                  {{ user?.nickname }}
                </span>
              </NuxtLink>
              <button
                @click="handleLogout"
                class="btn-cyber-ghost text-sm"
              >
                退出
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-cyber-ghost text-sm">
                登录
              </NuxtLink>
              <NuxtLink to="/register" class="btn-cyber text-sm">
                注册
              </NuxtLink>
            </template>

            <!-- 移动端菜单按钮 -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden ml-2 p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 移动端菜单 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-cyan-500/20">
            <div class="flex flex-col gap-2">
              <NuxtLink
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                @click="mobileMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                :class="{ 'text-cyan-400 bg-cyan-500/10': isActiveRoute(item.path) }"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- 主要内容 -->
    <main class="flex-1 relative z-10 page-container py-8">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="relative z-10 border-t border-cyan-500/20 bg-[rgba(3,5,8,0.95)]/80 backdrop-blur-xl mt-auto">
      <div class="page-container py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- 品牌信息 -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <span class="text-white font-tech font-bold text-lg">AI</span>
              </div>
              <span class="font-tech font-bold text-lg tracking-wider text-neon-cyan">AI 热点追踪</span>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">
              探索 AI 前沿技术<br />
              解读职业风险与机遇<br />
              开启智能未来之路
            </p>
            <!-- 社交链接 -->
            <div class="flex gap-3 mt-4">
              <a href="#" class="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          <!-- 快速链接 -->
          <div>
            <h4 class="font-tech text-sm font-semibold text-cyan-400 mb-4 tracking-wider uppercase">快速链接</h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/articles" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-cyan-500/50"></span>
                  最新资讯
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/professions" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-cyan-500/50"></span>
                  职业风险查询
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/learning-paths" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-cyan-500/50"></span>
                  学习路径
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/tools" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-cyan-500/50"></span>
                  AI 工具库
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 资源 -->
          <div>
            <h4 class="font-tech text-sm font-semibold text-cyan-400 mb-4 tracking-wider uppercase">资源</h4>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-purple-500/50"></span>
                  技术文档
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-purple-500/50"></span>
                  API 接口
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-purple-500/50"></span>
                  开源项目
                </a>
              </li>
            </ul>
          </div>

          <!-- 联系方式 -->
          <div>
            <h4 class="font-tech text-sm font-semibold text-cyan-400 mb-4 tracking-wider uppercase">联系我们</h4>
            <ul class="space-y-3">
              <li class="text-sm text-gray-500 flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@hot-ai.com
              </li>
              <li class="text-sm text-gray-500 flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                北京 · 中关村
              </li>
            </ul>
          </div>
        </div>

        <!-- 底部版权 -->
        <div class="pt-8 border-t border-cyan-500/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-xs text-gray-600 font-mono">
            © 2024-2026 AI 热点追踪平台 · Neural Network v2.0
          </p>
          <div class="flex items-center gap-4 text-xs text-gray-600">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              系统在线
            </span>
            <span>响应时间: 23ms</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()
const route = useRouter().currentRoute
const mobileMenuOpen = ref(false)

// 图标组件
const IconArticle = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>`
}

const IconProfession = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
}

const IconLearning = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`
}

const IconTools = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
}

const navItems = [
  { name: '资讯', path: '/articles', icon: IconArticle },
  { name: '职业风险', path: '/professions', icon: IconProfession },
  { name: '学习路径', path: '/learning-paths', icon: IconLearning },
  { name: '工具库', path: '/tools', icon: IconTools },
]

const isActiveRoute = (path: string) => {
  return route.value.path.startsWith(path)
}

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await logout()
  }
}

// 关闭移动端菜单
watch(route, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

.text-neon-cyan {
  color: var(--accent-cyan);
  text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
}
</style>
