import api from './api';

export const workoutsService = {
  async list() {
    const { data } = await api.get('/workouts/');
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/workouts/${id}/`);
    return data;
  },

  async start(payload = {}) {
    const { data } = await api.post('/workouts/', payload);
    return data;
  },

  async complete(id) {
    const { data } = await api.post(`/workouts/${id}/complete/`);
    return data;
  },

  async addExercise(workoutId, payload) {
    const { data } = await api.post(`/workouts/${workoutId}/exercises/`, payload);
    return data;
  },

  async logSet(workoutExerciseId, payload) {
    const { data } = await api.post(
      `/workouts/exercises/${workoutExerciseId}/sets/`,
      payload
    );
    return data;
  },

  async prs() {
    const { data } = await api.get('/workouts/prs/');
    return data;
  },

  async stats() {
    const { data } = await api.get('/workouts/stats/');
    return data;
  },

  /** A machine's videos (Basic free · Advanced · Premium); locked ones come without a link. */
  async exerciseVideos(exerciseId) {
    const { data } = await api.get(`/workouts/exercises/${exerciseId}/videos/`);
    return data;
  },

  async exercises(params = {}) {
    const { data } = await api.get('/workouts/exercises/', { params });
    return data;
  },

  async exerciseByQR(qrTag) {
    const { data } = await api.get(`/workouts/exercises/qr/${qrTag}/`);
    return data;
  },

  async quickLogSet(exerciseId, payload) {
  const { data } = await api.post(
    `/workouts/exercises/${exerciseId}/quick-log/`,
    payload
  );
  return data;
},

  async templates(params = {}) {
    const { data } = await api.get('/workouts/templates/', { params });
    return data;
  },
};