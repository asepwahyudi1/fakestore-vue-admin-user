<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { BaseCard, BaseButton, ProductSkeleton, BaseImage } from '@/components/base'
import { productService } from '@/services/productService'
import { useApi } from '@/composables/useApi'
import { useI18n, useSeo } from '@/composables'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/composables/useAuth'
import { formatCurrency, debounce } from '@/utils'
import { ROUTE_NAMES } from '@/constants'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const { t } = useI18n()
const { isAuthenticated, user } = useAuth()
const { data: products, isLoading, error, hasLoaded, execute } = useApi()
const toast = useToast()
const selectedCategory = ref('all')
const categories = ref([])
const cartStore = useCartStore()
const searchQuery = ref('')
const displayedCount = ref(12)
const allProducts = ref([])

useSeo({
  title: t('welcome'),
  description: t('welcomeSubtitle'),
  keywords:
    'online store, ecommerce, products, shopping, electronics, clothing, jewelry, fakestore',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FakeStore',
    description: t('welcomeSubtitle'),
    url: 'https://fakestore.com',
  },
})

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return products.value || []
  }

  const query = searchQuery.value.toLowerCase().trim()
  return (products.value || []).filter((product) => {
    return (
      product.title.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  })
})

const loadProducts = async () => {
  displayedCount.value = 12
  if (selectedCategory.value === 'all') {
    const response = await execute(productService.getAllProducts)
    allProducts.value = response
    products.value = response.slice(0, displayedCount.value)
  } else {
    const response = await execute(productService.getProductsByCategory, selectedCategory.value)
    allProducts.value = response
    products.value = response.slice(0, displayedCount.value)
  }
}

const loadMore = () => {
  if (!isAuthenticated.value) {
    router.push({
      name: ROUTE_NAMES.LOGIN,
      query: { redirect: router.currentRoute.value.fullPath },
    })
    return
  }

  displayedCount.value += 12
  if (allProducts.value && allProducts.value.length > 0) {
    products.value = allProducts.value.slice(0, displayedCount.value)
  }
}

const hasMoreProducts = computed(() => {
  return allProducts.value && allProducts.value.length > displayedCount.value
})

const debouncedSearch = debounce(() => {}, 300)

const loadCategories = async () => {
  try {
    categories.value = await productService.getCategories()
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

const addToCart = async (product) => {
  await cartStore.addItem(product, 1, user.value?.id)
  toast.success(`${product.title} ${t('productAddedToCart')}`)
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>

<template>
  <div>
    <div
      class="relative overflow-hidden bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl mb-12"
    >
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative px-8 py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ t('welcome') }}
        </h1>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {{ t('welcomeSubtitle') }}
        </p>
        <router-link :to="{ name: ROUTE_NAMES.PRODUCTS }">
          <BaseButton size="lg" variant="secondary" class="shadow-lg">
            {{ t('viewAllProducts') }}
          </BaseButton>
        </router-link>
      </div>
    </div>

    <div class="mb-8 space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {{ t('products') }}
        </h2>
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-initial sm:w-64">
            <Icon
              icon="mdi:magnify"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              :width="20"
              :height="20"
            />
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              :placeholder="t('searchProducts')"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            />
          </div>
          <select
            v-model="selectedCategory"
            @change="loadProducts"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            <option value="all">{{ t('allCategories') }}</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <div v-if="searchQuery.trim()" class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('searchResults') }}: "{{ searchQuery }}"
        <span class="ml-2 text-gray-500 dark:text-gray-500">
          ({{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? t('product') : t('products') }})
        </span>
      </div>
    </div>

    <ProductSkeleton v-if="isLoading || !hasLoaded" :count="8" />
    <div
      v-else-if="error"
      class="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
    >
      <Icon
        icon="mdi:alert-circle"
        class="mx-auto mb-4 text-red-600 dark:text-red-400"
        :width="48"
        :height="48"
      />
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
    <div
      v-else-if="filteredProducts && filteredProducts.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <BaseCard
        v-for="product in filteredProducts"
        :key="product.id"
        data-cy="product-card"
        class="group cursor-pointer hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <router-link :to="{ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id: product.id } }">
          <div
            class="relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700 aspect-square"
          >
            <BaseImage
              :src="product.image"
              :alt="product.title"
              :lazy="true"
              class="p-4 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-4">
            <h3
              class="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {{ product.title }}
            </h3>
            <div class="flex items-center justify-between mb-4">
              <p class="text-blue-600 dark:text-blue-400 font-bold text-xl">
                {{ formatCurrency(product.price) }}
              </p>
              <span
                class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
              >
                {{ product.category }}
              </span>
            </div>
            <BaseButton
              class="w-full"
              size="sm"
              data-cy="add-to-cart-button"
              @click.prevent="addToCart(product)"
            >
              <Icon icon="mdi:cart-plus" class="mr-2" :width="18" :height="18" />
              {{ t('addToCart') }}
            </BaseButton>
          </div>
        </router-link>
      </BaseCard>
    </div>
    <div
      v-else-if="
        hasLoaded &&
        (searchQuery.trim() ? filteredProducts.length === 0 : !products || products.length === 0)
      "
      class="text-center py-12"
    >
      <Icon
        icon="mdi:package-variant-closed"
        class="mx-auto mb-4 text-gray-400"
        :width="64"
        :height="64"
      />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        {{ searchQuery.trim() ? `${t('noSearchResults')} "${searchQuery}"` : t('noProductsFound') }}
      </p>
    </div>

    <div
      v-if="
        hasLoaded &&
        !isLoading &&
        !error &&
        filteredProducts &&
        filteredProducts.length > 0 &&
        !searchQuery.trim() &&
        (hasMoreProducts || !isAuthenticated)
      "
      class="text-center mt-8"
    >
      <BaseButton
        v-if="isAuthenticated && hasMoreProducts"
        @click="loadMore"
        variant="outline"
        size="lg"
        class="min-w-[200px]"
      >
        <Icon icon="mdi:chevron-down" class="mr-2" :width="20" :height="20" />
        {{ t('loadMore') }}
      </BaseButton>
      <BaseButton
        v-else-if="!isAuthenticated"
        @click="loadMore"
        variant="primary"
        size="lg"
        class="min-w-[200px]"
      >
        <Icon icon="mdi:login" class="mr-2" :width="20" :height="20" />
        {{ t('loginToViewMore') }}
      </BaseButton>
    </div>
  </div>
</template>
