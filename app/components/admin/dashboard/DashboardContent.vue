<script setup lang="ts">
defineProps<{
  stats: {
    courses: number
    tools: number
    articles: number
    professions: number
  }
  pending: {
    tools: number
    articles: number
  }
}>()

defineEmits<{
  (e: 'navigate', key: string): void
}>()

const statCards = [
  { key: 'courses',     label: '课 程',  seal: '课', desc: '学 路 总 数' },
  { key: 'tools',       label: '工 具',  seal: '具', desc: '录 入 工 具' },
  { key: 'articles',    label: '资 讯',  seal: '闻', desc: '已 发 稿 件' },
  { key: 'professions', label: '职 业',  seal: '业', desc: '档 案 总 数' },
]
</script>

<template>
  <div>
    <!-- 报头 -->
    <header class="border-b-2 border-ink pb-7 mb-9">
      <div class="flex items-center gap-3 mb-3">
        <span class="seal-square seal-square--tilt-l">总 览</span>
        <span class="kicker kicker--ink">编 辑 台 · DASHBOARD</span>
      </div>
      <h1 class="headline headline--lg text-balance">今 日 印 所</h1>
      <p class="deck mt-4 max-w-[34rem] text-pretty">
        一眼看完本卷的稿件进度、待审条目与档案存量。
      </p>
    </header>

    <!-- 统计 -->
    <section class="mb-12">
      <div class="kicker kicker--ochre mb-5">存 量</div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-9 border-t-2 border-ink pt-7">
        <button
          v-for="(card, i) in statCards"
          :key="card.key"
          @click="$emit('navigate', card.key)"
          class="text-left group no-underline-on-hover border-t border-rule-faint pt-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <span class="font-serif font-black text-vermillion text-[1.6rem] leading-none w-10 h-10 flex items-center justify-center border border-ink">
              {{ card.seal }}
            </span>
            <span class="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-mute">№ {{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="font-serif font-black text-[clamp(2.4rem,3vw,3rem)] leading-none text-ink group-hover:text-vermillion transition-colors tracking-[0.02em]">
            {{ stats[card.key as keyof typeof stats] }}
          </div>
          <div class="mt-2 text-[12px] font-serif text-ink-soft tracking-[0.04em]">{{ card.desc }}</div>
        </button>
      </div>
    </section>

    <hr class="rule" />

    <!-- 待审 -->
    <section class="py-9">
      <div class="kicker kicker--moss mb-5">待 审 条 目</div>
      <div class="border-t-2 border-ink">
        <button
          v-if="pending.tools > 0"
          @click="$emit('navigate', 'tools')"
          class="w-full text-left flex items-center gap-5 py-5 border-b border-rule-soft hover:bg-paper-deep transition-colors px-1 group"
        >
          <span class="font-serif font-black text-seal text-[1.4rem] leading-none tracking-[0.04em]">壹</span>
          <div class="flex-1">
            <h3 class="font-serif font-bold text-[16px] text-ink group-hover:text-vermillion transition-colors tracking-[0.04em]">工 具 待 审</h3>
            <p class="text-[12.5px] text-ink-mute mt-0.5 font-serif">尚未入卷的投稿工具</p>
          </div>
          <span class="seal-square seal-square--tilt-r">{{ pending.tools }}</span>
        </button>
        <button
          v-if="pending.articles > 0"
          @click="$emit('navigate', 'articles')"
          class="w-full text-left flex items-center gap-5 py-5 border-b border-rule-soft hover:bg-paper-deep transition-colors px-1 group"
        >
          <span class="font-serif font-black text-seal text-[1.4rem] leading-none tracking-[0.04em]">贰</span>
          <div class="flex-1">
            <h3 class="font-serif font-bold text-[16px] text-ink group-hover:text-vermillion transition-colors tracking-[0.04em]">资 讯 待 审</h3>
            <p class="text-[12.5px] text-ink-mute mt-0.5 font-serif">尚未发布的稿件</p>
          </div>
          <span class="seal-square seal-square--tilt-r">{{ pending.articles }}</span>
        </button>
        <div v-if="pending.tools === 0 && pending.articles === 0" class="py-12 text-center">
          <span class="seal-square seal-square--tilt-l">无</span>
          <p class="mt-5 font-serif italic text-ink-mute">本 日 无 待 审 条 目。</p>
        </div>
      </div>
    </section>
  </div>
</template>
