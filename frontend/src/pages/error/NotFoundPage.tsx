import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export const NotFoundPage: React.FC = () => {
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
              bgcolor: 'rgba(79, 70, 229, 0.1)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <SearchOffOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.1em' }}>
            ERROR 404
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em', mt: 0.5, mb: 1 }}>
            Page Not Found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5, lineHeight: 1.6 }}>
            The requested application URL does not exist or has been relocated to another workspace destination.
          </Typography>

          <Button
            variant="contained"
            startIcon={<HomeOutlinedIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ borderRadius: 2.5, py: 1.2, px: 3 }}
          >
            Return to Safety
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFoundPage;
