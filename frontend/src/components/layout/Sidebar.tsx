import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const navGroups = isAdminOrHr
    ? [
        {
          title: 'OVERVIEW',
          items: [
            { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
          ],
        },
        {
          title: 'WORKFORCE',
          items: [
            { label: 'Employees', icon: <PeopleOutlineIcon />, path: '/employees' },
            { label: 'Departments', icon: <BusinessOutlinedIcon />, path: '/departments' },
            { label: 'Attendance', icon: <AccessTimeOutlinedIcon />, path: '/attendance' },
            { label: 'Leave Requests', icon: <EventBusyOutlinedIcon />, path: '/leaves' },
          ],
        },
        {
          title: 'PAYROLL & ORG',
          items: [
            { label: 'Salary & Payroll', icon: <PaymentsOutlinedIcon />, path: '/salary' },
            { label: 'Organization', icon: <CorporateFareOutlinedIcon />, path: '/organization' },
          ],
        },
        {
          title: 'ACCESS & ROLES',
          items: [
            { label: 'Users & Access', icon: <SecurityOutlinedIcon />, path: '/users' },
            { label: 'Permissions Matrix', icon: <HubOutlinedIcon />, path: '/permissions' },
          ],
        },
        {
          title: 'INTELLIGENCE & SYSTEM',
          items: [
            { label: 'AI Assistant', icon: <SmartToyOutlinedIcon />, path: '/ai-assistant', highlight: true },
            { label: 'Notifications', icon: <NotificationsNoneOutlinedIcon />, path: '/notifications' },
            { label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' },
          ],
        },
      ]
    : [
        {
          title: 'MY WORKSPACE',
          items: [
            { label: 'Overview', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
            { label: 'My Attendance', icon: <AccessTimeOutlinedIcon />, path: '/attendance' },
            { label: 'My Leave Requests', icon: <EventBusyOutlinedIcon />, path: '/leaves' },
            { label: 'My Pay Slips', icon: <PaymentsOutlinedIcon />, path: '/salary' },
            { label: 'Departments', icon: <BusinessOutlinedIcon />, path: '/departments' },
            { label: 'My Profile', icon: <PeopleOutlineIcon />, path: '/profile' },
          ],
        },
        {
          title: 'INTELLIGENCE & SYSTEM',
          items: [
            { label: 'AI Assistant', icon: <SmartToyOutlinedIcon />, path: '/ai-assistant', highlight: true },
            { label: 'Notifications', icon: <NotificationsNoneOutlinedIcon />, path: '/notifications' },
            { label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' },
          ],
        },
      ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileOpen) onClose();
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Logo size="medium" onClick={() => handleNavigate('/dashboard')} />

        {mobileOpen && (
          <IconButton onClick={onClose} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {navGroups.map((group, groupIdx) => (
          <Box key={groupIdx} sx={{ mb: 2.5 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                mb: 1,
                display: 'block',
                fontWeight: 800,
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: '#9CA3AF',
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item, itemIdx) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={itemIdx}
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      borderRadius: 2.5,
                      mb: 0.5,
                      py: 1,
                      px: 1.5,
                      position: 'relative',
                      transition: 'all 0.15s ease',
                      bgcolor: isActive ? '#FEF2F2' : 'transparent',
                      color: isActive ? '#C62828' : '#374151',
                      borderLeft: isActive ? '3px solid #C62828' : '3px solid transparent',
                      '&:hover': {
                        bgcolor: isActive ? '#FEF2F2' : '#F9FAFB',
                        color: '#C62828',
                        '& .MuiListItemIcon-root': {
                          color: '#C62828',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive
                          ? '#C62828'
                          : item.highlight
                          ? '#E53935'
                          : '#6B7280',
                        transition: 'color 0.15s',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.86rem',
                            fontWeight: isActive ? 700 : 500,
                          },
                        },
                      }}
                    />
                    {item.highlight && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#C62828',
                          boxShadow: '0 0 8px #C62828',
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}

        <Divider sx={{ my: 2, borderColor: '#E5E7EB' }} />

        {/* Corporate Website Quick Switch */}
        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 2.5,
            py: 1,
            px: 1.5,
            color: '#4B5563',
            '&:hover': { bgcolor: '#F9FAFB', color: '#C62828' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#6B7280' }}>
            <LanguageOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Corporate Website"
            slotProps={{
              primary: {
                sx: { fontSize: '0.84rem', fontWeight: 600 },
              },
            }}
          />
        </ListItemButton>
      </Box>

      {/* User Session Bottom Card */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #E5E7EB',
          bgcolor: '#FAFAFA',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', overflow: 'hidden' }}
            onClick={() => handleNavigate('/profile')}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#C62828',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 700, fontSize: '0.82rem', maxWidth: 130, color: '#111827' }}
              >
                {user?.email || 'User'}
              </Typography>
              <Box sx={{ mt: 0.2 }}>
                <StatusBadge status={user?.role} size="small" />
              </Box>
            </Box>
          </Box>

          <Tooltip title="Log Out">
            <IconButton onClick={logout} size="small" sx={{ color: '#6B7280', '&:hover': { color: '#C62828' } }}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Fixed Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid #E5E7EB',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
