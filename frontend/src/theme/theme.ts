import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#C62828', // Deep Red (Vensure brand style)
      light: '#E53935', // Secondary Red
      dark: '#B71C1C', // Accent Deep
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1F2937', // Luxury Charcoal
      light: '#374151',
      dark: '#111827',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#991B1B',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F9FAFB' : '#0F172A',
      paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
    },
    text: {
      primary: mode === 'light' ? '#1F2937' : '#F9FAFB',
      secondary: mode === 'light' ? '#6B7280' : '#9CA3AF',
    },
    divider: mode === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.025em',
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.625rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.015em',
      lineHeight: 1.35,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '-0.005em',
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.825rem',
      fontWeight: 500,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0F172A',
          color: mode === 'light' ? '#1F2937' : '#F9FAFB',
          scrollbarColor: mode === 'light' ? '#E5E7EB #FFFFFF' : '#334155 #0F172A',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            backgroundColor: mode === 'light' ? '#D1D5DB' : '#334155',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0 4px 14px rgba(198, 40, 40, 0.28)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #B71C1C 0%, #C62828 100%)',
          },
        },
        outlined: {
          borderColor: mode === 'light' ? '#E5E7EB' : 'rgba(255,255,255,0.15)',
          color: mode === 'light' ? '#1F2937' : '#F9FAFB',
          '&:hover': {
            borderColor: '#C62828',
            backgroundColor: mode === 'light' ? '#FEF2F2' : 'rgba(198, 40, 40, 0.1)',
            color: '#C62828',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
          border: mode === 'light' ? '1px solid #E5E7EB' : '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            mode === 'light'
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)'
              : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.25s ease',
          '&:hover': {
            boxShadow:
              mode === 'light'
                ? '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
                : '0 12px 30px rgba(0,0,0,0.45)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === 'light' ? '1px solid #F3F4F6' : '1px solid rgba(255,255,255,0.06)',
          padding: '14px 16px',
          fontSize: '0.85rem',
        },
        head: {
          fontWeight: 700,
          color: mode === 'light' ? '#6B7280' : '#9CA3AF',
          backgroundColor: mode === 'light' ? '#F9FAFB' : '#111827',
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '& fieldset': {
            borderColor: mode === 'light' ? '#E5E7EB' : 'rgba(255,255,255,0.15)',
          },
          '&:hover fieldset': {
            borderColor: '#E53935',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#C62828',
            borderWidth: '1.5px',
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
};

export default createAppTheme;
