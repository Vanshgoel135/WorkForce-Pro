import api from './api';
import { Employee, PageResponse, AuthUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  },

  getById: async (employeeId: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${employeeId}`);
    return response.data;
  },

  getPage: async (page = 0, size = 10): Promise<PageResponse<Employee>> => {
    const response = await api.get<PageResponse<Employee>>('/employees/page', {
      params: { page, size },
    });
    return response.data;
  },

  create: async (employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', employee);
    return response.data;
  },

  update: async (employeeId: number, employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.put<Employee>(`/employees/${employeeId}`, employee);
    return response.data;
  },

  delete: async (employeeId: number): Promise<string> => {
    const response = await api.delete<string>(`/employees/${employeeId}`);
    return response.data;
  },

  searchByName: async (organizationId: number, name: string): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(
      `/employees/organization/${organizationId}/search`,
      { params: { name } }
    );
    return response.data;
  },

  sort: async (organizationId: number, field: string): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(
      `/employees/organization/${organizationId}/sort`,
      { params: { field } }
    );
    return response.data;
  },

  uploadPhoto: async (employeeId: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<string>(`/employees/${employeeId}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Authenticated Photo Fetching: returns a Blob Object URL with JWT attached
  getPhotoBlobUrl: async (employeeId: number): Promise<string> => {
    const response = await api.get(`/employees/${employeeId}/photo`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  },

  getPhotoUrl: (employeeId: number): string => {
    return `${API_BASE_URL}/employees/${employeeId}/photo`;
  },

  // Helper to discover current user's Employee record
  resolveCurrentEmployee: async (user: AuthUser): Promise<Employee | null> => {
    if (!user || !user.email) return null;

    const cacheKey = `workforce_emp_id_${user.email}`;
    const cachedId = localStorage.getItem(cacheKey);

    if (cachedId) {
      try {
        const emp = await employeeService.getById(Number(cachedId));
        if (emp && emp.email?.toLowerCase() === user.email.toLowerCase()) {
          return emp;
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    // If Admin or HR, we can list all employees and match email
    if (user.role === 'ADMIN' || user.role === 'HR') {
      try {
        const all = await employeeService.getAll();
        const match = all.find((e) => e.email?.toLowerCase() === user.email.toLowerCase());
        if (match && match.id) {
          localStorage.setItem(cacheKey, String(match.id));
          return match;
        }
      } catch {
        // Continue fallback
      }
    }

    // Fallback: probe IDs for Employee role
    for (let id = 1; id <= 30; id++) {
      try {
        const emp = await employeeService.getById(id);
        if (emp && emp.email?.toLowerCase() === user.email.toLowerCase()) {
          localStorage.setItem(cacheKey, String(emp.id));
          return emp;
        }
      } catch {
        // ID may not exist or belong to another org, continue
      }
    }

    return null;
  },
};

export default employeeService;
