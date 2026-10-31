import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';

import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../types/auth.types';

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid corporate email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setErrorMessage(null);
      await login(data, rememberMe);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
    }
  };

  const handleDemoFill = (email: string, pass: string) => {
    setValue('username', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setErrorMessage(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#FFFFFF',
      }}
    >
      {/* ============================================================== */}
      {/* LEFT SIDE: VENSURE-INSPIRED LUXURY BRAND PANEL */}
      {/* ============================================================== */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 46%', lg: '0 0 44%' },
          background: 'linear-gradient(145deg, #7F0000 0%, #B71C1C 45%, #C62828 100%)',
          color: '#FFFFFF',
          p: { xs: 4, sm: 6, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        {/* Subtle geometric circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Header & Public Website Link */}
        <Box sx={{ zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
            <Logo variant="white" size="large" onClick={() => navigate('/')} />
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.825rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Back to Website
            </Button>
          </Box>

          <Chip
            label="ENTERPRISE WORKSPACE"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              mb: 2.5,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.85rem', sm: '2.5rem', lg: '2.85rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              mb: 2.5,
            }}
          >
            The Operating System for Modern Human Capital.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.88)',
              fontSize: '1.05rem',
              lineHeight: 1.65,
              maxWidth: 480,
              mb: 4,
            }}
          >
            Manage your global workforce with unified employee lifecycles, automated tax-compliant payroll,
            and conversational AI intelligence.
          </Typography>
        </Box>

        {/* Center Quote / Testimonial */}
        <Box
          sx={{
            zIndex: 1,
            my: { xs: 4, md: 'auto' },
            bgcolor: 'rgba(0, 0, 0, 0.18)',
            backdropFilter: 'blur(10px)',
            p: 3,
            borderRadius: 3.5,
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5, color: '#FCD34D', mb: 1.5 }}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} sx={{ fontSize: '1.1rem' }} />
            ))}
          </Box>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#FFFFFF', lineHeight: 1.6, mb: 2 }}>
            "WorkForce Pro reduced our bi-weekly payroll calculation from 4 days to under 45 minutes across 22 global entities. It's the most dependable HCM we've ever used."
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: '#FFFFFF' }}>
            Sarah Jenkins — Chief People Officer, Horizon Global
          </Typography>
        </Box>

        {/* Bottom Metrics Pill */}
        <Box
          sx={{
            zIndex: 1,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4ADE80' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
              SOC-2 Type II & GDPR Compliant
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            99.99% Uptime SLA
          </Typography>
        </Box>
      </Box>

      {/* ============================================================== */}
      {/* RIGHT SIDE: CLEAN WHITE ENTERPRISE LOGIN FORM */}
      {/* ============================================================== */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6, lg: 8 },
          bgcolor: '#FFFFFF',
        }}
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: 480,
            width: '100%',
            p: { xs: 2.5, sm: 4.5 },
            borderRadius: 4,
            border: '1px solid #E5E7EB',
            boxShadow: '0 20px 45px -15px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: '0 !important' }}>
            {/* Header */}
            <Box sx={{ mb: 3.5, textAlign: 'left' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#111827',
                  letterSpacing: '-0.025em',
                  mb: 1,
                }}
              >
                Sign In to Workspace
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
                Enter your verified corporate credentials to access the WorkForce Pro HRMS dashboard.
              </Typography>
            </Box>

            {/* Error UI */}
            {errorMessage && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2.5,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {errorMessage}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Corporate Email Field */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block', color: '#374151' }}>
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
                          <EmailOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151' }}>
                    Password
                  </Typography>
                  <RouterLink
                    to="/forgot-password"
                    style={{
                      textDecoration: 'none',
                      color: '#C62828',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
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
                          <LockOutlinedIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
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

              {/* Remember Session Checkbox */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{ color: '#C62828', '&.Mui-checked': { color: '#C62828' } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4B5563' }}>
                      Remember session
                    </Typography>
                  }
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
                  boxShadow: '0 4px 14px rgba(198, 40, 40, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B71C1C 0%, #C62828 100%)',
                    boxShadow: '0 6px 18px rgba(198, 40, 40, 0.35)',
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </Box>

            {/* Quick Demo Pre-Fills */}
            <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid #E5E7EB' }}>
              <Typography
                variant="caption"
                sx={{ color: '#6B7280', fontWeight: 700, display: 'block', mb: 1.25 }}
              >
                Instant Live Demo Accounts:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="Admin (goelvansh71@gmail.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('goelvansh71@gmail.com', '123456')}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderColor: '#FECACA',
                    bgcolor: '#FEF2F2',
                    color: '#991B1B',
                    '&:hover': { bgcolor: '#FEE2E2', borderColor: '#C62828' },
                  }}
                />
                <Chip
                  label="Admin (admin@workforce.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('admin@workforce.com', 'admin123')}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderColor: '#E5E7EB',
                    '&:hover': { borderColor: '#C62828', bgcolor: '#FEF2F2' },
                  }}
                />
                <Chip
                  label="HR (hr@workforce.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('hr@workforce.com', 'hr123')}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderColor: '#E5E7EB',
                    '&:hover': { borderColor: '#C62828', bgcolor: '#FEF2F2' },
                  }}
                />
                <Chip
                  label="Employee (emp@workforce.com)"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoFill('emp@workforce.com', 'emp123')}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderColor: '#E5E7EB',
                    '&:hover': { borderColor: '#C62828', bgcolor: '#FEF2F2' },
                  }}
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
