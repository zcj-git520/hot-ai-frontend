<template>
  <div class="relative">
    <!-- Hero 区域 -->
    <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-16">
      <!-- 背景效果层 -->
      <div class="absolute inset-0">
        <!-- 渐变背景 -->
        <div class="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5"></div>

        <!-- 动态网格 -->
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, rgba(0,210,255,0.3) 1px, transparent 0); background-size: 50px 50px;"></div>

        <!-- 扫描线 -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan"></div>
        </div>

        <!-- 角落装饰 -->
        <div class="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-3xl"></div>
        <div class="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-3xl"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30 rounded-bl-3xl"></div>
        <div class="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30 rounded-br-3xl"></div>
      </div>

      <!-- 内容 -->
      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <!-- 状态标签 -->
        <div class="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span class="text-xs font-mono text-cyan-400 tracking-wider">NEURAL NETWORK ONLINE</span>
        </div>

        <!-- 主标题 -->
        <h1 class="font-tech font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-gradient">
            AI 时代
          </span>
          <br />
          <span class="text-white">职业导航系统</span>
        </h1>

        <!-- 副标题 -->
        <p class="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          <span class="text-cyan-400 font-mono">//</span>
          探索前沿 AI 趋势 &nbsp;|&nbsp; 评估职业风险指数 &nbsp;|&nbsp; 获取个性化学习路径
          <span class="text-cyan-400 font-mono">//</span>
        </p>

        <!-- CTA 按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <NuxtLink to="/professions" class="btn-cyber group relative overflow-hidden">
            <span class="relative z-10 flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              查询职业风险
            </span>
          </NuxtLink>
          <NuxtLink to="/articles" class="btn-cyber-outline group relative overflow-hidden">
            <span class="relative z-10 flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6" />
              </svg>
              浏览最新资讯
            </span>
          </NuxtLink>
        </div>

        <!-- 统计数据 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div v-for="stat in stats" :key="stat.label" class="glass-card p-4 sm:p-6">
            <div class="font-tech text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">{{ stat.value }}</div>
            <div class="text-xs sm:text-sm text-gray-500 font-mono uppercase tracking-wider">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <div class="w-8 h-14 rounded-full border-2 border-cyan-500/30 flex items-start justify-center p-2">
          <div class="w-1.5 h-3 rounded-full bg-cyan-400 animate-bounce"></div>
        </div>
      </div>
    </section>

    <!-- 最新资讯 -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-8">
        <h2 class="section-title">最新资讯</h2>
        <NuxtLink to="/articles" class="btn-cyber-ghost text-sm flex items-center gap-2">
          查看全部
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="glass-card p-6">
          <div class="skeleton h-4 w-24 mb-4"></div>
          <div class="skeleton h-6 w-full mb-2"></div>
          <div class="skeleton h-6 w-3/4 mb-4"></div>
          <div class="skeleton h-4 w-full mb-2"></div>
          <div class="skeleton h-4 w-2/3"></div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-else-if="latestArticles && latestArticles.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="(article, index) in latestArticles"
          :key="article.id"
          class="glass-card card-decoration p-6 group hover:border-cyan-400/50 transition-all duration-300"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- 分类标签 -->
          <div class="flex items-center justify-between mb-4">
            <span
              :class="[
                'tag-cyber',
                getCategoryClass(article.category_code)
              ]"
            >
              {{ article.category_name }}
            </span>
            <span class="text-xs text-gray-600 font-mono">
              {{ formatDate(article.published_at) }}
            </span>
          </div>

          <!-- 标题 -->
          <h3 class="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
            <NuxtLink :to="`/articles/${article.id}`">
              {{ article.title }}
            </NuxtLink>
          </h3>

          <!-- 摘要 -->
          <p class="text-sm text-gray-500 mb-4 line-clamp-2">
            {{ article.summary }}
          </p>

          <!-- 统计 -->
          <div class="flex items-center gap-4 text-xs text-gray-600 mb-4">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ formatNumber(article.view_count || 0) }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ formatNumber(article.comment_count || 0) }}
            </span>
          </div>

          <!-- 来源 -->
          <div class="pt-4 border-t border-cyan-500/10 flex items-center justify-between">
            <span class="text-xs text-gray-600">来源: {{ article.source_name }}</span>
            <NuxtLink
              :to="`/articles/${article.id}`"
              class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              阅读全文
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-else class="glass-card p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6" />
          </svg>
        </div>
        <p class="text-gray-500">暂无文章数据</p>
      </div>
    </section>

    <!-- 职业风险查询 -->
    <section class="mb-16">
      <div class="glass-card neon-border p-8 md:p-12 relative overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 class="section-title mb-2">职业风险评估</h2>
              <p class="text-gray-500">输入你的职业，获取 AI 威胁指数和转型建议</p>
            </div>
            <div class="flex items-center gap-2 text-xs font-mono">
              <span class="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></span>
              <span class="text-gray-500">实时 AI 威胁评估系统</span>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <div class="relative flex-1">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="输入职业名称, 例如: 设计师、程序员、运营..."
                class="input-cyber pl-12"
              />
            </div>
            <button class="btn-cyber flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              立即分析
            </button>
          </div>

          <!-- 热门职业 -->
          <div class="flex flex-wrap gap-2">
            <span class="text-xs text-gray-600 mr-2">热门查询:</span>
            <NuxtLink
              v-for="job in popularJobs"
              :key="job"
              :to="`/professions/${job.toLowerCase()}`"
              class="px-3 py-1.5 text-xs font-mono rounded border border-cyan-500/20 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all bg-cyan-500/5 hover:bg-cyan-500/10"
            >
              {{ job }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习路径 -->
    <section>
      <div class="flex justify-between items-center mb-8">
        <h2 class="section-title">热门学习路径</h2>
        <NuxtLink to="/learning-paths" class="btn-cyber-ghost text-sm flex items-center gap-2">
          查看全部
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="(path, index) in learningPaths"
          :key="path.id"
          to="/learning-paths"
          class="glass-card card-decoration p-6 group hover:border-cyan-400/50 transition-all duration-300"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- 路径等级 -->
          <div class="flex items-center justify-between mb-4">
            <span :class="['tag-cyber', path.levelClass]">{{ path.level }}</span>
            <span class="flex items-center gap-1 text-xs text-gray-500 font-mono">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ path.duration }}
            </span>
          </div>

          <!-- 标题 -->
          <h3 class="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
            {{ path.title }}
          </h3>

          <!-- 描述 -->
          <p class="text-sm text-gray-500 mb-4 line-clamp-2">
            {{ path.description }}
          </p>

          <!-- 进度 -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-gray-500">学习进度</span>
              <span class="text-cyan-400 font-mono">{{ path.progress }}%</span>
            </div>
            <div class="progress-cyber">
              <div class="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" :style="{ width: path.progress + '%' }"></div>
            </div>
          </div>

          <!-- 底部 -->
          <div class="flex items-center justify-between pt-4 border-t border-cyan-500/10">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full border-2 border-[var(--bg-card)] bg-gradient-to-br from-cyan-400/30 to-purple-400/30"></div>
              </div>
              <span class="text-xs text-gray-500">{{ path.students }}</span>
            </div>
            <span class="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">
              开始学习 →
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 获取最新资讯
const { data: latestArticles } = await useFetch('/api/articles', {
  query: {
    page: 1,
    page_size: 3
  },
  transform: (data) => {
    const responseData = data?.data || data
    return responseData?.articles || []
  }
})

const loading = ref(false)

const stats = [
  { value: '10K+', label: 'AI 资讯' },
  { value: '500+', label: '职业分析' },
  { value: '50+', label: '学习路径' },
  { value: '100+', label: 'AI 工具' },
]

const popularJobs = ['设计师', '程序员', '运营', '文案', '产品经理']

const learningPaths = [
  {
    id: 1,
    title: '零基础入门 AI',
    level: '入门',
    levelClass: 'tag-risk-low',
    duration: '30 天',
    description: '从零开始，系统学习 AI 基础知识，掌握常用工具和实践技能',
    progress: 35,
    students: '1.2k 在学',
  },
  {
    id: 2,
    title: 'AI 辅助编程实战',
    level: '进阶',
    levelClass: 'tag-risk-medium',
    duration: '45 天',
    description: '掌握 Copilot 等 AI 编程工具，提升开发效率 10 倍',
    progress: 62,
    students: '890 在学',
  },
  {
    id: 3,
    title: 'AI 产品经理之路',
    level: '高级',
    levelClass: 'tag-risk-high',
    duration: '60 天',
    description: '学习如何将 AI 能力融入产品，打造下一代 AI 原生应用',
    progress: 18,
    students: '456 在学',
  },
]

const getCategoryClass = (code: string) => {
  const map: Record<string, string> = {
    news: 'category-news',
    impact: 'category-impact',
    learn: 'category-learn',
    tool: 'category-tool',
  }
  return map[code] || 'category-news'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}
</script>

<style scoped>
@keyframes scan {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

.animate-scan {
  animation: scan 8s linear infinite;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
