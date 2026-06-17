<template>
  <div class="broadsheet">

    <!-- ============================================================
         顶部：报头
         ============================================================ -->
    <section class="pt-10 md:pt-14 pb-6">
      <div class="flex items-center gap-3 mb-3 anim-rise">
        <span class="seal-square seal-square--tilt-l">自 录</span>
        <span class="kicker kicker--ink">个 人 中 心 · PROFILE</span>
      </div>
      <h1 class="headline headline--lg anim-rise anim-rise-1 text-balance">
        你的来处，<br />
        <em class="not-italic text-vermillion">一处</em>档案
      </h1>
      <p class="deck mt-5 max-w-[36rem] text-pretty anim-rise anim-rise-2">
        此处只做两件事：记录你读到了哪一卷，更新你的<em class="not-italic">身份</em>。
      </p>
    </section>

    <hr class="rule" />

    <div v-if="loadError" class="my-8 border-l-[2px] border-vermillion bg-paper-deep pl-5 py-4 pr-5">
      <p class="font-serif text-[14px] text-ink">{{ loadError }}</p>
    </div>

    <div v-if="loading && !profileLoaded" class="py-20 text-center">
      <span class="seal-square seal-square--tilt-l">载</span>
      <p class="mt-5 font-serif italic text-ink-mute">正在调阅档案…</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10 py-10">

      <!-- ============================================================
           左侧：身份信息
           ============================================================ -->
      <aside class="lg:col-span-4 space-y-6">
        <section class="border-t-2 border-ink pt-6">
          <span class="kicker kicker--ink mb-5">身 份 印 章</span>

          <div class="mt-6 flex flex-col items-start gap-5">
            <span class="font-serif font-black text-paper-soft text-[3.6rem] leading-none w-24 h-24 flex items-center justify-center bg-seal relative anim-seal">
              {{ user?.nickname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U' }}
            </span>
            <div>
              <h2 class="headline headline--sm text-balance">{{ user?.nickname || '未 取 名' }}</h2>
              <p class="text-[12.5px] text-ink-mute font-mono tracking-[0.16em] uppercase mt-1.5 break-all">
                {{ user?.email }}
              </p>
            </div>
          </div>

          <hr class="rule-soft my-7" />

          <dl class="space-y-3 text-[13px] font-serif">
            <div class="flex justify-between gap-3">
              <dt class="text-ink-mute">账 号 编 号</dt>
              <dd class="text-ink font-bold font-mono">№ {{ String(user?.id || '—').padStart(4, '0') }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-ink-mute">入 录 日</dt>
              <dd class="text-ink font-bold">{{ user?.created_at ? formatDate(user.created_at) : '—' }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-ink-mute">状 态</dt>
              <dd class="text-ink font-bold flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-vermillion"></span>
                在 线
              </dd>
            </div>
          </dl>

          <hr class="rule-soft my-7" />

          <button
            type="button"
            @click="handleLogout"
            class="w-full btn btn--ghost btn--sm"
          >
            登 出 账 号
          </button>
        </section>
      </aside>

      <!-- ============================================================
           右侧：表单
           ============================================================ -->
      <main class="lg:col-span-8 space-y-10">

        <!-- 基本信息 -->
        <section id="profile" class="border-t-2 border-ink pt-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="font-serif font-black text-seal text-[1.4rem] leading-none tracking-[0.04em]">壹</span>
            <h3 class="font-serif font-bold text-[18px] tracking-[0.06em]">基 本 资 料</h3>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-7">
            <div>
              <label for="nickname" class="label">昵 称 · NICKNAME</label>
              <input
                id="nickname"
                v-model="profileForm.nickname"
                type="text"
                class="field"
                placeholder="给自己起个别号"
              />
            </div>

            <div>
              <label for="bio" class="label">个 人 简 介 · BIO</label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                rows="3"
                class="field resize-none"
                placeholder="三两行即可——介绍自己、所学所好、读到了哪一卷"
                style="border: 0; border-bottom: 1.5px solid var(--ink); padding: 0.85rem 0;"
              ></textarea>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="submitting"
                class="btn btn--cinnabar disabled:opacity-40"
              >
                {{ submitting ? '保 存 中 …' : '保 存 修 改' }}
                <span class="arrow">→</span>
              </button>
            </div>
          </form>
        </section>

        <hr class="rule" />

        <!-- 修改密码 -->
        <section id="password" class="pt-2">
          <div class="flex items-center gap-3 mb-6">
            <span class="font-serif font-black text-seal text-[1.4rem] leading-none tracking-[0.04em]">贰</span>
            <h3 class="font-serif font-bold text-[18px] tracking-[0.06em]">更 改 密 码</h3>
          </div>

          <form @submit.prevent="changePassword" class="space-y-7">
            <div>
              <label for="old-password" class="label">当 前 密 码</label>
              <input
                id="old-password"
                v-model="passwordForm.old_password"
                type="password"
                required
                class="field"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label for="new-password" class="label">新 密 码 · 至少 8 位</label>
              <input
                id="new-password"
                v-model="passwordForm.new_password"
                type="password"
                required
                minlength="8"
                class="field"
                placeholder="新设的密令"
              />
            </div>

            <div v-if="passwordError" class="border-l-[2px] border-vermillion bg-paper-deep pl-5 py-3 pr-5">
              <p class="font-serif text-[13.5px] text-vermillion">{{ passwordError }}</p>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="submitting"
                class="btn btn--ink disabled:opacity-40"
              >
                {{ submitting ? '修 改 中 …' : '修 改 密 码' }}
                <span class="arrow">→</span>
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApi } from '~/app/lib/api'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user, logout, restoreAuth } = useAuth()
const { toastSuccess, toastError } = useToast()

const loading = ref(false)
const submitting = ref(false)
const passwordError = ref('')
const loadError = ref('')
const profileLoaded = ref(false)

const profileForm = ref({
  nickname: '',
  bio: '',
})

const passwordForm = ref({
  old_password: '',
  new_password: '',
})

const formatDate = (d: string) => {
  if (!d) return '—'
  const date = new Date(d)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  loading.value = true
  loadError.value = ''
  restoreAuth()

  try {
    if (user.value) {
      profileForm.value.nickname = user.value.nickname || ''
      profileForm.value.bio = user.value.bio || ''
      profileLoaded.value = true
    }

    try {
      const userData = await userApi.getProfile()
      profileForm.value.nickname = userData.nickname || ''
      profileForm.value.bio = userData.bio || ''
      profileLoaded.value = true
    } catch (apiError: any) {
      if (!user.value) {
        loadError.value = apiError.data?.message || '加载用户信息失败'
        if (apiError.response?.status === 401) {
          setTimeout(() => navigateTo('/login'), 2000)
        }
      }
    }
  } catch (err: any) {
    loadError.value = '加载失败'
  } finally {
    loading.value = false
  }
})

const updateProfile = async () => {
  submitting.value = true
  try {
    await userApi.updateProfile(profileForm.value)
    if (user.value) {
      user.value.nickname = profileForm.value.nickname
      user.value.bio = profileForm.value.bio
    }
    toastSuccess('个人资料已更新')
  } catch (err: any) {
    toastError(err.data?.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new_password.length < 8) {
    passwordError.value = '密码长度至少为 8 位'
    return
  }

  submitting.value = true
  passwordError.value = ''

  try {
    await userApi.changePassword(passwordForm.value)
    toastSuccess('密码已修改')
    passwordForm.value = { old_password: '', new_password: '' }
  } catch (err: any) {
    passwordError.value = err.data?.message || '修改失败'
  } finally {
    submitting.value = false
  }
}

const handleLogout = async () => {
  if (confirm('确定要登出吗？')) {
    await logout()
  }
}
</script>
