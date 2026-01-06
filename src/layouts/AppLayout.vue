<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/composables/useI18n'
import { UserMenu, ThemeToggle, LanguageSwitcher } from '@/components/base'
import { ROUTE_NAMES } from '@/constants'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const { user, isAuthenticated, logout } = useAuth()
const { t } = useI18n()
const cartStore = useCartStore()

const isCartActive = computed(() => route.name === ROUTE_NAMES.CART)

const handleLogout = () => {
  logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <nav
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link
              :to="{ name: ROUTE_NAMES.HOME }"
              class="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              FakeStore
            </router-link>
          </div>

          <div class="flex items-center space-x-2">
            <router-link
              :to="{ name: ROUTE_NAMES.CART }"
              :class="[
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative',
                isCartActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
              ]"
            >
              <div class="relative">
                <Icon icon="mdi:cart" class="mr-1" :width="20" :height="20" />
                <span
                  v-if="cartStore.uniqueItemsCount > 0"
                  class="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                >
                  {{ cartStore.uniqueItemsCount > 99 ? '99+' : cartStore.uniqueItemsCount }}
                </span>
              </div>
              <span class="hidden md:inline">{{ t('cart') }}</span>
            </router-link>

            <LanguageSwitcher />
            <ThemeToggle />

            <template v-if="isAuthenticated">
              <UserMenu :user="user" :on-logout="handleLogout" />
            </template>

            <template v-else>
              <router-link
                :to="{ name: ROUTE_NAMES.LOGIN }"
                class="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Icon icon="mdi:login" class="mr-1" :width="18" :height="18" />
                <span class="hidden md:inline">{{ t('login') }}</span>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot></slot>
    </main>

    <footer
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2026 FakeStore. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
