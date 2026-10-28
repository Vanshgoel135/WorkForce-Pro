export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface Organization {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Department {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  organization?: Organization;
  employees?: Employee[];
}

export interface Employee {
  id?: number;
  name: string;
  email: string;
  password?: string;
  salary?: number;
  role?: Role;
  profilePhoto?: string;
  dateOfJoining?: string;
  department?: Department | null;
  organization?: Organization;
}

export interface Attendance {
  id?: number;
  employee?: Employee;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  organization?: Organization;
}

export interface LeaveRequest {
  id?: number;
  employee?: Employee;
  fromDate: string;
  toDate: string;
  reason: string;
  status?: string; // 'Pending' | 'Approved' | 'Rejected'
  organization?: Organization;
}

export interface Salary {
  id?: number;
  employee?: Employee;
  basicSalary: number;
  bonus: number;
  deduction: number;
  netSalary?: number;
  payDate: string;
  organization?: Organization;
}

export interface DashboardDTO {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  onLeave: number;
  totalSalary: number;
}

export interface LoginRequest {
  username: string; // backend matches username with email
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface JwtPayload {
  sub: string; // email
  role: Role;
  organizationId: number;
  exp: number;
  iat: number;
}

export interface AuthUser {
  email: string;
  role: Role;
  organizationId: number;
  token: string;
  employeeId?: number;
  name?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
