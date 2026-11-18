import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.endsWith('/admin/login') || requestUrl.endsWith('/admin/logout');
      if (
        !isAuthEndpoint &&
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/admin/dashboard')
      ) {
        window.location.replace('/admin');
      }
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || 'Unexpected API error.';
    return Promise.reject(new Error(message));
  }
);

export default api;
