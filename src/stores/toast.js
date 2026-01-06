import { ref } from 'vue'
import { defineStore } from 'pinia'

let idCounter = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const addToast = ({ message, type = 'info', duration = 3000 }) => {
    const id = idCounter++
    const newToast = { id, message, type }
    toasts.value.unshift(newToast)

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    addToast,
    removeToast,
  }
})
