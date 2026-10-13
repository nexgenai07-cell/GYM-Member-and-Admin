import api from './api';

export const staffService = {
  async list(params = {}) {
    const { data } = await api.get('/staff/', { params });
    return data;
  },
  async stats() {
    const { data } = await api.get('/staff/stats/');
    return data;
  },
  async detail(id) {
    const { data } = await api.get(`/staff/${id}/`);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.patch(`/staff/${id}/`, payload);
    return data;
  },
};