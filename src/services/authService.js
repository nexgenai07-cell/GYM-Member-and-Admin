import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register/', payload);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) {
        await api.post('/auth/logout/', { refresh });
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  async me() {
    const { data } = await api.get('/auth/me/');
    return data;
  },

  /** POST /auth/change-password/ — 400 carries field errors (old_password, new_password, …). */
  async changePassword(oldPassword, newPassword, newPasswordConfirm) {
    const { data } = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return data;
  },

  getCurrentUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};