import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [filterTab, setFilterTab] = useState<'ALL' | 'UNREAD'>('ALL');

  const filtered = notifications.filter((n) => (filterTab === 'UNREAD' ? !n.read : true));

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon color="success" />;
      case 'warning':
        return <WarningAmberOutlinedIcon color="warning" />;
      default:
        return <InfoOutlinedIcon color="info" />;
    }
  };

  return (
    <Box>
      <PageHeader
        title="Notifications Center"
        subtitle="Review platform announcements, attendance milestones, and approval alerts."
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<DoneAllIcon />}
                onClick={markAllAsRead}
                sx={{ borderRadius: 2.5 }}
              >
                Mark All as Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<DeleteOutlineIcon />}
                onClick={clearAll}
                sx={{ borderRadius: 2.5 }}
              >
                Clear All
              </Button>
            )}
          </Box>
        }
      />

      <Card sx={{ borderRadius: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={filterTab}
            onChange={(_, val) => setFilterTab(val)}
          >
            <Tab label={`All Alerts (${notifications.length})`} value="ALL" sx={{ fontWeight: 600 }} />
            <Tab label={`Unread (${unreadCount})`} value="UNREAD" sx={{ fontWeight: 600 }} />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState
              title="No notifications to show"
              description="You're all caught up! New system notifications and HR alerts will appear here."
              icon={<NotificationsNoneOutlinedIcon sx={{ fontSize: 32 }} />}
            />
          ) : (
            <List disablePadding>
              {filtered.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: item.read ? 'transparent' : 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>{getIcon(item.type)}</ListItemIcon>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.25 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: item.read ? 600 : 800 }}>
                          {item.title}
                        </Typography>
                        {!item.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        {item.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {item.timestamp}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.link && (
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => {
                          markAsRead(item.id);
                          navigate(item.link!);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                    {!item.read && (
                      <Tooltip title="Mark as Read">
                        <IconButton size="small" onClick={() => markAsRead(item.id)}>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationsPage;
