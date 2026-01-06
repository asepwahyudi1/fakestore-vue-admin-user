import { useI18nStore } from '@/stores/i18n'

export function useI18n() {
  const i18nStore = useI18nStore()

  return {
    t: i18nStore.t,
    locale: i18nStore.locale,
    setLocale: i18nStore.setLocale,
    availableLocales: i18nStore.availableLocales,
  }
}

