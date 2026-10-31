import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('workforce_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401, 403, 500 and format error messages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    let errorMessage = 'An unexpected error occurred';

    if (status === 401) {
      // 401 Unauthorized: Session expired or invalid token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('workforce_token');
        localStorage.removeItem('workforce_user');
        window.location.href = '/login?session_expired=true';
      }
      errorMessage = 'Session expired or unauthorized. Please log in again.';
    } else if (status === 403) {
      // 403 Forbidden: Insufficient permissions for role
      errorMessage = 'Access Denied (403): You do not have the required permissions for this action.';
    } else if (status === 500) {
      // 500 Internal Server Error
      errorMessage = 'Internal Server Error (500): The backend server encountered an unexpected condition. Please try again.';
    }

    // Extract detailed error messages from backend response if available
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (typeof error.response.data === 'object') {
        const data = error.response.data as Record<string, any>;
        // Spring validation errors format: { fieldName: "validation message", ... }
        if (!data.message && !data.error && Object.keys(data).length > 0) {
          const fieldErrors = Object.entries(data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
          errorMessage = fieldErrors;
        } else {
          errorMessage = data.message || data.error || JSON.stringify(data);
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    const customError = new Error(errorMessage) as Error & { status?: number; originalError?: AxiosError };
    customError.status = status;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

export default api;
