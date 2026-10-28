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
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
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
              bgcolor: (theme: any) =>
                theme.palette.mode === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid',
              borderColor: (theme: any) =>
                theme.palette.mode === 'light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
              width: { xs: 160, sm: 260, md: 320 },
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: (theme: any) =>
                  theme.palette.mode === 'light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
            <Typography
              variant="body2"
              noWrap
              sx={{ color: 'text.secondary', fontSize: '0.825rem', flex: 1 }}
            >
              Search or press...
            </Typography>
            <Chip
              label="Ctrl+K"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                fontWeight: 700,
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: 'action.hover',
              }}
            />
          </Box>
        </Box>

        {/* Right Side: Org Badge, AI Button, Theme Toggle, Notifications, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Org Badge */}
          {user?.organizationId && (
            <Chip
              icon={<BusinessIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={`Org #${user.organizationId}`}
              size="small"
              variant="outlined"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}

          {/* Quick AI Assistant Button */}
          <Tooltip title="AI Workforce Assistant">
            <IconButton
              onClick={() => navigate('/ai-assistant')}
              sx={{
                color: 'primary.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(79, 70, 229, 0.08)'
                    : 'rgba(99, 102, 241, 0.15)',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(79, 70, 229, 0.15)'
                      : 'rgba(99, 102, 241, 0.25)',
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
              <Badge badgeContent={unreadCount} color="error" max={99}>
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
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                },
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Notifications ({unreadCount} new)
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead} sx={{ fontSize: '0.75rem', p: 0.5 }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <Divider />
            <List disablePadding sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                      bgcolor: notif.read ? 'transparent' : 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' },
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.2,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: notif.type === 'success' ? 'success.main' : 'info.main' }}>
                      {notif.type === 'success' ? <CheckCircleOutlineIcon fontSize="small" /> : <InfoOutlinedIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notif.title}
                      secondary={
                        <>
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                            {notif.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.68rem' }}>
                            {notif.timestamp}
                          </Typography>
                        </>
                      }
                      slotProps={{ primary: { sx: { fontSize: '0.84rem', fontWeight: notif.read ? 500 : 700 } } }}
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
                sx={{ fontSize: '0.8rem' }}
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
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
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
                  width: 220,
                  borderRadius: 3,
                  mt: 1.5,
                  p: 0.5,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                {user?.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <StatusBadge status={user?.role} size="small" />
              </Box>
            </Box>
            <Divider sx={{ my: 0.5 }} />
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
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
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
