import React, { useState } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AppHeader from './AppHeader';

const CartReview = ({ user, cart, total, onPayment, onBack,onLogout  }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  const handleCompleteShoppingClick = () => {
    setError('');

    // Validation: Check if cart is empty
    if (!cart || cart.length === 0) {
      setError('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Handle total as both number and object
    const totalAmount = typeof total === 'object' ? (total.total || 0) : (total || 0);

    // Validation: Check if wallet has sufficient balance
    if (user.walletBalance < totalAmount) {
      setError(`Insufficient Wallet Balance. You need ₹${(totalAmount - user.walletBalance).toFixed(2)} more to complete this purchase.`);
      return;
    }

    // Show confirmation dialog
    setOpenDialog(true);
  };

  const handleConfirmPayment = () => {
    setOpenDialog(false);
    onPayment();
  };

  const handleCancelPayment = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {/* Header */}
      <AppHeader user={user} onLogout={onLogout} />

      {/* Page Content */}
      <Box 
        sx={{ 
          width: '100%',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          pt: { xs: '90px', sm: '100px' },
          pb: { xs: 3, sm: 4 }
        }}
      >
        <Box 
          sx={{ 
            maxWidth: { xs: '95%', sm: 900, md: 1000, lg: 1100 },
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: 'Gallix, sans-serif',
              color: '#000048',
              fontWeight: 'bold',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
            }}
          >
            Review Your Cart
          </Typography>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            icon={<WarningIcon />}
            sx={{ 
              mb: 3,
              fontFamily: 'Gallix, sans-serif',
              fontSize: '1rem'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Cart Items */}
        <Paper sx={{ mb: 3, p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCartIcon sx={{ color: '#000048', mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontWeight: 'bold'
              }}
            >
              Cart Items ({cart.length})
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {cart.map((item) => (
              <ListItem 
                key={item.id}
                sx={{ 
                  py: 2,
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <Avatar 
                  src={item.item.imageUrl} 
                  variant="rounded"
                  sx={{ 
                    width: 60, 
                    height: 60,
                    mr: 2,
                    bgcolor: '#f0f0f0'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      fontWeight: 'bold'
                    }}
                  >
                    {item.item.name} x {item.quantity}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Gallix, sans-serif',
                      color: '#000048',
                      opacity: 0.7
                    }}
                  >
                    {item.item.brand} • {item.item.unit}
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontWeight: 'bold'
                  }}
                >
                  ₹{(item.item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Summary Card */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048' }}>
                  Subtotal:
                </Typography>
                <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold' }}>
                  ₹{Number(typeof total === 'object' ? (total.total || 0) : (total || 0)).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048' }}>
                  Tax & Fees:
                </Typography>
                <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: 'success.main', fontWeight: 'bold' }}>
                  ₹0.00
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold' }}>
                  Total Amount:
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold' }}>
                  ₹{Number(typeof total === 'object' ? (total.total || 0) : (total || 0)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Wallet Balance Info */}
        <Card sx={{ mb: 3, bgcolor: '#000048', color: '#ffffff', borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontFamily: 'Gallix, sans-serif', opacity: 0.8, mb: 1 }}>
                  Current Wallet Balance:
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: 'Gallix, sans-serif', fontWeight: 'bold' }}>
                  ₹{user.walletBalance.toFixed(2)}
                </Typography>
                <Typography sx={{ fontFamily: 'Gallix, sans-serif', mt: 1, opacity: 0.8 }}>
                  Balance After Purchase:
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Gallix, sans-serif', 
                    fontWeight: 'bold',
                    color: (() => {
                      const totalAmount = typeof total === 'object' ? (total.total || 0) : (total || 0);
                      return user.walletBalance - totalAmount >= 0 ? '#4caf50' : '#f44336';
                    })()
                  }}
                >
                  ₹{(() => {
                    const totalAmount = typeof total === 'object' ? (total.total || 0) : (total || 0);
                    return (user.walletBalance - totalAmount).toFixed(2);
                  })()}
                </Typography>
              </Box>
              <AccountBalanceWalletIcon sx={{ fontSize: 60, opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            fullWidth
            sx={{ 
              py: 2,
              fontSize: '1.1rem',
              fontFamily: 'Gallix, sans-serif',
              fontWeight: 'bold',
              borderColor: '#000048',
              color: '#000048',
              '&:hover': {
                borderColor: '#000066',
                bgcolor: 'rgba(0, 0, 72, 0.04)'
              }
            }}
          >
            Back to Cart
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCompleteShoppingClick}
            fullWidth
            sx={{ 
              py: 2,
              fontSize: '1.1rem',
              fontFamily: 'Gallix, sans-serif',
              fontWeight: 'bold',
              bgcolor: '#000048',
              '&:hover': {
                bgcolor: '#000066'
              }
            }}
          >
            Complete Shopping
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCancelPayment}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: { xs: 2, sm: 3 },
              maxWidth: { xs: '90%', sm: '500px', md: '560px' },
              borderRadius: { xs: 2, sm: 2.5, md: 3 }
            }
          }}
        >
          <DialogTitle sx={{ 
            fontFamily: 'Gallix, sans-serif', 
            color: '#000048', 
            fontWeight: 'bold',
            fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' },
            p: { xs: 2, sm: 2.5, md: 3 }
          }}>
            End Shopping?
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography sx={{ 
              fontFamily: 'Gallix, sans-serif', 
              color: '#000048', 
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }
            }}>
              Are you sure you want to complete your shopping and proceed with payment?
            </Typography>
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: { xs: 1.5, sm: 2 }, 
              borderRadius: { xs: 1.5, sm: 2 }
            }}>
              <Typography sx={{ 
                fontFamily: 'Gallix, sans-serif', 
                color: '#000048',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                mb: 0.5
              }}>
                <strong>Total Amount:</strong> ₹{Number(typeof total === 'object' ? (total.total || 0) : (total || 0)).toFixed(2)}
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Gallix, sans-serif', 
                color: '#000048',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
              }}>
                <strong>Payment Method:</strong> Wallet
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 },
            gap: { xs: 1, sm: 1.5 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button 
              onClick={handleCancelPayment}
              fullWidth
              sx={{ 
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                py: { xs: 1, sm: 1.2 },
                order: { xs: 2, sm: 1 }
              }}
            >
              No, Continue Shopping
            </Button>
            <Button 
              onClick={handleConfirmPayment} 
              variant="contained"
              fullWidth
              sx={{ 
                fontFamily: 'Gallix, sans-serif',
                bgcolor: '#000048',
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                py: { xs: 1, sm: 1.2 },
                order: { xs: 1, sm: 2 },
                '&:hover': {
                  bgcolor: '#000066'
                }
              }}
            >
              Yes, Proceed to Pay
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default CartReview;
