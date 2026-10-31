import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  TablePagination,
  CircularProgress,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import { Attendance } from '../../types';

export const AttendancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm:ss'));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // For Employee role: resolve current employee ID
  const { data: currentEmployee } = useQuery({
    queryKey: ['current-employee-profile', user?.email],
    queryFn: () => (user ? employeeService.resolveCurrentEmployee(user) : null),
    enabled: Boolean(user?.email),
  });

  // Queries
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
    enabled: isAdminOrHr,
  });

  const { data: attendanceList = [], isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['attendance', isAdminOrHr ? 'all' : currentEmployee?.id],
    queryFn: () => {
      if (isAdminOrHr) {
        return attendanceService.getAll();
      }
      if (currentEmployee?.id) {
        return attendanceService.getByEmployeeId(currentEmployee.id);
      }
      return Promise.resolve([]);
    },
    enabled: isAdminOrHr || Boolean(currentEmployee?.id),
  });

  // Auto-select employee ID
  useEffect(() => {
    if (!isAdminOrHr && currentEmployee?.id) {
      setSelectedEmployeeId(String(currentEmployee.id));
    } else if (isAdminOrHr && !selectedEmployeeId && employees.length > 0) {
      const match = employees.find((e) => e.email === user?.email);
      if (match?.id) {
        setSelectedEmployeeId(String(match.id));
      } else if (employees[0]?.id) {
        setSelectedEmployeeId(String(employees[0].id));
      }
    }
  }, [isAdminOrHr, currentEmployee, employees, user, selectedEmployeeId]);

  // CheckIn mutation
  const checkInMutation = useMutation({
    mutationFn: (empId: number) => attendanceService.checkIn(empId),
    onSuccess: (data: Attendance) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['personal-attendance'] });
      toast.success(`Check-in recorded at ${data.checkIn || 'now'}!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Check-in failed');
    },
  });

  // CheckOut mutation
  const checkOutMutation = useMutation({
    mutationFn: (empId: number) => attendanceService.checkOut(empId),
    onSuccess: (data: Attendance) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['personal-attendance'] });
      toast.success(`Check-out recorded at ${data.checkOut || 'now'}!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Check-out failed (ensure you checked in today)');
    },
  });

  const handleCheckIn = () => {
    const empId = Number(selectedEmployeeId || currentEmployee?.id);
    if (!empId) {
      toast.warning('Please select an employee.');
      return;
    }
    checkInMutation.mutate(empId);
  };

  const handleCheckOut = () => {
    const empId = Number(selectedEmployeeId || currentEmployee?.id);
    if (!empId) {
      toast.warning('Please select an employee.');
      return;
    }
    checkOutMutation.mutate(empId);
  };

  // Filtered attendance records
  const filteredAttendance = useMemo(() => {
    return attendanceList.filter((item) => {
      const matchSearch =
        item.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDate = !dateFilter || item.date === dateFilter;

      return matchSearch && matchDate;
    });
  }, [attendanceList, searchTerm, dateFilter]);

  const paginatedAttendance = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAttendance.slice(start, start + rowsPerPage);
  }, [filteredAttendance, page, rowsPerPage]);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const presentTodayCount = attendanceList.filter((a) => a.date === todayStr).length;

  return (
    <Box>
      <PageHeader
        title="Attendance & Time Tracking"
        subtitle="Record daily biometric check-ins, departures, and review corporate attendance logs."
      />

      {/* Clock and Action Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  : 'linear-gradient(135deg, #131b2e 0%, #0d1525 100%)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.08em' }}>
                LIVE SHIFT RECORDER
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, my: 1, letterSpacing: '-0.03em' }}>
                {currentTime}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Today is <strong>{dayjs().format('dddd, MMMM D, YYYY')}</strong>
              </Typography>

              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                {isAdminOrHr ? (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Select Employee"
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} value={String(emp.id)}>
                          {emp.name} ({emp.email})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'action.hover' }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Logging Attendance For:
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {currentEmployee?.name || user?.email} (ID #{currentEmployee?.id || '—'})
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<HowToRegOutlinedIcon />}
                      onClick={handleCheckIn}
                      disabled={checkInMutation.isPending}
                      sx={{ py: 1.2, borderRadius: 2.5 }}
                    >
                      {checkInMutation.isPending ? <CircularProgress size={20} /> : 'Check In'}
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="warning"
                      startIcon={<ExitToAppOutlinedIcon />}
                      onClick={handleCheckOut}
                      disabled={checkOutMutation.isPending}
                      sx={{ py: 1.2, borderRadius: 2.5 }}
                    >
                      {checkOutMutation.isPending ? <CircularProgress size={20} /> : 'Check Out'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Shift KPI Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  {isAdminOrHr ? "Today's Headcount Status" : 'My Shift Status Today'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {isAdminOrHr ? presentTodayCount : (presentTodayCount > 0 ? 'Active' : 'Not Checked In')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {isAdminOrHr
                      ? `of ${employees.length} employees checked in`
                      : `on ${dayjs().format('MMMM D')}`}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Standard Daily Shift
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    09:00 AM — 06:00 PM
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Biometric Verification
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                    Realtime Sync
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search by employee name, email, or status..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                type="date"
                fullWidth
                label="Filter by Date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(0);
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                  setPage(0);
                }}
                sx={{ py: 1.8, borderRadius: 2.5 }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Attendance Table */}
      {isAttendanceLoading ? (
        <LoadingSkeleton rows={5} type="table" />
      ) : filteredAttendance.length === 0 ? (
        <EmptyState
          title="No attendance records found"
          description={
            searchTerm || dateFilter
              ? 'No logs matched the selected filters.'
              : 'Start logging daily check-ins using the recorder above.'
          }
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Working Hours</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAttendance.map((item) => {
                  // Calculate duration if checkin and checkout exist
                  let duration = 'In Progress';
                  if (item.checkIn && item.checkOut) {
                    const start = dayjs(`2000-01-01 ${item.checkIn}`);
                    const end = dayjs(`2000-01-01 ${item.checkOut}`);
                    const diffMins = end.diff(start, 'minute');
                    if (diffMins > 0) {
                      const hrs = Math.floor(diffMins / 60);
                      const mins = diffMins % 60;
                      duration = `${hrs}h ${mins}m`;
                    }
                  }

                  return (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{item.date}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.employee?.name || `Employee #${item.employee?.id || '—'}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {item.employee?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleOutlineIcon color="success" sx={{ fontSize: '1rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.checkIn || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.checkOut || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {duration}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <StatusBadge status={item.status || 'Present'} size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredAttendance.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      )}
    </Box>
  );
};

export default AttendancePage;
