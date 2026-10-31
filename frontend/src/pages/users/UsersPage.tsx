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
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import employeeService from '../../services/employeeService';
import { Employee, Role } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit Role Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [newRole, setNewRole] = useState<Role>('EMPLOYEE');

  const canManageUsers = user?.role === 'ADMIN' || user?.role === 'HR';

  // Queries
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
    enabled: canManageUsers,
  });

  // Mutation to update employee role
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role, emp }: { id: number; role: Role; emp: Employee }) =>
      employeeService.update(id, {
        name: emp.name,
        email: emp.email,
        salary: emp.salary,
        department: emp.department,
        dateOfJoining: emp.dateOfJoining,
        role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('User access role updated successfully!');
      setRoleModalOpen(false);
      setSelectedUser(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update user role');
    },
  });

  const handleOpenEditRole = (u: Employee) => {
    setSelectedUser(u);
    setNewRole(u.role || 'EMPLOYEE');
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser?.id) {
      updateRoleMutation.mutate({
        id: selectedUser.id,
        role: newRole,
        emp: selectedUser,
      });
    }
  };

  // Filtered
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const isAdmin = user?.role === 'ADMIN';

  if (!canManageUsers) {
    return (
      <Box>
        <PageHeader
          title="Users & Access Management"
          subtitle="Manage user accounts, corporate credential scopes, and assign authorization privileges."
        />
        <EmptyState
          title="Access Restricted"
          description="User and role management is restricted to Administrators and HR Personnel."
        />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Users & Access Management"
        subtitle="Manage user accounts, corporate credential scopes, and assign authorization privileges."
      />

      {/* Filter Bar */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search user by name or email..."
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

            <TextField
              select
              sx={{ minWidth: 200 }}
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="ALL">All Roles</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Main Table */}
      {isLoading ? (
        <LoadingSkeleton rows={5} type="table" />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="There are no user accounts matching the specified filters."
        />
      ) : (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Authorization Role</TableCell>
                  <TableCell>Account Status</TableCell>
                  {isAdmin && <TableCell align="right">Manage Role</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontWeight: 700 }}>
                          {u.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {u.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {u.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{u.department?.name || 'General'}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.role} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                          Active Login
                        </Typography>
                      </Box>
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Change Role Privileges">
                          <IconButton size="small" onClick={() => handleOpenEditRole(u)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
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

      {/* Edit Role Dialog */}
      <Dialog
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <Box component="form" onSubmit={handleSaveRole}>
          <DialogTitle sx={{ fontWeight: 800 }}>Update User Role</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Adjust role privileges for <strong>{selectedUser?.name}</strong> ({selectedUser?.email}).
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                Select Role *
              </Typography>
              <TextField
                select
                fullWidth
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
              >
                <MenuItem value="EMPLOYEE">EMPLOYEE (Standard Access)</MenuItem>
                <MenuItem value="HR">HR (Workforce & Leave Approvals)</MenuItem>
                <MenuItem value="ADMIN">ADMIN (Full System Control)</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setRoleModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? <CircularProgress size={20} /> : 'Save Role'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
