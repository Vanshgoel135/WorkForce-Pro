# WorkForce Pro — Enterprise HRMS & SaaS Platform (Frontend)

WorkForce Pro is an enterprise-grade Multi-Tenant Human Resource Management System (HRMS) and SaaS application. This frontend is built with React 18/19, TypeScript, Vite, Material UI (MUI v9), React Query, and Framer Motion, engineered to deliver a seamless commercial SaaS experience inspired by modern platforms like Rippling, Deel, Linear, and Stripe.

---

## 🚨 Backend Isolation Compliance

> **ABSOLUTE RULE ADHERED TO:**  
> The Spring Boot 3 backend in `src/` remained **100% untouched**.  
> - No Java files, controllers, services, repositories, entities, or DTOs were altered.  
> - No Spring Security, JWT, or database migrations were modified.  
> - All communication occurs purely over standard REST APIs connected to the backend.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Tooling** | React 18/19, TypeScript, Vite |
| **Component Library & Design System** | Material UI (MUI v9), `@emotion/react`, `@emotion/styled` |
| **Icons** | `@mui/icons-material` |
| **Data Fetching & Caching** | Axios, `@tanstack/react-query` (React Query) |
| **Routing** | `react-router-dom` v6 |
| **Forms & Validation** | `react-hook-form`, `yup`, `@hookform/resolvers` |
| **Animations & Transitions** | `framer-motion` |
| **Charts & Data Visualization** | `recharts` |
| **Date Manipulation** | `dayjs` |
| **Notifications & Toasts** | `react-toastify` |
| **Markdown Rendering** | `react-markdown` |

---

## 🌐 API Mapping & Integration Matrix

Every single backend controller and endpoint has a dedicated TypeScript service and UI module:

| Backend Controller | HTTP Method & Endpoint | Frontend Service | UI Page / Feature |
|---|---|---|---|
| `AuthController` | `POST /auth/login` | `authService.login()` | Login Page (`/login`) & Session Persistence |
| `DashboardController` | `GET /dashboard` | `dashboardService.getDashboardData()` | Executive Dashboard (`/`) |
| `EmployeeController` | `GET /employees` | `employeeService.getAllEmployees()` | Employee Directory (`/employees`) |
| `EmployeeController` | `GET /employees/{id}` | `employeeService.getEmployeeById()` | Employee Details & Profile (`/employees/:id`) |
| `EmployeeController` | `POST /employees` | `employeeService.createEmployee()` | Add Employee Modal |
| `EmployeeController` | `PUT /employees/{id}` | `employeeService.updateEmployee()` | Edit Employee Modal |
| `EmployeeController` | `DELETE /employees/{id}` | `employeeService.deleteEmployee()` | Delete Employee with Confirmation Dialog |
| `EmployeeController` | `POST /employees/{id}/photo` | `employeeService.uploadPhoto()` | Photo Upload Dialog (Multipart form data) |
| `DepartmentController` | `GET /departments` | `departmentService.getAllDepartments()` | Department Management (`/departments`) |
| `DepartmentController` | `GET /departments/{id}` | `departmentService.getDepartmentById()` | Department Details |
| `DepartmentController` | `POST /departments` | `departmentService.createDepartment()` | Create Department Modal |
| `DepartmentController` | `PUT /departments/{id}` | `departmentService.updateDepartment()` | Edit Department Modal |
| `DepartmentController` | `DELETE /departments/{id}` | `departmentService.deleteDepartment()` | Delete Department Modal |
| `AttendanceController` | `POST /attendance/check-in` | `attendanceService.checkIn()` | One-Click Daily Attendance Check-In |
| `AttendanceController` | `POST /attendance/check-out` | `attendanceService.checkOut()` | One-Click Daily Attendance Check-Out |
| `AttendanceController` | `GET /attendance/my` | `attendanceService.getMyAttendance()` | Employee Self-Service Attendance History |
| `AttendanceController` | `GET /attendance/all` | `attendanceService.getAllAttendance()` | Organization-wide Attendance Logs & Auditing |
| `LeaveRequestController` | `POST /leaves/apply` | `leaveService.applyLeave()` | Apply Leave Modal (`/leaves`) |
| `LeaveRequestController` | `PUT /leaves/{id}/approve` | `leaveService.approveLeave()` | Management Leave Approval Action |
| `LeaveRequestController` | `PUT /leaves/{id}/reject` | `leaveService.rejectLeave()` | Management Leave Rejection Action |
| `LeaveRequestController` | `GET /leaves/my` | `leaveService.getMyLeaves()` | Employee Leave Balances & History |
| `LeaveRequestController` | `GET /leaves/all` | `leaveService.getAllLeaves()` | Administrative Leave Approval Matrix |
| `SalaryController` | `GET /salary/all` | `salaryService.getAllSalaries()` | Payroll & Compensation Ledger (`/salary`) |
| `SalaryController` | `GET /salary/employee/{id}` | `salaryService.getEmployeeSalary()` | Employee Salary Statement Breakdown |
| `SalaryController` | `POST /salary` | `salaryService.createOrUpdateSalary()` | Process & Adjust Payroll Modal |
| `OrganizationController` | `GET /organizations/my` | `organizationService.getMyOrganization()` | Organization Profile & Tenant Info (`/organization`) |
| `OrganizationController` | `PUT /organizations/my` | `organizationService.updateMyOrganization()` | Update Company Settings & Tenant Metadata |
| `AiController` | `POST /ai/chat` | `aiService.chatWithAi()` | Floating AI Assistant & Dedicated AI Page (`/ai-assistant`) |

---

## 🎨 Enterprise UI & Design Features

- **Theme & Appearance:** Curated Light & Dark themes with HSL tailoring, glassmorphic headers, smooth drawer navigation, and persistence via `localStorage`.
- **Command Palette (`Ctrl+K`):** Global quick-action overlay allowing users to instantly jump to any page or trigger actions.
- **Enterprise Dashboard:**
  - Dynamic KPI Stat Cards (Total Staff, Departments, Present Today, On Leave, Monthly Payroll).
  - Attendance Rate Gauge & Visual Leave Status Distribution (Recharts Pie & Bar charts).
  - Quick Actions toolbar for rapid attendance check-in, leave application, and employee onboarding.
- **Floating AI Assistant:**
  - Multi-tenant aware conversational HR intelligence powered exclusively by `POST /ai/chat`.
  - Rich Markdown rendering with code blocks, structured responses, typing animation, copy-to-clipboard, and history clearing.
- **Feedback & States:** Full skeleton loaders (`LoadingSkeleton`), polished empty states (`EmptyState`), network error states (`ErrorState`), and confirmation dialogs (`ConfirmDialog`).
- **Responsive Layout:** Responsive across 4K displays, desktops, laptops, tablets, and mobile devices with collapsible navigation drawers.

---

## 🔐 Authentication & Security

- **JWT Session Persistence:** Stored in `localStorage` under `workforce_token`.
- **Axios Interceptor:** Automatically attaches `Authorization: Bearer <token>` to all outbound API requests.
- **401 Unauthorized Interceptor:** Triggers automatic session clearance, toast notification, and redirection to `/login`.
- **Role-Based Protected Routes:** Admin, HR, Manager, and Employee role matrix protection for sensitive operations.

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Running Spring Boot backend on `http://localhost:8080`

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Verify `.env`:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 🏗️ Production Build

To test and compile the production bundle:
```bash
npm run build
```
The optimized assets will be emitted in `frontend/dist/`.

To preview the built production bundle:
```bash
npm run preview
```

---

## ☁️ Deployment Guide (Vercel & Render Ready)

### Vercel Deployment:
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. In the Project Settings -> **Environment Variables**, add:
   ```env
   VITE_API_URL=https://your-spring-boot-backend.onrender.com
   ```
5. `vercel.json` is preconfigured to handle client-side routing rewrites (`/(.*) -> /index.html`).

---

## 📂 Project Directory Structure

```text
frontend/
├── dist/                          # Compiled production bundle
├── public/                        # Static assets & brand icons
├── src/
│   ├── components/
│   │   ├── ai/                    # Floating AI Assistant widget
│   │   ├── common/                # Reusable StatCards, StatusBadges, Skeletons, Modals
│   │   └── layout/                # Sidebar, Header, CommandPalette, MainLayout
│   ├── context/                   # AuthContext, NotificationContext
│   ├── pages/
│   │   ├── ai/                    # Full-page AI HR Advisor
│   │   ├── attendance/            # Attendance Check-In & History
│   │   ├── auth/                  # Login & Forgot Password
│   │   ├── dashboard/             # Executive HR Dashboard & Analytics
│   │   ├── departments/           # Department Management
│   │   ├── employees/             # Employee Directory & Profile Details
│   │   ├── error/                 # 401 Unauthorized & 404 NotFound
│   │   ├── leaves/                # Leave Requests & Approval Matrix
│   │   ├── organization/          # Company Profile & Tenant Settings
│   │   ├── profile/               # User Profile & Security
│   │   ├── salary/                # Payroll Ledger & Salary Management
│   │   ├── settings/              # System & Tenant Preferences
│   │   └── users/                 # User Accounts & Role Permissions
│   ├── services/                  # Axios REST API connectors for all controllers
│   ├── theme/                     # Light & Dark theme definitions and ThemeProvider
│   ├── types/                     # TypeScript schemas matching backend DTOs & entities
│   ├── App.tsx                    # Routing tree & Providers
│   └── main.tsx                   # Application Entrypoint
├── .env                           # Local environment config
├── .env.production                # Production deployment config
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # TypeScript compiler options
├── vercel.json                    # Single Page Application rewrite rules
└── vite.config.ts                 # Vite bundler configuration
```
