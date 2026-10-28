import api from './api';
import { LeaveRequest } from '../types';

export const leaveService = {
  apply: async (employeeId: number, leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    const response = await api.post<LeaveRequest>(`/leave/employee/${employeeId}`, leaveRequest);
    return response.data;
  },

  getAll: async (): Promise<LeaveRequest[]> => {
    const response = await api.get<LeaveRequest[]>('/leave');
    return response.data;
  },

  getById: async (leaveId: number): Promise<LeaveRequest> => {
    const response = await api.get<LeaveRequest>(`/leave/${leaveId}`);
    return response.data;
  },

  approve: async (leaveId: number): Promise<LeaveRequest> => {
    const response = await api.put<LeaveRequest>(`/leave/approve/${leaveId}`);
    return response.data;
  },

  reject: async (leaveId: number): Promise<LeaveRequest> => {
    const response = await api.put<LeaveRequest>(`/leave/reject/${leaveId}`);
    return response.data;
  },

  getByEmployeeId: async (employeeId: number): Promise<LeaveRequest[]> => {
    const response = await api.get<LeaveRequest[]>(`/leave/employee/${employeeId}`);
    return response.data;
  },
};

export default leaveService;
