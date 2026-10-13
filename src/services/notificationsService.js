import api from './api';

export const notificationsService = {
  async list(params = {}) {
    const { data } = await api.get('/notifications/', { params });
    return data;
  },

  async unreadCount() {
    const { data } = await api.get('/notifications/unread-count/');
    return data;
  },

  async markRead(id) {
    const { data } = await api.post(`/notifications/${id}/read/`);
    return data;
  },

  async markAllRead() {
    const { data } = await api.post('/notifications/mark-all-read/');
    return data;
  },

  async remove(id) {
    await api.delete(`/notifications/${id}/`);
  },

  async preferences() {
    const { data } = await api.get('/notifications/preferences/');
    return data;
  },

  async updatePreferences(payload) {
    const { data } = await api.patch('/notifications/preferences/', payload);
    return data;
  },
};