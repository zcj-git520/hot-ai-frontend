<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-paper">

    <!-- 左半版：报头宣言 -->
    <aside class="relative flex flex-col justify-between p-10 lg:p-16 bg-ink text-paper-soft overflow-hidden">

      <!-- 右上角朱砂墨晕 -->
      <div class="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full pointer-events-none"
           style="background: radial-gradient(ellipse at center, var(--vermillion) 0%, var(--vermillion) 30%, transparent 70%); opacity: 0.18; filter: blur(30px);"></div>

      <!-- 纸纹 -->
      <div class="absolute inset-0 opacity-[0.08] pointer-events-none"
           style="background-image: url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>&quot;);"></div>

      <!-- 顶：刊名 -->
      <div class="relative z-10 flex items-center justify-between">
        <NuxtLink to="/" class="masthead-title text-[1.4rem]! text-paper-soft hover:text-vermillion-soft transition-colors">
          <span class="text-paper-soft">AI</span><em class="text-vermillion-soft">观</em><span class="text-paper-soft">察</span>
        </NuxtLink>
        <span class="seal-square seal-square--tilt-r">第 47 期</span>
      </div>

      <!-- 中：宣言 -->
      <div class="relative z-10 max-w-md my-12">
        <div class="flex items-center gap-3 mb-7">
          <span class="seal-square seal-square--tilt-l">卷首</span>
          <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper-soft/60">编辑部的话</span>
        </div>
        <h1 class="font-serif font-black text-[clamp(2.2rem,3.4vw,3.4rem)] leading-[1.15] tracking-[0.06em] text-paper-soft text-balance">
          把 AI 时代的<br />
          <em class="italic not-italic text-vermillion-soft">「职业风险」</em>，<br />
          读成一份<em class="italic not-italic text-vermillion-soft">可执行的观察</em>。
        </h1>
        <p class="mt-8 font-serif text-[16px] leading-[1.95] text-paper-soft/80 text-pretty">
          登入后，你可以查询任一职业的风险指数、订阅每周观察、记录自己的学习进度。
          <span class="text-vermillion-soft">我们不卖课，不接广告</span>——只做记录。
        </p>
      </div>

      <!-- 底：刊末式注脚 -->
      <div class="relative z-10 font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper-soft/50 flex items-center gap-4">
        <span>印于上海</span>
        <span class="text-vermillion-soft">●</span>
        <span>独立 AI 职业刊物</span>
      </div>
    </aside>

    <!-- 右半版：表单 -->
    <main class="flex items-center justify-center p-8 lg:p-16 bg-paper">
      <div class="w-full max-w-md anim-rise">
        <div class="flex items-center gap-3 mb-7">
          <span class="seal-square seal-square--tilt-l">登入</span>
          <span class="kicker">SIGN IN</span>
        </div>

        <h2 class="font-serif font-black text-[clamp(1.8rem,2.4vw,2.4rem)] leading-[1.2] mb-4 tracking-[0.06em] text-balance">
          欢迎回到<br />本刊观察
        </h2>
        <p class="deck mb-10 max-w-[34rem]">
          输入你的邮箱与密码，继续本周的追踪。
        </p>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <div>
            <label for="email" class="label">邮 箱 · Email</label>
            <input id="email" v-model="form.email" name="email" type="email" autocomplete="email" required class="field" placeholder="you@example.com" />
          </div>

          <div>
            <label for="password" class="label">密 码 · Password</label>
            <div class="relative">
              <input id="password" v-model="form.password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required class="field pr-10" placeholder="••••••••" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink transition-colors" aria-label="切换密码可见">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="border-l-[3px] border-vermillion pl-4 py-2">
            <p class="font-mono text-[11px] tracking-[0.18em] uppercase text-vermillion mb-1">出 错 了</p>
            <p class="font-serif text-[14.5px] text-ink">{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn btn--cinnabar w-full disabled:opacity-50">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span>{{ loading ? '身 份 验 证 中 …' : '进 入 观 察' }}</span>
            <span v-if="!loading" class="arrow">→</span>
          </button>
        </form>

        <hr class="rule-soft my-8" />

        <div class="flex items-center justify-between text-[13px] font-serif">
          <NuxtLink to="/register" class="text-ink underline-draw">还未订阅？订一份 →</NuxtLink>
          <NuxtLink to="/" class="text-ink-mute hover:text-ink underline-draw">← 返 回 头 版</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '~/app/lib/api'

definePageMeta({ layout: false })

const { setToken, setUser } = useAuth()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const data = await authApi.login(form.value.email, form.value.password)
    await setToken(data.access_token, data.refresh_token)
    await setUser(data.user)
    navigateTo('/')
  } catch (err: any) {
    error.value = err.message || '登入失败，请检查邮箱与密码'
  } finally {
    loading.value = false
  }
}
</script>
