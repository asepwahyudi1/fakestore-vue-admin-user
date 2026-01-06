import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFromStorage, setToStorage } from '@/utils'
import { STORAGE_KEYS } from '@/constants'
import { cartService } from '@/services/cartService'
import { productService } from '@/services/productService'

export const useCartStore = defineStore('cart', () => {
  const items = ref(getFromStorage(STORAGE_KEYS.CART, []))
  const isLoading = ref(false)
  const currentCartId = ref(null)

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const uniqueItemsCount = computed(() => {
    return items.value.length
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const isEmpty = computed(() => {
    return items.value.length === 0
  })

  function saveToStorage() {
    setToStorage(STORAGE_KEYS.CART, items.value)
  }

  async function addItem(product, quantity = 1, userId = null) {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      })
    }

    saveToStorage()

    if (userId) {
      await syncCartToAPI(userId)
    }
  }

  async function removeItem(productId, userId = null) {
    items.value = items.value.filter((item) => item.id !== productId)
    saveToStorage()

    if (userId) {
      await syncCartToAPI(userId)
    }
  }

  async function updateQuantity(productId, quantity, userId = null) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        await removeItem(productId, userId)
      } else {
        item.quantity = quantity
        saveToStorage()

        if (userId) {
          await syncCartToAPI(userId)
        }
      }
    }
  }

  async function syncCartToAPI(userId) {
    if (!userId) {
      return
    }

    try {
      const products = items.value.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))

      if (currentCartId.value) {
        const cartPayload = {
          id: currentCartId.value,
          userId,
          products,
        }
        await cartService.updateCart(currentCartId.value, cartPayload)
      } else {
        const productsWithDetails = await Promise.all(
          items.value.map(async (item) => {
            try {
              const product = await productService.getProductById(item.id)
              return {
                id: product.id,
                title: product.title,
                price: product.price,
                description: product.description || '',
                category: product.category || '',
                image: product.image,
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
          })
        )

        const cartPayload = {
          id: 0,
          userId,
          products: productsWithDetails,
        }
        const response = await cartService.createCart(cartPayload)
        if (response?.id) {
          currentCartId.value = response.id
        }
      }
    } catch (error) {
      console.error('Failed to sync cart to API:', error)
    }
  }

  function clearCart() {
    items.value = []
    currentCartId.value = null
    saveToStorage()
  }

  async function loadCartFromAPI(userId, force = false) {
    if (!userId) {
      return
    }

    try {
      isLoading.value = true
      const userCarts = await cartService.getUserCart(userId)

      if (userCarts && userCarts.length > 0) {
        const sortedCarts = [...userCarts].sort((a, b) => {
          const dateA = new Date(a.date || 0)
          const dateB = new Date(b.date || 0)
          return dateB - dateA
        })
        const latestCart = sortedCarts[0]
        
        currentCartId.value = latestCart.id

        if (latestCart.products && latestCart.products.length > 0) {
          const cartItems = await Promise.all(
            latestCart.products.map(async (cartProduct) => {
              try {
                const product = await productService.getProductById(cartProduct.productId)
                return {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  quantity: cartProduct.quantity || 1,
                }
              } catch (error) {
                console.error(`Failed to fetch product ${cartProduct.productId}:`, error)
                return null
              }
            })
          )

          const apiCartItems = cartItems.filter((item) => item !== null)
          
          if (force || items.value.length === 0) {
            items.value = apiCartItems
            saveToStorage()
          }
        } else {
          if (force || items.value.length === 0) {
            items.value = []
            saveToStorage()
          }
        }
      } else {
        if (force || items.value.length === 0) {
          currentCartId.value = null
        }
      }
    } catch (error) {
      console.error('Failed to load cart from API:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    currentCartId,
    totalItems,
    uniqueItemsCount,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCartFromAPI,
    syncCartToAPI,
  }
})
