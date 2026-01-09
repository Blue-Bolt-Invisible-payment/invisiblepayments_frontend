import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppHeader from "./AppHeader";
import PaymentScan from "./PaymentScan";

const CartReview = ({ user, cart, total, onPayment, onBack, onLogout }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentScan, setShowPaymentScan] = useState(false);

  const handleCompleteShoppingClick = () => {
    setError("");
    if (!cart || cart.length === 0) {
      setError("Your cart is empty. Please add items before checkout.");
      return;
    }

    const totalAmount =
      typeof total === "object" ? total.total || 0 : total || 0;

    if (user.walletBalance < totalAmount) {
      setError(
        `Insufficient Wallet Balance. You need ₹ ${(
          totalAmount - user.walletBalance
        ).toFixed(2)} more to complete this purchase.`
      );
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmPayment = () => {
    setOpenDialog(false);
    setShowPaymentScan(true);
  };

  const handleCancelPayment = () => {
    setOpenDialog(false);
  };

  const handleAuthorized = (authData) => {
    setShowPaymentScan(false);
    onPayment(authData);
  };

  if (showPaymentScan) {
    return <PaymentScan onAuthorized={handleAuthorized} />;
  }

  const totalAmountDisplay =
    typeof total === "object" ? total.total || 0 : total || 0;

  return (
    <>
      <AppHeader user={user} onLogout={onLogout} />

      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          pt: { xs: "90px", sm: "100px" },
          pb: { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "95%", sm: 900, md: 1000, lg: 1100 },
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "Gallix, sans-serif",
              color: "#000048",
              fontWeight: "bold",
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
            }}
          >
            Review Your Cart
          </Typography>

          {error && (
            <Alert
              severity="error"
              icon={<WarningIcon />}
              sx={{ mb: 3, fontFamily: "Gallix, sans-serif", fontSize: "1rem" }}
            >
              {error}
            </Alert>
          )}

          <Paper sx={{ mb: 3, p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ShoppingCartIcon sx={{ color: "#000048", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Gallix, sans-serif",
                  color: "#000048",
                  fontWeight: "bold",
                }}
              >
                Cart Items ({cart.length})
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{ py: 2, borderBottom: "1px solid #f0f0f0" }}
                >
                  <Avatar
                    src={item.item.imageUrl}
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 2, bgcolor: "#f0f0f0" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Gallix, sans-serif",
                        color: "#000048",
                        fontWeight: "bold",
                      }}
                    >
                      {item.item.name} x {item.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Gallix, sans-serif",
                        color: "#000048",
                        opacity: 0.7,
                      }}
                    >
                      {item.item.brand} • {item.item.unit}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      color: "#000048",
                      fontWeight: "bold",
                    }}
                  >
                    ₹ {(item.item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{ fontFamily: "Gallix, sans-serif", color: "#000048" }}
                  >
                    Subtotal:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      color: "#000048",
                      fontWeight: "bold",
                    }}
                  >
                    ₹ {Number(totalAmountDisplay).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{ fontFamily: "Gallix, sans-serif", color: "#000048" }}
                  >
                    Tax & Fees:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      color: "success.main",
                      fontWeight: "bold",
                    }}
                  >
                    ₹ 0.00
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      color: "#000048",
                      fontWeight: "bold",
                    }}
                  >
                    Total Amount:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      color: "#000048",
                      fontWeight: "bold",
                    }}
                  >
                    ₹ {Number(totalAmountDisplay).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              mb: 3,
              bgcolor: "#000048",
              color: "#ffffff",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      opacity: 0.8,
                      mb: 1,
                    }}
                  >
                    Current Wallet Balance:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    ₹ {user.walletBalance.toFixed(2)}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 60, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              onClick={onBack}
              fullWidth
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontFamily: "Gallix, sans-serif",
                fontWeight: "bold",
                borderColor: "#000048",
                color: "#000048",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#000066",
                  bgcolor: "rgba(0, 0, 72, 0.04)",
                },
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
                fontSize: "1.1rem",
                fontFamily: "Gallix, sans-serif",
                fontWeight: "bold",
                bgcolor: "#000048",
                textTransform: "none",
                "&:hover": { bgcolor: "#000066" },
              }}
            >
              Complete Shopping
            </Button>
          </Box>

          {/* UPDATED CONFIRMATION DIALOG PER YOUR EXACT SPECS */}
          <Dialog
            open={openDialog}
            onClose={handleCancelPayment}
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
              {/* Row 1: Icon + Title Aligned and Close Button */}
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
                      width: "32x",
                      height: "32px",
                      mr: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#000048",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_187_185"
                        style={{ maskType: "alpha" }} // Changed to object with camelCase property
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="32"
                        height="32"
                      >
                        <rect
                          y="32"
                          width="32"
                          height="32"
                          transform="rotate(-90 0 32)"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_187_185)">
                        <path
                          d="M25.3335 16L17.3335 24L15.4668 22.1333L21.5668 16L15.4668 9.86667L17.3335 8L25.3335 16ZM17.3335 16L9.33346 24L7.4668 22.1333L13.5668 16L7.4668 9.86667L9.33346 8L17.3335 16Z"
                          fill="white"
                        />
                      </g>
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
                <IconButton onClick={handleCancelPayment} sx={{ p: 0 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z"
                      fill="#000048"
                    />
                  </svg>
                </IconButton>
              </Box>

              {/* Row 2: CUSTOM LINE USING YOUR PROVIDED LAYOUT SPECS */}
              <Box
                sx={{
                  width: "718px",
                  height: "0px",
                  mb: "20px",
                  mx: "auto",
                  opacity: 1,
                  border: "1px solid #000048",
                  background: "#000048",
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
                Please verify the total items and order amount before
                proceeding.
              </Typography>

              {/* Row 3: Cards with correct spacing and formatting */}
              <Box
                sx={{
                  display: "flex",
                  gap: "21px",
                  mb: "48px",
                  justifyContent: "center",
                }}
              >
                {[
                  { label: "Total items", value: cart.length },
                  {
                    label: "Order Total",
                    value: `$ ${totalAmountDisplay.toFixed(2)}`,
                  },
                ].map((card, index) => (
                  <Box
                    key={index}
                    sx={{
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
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Gallix, sans-serif",
                        fontSize: "20px",
                        color: "#000048",
                        mb: 0.5,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Gallix, sans-serif",
                        fontWeight: 600,
                        fontSize: "20px",
                        color: "#000048",
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{ display: "flex", gap: "32px", justifyContent: "center" }}
              >
                <Button
                  onClick={handleCancelPayment}
                  sx={{
                    width: "276px",
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid #000048",
                    fontFamily: "Gallix, sans-serif",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: "#000048",
                    textTransform: "none",
                  }}
                >
                  Review Cart
                </Button>

                <Button
                  onClick={handleConfirmPayment}
                  variant="contained"
                  sx={{
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
                  }}
                >
                  Confirm & Checkout
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default CartReview;
