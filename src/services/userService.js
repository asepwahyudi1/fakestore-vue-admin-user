import { axios } from '@/plugins/axios'
import { API_ENDPOINTS } from '@/constants'

export const userService = {
  async getUserById(id) {
    return axios.get(API_ENDPOINTS.USERS.DETAIL(id))
  },

  async getUserByUsername(username) {
    const users = await axios.get(API_ENDPOINTS.USERS.LIST)
    return users.find((user) => user.username === username)
  },

  async getCurrentUser() {
    try {
      return await axios.get(API_ENDPOINTS.USERS.PROFILE)
    } catch {
      return null
    }
  },

  async getAllUsers() {
    return axios.get(API_ENDPOINTS.USERS.LIST)
  },

  async createUser(userData) {
    return axios.post(API_ENDPOINTS.USERS.LIST, userData)
  },

  async updateUser(id, userData) {
    return axios.put(API_ENDPOINTS.USERS.DETAIL(id), userData)
  },

  async deleteUser(id) {
    return axios.delete(API_ENDPOINTS.USERS.DETAIL(id))
  },
}

