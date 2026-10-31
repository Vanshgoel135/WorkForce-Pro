import React from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PageHeader from '../../components/common/PageHeader';

interface PermissionRow {
  module: string;
  action: string;
  endpoint: string;
  admin: boolean;
  hr: boolean;
  employee: boolean;
}

export const PermissionsPage: React.FC = () => {
  const permissions: PermissionRow[] = [
    {
      module: 'Executive Dashboard',
      action: 'View organization KPIs & analytics',
      endpoint: 'GET /dashboard',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Employee Directory',
      action: 'List all employees',
      endpoint: 'GET /employees',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Employee Directory',
      action: 'View specific employee profile',
      endpoint: 'GET /employees/{id}',
      admin: true,
      hr: true,
      employee: true,
    },
    {
      module: 'Employee Directory',
      action: 'Create new employee profile',
      endpoint: 'POST /employees',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Employee Directory',
      action: 'Update employee information',
      endpoint: 'PUT /employees/{id}',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Employee Directory',
      action: 'Delete employee record',
      endpoint: 'DELETE /employees/{id}',
      admin: true,
      hr: false,
      employee: false,
    },
    {
      module: 'Employee Photos',
      action: 'Upload profile photo',
      endpoint: 'POST /employees/{id}/upload-photo',
      admin: true,
      hr: true,
      employee: true,
    },
    {
      module: 'Departments',
      action: 'View department list',
      endpoint: 'GET /departments',
      admin: true,
      hr: true,
      employee: true,
    },
    {
      module: 'Departments',
      action: 'Add / Update department',
      endpoint: 'POST, PUT /departments',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Departments',
      action: 'Delete department',
      endpoint: 'DELETE /departments/{id}',
      admin: true,
      hr: false,
      employee: false,
    },
    {
      module: 'Attendance',
      action: 'Biometric Check-In & Check-Out',
      endpoint: 'POST /attendance/checkin, checkout',
      admin: true,
      hr: true,
      employee: true,
    },
    {
      module: 'Attendance',
      action: 'View organization attendance logs',
      endpoint: 'GET /attendance',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Attendance',
      action: 'View personal attendance history',
      endpoint: 'GET /attendance/employee/{id}',
      admin: true,
      hr: true,
      employee: true,
    },
    {
      module: 'Leave Management',
      action: 'Apply for time off',
      endpoint: 'POST /leave/employee/{id}',
      admin: true,
      hr: true,
      employee: true,
    },
    {
      module: 'Leave Management',
      action: 'Review all leave requests',
      endpoint: 'GET /leave',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Leave Management',
      action: 'Approve or Reject leave',
      endpoint: 'PUT /leave/approve, reject',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Payroll & Salary',
      action: 'View salary slips & organization total',
      endpoint: 'GET /salary',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Payroll & Salary',
      action: 'Disburse / update salary slips',
      endpoint: 'POST, PUT /salary',
      admin: true,
      hr: true,
      employee: false,
    },
    {
      module: 'Payroll & Salary',
      action: 'Delete salary record',
      endpoint: 'DELETE /salary/{id}',
      admin: true,
      hr: false,
      employee: false,
    },
    {
      module: 'Organization',
      action: 'Update organization profile & identity',
      endpoint: 'PUT /organization/{id}',
      admin: true,
      hr: false,
      employee: false,
    },
    {
      module: 'AI Workforce Assistant',
      action: 'Conversational HR & policy intelligence',
      endpoint: 'POST /ai/chat',
      admin: true,
      hr: true,
      employee: true,
    },
  ];

  const renderBadge = (allowed: boolean) => {
    return allowed ? (
      <Chip
        icon={<CheckIcon sx={{ fontSize: '0.85rem !important' }} />}
        label="Allowed"
        size="small"
        sx={{
          bgcolor: 'rgba(16, 185, 129, 0.12)',
          color: '#10b981',
          fontWeight: 700,
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      />
    ) : (
      <Chip
        icon={<CloseIcon sx={{ fontSize: '0.85rem !important' }} />}
        label="Denied"
        size="small"
        sx={{
          bgcolor: 'action.hover',
          color: 'text.disabled',
          fontWeight: 600,
        }}
      />
    );
  };

  return (
    <Box>
      <PageHeader
        title="Role & Permissions Matrix"
        subtitle="Comprehensive enforcement of Spring Security Method-level RBAC rules across all endpoints."
      />

      {/* Role Definitions Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              borderColor: 'primary.main',
              bgcolor: 'rgba(79, 70, 229, 0.03)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
              ADMIN
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Full administrative jurisdiction: delete privileges, user role assignment, salary deletion, and tenant profile updates.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              borderColor: 'secondary.main',
              bgcolor: 'rgba(6, 182, 212, 0.03)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}>
              HR
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Human resources manager: employee onboarding, leave approvals/rejections, salary slip records, and dashboard monitoring.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              EMPLOYEE
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Standard team member: daily check-in / check-out, personal leave applications, photo upload, and personal salary views.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Permissions Matrix Table */}
      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Module</TableCell>
                <TableCell>Action Description</TableCell>
                <TableCell>Backend Endpoint</TableCell>
                <TableCell align="center">ADMIN</TableCell>
                <TableCell align="center">HR</TableCell>
                <TableCell align="center">EMPLOYEE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((perm, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{perm.module}</TableCell>
                  <TableCell>{perm.action}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {perm.endpoint}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{renderBadge(perm.admin)}</TableCell>
                  <TableCell align="center">{renderBadge(perm.hr)}</TableCell>
                  <TableCell align="center">{renderBadge(perm.employee)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default PermissionsPage;
