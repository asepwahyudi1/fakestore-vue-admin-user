<script setup>
import { computed } from 'vue'
import { BaseCard } from '@/components/base'
import { useAuth } from '@/composables/useAuth'
import { useI18n, useSeo } from '@/composables'

const { user, isAdmin } = useAuth()
const { t } = useI18n()

useSeo({
  title: t('profile'),
  description: t('profile'),
  keywords: 'profile, user account, fakestore',
})

const getUserDisplayName = computed(() => {
  if (user.value?.name?.firstname && user.value?.name?.lastname) {
    return `${user.value.name.firstname} ${user.value.name.lastname}`
  }
  if (user.value?.name) {
    return user.value.name
  }
  return user.value?.username || t('user')
})

const getUserInitials = computed(() => {
  const name = getUserDisplayName.value
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>

<template>
  <div>
    <div
      class="relative overflow-hidden bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl mb-8"
    >
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative px-8 py-12">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            class="w-24 h-24 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400 shadow-lg ring-4 ring-white dark:ring-gray-800"
          >
            {{ getUserInitials }}
          </div>

          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  {{ getUserDisplayName }}
                </h1>
                <p class="text-blue-100 text-lg mb-3">{{ user?.email || user?.username }}</p>
                <div class="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span
                    v-if="isAdmin"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm"
                  >
                    <Icon icon="mdi:shield-crown" class="mr-1" :width="16" :height="16" />
                    {{ t('admin') }}
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm"
                  >
                    <Icon icon="mdi:account" class="mr-1" :width="16" :height="16" />
                    {{ t('regularUser') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <BaseCard>
          <div class="flex items-center mb-6">
            <Icon
              icon="mdi:account-details"
              class="mr-3 text-blue-600 dark:text-blue-400"
              :width="24"
              :height="24"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ t('personalInformation') }}
            </h2>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ t('firstName') }}
                </label>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ user.name?.firstname || '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ t('lastName') }}
                </label>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ user.name?.lastname || '-' }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('username') }}
              </label>
              <p class="text-gray-900 dark:text-white font-medium">{{ user.username || '-' }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center mb-6">
            <Icon
              icon="mdi:email-outline"
              class="mr-3 text-blue-600 dark:text-blue-400"
              :width="24"
              :height="24"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ t('contactInformation') }}
            </h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('email') }}
              </label>
              <p class="text-gray-900 dark:text-white font-medium">{{ user.email || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('phone') }}
              </label>
              <p class="text-gray-900 dark:text-white font-medium">{{ user.phone || '-' }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard v-if="user.address">
          <div class="flex items-center mb-6">
            <Icon
              icon="mdi:map-marker-outline"
              class="mr-3 text-blue-600 dark:text-blue-400"
              :width="24"
              :height="24"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('address') }}</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('street') }}
              </label>
              <p class="text-gray-900 dark:text-white font-medium">
                {{ user.address.street || '-' }}
                {{ user.address.number ? `No. ${user.address.number}` : '' }}
              </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ t('city') }}
                </label>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ user.address.city || '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ t('zipcode') }}
                </label>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ user.address.zipcode || '-' }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="space-y-6">
        <BaseCard>
          <div class="flex items-center mb-6">
            <Icon
              icon="mdi:information-outline"
              class="mr-3 text-blue-600 dark:text-blue-400"
              :width="24"
              :height="24"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('accountType') }}</h2>
          </div>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('accountType') }}</span>
              <span
                v-if="isAdmin"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              >
                <Icon icon="mdi:shield-crown" class="mr-1" :width="12" :height="12" />
                {{ t('admin') }}
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300"
              >
                {{ t('regularUser') }}
              </span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('username') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                user.username
              }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <div v-else>
      <BaseCard>
        <div class="text-center py-12">
          <Icon
            icon="mdi:account-off"
            class="mx-auto mb-4 text-gray-400 dark:text-gray-500"
            :width="64"
            :height="64"
          />
          <p class="text-gray-600 dark:text-gray-400 text-lg">{{ t('noUserDataAvailable') }}</p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
