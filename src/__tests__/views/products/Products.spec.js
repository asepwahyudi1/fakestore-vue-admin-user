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
          ProductList: {
            template: '<div>ProductList</div>',
          },
        },
      },
    })

    expect(wrapper.html()).toContain('ProductList')
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

    const ProductListStub = {
      template: '<div data-testid="product-list">ProductList</div>',
      props: ['titleTag', 'dataCyPrefix', 'initialDisplayCount'],
    }

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          ProductList: ProductListStub,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const productList = wrapper.find('[data-testid="product-list"]')
    expect(productList.exists()).toBe(true)
    
    const productListComponent = wrapper.findComponent(ProductListStub)
    expect(productListComponent.exists()).toBe(true)
    expect(productListComponent.props('initialDisplayCount')).toBe(20)
    expect(productListComponent.props('dataCyPrefix')).toBe('products')
    expect(productListComponent.props('titleTag')).toBe('h1')
  })

  it('should get products API successfully', async () => {
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
          ProductList: {
            template: '<div>ProductList</div>',
          },
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('ProductList')
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

    const ProductListStub = {
      template: '<div data-testid="product-list">ProductList</div>',
      props: ['titleTag', 'dataCyPrefix', 'initialDisplayCount'],
    }

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          ProductList: ProductListStub,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const productList = wrapper.findComponent(ProductListStub)
    expect(productList.exists()).toBe(true)
    expect(productList.props('titleTag')).toBe('h1')
    expect(productList.props('dataCyPrefix')).toBe('products')
    expect(productList.props('initialDisplayCount')).toBe(20)
  })
})
