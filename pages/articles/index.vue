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
              <NuxtLink to="/tools" class="text-[#8b949e] hover:text-white transition-colors font-medium">工具库</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/login" class="text-[#8b949e] hover:text-white transition-colors font-medium">登录</NuxtLink>
            <NuxtLink to="/register" class="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md font-medium transition-all shadow-lg hover:shadow-xl">
              注册
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-4">资讯列表</h1>
        <p class="text-[#8b949e] text-lg mb-8">获取最新的 AI 行业动态和技术进展</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="i in 9" 
            :key="i"
            class="bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#58a6ff] transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">大模型</span>
              <span class="text-[#8b949e] text-xs">2026-03-30</span>
            </div>
            <h3 class="text-lg font-bold text-white group-hover:text-[#58a6ff] transition-colors mb-3">
              GPT-5 发布：AI 能力再次飞跃，这些职业将受到影响
            </h3>
            <p class="text-[#8b949e] text-sm mb-4 line-clamp-3">
              OpenAI 今日发布 GPT-5，在多个基准测试中取得突破性进展。专家分析，文案、设计、客服等岗位将面临更大挑战...
            </p>
            <div class="flex items-center gap-4 text-xs text-[#8b949e]">
              <span>👁️ 12.3k</span>
              <span>💬 234</span>
              <span>🔥 9.8k</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 资讯列表页面
</script>
