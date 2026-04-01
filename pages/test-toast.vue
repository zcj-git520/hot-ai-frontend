<template>
  <div class="min-h-screen bg-[#0d1117] p-8">
    <h1 class="text-3xl font-bold text-white mb-8">Toast 测试</h1>
    
    <div class="space-y-4 max-w-md">
      <button 
        @click="testSuccess"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-md transition-all"
      >
        测试成功 Toast
      </button>
      
      <button 
        @click="testError"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-md transition-all"
      >
        测试错误 Toast
      </button>
      
      <button 
        @click="testInfo"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-all"
      >
        测试信息 Toast
      </button>
      
      <button 
        @click="testWarning"
        class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-md transition-all"
      >
        测试警告 Toast
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toastSuccess, toastError, toastInfo, toastWarning } = useToast()

const testSuccess = () => {
  toastSuccess('这是一个成功消息！', '操作成功')
}

const testError = () => {
  toastError('这是一个错误消息！', '发生错误')
}

const testInfo = () => {
  toastInfo('这是一个信息消息！', '提示信息')
}

const testWarning = () => {
  toastWarning('这是一个警告消息！', '注意')
}
</script>