import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  color?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = '#4f46e5',
  loading = false,
}) => {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? '#ffffff'
              : 'linear-gradient(145deg, #131b2e 0%, #0d1525 100%)',
          border: (theme) =>
            theme.palette.mode === 'light'
              ? '1px solid #e2e8f0'
              : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.02)'
              : '0 4px 20px rgba(0,0,0,0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 4,
            height: '100%',
            backgroundColor: color,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.75rem',
                }}
              >
                {title}
              </Typography>
              {loading ? (
                <Skeleton width={80} height={40} sx={{ mt: 1 }} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mt: 0.5,
                    color: 'text.primary',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {value}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}18`,
                color: color,
              }}
            >
              {icon}
            </Box>
          </Box>

          {(subtitle || trend) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              {trend && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: trend.isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: trend.isPositive ? '#10b981' : '#ef4444',
                  }}
                >
                  {trend.value}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
