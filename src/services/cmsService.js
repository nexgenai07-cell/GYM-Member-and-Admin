import api from './api';

export const cmsService = {
  async publicArticles(params = {}) {
    const { data } = await api.get('/cms/articles/', { params });
    return data;
  },

  async publicArticle(slug) {
    const { data } = await api.get(`/cms/articles/${slug}/`);
    return data;
  },

  async adminArticles(params = {}) {
    const { data } = await api.get('/cms/admin/articles/', { params });
    return data;
  },

  async stats() {
    const { data } = await api.get('/cms/stats/');
    return data;
  },

  async createArticle(payload) {
    const { data } = await api.post('/cms/admin/articles/create/', payload);
    return data;
  },

  async updateArticle(id, payload) {
    const { data } = await api.patch(`/cms/admin/articles/${id}/`, payload);
    return data;
  },

  async deleteArticle(id) {
    await api.delete(`/cms/admin/articles/${id}/`);
  },
};