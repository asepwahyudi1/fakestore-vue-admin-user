import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'

import App from './App.vue'
import router from './router'
import './styles/index.css'
import { useThemeStore } from './stores/theme'
import { useI18nStore } from './stores/i18n'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('Icon', Icon)

const themeStore = useThemeStore()
themeStore.initTheme()

const i18nStore = useI18nStore()
document.documentElement.lang = i18nStore.locale

app.mount('#app')
