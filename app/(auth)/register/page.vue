<script setup lang="ts">
import { authApi } from '~/app/lib/api'

definePageMeta({
  layout: false
})

const router = useRouter()

const form = ref({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const sendingCode = ref(false)
const codeSent = ref(false)
const countdown = ref(0)
// 新增：字段级别的错误信息
const fieldErrors = ref<Record<string, string>>({})

let countdownTimer: ReturnType<typeof setInterval> | null = null

// 验证邮箱格式
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!form.value.email) {
    error.value = '请输入邮箱地址'
    return
  }

  if (!isValidEmail(form.value.email)) {
    error.value = '邮箱格式不正确，请输入有效的邮箱地址'
    return
  }

  error.value = ''
  successMessage.value = ''
  sendingCode.value = true

  try {
    await authApi.sendRegistrationCode(form.value.email)
    codeSent.value = true
    countdown.value = 60
    successMessage.value = '✓ 验证码已发送，请检查邮箱（有效期 5 分钟）'

    // 倒计时
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
        codeSent.value = false
        successMessage.value = ''
      }
    }, 1000)
  } catch (err: any) {
    // 响应拦截器已经处理了错误，err.message 包含后端返回的消息
    error.value = err.message || '验证码发送失败，请稍后重试'
    codeSent.value = false
  } finally {
    sendingCode.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  error.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  // 验证昵称
  if (!form.value.nickname || form.value.nickname.trim().length < 2) {
    fieldErrors.value.nickname = '昵称至少 2 个字符'
    return
  }

  if (form.value.nickname.length > 20) {
    fieldErrors.value.nickname = '昵称不能超过 20 个字符'
    return
  }

  // 验证邮箱
  if (!form.value.email || !isValidEmail(form.value.email)) {
    fieldErrors.value.email = '请输入有效的邮箱地址'
    return
  }

  // 验证密码
  if (form.value.password.length < 8) {
    fieldErrors.value.password = '密码长度至少为 8 位'
    error.value = '密码长度至少为 8 位'
    return
  }

  if (form.value.password.length > 32) {
    fieldErrors.value.password = '密码长度不能超过 32 位'
    error.value = '密码长度不能超过 32 位'
    return
  }

  // 密码复杂度验证
  const hasUppercase = /[A-Z]/.test(form.value.password)
  const hasLowercase = /[a-z]/.test(form.value.password)
  const hasNumbers = /\d/.test(form.value.password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.value.password)
  
  if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
    const requirements: string[] = []
    if (!hasUppercase) requirements.push('大写字母')
    if (!hasLowercase) requirements.push('小写字母')
    if (!hasNumbers) requirements.push('数字')
    if (!hasSpecialChar) requirements.push('特殊字符')
    const errorMsg = `密码必须包含：${requirements.join('、')}`
    fieldErrors.value.password = errorMsg
    error.value = errorMsg
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    fieldErrors.value.confirmPassword = '两次输入的密码不一致'
    error.value = '两次输入的密码不一致'
    return
  }

  // 验证验证码
  if (!form.value.verificationCode) {
    fieldErrors.value.verificationCode = '请输入验证码'
    return
  }

  if (form.value.verificationCode.length !== 6 || !/^\d{6}$/.test(form.value.verificationCode)) {
    fieldErrors.value.verificationCode = '请输入 6 位数字验证码'
    return
  }

  if (!codeSent) {
    error.value = '请先获取验证码'
    return
  }

  loading.value = true

  try {
    await authApi.register({
      email: form.value.email,
      password: form.value.password,
      password_confirm: form.value.confirmPassword,  // 添加密码确认字段
      nickname: form.value.nickname,
      verification_code: form.value.verificationCode
    })

    // 注册成功，跳转到登录页
    successMessage.value = '注册成功！正在跳转到登录页...'
    setTimeout(() => {
      navigateTo('/login')
    }, 1000)
  } catch (err: any) {
    // 响应拦截器已经处理了错误
    // 如果后端返回字段级别的错误信息（在 err.data.errors 中）
    if (err.data?.errors) {
      Object.keys(err.data.errors).forEach(field => {
        const messages = err.data.errors[field]
        fieldErrors.value[field === 'password_confirm' ? 'confirmPassword' : field] =
          Array.isArray(messages) ? messages[0] : messages
      })
    }

    // 设置通用错误信息
    error.value = err.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 清理定时器
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
/* 输入框焦点动画 */
input:focus {
  transition: all 0.2s ease;
}

/* 按钮悬停效果 */
button:not(:disabled):hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* 错误消息动画 */
.text-red-500 {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 成功消息动画 */
.text-green-500 {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
