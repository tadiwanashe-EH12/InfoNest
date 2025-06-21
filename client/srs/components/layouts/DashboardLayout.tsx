import { useState } from 'react';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Box } from '@mui/material';
import { Menu, Book, People, Event, MonetizationOn, Assessment, Settings, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Assessment />, path: '/dashboard' },
  { text: 'Books', icon: <Book />, path: '/books' },
  { text: 'Members', icon: <People />, path: '/members' },
  { text: 'Loans', icon: <Event />, path: '/loans' },
  { text: 'Fines', icon: <MonetizationOn />, path: '/fines' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1a237e',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            LibraNexus
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'white', color: '#1a237e', mr: 2 }}>
              {user?.email.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1">{user?.email}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 56,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 56,
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: 1,
            minHeight: 64,
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => router.push(item.path)}
              selected={router.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${open ? drawerWidth : 56}px)`,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};