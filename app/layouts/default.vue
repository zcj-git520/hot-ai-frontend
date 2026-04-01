<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              AI 热点追踪平台
            </NuxtLink>
            <div class="hidden md:flex ml-10 space-x-8">
              <NuxtLink to="/articles" class="text-gray-700 hover:text-gray-900">
                资讯
              </NuxtLink>
              <NuxtLink to="/professions" class="text-gray-700 hover:text-gray-900">
                职业风险
              </NuxtLink>
              <NuxtLink to="/learning-paths" class="text-gray-700 hover:text-gray-900">
                学习路径
              </NuxtLink>
              <NuxtLink to="/tools" class="text-gray-700 hover:text-gray-900">
                工具库
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <NuxtLink to="/profile" class="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {{ user?.nickname?.charAt(0) || 'U' }}
                </div>
                <span class="text-sm">{{ user?.nickname }}</span>
              </NuxtLink>
              <button @click="handleLogout" class="text-gray-700 hover:text-gray-900 text-sm">
                退出
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-gray-700 hover:text-gray-900">登录</NuxtLink>
              <NuxtLink to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                注册
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">关于我们</h3>
            <p class="text-gray-600 text-sm">
              AI 时代的职业导航仪 - 帮助普通人理解 AI、应对 AI、利用 AI
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">快速链接</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/articles" class="hover:text-gray-900">最新资讯</NuxtLink></li>
              <li><NuxtLink to="/professions" class="hover:text-gray-900">职业风险查询</NuxtLink></li>
              <li><NuxtLink to="/learning-paths" class="hover:text-gray-900">学习指南</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">联系方式</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>邮箱：contact@hot-ai.com</li>
              <li>GitHub: github.com/hot-ai</li>
            </ul>
          </div>
        </div>
        <div class="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          &copy; 2026 AI 热点追踪平台。All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await logout()
  }
}
</script>
