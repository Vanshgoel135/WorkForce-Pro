import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../theme/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import StatusBadge from '../common/StatusBadge';

interface HeaderProps {
  onMobileDrawerToggle: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileDrawerToggle,
  onOpenCommandPalette,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // User menu anchor
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  // Notifications popover anchor
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => setUserAnchorEl(null);

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleCloseNotif = () => setNotifAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        color: '#1F2937',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: 64 }}>
        {/* Left Side: Mobile Menu Button & Search Trigger */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMobileDrawerToggle}
            sx={{ display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Quick Search Bar (Command Palette trigger) */}
          <Box
            onClick={onOpenCommandPalette}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 0.75,
              borderRadius: 3,
              cursor: 'pointer',
              bgcolor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s ease',
              width: { xs: 160, sm: 260, md: 320 },
              '&:hover': {
                borderColor: '#C62828',
                bgcolor: '#FFFFFF',
              },
            }}
          >
            <SearchIcon sx={{ color: '#9CA3AF', fontSize: '1.1rem' }} />
            <Typography
              variant="body2"
              noWrap
              sx={{ color: '#6B7280', fontSize: '0.825rem', flex: 1 }}
            >
              Search workforce, employees...
            </Typography>
            <Chip
              label="Ctrl+K"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                fontWeight: 700,
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: '#E5E7EB',
                color: '#4B5563',
              }}
            />
          </Box>
        </Box>

        {/* Right Side: Org Badge, AI Button, Theme Toggle, Notifications, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Org Badge */}
          {user?.organizationId && (
            <Chip
              icon={<BusinessIcon sx={{ fontSize: '0.9rem !important', color: '#C62828 !important' }} />}
              label={`WorkForce Pro Corporate`}
              size="small"
              variant="outlined"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                fontWeight: 700,
                fontSize: '0.75rem',
                borderColor: '#FECACA',
                bgcolor: '#FEF2F2',
                color: '#991B1B',
              }}
            />
          )}

          {/* Quick AI Assistant Button */}
          <Tooltip title="AI Workforce Assistant">
            <IconButton
              onClick={() => navigate('/ai-assistant')}
              sx={{
                color: '#C62828',
                bgcolor: '#FEF2F2',
                '&:hover': {
                  bgcolor: '#FEE2E2',
                },
              }}
            >
              <SmartToyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Theme Mode Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications Button */}
          <Tooltip title="Notifications">
            <IconButton onClick={handleOpenNotif} color="inherit">
              <Badge
                badgeContent={unreadCount}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#C62828',
                    color: '#FFFFFF',
                    fontWeight: 700,
                  },
                }}
                max={99}
              >
                <NotificationsNoneOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <Popover
            open={Boolean(notifAnchorEl)}
            anchorEl={notifAnchorEl}
            onClose={handleCloseNotif}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  width: 340,
                  maxHeight: 460,
                  borderRadius: 3,
                  mt: 1.5,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  border: '1px solid #E5E7EB',
                },
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827' }}>
                Notifications ({unreadCount} new)
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead} sx={{ fontSize: '0.75rem', p: 0.5, color: '#C62828', fontWeight: 700 }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <Divider />
            <List disablePadding sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    No notifications yet.
                  </Typography>
                </Box>
              ) : (
                notifications.map((notif) => (
                  <ListItem
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.link) {
                        navigate(notif.link);
                        handleCloseNotif();
                      }
                    }}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: notif.read ? 'transparent' : '#FEF2F2',
                      '&:hover': { bgcolor: '#FEE2E2' },
                      borderBottom: '1px solid #F3F4F6',
                      py: 1.2,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: notif.type === 'success' ? '#10B981' : '#C62828' }}>
                      {notif.type === 'success' ? <CheckCircleOutlineIcon fontSize="small" /> : <InfoOutlinedIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notif.title}
                      secondary={
                        <>
                          <Typography variant="caption" sx={{ display: 'block', color: '#4B5563' }}>
                            {notif.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.68rem' }}>
                            {notif.timestamp}
                          </Typography>
                        </>
                      }
                      slotProps={{ primary: { sx: { fontSize: '0.84rem', fontWeight: notif.read ? 600 : 800, color: '#111827' } } }}
                    />
                  </ListItem>
                ))
              )}
            </List>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  navigate('/notifications');
                  handleCloseNotif();
                }}
                sx={{ fontSize: '0.8rem', color: '#C62828', fontWeight: 700 }}
              >
                View All Notifications
              </Button>
            </Box>
          </Popover>

          {/* User Avatar Menu Trigger */}
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, ml: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#C62828',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(198, 40, 40, 0.3)',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  width: 230,
                  borderRadius: 3,
                  mt: 1.5,
                  p: 0.5,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#111827' }}>
                {user?.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <StatusBadge status={user?.role} size="small" />
              </Box>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                navigate('/');
                handleCloseUserMenu();
              }}
            >
              <ListItemIcon>
                <LanguageOutlinedIcon fontSize="small" sx={{ color: '#C62828' }} />
              </ListItemIcon>
              <ListItemText primary="Public Website" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate('/profile');
                handleCloseUserMenu();
              }}
            >
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate('/settings');
                handleCloseUserMenu();
              }}
            >
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                logout();
              }}
              sx={{ color: '#DC2626' }}
            >
              <ListItemIcon sx={{ color: '#DC2626' }}>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
