import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { getFromStorage, setToStorage } from '@/utils'
import { STORAGE_KEYS } from '@/constants'

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(getFromStorage(STORAGE_KEYS.THEME, 'system'))
  const systemTheme = ref(getSystemTheme())

  const effectiveTheme = computed(() => {
    return theme.value === 'system' ? systemTheme.value : theme.value
  })

  const setTheme = (newTheme) => {
    theme.value = newTheme
    setToStorage(STORAGE_KEYS.THEME, newTheme)
    applyTheme()
  }

  const toggleTheme = () => {
    if (theme.value === 'system') {
      setTheme(systemTheme.value === 'light' ? 'dark' : 'light')
    } else {
      const newTheme = theme.value === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
    }
  }

  const applyTheme = () => {
    if (typeof document === 'undefined') return

    const themeToApply = effectiveTheme.value
    const html = document.documentElement

    html.classList.remove('dark')

    if (themeToApply === 'dark') {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
      html.style.colorScheme = 'light'
    }
  }

  const initTheme = () => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
      if (theme.value === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    systemTheme.value = getSystemTheme()
    applyTheme()
  }

  watch(
    () => effectiveTheme.value,
    () => {
      applyTheme()
    },
    { immediate: true },
  )

  return {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    initTheme,
  }
})
