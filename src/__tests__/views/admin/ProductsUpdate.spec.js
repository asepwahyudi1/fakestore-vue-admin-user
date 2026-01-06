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

describe('Admin Products Update', () => {
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

  it('should update product successfully', async () => {
    const existingProduct = {
      id: 1,
      title: 'Old Product',
      price: 50.99,
      description: 'Old description',
      category: 'electronics',
      image: 'https://example.com/old.jpg',
    }

    const updatedProduct = {
      id: 1,
      title: 'Updated Product',
      price: 99.99,
      description: 'Updated description',
      category: 'electronics',
      image: 'https://example.com/new.jpg',
    }

    useApi.mockReturnValue({
      data: { value: [existingProduct] },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    productService.updateProduct = vi.fn().mockResolvedValue(updatedProduct)

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

    wrapper.vm.selectedProduct = existingProduct

    const payload = {
      id: 1,
      title: 'Updated Product',
      price: 99.99,
      description: 'Updated description',
      category: 'electronics',
      image: 'https://example.com/new.jpg',
    }

    await wrapper.vm.handleSubmit(payload)

    expect(productService.updateProduct).toHaveBeenCalledWith(1, payload)
    expect(mockToast.success).toHaveBeenCalled()
    expect(wrapper.vm.showDialog).toBe(false)
  })

  it('should handle update product network error', async () => {
    const existingProduct = {
      id: 1,
      title: 'Old Product',
      price: 50.99,
    }

    useApi.mockReturnValue({
      data: { value: [existingProduct] },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    const networkError = new Error('Network Error')
    networkError.code = 'NETWORK_ERROR'
    networkError.message = 'Network request failed'

    productService.updateProduct = vi.fn().mockRejectedValue(networkError)

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

    wrapper.vm.selectedProduct = existingProduct

    const payload = {
      id: 1,
      title: 'Updated Product',
      price: 99.99,
    }

    await wrapper.vm.handleSubmit(payload)

    expect(productService.updateProduct).toHaveBeenCalledWith(1, payload)
    expect(mockToast.error).toHaveBeenCalled()
    expect(wrapper.vm.isSubmitting).toBe(false)
  })
})

