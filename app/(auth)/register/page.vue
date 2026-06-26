<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-paper">

    <aside class="relative flex flex-col justify-between p-10 lg:p-16 bg-ink text-paper-soft overflow-hidden order-2 lg:order-1">
      <div class="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full pointer-events-none"
           style="background: radial-gradient(ellipse at center, var(--vermillion) 0%, var(--vermillion) 30%, transparent 70%); opacity: 0.18; filter: blur(30px);"></div>
      <div class="absolute inset-0 opacity-[0.08] pointer-events-none"
           style="background-image: url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>&quot;);"></div>

      <div class="relative z-10 flex items-center justify-between">
        <NuxtLink to="/" class="masthead-title text-paper-soft hover:text-vermillion-soft transition-colors" style="font-size:1.4rem;">
          <span class="text-paper-soft">AI</span><em class="text-vermillion-soft">观</em><span class="text-paper-soft">察</span>
        </NuxtLink>
        <span class="seal-square seal-square--tilt-r">第 47 期</span>
      </div>

      <div class="relative z-10 max-w-md my-12">
        <div class="flex items-center gap-3 mb-7">
          <span class="seal-square seal-square--tilt-l">订阅</span>
          <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper-soft/60">SUBSCRIBE</span>
        </div>
        <h1 class="font-serif font-black text-[clamp(2.2rem,3.4vw,3.4rem)] leading-[1.15] tracking-[0.06em] text-paper-soft text-balance">
          一份
          <em class="italic not-italic text-vermillion-soft">不卖课</em>、<br />
          <em class="italic not-italic text-vermillion-soft">不接广告</em>、<br />
          只做
          <em class="italic not-italic text-vermillion-soft">记录</em>的刊物。
        </h1>
        <p class="mt-8 font-serif text-[16px] leading-[1.95] text-paper-soft/80 text-pretty">
          每周一上午九点，<br />
          一份当周 AI 趋势与职业影响的观察记录，<br />
          直接送到你的邮箱。
        </p>
        <ul class="mt-8 space-y-3 text-[15px] text-paper-soft/85 font-serif">
          <li class="flex gap-3"><span class="text-vermillion-soft font-serif font-black">§</span>追踪本周三十余条 AI 重要进展</li>
          <li class="flex gap-3"><span class="text-vermillion-soft font-serif font-black">§</span>解读对十二个职业的具体影响</li>
          <li class="flex gap-3"><span class="text-vermillion-soft font-serif font-black">§</span>一份本周可执行的学习建议</li>
        </ul>
      </div>

      <div class="relative z-10 font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper-soft/50 flex items-center gap-4">
        <span>印于上海</span>
        <span class="text-vermillion-soft">●</span>
        <span>独立 AI 职业刊物</span>
      </div>
    </aside>

    <main class="flex items-center justify-center p-8 lg:p-16 bg-paper order-1 lg:order-2">
      <div class="w-full max-w-md anim-rise">
        <div class="flex items-center gap-3 mb-7">
          <span class="seal-square seal-square--tilt-l">注册</span>
          <span class="kicker">CREATE ACCOUNT</span>
        </div>

        <h2 class="font-serif font-black text-[clamp(1.8rem,2.4vw,2.4rem)] leading-[1.2] mb-4 tracking-[0.06em] text-balance">
          即刻订阅<br />本刊观察
        </h2>
        <p class="deck mb-10 max-w-[34rem]">
          填写以下信息，我们会发一封带验证码的邮件。
        </p>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="label">昵 称 · Nickname</label>
            <input v-model="form.nickname" type="text" class="field" placeholder="如：观察者-2026" />
            <p v-if="fieldErrors.nickname" class="mt-1 text-[12px] text-vermillion font-mono">{{ fieldErrors.nickname }}</p>
          </div>

          <div>
            <label class="label">邮 箱 · Email</label>
            <input v-model="form.email" type="email" class="field" placeholder="you@example.com" />
            <p v-if="fieldErrors.email" class="mt-1 text-[12px] text-vermillion font-mono">{{ fieldErrors.email }}</p>
          </div>

          <div>
            <label class="label">验 证 码 · Code</label>
            <div class="flex items-end gap-3">
              <input v-model="form.verificationCode" type="text" maxlength="6" class="field flex-1" placeholder="6 位数字" />
              <button type="button" @click="sendVerificationCode" :disabled="sendingCode || countdown > 0" class="btn btn--ghost btn--sm whitespace-nowrap disabled:opacity-50">
                {{ countdown > 0 ? `${countdown}s` : (sendingCode ? '发送中…' : '获取验证码') }}
              </button>
            </div>
            <p v-if="fieldErrors.verificationCode" class="mt-1 text-[12px] text-vermillion font-mono">{{ fieldErrors.verificationCode }}</p>
          </div>

          <div>
            <label class="label">密 码 · Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="field pr-10" placeholder="至少 8 位" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink transition-colors" aria-label="切换密码可见">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="mt-1 text-[12px] text-vermillion font-mono">{{ fieldErrors.password }}</p>
            <div class="mt-2 flex gap-1">
              <div v-for="i in 4" :key="i" class="h-[2px] flex-1 border-t border-ink" :class="getPasswordStrength() >= i ? 'bg-ink' : ''"></div>
            </div>
          </div>

          <div>
            <label class="label">确 认 密 码 · Confirm</label>
            <input v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" class="field" placeholder="再输一次" />
            <p v-if="fieldErrors.confirmPassword" class="mt-1 text-[12px] text-vermillion font-mono">{{ fieldErrors.confirmPassword }}</p>
          </div>

          <div v-if="error" class="border-l-[3px] border-vermillion pl-4 py-2">
            <p class="font-mono text-[11px] tracking-[0.18em] uppercase text-vermillion mb-1">出 错 了</p>
            <p class="font-serif text-[14.5px] text-ink">{{ error }}</p>
          </div>

          <div v-if="successMessage" class="border-l-[3px] border-moss pl-4 py-2">
            <p class="font-mono text-[11px] tracking-[0.18em] uppercase text-moss mb-1">提 示</p>
            <p class="font-serif text-[14.5px] text-ink">{{ successMessage }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn btn--cinnabar w-full disabled:opacity-50">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span>{{ loading ? '创 建 中 …' : '创 建 账 号 并 订 阅' }}</span>
            <span v-if="!loading" class="arrow">→</span>
          </button>
        </form>

        <hr class="rule-soft my-8" />

        <div class="flex items-center justify-between text-[13px] font-serif">
          <NuxtLink to="/login" class="text-ink underline-draw">已有账号？登入 →</NuxtLink>
          <NuxtLink to="/" class="text-ink-mute hover:text-ink underline-draw">← 返 回 头 版</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { authApi } from '~/app/lib/api'

definePageMeta({ layout: false })

const form = ref({ nickname: '', email: '', password: '', confirmPassword: '', verificationCode: '' })
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const sendingCode = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const fieldErrors = ref<Record<string, string>>({})

let countdownTimer: ReturnType<typeof setInterval> | null = null

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const getPasswordStrength = () => {
  const pwd = form.value.password
  if (!pwd) return 0
  let s = 0
  if (pwd.length >= 8) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[a-z]/.test(pwd)) s++
  if (/\d/.test(pwd)) s++
  return s
}

const sendVerificationCode = async () => {
  if (!form.value.email) { error.value = '请输入邮箱地址'; return }
  if (!isValidEmail(form.value.email)) { error.value = '邮箱格式不正确'; return }
  error.value = ''
  successMessage.value = ''
  sendingCode.value = true
  try {
    await authApi.sendRegistrationCode(form.value.email)
    countdown.value = 60
    successMessage.value = '验证码已发送，请检查邮箱（有效期 5 分钟）'
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) clearInterval(countdownTimer)
        countdownTimer = null
        successMessage.value = ''
      }
    }, 1000)
  } catch (err: any) {
    error.value = err.message || '验证码发送失败'
  } finally {
    sendingCode.value = false
  }
}

const handleRegister = async () => {
  error.value = ''
  successMessage.value = ''
  fieldErrors.value = {}
  if (!form.value.nickname || form.value.nickname.trim().length < 2) { fieldErrors.value.nickname = '昵称至少 2 个字符'; return }
  if (!form.value.email || !isValidEmail(form.value.email)) { fieldErrors.value.email = '请输入有效的邮箱地址'; return }
  if (form.value.password.length < 8) { fieldErrors.value.password = '密码长度至少为 8 位'; return }
  if (form.value.password !== form.value.confirmPassword) { fieldErrors.value.confirmPassword = '两次输入的密码不一致'; return }
  if (!form.value.verificationCode) { fieldErrors.value.verificationCode = '请输入验证码'; return }

  loading.value = true
  try {
    await authApi.register({
      email: form.value.email,
      password: form.value.password,
      password_confirm: form.value.confirmPassword,
      nickname: form.value.nickname,
      verification_code: form.value.verificationCode,
    })
    successMessage.value = '注册成功！正在跳转到登入页…'
    setTimeout(() => navigateTo('/login'), 1000)
  } catch (err: any) {
    if (err.data?.errors) {
      Object.keys(err.data.errors).forEach(field => {
        const messages = err.data.errors[field]
        fieldErrors.value[field === 'password_confirm' ? 'confirmPassword' : field] =
          Array.isArray(messages) ? messages[0] : messages
      })
    }
    error.value = err.message || '注册失败'
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => { if (countdownTimer) clearInterval(countdownTimer) })
</script>
