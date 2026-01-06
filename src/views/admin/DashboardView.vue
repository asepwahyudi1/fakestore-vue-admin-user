<script setup>
import { onMounted, ref } from 'vue'
import { BaseCard } from '@/components/base'
import { productService } from '@/services/productService'
import { userService } from '@/services/userService'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const totalProducts = ref(0)
const totalUsers = ref(0)
const isLoading = ref(true)

const loadStats = async () => {
  try {
    isLoading.value = true
    const [products, users] = await Promise.all([
      productService.getAllProducts(),
      userService.getAllUsers(),
    ])
    totalProducts.value = products?.length || 0
    totalUsers.value = users?.length || 0
  } catch (error) {
    console.error('Failed to load stats:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{{ t('adminPanel') }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard class="hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">{{ t('totalProducts') }}</h3>
            <p v-if="isLoading" class="text-3xl font-bold text-blue-600 dark:text-blue-400">-</p>
            <p v-else class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ totalProducts }}
            </p>
          </div>
          <div
            class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
          >
            <Icon icon="mdi:package-variant" class="text-blue-600 dark:text-blue-400" :width="32" :height="32" />
          </div>
        </div>
      </BaseCard>
      <BaseCard class="hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">{{ t('totalUsers') }}</h3>
            <p v-if="isLoading" class="text-3xl font-bold text-green-600 dark:text-green-400">-</p>
            <p v-else class="text-3xl font-bold text-green-600 dark:text-green-400">{{ totalUsers }}</p>
          </div>
          <div
            class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          >
            <Icon icon="mdi:account-group" class="text-green-600 dark:text-green-400" :width="32" :height="32" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

