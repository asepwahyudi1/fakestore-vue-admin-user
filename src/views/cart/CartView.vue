<script setup>
import { ref } from 'vue'
import { BaseCard, BaseButton, BaseImage } from '@/components/base'
import { useCartStore } from '@/stores/cart'
import { useI18n, useSeo } from '@/composables'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/composables/useAuth'
import { cartService } from '@/services/cartService'
import { productService } from '@/services/productService'
import { formatCurrency, getErrorMessage } from '@/utils'
import UiConfirm from '@/components/ui/UiConfirm.vue'

const cartStore = useCartStore()
const { t } = useI18n()
const toast = useToast()
const { user } = useAuth()
const showCheckoutConfirm = ref(false)
const isProcessing = ref(false)

useSeo({
  title: t('shoppingCart'),
  description: t('shoppingCart'),
  keywords: 'shopping cart, checkout, order, fakestore',
})

const removeItem = async (itemId) => {
  const item = cartStore.items.find((i) => i.id === itemId)
  if (item) {
    await cartStore.removeItem(itemId, user.value?.id)
  }
}

const updateQuantity = async (itemId, newQuantity) => {
  const item = cartStore.items.find((i) => i.id === itemId)
  if (item) {
    await cartStore.updateQuantity(itemId, newQuantity, user.value?.id)
  }
}

const handleCheckout = () => {
  showCheckoutConfirm.value = true
}

const confirmCheckout = async () => {
  if (!user.value?.id) {
    toast.error(t('pleaseLoginToCheckout'))
    return
  }

  try {
    isProcessing.value = true

    const productsWithDetails = await Promise.all(
      cartStore.items.map(async (item) => {
        try {
          const productDetail = await productService.getProductById(item.id)
          return {
            id: productDetail.id,
            title: productDetail.title,
            price: productDetail.price,
            description: productDetail.description || '',
            category: productDetail.category || '',
            image: productDetail.image,
          }
        } catch {
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            description: '',
            category: '',
            image: item.image,
          }
        }
      }),
    )

    const cartPayload = {
      id: 0,
      userId: user.value.id,
      products: productsWithDetails,
    }

    await cartService.createCart(cartPayload)
    cartStore.clearCart()

    toast.success(t('checkoutSuccess'))
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    toast.error(errorMessage || t('checkoutFailed'))
  } finally {
    isProcessing.value = false
    showCheckoutConfirm.value = false
  }
}

const cancelCheckout = () => {
  showCheckoutConfirm.value = false
}
</script>

<template>
  <div data-cy="cart-view">
    <h1 data-cy="cart-title" class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('shoppingCart') }}
    </h1>

    <div v-if="cartStore.isEmpty" class="text-center py-12" data-cy="empty-cart">
      <Icon icon="mdi:cart-off" :width="64" :height="64" class="mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400 text-lg mb-4">{{ t('yourCartIsEmpty') }}</p>
      <router-link
        :to="{ name: 'products' }"
        class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 mt-4"
      >
        <Icon icon="mdi:arrow-left" class="mr-2" :width="20" :height="20" />
        {{ t('continueShopping') }}
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <BaseCard
          v-for="item in cartStore.items"
          :key="item.id"
          :dataCy="'cart-item'"
          class="flex items-center gap-4"
        >
          <BaseImage :src="item.image" :alt="item.title" :lazy="true" class="w-24 h-24" />
          <div class="flex-1">
            <h3 class="font-semibold">{{ item.title }}</h3>
            <p class="text-blue-600 font-bold">{{ formatCurrency(item.price) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              data-cy="decrease-quantity-button"
              @click="updateQuantity(item.id, item.quantity - 1)"
              class="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              <Icon icon="mdi:minus" :width="20" :height="20" />
            </button>
            <span data-cy="item-quantity" class="px-4">{{ item.quantity }}</span>
            <button
              data-cy="increase-quantity-button"
              @click="updateQuantity(item.id, item.quantity + 1)"
              class="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              <Icon icon="mdi:plus" :width="20" :height="20" />
            </button>
          </div>
          <button
            data-cy="remove-item-button"
            @click="removeItem(item.id)"
            class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2"
            :title="t('removeItem')"
          >
            <Icon icon="mdi:delete" :width="20" :height="20" />
          </button>
        </BaseCard>
      </div>

      <div class="lg:col-span-1">
        <BaseCard>
          <h2 class="text-xl font-bold mb-4 dark:text-white">{{ t('orderSummary') }}</h2>
          <div class="space-y-2 mb-4">
            <div class="flex justify-between dark:text-gray-300">
              <span>{{ t('items') }}:</span>
              <span>{{ cartStore.totalItems }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg dark:text-white">
              <span>{{ t('total') }}:</span>
              <span>{{ formatCurrency(cartStore.totalPrice) }}</span>
            </div>
          </div>
          <BaseButton
            class="w-full"
            :dataCy="'checkout-button'"
            :loading="isProcessing"
            :disabled="isProcessing"
            @click="handleCheckout"
          >
            <Icon
              v-if="!isProcessing"
              icon="mdi:cart-checkout"
              class="mr-2"
              :width="18"
              :height="18"
            />
            {{ isProcessing ? t('processingOrder') : t('checkout') }}
          </BaseButton>
        </BaseCard>
      </div>
    </div>

    <UiConfirm
      v-model="showCheckoutConfirm"
      :title="t('confirmCheckout')"
      :message="t('checkoutConfirmation')"
      type="info"
      :confirm-text="t('checkout')"
      :cancel-text="t('cancel')"
      @confirm="confirmCheckout"
      @cancel="cancelCheckout"
    />
  </div>
</template>
