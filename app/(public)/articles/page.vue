<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">最新资讯</h1>
      <p class="text-gray-600">
        追踪 AI 领域最新动态，洞察职业发展趋势
      </p>
    </div>

    <!-- 分类筛选 -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button 
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          activeCategory === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="activeCategory = 'all'"
      >
        全部
      </button>
      <button 
        v-for="category in categories"
        :key="category.id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          activeCategory === category.id 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 文章列表 -->
    <div class="space-y-6">
      <article 
        v-for="article in articles"
        :key="article.id"
        class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                getCategoryColor(article.category)
              ]"
            >
              {{ article.category }}
            </span>
            <span class="text-sm text-gray-500">{{ article.publishedAt }}</span>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>👁️ {{ article.viewCount }}</span>
            <span>💬 {{ article.commentCount }}</span>
          </div>
        </div>
        <h2 class="text-xl font-semibold mb-3">
          <NuxtLink :to="`/articles/${article.id}`" class="hover:text-blue-600">
            {{ article.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-600 mb-4 line-clamp-2">
          {{ article.summary }}
        </p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">来源：</span>
            <span class="text-sm text-gray-700">{{ article.source }}</span>
          </div>
          <div class="flex gap-2">
            <NuxtLink 
              :to="`/articles/${article.id}`"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              阅读全文 →
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- 分页 -->
    <div class="mt-12 flex justify-center">
      <nav class="flex items-center gap-2">
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">上一页</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md">1</button>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">2</button>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">3</button>
        <span class="px-2">...</span>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">10</button>
        <button class="px-4 py-2 border rounded-md hover:bg-gray-50">下一页</button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const activeCategory = ref('all')

const categories = [
  { id: 'dynamic', name: 'AI 动态' },
  { id: 'career', name: '职业影响' },
  { id: 'learning', name: '学习资源' },
  { id: 'tool', name: '工具产品' }
]

// 模拟数据
const articles = ref([
  {
    id: 1,
    title: 'GPT-5 发布：AI 能力再次飞跃，这些职业将受到影响',
    summary: 'OpenAI 今日发布 GPT-5，在多个基准测试中取得突破性进展。专家分析，文案、设计、客服等岗位将面临更大挑战...',
    category: 'AI 动态',
    source: '机器之心',
    publishedAt: '2026-03-30',
    viewCount: '1,234',
    commentCount: 23
  },
  {
    id: 2,
    title: '设计师如何应对 AI 冲击？这份转型指南请收好',
    summary: 'AI 绘图工具的崛起让设计师群体倍感压力。本文采访了 5 位成功转型的设计师，分享他们的经验和建议...',
    category: '职业影响',
    source: '知乎 AI',
    publishedAt: '2026-03-29',
    viewCount: '2,456',
    commentCount: 45
  },
  {
    id: 3,
    title: '零基础学习 AI 的完整路线图（2026 年版）',
    summary: '从 Python 基础到深度学习，从理论到实践，这份学习路线图为初学者提供了清晰的学习路径...',
    category: '学习资源',
    source: '量子位',
    publishedAt: '2026-03-28',
    viewCount: '3,789',
    commentCount: 67
  }
])

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'AI 动态': 'bg-blue-100 text-blue-800',
    '职业影响': 'bg-orange-100 text-orange-800',
    '学习资源': 'bg-green-100 text-green-800',
    '工具产品': 'bg-purple-100 text-purple-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
