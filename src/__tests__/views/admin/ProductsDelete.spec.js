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

describe('Admin Products Delete', () => {
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

  it('should delete product successfully', async () => {
    const productToDelete = {
      id: 1,
      title: 'Product to Delete',
      price: 99.99,
    }

    const mockProducts = [productToDelete]

    useApi.mockReturnValue({
      data: { value: mockProducts },
      isLoading: { value: false },
      error: { value: null },
      hasLoaded: { value: true },
      execute: vi.fn(),
    })

    productService.deleteProduct = vi.fn().mockResolvedValue(productToDelete)

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

    wrapper.vm.productToDelete = productToDelete
    await wrapper.vm.confirmDelete()

    expect(productService.deleteProduct).toHaveBeenCalledWith(1)
    expect(mockToast.success).toHaveBeenCalled()
    expect(wrapper.vm.showDeleteConfirm).toBe(false)
    expect(wrapper.vm.productToDelete).toBeNull()
  })

  it('should handle delete product network error', async () => {
    const productToDelete = {
      id: 1,
      title: 'Product to Delete',
      price: 99.99,
    }

    const mockProducts = [productToDelete]

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

    productService.deleteProduct = vi.fn().mockRejectedValue(networkError)

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

    wrapper.vm.productToDelete = productToDelete
    await wrapper.vm.confirmDelete()

    expect(productService.deleteProduct).toHaveBeenCalledWith(1)
    expect(mockToast.error).toHaveBeenCalled()
    expect(wrapper.vm.isDeleting).toBe(false)
  })
})

