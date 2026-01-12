import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  List,
  Divider,
  useMediaQuery,
  useTheme,
  Paper,
  Alert
} from '@mui/material';
import { getCart, getCartTotal, addItemsToCart } from '../api';
import AppHeader from './AppHeader';




// --- EmptyCartView Component (Header WITH Wallet Balance) ---
const EmptyCartView = ({ user, onStartShopping, onLogout }) => {
  return (
    <Box sx={{ width: "100vw", height: "100vh", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      {/* showWallet={true} ensures balance appears here */}
      <AppHeader user={user} onLogout={onLogout} showWallet={true} />
      <Box sx={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        position: "relative", 
        pt: "60px" 
      }}>
        <Box sx={{ position: "absolute", top: "77px", left: "33px", display: "flex", alignItems: "center", gap: "16px" }}>
          <Box component="img" src="/logo/BoyLogo.png" sx={{ width: '38px', height: '38px' }} />
          <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: "20px", color: "#000048" }}>
            Welcome {user?.name || "User"} !
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 500, fontSize: "32px", mb: 1.5, color: "#000048" }}>Your cart is empty</Typography>
        <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 500, fontSize: "20px", opacity: 0.8, color: "#000048", mb: 5 }}>
          Drop items into the cart to begin your shopping
        </Typography>
        <Box component="img" src="/logo/image.png" sx={{ width: '220px', mb: 4 }} />
        <br />
        <Button variant="outlined" onClick={onStartShopping} sx={{ fontFamily: "Gallix, sans-serif", borderColor: "#000048", color: "#000048", fontWeight: "bold", padding: "10px 24px", textTransform: "none" }}>
          Add Products Manually (Demo Mode)
        </Button>
      </Box>
    </Box>
  );
};

// --- Cart Item Component ---
const CartItemComponent = React.memo(({ cartItem }) => {
  if (!cartItem || !cartItem.item) return null;
  const unitPrice = Number(cartItem.item.price || 0);
  const rowSubtotal = unitPrice * cartItem.quantity;
  const getImageUrl = (path) => path ? `/logo/${path.split(/[\\/]/).pop()}` : "/logo/16.png";

  return (
    <Box sx={{
      width: { xs: '100%', md: '772px' }, height: { xs: 'auto', md: '106px' },
      padding: '12px', gap: '20px', border: '1px solid #E3E3E3', borderRadius: '0px',
      display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', bgcolor: '#ffffff'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '282px' } }}>
        <Box component="img" src={getImageUrl(cartItem.item.imageUrl)} sx={{ width: '80px', height: '80px', objectFit: 'contain' }} />
        <Box sx={{ ml: '16px' }}>
          <Typography sx={{ fontFamily: "Gallix, sans-serif", color: '#000048', fontSize: '16px', fontWeight: 600 }}>{cartItem.item.name}</Typography>
          <Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: '14px', color: '#848484' }}>{cartItem.item.unit}</Typography>
          <Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: '12px', color: '#B0B0B0' }}>{cartItem.item.rfidTag ? `#${cartItem.item.rfidTag}` : "#Scanning..."}</Typography>
        </Box>
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '285px' }, display: 'flex', ml: 'auto', justifyContent: 'space-between' }}>
        <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '81px', textAlign: 'center' }}>{cartItem.quantity}</Typography>
        <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '81px', textAlign: 'center' }}>${unitPrice.toFixed(2)}</Typography>
        <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '81px', textAlign: 'center', fontWeight: 600, color: '#000048' }}>${rowSubtotal.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
});

// --- Main ShoppingHandheld Component ---
const ShoppingHandheld = ({ userId, user, cart = [], onUpdateCart, onEndShopping, onLogout }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [error, setError] = useState("");

  const availableProducts = [
    { id: 1, name: "Fresh Apples", price: 3.99, rfidTag: "RFID0001" },
    { id: 2, name: "Bananas", price: 0.99, rfidTag: "RFID0002" },
    { id: 3, name: "Oranges", price: 3.99, rfidTag: "RFID0003" },
    { id: 6, name: "Tomatoes", price: 2.49, rfidTag: "RFID0006" },
    { id: 11, name: "Full Cream Milk", price: 3.89, rfidTag: "RFID0011" },
    { id: 16, name: "White Bread", price: 2.99, rfidTag: "RFID0016" },
  ];

  const currentTotal = (cart || []).reduce((acc, item) => acc + (Number(item.item?.price || 0) * item.quantity), 0);
  const orderTotal = currentTotal + 2.50;

  const handleAddManualProduct = async (product) => {
    try {
      setError("");
      await addItemsToCart(userId, product.rfidTag);
      const cartRes = await getCart(userId);
      const totalRes = await getCartTotal(userId);
      onUpdateCart(cartRes.data || cartRes, totalRes.subtotal || 0);
    } catch (err) {
      setError(`Failed to add ${product.name}`);
    }
  };

  if (cart.length === 0 && !showManualAdd) {
    return <EmptyCartView user={user} onLogout={onLogout} onStartShopping={() => setShowManualAdd(true)} />;
  }

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', width: '100%' }}>
      {/* App Header is present, but showWallet is NOT passed, keeping the UI exactly the same height */}
      <AppHeader user={user} onLogout={onLogout} />
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: { xs: '60px', md: '60px' } }}>
        
        <Box sx={{ flex: 1, p: { xs: '20px', md: '40px' }, mr: { md: '427px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: '16px' }}>
            <Box component="img" src="/logo/BoyLogo.png" sx={{ width: '38px', height: '38px' }} />
            <Typography sx={{ fontFamily: "Gallix, sans-serif", color: '#000048', fontWeight: 600, fontSize: '20px' }}>Welcome {user?.name || 'User'} !</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, fontFamily: "Gallix, sans-serif" }}>{error}</Alert>}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button variant="outlined" onClick={() => setShowManualAdd(!showManualAdd)} sx={{ fontFamily: "Gallix, sans-serif", borderColor: "#000048", color: "#000048", fontWeight: "bold", textTransform: 'none' }}>
              {showManualAdd ? "Hide Manual Add" : "Add Products Manually"}
            </Button>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 500, color: '#000048', fontSize: '20px', display: 'flex', alignItems: 'center' }}>
               Total Item : {cart.length}
            </Typography>
          </Box>

          {showManualAdd && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
              <Typography sx={{ fontFamily: "Gallix, sans-serif", mb: 2, color: "#000048", fontWeight: "bold" }}>Available Products (Click to Add)</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1.5 }}>
                {availableProducts.map((p) => (
                  <Paper key={p.id} onClick={() => handleAddManualProduct(p)} sx={{ p: 1.5, cursor: "pointer", "&:hover": { boxShadow: 3 } }}>
                    <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: "bold", fontSize: "0.9rem" }}>{p.name}</Typography>
                    <Typography sx={{ fontFamily: "Gallix, sans-serif", color: "#2DB81F", fontWeight: "bold" }}>${p.price.toFixed(2)}</Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          )}

          <Box sx={{ display: 'flex', mb: 1, px: '20px' }}>
             <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '282px', fontWeight: 600, color: '#000048', fontSize: '18px' }}>Product Detail</Typography>
             {isDesktop && (
               <Box sx={{ display: 'flex', width: '285px', ml: 'auto', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '81px', textAlign: 'center', fontWeight: 600 }}>Quantity</Typography>
                  <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '81px', textAlign: 'center', fontWeight: 600 }}>Price</Typography>
                  <Typography sx={{ fontFamily: "Gallix, sans-serif", width: '81px', textAlign: 'center', fontWeight: 600 }}>Subtotal</Typography>
               </Box>
             )}
          </Box>
          <Divider />
          <List sx={{ p: 0 }}>{cart.map((item) => <CartItemComponent key={item.id} cartItem={item} />)}</List>
        </Box>

        {/* SIDEBAR */}
        <Box sx={{ 
          width: { xs: '100%', md: '427px' }, bgcolor: '#F2F2F2', display: 'flex', flexDirection: 'column', p: '24px',
          position: { xs: 'relative', md: 'fixed' }, right: 0, top: '60px', height: 'calc(100vh - 60px)'
        }}>
          <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 500, fontSize: '32px', color: '#000048', mb: 2 }}>Order Summary</Typography>
          <Divider sx={{ borderColor: '#000048', mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: '18px' }}>Subtotal</Typography>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600 }}>${currentTotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: '18px' }}>Tax</Typography>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600 }}>$2.50</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: '20px', color: '#000048' }}>Order Total</Typography>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: '20px', color: '#000048' }}>${orderTotal.toFixed(2)}</Typography>
          </Box>
          <Button onClick={onEndShopping} sx={{ fontFamily: "Gallix, sans-serif", width: '100%', height: '56px', bgcolor: '#26EFE9', color: '#000048', borderRadius: '8px', fontWeight: 600, fontSize: '20px', textTransform: 'none' }}>
            Proceed to Checkout
          </Button>
          
          <Box sx={{ bgcolor: '#000048', p: '24px', mx: -3, mb: -3, mt: 'auto' }}>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", color: '#FFFFFF', mb: 1 }}>Cart Total : ${orderTotal.toFixed(2)}</Typography>
            <Typography sx={{ fontFamily: "Gallix, sans-serif", color: orderTotal > (user?.walletBalance || 0) ? '#FF0000' : '#2DB81F', fontWeight: 600, fontSize: '20px' }}>
              Wallet Balance : $ {user?.walletBalance || '100'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ShoppingHandheld;