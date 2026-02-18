import React, { useState } from "react";
import {
  AppBar,
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
 
const AppHeader = ({ user, showWallet }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
 
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 
  // Updated handleLogout to call the backend endpoint
  const handleLogout = async () => {
    try {
      // Extract userId from the user prop or localStorage
      const userId = user?.userId || user?.id || JSON.parse(localStorage.getItem("user"))?.userId;
 
      if (userId) {
        // Call the Spring Boot backend to set status to 'n'
        await fetch(process.env.REACT_APP_API_BASE || `${window.location.origin}/login/api/auth/logout/${userId}`, {
          
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      // This block runs regardless of whether the fetch succeeded or failed
      localStorage.clear();
      sessionStorage.clear();
      handleClose();
 
      window.location.href = "/login";
    }
  };
 
  const handleContinueShopping = () => {
    handleClose();
    navigate("/products");
  };
 
  const LogoutIconSVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
    </svg>
  );
 
  const CloseIconSVG = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z" fill="currentColor"/>
    </svg>
  );
 
  return (
    <>
      <AppBar position="fixed" sx={{ width: "100%", height: "60px", bgcolor: "#000048", top: 0, left: 0, zIndex: 1100, boxShadow: "none", display: "flex", flexDirection: "row", alignItems: "center", px: 2 }}>
        <Box component="img" src="/logo/smartpayLogo.png" sx={{ width: 207, height: 138, position: "absolute", top: -38, left: -3 }} />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Button
            onClick={handleOpen}
            startIcon={<Box sx={{ display: 'flex' }}>{LogoutIconSVG}</Box>}
            sx={{ color: "#FFFFFF", textTransform: "none", fontFamily: "Gallix, sans-serif", fontSize: "18px", fontWeight: 500 }}
          >
            Logout
          </Button>
        </Box>
      </AppBar>
 
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: "8px", width: "766px", maxWidth: "90vw", background: "#FFFFFF", padding: "24px" }
        }}
      >
        {/* Header Row: Icon + Title + Close Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Circle Logout Icon */}
            <Box sx={{
              width: 44, height: 44, bgcolor: "#000048", borderRadius: "50%",
              display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0
            }}>
              <Box sx={{ color: '#FFFFFF', display: 'flex' }}>
                {LogoutIconSVG}
              </Box>
            </Box>
 
            {/* Title Text */}
            <Typography sx={{
              fontFamily: "Gallix, sans-serif", fontWeight: 500, fontSize: "24px", color: "#000048",
              letterSpacing: "-3%", lineHeight: "100%"
            }}>
              Are you sure you want to log out?
            </Typography>
          </Box>
 
          {/* Close Icon Button */}
          <IconButton onClick={handleClose} sx={{ color: "#000048", p: 0 }}>
            {CloseIconSVG}
          </IconButton>
        </Box>
 
        {/* Horizontal Line Divider */}
        <Box sx={{
            width: "718px",
            height: "0px",
            border: "1px solid #000048",
            mb: "24px",
            opacity: 1
        }} />
 
        <DialogContent sx={{ p: 0 }}>
          {/* Description Text */}
          <Typography sx={{
            fontFamily: "Gallix, sans-serif", fontWeight: 400, fontSize: "17px", color: "#000048",
            lineHeight: "100%", letterSpacing: "-3%", mb: "32px"
          }}>
            You’ll need to log in again to complete your purchase.
          </Typography>
 
          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-start" }}>
            <Button
              variant="outlined"
              onClick={handleContinueShopping}
              sx={{
                width: 276, height: 56, borderRadius: "8px", borderColor: "#000048",
                color: "#000048", textTransform: "none", fontFamily: "Gallix, sans-serif",
                fontWeight: 600, fontSize: "20px", letterSpacing: "-3%", ml:'50px'
              }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                width: 276, height: 56, borderRadius: "8px", bgcolor: "#000048", ml:'40px',
                color: "white", textTransform: "none", fontFamily: "Gallix, sans-serif",
                fontWeight: 600, fontSize: "20px", letterSpacing: "-3%",
                "&:hover": { bgcolor: "#000030" }
              }}
            >
              Logout
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
 
export default AppHeader;