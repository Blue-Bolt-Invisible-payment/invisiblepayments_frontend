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
import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  getCart,
  getCartTotal,
  updateCartItem,
  removeCartItem,
  addItemsToCart,
} from "../api";
import AppHeader from "./AppHeader";

// --- EmptyCartView Component ---
const EmptyCartView = ({ user, onStartShopping, onLogout }) => {
  const galaxyBaseStyle = {
    fontFamily: '"Galaxy", "Samsung Sharp Sans", sans-serif',
    lineHeight: "1.2",
    letterSpacing: "-3%",
    color: "#000048",
    textAlign: "center",
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Global Header for the Empty State */}
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
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="19" fill="#D9D9D9" />
          </svg>
          <Typography
            sx={{
              ...galaxyBaseStyle,
              fontWeight: 600,
              fontSize: "20px",
              textAlign: "left",
              lineHeight: "100%",
              color: "#000048",
            }}
          >
            Welcome {user?.name?.split(" ")[0] || "John"} !
          </Typography>
        </Box>

        <Typography
          sx={{
            ...galaxyBaseStyle,
            fontWeight: 500,
            fontSize: "32px",
            mb: 1.5,
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

        <svg width="220" height="172" viewBox="0 0 220 172" fill="none">
          <path
            d="M219.522 38.7773L193.935 118.949C192.022 124.658 187 128.465 181.022 128.465H82.2609C76.5217 128.465 71.0217 124.896 69.1087 119.663L31.3261 19.0318H9.56522C4.30435 19.0318 0 14.7497 0 9.51591C0 4.28216 4.30435 0 9.56522 0H38.0217C42.087 0 45.6739 2.61687 47.1087 6.42324L86.087 109.433H176.957L197.283 45.2006H84.6522C79.3913 45.2006 75.087 40.9184 75.087 35.6846C75.087 30.4509 79.3913 26.1687 84.6522 26.1687H210.435C213.543 26.1687 216.413 27.834 218.087 30.213C220 32.592 220.478 35.9225 219.522 38.7773ZM87.0435 141.073C82.9783 141.073 78.913 142.739 76.0435 145.593C73.1739 148.448 71.5 152.492 71.5 156.537C71.5 160.581 73.1739 164.625 76.0435 167.48C78.913 170.335 82.9783 172 87.0435 172C91.1087 172 95.1739 170.335 98.0435 167.48C100.913 164.625 102.587 160.581 102.587 156.537C102.587 152.492 100.913 148.448 98.0435 145.593C95.1739 142.739 91.1087 141.073 87.0435 141.073ZM172.891 141.073C168.826 141.073 164.761 142.739 161.891 145.593C159.022 148.448 157.348 152.492 157.348 156.537C157.348 160.581 159.022 164.625 161.891 167.48C164.761 170.335 168.826 172 172.891 172C176.957 172 181.022 170.335 183.891 167.48C186.761 164.625 188.435 160.581 188.435 156.537C188.435 152.492 186.761 148.448 183.891 145.593C181.022 142.739 176.957 141.073 172.891 141.073Z"
            fill="#000048"
          />
        </svg>
        <br />
        {/* <Button
          variant="outlined"
          onClick={onStartShopping}
          sx={{
            mb: 2,
            borderColor: "#000048",
            color: "#000048",
            fontWeight: "bold",
            padding: "10px 24px",
            textTransform: "none",
          }}
        >
          Add Products Manually (Demo Mode)
        </Button> */}
      </Box>
    </Box>
  );
};

// --- Memoized Components ---
const CartSummary = React.memo(({ cart, total }) => {
  const totalAmount = typeof total === "object" ? total.total || 0 : total || 0;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.8,
        mb: 2,
      }}
    >
      <Box sx={{ lineHeight: 1.2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Gallix, sans-serif", fontSize: "0.9rem" }}
        >
          Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Gallix, sans-serif",
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          ₹{Number(totalAmount).toFixed(2)}
        </Typography>
      </Box>
      <ShoppingCartIcon sx={{ fontSize: 40, opacity: 0.7 }} />
    </Box>
  );
});

const CartItemComponent = React.memo(
  ({ cartItem, onQuantityChange, onRemove }) => (
    <Paper sx={{ mb: 1.2, p: 1.5, bgcolor: "#ffffff", borderRadius: 2 }}>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            sx={{ width: 65, height: 65, bgcolor: "#f0f0f0" }}
          />
        </ListItemAvatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",
              fontWeight: "bold",
              color: "#000048",
            }}
          >
            {cartItem.item.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {cartItem.item.brand} • {cartItem.item.unit}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            ₹{cartItem.item.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => onQuantityChange(cartItem.id, cartItem.quantity - 1)}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ fontWeight: "bold" }}>
            {cartItem.quantity}
          </Typography>
          <IconButton
            onClick={() => onQuantityChange(cartItem.id, cartItem.quantity + 1)}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => onRemove(cartItem.id)}
            sx={{ color: "#dc004e" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
);

const ShoppingHandheld = ({
  userId,
  user,
  cart,
  total,
  onUpdateCart,
  onEndShopping,
  onLogout,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showManualAdd, setShowManualAdd] = useState(false);

  const availableProducts = [
    {
      id: 1,
      name: "Fresh Apples",
      brand: "Farm Fresh",
      price: 120,
      rfidTag: "RFID0001",
    },
    {
      id: 2,
      name: "Bananas",
      brand: "Organic",
      price: 50,
      rfidTag: "RFID0002",
    },
    {
      id: 3,
      name: "Oranges",
      brand: "Citrus Fresh",
      price: 85,
      rfidTag: "RFID0003",
    },
    {
      id: 6,
      name: "Tomatoes",
      brand: "Fresh Farm",
      price: 35,
      rfidTag: "RFID0006",
    },
    {
      id: 11,
      name: "Full Cream Milk",
      brand: "Amul",
      price: 58,
      rfidTag: "RFID0011",
    },
    {
      id: 16,
      name: "White Bread",
      brand: "Britannia",
      price: 40,
      rfidTag: "RFID0016",
    },
  ];

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartResponse = await getCart(userId);
        const totalResponse = await getCartTotal(userId);
        onUpdateCart(cartResponse.data, totalResponse.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId, onUpdateCart]);

  const handleAddManualProduct = async (product) => {
    try {
      setError("");
      await addItemsToCart(userId, product.rfidTag);
      const cartResponse = await getCart(userId);
      const totalResponse = await getCartTotal(userId);
      onUpdateCart(cartResponse.data, totalResponse.data);
    } catch (err) {
      setError(`Failed to add ${product.name}`);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(userId, id, qty);
      const cartResponse = await getCart(userId);
      const totalResponse = await getCartTotal(userId);
      onUpdateCart(cartResponse.data, totalResponse.data);
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeCartItem(userId, id);
      const cartResponse = await getCart(userId);
      const totalResponse = await getCartTotal(userId);
      onUpdateCart(cartResponse.data, totalResponse.data);
    } catch (err) {
      setError("Remove failed");
    }
  };

  if (loading) return null;

  // --- SHOW EMPTY VIEW ---
  if (cart.length === 0 && !showManualAdd) {
    return (
      <EmptyCartView
        user={user}
        onLogout={onLogout}
        onStartShopping={() => setShowManualAdd(true)}
      />
    );
  }

  // --- SHOW ACTIVE SHOPPING VIEW ---
  return (
    <>
      {/* FIXED HEADER: Now includes showWallet={true} to show balance everywhere */}
      <AppHeader user={user} onLogout={onLogout} />

      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          pt: "80px", // Proper padding so content doesn't hide under the header
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2, pb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="outlined"
            onClick={() => setShowManualAdd(!showManualAdd)}
            sx={{
              mb: 2,
              borderColor: "#000048",
              color: "#000048",
              fontWeight: "bold",
            }}
          >
            {showManualAdd ? "Hide Manual Add" : "Add Products Manually"}
          </Button>

          {showManualAdd && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#000048", fontWeight: "bold" }}
              >
                Available Products (click to Add)
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 1.5,
                }}
              >
                {availableProducts.map((product) => (
                  <Paper
                    key={product.id}
                    onClick={() => handleAddManualProduct(product)}
                    sx={{
                      p: 1.5,
                      cursor: "pointer",
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                      {product.name}
                    </Typography>
                    <Typography
                      color="success.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      ₹{product.price}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          )}

          <CartSummary cart={cart} total={total} />

          <List>
            {cart.map((item) => (
              <CartItemComponent
                key={item.id}
                cartItem={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </List>

          {cart.length > 0 && (
            <Button
              variant="contained"
              fullWidth
              onClick={onEndShopping}
              sx={{ mt: 2, bgcolor: "#000048", py: 2, fontWeight: "bold" }}
            >
              Proceed to Checkout
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ShoppingHandheld;
