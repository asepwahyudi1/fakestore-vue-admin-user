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

describe('Cart Update (Quantity)', () => {
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
      ],
    })

    useAuth.mockReturnValue({
      user: { value: { id: 1, username: 'johnd' } },
    })
  })

  it('should update item quantity when updateQuantity is called', async () => {
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
    cartStore.updateQuantity = vi.fn().mockResolvedValue(undefined)

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

    await wrapper.vm.updateQuantity(1, 3)

    expect(cartStore.updateQuantity).toHaveBeenCalledWith(1, 3, 1)
  })

  it('should not update quantity if item not found', async () => {
    const cartStore = useCartStore()
    cartStore.items = []
    cartStore.updateQuantity = vi.fn()

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

    await wrapper.vm.updateQuantity(999, 5)

    expect(cartStore.updateQuantity).not.toHaveBeenCalled()
  })
})
