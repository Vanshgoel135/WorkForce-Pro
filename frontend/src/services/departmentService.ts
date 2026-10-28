import api from './api';
import { Department } from '../types';

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>('/departments');
    return response.data;
  },

  getById: async (departmentId: number): Promise<Department> => {
    const response = await api.get<Department>(`/departments/${departmentId}`);
    return response.data;
  },

  create: async (department: Partial<Department>): Promise<Department> => {
    const response = await api.post<Department>('/departments', department);
    return response.data;
  },

  update: async (departmentId: number, department: Partial<Department>): Promise<Department> => {
    const response = await api.put<Department>(`/departments/${departmentId}`, department);
    return response.data;
  },

  delete: async (departmentId: number): Promise<Department> => {
    const response = await api.delete<Department>(`/departments/${departmentId}`);
    return response.data;
  },
};

export default departmentService;
