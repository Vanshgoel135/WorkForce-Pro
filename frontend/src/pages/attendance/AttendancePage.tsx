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
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
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
import { Attendance, Employee } from '../../types';

export const AttendancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

  // Queries
  const { data: attendanceList = [], isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => attendanceService.getAll(),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
  });

  // Auto-select logged in employee if match found
  useEffect(() => {
    if (!selectedEmployeeId && employees.length > 0) {
      const match = employees.find((e) => e.email === user?.email);
      if (match?.id) {
        setSelectedEmployeeId(String(match.id));
      } else if (employees[0]?.id) {
        setSelectedEmployeeId(String(employees[0].id));
      }
    }
  }, [employees, user, selectedEmployeeId]);

  // CheckIn mutation
  const checkInMutation = useMutation({
    mutationFn: (empId: number) => attendanceService.checkIn(empId),
    onSuccess: (data: Attendance) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
      toast.success(`Check-out recorded at ${data.checkOut || 'now'}!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Check-out failed (ensure you checked in today)');
    },
  });

  const handleCheckIn = () => {
    if (!selectedEmployeeId) {
      toast.warning('Please select an employee.');
      return;
    }
    checkInMutation.mutate(Number(selectedEmployeeId));
  };

  const handleCheckOut = () => {
    if (!selectedEmployeeId) {
      toast.warning('Please select an employee.');
      return;
    }
    checkOutMutation.mutate(Number(selectedEmployeeId));
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
                  Today's Headcount Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {presentTodayCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    of {employees.length} employees checked in
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Standard Daily Shift
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    09:00 AM – 06:00 PM
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Tracking Mode
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Automatic LocalTime
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
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search attendance by employee name or status..."
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

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Filter by Specific Date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(0);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Table */}
      {isAttendanceLoading ? (
        <LoadingSkeleton rows={6} type="table" />
      ) : filteredAttendance.length === 0 ? (
        <EmptyState
          title="No attendance records found"
          description={
            searchTerm || dateFilter
              ? 'No logs match the current search filters.'
              : 'Record check-in to generate today’s first attendance entry.'
          }
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Check-In</TableCell>
                  <TableCell>Check-Out</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAttendance.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {item.employee?.name || `Employee #${item.employee?.id || '—'}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {item.employee?.email || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.date || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.checkIn ? String(item.checkIn) : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.checkOut ? String(item.checkOut) : 'In progress'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <StatusBadge status={item.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAttendance.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Card>
      )}
    </Box>
  );
};

export default AttendancePage;
