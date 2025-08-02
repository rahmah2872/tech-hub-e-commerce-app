import api from '../utils/axios';

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),
  getCategories: () => api.get('/products/categories'),
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
  getTotal: () => api.get('/cart/total'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, updateData) => api.put(`/orders/${id}`, updateData),
  cancel: (id) => api.delete(`/orders/${id}`),
  getStatus: (id) => api.get(`/orders/${id}/status`),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  updatePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist/items', { productId }),
  remove: (productId) => api.delete(`/wishlist/items/${productId}`),
  clear: () => api.delete('/wishlist'),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId, params = {}) => api.get(`/products/${productId}/reviews`, { params }),
  create: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
  update: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  users: usersAPI,
  categories: categoriesAPI,
  wishlist: wishlistAPI,
  reviews: reviewsAPI,
};