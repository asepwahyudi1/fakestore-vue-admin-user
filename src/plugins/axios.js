import axios from 'axios'
import { API_BASE_URL } from '@/constants'
import { getFromStorage, removeFromStorage } from '@/utils'
import { STORAGE_KEYS } from '@/constants'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const url = error.config?.url || ''
    const urlPath = url.split('?')[0]
    const isLoginEndpoint = urlPath === '/auth/login' || urlPath.endsWith('/auth/login')

    if (error.response?.status === 401 && !isLoginEndpoint) {
      removeFromStorage(STORAGE_KEYS.AUTH_TOKEN)
      removeFromStorage(STORAGE_KEYS.USER_DATA)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          setTimeout(() => {
            window.location.href = '/login'
          }, 500)
        }
      }
    }

    return Promise.reject(error)
  },
)

export { axiosInstance as axios }
