import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import CartView from '@/views/cart/CartView.vue'
import { useCartStore } from '@/stores/cart'
import { useAuth } from '@/composables/useAuth'

vi.mock('@/composables/useAuth')
vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))
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

describe('Cart View', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/cart', name: 'cart', component: { template: '<div>Cart</div>' } },
        { path: '/products', name: 'products', component: { template: '<div>Products</div>' } },
      ],
    })

    useAuth.mockReturnValue({
      user: { value: { id: 1, username: 'johnd' } },
    })
  })

  it('should render cart view', () => {
    const cartStore = useCartStore()
    cartStore.items = []

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

    expect(wrapper.text()).toContain('shoppingCart')
  })

  it('should display empty cart message when cart is empty', () => {
    const cartStore = useCartStore()
    cartStore.items = []

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

    expect(cartStore.isEmpty).toBe(true)
    expect(wrapper.text()).toContain('yourCartIsEmpty')
  })

  it('should list cart items', () => {
    const cartStore = useCartStore()
    const mockItems = [
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        quantity: 2,
        image: 'https://example.com/image.jpg',
      },
    ]
    cartStore.items = mockItems

    expect(cartStore.items).toEqual(mockItems)
    expect(cartStore.isEmpty).toBe(false)
    expect(cartStore.totalItems).toBe(2)
    expect(cartStore.totalPrice).toBe(199.98)
  })
})
