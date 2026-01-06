import { axios } from '@/plugins/axios'
import { API_ENDPOINTS } from '@/constants'
import { getFromStorage, setToStorage, removeFromStorage } from '@/utils'
import { STORAGE_KEYS } from '@/constants'
import { userService } from './userService'

export const authService = {
  async login(username, password) {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    })

    if (response.token) {
      setToStorage(STORAGE_KEYS.AUTH_TOKEN, response.token)
      setToStorage(STORAGE_KEYS.USERNAME, username)

      try {
        const userData = await userService.getUserByUsername(username)
        if (userData) {
          setToStorage(STORAGE_KEYS.USER_DATA, userData)
          return { ...response, user: userData }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    return response
  },

  logout() {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN)
    removeFromStorage(STORAGE_KEYS.USER_DATA)
    removeFromStorage(STORAGE_KEYS.USERNAME)
    removeFromStorage(STORAGE_KEYS.CART)
    removeFromStorage(STORAGE_KEYS.THEME)
    removeFromStorage(STORAGE_KEYS.LOCALE)
  },

  getCurrentUser() {
    return getFromStorage(STORAGE_KEYS.USER_DATA, null)
  },

  isAuthenticated() {
    const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN, null)
    return !!token
  },
}
