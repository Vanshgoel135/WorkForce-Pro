import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string | undefined | null;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();
  const label = status;
  let sx = {};

  switch (normalized) {
    case 'APPROVED':
    case 'PRESENT':
      sx = {
        bgcolor: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        fontWeight: 600,
        border: '1px solid rgba(16, 185, 129, 0.25)',
      };
      break;
    case 'PENDING':
      sx = {
        bgcolor: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        fontWeight: 600,
        border: '1px solid rgba(245, 158, 11, 0.25)',
      };
      break;
    case 'REJECTED':
    case 'ABSENT':
      sx = {
        bgcolor: 'rgba(239, 68, 68, 0.12)',
        color: '#ef4444',
        fontWeight: 600,
        border: '1px solid rgba(239, 68, 68, 0.25)',
      };
      break;
    case 'ADMIN':
      sx = {
        bgcolor: '#FEF2F2',
        color: '#991B1B',
        fontWeight: 700,
        border: '1px solid #FECACA',
      };
      break;
    case 'HR':
      sx = {
        bgcolor: 'rgba(6, 182, 212, 0.12)',
        color: '#06b6d4',
        fontWeight: 700,
        border: '1px solid rgba(6, 182, 212, 0.25)',
      };
      break;
    case 'EMPLOYEE':
      sx = {
        bgcolor: 'rgba(100, 116, 139, 0.12)',
        color: '#64748b',
        fontWeight: 600,
        border: '1px solid rgba(100, 116, 139, 0.25)',
      };
      break;
    default:
      sx = {
        bgcolor: 'action.hover',
        fontWeight: 500,
      };
  }

  return <Chip label={label} size={size} sx={sx} />;
};

export default StatusBadge;
