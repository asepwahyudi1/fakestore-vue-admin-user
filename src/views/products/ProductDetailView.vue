<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { BaseButton, BaseLoading, BaseCard, BaseImage } from '@/components/base'
import { productService } from '@/services/productService'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import { formatCurrency } from '@/utils'
import { useCartStore } from '@/stores/cart'
import { useI18n, useSeo } from '@/composables'
import { useAuth } from '@/composables/useAuth'
import { ROUTE_NAMES } from '@/constants'

const route = useRoute()
const { t } = useI18n()
const { user } = useAuth()
const { data: product, isLoading, error, execute, reset } = useApi()
const similarProducts = ref([])
const isLoadingSimilar = ref(false)
const toast = useToast()
const cartStore = useCartStore()

const { updateSeo } = useSeo({})

const seoData = computed(() => {
  if (!product.value) return {}

  return {
    title: product.value.title,
    description:
      product.value.description ||
      `${product.value.title} - ${t('price')}: ${formatCurrency(product.value.price)}`,
    image: product.value.image,
    keywords: `${product.value.title}, ${product.value.category}, ${t('products')}`,
    type: 'product',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.value.title,
      description: product.value.description,
      image: product.value.image,
      brand: {
        '@type': 'Brand',
        name: 'FakeStore',
      },
      offers: {
        '@type': 'Offer',
        price: product.value.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      category: product.value.category,
    },
  }
})

watch(
  () => product.value,
  (newProduct) => {
    if (newProduct) {
      updateSeo(seoData.value)
    }
  },
  { immediate: true },
)

const loadProduct = async () => {
  await execute(productService.getProductById, route.params.id)
}

const loadSimilarProducts = async () => {
  if (product.value?.category) {
    try {
      isLoadingSimilar.value = true
      const allCategoryProducts = await productService.getProductsByCategory(product.value.category)
      similarProducts.value = allCategoryProducts
        .filter((p) => p.id !== product.value.id)
        .slice(0, 4)
    } catch (err) {
      console.error('Failed to load similar products:', err)
    } finally {
      isLoadingSimilar.value = false
    }
  }
}

const loadData = async () => {
  reset()
  similarProducts.value = []
  await loadProduct()
}

onMounted(async () => {
  await loadData()
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadData()
    }
  },
)

watch(
  () => product.value,
  async (newProduct) => {
    if (newProduct) {
      await loadSimilarProducts()
    }
  },
  { immediate: true },
)

const addToCart = async (productItem) => {
  await cartStore.addItem(productItem, 1, user.value?.id)
  toast.success(`${productItem.title} ${t('productAddedToCart')}`)
}
</script>

<template>
  <div>
    <BaseLoading v-if="isLoading" :text="t('loadingProduct')" />
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
    <div v-else-if="product">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <BaseImage
            :src="product.image"
            :alt="product.title"
            :lazy="false"
            :priority="true"
            class="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold dark:text-white text-gray-900 mb-4">
            {{ product.title }}
          </h1>
          <p class="text-blue-600 dark:text-blue-400 font-bold text-3xl mb-4">
            {{ formatCurrency(product.price) }}
          </p>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ product.description }}</p>
          <div class="mb-4">
            <span
              class="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ product.category }}
            </span>
          </div>
          <BaseButton @click="addToCart(product)" class="w-full">
            <Icon icon="mdi:cart-plus" class="mr-2" :width="20" :height="20" />
            {{ t('addToCart') }}
          </BaseButton>
        </div>
      </div>

      <div v-if="similarProducts && similarProducts.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('similarProducts') }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BaseCard
            v-for="similarProduct in similarProducts"
            :key="similarProduct.id"
            class="group cursor-pointer hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <router-link
              :to="{ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id: similarProduct.id } }"
            >
              <div
                class="relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700 aspect-square"
              >
                <BaseImage
                  :src="similarProduct.image"
                  :alt="similarProduct.title"
                  :lazy="true"
                  class="p-4 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div class="p-4">
                <h3
                  class="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {{ similarProduct.title }}
                </h3>
                <div class="flex items-center justify-between mb-4">
                  <p class="text-blue-600 dark:text-blue-400 font-bold text-xl">
                    {{ formatCurrency(similarProduct.price) }}
                  </p>
                  <span
                    class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                  >
                    {{ similarProduct.category }}
                  </span>
                </div>
                <BaseButton class="w-full" @click.prevent="addToCart(similarProduct)">
                  <Icon icon="mdi:cart-plus" class="mr-2" :width="18" :height="18" />
                  {{ t('addToCart') }}
                </BaseButton>
              </div>
            </router-link>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
