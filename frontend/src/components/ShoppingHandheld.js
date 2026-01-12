import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  List,
  Divider,
  useMediaQuery,
  useTheme,
  Paper,
  Alert,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { getCart, getCartTotal, addItemsToCart } from '../api';
import AppHeader from './AppHeader';
import PaymentScan from './PaymentScan';

// --- EmptyCartView Component ---
const EmptyCartView = ({ user, onStartShopping, onLogout }) => {
  return (
    <Box sx={{ width: "100vw", height: "100vh", bgcolor: "#FFFFFF", overflow: "hidden" }}>
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
  
  // Checkout Dialog States
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [showPaymentScan, setShowPaymentScan] = useState(false);

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

  // Flow Handlers
  const handleProceedToCheckout = () => setOpenConfirmDialog(true);
  const handleCancelConfirmation = () => setOpenConfirmDialog(false);
  
  const handleConfirmAndOpenPayment = () => {
    setOpenConfirmDialog(false);
    setShowPaymentScan(true); 
  };

  const handlePaymentAuthorized = (authData) => {
    setShowPaymentScan(false);
    onEndShopping(authData); // Informs App.js to move to confirmation step
  };

  if (cart.length === 0 && !showManualAdd) {
    return <EmptyCartView user={user} onLogout={onLogout} onStartShopping={() => setShowManualAdd(true)} />;
  }

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', width: '100%' }}>
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
          
          <Button onClick={handleProceedToCheckout} sx={{ fontFamily: "Gallix, sans-serif", width: '100%', height: '56px', bgcolor: '#26EFE9', color: '#000048', borderRadius: '8px', fontWeight: 600, fontSize: '20px', textTransform: 'none' }}>
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

      {/* CONFIRMATION DIALOG */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelConfirmation}
        PaperProps={{
          sx: { width: "766px", maxWidth: "95%", borderRadius: "8px", p: "24px", background: "#FFFFFF" },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "12px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: "32px", height: "32px", mr: "12px", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#000048", borderRadius: "50%" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M25.3335 16L17.3335 24L15.4668 22.1333L21.5668 16L15.4668 9.86667L17.3335 8L25.3335 16ZM17.3335 16L9.33346 24L7.4668 22.1333L13.5668 16L7.4668 9.86667L9.33346 8L17.3335 16Z" fill="white" /></svg>
              </Box>
              <Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 500, fontSize: "24px", color: "#000048" }}>Confirm Items</Typography>
            </Box>
            <IconButton onClick={handleCancelConfirmation} sx={{ p: 0 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 0 1.50724 0C1.10817 0 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049L6.88704 8.99872L0.443269 15.4284L1.50724 18L9 11.112L16.4928 18L17.5567 15.4284L11.113 8.99872Z" fill="#000048" /></svg>
            </IconButton>
          </Box>

          <Box sx={{ width: "100%", height: "1px", mb: "20px", bgcolor: "#000048" }} />

          <Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: "17px", color: "#000048", mb: "32px" }}>
            Please verify the total items and order amount before proceeding.
          </Typography>

          <Box sx={{ display: "flex", gap: "21px", mb: "48px", justifyContent: "center" }}>
            <Box sx={summaryBoxStyle}>
              <Typography sx={summaryLabelStyle}>Total items</Typography>
              <Typography sx={summaryValueStyle}>{cart.length}</Typography>
            </Box>
            <Box sx={summaryBoxStyle}>
              <Typography sx={summaryLabelStyle}>Order Total</Typography>
              <Typography sx={summaryValueStyle}>$ {orderTotal.toFixed(2)}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: "32px", justifyContent: "center" }}>
            <Button onClick={handleCancelConfirmation} sx={outlineButtonStyle}>Review Cart</Button>
            <Button onClick={handleConfirmAndOpenPayment} variant="contained" sx={containedButtonStyle}>Confirm & Checkout</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* PAYMENT SCAN DIALOG */}
      <Dialog
        open={showPaymentScan}
        onClose={() => setShowPaymentScan(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <PaymentScan
            onAuthorized={handlePaymentAuthorized}
            onClose={() => setShowPaymentScan(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const summaryBoxStyle = {
  width: "194px", height: "100px", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", borderRadius: "4px",
  border: "1px solid #EAEAEA", background: "#FFFFFF", boxShadow: "0px 4px 4px 0px #F4F4F4",
};
const summaryLabelStyle = { fontFamily: "Gallix, sans-serif", fontSize: "20px", color: "#000048", mb: 0.5 };
const summaryValueStyle = { fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: "20px", color: "#000048" };
const outlineButtonStyle = {
  width: "276px", height: "56px", borderRadius: "8px", border: "1px solid #000048",
  fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: "20px", color: "#000048", textTransform: "none",
};
const containedButtonStyle = {
  width: "276px", height: "56px", borderRadius: "8px", bgcolor: "#000048",
  fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: "20px", color: "#FFFFFF",
  textTransform: "none", "&:hover": { bgcolor: "#000066" },
};

export default ShoppingHandheld;