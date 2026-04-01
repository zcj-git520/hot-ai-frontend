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
    duration: 3000,
    ...toast
  }
  
  // 触发事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast:add', { detail: newToast }))
  }
  
  return id
}

const removeToast = (id: number) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast:remove', { detail: { id } }))
  }
}

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

export const useToast = () => {
  return {
    addToast,
    removeToast,
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
  }
}