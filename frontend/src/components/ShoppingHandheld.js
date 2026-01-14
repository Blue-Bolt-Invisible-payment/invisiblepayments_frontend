import React, { useState } from "react";

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

  IconButton,

  CircularProgress,

} from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

import CloseIcon from "@mui/icons-material/Close";

import { getCart, getCartTotal, addItemsToCart, proceedToPay } from "../api";

import AppHeader from "./AppHeader";

import PaymentScan from "./PaymentScan";

import PaymentFailed from "./PaymentFailed";

// --- Cart Icon Component ---

const CartIcon = () => (
<Box

    sx={{

      width: "30px",

      height: "30px",

      borderRadius: "4px",

      bgcolor: "#000048",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      position: "relative",

    }}
>
<svg

      width="22"

      height="17"

      viewBox="0 0 22 17"

      fill="none"

      xmlns="http://www.w3.org/2000/svg"

      style={{ position: "absolute", top: "7px", left: "3px" }}
>
<path

        d="M21.9522 3.83264L19.3935 11.7566C19.2022 12.3209 18.7 12.6971 18.1022 12.6971H8.22609C7.65217 12.6971 7.10217 12.3444 6.91087 11.8271L3.13261 1.88105H0.956522C0.430435 1.88105 0 1.45781 0 0.940526C0 0.423236 0.430435 0 0.956522 0H3.80217C4.2087 0 4.56739 0.258644 4.71087 0.634855L8.6087 10.816H17.6957L19.7283 4.4675H8.46522C7.93913 4.4675 7.5087 4.04426 7.5087 3.52697C7.5087 3.00968 7.93913 2.58645 8.46522 2.58645H21.0435C21.3543 2.58645 21.6413 2.75104 21.8087 2.98617C22 3.2213 22.0478 3.55048 21.9522 3.83264ZM8.70435 13.9433C8.29783 13.9433 7.8913 14.1079 7.60435 14.39C7.31739 14.6722 7.15 15.0719 7.15 15.4716C7.15 15.8714 7.31739 16.2711 7.60435 16.5532C7.8913 16.8354 8.29783 17 8.70435 17C9.11087 17 9.51739 16.8354 9.80435 16.5532C10.0913 16.2711 10.2587 15.8714 10.2587 15.4716C10.2587 15.0719 10.0913 14.6722 9.80435 14.39C9.51739 14.1079 9.11087 13.9433 8.70435 13.9433ZM17.2891 13.9433C16.8826 13.9433 16.4761 14.1079 16.1891 14.39C15.9022 14.6722 15.7348 15.0719 15.7348 15.4716C15.7348 15.8714 15.9022 16.2711 16.1891 16.5532C16.4761 16.8354 16.8826 17 17.2891 17C17.6957 17 18.1022 16.8354 18.3891 16.5532C18.6761 16.2711 18.8435 15.8714 18.8435 15.4716C18.8435 15.0719 18.6761 14.6722 18.3891 14.39C18.1022 14.1079 17.6957 13.9433 17.2891 13.9433Z"

        fill="white"

      />
</svg>
</Box>

);

// --- Updated EmptyCartView Component with Responsive Wallet ---

const EmptyCartView = ({ user, onStartShopping, onLogout }) => {

  return (
<Box

      sx={{

        width: "100vw",

        height: "100vh",

        bgcolor: "#FFFFFF",

        overflow: "hidden",

      }}
>
<AppHeader user={user} onLogout={onLogout} showWallet={false} />
<Box

        sx={{

          width: "100%",

          height: "100%",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          position: "relative",

          pt: "60px",

        }}
>

        {/* Welcome Container with Name and Wallet - FIXED RESPONSIVE */}
<Box

          sx={{

            position: "absolute",

            top: "77px",

            left: "33px",

            right: "33px",

            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            flexWrap: "wrap",

            gap: "16px",

          }}
>

          {/* Left side - Avatar and Name */}
<Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
<Box

              component="img"

              src="/logo/BoyLogo.png"

              sx={{ width: "38px", height: "38px" }}

            />
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

                color: "#000048",

              }}
>

              Welcome {user?.name || "User"} !
</Typography>
</Box>

          {/* Right side - Wallet Balance */}
<Box

            sx={{

              display: "flex",

              alignItems: "center",

              gap: "8px",

              bgcolor: "#f2f2f2",
              height:'62px',
              

              px: 2,

              py: 0.5,

              borderRadius: "8px",

            }}
>
<AccountBalanceWalletIcon sx={{ color: "#000048", fontSize: "20px" }} />
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontWeight: 500,

                fontSize: '20px',

                color: "#000048",

              }}
>

              Wallet Balance : $ {Number(user?.walletBalance || 0).toFixed(2)}
</Typography>
</Box>
</Box>
<Typography

          sx={{

            fontFamily: "Gallix, sans-serif",

            fontWeight: 500,

            fontSize: { xs: "24px", md: "32px" },

            color: "#000048",

            mb: 1.5,

            textAlign: "center",

            px: 2,

          }}
>

          Your cart is empty
</Typography>
<Typography

          sx={{

            fontFamily: "Gallix, sans-serif",

            fontWeight: 500,

            fontSize: { xs: "16px", md: "20px" },

            opacity: 0.8,

            color: "#000048",

            mb: 5,

            textAlign: "center",

            px: 2,

          }}
>

          Drop items into the cart to begin your shopping
</Typography>
<Box

          component="img"

          src="/logo/image.png"

          sx={{ width: { xs: "160px", md: "220px" }, mb: 4 }}

        />
<Button

          variant="outlined"

          onClick={onStartShopping}

          sx={{

            fontFamily: "Gallix, sans-serif",

            borderColor: "#000048",

            color: "#000048",

            fontWeight: "bold",

            padding: "10px 24px",

            textTransform: "none",

          }}
>

          Add Products Manually (Demo Mode)
</Button>
</Box>
</Box>

  );

};

// --- FIXED Responsive Cart Item Component ---

const CartItemComponent = React.memo(({ cartItem }) => {

  if (!cartItem || !cartItem.item) return null;

  const unitPrice = Number(cartItem.item.price || 0);

  const rowSubtotal = unitPrice * cartItem.quantity;

  const getImageUrl = (path) =>

    path ? `/logo/${path.split(/[\\/]/).pop()}` : "/logo/16.png";

  return (
<Box

      sx={{

        width: "100%",

        minHeight: { xs: "auto", md: "106px" },

        padding: { xs: "12px", md: "12px 16px" },

        border: "1px solid #E3E3E3",

        display: "flex",

        flexDirection: { xs: "column", md: "row" },

        alignItems: { xs: "flex-start", md: "center" },

        bgcolor: "#ffffff",

        mb: "4px",

      }}
>

      {/* Product Image and Details */}
<Box

        sx={{

          display: "flex",

          alignItems: "center",

          flex: { xs: "1", md: "1 1 45%" },

          minWidth: 0,

          width: { xs: "100%", md: "auto" },

        }}
>
<Box

          component="img"

          src={getImageUrl(cartItem.item.imageUrl)}

          sx={{

            width: { xs: "60px", md: "80px" },

            height: { xs: "60px", md: "80px" },

            objectFit: "contain",

            flexShrink: 0,

          }}

        />
<Box sx={{ ml: "16px", minWidth: 0, flex: 1 }}>
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              color: "#000048",

              fontSize: { xs: "14px", md: "16px" },

              fontWeight: 600,

              overflow: "hidden",

              textOverflow: "ellipsis",

              whiteSpace: "nowrap",

            }}
>

            {cartItem.item.name}
</Typography>
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              fontSize: { xs: "12px", md: "14px" },

              color: "#848484",

            }}
>

            {cartItem.item.unit}
</Typography>
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              fontSize: { xs: "11px", md: "12px" },

              color: "#B0B0B0",

            }}
>

            {cartItem.item.rfidTag

              ? `#${cartItem.item.rfidTag}`

              : "#Scanning..."}
</Typography>
</Box>
</Box>

      {/* Quantity, Price, Subtotal */}
<Box

        sx={{

          display: "flex",

          alignItems: "center",

          justifyContent: { xs: "space-between", md: "flex-end" },

          flex: { xs: "1", md: "1 1 45%" },

          width: { xs: "100%", md: "auto" },

          mt: { xs: 2, md: 0 },

          pt: { xs: 2, md: 0 },

          borderTop: { xs: "1px solid #f0f0f0", md: "none" },

          gap: { xs: "8px", md: "16px" },

        }}
>
<Box sx={{ textAlign: "center", flex: { xs: 1, md: "0 0 80px" } }}>
<Typography

            sx={{

              display: { xs: "block", md: "none" },

              fontFamily: "Gallix, sans-serif",

              fontSize: "10px",

              color: "#848484",

              mb: 0.5,

            }}
>

            Qty
</Typography>
<Typography

            sx={{
              fontSize:'15px',
              fontWeight:400,
              color:"#000048",
              fontFamily: "Gallix, sans-serif",

              fontSize:'15px',

            }}
>

            {cartItem.quantity}
</Typography>
</Box>
<Box sx={{ textAlign: "center", flex: { xs: 1, md: "0 0 80px" } }}>
<Typography

            sx={{

              display: { xs: "block", md: "none" },

              fontFamily: "Gallix, sans-serif",

              fontSize: "10px",

              color: "#848484",

              mb: 0.5,

            }}
>

            Price
</Typography>
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              fontSize:'15px',
              fontWeight:400,
              color:"#000048"

            }}
>

            ${unitPrice.toFixed(2)}
</Typography>
</Box>
<Box sx={{ textAlign: "center", flex: { xs: 1, md: "0 0 80px" } }}>
<Typography

            sx={{

              display: { xs: "block", md: "none" },

              fontFamily: "Gallix, sans-serif",

              fontSize: "10px",

              color: "#848484",

              mb: 0.5,

            }}
>

            Subtotal
</Typography>
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              fontSize:'15px',

              fontWeight: 500,

              color: "#000048",

            }}
>

            ${rowSubtotal.toFixed(2)}
</Typography>
</Box>
</Box>
</Box>

  );

});

// --- Main ShoppingHandheld Component ---

const ShoppingHandheld = ({

  userId,

  user,

  cart = [],

  onUpdateCart,

  onEndShopping,

  onLogout,

  onPaymentSuccessShown,

  onPaymentSuccessHidden,

}) => {

  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [showManualAdd, setShowManualAdd] = useState(false);

  const [error, setError] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [showPaymentScan, setShowPaymentScan] = useState(false);

  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const [paymentData, setPaymentData] = useState(null);

  const [paymentError, setPaymentError] = useState("");

  const availableProducts = [

    { id: 1, name: "Fresh Apples", price: 3.99, rfidTag: "RFID0001" },

    { id: 2, name: "Bananas", price: 0.99, rfidTag: "RFID0002" },

    { id: 3, name: "Oranges", price: 3.99, rfidTag: "RFID0003" },

    { id: 6, name: "Tomatoes", price: 2.49, rfidTag: "RFID0006" },

    { id: 11, name: "Full Cream Milk", price: 3.89, rfidTag: "RFID0011" },

    { id: 16, name: "White Bread", price: 2.99, rfidTag: "RFID0016" },

  ];

  const currentTotal = (cart || []).reduce(

    (acc, item) => acc + Number(item.item?.price || 0) * item.quantity,

    0

  );

  const orderTotal = currentTotal + 2.5;

  const walletBalance = Number(user?.walletBalance || 0);

  const additionalRequired =

    orderTotal > walletBalance

      ? (orderTotal - walletBalance).toFixed(2)

      : "0.00";

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

  const handleProceedToCheckout = () => setOpenConfirmDialog(true);

  const handleCancelConfirmation = () => setOpenConfirmDialog(false);

  const handleConfirmAndOpenPayment = () => {

    setOpenConfirmDialog(false);

    if (orderTotal > walletBalance) {

      setBalanceDialogOpen(true);

    } else {

      setShowPaymentScan(true);

    }

  };

  const handlePaymentAuthorized = async (authData) => {

    setShowPaymentScan(false);

    setIsProcessing(true);

    setPaymentError("");

    try {

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await proceedToPay(user.id);

      setPaymentData(response.data);

      setIsProcessing(false);

      setShowPaymentSuccess(true);

      // notify parent to suppress session lock and start auto-logout timer
      if (typeof onPaymentSuccessShown === 'function') onPaymentSuccessShown();

    } catch (err) {

      setIsProcessing(false);

      setPaymentError(

        err?.response?.data?.error ||

          err?.message ||

          "Payment Failed. Please try again or contact support."

      );

    }

  };

  const handlePaymentSuccessClose = () => {

    setShowPaymentSuccess(false);

    setPaymentData(null);

    setIsProcessing(false);

    setPaymentError("");

    // notify parent that payment success dialog is closed
    if (typeof onPaymentSuccessHidden === 'function') onPaymentSuccessHidden();

    onLogout && onLogout();

  };

  const handlePaymentRetry = () => {

    setPaymentError("");

    setIsProcessing(false);

    setShowPaymentScan(true);

  };

  const handlePaymentErrorClose = () => {

    setPaymentError("");

    setIsProcessing(false);

  };

  if (cart.length === 0 && !showManualAdd) {

    return (
<EmptyCartView

        user={user}

        onLogout={onLogout}

        onStartShopping={() => setShowManualAdd(true)}

      />

    );

  }

  return (
<Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", width: "100%" }}>
<AppHeader user={user} onLogout={onLogout} showWallet={false} />
<Box

        sx={{

          display: "flex",

          flexDirection: { xs: "column", md: "row" },

          mt: "60px",

        }}
>
<Box

          sx={{

            flex: 1,

            p: { xs: "16px", md: "40px" },

            mr: { md: "427px" },

            minHeight: "calc(100vh - 60px)",

            overflow: "hidden",

          }}
>
<Box

            sx={{ display: "flex", alignItems: "center", mb: 4, gap: "16px" }}
>
<Box

              component="img"

              src="/logo/BoyLogo.png"

              sx={{ width: "38px", height: "38px" }}

            />
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                color: "#000048",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

              }}
>

              Welcome {user?.name || "User"} !
</Typography>
</Box>

          {error && (
<Alert

              severity="error"

              sx={{ mb: 2, fontFamily: "Gallix, sans-serif" }}
>

              {error}
</Alert>

          )}
<Box

            sx={{

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              mb: 3,

              flexWrap: "wrap",

              gap: 2,

            }}
>
<Button

              variant="outlined"

              onClick={() => setShowManualAdd(!showManualAdd)}

              sx={{

                fontFamily: "Gallix, sans-serif",

                borderColor: "#000048",

                color: "#000048",

                fontWeight: "bold",

                textTransform: "none",

                fontSize: { xs: "12px", md: "14px" },

              }}
>

              {showManualAdd ? "Hide Manual Add" : "Add Products Manually"}
</Button>

            {/* UPDATED: Total Item with Cart Icon */}
<Box

              sx={{

                display: "flex",

                alignItems: "center",

                gap: "12px",

              }}
>
<CartIcon />
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  fontWeight: 500,

                  color: "#000048",

                  fontSize: { xs: "16px", md: "20px" },

                }}
>

                Total Item : {cart.length}
</Typography>
</Box>
</Box>

          {showManualAdd && (
<Paper sx={{ p: 2, mb: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  mb: 2,

                  color: "#000048",

                  fontWeight: "bold",

                }}
>

                Available Products (Click to Add)
</Typography>
<Box

                sx={{

                  display: "grid",

                  gridTemplateColumns: {

                    xs: "repeat(2, 1fr)",

                    sm: "repeat(3, 1fr)",

                    md: "repeat(auto-fill, minmax(120px, 1fr))",

                  },

                  gap: 2,

                }}
>

                {availableProducts.map((p) => (
<Paper

                    key={p.id}

                    onClick={() => handleAddManualProduct(p)}

                    sx={{

                      p: 1.5,

                      cursor: "pointer",

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      textAlign: "center",

                      transition: "transform 0.2s",

                      "&:hover": { boxShadow: 3, transform: "scale(1.02)" },

                    }}
>
<Typography

                      sx={{

                        fontFamily: "Gallix, sans-serif",

                        fontWeight: "bold",

                        fontSize: { xs: "12px", md: "14px" },

                        color: "#000048",

                        mb: 0.5,

                      }}
>

                      {p.name}
</Typography>
<Typography

                      sx={{

                        fontFamily: "Gallix, sans-serif",

                        color: "#2DB81F",

                        fontWeight: "bold",

                        fontSize: { xs: "14px", md: "16px" },

                      }}
>

                      ${p.price.toFixed(2)}
</Typography>
</Paper>

                ))}
</Box>
</Paper>

          )}

          {/* FIXED Responsive Table Header */}
<Box

            sx={{

              display: { xs: "none", md: "flex" },

              mb: 1,

              px: 2,

              alignItems: "center",

            }}
>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                flex: "1 1 45%",

                fontWeight: 600,

                color: "#000048",

                fontSize: "16px",

              }}
>

              Product Detail
</Typography>
<Box

              sx={{

                flex: "1 1 45%",

                display: "flex",

                justifyContent: "flex-end",

                gap: "16px",

              }}
>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  width: "80px",

                  textAlign: "center",

                  fontWeight: 500,

                  fontSize: "17px",
                  color: "#000048",

                }}
>

                Quantity
</Typography>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  width: "80px",

                  textAlign: "center",

                  fontWeight: 500,

                  fontSize: "17px",
                  color: "#000048",

                }}
>

                Price
</Typography>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  width: "80px",

                  textAlign: "center",

                  fontWeight: 500,

                  fontSize: "17px",
                  color: "#000048",

                }}
>

                Subtotal
</Typography>
</Box>
</Box>
<Divider sx={{ display: { xs: "none", md: "block" } }} />
<List sx={{ p: 0 }}>

            {cart.map((item) => (
<CartItemComponent key={item.id} cartItem={item} />

            ))}
</List>
</Box>

        {/* Sidebar */}
<Box

          sx={{

            width: { xs: "100%", md: "427px" },

            bgcolor: "#F2F2F2",

            display: "flex",

            flexDirection: "column",

            p: { xs: "16px", md: "24px" },

            position: { xs: "relative", md: "fixed" },

            right: 0,

            top: { md: "60px" },

            height: { xs: "auto", md: "calc(100vh - 60px)" },

            zIndex: 10,

          }}
>
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              fontWeight: 500,

              fontSize: { xs: "24px", md: "32px" },

              color: "#000048",

              mb: 2,

            }}
>

            Order Summary
</Typography>
<Divider sx={{ borderColor: "#000048", mb: 2 }} />
<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: "#000048", }}>
<Typography

              sx={{ fontFamily: "Gallix, sans-serif", fontSize:'15px',fontWeight:400, Color: "#000048"}}
>

              Subtotal
</Typography>
<Typography

              sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize:'15px', color: "#000048", }}
>

              ${currentTotal.toFixed(2)}
</Typography>
</Box>
<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
<Typography

              sx={{ fontFamily: "Gallix, sans-serif", fontSize: '15px',fontWeight:400, Color: "#000048" }}
>

              Tax
</Typography>
<Typography

              sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize:'15px' ,  color: "#000048",}}
>

              $2.50
</Typography>
</Box>
<Divider sx={{ my: 2 }} />
<Box

            sx={{

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              mb: 3,

            }}
>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

                color: "#000048",

              }}
>

              Order Total
</Typography>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

                color: "#000048",

              }}
>

              ${orderTotal.toFixed(2)}
</Typography>
</Box>
<Button

            onClick={handleProceedToCheckout}

            sx={{

              fontFamily: "Gallix, sans-serif",

              width: "100%",

              height: { xs: "48px", md: "56px" },

              bgcolor: "#26EFE9",

              color: "#000048",

              borderRadius: "8px",

              fontWeight: 600,

              fontSize: { xs: "16px", md: "20px" },

              textTransform: "none",

              "&:hover": { bgcolor: "#1FD6D0" },

            }}
>

            Proceed to Checkout
</Button>
<Box

            sx={{

              bgcolor: "#000048",

              p: { xs: "16px", md: "24px" },

              mx: { xs: -2, md: -3 },

              mb: { xs: -2, md: -3 },

              mt: "auto",

            }}
>
<Typography

              sx={{ fontFamily: "Gallix, sans-serif", color: "#FFFFFF", mb: 1, fontSize: { xs: "14px", md: "16px" } }}
>

              Cart Total : ${orderTotal.toFixed(2)}
</Typography>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                color: orderTotal > walletBalance ? "#FF3B30" : "#2DB81F",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

              }}
>

              Wallet Balance : ${walletBalance.toFixed(2)}
</Typography>
</Box>
</Box>
</Box>

      {/* All Dialogs */}
<Dialog

        open={openConfirmDialog}

        onClose={handleCancelConfirmation}

        PaperProps={{

          sx: {

            width: "766px",

            maxWidth: "95%",

            borderRadius: "8px",

            p: { xs: "16px", md: "24px" },

            background: "#FFFFFF",

          },

        }}
>
<DialogContent sx={{ p: 0 }}>
<Box

            sx={{

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              mb: "12px",

            }}
>
<Box sx={{ display: "flex", alignItems: "center" }}>
<Box

                sx={{

                  width: "32px",

                  height: "32px",

                  mr: "12px",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  bgcolor: "#000048",

                  borderRadius: "50%",

                }}
>
<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
<path

                    d="M25.3335 16L17.3335 24L15.4668 22.1333L21.5668 16L15.4668 9.86667L17.3335 8L25.3335 16ZM17.3335 16L9.33346 24L7.4668 22.1333L13.5668 16L7.4668 9.86667L9.33346 8L17.3335 16Z"

                    fill="white"

                  />
</svg>
</Box>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  fontWeight: 500,

                  fontSize: { xs: "18px", md: "24px" },

                  color: "#000048",

                }}
>

                Confirm Items
</Typography>
</Box>
<IconButton onClick={handleCancelConfirmation} sx={{ p: 0 }}>
<CloseIcon sx={{ color: "#000048" }} />
</IconButton>
</Box>
<Box sx={{ width: "100%", height: "1px", mb: "20px", bgcolor: "#000048" }} />
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              fontSize: { xs: "14px", md: "17px" },

              color: "#000048",

              mb: "32px",

            }}
>

            Please verify the total items and order amount before proceeding.
</Typography>
<Box

            sx={{

              display: "flex",

              gap: { xs: "12px", md: "21px" },

              mb: { xs: "24px", md: "48px" },

              justifyContent: "center",

              flexWrap: "wrap",

            }}
>
<Box sx={summaryBoxStyle}>
<Typography sx={summaryLabelStyle}>Total items</Typography>
<Typography sx={summaryValueStyle}>{cart.length}</Typography>
</Box>
<Box sx={summaryBoxStyle}>
<Typography sx={summaryLabelStyle}>Order Total</Typography>
<Typography sx={summaryValueStyle}>

                ${orderTotal.toFixed(2)}
</Typography>
</Box>
</Box>
<Box sx={{ display: "flex", gap: { xs: "16px", md: "32px" }, justifyContent: "center", flexWrap: "wrap" }}>
<Button onClick={handleCancelConfirmation} sx={outlineButtonStyle}>

              Review Cart
</Button>
<Button

              onClick={handleConfirmAndOpenPayment}

              variant="contained"

              sx={containedButtonStyle}
>

              Confirm & Checkout
</Button>
</Box>
</DialogContent>
</Dialog>
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
<Dialog

        open={isProcessing}

        PaperProps={{

          sx: {

            borderRadius: "16px",

            overflow: "hidden",

            minWidth: { xs: "90%", md: "400px" },

          },

        }}
>
<DialogContent sx={{ p: 0 }}>
<Box

            sx={{

              display: "flex",

              flexDirection: "column",

              alignItems: "center",

              justifyContent: "center",

              height: "300px",

              bgcolor: "#FFFFFF",

              gap: 3,

              p: 4,

            }}
>
<CircularProgress sx={{ color: "#000048" }} size={70} />
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontSize: { xs: "18px", md: "24px" },

                fontWeight: 600,

                color: "#000048",

                textAlign: "center",

              }}
>

              Payment Processing...
</Typography>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontSize: { xs: "14px", md: "16px" },

                color: "#5C5C5C",

                textAlign: "center",

              }}
>

              Please wait while processing your payment.
</Typography>
</Box>
</DialogContent>
</Dialog>
<Dialog

        open={showPaymentSuccess}

        onClose={handlePaymentSuccessClose}

        PaperProps={{

          sx: {

            width: "766px",

            maxWidth: "95%",

            borderRadius: "8px",

            border: "1px solid #000048",

            overflow: "hidden",

          },

        }}
>
<DialogContent sx={{ p: { xs: "12px 16px 24px", md: "12px 24px 42px 24px" } }}>
<Box

            sx={{

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              mb: 1,

            }}
>
<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
<Box

                sx={{

                  width: 40,

                  height: 40,

                  borderRadius: "50%",

                  bgcolor: "#000048",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                }}
>
<ThumbUpAltIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
</Box>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  fontWeight: 500,

                  fontSize: { xs: "18px", md: "24px" },

                  color: "#000048",

                }}
>

                Payment Successful
</Typography>
</Box>
<IconButton onClick={handlePaymentSuccessClose}>
<CloseIcon sx={{ color: "#000048" }} />
</IconButton>
</Box>
<Divider sx={{ borderColor: "#000048", mb: 3 }} />
<Box

            sx={{

              display: "flex",

              flexDirection: "column",

              alignItems: "center",

              gap: "24px",

              py: 3,

            }}
>
<Box

              sx={{

                width: { xs: 60, md: 82 },

                height: { xs: 60, md: 82 },

                borderRadius: "50%",

                bgcolor: "#2DB81F",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

              }}
>
<CheckCircleIcon sx={{ color: "#FFFFFF", fontSize: { xs: 36, md: 49 } }} />
</Box>
<Box sx={{ textAlign: "center" }}>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  fontSize: { xs: "14px", md: "17px" },

                  color: "#000048",

                  mb: 1,

                }}
>

                Your payment has been completed.
</Typography>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  fontSize: { xs: "12px", md: "15px" },

                  color: "#000048",

                }}
>

                A receipt has been sent to your linked email-id.
</Typography>
</Box>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

                color: "#000048",

              }}
>

              Thank you for shopping with us!
</Typography>
</Box>
</DialogContent>
</Dialog>

      {paymentError && (
<PaymentFailed

          open={Boolean(paymentError)}

          onClose={handlePaymentErrorClose}

          onRetry={handlePaymentRetry}

          onExit={onLogout}

        />

      )}
<Dialog

        open={balanceDialogOpen}

        onClose={() => setBalanceDialogOpen(false)}

        PaperProps={{

          sx: {

            width: "766px",

            maxWidth: "95%",

            borderRadius: "8px",

            overflow: "hidden",

          },

        }}
>
<DialogContent sx={{ p: { xs: "12px 16px", md: "12px 24px 24px 24px" } }}>
<Box

            sx={{

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              mb: "12px",

            }}
>
<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
<Box

                sx={{

                  width: 28,

                  height: 28,

                  borderRadius: "50%",

                  bgcolor: "#000048",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                }}
>
<AccountBalanceWalletIcon sx={{ color: "#fff", fontSize: 18 }} />
</Box>
<Typography

                sx={{

                  fontFamily: "Gallix, sans-serif",

                  fontWeight: 500,

                  fontSize: { xs: "16px", md: "24px" },

                  color: "#000048",

                }}
>

                Topup - Insufficient Wallet Balance
</Typography>
</Box>
<IconButton onClick={() => setBalanceDialogOpen(false)}>
<CloseIcon sx={{ color: "#000048" }} />
</IconButton>
</Box>
<Divider sx={{ borderColor: "#000048", mb: "18px" }} />
<Typography

            sx={{

              fontFamily: "Gallix, sans-serif",

              color: "#000048",

              fontSize: { xs: "14px", md: "17px" },

              mb: 2,

            }}
>

            Low wallet balance detected. Top up your wallet to keep shopping.
</Typography>
<Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontSize: "14px",

                color: "#5C5C5C",

              }}
>

              Wallet Balance: ${walletBalance.toFixed(2)}
</Typography>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontSize: "14px",

                color: "#000048",

              }}
>

              Order Total: ${orderTotal.toFixed(2)}
</Typography>
<Typography

              sx={{

                fontFamily: "Gallix, sans-serif",

                fontWeight: 600,

                fontSize: { xs: "16px", md: "20px" },

                color: "#000048",

              }}
>

              Additional Required: ${additionalRequired}
</Typography>
</Box>
</DialogContent>
</Dialog>
</Box>

  );

};

const summaryBoxStyle = {

  width: { xs: "140px", md: "194px" },

  height: { xs: "80px", md: "100px" },

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  justifyContent: "center",

  borderRadius: "4px",

  border: "1px solid #EAEAEA",

  background: "#FFFFFF",

  boxShadow: "0px 4px 4px 0px #F4F4F4",

};

const summaryLabelStyle = {

  fontFamily: "Gallix, sans-serif",

  fontSize: { xs: "14px", md: "20px" },

  color: "#000048",

  mb: 0.5,

};

const summaryValueStyle = {

  fontFamily: "Gallix, sans-serif",

  fontWeight: 600,

  fontSize: { xs: "16px", md: "20px" },

  color: "#000048",

};

const outlineButtonStyle = {

  width: { xs: "140px", md: "276px" },

  height: { xs: "48px", md: "56px" },

  borderRadius: "8px",

  border: "1px solid #000048",

  fontFamily: "Gallix, sans-serif",

  fontWeight: 600,

  fontSize: { xs: "14px", md: "20px" },

  color: "#000048",

  textTransform: "none",

};

const containedButtonStyle = {

  width: { xs: "140px", md: "276px" },

  height: { xs: "48px", md: "56px" },

  borderRadius: "8px",

  bgcolor: "#000048",

  fontFamily: "Gallix, sans-serif",

  fontWeight: 600,

  fontSize: { xs: "14px", md: "20px" },

  color: "#FFFFFF",

  textTransform: "none",

  "&:hover": { bgcolor: "#000048" },

};

export default ShoppingHandheld;
