import api from './api';

export const paymentsService = {
  async summary() {
    const { data } = await api.get('/payments/summary/');
    return data;
  },

  async transactions(params = {}) {
    const { data } = await api.get('/payments/transactions/', { params });
    return data;
  },

  async transaction(id) {
    const { data } = await api.get(`/payments/transactions/${id}/`);
    return data;
  },

  async paymentMethods() {
    const { data } = await api.get('/payments/methods/');
    return data;
  },

  async addPaymentMethod(payload) {
    const { data } = await api.post('/payments/methods/', payload);
    return data;
  },

  async setDefaultMethod(id) {
    const { data } = await api.post(`/payments/methods/${id}/set-default/`);
    return data;
  },

  async lockerCredit() {
    const { data } = await api.get('/payments/locker-credit/');
    return data;
  },

  async topupLockerCredit(amount) {
    const { data } = await api.post('/payments/locker-credit/topup/', { amount });
    return data;
  },

  async invoices() {
    const { data } = await api.get('/payments/invoices/');
    return data;
  },

  async invoice(number) {
    const { data } = await api.get(`/payments/invoices/${number}/`);
    return data;
  },
};