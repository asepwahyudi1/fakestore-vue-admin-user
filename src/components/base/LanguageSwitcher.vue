<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'

const i18nStore = useI18nStore()
const isOpen = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const selectLocale = (locale) => {
  i18nStore.setLocale(locale)
  closeMenu()
}

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const currentLocale = () => {
  return i18nStore.availableLocales.find((loc) => loc.code === i18nStore.locale)
}
</script>

<template>
  <div class="relative" ref="menuRef">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <span class="text-lg">{{ currentLocale()?.flag }}</span>
      <span class="hidden md:block text-sm font-medium">{{ currentLocale()?.name }}</span>
      <Icon
        icon="mdi:chevron-down"
        :class="['transition-transform', { 'rotate-180': isOpen }]"
        :width="16"
        :height="16"
      />
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50"
      >
        <div class="py-1">
          <button
            v-for="locale in i18nStore.availableLocales"
            :key="locale.code"
            @click="selectLocale(locale.code)"
            :class="[
              'flex items-center w-full px-4 py-2 text-sm text-left',
              locale.code === i18nStore.locale
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <span class="text-lg mr-2">{{ locale.flag }}</span>
            <span>{{ locale.name }}</span>
            <Icon
              v-if="locale.code === i18nStore.locale"
              icon="mdi:check"
              class="ml-auto"
              :width="18"
              :height="18"
            />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

