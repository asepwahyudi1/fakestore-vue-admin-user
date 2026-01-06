export const mockProducts = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description: 'Slim-fitting style, contrast raglan long sleeve.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description: 'Great outerwear jackets for Spring/Autumn/Winter.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
  },
]

export const mockProduct = {
  id: 1,
  title: 'Fjallraven - Foldsack No. 1 Backpack',
  price: 109.95,
  description: 'Your perfect pack for everyday use and walks in the forest.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: { rate: 3.9, count: 120 },
}

export const mockCategories = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
]

export const mockUsers = [
  {
    id: 1,
    email: 'john@gmail.com',
    username: 'johnd',
    password: 'm38rmF$',
    name: { firstname: 'John', lastname: 'Doe' },
    address: {
      city: 'kilcoole',
      street: '7835 new road',
      number: 3,
      zipcode: '12926-3874',
      geolocation: { lat: '-37.3159', long: '81.1496' },
    },
    phone: '1-570-236-7033',
  },
  {
    id: 2,
    email: 'morrison@gmail.com',
    username: 'mor_2314',
    password: '83r5^_',
    name: { firstname: 'David', lastname: 'Morrison' },
    address: {
      city: 'kilcoole',
      street: '5292 new road',
      number: 2,
      zipcode: '12926-3874',
      geolocation: { lat: '-37.3159', long: '81.1496' },
    },
    phone: '1-570-236-7033',
  },
]

export const mockUser = {
  id: 1,
  email: 'john@gmail.com',
  username: 'johnd',
  password: 'm38rmF$',
  name: { firstname: 'John', lastname: 'Doe' },
  address: {
    city: 'kilcoole',
    street: '7835 new road',
    number: 3,
    zipcode: '12926-3874',
    geolocation: { lat: '-37.3159', long: '81.1496' },
  },
  phone: '1-570-236-7033',
}

export const mockAuthResponse = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
}

export const mockCarts = [
  {
    id: 1,
    userId: 1,
    date: '2020-02-03',
    products: [
      { productId: 1, quantity: 4 },
      { productId: 2, quantity: 1 },
    ],
  },
  {
    id: 2,
    userId: 2,
    date: '2020-01-02',
    products: [{ productId: 3, quantity: 2 }],
  },
]

export const mockCart = {
  id: 1,
  userId: 1,
  date: '2020-02-03',
  products: [
    { productId: 1, quantity: 4 },
    { productId: 2, quantity: 1 },
  ],
}

export const mockUserCart = {
  id: 1,
  userId: 1,
  date: '2020-02-03',
  products: [
    { productId: 1, quantity: 4 },
    { productId: 2, quantity: 1 },
  ],
}

