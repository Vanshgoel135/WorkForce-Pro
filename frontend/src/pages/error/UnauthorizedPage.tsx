import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          textAlign: 'center',
          p: 4,
          borderRadius: 4,
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: '0 !important' }}>
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="overline" sx={{ fontWeight: 800, color: 'error.main', letterSpacing: '0.1em' }}>
            ERROR 401 / 403
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em', mt: 0.5, mb: 1 }}>
            Access Restricted
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5, lineHeight: 1.6 }}>
            You do not possess the required authorization credentials or role privileges to view this module. Please contact your Organization Administrator.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ borderRadius: 2.5, py: 1.2, px: 3 }}
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnauthorizedPage;
