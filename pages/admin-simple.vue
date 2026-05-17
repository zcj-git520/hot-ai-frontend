<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- Sidebar -->
      <LayoutAdminSidebar />

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">管理后台</h1>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">学习路径</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div class="text-4xl">📚</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">章节总数</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div class="text-4xl">📄</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">已发布</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div class="text-4xl">✅</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">待发布</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div class="text-4xl">📝</div>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
          <div class="flex gap-4">
            <NuxtLink
              to="/admin/learning-paths"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              管理学习路径
            </NuxtLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// No middleware for testing
</script>
