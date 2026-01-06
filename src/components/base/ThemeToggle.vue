<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.effectiveTheme === 'dark')
const title = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))
</script>

<template>
  <button
    @click="themeStore.toggleTheme"
    class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    :title="title"
    type="button"
  >
    <Icon v-if="!isDark" icon="mdi:weather-night" :width="20" :height="20" />
    <Icon v-else icon="mdi:weather-sunny" :width="20" :height="20" />
  </button>
</template>
