<template>
  <div class="broadsheet">

    <!-- 面包屑 -->
    <nav class="pt-8 pb-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-mute flex items-center gap-2 flex-wrap">
      <NuxtLink to="/" class="underline-draw">头版</NuxtLink>
      <span class="text-vermillion">·</span>
      <NuxtLink to="/articles" class="underline-draw">卷一 · 资讯</NuxtLink>
      <span class="text-vermillion">·</span>
      <span class="text-ink truncate max-w-[28rem]">{{ article?.title || '文章详情' }}</span>
    </nav>

    <hr class="rule-soft" />

    <!-- 加载状态 -->
    <div v-if="loading" class="py-24 text-center">
      <span class="seal-square seal-square--tilt-l">载</span>
      <p class="mt-5 font-serif italic text-ink-mute">正在加载正文…</p>
    </div>

    <!-- 详情主体 - 委托给 ArticleReader -->
    <ArticleReader v-else-if="article" :article="article" />

    <!-- 错误状态 -->
    <div v-else class="py-24 text-center">
      <span class="seal-square seal-square--tilt-r">无</span>
      <h2 class="font-serif font-black text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.25] mt-7 tracking-[0.06em] text-balance">
        该文已不在卷中
      </h2>
      <p class="font-serif text-[15px] text-ink-mute mt-4 max-w-[28rem] mx-auto text-pretty">
        这篇文章可能已被删除，或链接已失效。请返回资讯列表继续翻阅。
      </p>
      <div class="mt-9">
        <NuxtLink to="/articles" class="btn btn--ink">
          返 回 资 讯 列 表
          <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articleApi } from '~/app/lib/api'
import ArticleReader from '~/app/components/article/ArticleReader.vue'
import type { Article } from '~/types/article'

definePageMeta({ layout: 'default' })

const route = useRoute()

const article = ref<Article | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) { loading.value = false; return }
  try {
    const data: any = await articleApi.getById(id)
    if (data && (data as Article).id) {
      article.value = data as Article
    }
  } catch (err) {
    console.error('Failed to fetch article:', err)
  } finally {
    loading.value = false
  }
})
</script>
