import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Find logged in employee by resolving current user
  const { data: currentEmployee, isLoading } = useQuery({
    queryKey: ['current-employee-profile', user?.email],
    queryFn: () => (user ? employeeService.resolveCurrentEmployee(user) : null),
    enabled: Boolean(user?.email),
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => {
      if (!currentEmployee?.id) throw new Error('Employee ID missing');
      return employeeService.uploadPhoto(currentEmployee.id, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-employee-profile'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Profile photo updated successfully!');
      setUploadDialogOpen(false);
      setSelectedFile(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload photo');
    },
  });

  const handleUpload = () => {
    if (selectedFile) {
      uploadPhotoMutation.mutate(selectedFile);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton rows={4} type="details" />;
  }

  return (
    <Box>
      <PageHeader
        title="Personal Profile & Account"
        subtitle="Manage your employee identity, security credentials, and organization tenure."
      />

      <Grid container spacing={3}>
        {/* Main Profile Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ height: 120, background: 'linear-gradient(135deg, #B71C1C 0%, #C62828 50%, #E53935 100%)' }} />
            <CardContent sx={{ p: { xs: 2.5, sm: 4 }, mt: -7 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5 }}>
                  <Avatar
                    src={currentEmployee?.id ? employeeService.getPhotoUrl(currentEmployee.id) : undefined}
                    sx={{
                      width: 96,
                      height: 96,
                      border: '4px solid',
                      borderColor: 'background.paper',
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                    }}
                  >
                    {user?.email.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {currentEmployee?.name || user?.email.split('@')[0]}
                      </Typography>
                      <StatusBadge status={user?.role} />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                {currentEmployee?.id && (
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadOutlinedIcon />}
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{ borderRadius: 2.5 }}
                  >
                    Update Photo
                  </Button>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <EmailOutlinedIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Work Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <BusinessOutlinedIcon sx={{ color: 'secondary.main', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Department
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentEmployee?.department?.name || 'General Workforce'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <AttachMoneyOutlinedIcon sx={{ color: 'success.main', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Assigned Salary
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentEmployee?.salary ? `$${currentEmployee.salary.toLocaleString()}` : 'Confidential'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CalendarTodayOutlinedIcon sx={{ color: 'info.main', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Date of Joining
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentEmployee?.dateOfJoining || 'Active Member'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security & Organization Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Authentication Credentials
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, mb: 2, bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <CorporateFareOutlinedIcon color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Organization Tenant #{user?.organizationId || 1}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Authenticated via Spring Security Multi-Tenant JWT Token
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <KeyOutlinedIcon color="secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Session Validity
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Stateless Bearer token with 1-hour rolling window.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Photo Modal */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Profile Photo</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', py: 4 }}>
          <input
            type="file"
            accept="image/*"
            id="user-photo-upload"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="user-photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadOutlinedIcon />}
              sx={{ borderRadius: 2.5, py: 1.5, px: 3 }}
            >
              Choose Photo File
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
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploadPhotoMutation.isPending}
          >
            {uploadPhotoMutation.isPending ? <CircularProgress size={20} /> : 'Save Photo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
