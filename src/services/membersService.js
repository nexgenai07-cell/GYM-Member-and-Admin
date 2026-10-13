import api from './api';

export const membersService = {
  async plans() {
    const { data } = await api.get('/members/plans/');
    return data;
  },

  async myMembership() {
    const { data } = await api.get('/members/membership/');
    return data;
  },

  async checkIns() {
    const { data } = await api.get('/members/check-ins/');
    return data;
  },

  async checkIn(payload = {}) {
    const { data } = await api.post('/members/check-ins/', payload);
    return data;
  },

  async checkOut(id) {
    const { data } = await api.post(`/members/check-ins/${id}/check-out/`);
    return data;
  },
};