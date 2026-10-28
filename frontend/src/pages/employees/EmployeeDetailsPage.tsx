import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import employeeService from '../../services/employeeService';
import attendanceService from '../../services/attendanceService';
import leaveService from '../../services/leaveService';
import salaryService from '../../services/salaryService';
import { useAuth } from '../../context/AuthContext';

export const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const employeeId = Number(id);

  const [activeTab, setActiveTab] = useState(0);

  // Leave Modal
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  // Salary Modal
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    basicSalary: '',
    bonus: '0',
    deduction: '0',
    payDate: new Date().toISOString().split('T')[0],
  });

  // Queries
  const {
    data: employee,
    isLoading: isEmpLoading,
    error: empError,
    refetch: refetchEmp,
  } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeeService.getById(employeeId),
    enabled: Boolean(employeeId),
  });

  const { data: attendanceHistory = [] } = useQuery({
    queryKey: ['employee-attendance', employeeId],
    queryFn: () => attendanceService.getByEmployeeId(employeeId),
    enabled: Boolean(employeeId),
  });

  const { data: leaveHistory = [] } = useQuery({
    queryKey: ['employee-leaves', employeeId],
    queryFn: () => leaveService.getByEmployeeId(employeeId),
    enabled: Boolean(employeeId),
  });

  const { data: salaryHistory = [] } = useQuery({
    queryKey: ['employee-salary', employeeId],
    queryFn: () => salaryService.getByEmployeeId(employeeId),
    enabled: Boolean(employeeId),
  });

  // CheckIn mutation
  const checkInMutation = useMutation({
    mutationFn: () => attendanceService.checkIn(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-attendance', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Check-in recorded for today!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Check-in failed');
    },
  });

  // CheckOut mutation
  const checkOutMutation = useMutation({
    mutationFn: () => attendanceService.checkOut(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-attendance', employeeId] });
      toast.success('Check-out recorded for today!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Check-out failed');
    },
  });

  // Apply Leave mutation
  const applyLeaveMutation = useMutation({
    mutationFn: (data: { fromDate: string; toDate: string; reason: string }) =>
      leaveService.apply(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-leaves', employeeId] });
      toast.success('Leave applied successfully!');
      setLeaveModalOpen(false);
      setLeaveForm({
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        reason: '',
      });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to apply leave');
    },
  });

  // Add Salary mutation
  const addSalaryMutation = useMutation({
    mutationFn: (data: any) => salaryService.add(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-salary', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Salary disbursement recorded successfully!');
      setSalaryModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to record salary');
    },
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    applyLeaveMutation.mutate(leaveForm);
  };

  const handleAddSalary = (e: React.FormEvent) => {
    e.preventDefault();
    addSalaryMutation.mutate({
      basicSalary: Number(salaryForm.basicSalary),
      bonus: Number(salaryForm.bonus),
      deduction: Number(salaryForm.deduction),
      payDate: salaryForm.payDate,
    });
  };

  if (isEmpLoading) {
    return <LoadingSkeleton rows={4} type="details" />;
  }

  if (empError || !employee) {
    return (
      <ErrorState
        title="Employee Profile Not Found"
        message="The requested employee record could not be retrieved from the server."
        onRetry={refetchEmp}
      />
    );
  }

  const canManage = user?.role === 'ADMIN' || user?.role === 'HR';

  return (
    <Box>
      <PageHeader
        title={employee.name}
        subtitle={`Employee ID #${employee.id} • ${employee.department?.name || 'General Department'}`}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/employees')}
            sx={{ borderRadius: 2.5 }}
          >
            Back to Directory
          </Button>
        }
      />

      {/* Profile Overview Card */}
      <Card sx={{ borderRadius: 4, mb: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 120,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          }}
        />
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, mt: -7 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              justifyContent: 'space-between',
              gap: 3,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5 }}>
              <Avatar
                src={employee.id ? employeeService.getPhotoUrl(employee.id) : undefined}
                sx={{
                  width: 96,
                  height: 96,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                {employee.name.charAt(0)}
              </Avatar>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {employee.name}
                  </Typography>
                  <StatusBadge status={employee.role} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                  {employee.email}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Button
                variant="outlined"
                color="success"
                startIcon={<HowToRegOutlinedIcon />}
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
                sx={{ borderRadius: 2.5 }}
              >
                Check In
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
                sx={{ borderRadius: 2.5 }}
              >
                Check Out
              </Button>
              <Button
                variant="contained"
                startIcon={<EventBusyOutlinedIcon />}
                onClick={() => setLeaveModalOpen(true)}
                sx={{ borderRadius: 2.5 }}
              >
                Apply Leave
              </Button>
              {canManage && (
                <Button
                  variant="outlined"
                  startIcon={<PaymentsOutlinedIcon />}
                  onClick={() => {
                    setSalaryForm({
                      basicSalary: String(employee.salary || ''),
                      bonus: '0',
                      deduction: '0',
                      payDate: new Date().toISOString().split('T')[0],
                    });
                    setSalaryModalOpen(true);
                  }}
                  sx={{ borderRadius: 2.5 }}
                >
                  Record Salary
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Key Attributes Grid */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailOutlinedIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Corporate Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {employee.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BusinessOutlinedIcon sx={{ color: 'secondary.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Department
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {employee.department?.name || 'Unassigned'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachMoneyOutlinedIcon sx={{ color: 'success.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Base Compensation
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : '—'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CalendarTodayOutlinedIcon sx={{ color: 'info.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Date of Joining
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {employee.dateOfJoining || '—'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label={`Attendance History (${attendanceHistory.length})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Leave Requests (${leaveHistory.length})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Salary Disbursements (${salaryHistory.length})`} sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Tab 0: Attendance History */}
      {activeTab === 0 && (
        <Card sx={{ borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Check-In Time</TableCell>
                  <TableCell>Check-Out Time</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No attendance activity recorded for this employee.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceHistory.map((att) => (
                    <TableRow key={att.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{att.date || '—'}</TableCell>
                      <TableCell>{att.checkIn || '—'}</TableCell>
                      <TableCell>{att.checkOut || '—'}</TableCell>
                      <TableCell align="right">
                        <StatusBadge status={att.status} size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Tab 1: Leave History */}
      {activeTab === 1 && (
        <Card sx={{ borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>From Date</TableCell>
                  <TableCell>To Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No leave requests filed by this employee.
                    </TableCell>
                  </TableRow>
                ) : (
                  leaveHistory.map((leave) => (
                    <TableRow key={leave.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{leave.fromDate}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{leave.toDate}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell align="right">
                        <StatusBadge status={leave.status} size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Tab 2: Salary History */}
      {activeTab === 2 && (
        <Card sx={{ borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pay Date</TableCell>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>Bonus</TableCell>
                  <TableCell>Deductions</TableCell>
                  <TableCell align="right">Net Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No salary slips generated for this employee.
                    </TableCell>
                  </TableRow>
                ) : (
                  salaryHistory.map((sal) => (
                    <TableRow key={sal.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{sal.payDate}</TableCell>
                      <TableCell>${sal.basicSalary?.toLocaleString()}</TableCell>
                      <TableCell sx={{ color: 'success.main' }}>
                        +${sal.bonus?.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: 'error.main' }}>
                        -${sal.deduction?.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${sal.netSalary?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Apply Leave Modal */}
      <Dialog
        open={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleApplyLeave}>
          <DialogTitle sx={{ fontWeight: 800 }}>Apply Employee Leave</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                From Date *
              </Typography>
              <TextField
                fullWidth
                required
                type="date"
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                To Date *
              </Typography>
              <TextField
                fullWidth
                required
                type="date"
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Reason *
              </Typography>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                placeholder="State the reason for absence..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setLeaveModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={applyLeaveMutation.isPending}>
              {applyLeaveMutation.isPending ? <CircularProgress size={20} /> : 'Submit Leave'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Record Salary Modal */}
      <Dialog
        open={salaryModalOpen}
        onClose={() => setSalaryModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleAddSalary}>
          <DialogTitle sx={{ fontWeight: 800 }}>Record Salary Payment</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Basic Salary ($) *
              </Typography>
              <TextField
                fullWidth
                required
                type="number"
                value={salaryForm.basicSalary}
                onChange={(e) => setSalaryForm({ ...salaryForm, basicSalary: e.target.value })}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Bonus ($)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={salaryForm.bonus}
                onChange={(e) => setSalaryForm({ ...salaryForm, bonus: e.target.value })}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Deductions ($)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={salaryForm.deduction}
                onChange={(e) => setSalaryForm({ ...salaryForm, deduction: e.target.value })}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Disbursement Pay Date *
              </Typography>
              <TextField
                fullWidth
                required
                type="date"
                value={salaryForm.payDate}
                onChange={(e) => setSalaryForm({ ...salaryForm, payDate: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setSalaryModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={addSalaryMutation.isPending}>
              {addSalaryMutation.isPending ? <CircularProgress size={20} /> : 'Record Disbursement'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default EmployeeDetailsPage;
