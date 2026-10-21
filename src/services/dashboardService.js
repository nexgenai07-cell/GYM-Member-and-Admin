import api from './api';

export const dashboardService = {
  async fetch() {
    const { data } = await api.get('/dashboard/');
    return data;
  },

  /** Live gym load from open check-ins (header). */
  async occupancy() {
    const { data } = await api.get('/dashboard/occupancy/');
    return data;
  },
};
