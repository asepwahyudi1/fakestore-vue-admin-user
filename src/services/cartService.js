import { axios } from '@/plugins/axios'
import { API_ENDPOINTS } from '@/constants'

export const cartService = {
  async getAllCarts() {
    return axios.get(API_ENDPOINTS.CARTS.LIST)
  },

  async getCartById(id) {
    return axios.get(API_ENDPOINTS.CARTS.DETAIL(id))
  },

  async getUserCart(userId) {
    return axios.get(API_ENDPOINTS.CARTS.USER_CART(userId))
  },

  async createCart(cartData) {
    return axios.post(API_ENDPOINTS.CARTS.LIST, cartData)
  },

  async updateCart(id, cartData) {
    return axios.put(API_ENDPOINTS.CARTS.DETAIL(id), cartData)
  },

  async deleteCart(id) {
    return axios.delete(API_ENDPOINTS.CARTS.DETAIL(id))
  },
}

