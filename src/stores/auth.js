import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { getFromStorage, setToStorage } from '@/utils'
import { STORAGE_KEYS } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getFromStorage(STORAGE_KEYS.USER_DATA, null))
  const token = ref(getFromStorage(STORAGE_KEYS.AUTH_TOKEN, null))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const isAdmin = computed(() => {
    return user.value?.username === 'johnd'
  })

  function setUser(userData) {
    user.value = userData
    setToStorage(STORAGE_KEYS.USER_DATA, userData)
  }

  function setToken(authToken) {
    token.value = authToken
    setToStorage(STORAGE_KEYS.AUTH_TOKEN, authToken)
  }

  async function login(username, password) {
    try {
      isLoading.value = true
      const response = await authService.login(username, password)

      if (response.token) {
        setToken(response.token)
        if (response.user) {
          setUser(response.user)
        }
      }

      return response
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
  }

  function initAuth() {
    const storedUser = getFromStorage(STORAGE_KEYS.USER_DATA, null)
    const storedToken = getFromStorage(STORAGE_KEYS.AUTH_TOKEN, null)

    if (storedUser) {
      user.value = storedUser
    }
    if (storedToken) {
      token.value = storedToken
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    setUser,
    setToken,
    login,
    logout,
    initAuth,
  }
})
