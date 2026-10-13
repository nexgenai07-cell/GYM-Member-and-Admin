import api from './api';

export const classesService = {
  async schedule() {
    const { data } = await api.get('/classes/schedule/');
    return data;
  },

  async stats() {
    const { data } = await api.get('/classes/stats/');
    return data;
  },
};