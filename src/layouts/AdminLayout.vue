<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/composables/useI18n'
import { ROUTE_NAMES } from '@/constants'

const route = useRoute()
const { user, logout } = useAuth()
const { t } = useI18n()

const handleLogout = () => {
  logout()
}

const getUserDisplayName = computed(() => {
  if (user.value?.name?.firstname && user.value?.name?.lastname) {
    return `${user.value.name.firstname} ${user.value.name.lastname}`
  }
  if (user.value?.name) {
    return user.value.name
  }
  return user.value?.username || t('user')
})

const menuItems = computed(() => [
  { name: t('dashboard'), route: ROUTE_NAMES.ADMIN_DASHBOARD },
  { name: t('products'), route: ROUTE_NAMES.ADMIN_PRODUCTS },
  { name: t('users'), route: ROUTE_NAMES.ADMIN_USERS },
])

const isActive = (routeName) => {
  return route.name === routeName
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <nav
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <router-link
              :to="{ name: ROUTE_NAMES.ADMIN_DASHBOARD }"
              class="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {{ t('adminPanel') }}
            </router-link>
            <div class="flex space-x-4">
              <router-link
                v-for="item in menuItems"
                :key="item.route"
                :to="{ name: item.route }"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.route)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
                ]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              :to="{ name: ROUTE_NAMES.HOME }"
              class="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Icon icon="mdi:home" class="mr-1" :width="18" :height="18" />
              {{ t('backToHome') }}
            </router-link>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ getUserDisplayName }}</span>
            <button
              @click="handleLogout"
              class="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Icon icon="mdi:logout" class="mr-1" :width="18" :height="18" />
              {{ t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot></slot>
    </main>
  </div>
</template>
