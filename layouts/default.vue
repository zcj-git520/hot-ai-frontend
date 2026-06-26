<template>
  <div class="min-h-screen flex flex-col font-sans text-ink bg-paper">

    <!-- ============================================================
         报头：日期 / 期号 + 大字刊名 + 卷次导航
         ============================================================ -->
    <header class="relative z-30">

      <!-- 报头顶条 -->
      <div class="broadsheet">
        <div class="flex items-center justify-between py-2.5 text-[11px] tracking-[0.18em] uppercase font-mono text-ink-mute">
          <span class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-vermillion"></span>
            {{ todayFormatted }}
          </span>
          <span class="hidden sm:inline">第 {{ edition }} 期 · 总第 {{ totalIssue }} 号</span>
          <span class="hidden md:inline">{{ weatherCopy }}</span>
        </div>
      </div>

      <hr class="rule-cinnabar" />

      <!-- 刊名区 -->
      <div class="broadsheet">
        <div class="grid grid-cols-1 md:grid-cols-3 items-end gap-6 py-7 md:py-10">
          <div class="hidden md:flex flex-col gap-2 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <span>本期主编 · 观察编辑部</span>
            <span>本期执笔 · 数据组 / 风险组</span>
          </div>

          <NuxtLink to="/" class="col-span-1 md:col-span-1 text-center group">
            <h1 class="masthead-title">
              <span class="text-ink">AI</span><em>观</em><span class="text-ink">察</span>
            </h1>
            <p class="mt-2 text-[10.5px] font-mono tracking-[0.24em] uppercase text-ink-mute">
              The&nbsp;AI&nbsp;Observer &nbsp;·&nbsp; 印于&nbsp;上海
            </p>
          </NuxtLink>

          <div class="hidden md:flex flex-col items-end gap-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute">
            <div v-if="!isAuthenticated" class="flex items-center gap-4">
              <NuxtLink to="/login" class="text-ink-mute hover:text-ink underline-draw">登入</NuxtLink>
              <NuxtLink to="/register" class="seal-square seal-square--tilt-r">订阅</NuxtLink>
            </div>

            <div v-else class="flex items-center gap-3">
              <NuxtLink to="/profile" class="flex items-center gap-2.5 group">
                <span class="w-9 h-9 flex items-center justify-center border-2 border-ink text-ink font-serif font-black text-[15px] tracking-[0.04em] group-hover:border-vermillion group-hover:text-vermillion transition-colors">
                  {{ userInitial }}
                </span>
                <div class="flex flex-col items-end leading-tight">
                  <span class="text-[12.5px] font-serif font-bold text-ink normal-case tracking-[0.04em]">
                    {{ user?.nickname || '读者' }}
                  </span>
                  <span
                    class="text-[10px] font-mono tracking-[0.18em] uppercase mt-0.5 px-1.5 py-px"
                    :class="userLevel === 2 ? 'text-vermillion border border-vermillion' : userLevel === 1 ? 'text-indigo border border-indigo' : 'text-ink-mute border border-ink-mute'"
                  >
                    {{ userLevelLabel }}
                  </span>
                </div>
              </NuxtLink>
              <button @click="handleLogout" class="text-ink-mute hover:text-vermillion underline-draw">登出</button>
            </div>

            <span>刊例 · 周一出版</span>
          </div>
        </div>
      </div>

      <hr class="rule-thick" />

      <!-- 卷次导航 -->
      <nav class="broadsheet">
        <ul class="flex flex-wrap items-stretch justify-center gap-x-8 gap-y-2 md:gap-x-14 py-4">
          <li v-for="item in juanItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="juan-nav-item"
              :class="{ 'is-active': isActiveRoute(item.path) }"
            >
              <span class="font-mono text-[10.5px] tracking-[0.18em] uppercase text-seal">{{ item.juan }}</span>
              <span>{{ item.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <hr class="rule" />

      <!-- 卷首引言 / 当期重要信息 -->
      <div class="broadsheet">
        <div class="flex items-center gap-3 py-2.5 text-[11px] tracking-[0.18em] uppercase font-mono text-ink-mute">
          <span class="seal-round" style="width:1.7rem; height:1.7rem; font-size:9px;">本期</span>
          <span class="flex-1 overflow-hidden whitespace-nowrap">
            <span v-for="(t, i) in tickerItems" :key="i" class="inline-block px-6">
              <span class="text-vermillion">●</span> {{ t }}
            </span>
          </span>
        </div>
      </div>

      <hr class="rule" />
    </header>

    <!-- ============================================================
         主内容
         ============================================================ -->
    <main class="flex-1 relative z-10">
      <slot />
    </main>

    <!-- ============================================================
         页脚 — 刊末
         ============================================================ -->
    <footer class="relative z-10 mt-20">
      <div class="broadsheet">
        <hr class="rule-cinnabar" />
        <div class="py-10 text-center">
          <div class="inline-flex items-center gap-4">
            <span class="seal-square seal-square--tilt-l">刊末</span>
            <span class="font-serif text-[15px] text-ink-mute tracking-[0.08em]">一刊之成，多人之功。</span>
          </div>
        </div>
        <hr class="rule" />
      </div>

      <div class="broadsheet py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 class="font-serif font-bold text-[17px] mb-4 text-ink">关于本刊</h4>
            <p class="text-[13.5px] text-ink-mute leading-[1.85] font-serif">
              独立运营之 AI 职业刊物。<br />
              追踪技术演进，<br />
              评估岗位影响，<br />
              为读者绘制可行之路。
            </p>
          </div>

          <div>
            <h4 class="font-serif font-bold text-[17px] mb-4 text-ink">栏目</h4>
            <ul class="space-y-2.5 text-[13.5px]">
              <li><NuxtLink :to="'/articles'"       class="text-ink-mute hover:text-ink underline-draw">卷一 · 资讯</NuxtLink></li>
              <li><NuxtLink :to="'/professions'"    class="text-ink-mute hover:text-ink underline-draw">卷二 · 职业</NuxtLink></li>
              <li><NuxtLink :to="'/learning-paths'" class="text-ink-mute hover:text-ink underline-draw">卷三 · 学习</NuxtLink></li>
              <li><NuxtLink :to="'/tools'"          class="text-ink-mute hover:text-ink underline-draw">卷四 · 工具</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4 class="font-serif font-bold text-[17px] mb-4 text-ink">合刊</h4>
            <ul class="space-y-2.5 text-[13.5px]">
              <li><a href="#" class="text-ink-mute hover:text-ink underline-draw">技术档案</a></li>
              <li><a href="#" class="text-ink-mute hover:text-ink underline-draw">数据接口</a></li>
              <li><a href="#" class="text-ink-mute hover:text-ink underline-draw">开源项目</a></li>
              <li><a href="#" class="text-ink-mute hover:text-ink underline-draw">投稿指南</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-serif font-bold text-[17px] mb-4 text-ink">联络</h4>
            <ul class="space-y-2.5 text-[13.5px] font-serif text-ink-mute">
              <li>contact@hot-ai.com</li>
              <li>上海 · 静安</li>
            </ul>
          </div>
        </div>

        <hr class="rule-soft" />

        <div class="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-faint">
          <span>© 2024–2026 AI 观察 · 京 ICP 备 —</span>
          <span class="flex items-center gap-4">
            <span>排版 · 印于数字</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-vermillion"></span>本期在线</span>
            <span>更于 {{ updatedAt }}</span>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, token, isAuthenticated, logout, restoreAuth } = useAuth()
const route = useRouter().currentRoute

onMounted(() => {
  restoreAuth()
})

const userInitial = computed(() => {
  const name = user.value?.nickname || user.value?.email || '?'
  return name.charAt(0).toUpperCase()
})

const userLevel = computed(() => {
  if (!token.value) return 0
  try {
    const parts = token.value.split('.')
    if (parts.length !== 3) return 0
    const payload = JSON.parse(atob(parts[1]))
    return payload.level ?? 0
  } catch {
    return 0
  }
})

const userLevelLabel = computed(() => {
  if (userLevel.value >= 2) return '会 员'
  if (userLevel.value >= 1) return '普 通'
  return '游 客'
})

const edition = computed(() => 47 + Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24 * 90)))
const totalIssue = 47

const todayFormatted = computed(() => {
  const d = new Date()
  return `${d.getFullYear()} 年 ${String(d.getMonth() + 1).padStart(2, '0')} 月 ${String(d.getDate()).padStart(2, '0')} 日`
})

const updatedAt = computed(() => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})

const weatherCopy = '上海 · 模型更新中'

const juanItems = [
  { juan: '卷一', name: '资讯',   path: '/articles' },
  { juan: '卷二', name: '职业',   path: '/professions' },
  { juan: '卷三', name: '学习',   path: '/learning-paths' },
  { juan: '卷四', name: '工具',   path: '/tools' },
]

const tickerItems = [
  '本年累计追踪 AI 资讯 4,217 条',
  '职业风险指数基准日 · 2026.06.17',
  '本周新增 12 个学习路径章节',
  '「客服」职业风险 92 · 历史高位',
  '「设计师」职业风险 78 · 持续上升',
  '订阅周报 · 每周一 09:00 送达',
  '数据更新于 17:00 GMT+8',
]

const isActiveRoute = (path: string) => {
  return route.value.path === path || route.value.path.startsWith(path + '/')
}

const handleLogout = async () => {
  if (confirm('确定要登出吗？')) await logout()
}
</script>
