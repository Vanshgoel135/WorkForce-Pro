import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

interface LoadingSkeletonProps {
  rows?: number;
  type?: 'table' | 'cards' | 'details';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 5,
  type = 'table',
}) => {
  if (type === 'cards') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Card key={i} sx={{ borderRadius: 4, p: 2 }}>
            <CardContent>
              <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 2, mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (type === 'details') {
    return (
      <Card sx={{ borderRadius: 4, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" width="25%" height={24} />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={54} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Card>
    );
  }

  // Table skeleton default
  return (
    <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="text" width="200px" height={30} />
      </Box>
      <Box sx={{ p: 2 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.8,
              borderBottom: i === rows - 1 ? 'none' : '1px solid',
              borderColor: 'divider',
              gap: 2,
            }}
          >
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="text" width="20%" height={24} />
            <Skeleton variant="text" width="25%" height={24} />
            <Skeleton variant="text" width="15%" height={24} />
            <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 2 }} />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default LoadingSkeleton;
