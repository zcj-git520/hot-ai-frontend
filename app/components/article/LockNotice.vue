<template>
  <div class="lock-notice" :class="`level-${requiredLevel}`">
    <div class="seal-area">
      <span class="seal-square" :class="requiredLevel >= 2 ? 'seal-square--tilt-r' : 'seal-square--tilt-l'">
        {{ sealChar }}
      </span>
    </div>

    <h3 class="title">{{ title || defaultTitle }}</h3>
    <p class="message">{{ message || defaultMessage }}</p>

    <div class="actions">
      <NuxtLink v-if="requiredLevel >= 1 && requiredLevel < 2" to="/login" class="btn btn--ink">
        登 入 后 阅 读
        <span class="arrow">→</span>
      </NuxtLink>

      <NuxtLink v-else-if="requiredLevel >= 2" to="/register" class="btn btn--cinnabar">
        升 级 会 员
        <span class="arrow">→</span>
      </NuxtLink>

      <NuxtLink v-else to="/login" class="btn btn--ink">
        登 入 后 阅 读
        <span class="arrow">→</span>
      </NuxtLink>
    </div>

    <p class="hint">
      <template v-if="requiredLevel >= 2">
        会员可解锁全部章节与完整内容。如需升级请联系管理员。
      </template>
      <template v-else>
        登录即可阅读全文。
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** 'article' | 'chapter' | 'profession' | 'tool' */
  contentType?: string
  /** 0=游客 1=普通 2=会员 */
  requiredLevel: number
  title?: string
  message?: string
}>(), { contentType: 'article' })

const sealChar = computed(() => {
  if (props.requiredLevel >= 2) return '会'
  if (props.requiredLevel >= 1) return '锁'
  return '访'
})

const defaultTitle = computed(() => {
  if (props.requiredLevel >= 2) return '此内容为「会员专享」'
  return '登录后可阅读全文'
})

const defaultMessage = computed(() => {
  const cn = { article: '文章', chapter: '章节', profession: '职业', tool: '工具' }[props.contentType] || '内容'
  if (props.requiredLevel >= 2) return `本${cn}仅向会员开放，登录后请申请会员权限。`
  return `登录后即可阅读全文完整${cn}。`
})
</script>

<style scoped>
.lock-notice {
  margin: 2rem 0;
  padding: 2.5rem 2rem;
  border: 2px solid #1a1a1a;
  background: linear-gradient(180deg, #faf7f2 0%, #f4eee5 100%);
  text-align: center;
  position: relative;
}
.lock-notice.level-2 {
  border-color: #B5202A;
  background: linear-gradient(180deg, #fdf6f3 0%, #faeae5 100%);
}
.seal-area {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}
.seal-square {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  font-family: serif;
  font-weight: 900;
  font-size: 2rem;
  border: 2px solid #1a1a1a;
  color: #B5202A;
  background: #fdfaf3;
}
.seal-square--tilt-r { transform: rotate(3deg); }
.seal-square--tilt-l { transform: rotate(-3deg); }
.title {
  font-family: serif;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
}
.message {
  font-family: serif;
  font-size: 0.95rem;
  color: #6b5d4f;
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  font-family: serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn--ink {
  background: #1a1a1a;
  color: #faf7f2;
  border-color: #1a1a1a;
}
.btn--ink:hover {
  background: #B5202A;
  border-color: #B5202A;
}
.btn--cinnabar {
  background: #B5202A;
  color: #faf7f2;
  border-color: #B5202A;
}
.btn--cinnabar:hover {
  background: #8a1820;
  border-color: #8a1820;
}
.arrow { font-family: monospace; }
.hint {
  font-family: serif;
  font-size: 0.78rem;
  color: #9a8e7e;
  margin: 1rem 0 0 0;
  letter-spacing: 0.04em;
}
</style>