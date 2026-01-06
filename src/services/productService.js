import { axios } from '@/plugins/axios'
import { API_ENDPOINTS } from '@/constants'

export const productService = {
  async getAllProducts(params = {}) {
    return axios.get(API_ENDPOINTS.PRODUCTS.LIST, { params })
  },

  async getProductById(id) {
    return axios.get(API_ENDPOINTS.PRODUCTS.DETAIL(id))
  },

  async getCategories() {
    return axios.get(API_ENDPOINTS.PRODUCTS.CATEGORIES)
  },

  async getProductsByCategory(category) {
    return axios.get(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category))
  },

  async createProduct(productData) {
    return axios.post(API_ENDPOINTS.PRODUCTS.LIST, productData)
  },

  async updateProduct(id, productData) {
    return axios.put(API_ENDPOINTS.PRODUCTS.DETAIL(id), productData)
  },

  async deleteProduct(id) {
    return axios.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id))
  },
}
