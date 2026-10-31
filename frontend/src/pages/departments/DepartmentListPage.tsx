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
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import departmentService from '../../services/departmentService';
import employeeService from '../../services/employeeService';
import { Department } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const DepartmentListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Queries
  const { data: departments = [], isLoading: isDeptLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll(),
  });

  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
    enabled: isAdminOrHr,
  });

  // Compute employee count per department
  const employeeCountMap = useMemo(() => {
    const map = new Map<number, number>();
    employees.forEach((emp) => {
      if (emp.department?.id) {
        map.set(emp.department.id, (map.get(emp.department.id) || 0) + 1);
      }
    });
    return map;
  }, [employees]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<Department>) => departmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Department created successfully!');
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create department');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Department> }) =>
      departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated successfully!');
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update department');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Department deleted successfully!');
      setDeleteDialogOpen(false);
      setDeptToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete department');
    },
  });

  const handleOpenCreate = () => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name || '',
      description: dept.description || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDepartment?.id) {
      updateMutation.mutate({ id: editingDepartment.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deptToDelete?.id) {
      deleteMutation.mutate(deptToDelete.id);
    }
  };

  // Filtered & Paginated
  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const paginatedDepartments = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredDepartments.slice(start, start + rowsPerPage);
  }, [filteredDepartments, page, rowsPerPage]);

  const canManage = user?.role === 'ADMIN' || user?.role === 'HR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Box>
      <PageHeader
        title="Departments"
        subtitle="Organize business divisions, team hierarchies, and operational structures."
        action={
          canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2.5 }}
            >
              Add Department
            </Button>
          )
        }
      />

      {/* Search Bar */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Search departments by name or description..."
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
      {isDeptLoading ? (
        <LoadingSkeleton rows={5} type="table" />
      ) : filteredDepartments.length === 0 ? (
        <EmptyState
          title="No departments found"
          description={searchTerm ? `No results match "${searchTerm}".` : 'Create your first corporate department.'}
          actionText={canManage ? 'Add Department' : undefined}
          onAction={canManage ? handleOpenCreate : undefined}
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Department Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Headcount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDepartments.map((dept) => {
                  const memberCount = (dept.id && employeeCountMap.get(dept.id)) || 0;
                  return (
                    <TableRow key={dept.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              bgcolor: 'rgba(79, 70, 229, 0.1)',
                              color: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <BusinessOutlinedIcon fontSize="small" />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {dept.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400 }}>
                          {dept.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<GroupsOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
                          label={`${memberCount} ${memberCount === 1 ? 'member' : 'members'}`}
                          size="small"
                          sx={{ fontWeight: 600, bgcolor: 'action.hover' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          {canManage && (
                            <Tooltip title="Edit Department">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(dept)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {isAdmin && (
                            <Tooltip title="Delete Department">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setDeptToDelete(dept);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDepartments.length}
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

      {/* Create / Edit Dialog */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingDepartment ? 'Edit Department' : 'New Department'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2.5, mt: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Department Name *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="e.g. Engineering, Sales, Human Resources"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Department Description *
              </Typography>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Briefly state departmental responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={20} />
              ) : editingDepartment ? (
                'Save Changes'
              ) : (
                'Create Department'
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Department"
        message={`Are you sure you want to delete the "${deptToDelete?.name}" department?`}
        confirmText="Confirm Delete"
        confirmColor="error"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setDeptToDelete(null);
        }}
      />
    </Box>
  );
};

export default DepartmentListPage;
