import api from './api';

export const shopService = {
  async categories() {
    const { data } = await api.get('/shop/categories/');
    return data;
  },

  async products(params = {}) {
    const { data } = await api.get('/shop/products/', { params });
    return data;
  },

  async product(id) {
    const { data } = await api.get(`/shop/products/${id}/`);
    return data;
  },

  async cart() {
    const { data } = await api.get('/shop/cart/');
    return data;
  },

  async addToCart(productId, quantity = 1) {
    const { data } = await api.post('/shop/cart/add/', {
      product_id: productId,
      quantity,
    });
    return data;
  },

  async updateCartItem(itemId, quantity) {
    const { data } = await api.patch(`/shop/cart/items/${itemId}/`, { quantity });
    return data;
  },

  async removeCartItem(itemId) {
    const { data } = await api.delete(`/shop/cart/items/${itemId}/remove/`);
    return data;
  },

  async clearCart() {
    const { data } = await api.post('/shop/cart/clear/');
    return data;
  },

  async applyPromo(code) {
    const { data } = await api.post('/shop/cart/apply-promo/', { code });
    return data;
  },

  async checkout(payload) {
    const { data } = await api.post('/shop/checkout/', payload);
    return data;
  },

  async myOrders() {
    const { data } = await api.get('/shop/orders/');
    return data;
  },

  async order(orderNumber) {
    const { data } = await api.get(`/shop/orders/${orderNumber}/`);
    return data;
  },

  async cancelOrder(orderNumber) {
    const { data } = await api.post(`/shop/orders/${orderNumber}/cancel/`);
    return data;
  },
};