<template>
  <div>
    <!-- Hero 区域 -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-12">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          AI 时代的职业导航仪
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          帮助普通人理解 AI、应对 AI、利用 AI
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/professions" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            查询职业风险
          </NuxtLink>
          <NuxtLink 
            to="/articles" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
          >
            浏览最新资讯
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 最新资讯 -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900">最新资讯</h2>
        <NuxtLink to="/articles" class="text-blue-600 hover:text-blue-700">
          查看更多 →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article 
          v-for="i in 3" 
          :key="i"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
        >
          <div class="text-sm text-gray-500 mb-2">2026-03-30 · AI 动态</div>
          <h3 class="text-lg font-semibold mb-3">
            <NuxtLink to="/articles/demo" class="hover:text-blue-600">
              GPT-5 发布：AI 能力再次飞跃，这些职业将受到影响
            </NuxtLink>
          </h3>
          <p class="text-gray-600 text-sm mb-4">
            OpenAI 今日发布 GPT-5，在多个基准测试中取得突破性进展。专家分析，文案、设计、客服等岗位将面临更大挑战...
          </p>
          <div class="flex items-center text-sm text-gray-500">
            <span class="mr-4">👁️ 1,234 阅读</span>
            <span>💬 23 评论</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 职业风险快速查询 -->
    <section class="mb-16">
      <div class="bg-blue-50 rounded-2xl p-8 md:p-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          你的职业安全吗？
        </h2>
        <p class="text-gray-700 mb-8">
          立即查询职业风险等级，获取转型建议和学习路径
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="输入你的职业，例如：设计师、程序员、运营..."
            class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            立即查询
          </button>
        </div>
        <div class="mt-8 flex flex-wrap gap-2">
          <span class="text-sm text-gray-600">热门查询：</span>
          <NuxtLink to="/professions/designer" class="text-sm bg-white px-3 py-1 rounded-full hover:bg-blue-100">
            设计师
          </NuxtLink>
          <NuxtLink to="/professions/programmer" class="text-sm bg-white px-3 py-1 rounded-full hover:bg-blue-100">
            程序员
          </NuxtLink>
          <NuxtLink to="/professions/operator" class="text-sm bg-white px-3 py-1 rounded-full hover:bg-blue-100">
            运营
          </NuxtLink>
          <NuxtLink to="/professions/writer" class="text-sm bg-white px-3 py-1 rounded-full hover:bg-blue-100">
            文案策划
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 学习路径推荐 -->
    <section>
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900">热门学习路径</h2>
        <NuxtLink to="/learning-paths" class="text-blue-600 hover:text-blue-700">
          查看全部 →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="i in 3" 
          :key="i"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              入门
            </span>
            <span class="text-sm text-gray-500">⏱️ 30 天</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">
            <NuxtLink to="/learning-paths/beginner" class="hover:text-blue-600">
              零基础入门 AI
            </NuxtLink>
          </h3>
          <p class="text-gray-600 text-sm mb-4">
            从零开始，系统学习 AI 基础知识，掌握常用工具和实践技能
          </p>
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
              <div class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
              <div class="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
            </div>
            <span class="text-sm text-gray-500">1.2k 人在学</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 首页组件
definePageMeta({
  layout: 'default'
})
</script>
