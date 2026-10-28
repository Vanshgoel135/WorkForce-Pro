import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Avatar,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import { Employee, Role } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [photoEmployeeId, setPhotoEmployeeId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    role: 'EMPLOYEE' as Role,
    departmentId: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
  });

  // Queries
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll(),
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newEmp: Partial<Employee>) => employeeService.create(newEmp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Employee created successfully!');
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create employee');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) =>
      employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully!');
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update employee');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Employee removed successfully!');
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete employee');
    },
  });

  // Upload Photo Mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      employeeService.uploadPhoto(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Profile photo uploaded successfully!');
      setUploadDialogOpen(false);
      setSelectedFile(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload photo');
    },
  });

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      salary: '',
      role: 'EMPLOYEE',
      departmentId: departments[0]?.id ? String(departments[0].id) : '',
      dateOfJoining: new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '', // Don't expose password
      salary: emp.salary ? String(emp.salary) : '',
      role: emp.role || 'EMPLOYEE',
      departmentId: emp.department?.id ? String(emp.department.id) : '',
      dateOfJoining: emp.dateOfJoining || new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const departmentObj = departments.find((d) => String(d.id) === formData.departmentId);

    const payload: Partial<Employee> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      salary: Number(formData.salary) || 0,
      dateOfJoining: formData.dateOfJoining,
      department: departmentObj || null,
    };

    if (editingEmployee && editingEmployee.id) {
      updateMutation.mutate({ id: editingEmployee.id, data: payload });
    } else {
      payload.password = formData.password || 'workforce123';
      createMutation.mutate(payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete?.id) {
      deleteMutation.mutate(employeeToDelete.id);
    }
  };

  const handleUploadPhoto = () => {
    if (photoEmployeeId && selectedFile) {
      uploadPhotoMutation.mutate({ id: photoEmployeeId, file: selectedFile });
    }
  };

  // Filtered & Paginated Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = selectedRole === 'ALL' || emp.role === selectedRole;
      const matchDept =
        selectedDepartment === 'ALL' || String(emp.department?.id) === selectedDepartment;

      return matchSearch && matchRole && matchDept;
    });
  }, [employees, searchTerm, selectedRole, selectedDepartment]);

  const paginatedEmployees = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, page, rowsPerPage]);

  const canManage = user?.role === 'ADMIN' || user?.role === 'HR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Box>
      <PageHeader
        title="Employee Directory"
        subtitle="Manage workforce profiles, department assignments, and corporate compensation."
        action={
          canManage && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenCreateModal}
              sx={{ borderRadius: 2.5 }}
            >
              Add New Employee
            </Button>
          )
        }
      />

      {/* Filter and Search Bar */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                placeholder="Search employee by name, email, or department..."
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

            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
              <TextField
                select
                fullWidth
                label="Filter Department"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
              <TextField
                select
                fullWidth
                label="Filter Role"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Table */}
      {isLoading ? (
        <LoadingSkeleton rows={6} type="table" />
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          title="No employees found"
          description={searchTerm ? `No results match "${searchTerm}".` : 'Add your first employee to start building your organization.'}
          actionText={canManage ? 'Add Employee' : undefined}
          onAction={canManage ? handleOpenCreateModal : undefined}
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((emp) => (
                  <TableRow key={emp.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={emp.id ? employeeService.getPhotoUrl(emp.id) : undefined}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                          }}
                        >
                          {emp.name?.charAt(0) || 'E'}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main' },
                            }}
                            onClick={() => navigate(`/employees/${emp.id}`)}
                          >
                            {emp.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {emp.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {emp.department?.name || 'Unassigned'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={emp.role} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {emp.salary ? `$${emp.salary.toLocaleString()}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {emp.dateOfJoining || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/employees/${emp.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Upload Photo">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setPhotoEmployeeId(emp.id || null);
                              setUploadDialogOpen(true);
                            }}
                          >
                            <CloudUploadOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canManage && (
                          <Tooltip title="Edit Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditModal(emp)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {isAdmin && (
                          <Tooltip title="Delete Employee">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setEmployeeToDelete(emp);
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
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

      {/* Create / Edit Employee Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingEmployee ? 'Edit Employee Profile' : 'Add New Employee'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Full Name *
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Email Address *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>

              {!editingEmployee && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                    Initial Password *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Base Salary ($) *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  placeholder="e.g. 75000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Department
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                >
                  <MenuItem value="">None / General</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Access Role
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                >
                  <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                  Date of Joining
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                />
              </Grid>
            </Grid>
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
              ) : editingEmployee ? (
                'Save Changes'
              ) : (
                'Create Employee'
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Remove Employee"
        message={`Are you sure you want to delete employee "${employeeToDelete?.name}" (${employeeToDelete?.email})? This action cannot be undone.`}
        confirmText="Confirm Delete"
        confirmColor="error"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
      />

      {/* Photo Upload Modal */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Upload Employee Photo</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', py: 4 }}>
          <input
            type="file"
            accept="image/*"
            id="photo-upload-input"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="photo-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadOutlinedIcon />}
              sx={{ borderRadius: 2.5, py: 1.5, px: 3 }}
            >
              Choose Image File
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 600, color: 'primary.main' }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setUploadDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUploadPhoto}
            variant="contained"
            disabled={!selectedFile || uploadPhotoMutation.isPending}
          >
            {uploadPhotoMutation.isPending ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeListPage;
