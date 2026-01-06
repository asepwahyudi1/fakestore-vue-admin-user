import { useToastStore } from '@/stores/toast'

export function useToast() {
  const toastStore = useToastStore()

  const showToast = (message, type = 'info', duration = 3000) => {
    toastStore.addToast({ message, type, duration })
  }

  const success = (message, duration = 3000) => {
    showToast(message, 'success', duration)
  }

  const error = (message, duration = 5000) => {
    showToast(message, 'error', duration)
  }

  const warning = (message, duration = 4000) => {
    showToast(message, 'warning', duration)
  }

  const info = (message, duration = 3000) => {
    showToast(message, 'info', duration)
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
  }
}

