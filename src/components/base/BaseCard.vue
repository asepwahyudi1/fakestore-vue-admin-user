<script setup>
defineProps({
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value),
  },
  shadow: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value),
  },
})
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors',
      {
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg',
        'shadow-none': shadow === 'none',
        'shadow-sm': shadow === 'sm',
        'shadow-md': shadow === 'md',
        'shadow-lg': shadow === 'lg',
      },
    ]"
  >
    <slot></slot>
  </div>
</template>
