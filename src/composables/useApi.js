import { ref } from 'vue'
import { getErrorMessage } from '@/utils'
import { useToast } from './useToast'

export function useApi(showToastOnError = true) {
  const data = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const hasLoaded = ref(false)
  const toast = useToast()

  const execute = async (apiCall, ...params) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiCall(...params)
      data.value = response
      hasLoaded.value = true

      return response
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      hasLoaded.value = true

      if (showToastOnError) {
        toast.error(errorMessage)
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = null
    isLoading.value = false
    error.value = null
    hasLoaded.value = false
  }

  return {
    data,
    isLoading,
    error,
    hasLoaded,
    execute,
    reset,
  }
}
