import api from './api';
import { LoginRequest, LoginResponse, JwtPayload, AuthUser } from '../types';

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT token', e);
    return null;
  }
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<{ token: string; user: AuthUser }> => {
    // Real call to Spring Boot backend POST /auth/login
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { token } = response.data;

    if (!token) {
      throw new Error('Authentication failed: No token returned from server.');
    }

    const payload = parseJwt(token);
    if (!payload) {
      throw new Error('Invalid token structure received from server');
    }

    const user: AuthUser = {
      email: payload.sub,
      role: payload.role,
      organizationId: payload.organizationId,
      token,
    };

    localStorage.setItem('workforce_token', token);
    localStorage.setItem('workforce_user', JSON.stringify(user));

    return { token, user };
  },

  getCurrentUser: (): AuthUser | null => {
    const userStr = localStorage.getItem('workforce_user');
    const token = localStorage.getItem('workforce_token');
    if (!userStr || !token) return null;

    try {
      const payload = parseJwt(token);
      if (!payload || payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('workforce_token');
        localStorage.removeItem('workforce_user');
        return null;
      }
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('workforce_token');
    localStorage.removeItem('workforce_user');
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('workforce_token');
    if (!token) return false;
    const payload = parseJwt(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  },
};

export default authService;
