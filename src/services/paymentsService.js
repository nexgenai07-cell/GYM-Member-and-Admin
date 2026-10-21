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


  async lockerCredit() {
    const { data } = await api.get('/payments/locker-credit/');
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

  // ===== Checkout (Moyasar card / STC Pay, or locker credit) =====
  /**
   * Start a payment. body = { purpose, ...refs } — e.g.
   *   { purpose: 'locker_topup', amount: 50 }
   *   { purpose: 'shop_order', order_number }
   *   { purpose: 'trainer_session', session_id }
   *   { purpose: 'course', course_id }
   *   { purpose: 'renewal', plan_id, months }
   * add method: 'locker_credit' to pay from the balance immediately.
   * Returns the intent; card payments include `payment` (Moyasar form params).
   */
  async checkout(body) {
    const { data } = await api.post('/payments/checkout/', body);
    return data;
  },

  async intent(id) {
    const { data } = await api.get(`/payments/intents/${id}/`);
    return data;
  },

  /** Link the Moyasar payment the form just created (before any 3-D Secure redirect). */
  async attachPayment(intentId, paymentId) {
    const { data } = await api.post(`/payments/intents/${intentId}/attach/`, { payment_id: paymentId });
    return data;
  },

  /** Callback page after 3-D Secure: the backend re-checks the payment with Moyasar. */
  async verifyPayment(paymentId) {
    const { data } = await api.post('/payments/intents/verify/', { payment_id: paymentId });
    return data;
  },
};
