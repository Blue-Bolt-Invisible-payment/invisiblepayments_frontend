import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Box, Avatar, Typography, IconButton,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogout } from '../utils/logout'; // logout hook accepts a callback

const AppHeader = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useLogout(onLogout); // provide resetSession from App

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Header */}
      <AppBar position="fixed" sx={{ bgcolor: '#000048', boxShadow: '0 4px 12px rgba(0, 0, 72, 0.3)', zIndex: 1200 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 1, sm: 1.5 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/logo/HeaderLogo.png"
              alt="SmartPay Logo"
              sx={{ height: { xs: '28px', sm: '35px', md: '40px', lg: '45px' }, width: 'auto', objectFit: 'contain' }}
            />
          </Box>

          {/* Profile trigger */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' } }}
            onClick={toggleSidebar}
          >
            <Avatar
              sx={{ width: { xs: 38, sm: 42 }, height: { xs: 38, sm: 42 }, bgcolor: '#ffffff', color: '#000048', mr: { xs: 1, sm: 1.5 } }}
            >
              <PersonIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
            </Avatar>
            <Typography
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {user.name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '260px', sm: '300px', md: '340px', lg: '360px' },
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {/* Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: { xs: 1.5, sm: 2 } }}>
            <IconButton onClick={toggleSidebar} sx={{ color: '#000048', p: { xs: 0.5, sm: 1 } }}>
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>

          {/* Profile Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 2.5, md: 3 } }}>
            <Avatar
              sx={{ width: { xs: 60, sm: 70, md: 80, lg: 90 }, height: { xs: 60, sm: 70, md: 80, lg: 90 }, bgcolor: '#000048', mx: 'auto', mb: { xs: 1.5, sm: 2 } }}
            >
              <PersonIcon sx={{ fontSize: { xs: 35, sm: 42, md: 50, lg: 56 } }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', opacity: 0.7, fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' } }}
            >
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }} />

          {/* Wallet Balance */}
          <List>
            <ListItem sx={{ bgcolor: '#000048', color: '#ffffff', borderRadius: { xs: 1.5, sm: 2 }, mb: 2, p: { xs: 1.5, sm: 2 } }}>
              <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48, md: 56 } }}>
                <AccountBalanceWalletIcon sx={{ color: '#ffffff', fontSize: { xs: 20, sm: 24, md: 28 } }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }, opacity: 0.9 }}>
                    Wallet Balance
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#ffffff', fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem', lg: '1.65rem' }, mt: 0.5 }}>
                    ₹{user.walletBalance?.toFixed(2) || '0.00'}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>

        {/* Logout Button at Bottom */}
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
  <ListItem
    button
    onClick={logout}
    sx={{
      bgcolor: '#000048',
      color: '#ffffff',
      borderRadius: { xs: 1.5, sm: 2 },
      p: { xs: 1.5, sm: 2 },
      justifyContent: 'flex-start',
      // prevent hover/active color changes
      '&:hover': {
        bgcolor: '#000048',
        color: '#ffffff',
      },
      '&.Mui-focusVisible': {
        bgcolor: '#000048',
        color: '#ffffff',
      },
      '&.Mui-selected': {
        bgcolor: '#000048',
        color: '#ffffff',
      },
      '&:active': {
        bgcolor: '#000048',
        color: '#ffffff',
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48, md: 56 } }}>
      <LogoutIcon sx={{ color: '#ffffff', fontSize: { xs: 20, sm: 24, md: 28 } }} />
    </ListItemIcon>
    <ListItemText
      primary={
        <Typography
          sx={{
            fontFamily: 'Gallix, sans-serif',
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            fontWeight: 'bold',
            color: '#ffffff',
          }}
        >
          Logout
        </Typography>
      }
    />
  </ListItem>
  </Box>
      </Drawer>
    </>
  );
};

export default AppHeader;
