import api from './api';

export const catalogService = {
  async trainers(params = {}) {
    const { data } = await api.get('/catalog/trainers/', { params });
    return data;
  },

  async trainer(id) {
    const { data } = await api.get(`/catalog/trainers/${id}/`);
    return data;
  },

  async courses(params = {}) {
    const { data } = await api.get('/catalog/courses/', { params });
    return data;
  },

  async course(id) {
    const { data } = await api.get(`/catalog/courses/${id}/`);
    return data;
  },

  async courseCategories() {
    const { data } = await api.get('/catalog/courses/categories/');
    return data;
  },

  async enrollments() {
    const { data } = await api.get('/catalog/enrollments/');
    return data;
  },

  async enroll(courseId) {
    const { data } = await api.post('/catalog/enrollments/', { course_id: courseId });
    return data;
  },

  async completeModule(enrollmentId, moduleId) {
    const { data } = await api.post(
      `/catalog/enrollments/${enrollmentId}/modules/${moduleId}/complete/`
    );
    return data;
  },

  /** Undo a day that was marked done by mistake. */
  async uncompleteModule(enrollmentId, moduleId) {
    const { data } = await api.delete(
      `/catalog/enrollments/${enrollmentId}/modules/${moduleId}/complete/`
    );
    return data;
  },

  async mySessions() {
    const { data } = await api.get('/catalog/sessions/');
    return data;
  },

  /** Free 60-minute slots for one date (YYYY-MM-DD), from the trainer's availability. */
  async trainerSlots(trainerId, date) {
    const { data } = await api.get(`/catalog/trainers/${trainerId}/slots/`, { params: { date } });
    return data;
  },
  /** Reserves the slot (status pending_payment); pay with paymentsService.checkout. */
  async bookSession(payload) {
    const { data } = await api.post('/catalog/sessions/', payload);
    return data;
  },

  async cancelSession(id) {
    const { data } = await api.post(`/catalog/sessions/${id}/cancel/`);
    return data;
  },

  async reviewCourse(courseId, payload) {
    const { data } = await api.post(`/catalog/courses/${courseId}/review/`, payload);
    return data;
  },

  async reviewTrainer(trainerId, payload) {
    const { data } = await api.post(`/catalog/trainers/${trainerId}/review/`, payload);
    return data;
  },

  // NEW: Course player
  async coursePlayer(courseId) {
    const { data } = await api.get(`/catalog/courses/${courseId}/player/`);
    return data;
  },

  async nextWorkout() {
    const { data } = await api.get('/catalog/next-workout/');
    return data;
  },
};