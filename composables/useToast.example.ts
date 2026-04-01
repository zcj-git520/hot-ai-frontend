/**
 * Toast 通知使用示例
 * 
 * 使用方法:
 * 1. 在需要使用 Toast 的页面或组件中导入 useToast
 * 2. 调用对应的方法显示通知
 */

import { useToast } from '~/composables/useToast'

export const useToastExample = () => {
  const { toastSuccess, toastError, toastInfo, toastWarning } = useToast()

  // 成功通知
  const showSuccess = () => {
    toastSuccess('操作成功完成！')
    // 或者带标题
    toastSuccess('个人资料已成功更新', '成功')
  }

  // 错误通知
  const showError = () => {
    toastError('操作失败，请重试')
    // 或者带标题
    toastError('用户名或密码错误', '登录失败')
  }

  // 信息通知
  const showInfo = () => {
    toastInfo('这是一条提示信息')
    // 或者带标题
    toastInfo('系统将于今晚 22:00 进行维护', '系统通知')
  }

  // 警告通知
  const showWarning = () => {
    toastWarning('请注意，此操作不可撤销')
    // 或者带标题
    toastWarning('您的会话即将过期', '警告')
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

/**
 * 在 Vue 组件中使用示例:
 * 
 * <script setup lang="ts">
 * import { useToast } from '~/composables/useToast'
 * 
 * const { toastSuccess, toastError } = useToast()
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await someApiCall()
 *     toastSuccess('提交成功')
 *   } catch (error) {
 *     toastError('提交失败，请重试')
 *   }
 * }
 * </script>
 */