import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import organizationService from '../../services/organizationService';
import departmentService from '../../services/departmentService';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import { Organization } from '../../types';

export const OrganizationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const orgId = user?.organizationId || 1;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Queries
  const {
    data: organization,
    isLoading: isOrgLoading,
    error: orgError,
    refetch,
  } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      try {
        return await organizationService.getById(orgId);
      } catch {
        const all = await organizationService.getAll();
        return all[0] || null;
      }
    },
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll(),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
      });
    }
  }, [organization]);

  const updateMutation = useMutation({
    mutationFn: (updated: Partial<Organization>) => {
      const targetId = organization?.id || orgId;
      return organizationService.update(targetId, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast.success('Organization profile updated successfully!');
      setIsEditing(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update organization details');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isOrgLoading) {
    return <LoadingSkeleton rows={4} type="details" />;
  }

  if (orgError) {
    return (
      <ErrorState
        title="Failed to Load Organization Data"
        message="Unable to fetch company information from the server."
        onRetry={refetch}
      />
    );
  }

  const canEdit = user?.role === 'ADMIN';

  return (
    <Box>
      <PageHeader
        title="Organization Settings & Identity"
        subtitle="Manage your corporate entity profile, contact details, and multi-tenant environment."
        action={
          canEdit && !isEditing && (
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => setIsEditing(true)}
              sx={{ borderRadius: 2.5 }}
            >
              Edit Company Profile
            </Button>
          )
        }
      />

      {/* Main Profile Card */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  <CorporateFareOutlinedIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {organization?.name || 'Enterprise Organization'}
                  </Typography>
                  <Chip
                    label={`Tenant ID: #${organization?.id || orgId}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.72rem' }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {isEditing ? (
                <Box component="form" onSubmit={handleSave}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                        Organization Name *
                      </Typography>
                      <TextField
                        fullWidth
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                        Corporate Email *
                      </Typography>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                        Contact Phone
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                        Headquarters Address
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="100 Enterprise Way, Suite 400"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveOutlinedIcon />}
                          disabled={updateMutation.isPending}
                          sx={{ borderRadius: 2.5 }}
                        >
                          {updateMutation.isPending ? <CircularProgress size={20} /> : 'Save Profile Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          startIcon={<CloseIcon />}
                          onClick={() => setIsEditing(false)}
                          sx={{ borderRadius: 2.5 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <EmailOutlinedIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Primary Corporate Email
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {organization?.email || '—'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <PhoneOutlinedIcon sx={{ color: 'secondary.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Contact Phone
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {organization?.phone || 'Not configured'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <PlaceOutlinedIcon sx={{ color: 'error.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Headquarters Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {organization?.address || 'Not configured'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <CalendarMonthOutlinedIcon sx={{ color: 'info.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Tenant Established
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {organization?.createdAt || 'Active Tenant'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tenant Statistics & Multi-Tenant Isolation info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Organizational Capacity
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, mb: 2, bgcolor: 'action.hover' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Total Departments
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {departments.length}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, mb: 3, bgcolor: 'action.hover' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Total Active Workforce
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                  {employees.length}
                </Typography>
              </Paper>

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.5 }}>
                🔒 <strong>Multi-Tenant Architecture:</strong> All database queries, attendance transactions, employee records, and payroll calculations are strictly scoped to Organization #{orgId}.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationPage;
