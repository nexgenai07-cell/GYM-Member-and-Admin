import api from './api';

export const attendanceService = {
  // ===== Summary / stats =====
  async summary() {
    const { data } = await api.get('/attendance/summary/');
    return data;
  },

  // ===== Raw check-ins list =====
  async checkIns(params = {}) {
    const { data } = await api.get('/attendance/check-ins/', { params });
    return data;
  },

  // Check-ins are recorded at the entrance (face gate / staff scanning the pass).
  async checkOut(id) {
    const { data } = await api.post(`/attendance/check-ins/${id}/check-out/`);
    return data;
  },

  // ===== Ledger (paginated table) =====
  async ledger(params = {}) {
    const { data } = await api.get('/attendance/ledger/', { params });
    return data;
  },

  async exportLedger(params = {}) {
    const { data } = await api.get('/attendance/ledger/export/', {
      params,
      responseType: 'blob',
    });
    return data; // Blob
  },

  // ===== Heatmap =====
  async heatmap(year) {
    const { data } = await api.get('/attendance/heatmap/', {
      params: year ? { year } : {},
    });
    return data;
  },

  // ===== Milestones =====
  async milestones() {
    const { data } = await api.get('/attendance/milestones/');
    return data;
  },

  async claimMilestone(id) {
    const { data } = await api.post(`/attendance/milestones/${id}/claim/`);
    return data;
  },

  // ===== Arenas =====
  async arenas() {
    const { data } = await api.get('/attendance/arenas/');
    return data;
  },

  // ===== Hourly curve =====
  async hourly() {
    const { data } = await api.get('/attendance/hourly/');
    return data;
  },
};