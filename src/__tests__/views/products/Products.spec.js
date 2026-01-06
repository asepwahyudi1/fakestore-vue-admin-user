import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/products/ProductsView.vue'
import { useApi } from '@/composables/useApi'

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
  useSeo: vi.fn(),
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: { value: true },
    user: { value: { id: 1 } },
  }),
}))
vi.mock('@/services/productService')

describe('Products View', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/products', name: 'products', component: { template: '<div>Products</div>' } },
      ],
    })
  })

  it('should render products view', () => {
    useApi.mockReturnValue({
      data: { value: [] },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn().mockResolvedValue([]),
    })

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          ProductSkeleton: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('products')
  })

  it('should list products', async () => {
    const mockProducts = [
      { id: 1, title: 'Product A', description: 'Test', category: 'electronics', price: 100 },
      { id: 2, title: 'Product B', description: 'Test', category: 'clothing', price: 200 },
    ]

    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn().mockResolvedValue(mockProducts),
    })

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          ProductSkeleton: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.vm.products.value).toEqual(mockProducts.slice(0, 12))
  })

  it('should get products API successfully', async () => {
    const mockProducts = [
      { id: 1, title: 'Product A', description: 'Test', category: 'electronics', price: 100 },
      { id: 2, title: 'Product B', description: 'Test', category: 'clothing', price: 200 },
    ]

    const mockExecute = vi.fn().mockResolvedValue(mockProducts)
    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: mockExecute,
    })

    mount(ProductsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          ProductSkeleton: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    expect(mockExecute).toHaveBeenCalled()
    const result = await mockExecute()
    expect(result).toEqual(mockProducts)
  })

  it('should filter products by search query', async () => {
    const mockProducts = [
      { id: 1, title: 'Product A', description: 'Test', category: 'electronics', price: 100 },
      { id: 2, title: 'Product B', description: 'Test', category: 'clothing', price: 200 },
    ]

    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn().mockResolvedValue(mockProducts),
    })

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          ProductSkeleton: true,
          BaseImage: true,
          RouterLink: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    wrapper.vm.searchQuery = 'Product A'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filteredProducts.length).toBe(1)
    expect(wrapper.vm.filteredProducts[0].title).toBe('Product A')
  })
})
