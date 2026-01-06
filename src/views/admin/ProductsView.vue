<script setup>
import { onMounted, ref, computed } from 'vue'
import { BaseCard, BaseButton, BaseInput, BaseLoading } from '@/components/base'
import UiConfirm from '@/components/ui/UiConfirm.vue'
import ProductFormModal from '@/components/admin/ProductFormModal.vue'
import { productService } from '@/services/productService'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import { useI18n } from '@/composables/useI18n'
import { formatCurrency, getErrorMessage, debounce } from '@/utils'

const { t } = useI18n()
const { data: products, isLoading, error, hasLoaded, execute } = useApi()
const toast = useToast()
const showDialog = ref(false)
const showDeleteConfirm = ref(false)
const selectedProduct = ref(null)
const productToDelete = ref(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pageSizeOptions = [5, 10, 20, 50]

const loadProducts = async () => {
  await execute(productService.getAllProducts)
}

const filteredProducts = computed(() => {
  if (!products.value) return []

  if (!searchQuery.value.trim()) {
    return products.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return products.value.filter((product) => {
    return (
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.price?.toString().includes(query)
    )
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleSearch = debounce(() => {
  currentPage.value = 1
}, 300)

const watchSearch = () => {
  handleSearch()
}

const openAddDialog = () => {
  selectedProduct.value = null
  showDialog.value = true
}

const openEditDialog = (product) => {
  selectedProduct.value = product
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  selectedProduct.value = null
}

const handleSubmit = async (payload) => {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  try {
    const isEditMode = !!selectedProduct.value

    if (isEditMode) {
      const updatedProduct = await productService.updateProduct(selectedProduct.value.id, payload)
      toast.success(t('productUpdatedSuccessfully'))

      if (products.value) {
        const index = products.value.findIndex((p) => p.id === selectedProduct.value.id)
        if (index !== -1) {
          products.value[index] = { ...updatedProduct, id: selectedProduct.value.id }
        }
      }
      closeDialog()
    } else {
      const newProduct = await productService.createProduct(payload)
      toast.success(t('productCreatedSuccessfully'))

      if (products.value && newProduct) {
        products.value = [newProduct, ...products.value]
      } else if (newProduct) {
        products.value = [newProduct]
      }

      closeDialog()
    }
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = (product) => {
  productToDelete.value = product
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (isDeleting.value) {
    return
  }

  isDeleting.value = true
  try {
    await productService.deleteProduct(productToDelete.value.id)
    toast.success(t('productDeletedSuccessfully'))

    if (products.value && productToDelete.value) {
      products.value = products.value.filter((p) => p.id !== productToDelete.value.id)
    }
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
    productToDelete.value = null
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('manageProducts') }}</h1>
      <BaseButton @click="openAddDialog" data-cy="add-product-button">
        <Icon icon="mdi:plus" class="mr-2" :width="18" :height="18" />
        {{ t('addProduct') }}
      </BaseButton>
    </div>

    <BaseLoading v-if="isLoading || !hasLoaded" :text="t('loadingProducts')" />
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
    <BaseCard v-else>
      <div
        class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex-1 max-w-md relative">
          <Icon
            icon="mdi:magnify"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          />
          <BaseInput
            v-model="searchQuery"
            :placeholder="t('searchProducts')"
            @input="watchSearch"
            class="w-full pl-10"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('itemsPerPage') }}</span>
          <select
            v-model="itemsPerPage"
            @change="currentPage = 1"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                {{ t('image') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                {{ t('title') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                {{ t('category') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                {{ t('price') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                {{ t('actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              data-cy="product-row"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td class="px-4 py-3">
                <img
                  :src="product.image"
                  :alt="product.title"
                  class="w-16 h-16 object-contain rounded"
                />
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                {{ product.title }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                <span
                  class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                >
                  {{ product.category }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <BaseButton
                    variant="outline"
                    size="sm"
                    :dataCy="'product-edit-button'"
                    @click="openEditDialog(product)"
                  >
                    <Icon icon="mdi:pencil" :width="16" :height="16" />
                  </BaseButton>
                  <BaseButton
                    variant="danger"
                    size="sm"
                    :dataCy="'product-delete-button'"
                    @click="handleDelete(product)"
                  >
                    <Icon icon="mdi:delete" :width="16" :height="16" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of
          {{ filteredProducts.length }} {{ t('products') }}
        </div>
        <div class="flex items-center gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            <Icon icon="mdi:chevron-left" class="w-4 h-4" />
            {{ t('previous') }}
          </BaseButton>
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
              ]"
            >
              {{ page }}
            </button>
          </div>
          <BaseButton
            variant="outline"
            size="sm"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            {{ t('next') }}
            <Icon icon="mdi:chevron-right" class="w-4 h-4" />
          </BaseButton>
        </div>
      </div>

      <div
        v-if="filteredProducts.length === 0 && !isLoading"
        class="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <Icon icon="mdi:inbox" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{{ t('noProductsFound') }}</p>
      </div>
    </BaseCard>

    <ProductFormModal
      v-model="showDialog"
      :product="selectedProduct"
      :is-submitting="isSubmitting"
      @submit="handleSubmit"
      @close="closeDialog"
    />

    <UiConfirm
      v-model="showDeleteConfirm"
      :title="t('deleteProduct')"
      :message="`${t('confirmDelete')} ${productToDelete?.title}?`"
      type="error"
      :confirm-text="t('delete')"
      :cancel-text="t('cancel')"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
