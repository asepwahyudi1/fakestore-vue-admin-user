import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductsView from '@/views/admin/ProductsView.vue'
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
vi.mock('@/services/productService')

describe('Admin Products View', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render products view', () => {
    useApi.mockReturnValue({
      data: { value: [] },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseInput: true,
          BaseLoading: true,
          ProductFormModal: true,
          UiConfirm: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('manageProducts')
  })

  it('should list products', () => {
    const mockProducts = [
      { id: 1, title: 'Product A', description: 'Test', category: 'electronics', price: 100 },
      { id: 2, title: 'Product B', description: 'Test', category: 'clothing', price: 200 },
    ]

    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseInput: true,
          BaseLoading: true,
          ProductFormModal: true,
          UiConfirm: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.vm.products.value).toEqual(mockProducts)
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
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseInput: true,
          BaseLoading: true,
          ProductFormModal: true,
          UiConfirm: true,
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
      execute: vi.fn(),
    })

    const wrapper = mount(ProductsView, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          BaseButton: true,
          BaseInput: true,
          BaseLoading: true,
          ProductFormModal: true,
          UiConfirm: true,
          Icon: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.searchQuery = 'Product A'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filteredProducts.length).toBe(1)
    expect(wrapper.vm.filteredProducts[0].title).toBe('Product A')
  })
})
