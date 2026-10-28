import api from './api';
import { Salary } from '../types';

export const salaryService = {
  add: async (employeeId: number, salary: Partial<Salary>): Promise<Salary> => {
    const response = await api.post<Salary>(`/salary/employee/${employeeId}`, salary);
    return response.data;
  },

  getAll: async (): Promise<Salary[]> => {
    const response = await api.get<Salary[]>('/salary');
    return response.data;
  },

  getById: async (salaryId: number): Promise<Salary> => {
    const response = await api.get<Salary>(`/salary/${salaryId}`);
    return response.data;
  },

  getByEmployeeId: async (employeeId: number): Promise<Salary[]> => {
    const response = await api.get<Salary[]>(`/salary/employee/${employeeId}`);
    return response.data;
  },

  update: async (salaryId: number, salary: Partial<Salary>): Promise<Salary> => {
    const response = await api.put<Salary>(`/salary/${salaryId}`, salary);
    return response.data;
  },

  delete: async (salaryId: number): Promise<string> => {
    const response = await api.delete<string>(`/salary/${salaryId}`);
    return response.data;
  },
};

export default salaryService;
