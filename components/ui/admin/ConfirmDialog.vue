<template>
  <UiAdminModal v-model="showModal" :title="title">
    <div class="confirm-content">
      <div class="confirm-icon" :class="confirmType">
        <span v-if="confirmType === 'danger'">&#9888;</span>
        <span v-else>&#128076;</span>
      </div>
      <p class="confirm-message">{{ message }}</p>
    </div>

    <template #footer>
      <div class="confirm-actions">
        <button @click="handleCancel" class="btn-cancel">
          {{ cancelText }}
        </button>
        <button @click="handleConfirm" class="btn-confirm" :class="confirmType">
          {{ confirmText }}
        </button>
      </div>
    </template>
  </UiAdminModal>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '确认操作' },
  message: { type: String, required: true },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
  confirmType: { type: String, default: 'primary' }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
  showModal.value = false
}

const handleCancel = () => {
  emit('cancel')
  showModal.value = false
}
</script>

<style scoped>
.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
}

.confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.confirm-icon.danger {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.confirm-icon.primary {
  background: rgba(234, 179, 8, 0.12);
  color: #eab308;
}

.confirm-message {
  font-size: 0.9375rem;
  color: #a0a0a8;
  line-height: 1.5;
  margin: 0;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: #a0a0a8;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #f5f5f5;
}

.btn-confirm {
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-confirm.danger {
  background: #ef4444;
  color: #fff;
}

.btn-confirm.danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-confirm.primary {
  background: #eab308;
  color: #000;
}

.btn-confirm.primary:hover {
  background: #facc15;
  transform: translateY(-1px);
}
</style>
