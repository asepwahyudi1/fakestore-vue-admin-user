<script setup>
defineProps({
  count: {
    type: Number,
    default: 8,
  },
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="n in count"
      :key="n"
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
    >
      <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  </div>
</template>

