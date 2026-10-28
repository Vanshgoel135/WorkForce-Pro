import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An error occurred while fetching data from the server. Please verify your connection or permissions.',
  onRetry,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        borderRadius: 4,
        borderColor: 'rgba(239, 68, 68, 0.25)',
        bgcolor: 'rgba(239, 68, 68, 0.03)',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'rgba(239, 68, 68, 0.1)',
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 450, mx: 'auto', mb: 3 }}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ borderRadius: 2.5 }}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );
};

export default ErrorState;
