// src/services/reportsService.js
import api from './api';

export const reportsService = {
  async templates(params = {}) {
    const { data } = await api.get('/reports/templates/', { params });
    return data;
  },

  async history(params = {}) {
    const { data } = await api.get('/reports/history/', { params });
    return data;
  },

  async generate(payload) {
    // payload: { template_key, period, format }
    const { data } = await api.post('/reports/generate/', payload);
    return data;
  },

  async report(reportId) {
    const { data } = await api.get(`/reports/history/${reportId}/`);
    return data;
  },

  async download(reportId) {
    const { data } = await api.get(`/reports/history/${reportId}/download/`);
    return data;
  },

  async deleteReport(reportId) {
    await api.delete(`/reports/history/${reportId}/delete/`);
  },
};