import React from 'react';
import { Box, Typography } from '@mui/material';

export interface LogoProps {
  variant?: 'full' | 'icon' | 'white';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'medium',
  onClick,
  className,
}) => {
  // Dimensions based on size
  const iconSize = size === 'small' ? 28 : size === 'large' ? 44 : 36;
  const fontSize = size === 'small' ? '1.1rem' : size === 'large' ? '1.65rem' : '1.35rem';
  const badgeSize = size === 'small' ? '0.62rem' : size === 'large' ? '0.75rem' : '0.68rem';

  const isWhite = variant === 'white';

  return (
    <Box
      onClick={onClick}
      className={className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'small' ? 1 : 1.25,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* High-Precision Enterprise SVG Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="wfGradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
          <linearGradient id="wfGradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B71C1C" />
            <stop offset="100%" stopColor="#8E0000" />
          </linearGradient>
          <filter id="wfGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#C62828" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Outer Squircle Container */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill={isWhite ? 'rgba(255, 255, 255, 0.15)' : 'url(#wfGradientRed)'}
          filter={isWhite ? undefined : 'url(#wfGlow)'}
          stroke={isWhite ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)'}
          strokeWidth="1.5"
        />

        {/* Interlocking Workforce "W" Chevron Geometry */}
        {/* Left pillar */}
        <path
          d="M13 14L18 31L22 21L19 14H13Z"
          fill="#FFFFFF"
          fillOpacity={isWhite ? '0.95' : '1'}
        />
        {/* Right pillar */}
        <path
          d="M35 14L30 31L26 21L29 14H35Z"
          fill="#FFFFFF"
          fillOpacity={isWhite ? '0.95' : '1'}
        />
        {/* Central Dynamic Apex Node */}
        <path
          d="M24 16L27.5 25.5H20.5L24 16Z"
          fill={isWhite ? '#FFFFFF' : '#FFCDD2'}
        />
        {/* Foundation Base Connector */}
        <path
          d="M19 33L24 35L29 33L27.5 30H20.5L19 33Z"
          fill="#FFFFFF"
          fillOpacity={isWhite ? '0.9' : '0.95'}
        />
      </svg>

      {/* Typography: "WorkForce Pro" */}
      {variant !== 'icon' && (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6 }}>
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: fontSize,
              letterSpacing: '-0.03em',
              fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
              color: isWhite ? '#FFFFFF' : 'text.primary',
              lineHeight: 1,
            }}
          >
            WorkForce
          </Typography>

          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isWhite ? 'rgba(255, 255, 255, 0.2)' : '#C62828',
              color: '#FFFFFF',
              px: 0.75,
              py: 0.2,
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: badgeSize,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
              border: isWhite ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
              boxShadow: isWhite ? 'none' : '0 2px 6px rgba(198, 40, 40, 0.35)',
            }}
          >
            PRO
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Logo;

