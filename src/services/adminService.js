// src/services/adminService.js
import api from './api';

export const adminService = {
  // ============================================
  // OVERVIEW
  // ============================================
  async overview() {
    const { data } = await api.get('/admin/overview/');
    return data;
  },

  // ============================================
  // MEMBERS
  // ============================================
  async members(params = {}) {
    const { data } = await api.get('/admin/members/', { params });
    return data;
  },

  async member(id) {
    const { data } = await api.get(`/admin/members/${id}/`);
    return data;
  },

  async updateMember(id, payload) {
    const { data } = await api.patch(`/admin/members/${id}/update/`, payload);
    return data;
  },

  async memberStats() {
    const { data } = await api.get('/admin/members/stats/');
    return data;
  },

  async memberAction(id, action, payload = {}) {
    const { data } = await api.post(`/admin/members/${id}/action/`, { action, payload });
    return data;
  },

  async bulkMemberAction(action, memberIds) {
    const { data } = await api.post('/admin/members/bulk-action/', {
      action,
      member_ids: memberIds,
    });
    return data;
  },

    async machineStats() {
    const { data } = await api.get('/admin/machines/stats/');
    return data;
  },

  async machineCategories() {
    const { data } = await api.get('/admin/machines/categories/');
    return data;
  },

    async revenueMonthly(months = 12) {
    const { data } = await api.get('/admin/finance/revenue-monthly/', {
      params: { months },
    });
    return data;
  },

  async revenueStreams() {
    const { data } = await api.get('/admin/finance/revenue-streams/');
    return data;
  },

  async topMembers(limit = 5) {
    const { data } = await api.get('/admin/finance/top-members/', {
      params: { limit },
    });
    return data;
  },

  async transactionDetail(id) {
    const { data } = await api.get(`/admin/finance/transactions/${id}/`);
    return data;
  },

    async trainersAdmin(params = {}) {
    const { data } = await api.get('/admin/trainers/', { params });
    return data;
  },

  async trainerStats() {
    const { data } = await api.get('/admin/trainers/stats/');
    return data;
  },

    async staffAdmin(params = {}) {
    const { data } = await api.get('/admin/staff/', { params });
    return data;
  },

  async staffStats() {
    const { data } = await api.get('/admin/staff/stats/');
    return data;
  },

    async settings() {
    const { data } = await api.get('/admin/settings/');
    return data;
  },

  async updateSettings(payload) {
    const { data } = await api.patch('/admin/settings/update/', payload);
    return data;
  },

  // ============================================
  // MACHINES
  // ============================================
  async machines(params = {}) {
    const { data } = await api.get('/admin/machines/', { params });
    return data;
  },

  async regenerateQR(exerciseId) {
    const { data } = await api.post(
      `/admin/machines/${exerciseId}/regenerate-qr/`
    );
    return data;
  },

  // ============================================
  // FINANCE
  // ============================================
  async financeOverview() {
    const { data } = await api.get('/admin/finance/overview/');
    return data;
  },

  async transactions(params = {}) {
    const { data } = await api.get('/admin/finance/transactions/', { params });
    return data;
  },

  // ============================================
  // ANALYTICS
  // ============================================
  async analyticsKPIs() {
    const { data } = await api.get('/admin/analytics/kpis/');
    return data;
  },

  async analyticsGrowth() {
    const { data } = await api.get('/admin/analytics/growth/');
    return data;
  },

  async aiInsights() {
    const { data } = await api.get('/admin/analytics/insights/');
    return data;
  },

  // ============================================
  // DASHBOARD EXTRAS
  // ============================================
  async flowAndRevenue() {
    const { data } = await api.get('/admin/flow-and-revenue/');
    return data;
  },

  async arenaHeatmap() {
    const { data } = await api.get('/admin/arena-heatmap/');
    return data;
  },

  async auditFeed(limit = 20) {
    const { data } = await api.get('/admin/audit-feed/', { params: { limit } });
    return data;
  },

    async facilityNodes() {
    const { data } = await api.get('/admin/facility-nodes/');
    return data;
  },

  // ============================================
  // REGISTRATIONS (public-site signups)
  // ============================================
  async registrations(params = {}) {
    const { data } = await api.get('/admin/registrations-api/registrations/', { params });
    return data;
  },

  async registration(id) {
    const { data } = await api.get(`/admin/registrations-api/registrations/${id}/`);
    return data;
  },

  async registrationStats() {
    const { data } = await api.get('/admin/registrations-api/registrations/stats/');
    return data;
  },

  async approveRegistration(id) {
    const { data } = await api.post(
      `/admin/registrations-api/registrations/${id}/approve/`
    );
    return data;
  },

  async rejectRegistration(id, reason = '') {
    const { data } = await api.post(
      `/admin/registrations-api/registrations/${id}/reject/`,
      { reason }
    );
    return data;
  },

  async bulkApproveRegistrations({ ids, onlyToday = false } = {}) {
    const body = { only_today: onlyToday };
    if (ids && ids.length) body.ids = ids;
    const { data } = await api.post(
      '/admin/registrations-api/registrations/bulk-approve/',
      body
    );
    return data;
  },

  // ============================================
  // MEMBER LOOKUP + GYM ENTRY
  // ============================================
  async lookupMember(iqama) {
    const { data } = await api.get('/admin/registrations-api/members/lookup/', {
      params: { iqama },
    });
    return data;
  },

  /** Resolve a scanned digital-pass QR ("SGPASS:..."). */
  async lookupMemberByPass(token) {
    const { data } = await api.get('/admin/registrations-api/members/lookup/', {
      params: { pass: token },
    });
    return data;
  },

  async faceVerify(memberId, { match, confidence }) {
    const { data } = await api.post(
      `/admin/registrations-api/members/${memberId}/face-verify/`,
      { match, confidence }
    );
    return data;
  },

  async checkInMember(memberId, { facility, zone, faceVerified } = {}) {
    const { data } = await api.post(
      `/admin/registrations-api/members/${memberId}/check-in/`,
      {
        facility: facility || 'Metro Station Core 01',
        zone: zone || '',
        face_verified: !!faceVerified,
      }
    );
    return data;
  },

  async checkOut(checkInId) {
    const { data } = await api.post(
      `/admin/registrations-api/check-ins/${checkInId}/check-out/`
    );
    return data;
  },
};