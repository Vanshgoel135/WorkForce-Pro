import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  breadcrumbs,
}) => {
  const location = useLocation();

  // Generate fallback breadcrumbs if not provided
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const defaultBreadcrumbs = [
    { label: 'WorkForce Pro', path: '/' },
    ...pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const formatted = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label: formatted, path: index === pathSegments.length - 1 ? undefined : url };
    }),
  ];

  const crumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <Box sx={{ mb: 3.5 }}>
      {crumbs.length > 1 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.9rem' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 1 }}
        >
          {crumbs.map((crumb, idx) =>
            crumb.path ? (
              <MuiLink
                key={idx}
                component={Link}
                to={crumb.path}
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {crumb.label}
              </MuiLink>
            ) : (
              <Typography
                key={idx}
                sx={{
                  color: 'text.primary',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.875rem' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>{action}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader;
