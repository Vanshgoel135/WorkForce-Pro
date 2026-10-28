import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import dashboardService from '../../services/dashboardService';
import employeeService from '../../services/employeeService';
import leaveService from '../../services/leaveService';
import attendanceService from '../../services/attendanceService';
import departmentService from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Queries
  const {
    data: dashboardStats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getDashboard(),
  });

  const { data: employees = [], isLoading: isEmployeesLoading } = useQuery({
    queryKey: ['dashboard-employees'],
    queryFn: () => employeeService.getAll(),
  });

  const { data: leaveRequests = [], isLoading: isLeavesLoading } = useQuery({
    queryKey: ['dashboard-leaves'],
    queryFn: () => leaveService.getAll(),
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['dashboard-departments'],
    queryFn: () => departmentService.getAll(),
  });

  // Calculate detailed leave status breakdown from actual leave requests
  const pendingLeavesCount = leaveRequests.filter(
    (l) => l.status?.toLowerCase() === 'pending'
  ).length;
  const approvedLeavesCount = leaveRequests.filter(
    (l) => l.status?.toLowerCase() === 'approved'
  ).length;
  const rejectedLeavesCount = leaveRequests.filter(
    (l) => l.status?.toLowerCase() === 'rejected'
  ).length;

  // Chart data: Attendance & Leave Overview
  const attendanceBreakdown = [
    { name: 'Present Today', value: dashboardStats?.presentToday || 0, color: '#10b981' },
    { name: 'On Leave', value: dashboardStats?.onLeave || 0, color: '#f59e0b' },
  ];

  // Chart data: Leave distribution
  const leaveDistributionData = [
    { name: 'Approved', count: approvedLeavesCount, fill: '#10b981' },
    { name: 'Pending', count: pendingLeavesCount, fill: '#f59e0b' },
    { name: 'Rejected', count: rejectedLeavesCount, fill: '#ef4444' },
  ];

  // Chart data: Department headcount breakdown
  const departmentData = departments.slice(0, 6).map((dept) => {
    const count = employees.filter((e) => e.department?.id === dept.id).length;
    return {
      name: dept.name,
      employees: count,
    };
  });

  const recentEmployees = employees.slice(-5).reverse();
  const recentLeaves = leaveRequests.slice(-5).reverse();

  if (isStatsLoading && isEmployeesLoading) {
    return <LoadingSkeleton rows={4} type="cards" />;
  }

  if (statsError) {
    return (
      <ErrorState
        title="Failed to Load Dashboard Metrics"
        message="Unable to fetch workforce analytics from the backend API. Please ensure your session is active."
        onRetry={refetchStats}
      />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Executive HRMS Dashboard"
        subtitle={`Welcome back, ${user?.email}. Real-time analytics for Organization #${user?.organizationId || 1}.`}
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<HowToRegOutlinedIcon />}
              onClick={() => navigate('/attendance')}
              sx={{ borderRadius: 2.5 }}
            >
              Attendance Check-In
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddOutlinedIcon />}
              onClick={() => navigate('/employees')}
              sx={{ borderRadius: 2.5 }}
            >
              Add Employee
            </Button>
          </Box>
        }
      />

      {/* Top Metric KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            title="Total Employees"
            value={dashboardStats?.totalEmployees ?? employees.length}
            subtitle="Active on payroll"
            icon={<PeopleOutlineIcon />}
            color="#4f46e5"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            title="Departments"
            value={dashboardStats?.totalDepartments ?? departments.length}
            subtitle="Operating units"
            icon={<BusinessOutlinedIcon />}
            color="#06b6d4"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            title="Present Today"
            value={dashboardStats?.presentToday ?? 0}
            subtitle="Checked-in today"
            icon={<CheckCircleOutlineIcon />}
            color="#10b981"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            title="Pending Leaves"
            value={pendingLeavesCount}
            subtitle={`${approvedLeavesCount} approved, ${rejectedLeavesCount} rejected`}
            icon={<EventBusyOutlinedIcon />}
            color="#f59e0b"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            title="Monthly Payroll"
            value={
              dashboardStats?.totalSalary
                ? `$${dashboardStats.totalSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '$0.00'
            }
            subtitle="Disbursed net salary"
            icon={<PaymentsOutlinedIcon />}
            color="#8b5cf6"
            loading={isStatsLoading}
          />
        </Grid>
      </Grid>

      {/* Quick Actions Row */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3.5,
          bgcolor: 'action.hover',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 1 }}>
          ⚡ Fast Operations:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<HowToRegOutlinedIcon />}
            onClick={() => navigate('/attendance')}
          >
            Check In / Check Out
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EventBusyOutlinedIcon />}
            onClick={() => navigate('/leaves')}
          >
            Apply Leave
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/departments')}
          >
            New Department
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PaymentsOutlinedIcon />}
            onClick={() => navigate('/salary')}
          >
            Record Salary
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<SmartToyOutlinedIcon />}
            onClick={() => navigate('/ai-assistant')}
          >
            Ask AI Assistant
          </Button>
        </Box>
      </Paper>

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Department Headcount Bar Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Workforce by Department
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Active employee allocation across organizational departments
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/departments')}
                >
                  View All
                </Button>
              </Box>

              <Box sx={{ width: '100%', height: 260 }}>
                {departmentData.length === 0 ? (
                  <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No department data available.
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: 'none',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                        }}
                      />
                      <Bar dataKey="employees" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance & Leave Ratio Donut Chart */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Today's Attendance Status
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Present vs On-leave distribution
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {attendanceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Tables */}
      <Grid container spacing={3}>
        {/* Recent Employees Table */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Hires & Staff
                </Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/employees')}>
                  Directory
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2.5 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No employee records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentEmployees.map((emp) => (
                        <TableRow
                          key={emp.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                                {emp.name?.charAt(0) || 'E'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {emp.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {emp.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{emp.department?.name || 'General'}</TableCell>
                          <TableCell>
                            <StatusBadge status={emp.role} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="caption">
                              {emp.dateOfJoining || 'Recent'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Leave Requests Table */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Leave Requests
                </Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/leaves')}>
                  Manage Leaves
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2.5 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentLeaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No leave applications recorded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentLeaves.map((leave) => (
                        <TableRow key={leave.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {leave.employee?.name || `Employee #${leave.employee?.id || '—'}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              {leave.fromDate} → {leave.toDate}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                              {leave.reason}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <StatusBadge status={leave.status} size="small" />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
