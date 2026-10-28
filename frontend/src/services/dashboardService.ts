import api from './api';
import { DashboardDTO } from '../types';

export const dashboardService = {
  getDashboard: async (): Promise<DashboardDTO> => {
    const response = await api.get<DashboardDTO>('/dashboard');
    return response.data;
  },
};

export default dashboardService;
