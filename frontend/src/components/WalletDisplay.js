import React, { useEffect, useState, memo } from 'react';
import { Button, Typography, Box, Alert, Card, CardContent, Avatar, Grid, Paper, Divider, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import NfcIcon from '@mui/icons-material/Nfc';
import SecurityIcon from '@mui/icons-material/Security';
import { getWalletBalance } from '../api';
import AppHeader from './AppHeader';

const WalletDisplay = memo(({ user, onContinue }) => {
  const [balance, setBalance] = useState(user.walletBalance || 0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getWalletBalance(user.id);
        setBalance(response.data);
        setError(''); // Clear any previous errors
        setLoading(false);
      } catch (err) {
        // Only show error if we don't have a fallback balance
        if (!user.walletBalance && user.walletBalance !== 0) {
          setError('Failed to load wallet balance.');
        }
        // Fallback to user's wallet balance from authentication
        setBalance(user.walletBalance || 0);
        setLoading(false);
      }
    };
    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - NEVER again

  return (
    <>
      {/* Header */}
      <AppHeader user={user} />

      {/* Page Content */}
      <Box 
        sx={{ 
          width: '100%',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          pt: { xs: '90px', sm: '100px' },
          pb: { xs: 3, sm: 4 },
          px: { xs: 1.5, sm: 2, md: 2.5 }
        }}
      >
        <Box 
          sx={{ 
            maxWidth: { xs: '100%', sm: '90%', md: '650px', lg: '700px' },
            width: '100%',
            mx: 'auto'
          }}
        >
          {/* Welcome Section - First */}
          <Paper 
            elevation={3}
            sx={{ 
              mb: { xs: 2.5, sm: 3 },
              bgcolor: '#ffffff',
              borderRadius: { xs: 2, sm: 3 },
              p: { xs: 2.5, sm: 3 },
              borderLeft: '4px solid #000048'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: { xs: 55, sm: 60, md: 65 }, 
                    height: { xs: 55, sm: 60, md: 65 }, 
                    bgcolor: '#000048',
                    mr: { xs: 2, sm: 2.5 }
                  }}
                >
                  <PersonIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 } }} />
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: 'Gallix, sans-serif',
                        color: '#000048',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' }
                      }}
                    >
                      Hello, {user.name.split(' ')[0]}!
                    </Typography>
                    <VerifiedIcon sx={{ color: '#4caf50', fontSize: { xs: 22, sm: 24 } }} />
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      opacity: 0.7,
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }
                    }}
                  >
                    Welcome back to SmartPay
                  </Typography>
                </Box>
              </Box>
              <Chip 
                icon={<SecurityIcon />}
                label="Verified Account"
                color="success"
                sx={{ 
                  fontFamily: 'Gallix, sans-serif',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'flex' }
                }}
              />
            </Box>
          </Paper>

          {/* Main Wallet Balance Card - Second */}
          <Card 
            sx={{ 
              mb: { xs: 2.5, sm: 3 },
              background: 'linear-gradient(135deg, #000048 0%, #000066 100%)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 0, 72, 0.3)',
              borderRadius: { xs: 3, sm: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)'
              }
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 3.5, md: 4 }, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: { xs: 32, sm: 36 }, mr: 1.5, opacity: 0.9 }} />
                <Typography 
                  sx={{ 
                    fontFamily: 'Gallix, sans-serif',
                    opacity: 0.95,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}
                >
                  Your Wallet Balance
                </Typography>
              </Box>
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontFamily: 'Gallix, sans-serif',
                  fontWeight: 'bold',
                  fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4rem' },
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {loading ? '...' : `₹${balance.toFixed(2)}`}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography 
                  sx={{ 
                    fontFamily: 'Gallix, sans-serif',
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    opacity: 0.85
                  }}
                >
                  Available for shopping
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Action Cards */}
          <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: { xs: 2.5, sm: 3 } }}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: { xs: 2, sm: 3 },
                  bgcolor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}
              >
                <LocalMallIcon sx={{ fontSize: { xs: 40, sm: 45 }, color: '#000048', mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  Shop with Confidence
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    opacity: 0.6
                  }}
                >
                  Secure & Fast Checkout
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: { xs: 2, sm: 3 },
                  bgcolor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}
              >
                <NfcIcon sx={{ fontSize: { xs: 40, sm: 45 }, color: '#000048', mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  RFID Technology
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    opacity: 0.6
                  }}
                >
                  Contactless Shopping
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Continue Shopping Button */}
          <Button 
            variant="contained" 
            onClick={onContinue} 
            fullWidth
            startIcon={<ShoppingCartIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />}
            sx={{ 
              py: { xs: 2, sm: 2.25, md: 2.5 },
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              fontFamily: 'Gallix, sans-serif',
              fontWeight: 'bold',
              bgcolor: '#000048',
              borderRadius: { xs: 2, sm: 3 },
              boxShadow: '0 4px 12px rgba(0, 0, 72, 0.3)',
              textTransform: 'none',
              letterSpacing: '0.5px',
              '&:hover': {
                bgcolor: '#000066',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(0, 0, 72, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Shopping
          </Button>

          <Divider sx={{ my: { xs: 2.5, sm: 3 } }}>
            <Chip 
              label="SmartPay Features" 
              size="small"
              sx={{ 
                fontFamily: 'Gallix, sans-serif',
                bgcolor: '#f5f5f5',
                color: '#000048',
                fontWeight: 600
              }}
            />
          </Divider>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 3,
              fontFamily: 'Gallix, sans-serif'
            }}
          >
            {error}
          </Alert>
        )}

          {/* How It Works Section */}
          <Paper 
            elevation={2}
            sx={{ 
              bgcolor: '#ffffff',
              borderRadius: { xs: 2, sm: 3 },
              p: { xs: 2.5, sm: 3 },
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                mb: 2,
                textAlign: 'center'
              }}
            >
              How to Shop
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 50, sm: 55 },
                      height: { xs: 50, sm: 55 },
                      borderRadius: '50%',
                      bgcolor: '#000048',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Gallix, sans-serif',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                      mx: 'auto',
                      mb: 1.5
                    }}
                  >
                    1
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    Scan Items
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      opacity: 0.6
                    }}
                  >
                    Use RFID device
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 50, sm: 55 },
                      height: { xs: 50, sm: 55 },
                      borderRadius: '50%',
                      bgcolor: '#000048',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Gallix, sans-serif',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                      mx: 'auto',
                      mb: 1.5
                    }}
                  >
                    2
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    Review Cart
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      opacity: 0.6
                    }}
                  >
                    Check your items
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 50, sm: 55 },
                      height: { xs: 50, sm: 55 },
                      borderRadius: '50%',
                      bgcolor: '#000048',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Gallix, sans-serif',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                      mx: 'auto',
                      mb: 1.5
                    }}
                  >
                    3
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    Pay Instantly
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      opacity: 0.6
                    }}
                  >
                    From your wallet
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </>
  );
});

export default WalletDisplay;
