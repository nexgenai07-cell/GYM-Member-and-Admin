import api from './api';

export const facilitiesService = {
  async list(params = {}) {
    const { data } = await api.get('/facilities/', { params });
    return data;
  },

  async stats() {
    const { data } = await api.get('/facilities/stats/');
    return data;
  },
};