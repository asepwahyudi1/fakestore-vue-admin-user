export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    BY_CATEGORY: (category) => `/products/category/${category}`,
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
    PROFILE: '/users/me',
  },
  CARTS: {
    LIST: '/carts',
    USER_CART: (userId) => `/carts/user/${userId}`,
    DETAIL: (id) => `/carts/${id}`,
  },
}

export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product-detail',
  CART: 'cart',
  PROFILE: 'profile',
  ADMIN: 'admin',
  ADMIN_DASHBOARD: 'admin-dashboard',
  ADMIN_PRODUCTS: 'admin-products',
  ADMIN_USERS: 'admin-users',
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USERNAME: 'username',
  CART: 'cart',
  THEME: 'theme',
  LOCALE: 'locale',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
}

export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  JEWELERY: 'jewelery',
  MEN_CLOTHING: "men's clothing",
  WOMEN_CLOTHING: "women's clothing",
}
