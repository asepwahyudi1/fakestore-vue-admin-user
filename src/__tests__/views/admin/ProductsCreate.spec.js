import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductsView from '@/views/admin/ProductsView.vue'
import { productService } from '@/services/productService'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'

vi.mock('@/composables/useApi')
vi.mock('@/composables/useToast')
vi.mock('@/composables/useI18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}))
vi.mock('@/services/productService')

describe('Admin Products Create', () => {
  let pinia
  let mockToast

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    mockToast = {
      success: vi.fn(),
      error: vi.fn(),
    }
    useToast.mockReturnValue(mockToast)
  })

  it('should create product successfully', async () => {
    const mockProducts = []
    const newProduct = {
      id: 1,
      title: 'New Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'https://example.com/image.jpg',
    }

    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    productService.createProduct = vi.fn().mockResolvedValue(newProduct)

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

    const payload = {
      id: 0,
      title: 'New Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'https://example.com/image.jpg',
    }

    await wrapper.vm.handleSubmit(payload)

    expect(productService.createProduct).toHaveBeenCalledWith(payload)
    expect(mockToast.success).toHaveBeenCalled()
    expect(wrapper.vm.showDialog).toBe(false)
  })

  it('should handle create product network error', async () => {
    const mockProducts = []

    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    const networkError = new Error('Network Error')
    networkError.code = 'NETWORK_ERROR'
    networkError.message = 'Network request failed'

    productService.createProduct = vi.fn().mockRejectedValue(networkError)

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

    const payload = {
      id: 0,
      title: 'New Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'https://example.com/image.jpg',
    }

    await wrapper.vm.handleSubmit(payload)

    expect(productService.createProduct).toHaveBeenCalledWith(payload)
    expect(mockToast.error).toHaveBeenCalled()
    expect(wrapper.vm.isSubmitting).toBe(false)
  })
})

