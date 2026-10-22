import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://gym-backend-xi-seven.vercel.app/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Account must change its password (e.g. a stale cached user after an admin reset):
    // the API refuses everything else, so go straight to the change-password screen.
    if (
      error.response?.status === 403 &&
      error.response.data?.code === 'password_change_required' &&
      window.location.pathname !== '/dashboard/change-password'
    ) {
      window.location.assign('/dashboard/change-password');
      return Promise.reject(error);
    }

    // A staff screen refused: the stored sign-in is no longer a staff account (usually a member
    // signed in in another tab of this browser — both portals share one sign-in). AuthContext
    // re-checks who is signed in and the route guards move the screen along.
    if (error.response?.status === 403 && (originalRequest?.url || '').startsWith('/admin/')) {
      window.dispatchEvent(new Event('auth:forbidden'));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // No refresh token — logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;