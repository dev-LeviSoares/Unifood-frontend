/**
 * Caminhos centrais de rota, para não espalhar strings literais pelas páginas.
 */
export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  STUDENT_HOME: '/app',
  SELLER_MENU: (sellerId = ':sellerId') => `/app/sellers/${sellerId}`,
  PRODUCT_DETAILS: (productId = ':productId') => `/app/products/${productId}`,
  CART: '/app/cart',
  ORDER_CONFIRMATION: (orderId = ':orderId') => `/app/orders/${orderId}/confirmation`,
  ORDER_TRACKING: (orderId = ':orderId') => `/app/orders/${orderId}/tracking`,
  ORDER_HISTORY: '/app/orders',
  STUDENT_PROFILE: '/app/profile',

  SELLER_DASHBOARD: '/seller',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_PRODUCT_CREATE: '/seller/products/new',
  SELLER_PRODUCT_EDIT: (productId = ':productId') => `/seller/products/${productId}/edit`,
  SELLER_MENU_MANAGE: '/seller/menu',
  SELLER_ORDERS: '/seller/orders',
  SELLER_ORDER_DETAILS: (orderId = ':orderId') => `/seller/orders/${orderId}`,
  SELLER_PROFILE: '/seller/profile',

  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SELLERS: '/admin/sellers',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_MENUS: '/admin/menus',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_METRICS: '/admin/metrics',
});
