import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusBadgeProps {
  status: string | undefined | null;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let color: ChipProps['color'] = 'default';
  let label = status;
  let sx = {};

  switch (normalized) {
    case 'APPROVED':
    case 'PRESENT':
      color = 'success';
      sx = {
        bgcolor: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        fontWeight: 600,
        border: '1px solid rgba(16, 185, 129, 0.25)',
      };
      break;
    case 'PENDING':
      color = 'warning';
      sx = {
        bgcolor: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        fontWeight: 600,
        border: '1px solid rgba(245, 158, 11, 0.25)',
      };
      break;
    case 'REJECTED':
    case 'ABSENT':
      color = 'error';
      sx = {
        bgcolor: 'rgba(239, 68, 68, 0.12)',
        color: '#ef4444',
        fontWeight: 600,
        border: '1px solid rgba(239, 68, 68, 0.25)',
      };
      break;
    case 'ADMIN':
      color = 'primary';
      sx = {
        bgcolor: 'rgba(79, 70, 229, 0.12)',
        color: '#6366f1',
        fontWeight: 700,
        border: '1px solid rgba(79, 70, 229, 0.25)',
      };
      break;
    case 'HR':
      color = 'secondary';
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
