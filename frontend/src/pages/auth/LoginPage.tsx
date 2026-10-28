import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onSubmit = async (data: { username: string; password: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (email: string, pass: string) => {
    setValue('username', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left Hero Panel (Desktop) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
          },
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              W
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              WorkForce Pro
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 600 }}>
              ENTERPRISE MULTI-TENANT HRMS
            </Typography>
          </Box>
        </Box>

        {/* Value Proposition */}
        <Box sx={{ maxWidth: 540, zIndex: 1, my: 'auto' }}>
          <Chip
            label="Enterprise SaaS v2.0"
            size="small"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.25)',
              color: '#818cf8',
              fontWeight: 700,
              mb: 3,
              border: '1px solid rgba(99, 102, 241, 0.4)',
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.15, mb: 2, letterSpacing: '-0.03em' }}>
            Next-Generation Workforce Management & SaaS Intelligence
          </Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, mb: 4 }}>
            Empower your HR, executives, and team with unified attendance tracking, automated salary payrolls, seamless leave approvals, and Spring AI assistant intelligence.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
              }}
            >
              <BusinessOutlinedIcon sx={{ color: '#06b6d4', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Multi-Tenant Isolation
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Secure per-organization boundary
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
              }}
            >
              <SmartToyOutlinedIcon sx={{ color: '#818cf8', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Spring AI Copilot
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Gemini-powered workforce assistant
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Footer info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
          <SecurityOutlinedIcon sx={{ color: '#10b981', fontSize: '1.2rem' }} />
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Stateless JWT Authentication with Role-Based Method Security
          </Typography>
        </Box>
      </Box>

      {/* Right Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Card
          sx={{
            maxWidth: 460,
            width: '100%',
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent sx={{ p: '0 !important' }}>
            {/* Header */}
            <Box sx={{ mb: 3.5, textAlign: 'left' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em', mb: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sign in to your WorkForce Pro corporate workspace
              </Typography>
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: '0.85rem' }}>
                {errorMessage}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                  Corporate Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="name@company.com"
                  autoComplete="email"
                  autoFocus
                  {...register('username')}
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
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

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Password
                  </Typography>
                  <RouterLink
                    to="/forgot-password"
                    style={{ textDecoration: 'none', color: '#6366f1', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Forgot password?
                  </RouterLink>
                </Box>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password')}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      Remember session
                    </Typography>
                  }
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  py: 1.4,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  mb: 3,
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </Box>

            {/* Quick Demo Pre-fills */}
            <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                Demo Accounts Quick-Fill:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="Admin (admin@workforce.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('admin@workforce.com', 'admin123')}
                  sx={{ cursor: 'pointer', fontSize: '0.72rem' }}
                />
                <Chip
                  label="HR (hr@workforce.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('hr@workforce.com', 'hr123')}
                  sx={{ cursor: 'pointer', fontSize: '0.72rem' }}
                />
                <Chip
                  label="Employee (emp@workforce.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('emp@workforce.com', 'emp123')}
                  sx={{ cursor: 'pointer', fontSize: '0.72rem' }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
