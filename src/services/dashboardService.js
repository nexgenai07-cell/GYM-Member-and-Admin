import api from './api';

export const dashboardService = {
  async fetch() {
    const { data } = await api.get('/dashboard/');
    return data;
  },
};