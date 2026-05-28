<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <LayoutAdminSidebar />

      <main class="flex-1 p-8">
        <NuxtLink to="/admin/tools/pending" class="text-blue-600 hover:underline mb-4 inline-block">
          ← 返回列表
        </NuxtLink>

        <div v-if="loading" class="text-center py-12">加载中...</div>

        <div v-else-if="tool" class="bg-white rounded-lg shadow p-6">
          <h1 class="text-2xl font-bold mb-6">工具审核详情</h1>

          <!-- 工具基本信息 -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">基本信息</h2>
            <div class="grid grid-cols-2 gap-4">
              <div><span class="text-gray-500">名称:</span> {{ tool.name }}</div>
              <div><span class="text-gray-500">官网:</span> <a :href="tool.official_url" target="_blank" class="text-blue-600">{{ tool.official_url }}</a></div>
              <div><span class="text-gray-500">类别:</span> {{ getCategoryName(tool.category_id) }}</div>
              <div><span class="text-gray-500">定价:</span> {{ tool.pricing || '-' }}</div>
              <div><span class="text-gray-500">难度:</span> {{ tool.difficulty || '-' }}</div>
              <div><span class="text-gray-500">提交人:</span> {{ tool.submitted_by || '-' }}</div>
            </div>
            <p class="mt-4"><span class="text-gray-500">描述:</span> {{ tool.description || '-' }}</p>
          </div>

          <!-- 审核历史 -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">审核历史</h2>
            <div v-if="reviews.length" class="space-y-2">
              <div v-for="record in reviews" :key="record.id" class="text-sm text-gray-600 border-b pb-2">
                <span class="font-medium">{{ formatAction(record.action) }}</span>
                <span class="text-gray-400 ml-2">{{ formatDate(record.created_at) }}</span>
                <span v-if="record.reason" class="text-red-500 ml-2">原因: {{ record.reason }}</span>
              </div>
            </div>
            <div v-else class="text-gray-400">暂无审核记录</div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-4 items-start">
            <button @click="handleApprove" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              通过
            </button>
            <button @click="showRejectModal = true" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              拒绝
            </button>
            <button @click="showRevisionModal = true" class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
              退回修改
            </button>
          </div>
        </div>

        <!-- 拒绝弹窗 -->
        <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-96">
            <h3 class="text-lg font-semibold mb-4">拒绝原因</h3>
            <textarea v-model="rejectReason" class="w-full border p-2 rounded mb-4" rows="4" placeholder="请输入拒绝原因"></textarea>
            <div class="flex justify-end gap-2">
              <button @click="showRejectModal = false" class="px-4 py-2 border rounded">取消</button>
              <button @click="handleReject" class="px-4 py-2 bg-red-600 text-white rounded">确定拒绝</button>
            </div>
          </div>
        </div>

        <!-- 退回修改弹窗 -->
        <div v-if="showRevisionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-96">
            <h3 class="text-lg font-semibold mb-4">退回原因</h3>
            <textarea v-model="revisionReason" class="w-full border p-2 rounded mb-4" rows="4" placeholder="请输入退回原因"></textarea>
            <div class="flex justify-end gap-2">
              <button @click="showRevisionModal = false" class="px-4 py-2 border rounded">取消</button>
              <button @click="handleRequestRevision" class="px-4 py-2 bg-yellow-500 text-white rounded">确定退回</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { adminApi } from '~/app/lib/api'

const route = useRoute()
const toolId = route.params.id as string

const loading = ref(true)
const tool = ref<any>(null)
const reviews = ref<any[]>([])
const showRejectModal = ref(false)
const showRevisionModal = ref(false)
const rejectReason = ref('')
const revisionReason = ref('')

async function fetchToolDetail() {
  try {
    const data = await adminApi.tool.getToolDetail(toolId)
    tool.value = data.tool
    reviews.value = data.reviews || []
  } catch (error) {
    console.error('获取工具详情失败:', error)
  } finally {
    loading.value = false
  }
}

function getCategoryName(categoryId: number) {
  return `类别 ${categoryId}`
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function formatAction(action: string) {
  const map: Record<string, string> = {
    'approve': '审核通过',
    'reject': '审核拒绝',
    'request_revision': '退回修改'
  }
  return map[action] || action
}

async function handleApprove() {
  try {
    await adminApi.tool.approveTool(toolId)
    alert('审核通过')
    navigateTo('/admin/tools/pending')
  } catch (error) {
    alert('操作失败')
  }
}

async function handleReject() {
  if (!rejectReason.value.trim()) {
    alert('请输入拒绝原因')
    return
  }
  try {
    await adminApi.tool.rejectTool(toolId, rejectReason.value)
    alert('已拒绝')
    navigateTo('/admin/tools/pending')
  } catch (error) {
    alert('操作失败')
  }
}

async function handleRequestRevision() {
  if (!revisionReason.value.trim()) {
    alert('请输入退回原因')
    return
  }
  try {
    await adminApi.tool.requestRevision(toolId, revisionReason.value)
    alert('已退回修改')
    navigateTo('/admin/tools/pending')
  } catch (error) {
    alert('操作失败')
  }
}

onMounted(() => {
  fetchToolDetail()
})
</script>