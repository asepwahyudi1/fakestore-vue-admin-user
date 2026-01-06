<template>
  <transition name="fade-scale">
    <div
      v-if="isDialogVisible"
      class="w-screen h-screen fixed top-0 left-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
      @click.self="closeDialog"
    >
      <div
        class="w-[600px] min-w-[400px] h-max flex flex-col gap-10 dark:bg-gray-800 bg-gray-100 rounded-2xl p-8 relative transition-all duration-300"
      >
        <button
          @click="closeDialog"
          class="absolute top-4 right-4 p-2 rounded-full dark:bg-gray-700 bg-gray-300 dark:text-white text-gray-900"
        >
          <Icon icon="mdi:close" />
        </button>

        <div class="w-[90%] flex items-start gap-6">
          <div
            class="w-14 h-14 flex items-center justify-center rounded-xl"
            :class="[iconBackgroundColor, iconTextColor]"
          >
            <Icon :icon="iconName" class="w-6 h-6" />
          </div>

          <div class="w-[80%] flex flex-col gap-1.5 -mt-1.5">
            <h1 class="font-semibold text-2xl dark:text-white text-gray-900">{{ title }}</h1>
            <p class="dark:text-gray-300 text-gray-900">{{ message }}</p>
          </div>
        </div>

        <div class="w-full flex items-center justify-end gap-4">
          <button
            @click="onCancel"
            :disabled="loading"
            class="px-6 py-2 rounded-xl dark:bg-gray-700 bg-gray-300 dark:text-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText }}
          </button>
          <button
            @click="onConfirm"
            :disabled="loading"
            class="px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            :class="buttonBackgroundColor"
          >
            <Icon v-if="loading" icon="svg-spinners:ring-resize" class="w-4 h-4" />
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  type: {
    type: String,
    default: 'info',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const confirmTypeStyles = {
  info: {
    containerColor: 'bg-blue-200',
    iconTextColor: 'text-blue-500',
    icon: 'material-symbols:info',
    buttonColor: 'bg-blue-500',
  },
  warning: {
    containerColor: 'bg-orange-200',
    iconTextColor: 'text-orange-500',
    icon: 'material-symbols:warning',
    buttonColor: 'bg-orange-500',
  },
  error: {
    containerColor: 'bg-red-200',
    iconTextColor: 'text-red-500',
    icon: 'material-symbols:delete',
    buttonColor: 'bg-red-500',
  },
}

const isDialogVisible = ref(false)

const iconTextColor = computed(() => confirmTypeStyles[props.type].iconTextColor)
const iconBackgroundColor = computed(() => confirmTypeStyles[props.type].containerColor)
const iconName = computed(() => confirmTypeStyles[props.type].icon)
const buttonBackgroundColor = computed(() => confirmTypeStyles[props.type].buttonColor)

function onConfirm() {
  if (props.loading) {
    return
  }
  emit('confirm')
}

function onCancel() {
  if (props.loading) {
    return
  }
  emit('cancel')
  closeDialog()
}

function closeDialog() {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (val) => {
    isDialogVisible.value = val
  },
  { immediate: true },
)
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1);
}
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
