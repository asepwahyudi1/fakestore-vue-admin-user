<template>
  <div
    v-if="toastStore.toasts.length"
    data-cy="toast-container"
    class="w-[calc(100%-24px)] fixed top-0 lg:right-0 lg:top-0 lg:w-[450px] mt-4 lg:mx-10 z-1000 p-3 h-[200px]"
  >
    <div
      v-for="(toast, index) in toastStore.toasts"
      :key="toast.id"
      class="w-full absolute transition-all duration-300"
      :style="{ top: `${index * 10}px`, zIndex: 10000 - index }"
    >
      <div
        class="w-full h-max flex items-center justify-between gap-2 dark:bg-gray-800 bg-gray-100 p-3 rounded-xl shadow-lg"
      >
        <div class="w-full flex items-center gap-4 dark:text-white text-gray-900">
          <div
            class="w-11 h-11 flex items-center justify-center rounded-xl shrink-0"
            :class="getToastStyle(toast.type).containerColor"
          >
            <div
              class="w-6 h-6 flex items-center justify-center rounded-xl"
              :class="getToastStyle(toast.type).iconBgColor"
            >
              <Icon :icon="getToastStyle(toast.type).icon" class="w-6 h-6" />
            </div>
          </div>

          <span>{{ toast.message }}</span>
        </div>

        <button
          data-cy="toast-close-button"
          class="flex items-center justify-center p-1 dark:bg-gray-700 bg-gray-300 rounded-full dark:text-white text-gray-900"
          @click="toastStore.removeToast(toast.id)"
        >
          <Icon icon="mdi:close" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const toastTypeStyles = {
  success: {
    containerColor: 'bg-green-200',
    iconBgColor: 'bg-green-400',
    icon: 'material-symbols:check',
  },
  error: {
    containerColor: 'bg-red-200',
    iconBgColor: 'bg-red-400',
    icon: 'fluent-mdl2:status-circle-error-x',
  },
  warning: {
    containerColor: 'bg-orange-200',
    iconBgColor: 'bg-orange-400',
    icon: 'ri:warning',
  },
  info: {
    containerColor: 'bg-sky-200',
    iconBgColor: 'bg-sky-400',
    icon: 'uil:info',
  },
  default: {
    containerColor: 'bg-gray-500',
    iconBgColor: 'bg-gray-900',
    icon: 'uil:info',
  },
}

function getToastStyle(type = 'default') {
  return toastTypeStyles[type] || toastTypeStyles.default
}
</script>
