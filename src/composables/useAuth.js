import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { getFromStorage, setToStorage } from '@/utils'
import { ROUTE_NAMES, STORAGE_KEYS } from '@/constants'
import { useToast } from './useToast'
import { useI18n } from './useI18n'
import { useCartStore } from '@/stores/cart'

export function useAuth() {
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()
  const cartStore = useCartStore()
  const user = ref(getFromStorage(STORAGE_KEYS.USER_DATA, null))
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => {
    return authService.isAuthenticated() && !!user.value
  })

  const isAdmin = computed(() => {
    return user.value?.username === 'johnd'
  })

  const login = async (username, password) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.login(username, password)

      if (response.token) {
        if (response.user) {
          user.value = response.user
          setToStorage(STORAGE_KEYS.USER_DATA, response.user)
          
          if (response.user.id) {
            await cartStore.loadCartFromAPI(response.user.id)
          }
        }

        router.push({ name: ROUTE_NAMES.HOME })
      }
    } catch (err) {
      const errorMessage = err.response?.data || err.message || t('loginFailed')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    router.push({ name: ROUTE_NAMES.LOGIN })
  }

  const initAuth = async () => {
    const storedUser = getFromStorage(STORAGE_KEYS.USER_DATA, null)
    const storedUsername = getFromStorage(STORAGE_KEYS.USERNAME, null)

    if (storedUser) {
      user.value = storedUser
      if (storedUser.id) {
        await cartStore.loadCartFromAPI(storedUser.id)
      }
    } else if (storedUsername && authService.isAuthenticated()) {
      try {
        const userData = await userService.getUserByUsername(storedUsername)
        if (userData) {
          user.value = userData
          setToStorage(STORAGE_KEYS.USER_DATA, userData)
          if (userData.id) {
            await cartStore.loadCartFromAPI(userData.id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data on init:', error)
      }
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initAuth,
  }
}
