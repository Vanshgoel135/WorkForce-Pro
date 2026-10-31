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
  Typography,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import salaryService from '../../services/salaryService';
import employeeService from '../../services/employeeService';
import { Salary } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const SalaryListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';
  const isAdmin = user?.role === 'ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<Salary | null>(null);

  // Form
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [formData, setFormData] = useState({
    basicSalary: '',
    bonus: '0',
    deduction: '0',
    payDate: dayjs().format('YYYY-MM-DD'),
  });

  // Current employee discovery for EMPLOYEE role
  const { data: currentEmployee } = useQuery({
    queryKey: ['current-employee-profile', user?.email],
    queryFn: () => (user ? employeeService.resolveCurrentEmployee(user) : null),
    enabled: Boolean(user?.email),
  });

  // Queries
  const { data: salaries = [], isLoading: isSalaryLoading } = useQuery({
    queryKey: ['salaries', isAdminOrHr ? 'all' : currentEmployee?.id],
    queryFn: () => {
      if (isAdminOrHr) {
        return salaryService.getAll();
      }
      if (currentEmployee?.id) {
        return salaryService.getByEmployeeId(currentEmployee.id);
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

  // Calculate Aggregates
  const totalPayroll = useMemo(
    () => salaries.reduce((acc, curr) => acc + (curr.netSalary || 0), 0),
    [salaries]
  );
  const totalBonuses = useMemo(
    () => salaries.reduce((acc, curr) => acc + (curr.bonus || 0), 0),
    [salaries]
  );
  const totalDeductions = useMemo(
    () => salaries.reduce((acc, curr) => acc + (curr.deduction || 0), 0),
    [salaries]
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: ({ empId, data }: { empId: number; data: Partial<Salary> }) =>
      salaryService.add(empId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Salary disbursement recorded!');
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to record salary');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Salary> }) =>
      salaryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Salary record updated!');
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update salary');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => salaryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Salary record removed!');
      setDeleteDialogOpen(false);
      setSalaryToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete salary record');
    },
  });

  const handleOpenCreate = () => {
    setEditingSalary(null);
    setSelectedEmployeeId(employees[0]?.id ? String(employees[0].id) : '');
    setFormData({
      basicSalary: '',
      bonus: '0',
      deduction: '0',
      payDate: dayjs().format('YYYY-MM-DD'),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (sal: Salary) => {
    setEditingSalary(sal);
    setSelectedEmployeeId(sal.employee?.id ? String(sal.employee.id) : '');
    setFormData({
      basicSalary: String(sal.basicSalary || ''),
      bonus: String(sal.bonus || '0'),
      deduction: String(sal.deduction || '0'),
      payDate: sal.payDate || dayjs().format('YYYY-MM-DD'),
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSalary(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Salary> = {
      basicSalary: Number(formData.basicSalary) || 0,
      bonus: Number(formData.bonus) || 0,
      deduction: Number(formData.deduction) || 0,
      payDate: formData.payDate,
    };

    if (editingSalary && editingSalary.id) {
      updateMutation.mutate({ id: editingSalary.id, data: payload });
    } else {
      if (!selectedEmployeeId) {
        toast.warning('Please select an employee.');
        return;
      }
      createMutation.mutate({
        empId: Number(selectedEmployeeId),
        data: payload,
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (salaryToDelete?.id) {
      deleteMutation.mutate(salaryToDelete.id);
    }
  };

  // Filtered salaries
  const filteredSalaries = useMemo(() => {
    return salaries.filter((sal) => {
      const matchSearch =
        sal.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sal.payDate?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [salaries, searchTerm]);

  const paginatedSalaries = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSalaries.slice(start, start + rowsPerPage);
  }, [filteredSalaries, page, rowsPerPage]);

  const canManage = isAdminOrHr;

  return (
    <Box>
      <PageHeader
        title={isAdminOrHr ? 'Payroll & Salary Management' : 'My Salary Slips'}
        subtitle="Manage salary disbursements, incentives, tax deductions, and net compensation records."
        action={
          canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2.5 }}
            >
              Record Salary Slip
            </Button>
          )
        }
      />

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title={isAdminOrHr ? 'Total Net Payroll' : 'Total Net Compensation'}
            value={`$${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            subtitle="Disbursed earnings"
            icon={<AccountBalanceWalletOutlinedIcon />}
            color="#C62828"
            loading={isSalaryLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Bonuses"
            value={`$${totalBonuses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            subtitle="Performance incentives"
            icon={<TrendingUpIcon />}
            color="#10b981"
            loading={isSalaryLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Deductions"
            value={`$${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            subtitle="Withholding & taxes"
            icon={<TrendingDownIcon />}
            color="#ef4444"
            loading={isSalaryLoading}
          />
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search salary records by employee name or pay date (YYYY-MM-DD)..."
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

      {/* Table */}
      {isSalaryLoading ? (
        <LoadingSkeleton rows={5} type="table" />
      ) : filteredSalaries.length === 0 ? (
        <EmptyState
          title="No salary records found"
          description={
            searchTerm
              ? `No payroll slips match "${searchTerm}".`
              : 'Record employee salary to generate payroll slips.'
          }
          actionText={canManage ? 'Record Salary' : undefined}
          onAction={canManage ? handleOpenCreate : undefined}
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Pay Date</TableCell>
                  <TableCell align="right">Basic Salary</TableCell>
                  <TableCell align="right">Bonus</TableCell>
                  <TableCell align="right">Deduction</TableCell>
                  <TableCell align="right">Net Salary</TableCell>
                  {canManage && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSalaries.map((sal) => (
                  <TableRow key={sal.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {sal.employee?.name || `Employee #${sal.employee?.id || '—'}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {sal.employee?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{sal.payDate}</TableCell>
                    <TableCell align="right">
                      ${(sal.basicSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                      +${(sal.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>
                      -${(sal.deduction || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        ${(sal.netSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    {canManage && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Edit Slip">
                            <IconButton size="small" onClick={() => handleOpenEdit(sal)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <Tooltip title="Delete Slip">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSalaryToDelete(sal);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredSalaries.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}

      {/* Create / Edit Salary Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingSalary ? 'Edit Salary Record' : 'Record Salary Slip'}
          </DialogTitle>
          <DialogContent dividers>
            {!editingSalary && (
              <Box sx={{ mb: 2.5, mt: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Target Employee *
                </Typography>
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
              </Box>
            )}

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Basic Salary ($) *
              </Typography>
              <TextField
                fullWidth
                required
                type="number"
                placeholder="5000"
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Bonus / Incentive ($)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Deductions ($)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.deduction}
                  onChange={(e) => setFormData({ ...formData, deduction: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Disbursement Pay Date *
              </Typography>
              <TextField
                fullWidth
                required
                type="date"
                value={formData.payDate}
                onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={24} />
              ) : editingSalary ? (
                'Update Salary'
              ) : (
                'Disburse Salary'
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Remove Salary Slip"
        message={`Are you sure you want to delete this salary slip record #${salaryToDelete?.id}? This action cannot be undone.`}
        confirmText="Delete Record"
        confirmColor="error"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default SalaryListPage;
