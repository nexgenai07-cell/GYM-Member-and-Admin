// src/services/reportsService.js
import api from './api';

export const reportsService = {
  async templates() {
    const { data } = await api.get('/reports/templates/');
    return data;
  },

  async history(params = {}) {
    const { data } = await api.get('/reports/history/', { params });
    return data;
  },

  /** payload: { template_key, start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' } */
  async generate(payload) {
    const { data } = await api.post('/reports/generate/', payload);
    return data;
  },

  /** Saves the report's CSV through the browser. */
  async download(report) {
    const { data } = await api.get(`/reports/history/${report.report_id}/download/`, { responseType: 'blob' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/[\\/:*?"<>|]/g, '-')}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  async deleteReport(reportId) {
    await api.delete(`/reports/history/${reportId}/delete/`);
  },
};
