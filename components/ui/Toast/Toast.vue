<template>
  <Teleport to="body">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="[
          'fixed right-4 z-50 rounded-lg shadow-lg p-4 mb-3 transition-all duration-300 ease-in-out',
          'max-w-sm w-full flex items-start gap-3',
          toast.type === 'success' ? 'bg-green-900/20 border border-green-800' : '',
          toast.type === 'error' ? 'bg-red-900/20 border border-red-800' : '',
          toast.type === 'info' ? 'bg-blue-900/20 border border-blue-800' : '',
          toast.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-800' : ''
        ]"
        style="top: 80px;"
      >
        <!-- 成功图标 -->
        <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        
        <!-- 错误图标 -->
        <svg v-if="toast.type === 'error'" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        
        <!-- 信息图标 -->
        <svg v-if="toast.type === 'info'" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        
        <!-- 警告图标 -->
        <svg v-if="toast.type === 'warning'" class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        
        <div class="flex-1">
          <h4 v-if="toast.title" :class="[
            'font-medium text-sm mb-1',
            toast.type === 'success' ? 'text-green-400' : '',
            toast.type === 'error' ? 'text-red-400' : '',
            toast.type === 'info' ? 'text-blue-400' : '',
            toast.type === 'warning' ? 'text-yellow-400' : ''
          ]">
            {{ toast.title }}
          </h4>
          <p :class="[
            'text-sm',
            toast.type === 'success' ? 'text-green-300' : '',
            toast.type === 'error' ? 'text-red-300' : '',
            toast.type === 'info' ? 'text-blue-300' : '',
            toast.type === 'warning' ? 'text-yellow-300' : ''
          ]">
            {{ toast.message }}
          </p>
        </div>
        
        <button 
          @click="removeToast(toast.id)"
          class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" :class="[
            toast.type === 'success' ? 'text-green-400' : '',
            toast.type === 'error' ? 'text-red-400' : '',
            toast.type === 'info' ? 'text-blue-400' : '',
            toast.type === 'warning' ? 'text-yellow-400' : ''
          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = toastId++
  const newToast: Toast = {
    id,
    duration: 3000, // 默认 3 秒自动关闭
    ...toast
  }
  
  toasts.value.push(newToast)
  
  // 自动关闭
  if (newToast.duration) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
  
  return id
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// 暴露便捷方法
const toastSuccess = (message: string, title?: string) => {
  return addToast({ type: 'success', title: title || '成功', message })
}

const toastError = (message: string, title?: string) => {
  return addToast({ type: 'error', title: title || '错误', message })
}

const toastInfo = (message: string, title?: string) => {
  return addToast({ type: 'info', title: title || '提示', message })
}

const toastWarning = (message: string, title?: string) => {
  return addToast({ type: 'warning', title: title || '警告', message })
}

// 暴露给外部使用
defineExpose({
  addToast,
  removeToast,
  toastSuccess,
  toastError,
  toastInfo,
  toastWarning
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>