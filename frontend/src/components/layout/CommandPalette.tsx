import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  Box,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { useAppTheme } from '../../theme/ThemeContext';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { mode, toggleTheme } = useAppTheme();

  const commands = [
    { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard', category: 'Navigation' },
    { label: 'Employees Directory', icon: <PeopleOutlineIcon />, path: '/employees', category: 'HRMS' },
    { label: 'Departments', icon: <BusinessOutlinedIcon />, path: '/departments', category: 'HRMS' },
    { label: 'Attendance & Check-in', icon: <AccessTimeOutlinedIcon />, path: '/attendance', category: 'HRMS' },
    { label: 'Leave Requests', icon: <EventBusyOutlinedIcon />, path: '/leaves', category: 'HRMS' },
    { label: 'Salary & Payroll', icon: <PaymentsOutlinedIcon />, path: '/salary', category: 'Payroll' },
    { label: 'Organization Overview', icon: <CorporateFareOutlinedIcon />, path: '/organization', category: 'Management' },
    { label: 'Users & Roles', icon: <SecurityOutlinedIcon />, path: '/users', category: 'Access Control' },
    { label: 'Role Permissions Matrix', icon: <SecurityOutlinedIcon />, path: '/permissions', category: 'Access Control' },
    { label: 'AI Workforce Assistant', icon: <SmartToyOutlinedIcon />, path: '/ai-assistant', category: 'Intelligence' },
    { label: 'My Profile', icon: <PersonOutlineIcon />, path: '/profile', category: 'Account' },
    { label: 'Notifications Center', icon: <NotificationsNoneOutlinedIcon />, path: '/notifications', category: 'Account' },
    { label: 'Settings & Preferences', icon: <SettingsOutlinedIcon />, path: '/settings', category: 'Account' },
    {
      label: `Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`,
      icon: mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />,
      action: () => toggleTheme(),
      category: 'Preferences',
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: typeof commands[0]) => {
    onClose();
    if (cmd.action) {
      cmd.action();
    } else if (cmd.path) {
      navigate(cmd.path);
    }
  };

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            top: { xs: 50, md: 80 },
            position: 'absolute',
            backdropFilter: 'blur(20px)',
            border: (theme) =>
              theme.palette.mode === 'light'
                ? '1px solid rgba(0,0,0,0.1)'
                : '1px solid rgba(255,255,255,0.15)',
          },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <SearchIcon sx={{ color: 'text.secondary' }} />
        <InputBase
          autoFocus
          placeholder="Type a command or search pages... (e.g. Employees, Leave, Payroll)"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ fontSize: '1rem', fontWeight: 500 }}
        />
        <Chip label="ESC" size="small" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
      </Box>

      <DialogContent sx={{ p: 1, maxHeight: 380, overflowY: 'auto' }}>
        {filteredCommands.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No matching commands or pages found for "{query}".
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredCommands.map((cmd, idx) => (
              <ListItemButton
                key={idx}
                onClick={() => handleSelect(cmd)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  px: 2,
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(79, 70, 229, 0.08)'
                        : 'rgba(99, 102, 241, 0.15)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: 'primary.main' }}>
                  {cmd.icon}
                </ListItemIcon>
                <ListItemText
                  primary={cmd.label}
                  slotProps={{ primary: { sx: { fontSize: '0.9rem', fontWeight: 600 } } }}
                />
                <Chip
                  label={cmd.category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.68rem', height: 22 }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>

      <Divider />
      <Box
        sx={{
          py: 1,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          Navigation & Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="↑↓ Navigate" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
          <Chip label="↵ Select" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
