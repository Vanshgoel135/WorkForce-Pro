import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Paper,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          p: { xs: 2.5, sm: 4 },
          borderRadius: 4,
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: '0 !important' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: 'rgba(79, 70, 229, 0.1)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
            }}
          >
            <LockResetIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em', mb: 1 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Enter your corporate email address to receive password reset instructions.
          </Typography>

          {submitted ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>
                If an account exists for <strong>{email}</strong>, password reset instructions have been forwarded to your system administrator.
              </Alert>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  gap: 1.5,
                }}
              >
                <AdminPanelSettingsOutlinedIcon color="primary" />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.84rem' }}>
                  <strong>Enterprise Policy:</strong> In multi-tenant environments, password resets require verification by your Organization Administrator or HR Executive.
                </Typography>
              </Paper>

              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ py: 1.2, borderRadius: 2.5 }}
              >
                Return to Sign In
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                  Work Email Address
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.4, fontWeight: 700, borderRadius: 2.5, mb: 2.5 }}
              >
                Send Reset Link
              </Button>

              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{ color: 'text.secondary' }}
              >
                Back to Sign In
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;
