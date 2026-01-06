import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ProductDetailView from '@/views/products/ProductDetailView.vue'
import { productService } from '@/services/productService'
import { useApi } from '@/composables/useApi'
import { useCartStore } from '@/stores/cart'

vi.mock('@/composables/useApi')
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
  useSeo: () => ({
    updateSeo: vi.fn(),
  }),
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    user: { value: { id: 1 } },
  }),
}))
vi.mock('@/services/productService')
vi.mock('@/stores/cart', () => ({
  useCartStore: vi.fn(),
}))

describe('Product Detail View', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        {
          path: '/products/:id',
          name: 'product-detail',
          component: { template: '<div>Product Detail</div>' },
        },
      ],
    })
  })

  it('should render product detail view', async () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'https://example.com/image.jpg',
    }

    productService.getProductsByCategory = vi.fn().mockResolvedValue([])

    useApi.mockReturnValue({
      data: { value: mockProduct },
      isLoading: { value: false },
      error: { value: null },
      execute: vi.fn().mockResolvedValue(mockProduct),
      reset: vi.fn(),
    })

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [pinia, router],
        mocks: {
          $route: {
            params: { id: '1' },
          },
        },
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseLoading: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.vm.product.value).toEqual(mockProduct)
  })

  it('should load product on mount', async () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      category: 'electronics',
    }

    productService.getProductsByCategory = vi.fn().mockResolvedValue([])

    const mockExecute = vi.fn().mockResolvedValue(mockProduct)

    useApi.mockReturnValue({
      data: { value: null },
      isLoading: { value: false },
      error: { value: null },
      execute: mockExecute,
      reset: vi.fn(),
    })

    mount(ProductDetailView, {
      global: {
        plugins: [pinia, router],
        mocks: {
          $route: {
            params: { id: '1' },
          },
        },
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseLoading: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    expect(mockExecute).toHaveBeenCalled()
  })

  it('should add product to cart', async () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'https://example.com/image.jpg',
    }

    productService.getProductsByCategory = vi.fn().mockResolvedValue([])

    const mockAddItem = vi.fn()
    useCartStore.mockReturnValue({
      addItem: mockAddItem,
      items: [],
    })

    useApi.mockReturnValue({
      data: { value: mockProduct },
      isLoading: { value: false },
      error: { value: null },
      execute: vi.fn().mockResolvedValue(mockProduct),
      reset: vi.fn(),
    })

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [pinia, router],
        mocks: {
          $route: {
            params: { id: '1' },
          },
        },
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseLoading: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    await wrapper.vm.addToCart(mockProduct)

    expect(mockAddItem).toHaveBeenCalled()
  })
})
