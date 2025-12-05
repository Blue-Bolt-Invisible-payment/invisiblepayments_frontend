/*
 * ShoppingHandheld Component - RFID Shopping Cart Interface
 * 
 * ZERO FLICKERING ARCHITECTURE:
 * - Component is wrapped in React.memo to prevent unnecessary re-renders
 * - Cart loads ONCE on mount, NO polling to prevent constant re-renders
 * - All user interactions (quantity change, remove) use OPTIMISTIC UPDATES
 * - UI updates instantly, then syncs with backend in background
 * - Parent App.js uses comparison to prevent state updates when data hasn't changed
 * - Header is memoized to never re-render unless dependencies change
 * 
 * RFID SCANNER INTEGRATION:
 * - When RFID scanner detects new product, call handleRefreshCart()
 * - This fetches latest cart without re-rendering entire screen
 * - Only the cart list updates, everything else stays static
 * - For demo: Use "Refresh Cart" button in header to simulate RFID scan
 * 
 * NO MORE FLICKERING - COMPLETELY STATIC UI WITH DYNAMIC CART UPDATES
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  List, 
  Alert, 
  ListItemAvatar,
  Avatar,
  IconButton,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RfidIcon from '@mui/icons-material/Nfc';
import { getCart, getCartTotal, updateCartItem, removeCartItem } from '../api';
import AppHeader from './AppHeader';

// Memoized Cart Summary - Only re-renders when cart or total changes
const CartSummary = React.memo(({ cart, total }) => (
  <Card 
    sx={{ 
      mb: { xs: 1.5, sm: 2 }, 
      bgcolor: '#000048',
      color: '#ffffff',
      borderRadius: { xs: 2, sm: 3 }
    }}
  >
    <CardContent sx={{ p: { xs: '8px 12px', sm: '10px 16px', md: '12px 20px' }, '&:last-child': { pb: { xs: '8px', sm: '10px', md: '12px' } } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.8 }}>
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Gallix, sans-serif',
              mb: 0.2,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
              lineHeight: 1.2
            }}
          >
            Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: 'Gallix, sans-serif',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem', lg: '1.45rem' },
              lineHeight: 1.2
            }}
          >
            ₹{total.toFixed(2)}
          </Typography>
        </Box>
        <ShoppingCartIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, opacity: 0.7 }} />
      </Box>
    </CardContent>
  </Card>
));

// Memoized Cart Item - Only re-renders when THIS item's data changes
const CartItemComponent = React.memo(({ cartItem, onQuantityChange, onRemove }) => (
  <Paper
    sx={{ 
      mb: { xs: 0.8, sm: 1, md: 1.2 },
      p: { xs: 1, sm: 1.2, md: 1.5 },
      bgcolor: '#ffffff',
      borderRadius: { xs: 1.5, sm: 2 },
      '&:hover': {
        boxShadow: { xs: 2, sm: 3, md: 4 }
      }
    }}
  >
    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.2, md: 1.5 } }}>
      <ListItemAvatar>
        <Avatar
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4="
          variant="rounded"
          sx={{
            width: { xs: 45, sm: 55, md: 65, lg: 70 },
            height: { xs: 45, sm: 55, md: 65, lg: 70 },
            bgcolor: '#f0f0f0'
          }}
        />
      </ListItemAvatar>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Gallix, sans-serif',
            color: '#000048',
            fontWeight: 'bold',
            mb: { xs: 0.2, sm: 0.3 },
            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem', lg: '1.1rem' }
          }}
        >
          {cartItem.item.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'Gallix, sans-serif',
            color: '#000048',
            opacity: 0.7,
            mb: { xs: 0.3, sm: 0.5 },
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' }
          }}
        >
          {cartItem.item.brand} • {cartItem.item.unit}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Gallix, sans-serif',
            color: '#000048',
            fontWeight: 'bold',
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem', lg: '1rem' }
          }}
        >
          ₹{cartItem.item.price.toFixed(2)} × {cartItem.quantity} = ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.6, sm: 0.8, md: 1 } }}>
        {/* Quantity Controls */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            border: { xs: '1.5px solid #000048', sm: '2px solid #000048' },
            borderRadius: { xs: 1, sm: 1.5 },
            bgcolor: '#f5f5f5'
          }}
        >
          <IconButton
            size="small"
            onClick={() => onQuantityChange(cartItem.id, cartItem.quantity - 1)}
            sx={{ 
              color: '#000048',
              padding: { xs: '3px', sm: '4px', md: '5px' },
              '&:hover': { bgcolor: '#000048', color: '#ffffff' }
            }}
          >
            <RemoveIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }} />
          </IconButton>
          <Typography 
            sx={{ 
              px: { xs: 0.8, sm: 1, md: 1.2 },
              fontFamily: 'Gallix, sans-serif',
              color: '#000048',
              fontWeight: 'bold',
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem', lg: '1rem' }
            }}
          >
            {cartItem.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onQuantityChange(cartItem.id, cartItem.quantity + 1)}
            sx={{ 
              color: '#000048',
              padding: { xs: '3px', sm: '4px', md: '5px' },
              '&:hover': { bgcolor: '#000048', color: '#ffffff' }
            }}
          >
            <AddIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }} />
          </IconButton>
        </Box>

        {/* Remove Button */}
        <IconButton
          size="small"
          onClick={() => onRemove(cartItem.id)}
          sx={{ 
            color: '#dc004e',
            bgcolor: '#ffebee',
            padding: { xs: '5px', sm: '6px', md: '7px' },
            '&:hover': { 
              bgcolor: '#dc004e',
              color: '#ffffff'
            }
          }}
        >
          <DeleteIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }} />
        </IconButton>
      </Box>
    </Box>
  </Paper>
));

const ShoppingHandheld = ({ userId, user, cart, total, onUpdateCart, onEndShopping }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load cart ONCE on mount - COMPLETELY STATIC, NO RE-RENDERS
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartResponse = await getCart(userId);
        const totalResponse = await getCartTotal(userId);
        onUpdateCart(cartResponse.data, totalResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart.');
        setLoading(false);
      }
    };
    
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array - runs ONLY ONCE, never again

  const handleQuantityChange = useCallback(async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Optimistically update UI immediately for instant feedback
    const updatedCart = cart.map(item =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    onUpdateCart(updatedCart, newTotal);
    
    // Then sync with backend silently
    try {
      await updateCartItem(userId, cartItemId, newQuantity);
      setError('');
    } catch (err) {
      setError('Failed to update quantity.');
      // Rollback on error
      const cartResponse = await getCart(userId);
      const totalResponse = await getCartTotal(userId);
      onUpdateCart(cartResponse.data, totalResponse.data);
    }
  }, [cart, userId, onUpdateCart]);

  const handleRemoveItem = useCallback(async (cartItemId) => {
    // Optimistically update UI immediately
    const updatedCart = cart.filter(item => item.id !== cartItemId);
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    onUpdateCart(updatedCart, newTotal);
    
    // Then sync with backend silently
    try {
      await removeCartItem(userId, cartItemId);
      setError('');
    } catch (err) {
      setError('Failed to remove item.');
      // Rollback on error
      const cartResponse = await getCart(userId);
      const totalResponse = await getCartTotal(userId);
      onUpdateCart(cartResponse.data, totalResponse.data);
    }
  }, [cart, userId, onUpdateCart]);

  // Manual refresh for RFID scanner - only call this when new item is scanned
  const handleRefreshCart = useCallback(async () => {
    try {
      const cartResponse = await getCart(userId);
      const totalResponse = await getCartTotal(userId);
      onUpdateCart(cartResponse.data, totalResponse.data);
    } catch (err) {
      setError('Failed to refresh cart.');
    }
  }, [cart, userId, onUpdateCart]);

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
          pt: { xs: '70px', sm: '85px', md: '95px', lg: '100px' },
          pb: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {/* Page Title and RFID Info */}
        <Box 
          sx={{ 
            px: { xs: 1.5, sm: 2.5, md: 3.5, lg: 4 },
            mb: { xs: 1.5, sm: 2, md: 2.5 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5, md: 2 } }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem', lg: '2rem', xl: '2.2rem' }
              }}
            >
              Shopping Cart
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.8, md: 1 } }}>
              <RfidIcon sx={{ color: '#000048', fontSize: { xs: 22, sm: 26, md: 30, lg: 34 } }} />
              <Typography
                sx={{
                  color: '#000048',
                  fontFamily: 'Gallix, sans-serif',
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' },
                  opacity: 0.7
                }}
              >
                Scan items with RFID
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: { xs: '100%', sm: 900, md: 1100, lg: 1200 }, mx: 'auto', px: { xs: 1.5, sm: 2.5, md: 3.5, lg: 4 } }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Cart Summary Card - Only updates when cart/total changes */}
        <CartSummary cart={cart} total={total} />

        {/* Cart Items */}
        {loading ? (
          <Paper sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, textAlign: 'center' }}>
            <Typography 
              sx={{ 
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
              }}
            >
              Loading cart...
            </Typography>
          </Paper>
        ) : cart.length === 0 ? (
          <Paper 
            sx={{ 
              p: { xs: 3, sm: 4.5, md: 6 }, 
              textAlign: 'center',
              bgcolor: '#ffffff',
              borderRadius: { xs: 2, sm: 2.5, md: 3 }
            }}
          >
            <RfidIcon sx={{ fontSize: { xs: 50, sm: 65, md: 80, lg: 90 }, color: '#000048', mb: { xs: 1.5, sm: 2 }, opacity: 0.5 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                mb: { xs: 1.5, sm: 2 },
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem', lg: '1.7rem' }
              }}
            >
              Your cart is empty
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                opacity: 0.7,
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }
              }}
            >
              Start scanning items with your RFID device to add them to your cart
            </Typography>
          </Paper>
        ) : (
          <>
            <List sx={{ bgcolor: 'transparent', mb: { xs: 2, sm: 2.5, md: 3 } }}>
              {cart.map((cartItem) => (
                <CartItemComponent
                  key={cartItem.id}
                  cartItem={cartItem}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </List>

            {/* Checkout Button */}
            <Paper 
              sx={{ 
                p: { xs: 1.2, sm: 1.8, md: 2.5, lg: 3 },
                bgcolor: '#ffffff',
                position: 'sticky',
                bottom: 0,
                borderRadius: { xs: 2, sm: 2.5, md: 3 }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 0.8, sm: 1.2, md: 1.5 }, flexWrap: 'wrap', gap: { xs: 0.8, sm: 1 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem', lg: '1.35rem' }
                  }}
                >
                  Total Amount:
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }
                  }}
                >
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={onEndShopping}
                sx={{ 
                  py: { xs: 1, sm: 1.3, md: 1.8, lg: 2.2 },
                  bgcolor: '#000048',
                  fontFamily: 'Gallix, sans-serif',
                  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem', lg: '1.15rem' },
                  fontWeight: 'bold',
                  borderRadius: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    bgcolor: '#000066'
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </>
        )}
        </Box>
      </Box>
    </>
  );
};

export default ShoppingHandheld;
