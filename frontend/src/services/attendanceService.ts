import api from './api';
import { Attendance } from '../types';

export const attendanceService = {
  checkIn: async (employeeId: number): Promise<Attendance> => {
    const response = await api.post<Attendance>(`/attendance/checkin/${employeeId}`);
    return response.data;
  },

  checkOut: async (employeeId: number): Promise<Attendance> => {
    const response = await api.post<Attendance>(`/attendance/checkout/${employeeId}`);
    return response.data;
  },

  getAll: async (): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>('/attendance');
    return response.data;
  },

  getById: async (attendanceId: number): Promise<Attendance> => {
    const response = await api.get<Attendance>(`/attendance/${attendanceId}`);
    return response.data;
  },

  getByEmployeeId: async (employeeId: number): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>(`/attendance/employee/${employeeId}`);
    return response.data;
  },
};

export default attendanceService;
