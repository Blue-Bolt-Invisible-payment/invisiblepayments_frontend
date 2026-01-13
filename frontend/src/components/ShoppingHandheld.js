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

// --- EmptyCartView Component ---

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
      <AppHeader user={user} onLogout={onLogout} showWallet={true} />
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
        <Box
          sx={{
            position: "absolute",

            top: "77px",

            left: "33px",

            display: "flex",

            alignItems: "center",

            gap: "16px",
          }}
        >
          <Box
            component="img"
            src="/logo/BoyLogo.png"
            sx={{ width: "38px", height: "38px" }}
          />
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",

              fontWeight: 600,

              fontSize: "20px",

              color: "#000048",
            }}
          >
            Welcome {user?.name || "User"} !
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "Gallix, sans-serif",

            fontWeight: 500,

            fontSize: "32px",

            mb: 1.5,

            color: "#000048",
          }}
        >
          Your cart is empty
        </Typography>
        <Typography
          sx={{
            fontFamily: "Gallix, sans-serif",

            fontWeight: 500,

            fontSize: "20px",

            opacity: 0.8,

            color: "#000048",

            mb: 5,
          }}
        >
          Drop items into the cart to begin your shopping
        </Typography>
        <Box
          component="img"
          src="/logo/image.png"
          sx={{ width: "220px", mb: 4 }}
        />
        <br />
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

// --- Cart Item Component ---

const CartItemComponent = React.memo(({ cartItem }) => {
  if (!cartItem || !cartItem.item) return null;

  const unitPrice = Number(cartItem.item.price || 0);

  const rowSubtotal = unitPrice * cartItem.quantity;

  const getImageUrl = (path) =>
    path ? `/logo/${path.split(/[\\/]/).pop()}` : "/logo/16.png";

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "772px" },

        height: { xs: "auto", md: "106px" },

        padding: "12px",

        gap: "20px",

        border: "1px solid #E3E3E3",

        borderRadius: "0px",

        display: "flex",

        flexDirection: { xs: "column", sm: "row" },

        alignItems: "center",

        bgcolor: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          width: { xs: "100%", sm: "282px" },
        }}
      >
        <Box
          component="img"
          src={getImageUrl(cartItem.item.imageUrl)}
          sx={{ width: "80px", height: "80px", objectFit: "contain" }}
        />
        <Box sx={{ ml: "16px" }}>
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",

              color: "#000048",

              fontSize: "16px",

              fontWeight: 600,
            }}
          >
            {cartItem.item.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",

              fontSize: "14px",

              color: "#848484",
            }}
          >
            {cartItem.item.unit}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",

              fontSize: "12px",

              color: "#B0B0B0",
            }}
          >
            {cartItem.item.rfidTag
              ? `#${cartItem.item.rfidTag}`
              : "#Scanning..."}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", sm: "285px" },

          display: "flex",

          ml: "auto",

          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Gallix, sans-serif",

            width: "81px",

            textAlign: "center",
          }}
        >
          {cartItem.quantity}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Gallix, sans-serif",

            width: "81px",

            textAlign: "center",
          }}
        >
          ${unitPrice.toFixed(2)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Gallix, sans-serif",

            width: "81px",

            textAlign: "center",

            fontWeight: 600,

            color: "#000048",
          }}
        >
          ${rowSubtotal.toFixed(2)}
        </Typography>
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
}) => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [showManualAdd, setShowManualAdd] = useState(false);

  const [error, setError] = useState("");

  // Checkout Dialog States

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [showPaymentScan, setShowPaymentScan] = useState(false);

  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);

  // Payment States

  const [isProcessing, setIsProcessing] = useState(false);

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const [, setPaymentData] = useState(null);

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

  // Payment authorized - process payment

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
    } catch (err) {
      setIsProcessing(false);

      setPaymentError(
        err?.response?.data?.error ||
          err?.message ||
          "Payment Failed. Please try again or contact support."
      );
    }
  };

  // FIXED: Close success popup and go to starting page

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccess(false);

    setPaymentData(null);

    setIsProcessing(false);

    setPaymentError("");

    // Go back to starting/welcome page

    onLogout && onLogout();
  };

  // Retry payment

  const handlePaymentRetry = () => {
    setPaymentError("");

    setIsProcessing(false);

    setShowPaymentScan(true);
  };

  // Close payment error

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
      <AppHeader user={user} onLogout={onLogout} />
      <Box
        sx={{
          display: "flex",

          flexDirection: { xs: "column", md: "row" },

          mt: "60px",
        }}
      >
        {/* LEFT SIDE - Cart Items */}
        <Box
          sx={{
            flex: 1,

            p: { xs: "20px", md: "40px" },

            mr: { md: "427px" },

            minHeight: "calc(100vh - 60px)",
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

                fontSize: "20px",
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setShowManualAdd(!showManualAdd)}
              sx={{
                fontFamily: "Gallix, sans-serif",

                borderColor: "#000048",

                color: "#000048",

                fontWeight: "bold",

                textTransform: "none",
              }}
            >
              {showManualAdd ? "Hide Manual Add" : "Add Products Manually"}
            </Button>
            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",

                fontWeight: 500,

                color: "#000048",

                fontSize: "20px",

                display: "flex",

                alignItems: "center",
              }}
            >
              Total Item : {cart.length}
            </Typography>
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

                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",

                  gap: 1.5,
                }}
              >
                {availableProducts.map((p) => (
                  <Paper
                    key={p.id}
                    onClick={() => handleAddManualProduct(p)}
                    sx={{
                      p: 1.5,

                      cursor: "pointer",

                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Gallix, sans-serif",

                        fontWeight: "bold",

                        fontSize: "0.9rem",
                      }}
                    >
                      {p.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Gallix, sans-serif",

                        color: "#2DB81F",

                        fontWeight: "bold",
                      }}
                    >
                      ${p.price.toFixed(2)}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          )}
          <Box sx={{ display: "flex", mb: 1, px: "20px" }}>
            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",

                width: "282px",

                fontWeight: 600,

                color: "#000048",

                fontSize: "18px",
              }}
            >
              Product Detail
            </Typography>

            {isDesktop && (
              <Box
                sx={{
                  display: "flex",

                  width: "285px",

                  ml: "auto",

                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Gallix, sans-serif",

                    width: "81px",
                    fontSize: "17px",
                    textAlign: "center",

                    fontWeight: 500,
                  }}
                >
                  Quantity
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Gallix, sans-serif",

                    width: "81px",
                    fontSize: "17px",
                    textAlign: "center",

                    fontWeight: 500,
                  }}
                >
                  Price
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Gallix, sans-serif",

                    width: "81px",
                    fontSize: "17px",

                    textAlign: "center",

                    fontWeight: 500,
                  }}
                >
                  Subtotal
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <List sx={{ p: 0 }}>
            {cart.map((item) => (
              <CartItemComponent key={item.id} cartItem={item} />
            ))}
          </List>
        </Box>

        {/* RIGHT SIDE - Order Summary Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "427px" },

            bgcolor: "#F2F2F2",

            display: "flex",

            flexDirection: "column",

            p: "24px",

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

              fontSize: "32px",

              color: "#000048",

              mb: 2,
            }}
          >
            Order Summary
          </Typography>
          <Divider sx={{ borderColor: "#000048", mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography
              sx={{ fontFamily: "Gallix, sans-serif", fontSize: "18px" }}
            >
              Subtotal
            </Typography>
            <Typography
              sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600 }}
            >
              ${currentTotal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography
              sx={{ fontFamily: "Gallix, sans-serif", fontSize: "18px" }}
            >
              Tax
            </Typography>
            <Typography
              sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600 }}
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

                fontSize: "20px",

                color: "#000048",
              }}
            >
              Order Total
            </Typography>
            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",

                fontWeight: 600,

                fontSize: "20px",

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

              height: "56px",

              bgcolor: "#26EFE9",

              color: "#000048",

              borderRadius: "8px",

              fontWeight: 600,

              fontSize: "20px",

              textTransform: "none",

              "&:hover": { bgcolor: "#1FD6D0" },
            }}
          >
            Proceed to Checkout
          </Button>
          <Box
            sx={{
              bgcolor: "#000048",

              p: "24px",

              mx: -3,

              mb: -3,

              mt: "auto",
            }}
          >
            <Typography
              sx={{ fontFamily: "Gallix, sans-serif", color: "#FFFFFF", mb: 1 }}
            >
              Cart Total : ${orderTotal.toFixed(2)}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",

                color: orderTotal > walletBalance ? "#FF3B30" : "#2DB81F",

                fontWeight: 600,

                fontSize: "20px",
              }}
            >
              Wallet Balance : ${walletBalance.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CONFIRMATION DIALOG */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelConfirmation}
        PaperProps={{
          sx: {
            width: "766px",

            maxWidth: "95%",

            borderRadius: "8px",

            p: "24px",

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

                  fontSize: "24px",

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
          <Box
            sx={{
              width: "100%",
              height: "1px",
              mb: "20px",
              bgcolor: "#000048",
            }}
          />
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",

              fontSize: "17px",

              color: "#000048",

              mb: "32px",
            }}
          >
            Please verify the total items and order amount before proceeding.
          </Typography>
          <Box
            sx={{
              display: "flex",

              gap: "21px",

              mb: "48px",

              justifyContent: "center",
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
          <Box sx={{ display: "flex", gap: "32px", justifyContent: "center" }}>
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

      {/* PAYMENT PROCESSING POPUP */}
      <Dialog
        open={isProcessing}
        PaperProps={{
          sx: {
            borderRadius: "16px",

            overflow: "hidden",

            minWidth: "400px",
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

                fontSize: "24px",

                fontWeight: 600,

                color: "#000048",
              }}
            >
              Payment Processing...
            </Typography>
            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",

                fontSize: "16px",

                color: "#5C5C5C",
              }}
            >
              Please do not close the window.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* PAYMENT SUCCESS POPUP */}
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
        <DialogContent sx={{ p: "12px 24px 42px 24px" }}>
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
                  fontFamily: "Poppins, sans-serif",

                  fontWeight: 500,

                  fontSize: "24px",

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
                width: 82,

                height: 82,

                borderRadius: "50%",

                bgcolor: "#2DB81F",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <CheckCircleIcon sx={{ color: "#FFFFFF", fontSize: 49 }} />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",

                  fontSize: "17px",

                  color: "#000048",

                  mb: 1,
                }}
              >
                Your payment has been completed.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",

                  fontSize: "15px",

                  color: "#000048",
                }}
              >
                A receipt has been sent to your linked email-id.
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",

                fontWeight: 600,

                fontSize: "20px",

                color: "#000048",
              }}
            >
              Thank you for shopping with us!
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* PAYMENT FAILED POPUP */}

      {paymentError && (
        <PaymentFailed
          open={Boolean(paymentError)}
          onClose={handlePaymentErrorClose}
          onRetry={handlePaymentRetry}
          onExit={onLogout}
        />
      )}

      {/* INSUFFICIENT BALANCE POPUP */}
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
        <DialogContent sx={{ p: "12px 24px 24px 24px" }}>
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
                <AccountBalanceWalletIcon
                  sx={{ color: "#fff", fontSize: 18 }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "Gallix, sans-serif",

                  fontWeight: 500,

                  fontSize: "24px",

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

              fontSize: "17px",

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

                fontSize: "20px",

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

// Styles

const summaryBoxStyle = {
  width: "194px",

  height: "100px",

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

  fontSize: "20px",

  color: "#000048",

  mb: 0.5,
};

const summaryValueStyle = {
  fontFamily: "Gallix, sans-serif",

  fontWeight: 600,

  fontSize: "20px",

  color: "#000048",
};

const outlineButtonStyle = {
  width: "276px",

  height: "56px",

  borderRadius: "8px",

  border: "1px solid #000048",

  fontFamily: "Gallix, sans-serif",

  fontWeight: 600,

  fontSize: "20px",

  color: "#000048",

  textTransform: "none",
};

const containedButtonStyle = {
  width: "276px",

  height: "56px",

  borderRadius: "8px",

  bgcolor: "#000048",

  fontFamily: "Gallix, sans-serif",

  fontWeight: 600,

  fontSize: "20px",

  color: "#FFFFFF",

  textTransform: "none",

  "&:hover": { bgcolor: "#000066" },
};

export default ShoppingHandheld;
