import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password });
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
    } catch {
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

  /** POST /auth/password/forgot/ — emails a reset link (same answer whether or not the account exists). */
  async forgotPassword(email) {
    const { data } = await api.post('/auth/password/forgot/', { email });
    return data;
  },

  /** POST /auth/password/reset/ — uid + token come from the emailed link. */
  async resetPassword(uid, token, newPassword, newPasswordConfirm) {
    const { data } = await api.post('/auth/password/reset/', {
      uid, token, new_password: newPassword, new_password_confirm: newPasswordConfirm,
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