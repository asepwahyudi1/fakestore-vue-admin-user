import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { config } from '@vue/test-utils'

export function setupPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

export function setupRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
    ],
  })
}

export function setupTestConfig() {
  config.global.stubs = {
    RouterLink: true,
    RouterView: true,
    Icon: true,
  }
}
