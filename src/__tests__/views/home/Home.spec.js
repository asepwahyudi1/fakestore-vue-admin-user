import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
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

describe('Home View', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
      ],
    })
  })

  it('should render home view', () => {
    useApi.mockReturnValue({
      data: { value: [] },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn().mockResolvedValue([]),
    })

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          ProductList: {
            template: '<div>ProductList</div>',
          },
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('welcome')
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

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          ProductList: ProductListStub,
          RouterLink: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const productList = wrapper.find('[data-testid="product-list"]')
    expect(productList.exists()).toBe(true)
    
    const productListComponent = wrapper.findComponent(ProductListStub)
    expect(productListComponent.exists()).toBe(true)
    expect(productListComponent.props('initialDisplayCount')).toBe(12)
    expect(productListComponent.props('dataCyPrefix')).toBe('product')
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

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          ProductList: {
            template: '<div>ProductList</div>',
          },
          RouterLink: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('welcome')
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

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          ProductList: ProductListStub,
          RouterLink: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const productList = wrapper.findComponent(ProductListStub)
    expect(productList.exists()).toBe(true)
    expect(productList.props('titleTag')).toBe('h2')
    expect(productList.props('dataCyPrefix')).toBe('product')
  })
})
