import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailsPage from './pages/employees/EmployeeDetailsPage';
import DepartmentListPage from './pages/departments/DepartmentListPage';
import AttendancePage from './pages/attendance/AttendancePage';
import LeaveListPage from './pages/leaves/LeaveListPage';
import SalaryListPage from './pages/salary/SalaryListPage';
import OrganizationPage from './pages/organization/OrganizationPage';
import UsersPage from './pages/users/UsersPage';
import PermissionsPage from './pages/users/PermissionsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AiAssistantPage from './pages/ai/AiAssistantPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';
import NotFoundPage from './pages/error/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                {/* 1. Public Corporate Website (Vensure-Style Landing Page) */}
                <Route path="/" element={<LandingPage />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/401" element={<UnauthorizedPage />} />

                {/* 2. Enterprise HRMS Dashboard (Protected Routes) */}
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/employees" element={<EmployeeListPage />} />
                  <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
                  <Route path="/departments" element={<DepartmentListPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/leaves" element={<LeaveListPage />} />
                  <Route path="/salary" element={<SalaryListPage />} />
                  <Route path="/organization" element={<OrganizationPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/ai-assistant" element={<AiAssistantPage />} />
                </Route>

                {/* 404 Catch All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>

            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
