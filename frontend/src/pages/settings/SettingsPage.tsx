import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import { useAppTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { mode, setMode } = useAppTheme();
  const { user } = useAuth();

  const handleClearCache = () => {
    localStorage.removeItem('workforce_notifications');
    toast.success('Local preferences and temporary cache refreshed.');
  };

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  return (
    <Box>
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Customize application appearance, inspect backend connectivity, and manage local storage."
      />

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Appearance & Theme
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Select your preferred interface theme. Mode switches instantly across all panels.
              </Typography>

              <RadioGroup
                value={mode}
                onChange={(e) => setMode(e.target.value as 'light' | 'dark')}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    borderColor: mode === 'light' ? 'primary.main' : 'divider',
                    bgcolor: mode === 'light' ? 'rgba(79, 70, 229, 0.04)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setMode('light')}
                >
                  <FormControlLabel
                    value="light"
                    control={<Radio color="primary" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                        <LightModeOutlinedIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Light Executive Theme
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Clean, crisp white aesthetics with soft slate shadows
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderColor: mode === 'dark' ? 'primary.main' : 'divider',
                    bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setMode('dark')}
                >
                  <FormControlLabel
                    value="dark"
                    control={<Radio color="primary" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                        <DarkModeOutlinedIcon sx={{ color: '#818cf8' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Dark SaaS Studio Theme
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            High-contrast dark mode tailored for low light environments
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Backend & Environment Diagnostics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Backend API Environment
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Spring Boot service endpoints and active connection metadata.
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, mb: 2, bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    API BASE URL
                  </Typography>
                  <Chip
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: '0.85rem !important' }} />}
                    label="Configured via .env"
                    size="small"
                    color="success"
                    sx={{ fontSize: '0.7rem', height: 22 }}
                  />
                </Box>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>
                  {apiUrl}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, mb: 3, bgcolor: 'action.hover' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  AUTHENTICATED TENANT CONTEXT
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Organization ID: <strong>#{user?.organizationId || 1}</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Active User Role: <strong>{user?.role}</strong>
                </Typography>
              </Paper>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Clear Local Session Cache
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Removes cached notifications and resets local state.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleClearCache}
                  sx={{ borderRadius: 2 }}
                >
                  Refresh Cache
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
