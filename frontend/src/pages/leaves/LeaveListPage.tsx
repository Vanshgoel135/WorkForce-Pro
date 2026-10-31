import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import leaveService from '../../services/leaveService';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import { LeaveRequest } from '../../types';

export const LeaveListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Apply Leave Modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [leaveForm, setLeaveForm] = useState({
    fromDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    toDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    reason: '',
  });

  // Current employee discovery for EMPLOYEE role
  const { data: currentEmployee } = useQuery({
    queryKey: ['current-employee-profile', user?.email],
    queryFn: () => (user ? employeeService.resolveCurrentEmployee(user) : null),
    enabled: Boolean(user?.email),
  });

  // Queries
  const { data: leaves = [], isLoading: isLeavesLoading } = useQuery({
    queryKey: ['leaves', isAdminOrHr ? 'all' : currentEmployee?.id],
    queryFn: () => {
      if (isAdminOrHr) {
        return leaveService.getAll();
      }
      if (currentEmployee?.id) {
        return leaveService.getByEmployeeId(currentEmployee.id);
      }
      return Promise.resolve([]);
    },
    enabled: isAdminOrHr || Boolean(currentEmployee?.id),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
    enabled: isAdminOrHr,
  });

  // Default to user's employee ID
  React.useEffect(() => {
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

  // Mutations
  const applyMutation = useMutation({
    mutationFn: ({ empId, data }: { empId: number; data: Partial<LeaveRequest> }) =>
      leaveService.apply(empId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Leave application submitted successfully!');
      setApplyModalOpen(false);
      setLeaveForm({
        fromDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        toDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        reason: '',
      });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to apply for leave');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (leaveId: number) => leaveService.approve(leaveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Leave request approved!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Approval failed');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (leaveId: number) => leaveService.reject(leaveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.info('Leave request rejected.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Rejection failed');
    },
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmpId = Number(selectedEmployeeId || currentEmployee?.id);
    if (!targetEmpId) {
      toast.warning('Please select an employee.');
      return;
    }
    applyMutation.mutate({
      empId: targetEmpId,
      data: leaveForm,
    });
  };

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchSearch =
        leave.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        selectedStatusTab === 'ALL' ||
        leave.status?.toUpperCase() === selectedStatusTab.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [leaves, searchTerm, selectedStatusTab]);

  const paginatedLeaves = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLeaves.slice(start, start + rowsPerPage);
  }, [filteredLeaves, page, rowsPerPage]);

  const canManage = isAdminOrHr;

  return (
    <Box>
      <PageHeader
        title={isAdminOrHr ? 'Leave Requests & Approvals' : 'My Leave Applications'}
        subtitle="Manage paid time off, sick leave balances, and executive approval workflows."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setApplyModalOpen(true)}
            sx={{ borderRadius: 2.5 }}
          >
            Apply for Leave
          </Button>
        }
      />

      {/* Filter Tabs & Search */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={selectedStatusTab}
            onChange={(_, val) => setSelectedStatusTab(val)}
            indicatorColor="primary"
          >
            <Tab label={`All (${leaves.length})`} value="ALL" sx={{ fontWeight: 600 }} />
            <Tab
              label={`Pending (${leaves.filter((l) => l.status?.toLowerCase() === 'pending').length})`}
              value="PENDING"
              sx={{ fontWeight: 600 }}
            />
            <Tab
              label={`Approved (${leaves.filter((l) => l.status?.toLowerCase() === 'approved').length})`}
              value="APPROVED"
              sx={{ fontWeight: 600 }}
            />
            <Tab
              label={`Rejected (${leaves.filter((l) => l.status?.toLowerCase() === 'rejected').length})`}
              value="REJECTED"
              sx={{ fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Search by employee name or reason..."
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
        </CardContent>
      </Card>

      {/* Main Table */}
      {isLeavesLoading ? (
        <LoadingSkeleton rows={5} type="table" />
      ) : filteredLeaves.length === 0 ? (
        <EmptyState
          title="No leave requests found"
          description={
            searchTerm
              ? `No requests match "${searchTerm}".`
              : 'There are no active leave records for this status.'
          }
          actionText="Apply for Leave"
          onAction={() => setApplyModalOpen(true)}
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>From Date</TableCell>
                  <TableCell>To Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  {canManage && <TableCell align="right">Decisions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeaves.map((leave) => {
                  const isPending = leave.status?.toLowerCase() === 'pending';
                  return (
                    <TableRow key={leave.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {leave.employee?.name || `Employee #${leave.employee?.id || '—'}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {leave.employee?.email || ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{leave.fromDate}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{leave.toDate}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {leave.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={leave.status} size="small" />
                      </TableCell>
                      {canManage && (
                        <TableCell align="right">
                          {isPending ? (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title="Approve Request">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => leave.id && approveMutation.mutate(leave.id)}
                                  disabled={approveMutation.isPending}
                                >
                                  <CheckCircleOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Request">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => leave.id && rejectMutation.mutate(leave.id)}
                                  disabled={rejectMutation.isPending}
                                >
                                  <HighlightOffOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                              Completed
                            </Typography>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeaves.length}
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

      {/* Apply Leave Modal */}
      <Dialog
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleApply}>
          <DialogTitle sx={{ fontWeight: 800 }}>Apply for Leave</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2.5, mt: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Employee *
              </Typography>
              {isAdminOrHr ? (
                <TextField
                  select
                  fullWidth
                  required
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={String(emp.id)}>
                      {emp.name} ({emp.email})
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'action.hover' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {currentEmployee?.name || user?.email} (ID #{currentEmployee?.id || '—'})
                  </Typography>
                </Paper>
              )}
            </Box>

            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  type="date"
                  fullWidth
                  required
                  label="From Date"
                  value={leaveForm.fromDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  type="date"
                  fullWidth
                  required
                  label="To Date"
                  value={leaveForm.toDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Reason for Leave *
              </Typography>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                placeholder="e.g., Annual family vacation, personal emergency, medical leave..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setApplyModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LeaveListPage;
