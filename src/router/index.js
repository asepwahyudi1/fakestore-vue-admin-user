import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants'
import { authService } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.HOME,
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: ROUTE_NAMES.LOGIN,
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false, layout: 'auth' },
    },
    {
      path: '/products',
      name: ROUTE_NAMES.PRODUCTS,
      component: () => import('@/views/products/ProductsView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/products/:id',
      name: ROUTE_NAMES.PRODUCT_DETAIL,
      component: () => import('@/views/products/ProductDetailView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/cart',
      name: ROUTE_NAMES.CART,
      component: () => import('@/views/cart/CartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: ROUTE_NAMES.PROFILE,
      component: () => import('@/views/profile/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: ROUTE_NAMES.ADMIN,
      redirect: { name: ROUTE_NAMES.ADMIN_DASHBOARD },
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/dashboard',
      name: ROUTE_NAMES.ADMIN_DASHBOARD,
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
      path: '/admin/products',
      name: ROUTE_NAMES.ADMIN_PRODUCTS,
      component: () => import('@/views/admin/ProductsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
      path: '/admin/users',
      name: ROUTE_NAMES.ADMIN_USERS,
      component: () => import('@/views/admin/UsersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin) {
    const user = authService.getCurrentUser()
    const isAdmin = user?.username === 'johnd'
    if (!isAdmin) {
      next({ name: ROUTE_NAMES.HOME })
      return
    }
  }

  if (isAuthenticated && to.name === ROUTE_NAMES.LOGIN) {
    next({ name: ROUTE_NAMES.HOME })
    return
  }

  next()
})

export default router
