<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ROUTE_NAMES } from '@/constants'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  onLogout: {
    type: Function,
    required: true,
  },
})

const isOpen = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleLogout = () => {
  closeMenu()
  props.onLogout()
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

const getUserDisplayName = () => {
  if (props.user?.name?.firstname && props.user?.name?.lastname) {
    return `${props.user.name.firstname} ${props.user.name.lastname}`
  }
  if (props.user?.name) {
    return props.user.name
  }
  return props.user?.username || 'User'
}

const isAdmin = () => {
  return props.user?.username === 'johnd'
}
</script>

<template>
  <div class="relative" ref="menuRef">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <div
        class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold"
      >
        {{ getUserDisplayName().charAt(0).toUpperCase() }}
      </div>
      <span class="hidden md:block">{{ getUserDisplayName() }}</span>
      <Icon
        icon="mdi:chevron-down"
        :class="['transition-transform', { 'rotate-180': isOpen }]"
        :width="20"
        :height="20"
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
        class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50"
      >
        <div class="py-1">
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ getUserDisplayName() }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user?.email || user?.username }}</p>
            <span
              v-if="isAdmin()"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mt-1"
            >
              <Icon icon="mdi:shield-crown" class="mr-1" :width="12" :height="12" />
              Admin
            </span>
          </div>

          <router-link
            :to="{ name: ROUTE_NAMES.PROFILE }"
            @click="closeMenu"
            class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="mdi:account" class="mr-3" :width="18" :height="18" />
            Profile
          </router-link>

          <router-link
            v-if="isAdmin()"
            :to="{ name: ROUTE_NAMES.ADMIN_DASHBOARD }"
            @click="closeMenu"
            class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="mdi:view-dashboard" class="mr-3" :width="18" :height="18" />
            Admin Panel
          </router-link>

          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Icon icon="mdi:logout" class="mr-3" :width="18" :height="18" />
            Logout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
