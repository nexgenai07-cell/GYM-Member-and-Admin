import api from './api';

export const classesService = {
  // Member
  async list() {
    const { data } = await api.get('/classes/');
    return data;
  },
  async book(id) {
    const { data } = await api.post(`/classes/${id}/book/`);
    return data;
  },
  async cancel(id) {
    const { data } = await api.post(`/classes/${id}/cancel/`);
    return data;
  },

  // Admin
  async schedule() {
    const { data } = await api.get('/classes/schedule/');
    return data;
  },
  async stats() {
    const { data } = await api.get('/classes/stats/');
    return data;
  },
  async adminList(params = {}) {
    const { data } = await api.get('/classes/admin/', { params });
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/classes/admin/', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.patch(`/classes/admin/${id}/`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/classes/admin/${id}/`);
  },
  async roster(id) {
    const { data } = await api.get(`/classes/admin/${id}/roster/`);
    return data;
  },
  async removeFromRoster(id, enrollmentId) {
    const { data } = await api.post(`/classes/admin/${id}/roster/${enrollmentId}/remove/`);
    return data;
  },
};
