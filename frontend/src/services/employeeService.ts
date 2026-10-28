import api from './api';
import { Employee, PageResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
    const response = await api.get<PageResponse<Employee>>(`/employees/page`, {
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

  getPhotoUrl: (employeeId: number): string => {
    return `${API_BASE_URL}/employees/${employeeId}/photo`;
  },
};

export default employeeService;
