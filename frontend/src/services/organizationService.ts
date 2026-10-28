import api from './api';
import { Organization } from '../types';

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const response = await api.get<Organization[]>('/organization');
    return response.data;
  },

  getById: async (id: number): Promise<Organization> => {
    const response = await api.get<Organization>(`/organization/${id}`);
    return response.data;
  },

  create: async (organization: Partial<Organization>): Promise<Organization> => {
    const response = await api.post<Organization>('/organization', organization);
    return response.data;
  },

  update: async (id: number, organization: Partial<Organization>): Promise<Organization> => {
    const response = await api.put<Organization>(`/organization/${id}`, organization);
    return response.data;
  },

  delete: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/organization/${id}`);
    return response.data;
  },
};

export default organizationService;
