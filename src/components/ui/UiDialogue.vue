<template>
  <transition name="fade-scale">
    <div
      v-if="isDialogVisible"
      class="fixed top-0 left-0 w-full h-screen bg-black/70 backdrop-blur-xs flex items-center z-50"
      @click.self="handleClose"
    >
      <div :class="contentBodyClass">
        <div class="w-full flex items-center justify-between mb-6">
          <h1 class="font-semibold text-lg dark:text-white text-gray-900">{{ title }}</h1>

          <button @click="handleClose" class="dark:text-white text-gray-900">
            <Icon icon="ri:close-line" class="w-6 h-6" />
          </button>
        </div>

        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default:
      'w-11/12 lg:w-4/12 h-fit max-h-[95dvh] dark:bg-gray-900 bg-gray-100 mx-auto rounded-xl p-4 lg:p-6 overflow-y-auto',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const isDialogVisible = computed(() => props.modelValue)
const contentBodyClass = computed(() => props.class)

watch(isDialogVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}
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
