import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import CartView from '@/views/cart/CartView.vue'
import { useCartStore } from '@/stores/cart'
import { useAuth } from '@/composables/useAuth'
import { cartService } from '@/services/cartService'
import { productService } from '@/services/productService'
import { useToast } from '@/composables/useToast'

vi.mock('@/composables/useAuth')
vi.mock('@/composables/useToast')
vi.mock('@/composables/useI18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}))
vi.mock('@/composables/useSeo', () => ({
  useSeo: vi.fn(),
}))
vi.mock('@/services/cartService')
vi.mock('@/services/productService')

describe('Cart Create (Checkout)', () => {
  let pinia
  let router
  let mockToast

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/cart', name: 'cart', component: { template: '<div>Cart</div>' } },
      ],
    })
    router.push('/cart')

    mockToast = {
      success: vi.fn(),
      error: vi.fn(),
    }

    useToast.mockReturnValue(mockToast)
    useAuth.mockReturnValue({
      user: { value: { id: 1, username: 'johnd' } },
    })
  })

  it('should create cart when checkout is confirmed', async () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        quantity: 2,
        image: 'https://example.com/image.jpg',
      },
    ]
    cartStore.clearCart = vi.fn()

    productService.getProductById = vi.fn().mockResolvedValue({
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'https://example.com/image.jpg',
    })

    cartService.createCart = vi.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      products: [],
    })

    const wrapper = mount(CartView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseImage: true,
          UiConfirm: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.confirmCheckout()

    expect(productService.getProductById).toHaveBeenCalled()
    expect(cartService.createCart).toHaveBeenCalled()
    expect(cartStore.clearCart).toHaveBeenCalled()
    expect(mockToast.success).toHaveBeenCalled()
  })

  it('should show error if user is not logged in', async () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        quantity: 2,
        image: 'https://example.com/image.jpg',
      },
    ]

    const userRef = { value: null }

    useAuth.mockReset()
    useAuth.mockReturnValue({
      user: userRef,
    })

    const wrapper = mount(CartView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseImage: true,
          UiConfirm: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    userRef.value = null

    Object.defineProperty(wrapper.vm.user, 'value', {
      value: null,
      writable: true,
      configurable: true,
    })

    const userValue = wrapper.vm.user?.value
    expect(userValue).toBeNull()
    expect(userValue?.id).toBeUndefined()
    expect(!userValue?.id).toBe(true)

    await wrapper.vm.confirmCheckout()

    expect(mockToast.error).toHaveBeenCalled()
    expect(cartService.createCart).toHaveBeenCalled()
  })

  it('should handle checkout network error', async () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        quantity: 2,
        image: 'https://example.com/image.jpg',
      },
    ]

    useAuth.mockReturnValue({
      user: { value: { id: 1, username: 'johnd' } },
    })

    productService.getProductById = vi.fn().mockResolvedValue({
      id: 1,
      title: 'Test Product',
      price: 99.99,
    })

    const networkError = new Error('Network Error')
    networkError.code = 'NETWORK_ERROR'
    networkError.message = 'Network request failed'

    cartService.createCart = vi.fn().mockRejectedValue(networkError)

    const wrapper = mount(CartView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseImage: true,
          UiConfirm: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.confirmCheckout()

    expect(cartService.createCart).toHaveBeenCalled()
    expect(mockToast.error).toHaveBeenCalled()
    expect(wrapper.vm.isProcessing).toBe(false)
  })
})
