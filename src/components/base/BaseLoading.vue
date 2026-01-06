<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'svg-spinners:ring-resize',
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <Icon
      :icon="icon"
      :class="[
        'text-blue-600',
        {
          'h-4 w-4': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
      ]"
    />
    <p v-if="text" class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ text }}</p>
  </div>
</template>
